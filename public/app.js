/* Makhzan: point of sale and inventory */
(function () {
  'use strict';
  const STR = {
    ar: {
      pos: 'الكاشير', products: 'المنتجات', sales: 'المبيعات', report: 'التقارير', settings: 'الإعدادات', logout: 'خروج', lang: 'English',
      setupTitle: 'أهلاً بيك في مخزن', setupLead: 'كاشير ومخزن لمحلك: باركود من الكاميرا أو الجهاز، فاتورة، مخزون بينقص لوحده، وتنبيه لما حاجة تخلص.', biz: 'اسم المحل', password: 'كلمة السر', pwHint: '8 حروف على الأقل', start: 'ابدأ', loginTitle: 'تسجيل الدخول', login: 'دخول', loginHint: 'الكاشير يدخل بالرقم السري بتاعه.',
      scanPh: 'امسح الباركود أو اكتب اسم المنتج', camera: '📷 كاميرا', camOff: 'المتصفح ده مش بيدعم قراية الباركود بالكاميرا. استخدم قارئ باركود USB أو اكتب الكود.', all: 'الكل', notFound: 'المنتج ده مش موجود', stockLeft: 'باقي', cart: 'الفاتورة', empty: 'امسح أو اختار منتج', discount: 'خصم', subtotal: 'المجموع', tax: 'ضريبة', total: 'الإجمالي', m_cash: 'كاش', m_card: 'كارت', m_wallet: 'محفظة', m_credit: 'آجل', received: 'المدفوع', change: 'الباقي للعميل', customer: 'اسم العميل (اختياري)', payBtn: 'دفع وطباعة', clear: 'مسح', saleDone: 'فاتورة #{n} ✓', receipt: 'فاتورة', cashier: 'الكاشير', noStock: 'مفيش رصيد كفاية',
      name: 'الاسم', barcode: 'الباركود', sku: 'الكود', category: 'القسم', unit: 'الوحدة', price: 'سعر البيع', cost: 'التكلفة', stock: 'الرصيد', minStock: 'الحد الأدنى', addProduct: '+ منتج', save: 'حفظ', saved: 'اتحفظ ✓', close: 'إغلاق', del: 'إيقاف', delQ: 'متأكد؟', lowOnly: 'اللي قرب يخلص بس', search: 'دوّر', importCsv: 'استيراد CSV', importHint: 'أعمدة: الاسم، الباركود، الكود، القسم، الوحدة، السعر، التكلفة، الكمية، الحد الأدنى', imported: 'اتضاف {c} واتحدّث {u}', receive: 'استلام بضاعة', count: 'جرد', labels: 'طباعة ملصقات', supplier: 'المورد', ref: 'رقم الفاتورة', qty: 'الكمية', addLine: '+ صنف', moves: 'حركة المنتج', mv_sale: 'بيع', mv_purchase: 'شراء', mv_adjust: 'تسوية', mv_return: 'مرتجع', mv_online: 'أونلاين', countHint: 'اكتب الكمية الحقيقية اللي على الرف، والفرق هيتسجّل تسوية.', margin: 'هامش', exportCsv: 'تصدير CSV', copies: 'عدد النسخ', print: 'اطبع', lowBadge: 'قرب يخلص', outBadge: 'خلص',
      day: 'اليوم', count2: 'عدد الفواتير', cashTotal: 'كاش في الدرج', refund: 'مرتجع', refunded: 'اترجعت', refundQ: 'ترجّع الفاتورة كلها وتزوّد المخزون؟', reprint: 'إعادة طباعة', items: 'الأصناف', time: 'الوقت', method: 'الدفع', noSales: 'مفيش مبيعات في اليوم ده.',
      today: 'النهارده', month: 'الشهر ده', revenue: 'المبيعات', profit: 'المكسب', avgTicket: 'متوسط الفاتورة', invoices: 'فاتورة', last30: 'المبيعات آخر 30 يوم', top: 'الأكثر مبيعاً', byCat: 'حسب القسم', lowList: 'محتاج تطلبه', stockValue: 'قيمة المخزون بالتكلفة', retail: 'بسعر البيع', outN: 'منتج خلص', from: 'من', to: 'لحد', byHour: 'المبيعات حسب الساعة', byMethod: 'طرق الدفع', refunds: 'مرتجعات',
      general: 'عام', phone: 'التليفون', address: 'العنوان', currency: 'العملة', tz: 'المنطقة الزمنية', taxRate: 'الضريبة %', taxIncluded: 'الأسعار شاملة الضريبة', allowNegative: 'اسمح بالبيع لو الرصيد صفر', footer: 'آخر سطر في الفاتورة', categories: 'الأقسام (سطر لكل قسم)', units: 'الوحدات (سطر لكل وحدة)', staffPin: 'رقم سري للكاشير (فاضي = مقفول)', staffHint: 'الكاشير يبيع ويستلم بضاعة ويجرد. مايشوفش التكلفة ولا التقارير، ومايقدرش يعمل مرتجع.', integrations: 'الربط', webhook: 'ابعت كل فاتورة لـ (مثلاً رابط الطلبات في رصيد)', hook: 'طلبات Dukkan أو Wakeel تنقّص المخزون: حط الرابط ده في إعدادات الـ Webhook', copy: 'نسخ', copied: 'اتنسخ ✓', pwTitle: 'تغيير كلمة السر', current: 'الحالية', next: 'الجديدة', changePw: 'تغيير',
    },
    en: {
      pos: 'Checkout', products: 'Products', sales: 'Sales', report: 'Reports', settings: 'Settings', logout: 'Sign out', lang: 'العربية',
      setupTitle: 'Welcome to Makhzan', setupLead: 'Checkout and stock for your shop: barcodes from a scanner or the camera, receipts, stock that updates itself, and alerts when something runs low.', biz: 'Shop name', password: 'Password', pwHint: 'At least 8 characters', start: 'Get started', loginTitle: 'Sign in', login: 'Sign in', loginHint: 'Cashiers sign in with their PIN.',
      scanPh: 'Scan a barcode or type a product name', camera: '📷 Camera', camOff: 'This browser cannot read barcodes with the camera. Use a USB scanner or type the code.', all: 'All', notFound: 'Product not found', stockLeft: 'left', cart: 'Sale', empty: 'Scan or tap a product', discount: 'Discount', subtotal: 'Subtotal', tax: 'Tax', total: 'Total', m_cash: 'Cash', m_card: 'Card', m_wallet: 'Wallet', m_credit: 'On credit', received: 'Received', change: 'Change', customer: 'Customer name (optional)', payBtn: 'Pay and print', clear: 'Clear', saleDone: 'Sale #{n} ✓', receipt: 'Receipt', cashier: 'Cashier', noStock: 'Not enough stock',
      name: 'Name', barcode: 'Barcode', sku: 'Code', category: 'Category', unit: 'Unit', price: 'Price', cost: 'Cost', stock: 'Stock', minStock: 'Reorder at', addProduct: '+ Product', save: 'Save', saved: 'Saved ✓', close: 'Close', del: 'Deactivate', delQ: 'Are you sure?', lowOnly: 'Running low only', search: 'Search', importCsv: 'Import CSV', importHint: 'Columns: name, barcode, sku, category, unit, price, cost, stock, min', imported: '{c} added, {u} updated', receive: 'Receive stock', count: 'Stock count', labels: 'Print labels', supplier: 'Supplier', ref: 'Invoice no.', qty: 'Qty', addLine: '+ Line', moves: 'Stock history', mv_sale: 'Sale', mv_purchase: 'Purchase', mv_adjust: 'Adjustment', mv_return: 'Return', mv_online: 'Online', countHint: 'Type the real quantity on the shelf; the difference is recorded as an adjustment.', margin: 'Margin', exportCsv: 'Export CSV', copies: 'Copies', print: 'Print', lowBadge: 'Low', outBadge: 'Out',
      day: 'Day', count2: 'Sales', cashTotal: 'Cash in drawer', refund: 'Return', refunded: 'Returned', refundQ: 'Return the whole sale and put the items back in stock?', reprint: 'Reprint', items: 'Items', time: 'Time', method: 'Payment', noSales: 'No sales on this day.',
      today: 'Today', month: 'This month', revenue: 'Sales', profit: 'Profit', avgTicket: 'Average sale', invoices: 'sales', last30: 'Sales, last 30 days', top: 'Best sellers', byCat: 'By category', lowList: 'To reorder', stockValue: 'Stock value at cost', retail: 'at retail', outN: 'sold out', from: 'From', to: 'To', byHour: 'Sales by hour', byMethod: 'Payment methods', refunds: 'Returns',
      general: 'General', phone: 'Phone', address: 'Address', currency: 'Currency', tz: 'Time zone', taxRate: 'Tax %', taxIncluded: 'Prices include tax', allowNegative: 'Allow selling with zero stock', footer: 'Receipt footer', categories: 'Categories (one per line)', units: 'Units (one per line)', staffPin: 'Cashier PIN (empty = off)', staffHint: 'Cashiers can sell, receive stock and count. They cannot see costs or reports, or make returns.', integrations: 'Connections', webhook: 'Send every sale to (for example Raseed’s order link)', hook: 'Dukkan or Wakeel orders reduce stock: paste this in their webhook setting', copy: 'Copy', copied: 'Copied ✓', pwTitle: 'Change password', current: 'Current', next: 'New', changePw: 'Change',
    },
  };
  const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };
  let lang = get('makhzan_lang') || 'ar';
  const t = (k) => STR[lang][k] ?? k;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = $('#app');
  let session = null, B = null, catalog = [], cart = [], disc = 0, payMethod = 'cash', cat = '';
  async function api(p, opts = {}) {
    const res = await fetch(p, { method: opts.method || 'GET', headers: opts.raw ? {} : opts.body !== undefined ? { 'content-type': 'application/json' } : {}, body: opts.raw ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined) });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && p !== '/api/login' && p !== '/api/password') { boot(); throw new Error(data.error); }
    if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { data });
    return data;
  }
  const toast = (m) => { const el = $('#toast'); el.textContent = m; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400); };
  const loc = () => (lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB');
  const num = (n) => Number(n || 0).toLocaleString(loc(), { maximumFractionDigits: 2 });
  const money = (n) => `${num(n)} <span class="small muted">${esc(B?.currency || '')}</span>`;
  const owner = () => B?.role === 'owner';
  function beep(ok) { try { const c = new (window.AudioContext || window.webkitAudioContext)(); const o = c.createOscillator(); o.frequency.value = ok ? 1200 : 300; o.connect(c.destination); o.start(); o.stop(c.currentTime + 0.08); } catch { /* no audio */ } }
  function dialog(html, wide) {
    const d = document.createElement('dialog');
    d.innerHTML = html;
    d.style.cssText = `border:1px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink);width:min(94vw,${wide ? 900 : 560}px)`;
    document.body.appendChild(d);
    d.showModal();
    d.addEventListener('close', () => d.remove());
    $$('[data-close]', d).forEach((b) => (b.onclick = () => d.close()));
    return d;
  }

  async function boot() {
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    session = await api('/api/session').catch(() => ({}));
    if (session.needsSetup) return auth(true);
    if (!session.authed) return auth(false);
    B = await api('/api/basics');
    shell(); route();
  }
  function auth(setup) {
    app.innerHTML = `<div class="auth"><form class="card" id="f"><div class="brand"><img src="favicon.svg" alt="">Makhzan <span class="muted small">مخزن</span></div>
      <h1>${setup ? t('setupTitle') : t('loginTitle')}</h1>${setup ? `<p class="muted">${t('setupLead')}</p><label class="field" for="b">${t('biz')}<input type="text" id="b"></label>` : ''}
      <label class="field" for="pw">${t('password')} ${setup ? `<span class="hint">${t('pwHint')}</span>` : ''}<input type="password" id="pw" autocomplete="${setup ? 'new-password' : 'current-password'}"></label>
      ${!setup && session.staffEnabled ? `<p class="small muted" style="margin:0">${t('loginHint')}</p>` : ''}
      ${setup && session.setupTokenRequired ? `<label class="field" for="st">Setup token<input type="password" id="st" class="ltr"></label>` : ''}
      <div class="err" id="err"></div><div class="row"><button class="btn primary" type="submit">${setup ? t('start') : t('login')}</button><span class="spacer"></span><button class="btn sm" type="button" id="lb">${t('lang')}</button></div></form></div>`;
    $('#lb').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; set('makhzan_lang', lang); boot(); };
    $('#f').onsubmit = async (e) => {
      e.preventDefault();
      try {
        if (setup) await api('/api/setup', { method: 'POST', body: { businessName: $('#b').value, password: $('#pw').value, lang, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, setupToken: $('#st')?.value } });
        else await api('/api/login', { method: 'POST', body: { password: $('#pw').value } });
        location.hash = '#pos'; boot();
      } catch (err) { $('#err').textContent = err.message; }
    };
  }
  const pages = () => (owner() ? ['pos', 'products', 'sales', 'report', 'settings'] : ['pos', 'products', 'sales']);
  function shell() {
    const nav = pages().map((p) => `<a class="nav" href="#${p}" data-page="${p}">${t(p)}</a>`).join('');
    app.innerHTML = `<div class="shell"><nav class="rail"><div class="brand"><img src="favicon.svg" alt="">Makhzan</div>${nav}
      <div class="rail-foot"><button class="nav" id="lb" type="button">${t('lang')}</button><button class="nav" id="lo" type="button">${t('logout')}</button></div></nav>
      <nav class="mobile-nav">${pages().slice(0, 4).map((p) => `<a class="nav" href="#${p}" data-page="${p}">${t(p)}</a>`).join('')}</nav><main class="main" id="main"></main></div>`;
    $('#lb').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; set('makhzan_lang', lang); boot(); };
    $('#lo').onclick = async () => { await api('/api/logout', { method: 'POST', body: {} }); boot(); };
  }
  const page = () => (pages().includes(location.hash.slice(1)) ? location.hash.slice(1) : 'pos');
  function route() {
    stopCam();
    $$('.nav[data-page]').forEach((a) => a.setAttribute('aria-current', a.dataset.page === page() ? 'page' : 'false'));
    ({ pos: pPos, products: pProducts, sales: pSales, report: pReport, settings: pSettings }[page()])($('#main'));
  }
  window.addEventListener('hashchange', () => session?.authed && route());

  // ---------- checkout ----------
  let stream = null, scanTimer = null;
  function stopCam() { clearInterval(scanTimer); if (stream) stream.getTracks().forEach((x) => x.stop()); stream = null; }
  function addToCart(pr) {
    const line = cart.find((l) => l.productId === pr.id);
    const want = (line ? line.qty : 0) + 1;
    if (!B.allowNegative && pr.stock < want) { beep(false); toast(`${t('noStock')}: ${pr.name}`); return; }
    if (line) line.qty = want; else cart.push({ productId: pr.id, name: pr.name, price: pr.price, qty: 1, stock: pr.stock });
    beep(true);
    drawCart();
  }
  async function scanCode(code) {
    const c = String(code).trim();
    if (!c) return;
    const local = catalog.find((p) => p.barcode === c || p.sku.toLowerCase() === c.toLowerCase());
    if (local) return addToCart(local);
    try { addToCart((await api('/api/scan?code=' + encodeURIComponent(c))).product); } catch { beep(false); toast(t('notFound')); }
  }
  async function pPos(main) {
    catalog = (await api('/api/products')).products;
    main.innerHTML = `<div class="page"><div class="pos">
      <section class="stack"><form class="scan" id="sf"><input type="search" id="sc" placeholder="${t('scanPh')}" autocomplete="off" aria-label="${t('scanPh')}" style="flex:1"><button class="btn" type="button" id="cam">${t('camera')}</button></form>
        <div id="camBox"></div>
        <div class="cats"><button class="btn sm" type="button" data-cat="" aria-pressed="${!cat}">${t('all')}</button>${B.categories.map((c) => `<button class="btn sm" type="button" data-cat="${esc(c)}" aria-pressed="${cat === c}">${esc(c)}</button>`).join('')}</div>
        <div class="grid-p" id="tiles"></div></section>
      <aside class="card cart" id="cart"></aside></div></div>`;
    const drawTiles = () => {
      const q = $('#sc').value.trim().toLowerCase();
      const list = catalog.filter((p) => (!cat || p.category === cat) && (!q || p.name.toLowerCase().includes(q) || p.barcode.includes(q) || p.sku.toLowerCase().includes(q))).slice(0, 120);
      $('#tiles').innerHTML = list.map((p) => `<button class="tile ${p.stock <= 0 ? 'out' : ''}" type="button" data-p="${p.id}"><b>${esc(p.name)}</b><span class="pr">${num(p.price)}</span><span class="small muted">${t('stockLeft')} ${num(p.stock)}${p.low ? ` · <span style="color:var(--bad)">${p.stock <= 0 ? t('outBadge') : t('lowBadge')}</span>` : ''}</span></button>`).join('');
      $$('[data-p]', main).forEach((b) => (b.onclick = () => addToCart(catalog.find((p) => p.id === b.dataset.p))));
    };
    // Enter (or a USB scanner): exact barcode or code first, then a single name match.
    $('#sf').onsubmit = (e) => {
      e.preventDefault();
      const v = $('#sc').value.trim();
      const byName = catalog.filter((p) => p.name.toLowerCase().includes(v.toLowerCase()));
      if (catalog.some((p) => p.barcode === v || p.sku.toLowerCase() === v.toLowerCase()) || byName.length !== 1) scanCode(v);
      else addToCart(byName[0]);
      $('#sc').value = '';
      drawTiles();
    };
    $('#sc').oninput = drawTiles;
    $$('[data-cat]', main).forEach((b) => (b.onclick = () => { cat = b.dataset.cat; $$('[data-cat]', main).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === cat))); drawTiles(); }));
    $('#cam').onclick = async () => {
      if (stream) { stopCam(); $('#camBox').innerHTML = ''; return; }
      if (!('BarcodeDetector' in window)) { $('#camBox').innerHTML = `<p class="notice small">${t('camOff')}</p>`; return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        $('#camBox').innerHTML = '<video class="cam" autoplay playsinline muted></video>';
        const v = $('video', main); v.srcObject = stream;
        const det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'upc_a', 'upc_e', 'code_39', 'qr_code'] });
        let last = '', lastAt = 0;
        scanTimer = setInterval(async () => { try { const r = await det.detect(v); if (r[0] && (r[0].rawValue !== last || Date.now() - lastAt > 2000)) { last = r[0].rawValue; lastAt = Date.now(); scanCode(last); } } catch { /* frame not ready */ } }, 350);
      } catch (err) { $('#camBox').innerHTML = `<p class="notice small">${esc(err.message)}</p>`; }
    };
    drawTiles();
    drawCart();
    $('#sc').focus();
  }
  async function drawCart() {
    const box = $('#cart');
    if (!box) return;
    const tot = cart.length ? await api('/api/quote', { method: 'POST', body: { items: cart, discount: disc } }) : { subtotal: 0, discount: 0, tax: 0, total: 0 };
    box.innerHTML = `<div class="row"><h2 style="margin:0">${t('cart')}</h2><span class="spacer"></span>${cart.length ? `<button class="btn sm" type="button" id="clr">${t('clear')}</button>` : ''}</div>
      ${cart.length ? cart.map((l, i) => `<div class="line"><span><b>${esc(l.name)}</b><br><span class="small muted">${num(l.price)}</span></span><span class="qty"><button type="button" data-dec="${i}" aria-label="-">−</button><input type="number" min="0" step="any" value="${l.qty}" data-q="${i}" aria-label="${t('qty')}"><button type="button" data-inc="${i}" aria-label="+">+</button></span><b class="num">${num(l.qty * l.price)}</b></div>`).join('') : `<p class="muted">${t('empty')}</p>`}
      <div class="row small"><span>${t('subtotal')}</span><span class="spacer"></span><span>${num(tot.subtotal)}</span></div>
      <div class="row small"><label for="ds">${t('discount')}</label><span class="spacer"></span><input type="number" id="ds" min="0" step="any" value="${disc || ''}" style="width:110px"></div>
      ${tot.tax ? `<div class="row small"><span>${t('tax')} ${B.taxIncluded ? '(✓)' : ''}</span><span class="spacer"></span><span>${num(tot.tax)}</span></div>` : ''}
      <div class="row"><b>${t('total')}</b><span class="spacer"></span><span class="total">${num(tot.total)}</span></div>
      <div class="methods">${['cash', 'card', 'wallet', 'credit'].map((m) => `<button class="btn sm" type="button" data-m="${m}" aria-pressed="${payMethod === m}">${t('m_' + m)}</button>`).join('')}</div>
      ${payMethod === 'cash' ? `<div class="grid2"><label class="field small">${t('received')}<input type="number" id="rc" min="0" step="any"></label><div class="field small">${t('change')}<b id="chg" class="total" style="font-size:1.4rem">0</b></div></div>` : ''}
      <input type="text" id="cn" placeholder="${t('customer')}" aria-label="${t('customer')}">
      <button class="btn primary pay" type="button" id="pay" ${cart.length ? '' : 'disabled'}>${t('payBtn')} · ${num(tot.total)}</button>`;
    $$('[data-inc]', box).forEach((b) => (b.onclick = () => { const l = cart[b.dataset.inc]; if (!B.allowNegative && l.qty + 1 > l.stock) { toast(t('noStock')); return; } l.qty += 1; drawCart(); }));
    $$('[data-dec]', box).forEach((b) => (b.onclick = () => { const l = cart[b.dataset.dec]; l.qty -= 1; if (l.qty <= 0) cart.splice(b.dataset.dec, 1); drawCart(); }));
    $$('[data-q]', box).forEach((inp) => (inp.onchange = () => { const v = Number(inp.value); if (v <= 0) cart.splice(inp.dataset.q, 1); else cart[inp.dataset.q].qty = v; drawCart(); }));
    $$('[data-m]', box).forEach((b) => (b.onclick = () => { payMethod = b.dataset.m; drawCart(); }));
    if ($('#clr', box)) $('#clr', box).onclick = () => { cart = []; disc = 0; drawCart(); };
    $('#ds', box).onchange = () => { disc = Number($('#ds', box).value || 0); drawCart(); };
    if ($('#rc', box)) $('#rc', box).oninput = () => { const r = Number($('#rc', box).value || 0); $('#chg', box).textContent = num(Math.max(0, r - tot.total)); };
    $('#pay', box).onclick = async () => {
      try {
        const r = await api('/api/sales', { method: 'POST', body: { items: cart.map((l) => ({ productId: l.productId, qty: l.qty })), discount: disc, method: payMethod, paid: Number($('#rc', box)?.value || 0) || undefined, customer: $('#cn', box).value } });
        toast(t('saleDone').replace('{n}', r.sale.no));
        printReceipt(r.sale);
        cart = []; disc = 0; payMethod = 'cash';
        pPos($('#main'));
      } catch (err) { toast(err.message); }
    };
  }

  function printReceipt(x) {
    const el = $('#print');
    el.className = 'thermal';
    el.innerHTML = `<div style="text-align:center"><b style="font-size:15px">${esc(B.businessName)}</b>${B.address ? `<div>${esc(B.address)}</div>` : ''}${B.phone ? `<div dir="ltr">${esc(B.phone)}</div>` : ''}</div><hr>
      <div class="r"><b>${t('receipt')} #${x.no}</b><span>${new Date(x.at).toLocaleString(loc(), { dateStyle: 'short', timeStyle: 'short' })}</span></div><hr>
      ${x.items.map((i) => `<div>${esc(i.name)}</div><div class="r"><span>${num(i.qty)} × ${num(i.price)}</span><span>${num(i.qty * i.price)}</span></div>`).join('')}<hr>
      ${x.discount ? `<div class="r"><span>${t('discount')}</span><span>− ${num(x.discount)}</span></div>` : ''}${x.tax ? `<div class="r"><span>${t('tax')}</span><span>${num(x.tax)}</span></div>` : ''}
      <div class="r" style="font-size:15px"><b>${t('total')}</b><b>${num(x.total)} ${esc(B.currency)}</b></div>
      <div class="r"><span>${t('m_' + x.method)}</span><span>${num(x.paid)}</span></div>${x.change ? `<div class="r"><span>${t('change')}</span><span>${num(x.change)}</span></div>` : ''}
      ${x.customer ? `<div>${esc(x.customer)}</div>` : ''}<hr><div style="text-align:center">${esc(B.footer)}</div>`;
    window.print();
  }

  // ---------- products ----------
  let prodQ = { q: '', low: '' };
  async function pProducts(main) {
    const { products } = await api('/api/products?' + new URLSearchParams(prodQ));
    main.innerHTML = `<div class="page"><div class="page-head"><h1>${t('products')} <span class="muted small">(${products.length})</span></h1><div class="row">
        ${owner() ? `<button class="btn primary" id="np" type="button">${t('addProduct')}</button>` : ''}<button class="btn" id="rv" type="button">${t('receive')}</button><button class="btn" id="ct" type="button">${t('count')}</button><button class="btn" id="lb2" type="button">${t('labels')}</button>
        ${owner() ? `<label class="btn" style="cursor:pointer">${t('importCsv')}<input type="file" id="imp" accept=".csv,text/csv" hidden></label><a class="btn" href="/api/products.csv">${t('exportCsv')}</a>` : ''}</div></div>
      <div class="row"><input type="search" id="q" value="${esc(prodQ.q)}" placeholder="${t('search')}" style="flex:1;min-width:200px"><label class="row small"><input type="checkbox" id="lo" ${prodQ.low ? 'checked' : ''}> ${t('lowOnly')}</label></div>
      <div class="table-wrap"><table><thead><tr><th>${t('name')}</th><th>${t('barcode')}</th><th>${t('category')}</th><th>${t('price')}</th>${owner() ? `<th>${t('cost')}</th><th>${t('margin')}</th>` : ''}<th>${t('stock')}</th></tr></thead><tbody>
      ${products.map((p) => `<tr data-id="${p.id}" style="cursor:pointer"><td><b>${esc(p.name)}</b><br><span class="small muted">${esc(p.sku)}</span></td><td class="mono small">${esc(p.barcode)}</td><td>${esc(p.category)}</td><td class="num">${num(p.price)}</td>
        ${owner() ? `<td class="num">${num(p.cost)}</td><td class="num">${p.price ? Math.round(((p.price - p.cost) / p.price) * 100) : 0}%</td>` : ''}<td class="num">${p.low ? `<b style="color:var(--bad)">${num(p.stock)}</b> <span class="pill bad">${p.stock <= 0 ? t('outBadge') : t('lowBadge')}</span>` : num(p.stock)} <span class="small muted">${esc(p.unit)}</span></td></tr>`).join('')}
      </tbody></table></div><p class="small muted">${t('importHint')}</p></div>`;
    let tm;
    $('#q').oninput = () => { clearTimeout(tm); tm = setTimeout(() => { prodQ.q = $('#q').value; pProducts(main).then(() => { const i = $('#q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }); }, 300); };
    $('#lo').onchange = () => { prodQ.low = $('#lo').checked ? '1' : ''; pProducts(main); };
    const reload = () => pProducts(main);
    if ($('#np')) $('#np').onclick = () => productForm(null, reload);
    $$('[data-id]', main).forEach((r) => (r.onclick = () => productForm(products.find((p) => p.id === r.dataset.id), reload)));
    $('#rv').onclick = () => stockForm('receive', products, reload);
    $('#ct').onclick = () => stockForm('count', products, reload);
    $('#lb2').onclick = () => labelsForm(products);
    if ($('#imp')) $('#imp').onchange = async () => { const f = $('#imp').files[0]; if (!f) return; try { const r = await api('/api/products/import', { method: 'POST', raw: await f.text() }); toast(t('imported').replace('{c}', r.created).replace('{u}', r.updated)); reload(); } catch (err) { toast(err.message); } };
  }
  async function productForm(p, done) {
    const moves = p ? (await api('/api/products/' + p.id)).moves : [];
    const ro = !owner() ? 'disabled' : '';
    const d = dialog(`<form id="pf" class="stack"><h2 style="margin:0">${p ? esc(p.name) : t('addProduct')}</h2>
      <label class="field">${t('name')}<input type="text" name="name" value="${esc(p?.name || '')}" required ${ro}></label>
      <div class="grid2"><label class="field">${t('barcode')}<input type="text" name="barcode" class="ltr" value="${esc(p?.barcode || '')}" ${ro}></label><label class="field">${t('sku')}<input type="text" name="sku" class="ltr" value="${esc(p?.sku || '')}" ${ro}></label></div>
      <div class="grid2"><label class="field">${t('category')}<input type="text" name="category" list="cats" value="${esc(p?.category || B.categories[0] || '')}" ${ro}><datalist id="cats">${B.categories.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label><label class="field">${t('unit')}<input type="text" name="unit" list="units" value="${esc(p?.unit || B.units[0] || '')}" ${ro}><datalist id="units">${B.units.map((c) => `<option value="${esc(c)}">`).join('')}</datalist></label></div>
      <div class="grid4"><label class="field">${t('price')}<input type="number" name="price" min="0" step="any" value="${p?.price ?? ''}" ${ro}></label>${owner() ? `<label class="field">${t('cost')}<input type="number" name="cost" min="0" step="any" value="${p?.cost ?? ''}"></label>` : ''}<label class="field">${t('minStock')}<input type="number" name="minStock" min="0" step="any" value="${p?.minStock ?? ''}" ${ro}></label>${p ? '' : `<label class="field">${t('stock')}<input type="number" name="stock" min="0" step="any"></label>`}</div>
      <div class="err" id="pe"></div>${owner() ? `<div class="row"><button class="btn primary" type="submit">${t('save')}</button>${p ? `<button class="btn danger" type="button" id="pd">${t('del')}</button>` : ''}<span class="spacer"></span><button class="btn" type="button" data-close>${t('close')}</button></div>` : `<div class="row"><span class="spacer"></span><button class="btn" type="button" data-close>${t('close')}</button></div>`}
      ${moves.length ? `<h3 style="margin:8px 0 0">${t('moves')}</h3><div class="stack small">${moves.slice(0, 25).map((m) => `<div class="row"><span class="muted">${new Date(m.at).toLocaleString(loc(), { dateStyle: 'short', timeStyle: 'short' })}</span><span>${t('mv_' + m.type)}</span><b style="color:${m.qty < 0 ? 'var(--bad)' : 'var(--good)'}">${m.qty > 0 ? '+' : ''}${num(m.qty)}</b><span class="muted">${esc(m.ref ? '#' + m.ref : '')} ${esc(m.note)}</span></div>`).join('')}</div>` : ''}</form>`);
    const f = $('#pf', d);
    f.onsubmit = async (e) => {
      e.preventDefault();
      const body = { name: f.name.value, barcode: f.barcode.value, sku: f.sku.value, category: f.category.value, unit: f.unit.value, price: f.price.value, cost: f.cost?.value, minStock: f.minStock.value, stock: f.stock?.value };
      try { if (p) await api('/api/products/' + p.id, { method: 'PUT', body }); else await api('/api/products', { method: 'POST', body }); d.close(); toast(t('saved')); B = await api('/api/basics'); done(); } catch (err) { $('#pe', d).textContent = err.message; }
    };
    if ($('#pd', d)) $('#pd', d).onclick = async () => { if (!confirm(t('delQ'))) return; await api('/api/products/' + p.id, { method: 'DELETE', body: {} }); d.close(); done(); };
  }
  function stockForm(kind, products, done) {
    const opts = products.map((p) => `<option value="${p.id}">${esc(p.name)} (${num(p.stock)})</option>`).join('');
    const row = () => `<div class="grid4" data-row><label class="field small">${t('name')}<select>${opts}</select></label><label class="field small">${t('qty')}<input type="number" min="0" step="any"></label>${kind === 'receive' && owner() ? `<label class="field small">${t('cost')}<input type="number" min="0" step="any"></label>` : ''}</div>`;
    const d = dialog(`<form id="sf2" class="stack"><h2 style="margin:0">${t(kind)}</h2>${kind === 'count' ? `<p class="small muted" style="margin:0">${t('countHint')}</p>` : `<div class="grid2"><label class="field">${t('supplier')}<input type="text" name="supplier"></label><label class="field">${t('ref')}<input type="text" name="ref"></label></div>`}
      <div class="stack" id="rows">${row()}</div><button class="btn sm" type="button" id="ar" style="justify-self:start">${t('addLine')}</button>
      <div class="row"><button class="btn primary" type="submit">${t('save')}</button><span class="spacer"></span><button class="btn" type="button" data-close>${t('close')}</button></div></form>`, true);
    $('#ar', d).onclick = () => $('#rows', d).insertAdjacentHTML('beforeend', row());
    $('#sf2', d).onsubmit = async (e) => {
      e.preventDefault();
      const items = $$('[data-row]', d).map((r) => { const [sel, q, c] = [$('select', r), ...$$('input', r)]; return { productId: sel.value, qty: q.value === '' ? null : Number(q.value), cost: c && c.value !== '' ? Number(c.value) : undefined }; }).filter((x) => x.qty != null);
      try { await api(kind === 'receive' ? '/api/stock/receive' : '/api/stock/count', { method: 'POST', body: { items, supplier: e.target.supplier?.value, ref: e.target.ref?.value } }); d.close(); toast(t('saved')); done(); } catch (err) { toast(err.message); }
    };
  }
  function labelsForm(products) {
    const withCode = products.filter((p) => p.barcode || p.sku);
    const d = dialog(`<form id="lf" class="stack"><h2 style="margin:0">${t('labels')}</h2><div class="stack" style="max-height:50vh;overflow:auto">${withCode.map((p) => `<label class="row small"><input type="number" min="0" value="0" data-l="${p.id}" style="width:70px" aria-label="${t('copies')}"> ${esc(p.name)} <span class="muted mono">${esc(p.barcode || p.sku)}</span></label>`).join('')}</div>
      <div class="row"><button class="btn primary" type="submit">${t('print')}</button><span class="spacer"></span><button class="btn" type="button" data-close>${t('close')}</button></div></form>`);
    $('#lf', d).onsubmit = (e) => {
      e.preventDefault();
      const out = [];
      $$('[data-l]', d).forEach((i) => { const p = withCode.find((x) => x.id === i.dataset.l); for (let k = 0; k < Number(i.value || 0); k++) out.push(`<div class="lbl"><div>${esc(p.name)}</div><img src="/api/barcode.svg?code=${encodeURIComponent(p.barcode || p.sku)}" alt=""><b>${num(p.price)} ${esc(B.currency)}</b></div>`); });
      if (!out.length) return;
      const el = $('#print');
      el.className = '';
      el.innerHTML = `<div class="labels">${out.join('')}</div>`;
      d.close();
      const imgs = $$('img', el);
      let left = imgs.length;
      imgs.forEach((im) => { if (im.complete) left--; else im.onload = im.onerror = () => { if (--left <= 0) window.print(); }; });
      if (left <= 0) window.print();
    };
  }

  // ---------- sales ----------
  async function pSales(main, day) {
    const r = await api('/api/sales' + (day ? '?day=' + day : ''));
    main.innerHTML = `<div class="page"><div class="page-head"><h1>${t('sales')}</h1><div class="row"><input type="date" id="d" value="${esc(r.day)}" aria-label="${t('day')}">${owner() ? `<a class="btn" href="/api/sales.csv">${t('exportCsv')}</a>` : ''}</div></div>
      <div class="grid4"><div class="card stat"><b>${r.totals.count}</b><span>${t('count2')}</span></div><div class="card stat"><b>${money(r.totals.total)}</b><span>${t('revenue')}</span></div><div class="card stat"><b>${money(r.totals.cash)}</b><span>${t('cashTotal')}</span></div></div>
      ${r.sales.length ? `<div class="table-wrap"><table><thead><tr><th>#</th><th>${t('time')}</th><th>${t('items')}</th><th>${t('method')}</th><th>${t('total')}</th><th></th></tr></thead><tbody>
      ${r.sales.map((x) => `<tr${x.refunded ? ' style="opacity:.5"' : ''}><td class="mono"><b>${x.no}</b></td><td class="small">${new Date(x.at).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' })}</td><td class="small">${x.items.map((i) => `${esc(i.name)} × ${num(i.qty)}`).join('، ')}</td><td>${t('m_' + x.method)}</td><td class="num"><b>${num(x.total)}</b></td>
        <td><div class="row" style="gap:6px">${x.refunded ? `<span class="pill off">${t('refunded')}</span>` : ''}<button class="btn sm" type="button" data-rp="${x.no}">${t('reprint')}</button>${owner() && !x.refunded ? `<button class="btn sm danger" type="button" data-rf="${x.no}">${t('refund')}</button>` : ''}</div></td></tr>`).join('')}
      </tbody></table></div>` : `<div class="card empty">${t('noSales')}</div>`}</div>`;
    $('#d').onchange = () => pSales(main, $('#d').value);
    $$('[data-rp]', main).forEach((b) => (b.onclick = () => printReceipt(r.sales.find((x) => x.no === Number(b.dataset.rp)))));
    $$('[data-rf]', main).forEach((b) => (b.onclick = async () => { if (!confirm(t('refundQ'))) return; await api(`/api/sales/${b.dataset.rf}/refund`, { method: 'POST', body: {} }); pSales(main, r.day); }));
  }

  // ---------- reports ----------
  async function pReport(main) {
    const o = await api('/api/overview');
    const max = Math.max(1, ...o.perDay.map((d) => d.total));
    const hmax = Math.max(1, ...o.month.hours);
    main.innerHTML = `<div class="page"><div class="page-head"><h1>${t('report')}</h1></div>
      <div class="grid4"><div class="card stat"><b>${money(o.today.revenue)}</b><span>${t('today')} · ${o.today.count} ${t('invoices')}</span></div><div class="card stat"><b>${money(o.today.profit)}</b><span>${t('profit')} ${t('today')}</span></div>
        <div class="card stat"><b>${money(o.month.revenue)}</b><span>${t('month')} · ${t('avgTicket')} ${num(o.month.avgTicket)}</span></div><div class="card stat"><b>${money(o.month.profit)}</b><span>${t('profit')} ${t('month')}</span></div></div>
      <section class="card"><h2>${t('last30')}</h2><div class="bars" style="grid-template-columns:repeat(30,1fr)">${o.perDay.map((d, i) => `<div class="bar ${i === 29 ? 'today' : ''}" title="${esc(d.day)}: ${num(d.total)}"><i style="height:${Math.max(2, Math.round((d.total / max) * 110))}px"></i></div>`).join('')}</div></section>
      <div class="grid2"><section class="card"><h2>${t('lowList')} <span class="muted small">· ${o.out} ${t('outN')}</span></h2>${o.low.length ? `<table style="min-width:0"><tbody>${o.low.map((p) => `<tr><td>${esc(p.name)}</td><td class="num"><b style="color:var(--bad)">${num(p.stock)}</b> / ${num(p.minStock)}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">—</p>'}</section>
        <section class="card"><h2>${t('top')} · ${t('month')}</h2><table style="min-width:0"><tbody>${o.month.top.map((p) => `<tr><td>${esc(p.name)}</td><td class="num">${num(p.qty)}</td><td class="num">${money(p.revenue)}</td><td class="num muted">${num(p.profit)}</td></tr>`).join('')}</tbody></table></section></div>
      <div class="grid2"><section class="card"><h2>${t('byCat')}</h2><table style="min-width:0"><tbody>${o.month.byCategory.map((c) => `<tr><td>${esc(c.k)}</td><td class="num">${money(c.v)}</td></tr>`).join('')}</tbody></table>
          <h2>${t('byMethod')}</h2><table style="min-width:0"><tbody>${o.month.byMethod.map((c) => `<tr><td>${t('m_' + c.k)}</td><td class="num">${money(c.v)}</td></tr>`).join('')}</tbody></table></section>
        <section class="card"><h2>${t('byHour')}</h2><div class="bars" style="grid-template-columns:repeat(24,1fr)">${o.month.hours.map((h, i) => `<div class="bar" title="${i}:00 · ${num(h)}"><i style="height:${Math.max(2, Math.round((h / hmax) * 110))}px"></i></div>`).join('')}</div><div class="row small muted"><span>0:00</span><span class="spacer"></span><span>23:00</span></div>
          <p>${t('stockValue')}: <b>${money(o.stockValue)}</b> · ${t('retail')} ${money(o.retailValue)}</p><p class="small muted">${t('refunds')}: ${o.month.refunds} · ${t('discount')}: ${num(o.month.discounts)}</p></section></div></div>`;
  }

  async function pSettings(main) {
    const { settings: s } = await api('/api/settings');
    const hook = `${location.origin}/hooks/order?key=${s.hookKey}`;
    main.innerHTML = `<div class="page"><div class="page-head"><h1>${t('settings')}</h1></div>
      <form class="card" id="sf" style="max-width:780px"><h2>${t('general')}</h2>
        <div class="grid2"><label class="field">${t('biz')}<input type="text" name="businessName" value="${esc(s.businessName)}"></label><label class="field">${t('phone')}<input type="tel" name="phone" class="ltr" value="${esc(s.phone)}"></label></div>
        <label class="field">${t('address')}<input type="text" name="address" value="${esc(s.address)}"></label>
        <div class="grid4"><label class="field">${t('currency')}<input type="text" name="currency" value="${esc(s.currency)}"></label><label class="field">${t('taxRate')}<input type="number" name="taxRate" min="0" max="50" step="any" value="${s.taxRate}"></label><label class="field">${t('tz')}<input type="text" name="timezone" class="ltr" value="${esc(s.timezone)}"></label></div>
        <label class="row" style="justify-content:space-between">${t('taxIncluded')}<span class="switch"><input type="checkbox" name="taxIncluded" ${s.taxIncluded ? 'checked' : ''}></span></label>
        <label class="row" style="justify-content:space-between">${t('allowNegative')}<span class="switch"><input type="checkbox" name="allowNegative" ${s.allowNegative ? 'checked' : ''}></span></label>
        <label class="field">${t('footer')}<input type="text" name="footer" value="${esc(s.footer)}"></label>
        <div class="grid2"><label class="field">${t('categories')}<textarea name="categories" rows="5">${esc(s.categories.join('\n'))}</textarea></label><label class="field">${t('units')}<textarea name="units" rows="5">${esc(s.units.join('\n'))}</textarea></label></div>
        <label class="field">${t('staffPin')}<input type="text" name="staffPin" class="ltr" inputmode="numeric" value="${esc(s.staffPin)}" style="max-width:200px"></label><p class="small muted" style="margin:0">${t('staffHint')}</p>
        <h2>${t('integrations')}</h2><label class="field">${t('webhook')}<input type="url" name="webhookUrl" class="ltr" value="${esc(s.webhookUrl)}"></label>
        <p class="small muted" style="margin:0">${t('hook')}</p><div class="copy"><pre>${esc(hook)}</pre><button class="btn sm" type="button" id="hc">${t('copy')}</button></div>
        <div class="row"><button class="btn primary" type="submit">${t('save')}</button></div></form>
      <form class="card" id="pf" style="max-width:480px"><h2>${t('pwTitle')}</h2><label class="field" for="pc">${t('current')}<input type="password" id="pc" autocomplete="current-password"></label><label class="field" for="pn">${t('next')}<input type="password" id="pn" autocomplete="new-password"></label><div class="err" id="pe"></div><div class="row"><button class="btn primary" type="submit">${t('changePw')}</button></div></form>
      <p class="muted small">Makhzan · ${esc(session.version)} · MIT</p></div>`;
    const f = $('#sf');
    const lines = (v) => v.split('\n').map((x) => x.trim()).filter(Boolean);
    f.onsubmit = async (e) => {
      e.preventDefault();
      try { await api('/api/settings', { method: 'PUT', body: { settings: { businessName: f.businessName.value, phone: f.phone.value, address: f.address.value, currency: f.currency.value, taxRate: Number(f.taxRate.value || 0), timezone: f.timezone.value, taxIncluded: f.taxIncluded.checked, allowNegative: f.allowNegative.checked, footer: f.footer.value, categories: lines(f.categories.value), units: lines(f.units.value), staffPin: f.staffPin.value, webhookUrl: f.webhookUrl.value } } }); B = await api('/api/basics'); toast(t('saved')); } catch (err) { toast(err.message); }
    };
    $('#hc').onclick = async () => { try { await navigator.clipboard.writeText(hook); toast(t('copied')); } catch { toast(hook); } };
    $('#pf').onsubmit = async (e) => { e.preventDefault(); try { await api('/api/password', { method: 'POST', body: { current: $('#pc').value, next: $('#pn').value } }); toast(t('saved')); } catch (err) { $('#pe').textContent = err.message; } };
  }
  boot();
})();
