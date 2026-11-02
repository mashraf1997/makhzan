import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createApp } from '../src/app.js';
import { encode128 } from '../src/code128.js';

let app, base, owner, staff, dataDir, hook, hookCalls = [], milk, tea;

before(async () => {
  hook = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { hookCalls.push(JSON.parse(b)); res.end('{}'); }); });
  await new Promise((r) => hook.listen(0, r));
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'makhzan-'));
  app = createApp({ dataDir, env: {} });
  base = `http://127.0.0.1:${await app.start(0)}`;
});
after(async () => {
  await app.stop();
  await new Promise((r) => hook.close(r));
  fs.rmSync(dataDir, { recursive: true, force: true });
});
async function call(p, { method = 'GET', body, jar, raw } = {}) {
  const res = await fetch(base + p, { method, headers: { ...(body !== undefined ? { 'content-type': 'application/json' } : {}), ...(jar ? { cookie: jar } : {}) }, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, body: json, headers: res.headers };
}
const jarOf = (r) => r.headers.get('set-cookie').split(';')[0];

test('Code 128: known pattern and checksum', () => {
  // "Hi": Start B (211214), H=40 (231113), i=73 (111242)? check = (104 + 40*1 + 73*2) % 103 = 84 → 121241, stop 2331112
  const w = encode128('Hi');
  assert.equal(w.slice(0, 6), '211214');
  assert.equal(w.slice(6, 12), '231113');
  assert.equal(w.slice(-7), '2331112');
  assert.equal(encode128('عربي'), null);
});

test('products: create with opening stock, unique barcodes, CSV import in Arabic', async () => {
  owner = jarOf(await call('/api/setup', { method: 'POST', body: { businessName: 'ماركت الأمانة', password: 'owner-pass-1' } }));
  let r = await call('/api/products', { method: 'POST', jar: owner, body: { name: 'لبن 1 لتر', barcode: '٦٢٢١٠٠١', price: 42, cost: 35, stock: 10, minStock: 3, category: 'ألبان' } });
  milk = r.body.product;
  assert.equal(milk.barcode, '6221001', 'Arabic digits are normalised');
  assert.equal(milk.stock, 10);
  assert.equal((await call('/api/products', { method: 'POST', jar: owner, body: { name: 'x', barcode: '6221001' } })).status, 400);
  const csv = '﻿الاسم,الباركود,القسم,السعر,التكلفة,الكمية,الحد الأدنى\nشاي 250جم,6221002,بقالة,75,62,20,5\n"لبن 1 لتر",6221001,ألبان,45,36,12,3\n';
  r = await call('/api/products/import', { method: 'POST', jar: owner, raw: csv });
  assert.deepEqual(r.body, { created: 1, updated: 1 });
  milk = app.data.products.find((p) => p.id === milk.id);
  assert.equal(milk.price, 45);
  assert.equal(milk.stock, 12);
  tea = app.data.products.find((p) => p.barcode === '6221002');
  assert.ok(app.data.settings.categories.includes('بقالة'));
});

test('sale: scan, stock check, receipt totals, change, webhook to the cash book', async () => {
  await call('/api/settings', { method: 'PUT', jar: owner, body: { settings: { webhookUrl: `http://127.0.0.1:${hook.address().port}/hooks/order?key=x`, staffPin: '1357' } } });
  staff = jarOf(await call('/api/login', { method: 'POST', body: { password: '1357' } }));
  assert.equal((await call('/api/scan?code=6221002', { jar: staff })).body.product.name, 'شاي 250جم');
  assert.equal((await call('/api/scan?code=6221002', { jar: staff })).body.product.cost, undefined, 'cashiers do not see costs');
  let r = await call('/api/sales', { method: 'POST', jar: staff, body: { items: [{ productId: milk.id, qty: 13 }] } });
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'stock');
  r = await call('/api/sales', { method: 'POST', jar: staff, body: { items: [{ productId: milk.id, qty: 2 }, { productId: tea.id, qty: 1, price: 1 }], discount: 5, method: 'cash', paid: 200 } });
  const sale = r.body.sale;
  assert.equal(sale.no, 1);
  assert.equal(sale.items[1].price, 75, 'cashiers cannot change prices');
  assert.equal(sale.total, 160);
  assert.equal(sale.change, 40);
  assert.equal(app.data.products.find((p) => p.id === milk.id).stock, 10);
  await new Promise((res) => setTimeout(res, 100));
  assert.equal(hookCalls[0].order.total, 160);
});

test('tax added on top; receive stock updates average cost; stock count; low stock', async () => {
  await call('/api/settings', { method: 'PUT', jar: owner, body: { settings: { taxRate: 14, taxIncluded: false } } });
  const q = await call('/api/quote', { method: 'POST', jar: owner, body: { items: [{ productId: tea.id, qty: 2 }] } });
  assert.deepEqual(q.body, { subtotal: 150, discount: 0, tax: 21, total: 171 });
  await call('/api/settings', { method: 'PUT', jar: owner, body: { settings: { taxRate: 0, taxIncluded: true } } });
  await call('/api/stock/receive', { method: 'POST', jar: staff, body: { supplier: 'جهينة', items: [{ productId: milk.id, qty: 10, cost: 40 }] } });
  milk = app.data.products.find((p) => p.id === milk.id);
  assert.equal(milk.stock, 20);
  assert.equal(milk.cost, 38, '(10 × 36 + 10 × 40) / 20');
  await call('/api/stock/count', { method: 'POST', jar: staff, body: { items: [{ productId: milk.id, qty: 2 }] } });
  const low = await call('/api/products?low=1', { jar: owner });
  assert.deepEqual(low.body.products.map((p) => p.name), ['لبن 1 لتر']);
  const pm = await call('/api/products/' + milk.id, { jar: owner });
  assert.deepEqual(pm.body.moves.slice(0, 3).map((m) => m.type), ['adjust', 'purchase', 'sale']);
});

test('returns, reports, online orders reduce stock, permissions', async () => {
  assert.equal((await call('/api/sales/1/refund', { method: 'POST', jar: staff, body: {} })).status, 403);
  await call('/api/sales/1/refund', { method: 'POST', jar: owner, body: {} });
  assert.equal(app.data.products.find((p) => p.id === tea.id).stock, 20);
  assert.equal((await call('/api/sales/1/refund', { method: 'POST', jar: owner, body: {} })).status, 409);
  const o = await call('/api/overview', { jar: owner });
  assert.equal(o.body.today.revenue, 0, 'the returned sale does not count');
  assert.equal(o.body.today.refunds, 1);
  assert.equal((await call('/api/overview', { jar: staff })).status, 403);
  const key = app.data.settings.hookKey;
  const r = await call('/hooks/order?key=' + key, { method: 'POST', body: { event: 'order.created', order: { no: 77, items: [{ name: 'شاي 250جم', qty: 3 }, { name: 'حاجة مش موجودة', qty: 1 }] } } });
  assert.deepEqual(r.body, { updated: 1, missing: ['حاجة مش موجودة'] });
  assert.equal(app.data.products.find((p) => p.id === tea.id).stock, 17);
  assert.equal((await call('/hooks/order?key=' + key, { method: 'POST', body: { order: { no: 77, items: [] } } })).body.reason, 'duplicate');
  const svg = await fetch(base + '/api/barcode.svg?code=6221002', { headers: { cookie: staff } });
  assert.match(await svg.text(), /<svg/);
  assert.match(await (await fetch(base + '/api/products.csv', { headers: { cookie: owner } })).text(), /6221002/);
});
