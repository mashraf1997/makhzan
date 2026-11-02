import crypto from 'node:crypto';
import { defaultData } from './app.js';

// A minimarket with about 40 products, a month of sales, a few items running low.
export function buildDemo(demo) {
  const ar = demo.lang === 'ar';
  const d = defaultData(demo.lang);
  Object.assign(d.settings, { businessName: ar ? 'ماركت الأمانة' : 'Corner Market', phone: '+20 100 000 0000', address: ar ? 'شارع 9، المعادي' : '9 Main St', staffPin: '1234' });
  const k = ar ? 1 : 0.06;
  const cats = ar ? ['ألبان', 'مشروبات', 'سناكس', 'بقالة', 'منظفات', 'مخبوزات'] : ['Dairy', 'Drinks', 'Snacks', 'Grocery', 'Cleaning', 'Bakery'];
  d.settings.categories = cats;
  const items = ar
    ? [['لبن جهينة 1 لتر', 0, 42, 35], ['زبادي جهينة', 0, 9, 7], ['جبنة دومتي 500جم', 0, 48, 40], ['جبنة رومي ربع', 0, 85, 68], ['زبدة لورباك 200جم', 0, 150, 128], ['بيبسي 1 لتر', 1, 25, 20], ['كوكاكولا كانز', 1, 15, 11.5], ['مياه نستله 1.5', 1, 8, 6], ['عصير جهينة مانجا', 1, 22, 17], ['شاي العروسة 250جم', 3, 75, 62], ['قهوة بن 200جم', 3, 120, 95], ['رز الضحى 1كيلو', 3, 38, 31], ['مكرونة الملكة', 3, 18, 14], ['سكر 1 كيلو', 3, 35, 30], ['زيت عافية 800مل', 3, 95, 82], ['تونة صن شاين', 3, 45, 37], ['شيبسي عائلي', 2, 15, 11], ['بسكويت أولكر', 2, 10, 7.5], ['شوكولاتة كادبوري', 2, 30, 24], ['مولتو', 2, 12, 9], ['تايد 2.5 كيلو', 4, 190, 160], ['بريل 1 لتر', 4, 45, 37], ['مناديل فاين', 4, 25, 19], ['عيش فينو 5 قطع', 5, 15, 11], ['توست', 5, 35, 28], ['كرواسون', 5, 12, 8], ['بيض 30', 3, 165, 145], ['عسل نحل 500جم', 3, 140, 110], ['فول مدمس علبة', 3, 18, 13], ['صلصة هاينز', 3, 25, 19]]
    : [['Milk 1L', 0, 42, 35], ['Yogurt', 0, 9, 7], ['White cheese 500g', 0, 48, 40], ['Yellow cheese 250g', 0, 85, 68], ['Butter 200g', 0, 150, 128], ['Pepsi 1L', 1, 25, 20], ['Cola can', 1, 15, 11.5], ['Water 1.5L', 1, 8, 6], ['Mango juice', 1, 22, 17], ['Tea 250g', 3, 75, 62], ['Coffee 200g', 3, 120, 95], ['Rice 1kg', 3, 38, 31], ['Pasta', 3, 18, 14], ['Sugar 1kg', 3, 35, 30], ['Oil 800ml', 3, 95, 82], ['Tuna can', 3, 45, 37], ['Chips family', 2, 15, 11], ['Biscuits', 2, 10, 7.5], ['Chocolate bar', 2, 30, 24], ['Croissant snack', 2, 12, 9], ['Detergent 2.5kg', 4, 190, 160], ['Dish soap 1L', 4, 45, 37], ['Tissues', 4, 25, 19], ['Bread rolls x5', 5, 15, 11], ['Toast', 5, 35, 28], ['Croissant', 5, 12, 8], ['Eggs x30', 3, 165, 145], ['Honey 500g', 3, 140, 110], ['Fava beans can', 3, 18, 13], ['Ketchup', 3, 25, 19]];
  let seed = 3;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const prods = items.map(([name, ci, price, cost], i) => ({ id: crypto.randomUUID(), name, sku: 'P' + String(100 + i), barcode: '622' + String(1000000000 + i * 7919).slice(0, 10), category: cats[ci], unit: d.settings.units[0], price: Math.round(price * k * 100) / 100, cost: Math.round(cost * k * 100) / 100, stock: 0, minStock: [5, 10, 6][i % 3], active: true, createdAt: new Date(Date.now() - 40 * 864e5).toISOString() }));
  d.products.push(...prods);
  const mv = (p, type, qty, at, ref = '') => { p.stock = Math.round((p.stock + qty) * 1000) / 1000; d.moves.push({ id: crypto.randomUUID(), productId: p.id, type, qty, cost: p.cost, note: type === 'purchase' ? (ar ? 'المورد' : 'Supplier') : '', ref, by: 'owner', at }); };
  for (const p of prods) mv(p, 'purchase', 150 + Math.floor(rnd() * 100), new Date(Date.now() - 32 * 864e5).toISOString());
  for (const p of prods) mv(p, 'purchase', 60 + Math.floor(rnd() * 80), new Date(Date.now() - 14 * 864e5).toISOString());
  const methods = ['cash', 'cash', 'cash', 'wallet', 'card'];
  for (let back = 30; back >= 0; back--) {
    const n = back === 0 ? 14 : 18 + Math.floor(rnd() * 14);
    for (let s = 0; s < n; s++) {
      const lines = [];
      const count = 1 + Math.floor(rnd() * 4);
      for (let j = 0; j < count; j++) {
        const p = prods[Math.floor(Math.pow(rnd(), 1.6) * prods.length)];
        if (p.stock < 3 || lines.some((l) => l.productId === p.id)) continue;
        lines.push({ productId: p.id, name: p.name, qty: 1 + Math.floor(rnd() * 2), price: p.price, cost: p.cost });
      }
      if (!lines.length) continue;
      const subtotal = Math.round(lines.reduce((x, l) => x + l.qty * l.price, 0) * 100) / 100;
      const hour = 8 + Math.floor(rnd() * 14);
      const at = new Date(Date.now() - back * 864e5);
      at.setHours(back === 0 ? Math.min(hour, new Date().getHours()) : hour, Math.floor(rnd() * 60));
      const method = methods[Math.floor(rnd() * methods.length)];
      const sale = { id: crypto.randomUUID(), no: d.settings.nextSale++, items: lines, subtotal, discount: 0, tax: 0, total: subtotal, method, paid: method === 'cash' ? Math.ceil(subtotal / 50) * 50 : subtotal, change: 0, customer: '', by: rnd() < 0.6 ? 'staff' : 'owner', at: at.toISOString(), refunded: false, refundedAt: null };
      sale.change = Math.round((sale.paid - sale.total) * 100) / 100;
      for (const l of lines) mv(prods.find((p) => p.id === l.productId), 'sale', -l.qty, sale.at, String(sale.no));
      d.sales.push(sale);
    }
  }
  // A few items close to running out, one sold out.
  for (const [i, left] of [[0, 3], [5, 4], [16, 2], [23, 0]]) { const p = prods[i]; mv(p, 'adjust', left - p.stock, new Date().toISOString()); }
  return d;
}
