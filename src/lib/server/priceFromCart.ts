// src/lib/server/price_from_cart.ts
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

export type CartLine = { priceId: string; quantity: number };

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' }); // use a real version
const ALLOW = new Set<string>([
  'price_1Rxx5uIJ90jjf7chHo5UTegX'
  // add more allowed prices here
]);

export async function priceCart(cart: CartLine[]) {
  if (!Array.isArray(cart) || cart.length === 0) {
    return { items: [], subtotal: 0, currency: 'usd' as string };
  }

  // dedupe price ids
  const ids = [...new Set(cart.map(c => c.priceId))];

  // fetch each exact price to avoid mismatch
  const prices = await Promise.all(ids.map(id => stripe.prices.retrieve(id, { expand: ['product'] })));
  const byId = new Map(prices.map(p => [p.id, p]));

  // build validated items and subtotal
  let currency = 'usd';
  const items = cart.map(({ priceId, quantity }) => {
    const price = byId.get(priceId);
    if (!price || !ALLOW.has(price.id)) return null; // drop anything not allowed
    if (price.currency) currency = price.currency;
    const unit = price.unit_amount ?? 0;
    const name = ((price.product as Stripe.Product)?.name) || price.nickname || 'Item';
    return {
      priceId,
      quantity: Math.max(1, Number(quantity) || 1),
      unit_amount: unit,
      line_total: unit * Math.max(1, Number(quantity) || 1),
      name
    };
  }).filter(Boolean) as Array<{ priceId: string; quantity: number; unit_amount: number; line_total: number; name: string }>;

  const subtotal = items.reduce((n, i) => n + i.line_total, 0);

  // also return Checkout line_items shape (price + quantity)
  const checkout_line_items = items.map(i => ({ price: i.priceId, quantity: i.quantity }));

  return { items, subtotal, currency, checkout_line_items };
}
