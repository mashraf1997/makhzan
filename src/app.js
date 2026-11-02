// Makhzan server: inventory and a point-of-sale screen for shops. Products with barcodes, sales with
// receipts, receiving stock, stock counts, low-stock alerts, returns, profit and reports.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { hashPassword, verifyPassword, createSession, checkSession, parseCookies, RateLimiter } from './auth.js';
import { send, readJson, readBody, clientIp, serveStatic, cookie, VERSION } from './http.js';
import { demoConfig, resetData } from './demo-mode.js';
import { buildDemo } from './demo-data.js';
import { barcodeSvg } from './code128.js';

export function defaultData(lang = 'ar') {
  return {
    version: 1,
    meta: { secret: crypto.randomBytes(32).toString('hex'), createdAt: new Date().toISOString() },
    admin: null,
    settings: {
      businessName: '', phone: '', address: '', lang, currency: lang === 'ar' ? 'جنيه' : 'USD', timezone: '',
      taxRate: 0, taxIncluded: true, // prices already include tax by default
      footer: lang === 'ar' ? 'شكراً لزيارتكم 🌟 الاستبدال خلال 14 يوم بالفاتورة.' : 'Thank you for shopping with us 🌟 Exchanges within 14 days with this receipt.',
      categories: lang === 'ar' ? ['عام'] : ['General'],
      units: lang === 'ar' ? ['قطعة', 'كيلو', 'علبة', 'كرتونة'] : ['piece', 'kg', 'box', 'carton'],
      nextSale: 1, staffPin: '', allowNegative: false,
      webhookUrl: '', // each sale is sent here (Raseed's order hook works)
      hookKey: crypto.randomBytes(12).toString('hex'), // /hooks/order: online orders from Dukkan reduce stock
    },
    products: [], // { id, name, sku, barcode, category, unit, price, cost, stock, minStock, active, createdAt }
    sales: [], // { id, no, items: [{ productId, name, qty, price, cost }], subtotal, discount, tax, total, method, paid, change, customer, by, at, refunded, refundedAt }
    moves: [], // { id, productId, type: sale|purchase|adjust|return|online, qty, cost, note, ref, by, at }
    processedOrders: [],
  };
}

const clean = (s, n = 200) => String(s ?? '').trim().slice(0, n);
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const round3 = (n) => Math.round((Number(n) || 0) * 1000) / 1000;
const isUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:'; } catch { return false; } };
export const normDigits = (s) => String(s || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',' || c === ';' || c === '\t') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

export function createApp({ dataDir, setupToken = process.env.SETUP_TOKEN || '', env = process.env } = {}) {
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'makhzan.json');
  const def = defaultData();
  const loaded = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  const data = loaded ? { ...def, ...loaded, settings: { ...def.settings, ...loaded.settings } } : def;
  let timer;
  const flush = () => { clearTimeout(timer); fs.writeFileSync(file + '.tmp', JSON.stringify(data)); fs.renameSync(file + '.tmp', file); };
  const save = () => { clearTimeout(timer); timer = setTimeout(flush, 200); };
  flush();
  const demo = demoConfig(env);
  const resetDemo = () => { resetData(data, () => buildDemo(demo), demo); flush(); };
  let demoTimer = null;
  if (demo) { resetDemo(); demoTimer = setInterval(resetDemo, demo.resetMinutes * 60_000); demoTimer.unref?.(); }

  const tz = () => data.settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const dayOf = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: tz() }).format(new Date(iso));
  const today = () => dayOf(new Date().toISOString());
  const loginLimiter = new RateLimiter(10, 15 * 60_000);
  const pinHash = () => (data.settings.staffPin ? crypto.createHash('sha256').update(data.settings.staffPin + data.meta.secret).digest('hex') : null);
  const hashFor = (uid) => (uid === 'owner' ? data.admin?.hash : uid === 'staff' ? pinHash() : null);
  const whoIs = (req) => checkSession(data.meta.secret, parseCookies(req.headers.cookie).makhzan_session, hashFor);
  const newSession = (req, uid) => cookie(req, 'makhzan_session', createSession(data.meta.secret, hashFor(uid), uid), uid === 'owner' ? 30 * 86400 : 14 * 86400);

  const product = (id) => data.products.find((p) => p.id === id);
  const byCode = (code) => { const c = normDigits(code).trim(); return c ? data.products.find((p) => p.active !== false && (p.barcode === c || p.sku.toLowerCase() === c.toLowerCase())) : null; };
  const low = (p) => p.active !== false && p.minStock > 0 && p.stock <= p.minStock;

  function move(p, type, qty, { cost = p.cost, note = '', ref = '', by = '' } = {}) {
    p.stock = round3(p.stock + qty);
    data.moves.push({ id: crypto.randomUUID(), productId: p.id, type, qty: round3(qty), cost: round2(cost), note: clean(note, 200), ref, by, at: new Date().toISOString() });
    if (data.moves.length > 200_000) data.moves.splice(0, 20_000);
  }

  function totalsFor(items, discount) {
    const s = data.settings;
    const subtotal = round2(items.reduce((x, i) => x + i.qty * i.price, 0));
    const disc = Math.min(subtotal, Math.max(0, round2(discount)));
    const rate = Number(s.taxRate) || 0;
    const base = subtotal - disc;
    const tax = round2(s.taxIncluded ? base - base / (1 + rate / 100) : (base * rate) / 100);
    const total = round2(s.taxIncluded ? base : base + tax);
    return { subtotal, discount: disc, tax, total };
  }

  function sell(b, by) {
    const s = data.settings;
    const lines = [];
    for (const it of Array.isArray(b.items) ? b.items : []) {
      const p = product(it.productId);
      const qty = round3(it.qty);
      if (!p || !(qty > 0)) return { error: 'Unknown product or quantity' };
      if (!s.allowNegative && p.stock < qty) return { error: `Not enough stock: ${p.name} (${p.stock})`, code: 'stock', productId: p.id };
      const price = it.price != null && by === 'owner' ? Math.max(0, round2(it.price)) : p.price;
      lines.push({ productId: p.id, name: p.name, qty, price, cost: p.cost });
    }
    if (!lines.length) return { error: 'The cart is empty' };
    const t = totalsFor(lines, b.discount);
    const method = ['cash', 'card', 'wallet', 'credit'].includes(b.method) ? b.method : 'cash';
    const paid = method === 'cash' ? Math.max(t.total, round2(b.paid ?? t.total)) : t.total;
    const sale = { id: crypto.randomUUID(), no: s.nextSale++, items: lines, ...t, method, paid, change: round2(paid - t.total), customer: clean(b.customer, 80), by, at: new Date().toISOString(), refunded: false, refundedAt: null };
    for (const l of lines) move(product(l.productId), 'sale', -l.qty, { cost: l.cost, ref: String(sale.no), by });
    data.sales.push(sale);
    save();
    if (s.webhookUrl) fetch(s.webhookUrl, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event: 'order.paid', order: { no: `POS-${sale.no}`, total: sale.total, customer: { name: sale.customer }, items: lines.map((l) => ({ name: l.name, price: l.price, qty: l.qty })) } }), signal: AbortSignal.timeout(8000) }).catch(() => {});
    return { sale };
  }

  function report(from, to) {
    const sales = data.sales.filter((x) => !x.refunded && dayOf(x.at) >= from && dayOf(x.at) <= to);
    const revenue = round2(sales.reduce((s, x) => s + x.total, 0));
    const cogs = round2(sales.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty * i.cost, 0), 0));
    const byProduct = {};
    for (const x of sales) for (const i of x.items) { byProduct[i.productId] ||= { name: i.name, qty: 0, revenue: 0, profit: 0 }; const r = byProduct[i.productId]; r.qty = round3(r.qty + i.qty); r.revenue = round2(r.revenue + i.qty * i.price); r.profit = round2(r.profit + i.qty * (i.price - i.cost)); }
    const byCat = {};
    for (const x of sales) for (const i of x.items) { const c = product(i.productId)?.category || '—'; byCat[c] = round2((byCat[c] || 0) + i.qty * i.price); }
    const byMethod = {};
    for (const x of sales) byMethod[x.method] = round2((byMethod[x.method] || 0) + x.total);
    const hours = Array.from({ length: 24 }, () => 0);
    for (const x of sales) hours[Number(new Intl.DateTimeFormat('en-GB', { timeZone: tz(), hour: '2-digit', hourCycle: 'h23' }).format(new Date(x.at)))] += x.total;
    return {
      from, to, count: sales.length, revenue, cogs, profit: round2(revenue - cogs), avgTicket: sales.length ? round2(revenue / sales.length) : 0,
      discounts: round2(sales.reduce((s, x) => s + x.discount, 0)), tax: round2(sales.reduce((s, x) => s + x.tax, 0)),
      top: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      byCategory: Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ k, v })),
      byMethod: Object.entries(byMethod).map(([k, v]) => ({ k, v })),
      hours: hours.map(round2),
      refunds: data.sales.filter((x) => x.refunded && x.refundedAt && dayOf(x.refundedAt) >= from && dayOf(x.refundedAt) <= to).length,
    };
  }

  async function route(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname;
    const method = req.method;
    if (p === '/health') return send(res, 200, { ok: true, version: VERSION });
    if (method === 'GET') {
      if (p === '/' || p === '/index.html') return serveStatic(res, 'index.html');
      if (/^\/[\w.-]+\.(js|css|svg|png|ico)$/.test(p)) return serveStatic(res, p.slice(1));
    }

    // Online orders (Dukkan, Wakeel) take items out of stock, matched by SKU, barcode or exact name.
    if (p === '/hooks/order' && method === 'POST') {
      const key = Buffer.from(url.searchParams.get('key') || '');
      const want = Buffer.from(data.settings.hookKey);
      if (key.length !== want.length || !crypto.timingSafeEqual(key, want)) return send(res, 403, { error: 'bad_key' });
      const body = await readJson(req);
      if (body.event && !/order/.test(body.event)) return send(res, 200, { updated: 0, reason: 'not_an_order' });
      const o = body.request || body.order || body;
      const ref = String(o.id || o.no || o.reference || '');
      if (ref && data.processedOrders.includes(ref)) return send(res, 200, { updated: 0, reason: 'duplicate' });
      let n = 0;
      const missing = [];
      for (const it of Array.isArray(o.items) ? o.items : []) {
        const name = String(it.name || '').trim();
        const pr = byCode(it.sku || it.barcode || '') || data.products.find((x) => x.active !== false && x.name === name);
        const qty = Number(it.quantity ?? it.qty) || 1;
        if (!pr) { missing.push(name); continue; }
        move(pr, 'online', -qty, { ref: `#${ref}`, by: 'hook' });
        n += 1;
      }
      if (ref) { data.processedOrders.push(ref); if (data.processedOrders.length > 5000) data.processedOrders.splice(0, 1000); }
      save();
      return send(res, 200, { updated: n, missing });
    }

    if (demo && method === 'POST' && (p === '/api/setup' || p === '/api/password')) return send(res, 403, { error: 'Not available in the demo' });
    if (p === '/api/session' && method === 'GET') { const who = whoIs(req); return send(res, 200, { needsSetup: !data.admin, authed: Boolean(who), role: who, staffEnabled: Boolean(data.settings.staffPin), setupTokenRequired: Boolean(setupToken), version: VERSION, demo: demo ? { password: demo.password, resetMinutes: demo.resetMinutes } : null }); }
    if (p === '/api/setup' && method === 'POST') {
      if (data.admin) return send(res, 409, { error: 'Already set up' });
      const b = await readJson(req);
      if (setupToken && b.setupToken !== setupToken) return send(res, 403, { error: 'Wrong setup token' });
      if (String(b.password || '').length < 8) return send(res, 400, { error: 'Password must be at least 8 characters' });
      const lang = b.lang === 'en' ? 'en' : 'ar';
      Object.assign(data.settings, defaultData(lang).settings, { hookKey: data.settings.hookKey, businessName: clean(b.businessName, 80), timezone: clean(b.timezone, 60) });
      data.admin = hashPassword(String(b.password));
      flush();
      return send(res, 200, { ok: true }, { 'set-cookie': newSession(req, 'owner') });
    }
    if (p === '/api/login' && method === 'POST') {
      if (!loginLimiter.allow(clientIp(req))) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
      const b = await readJson(req);
      const pw = String(b.password || '');
      if (verifyPassword(pw, data.admin)) return send(res, 200, { ok: true, role: 'owner' }, { 'set-cookie': newSession(req, 'owner') });
      const pin = data.settings.staffPin;
      if (pin && pw.length === pin.length && crypto.timingSafeEqual(Buffer.from(pw), Buffer.from(pin))) return send(res, 200, { ok: true, role: 'staff' }, { 'set-cookie': newSession(req, 'staff') });
      return send(res, 401, { error: 'Wrong password' });
    }
    if (p === '/api/logout' && method === 'POST') return send(res, 200, { ok: true }, { 'set-cookie': cookie(req, 'makhzan_session', '', 0) });
    if (p.startsWith('/api/')) {
      const who = whoIs(req);
      if (!who) return send(res, 401, { error: 'Not signed in' });
      if (method === 'GET' && p === '/api/barcode.svg') {
        const svg = barcodeSvg(url.searchParams.get('code') || '');
        return svg ? send(res, 200, svg, { 'content-type': 'image/svg+xml', 'cache-control': 'private, max-age=86400' }) : send(res, 400, 'Use letters and digits');
      }
      if (p === '/api/products/import' && method === 'POST') {
        if (who !== 'owner') return send(res, 403, { error: 'Only the owner can do this' });
        return importCsv(req, res, who);
      }
      if (method !== 'GET' && !(req.headers['content-type'] || '').includes('application/json')) return send(res, 415, { error: 'Send JSON' });
      return api(req, res, url, p, method, who);
    }
    return send(res, 404, 'Not found');
  }

  async function importCsv(req, res, who) {
    // Columns (by header name, Arabic or English): name, barcode, sku, category, unit, price, cost, stock, min
    const rows = parseCsv((await readBody(req, 5 * 1024 * 1024)).toString('utf8').replace(/^﻿/, ''));
    if (rows.length < 2) return send(res, 400, { error: 'The file needs a header row and at least one product' });
    const alias = { name: ['name', 'الاسم', 'المنتج', 'الصنف'], barcode: ['barcode', 'الباركود'], sku: ['sku', 'code', 'الكود'], category: ['category', 'القسم', 'الفئة'], unit: ['unit', 'الوحدة'], price: ['price', 'السعر', 'سعر البيع'], cost: ['cost', 'التكلفة', 'سعر الشراء'], stock: ['stock', 'qty', 'quantity', 'الكمية', 'الرصيد'], min: ['min', 'minstock', 'الحد الأدنى'] };
    const head = rows[0].map((h) => h.trim().toLowerCase());
    const col = Object.fromEntries(Object.entries(alias).map(([k, names]) => [k, head.findIndex((h) => names.includes(h))]));
    if (col.name < 0) return send(res, 400, { error: 'No name column' });
    let created = 0, updated = 0;
    for (const r of rows.slice(1)) {
      const v = (k) => (col[k] >= 0 ? normDigits(r[col[k]] ?? '').trim() : '');
      const name = clean(r[col.name], 120);
      if (!name) continue;
      let pr = (v('barcode') && data.products.find((x) => x.barcode === v('barcode'))) || (v('sku') && data.products.find((x) => x.sku === v('sku'))) || data.products.find((x) => x.name === name);
      const fields = { name, barcode: v('barcode'), sku: v('sku'), category: v('category'), unit: v('unit'), price: v('price'), cost: v('cost'), minStock: v('min') };
      if (!pr) { pr = newProduct(); data.products.push(pr); created++; } else updated++;
      applyProduct(pr, Object.fromEntries(Object.entries(fields).filter(([, x]) => x !== '')));
      if (v('stock') !== '') { const target = round3(v('stock')); if (target !== pr.stock) move(pr, 'adjust', target - pr.stock, { note: 'CSV import', by: who }); }
    }
    save();
    return send(res, 200, { created, updated });
  }

  const newProduct = () => ({ id: crypto.randomUUID(), name: '', sku: '', barcode: '', category: data.settings.categories[0] || '', unit: data.settings.units[0] || '', price: 0, cost: 0, stock: 0, minStock: 0, active: true, createdAt: new Date().toISOString() });
  function applyProduct(pr, b) {
    if (typeof b.name === 'string') pr.name = clean(b.name, 120);
    for (const k of ['sku', 'barcode']) if (b[k] !== undefined) pr[k] = clean(normDigits(b[k]), 40);
    for (const k of ['category', 'unit']) if (typeof b[k] === 'string' && b[k].trim()) { pr[k] = clean(b[k], 40); const list = k === 'category' ? data.settings.categories : data.settings.units; if (!list.includes(pr[k])) list.push(pr[k]); }
    for (const k of ['price', 'cost']) if (b[k] != null && b[k] !== '') pr[k] = Math.max(0, round2(normDigits(b[k])));
    if (b.minStock != null && b.minStock !== '') pr.minStock = Math.max(0, round3(normDigits(b.minStock)));
    if (typeof b.active === 'boolean') pr.active = b.active;
    if (!pr.name) return 'Product name is required';
    if (pr.barcode && data.products.some((x) => x.id !== pr.id && x.barcode === pr.barcode)) return 'Another product has this barcode';
    return null;
  }

  async function api(req, res, url, p, method, who) {
    const s = data.settings;
    const owner = who === 'owner';
    const ownerOnly = () => send(res, 403, { error: 'Only the owner can do this' });
    let m;
    if (p === '/api/basics' && method === 'GET') return send(res, 200, { role: who, businessName: s.businessName, phone: s.phone, address: s.address, currency: s.currency, categories: s.categories, units: s.units, footer: s.footer, taxRate: s.taxRate, taxIncluded: s.taxIncluded, allowNegative: s.allowNegative, lang: s.lang });

    // ----- products -----
    if (p === '/api/products' && method === 'GET') {
      const q = clean(url.searchParams.get('q'), 80).toLowerCase();
      let list = data.products.filter((x) => url.searchParams.get('all') ? true : x.active !== false);
      if (q) list = list.filter((x) => x.name.toLowerCase().includes(q) || x.barcode.includes(q) || x.sku.toLowerCase().includes(q));
      if (url.searchParams.get('low')) list = list.filter(low);
      return send(res, 200, { products: list.sort((a, b) => a.name.localeCompare(b.name)).map((x) => ({ ...x, low: low(x), cost: owner ? x.cost : undefined })) });
    }
    if (p === '/api/scan' && method === 'GET') {
      const pr = byCode(url.searchParams.get('code'));
      return pr ? send(res, 200, { product: { ...pr, cost: owner ? pr.cost : undefined } }) : send(res, 404, { error: 'not_found' });
    }
    if (p === '/api/products' && method === 'POST') {
      if (!owner) return ownerOnly();
      const b = await readJson(req);
      const pr = newProduct();
      const err = applyProduct(pr, b);
      if (err) return send(res, 400, { error: err });
      data.products.push(pr);
      if (Number(b.stock) > 0) move(pr, 'purchase', round3(b.stock), { cost: pr.cost, note: 'Opening stock', by: who });
      save();
      return send(res, 200, { product: pr });
    }
    if ((m = p.match(/^\/api\/products\/([\w-]+)$/))) {
      const pr = product(m[1]);
      if (!pr) return send(res, 404, { error: 'Not found' });
      if (method === 'GET') return send(res, 200, { product: pr, moves: data.moves.filter((x) => x.productId === pr.id).slice(-100).reverse() });
      if (!owner) return ownerOnly();
      if (method === 'PUT') { const err = applyProduct(pr, await readJson(req)); if (err) return send(res, 400, { error: err }); save(); return send(res, 200, { product: pr }); }
      if (method === 'DELETE') { pr.active = false; save(); return send(res, 200, { ok: true }); }
    }
    if (p === '/api/stock/receive' && method === 'POST') {
      // Goods in from a supplier: adds stock and updates the average cost.
      const b = await readJson(req);
      const lines = Array.isArray(b.items) ? b.items : [];
      for (const it of lines) {
        const pr = product(it.productId);
        const qty = round3(it.qty);
        if (!pr || !(qty > 0)) return send(res, 400, { error: 'Unknown product or quantity' });
        const cost = it.cost != null && it.cost !== '' ? Math.max(0, round2(it.cost)) : pr.cost;
        const before = Math.max(0, pr.stock);
        pr.cost = before + qty > 0 ? round2((before * pr.cost + qty * cost) / (before + qty)) : cost;
        move(pr, 'purchase', qty, { cost, note: clean(b.supplier, 80), ref: clean(b.ref, 40), by: who });
      }
      save();
      return send(res, 200, { ok: true, count: lines.length });
    }
    if (p === '/api/stock/count' && method === 'POST') {
      // A stock count: sets the real quantity and records the difference.
      const b = await readJson(req);
      for (const it of Array.isArray(b.items) ? b.items : []) {
        const pr = product(it.productId);
        if (!pr || it.qty === '' || it.qty == null) continue;
        const diff = round3(Number(it.qty) - pr.stock);
        if (diff) move(pr, 'adjust', diff, { note: clean(b.note, 120) || 'Stock count', by: who });
      }
      save();
      return send(res, 200, { ok: true });
    }

    // ----- sales -----
    if (p === '/api/quote' && method === 'POST') { const b = await readJson(req); const lines = (b.items || []).map((i) => { const pr = product(i.productId); return pr ? { qty: round3(i.qty), price: i.price != null && owner ? round2(i.price) : pr.price } : null; }).filter(Boolean); return send(res, 200, totalsFor(lines, b.discount)); }
    if (p === '/api/sales' && method === 'POST') {
      const b = await readJson(req);
      const r = sell(b, who);
      return r.error ? send(res, 400, r) : send(res, 200, r);
    }
    if (p === '/api/sales' && method === 'GET') {
      const day = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('day') || '') ? url.searchParams.get('day') : today();
      const list = data.sales.filter((x) => dayOf(x.at) === day).sort((a, b) => b.at.localeCompare(a.at));
      const live = list.filter((x) => !x.refunded);
      return send(res, 200, { day, sales: list, totals: { count: live.length, total: round2(live.reduce((a, x) => a + x.total, 0)), cash: round2(live.filter((x) => x.method === 'cash').reduce((a, x) => a + x.total, 0)) } });
    }
    if ((m = p.match(/^\/api\/sales\/(\d+)$/)) && method === 'GET') { const x = data.sales.find((y) => y.no === Number(m[1])); return x ? send(res, 200, { sale: x }) : send(res, 404, { error: 'Not found' }); }
    if ((m = p.match(/^\/api\/sales\/(\d+)\/refund$/)) && method === 'POST') {
      if (!owner) return ownerOnly();
      const x = data.sales.find((y) => y.no === Number(m[1]));
      if (!x) return send(res, 404, { error: 'Not found' });
      if (x.refunded) return send(res, 409, { error: 'Already returned' });
      for (const l of x.items) { const pr = product(l.productId); if (pr) move(pr, 'return', l.qty, { cost: l.cost, ref: String(x.no), by: who }); }
      x.refunded = true;
      x.refundedAt = new Date().toISOString();
      save();
      return send(res, 200, { sale: x });
    }

    // ----- reports (owner) -----
    if (p === '/api/overview' && method === 'GET') {
      if (!owner) return ownerOnly();
      const t = today();
      const days = [...Array(30)].map((_, i) => dayOf(new Date(Date.now() - (29 - i) * 864e5).toISOString()));
      const per = Object.fromEntries(days.map((d) => [d, 0]));
      for (const x of data.sales) if (!x.refunded) { const d = dayOf(x.at); if (d in per) per[d] = round2(per[d] + x.total); }
      const active = data.products.filter((x) => x.active !== false);
      return send(res, 200, {
        today: report(t, t), month: report(t.slice(0, 8) + '01', t),
        perDay: days.map((d) => ({ day: d, total: per[d] })),
        stockValue: round2(active.reduce((a, x) => a + Math.max(0, x.stock) * x.cost, 0)), retailValue: round2(active.reduce((a, x) => a + Math.max(0, x.stock) * x.price, 0)),
        products: active.length, low: active.filter(low).sort((a, b) => a.stock - b.stock).slice(0, 12), out: active.filter((x) => x.stock <= 0).length,
      });
    }
    if (p === '/api/report' && method === 'GET') {
      if (!owner) return ownerOnly();
      const from = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('from') || '') ? url.searchParams.get('from') : today().slice(0, 8) + '01';
      const to = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('to') || '') ? url.searchParams.get('to') : today();
      return send(res, 200, report(from, to));
    }
    if (p === '/api/products.csv' && method === 'GET') {
      if (!owner) return ownerOnly();
      const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = [['name', 'barcode', 'sku', 'category', 'unit', 'price', 'cost', 'stock', 'min'].join(',')];
      for (const x of data.products.filter((y) => y.active !== false)) rows.push([x.name, x.barcode, x.sku, x.category, x.unit, x.price, x.cost, x.stock, x.minStock].map(q).join(','));
      return send(res, 200, '﻿' + rows.join('\n'), { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="makhzan-products.csv"' });
    }
    if (p === '/api/sales.csv' && method === 'GET') {
      if (!owner) return ownerOnly();
      const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const rows = [['no', 'date', 'items', 'subtotal', 'discount', 'tax', 'total', 'method', 'cashier', 'returned'].join(',')];
      for (const x of data.sales) rows.push([x.no, x.at, x.items.map((i) => `${i.name} x${i.qty}`).join(' | '), x.subtotal, x.discount, x.tax, x.total, x.method, x.by, x.refunded ? 'yes' : ''].map(q).join(','));
      return send(res, 200, '﻿' + rows.join('\n'), { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="makhzan-sales.csv"' });
    }

    if (p === '/api/settings' && method === 'GET') { if (!owner) return ownerOnly(); return send(res, 200, { settings: s }); }
    if (p === '/api/settings' && method === 'PUT') {
      if (!owner) return ownerOnly();
      const b = (await readJson(req)).settings || {};
      for (const k of ['businessName', 'phone', 'currency', 'timezone']) if (typeof b[k] === 'string') s[k] = clean(b[k], 80);
      for (const k of ['address', 'footer']) if (typeof b[k] === 'string') s[k] = clean(b[k], 400);
      if (b.lang === 'ar' || b.lang === 'en') s.lang = b.lang;
      if (b.taxRate != null) s.taxRate = Math.min(50, Math.max(0, Number(b.taxRate) || 0));
      for (const k of ['taxIncluded', 'allowNegative']) if (typeof b[k] === 'boolean') s[k] = b[k];
      for (const k of ['categories', 'units']) if (Array.isArray(b[k])) { const list = [...new Set(b[k].map((x) => clean(x, 40)).filter(Boolean))].slice(0, 60); if (list.length) s[k] = list; }
      if (!demo) {
        if (b.staffPin !== undefined) { const pin = String(b.staffPin || ''); if (pin && !/^\d{4,8}$/.test(pin)) return send(res, 400, { error: 'Cashier PIN must be 4 to 8 digits' }); s.staffPin = pin; }
        if (typeof b.webhookUrl === 'string') s.webhookUrl = isUrl(b.webhookUrl) ? b.webhookUrl.trim() : '';
      }
      save();
      return send(res, 200, { settings: s });
    }
    if (p === '/api/password' && method === 'POST') {
      if (!owner) return ownerOnly();
      const b = await readJson(req);
      if (!verifyPassword(String(b.current || ''), data.admin)) return send(res, 401, { error: 'Current password is wrong' });
      if (String(b.next || '').length < 8) return send(res, 400, { error: 'New password must be at least 8 characters' });
      data.admin = hashPassword(String(b.next));
      flush();
      return send(res, 200, { ok: true }, { 'set-cookie': newSession(req, 'owner') });
    }
    return send(res, 404, { error: 'Not found' });
  }

  const server = http.createServer((req, res) => {
    route(req, res).catch((err) => {
      const status = err.status || 500;
      if (status === 500) console.error('[http]', err);
      if (!res.headersSent) send(res, status, { error: status === 500 ? 'Internal error' : err.message });
    });
  });
  return {
    resetDemo, server, data,
    async start(port) { await new Promise((r) => server.listen(port, r)); return server.address().port; },
    async stop() { clearInterval(demoTimer); flush(); await new Promise((r) => server.close(r)); },
  };
}
