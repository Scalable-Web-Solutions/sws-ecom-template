// src/lib/server/catalog.ts
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });

// optional: only allow these prices to ever show/charge
const ALLOWED_PRICE_IDS = new Set<string>([
  'price_1Rxx5uIJ90jjf7chHo5UTegX'
  // add more here
]);

export type CatalogItem = {
  productId: string;
  priceId: string;
  name: string;
  description: string | null;
  image: string | null;
  unit_amount: number; // in cents
  currency: string;
  recurring: Stripe.Price.Recurring | null;
};

export async function getCatalog(): Promise<CatalogItem[]> {
  // Pull active prices and expand product for metadata/images
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    expand: ['data.product']
  });

  // Shape + allowlist
  const items: CatalogItem[] = [];
  for (const p of prices.data) {
    if (!p.active) continue;
    if (ALLOWED_PRICE_IDS.size && !ALLOWED_PRICE_IDS.has(p.id)) continue;

    const prod = p.product as Stripe.Product;
    items.push({
      productId: prod.id,
      priceId: p.id,
      name: prod.name,
      description: prod.description ?? null,
      image: prod.images?.[0] ?? null,
      unit_amount: p.unit_amount ?? 0,
      currency: p.currency,
      recurring: p.recurring ?? null
    });
  }

  // (Optional) If you only want one price per product (e.g., the cheapest):
  // return dedupeBy(items, 'productId', pickLowestUnitAmount);
  return items;
}
