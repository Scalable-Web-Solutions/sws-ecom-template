import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });

export async function POST({ request, url }) {
  try {
    if (!STRIPE_SECRET_KEY) {
      return json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const items = body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: 'Missing or invalid `items` array' }, { status: 400 });
    }

    // Normalize/validate line items
    const line_items = items.map((it) => {
      // Accept either { price, quantity } or { price_data, quantity }
      if (it?.price) return { price: it.price, quantity: it.quantity ?? 1 };
      if (it?.price_data?.currency && it?.price_data?.product_data?.name && it?.price_data?.unit_amount) {
        return { price_data: it.price_data, quantity: it.quantity ?? 1 };
      }
      throw new Error('Each item needs either `price` or full `price_data`.');
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${url.origin}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/cancel`
    });

    return json({ url: session.url });
  } catch (e: any) {
    console.error('Checkout error:', e); // see terminal for the real reason
    return json({ error: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
