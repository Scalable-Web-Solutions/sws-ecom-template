import Stripe from 'stripe';
import { error, redirect } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { Buffer } from 'buffer';
import type { PageServerLoad } from '../$types';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });

const ALLOWED_PRICES = new Set(['price_1Rxx5uIJ90jjf7chHo5UTegX']);

export const load: PageServerLoad = async ({ params, cookies }) => {
  const sessionId = params.id;
  if (!sessionId) throw redirect(303, '/');

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price']
  });

  // Must be paid
  if (session.payment_status !== 'paid') throw redirect(303, '/');

  const purchasedPriceIds =
    session.line_items?.data
      .map((li) => (li.price as Stripe.Price | null)?.id)
      .filter(Boolean) as string[] || [];

  // Ensure they bought what this page is for
  const entitled = purchasedPriceIds.some((id) => ALLOWED_PRICES.has(id));
  if (!entitled) throw error(403, 'Not entitled for this product.');

  // OPTIONAL: issue a short-lived cookie/token your protected pages can check
  // e.g., a simple signed token containing the price ids (use JWT/HMAC in a real app)
  const token = Buffer.from(JSON.stringify({ prices: purchasedPriceIds, ts: Date.now() })).toString('base64');
  cookies.set('entitled', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 15 // 15 minutes
  });

  return {
    email: session.customer_details?.email ?? null,
    prices: purchasedPriceIds
  };
};
