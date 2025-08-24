// src/routes/checkout/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { priceCart } from '$lib/server/priceFromCart';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { redirect, fail } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-07-30.basil' });

export const load: PageServerLoad = async ({ cookies }) => {
  let cart: { priceId: string; quantity: number }[] = [];
  try { cart = JSON.parse(cookies.get('cart') ?? '[]'); } catch {}
  const priced = await priceCart(cart); // { items, subtotal, currency, checkout_line_items }
  return { priced };
};

// Optional but recommended: create session here as an action
export const actions: Actions = {
  checkout: async ({ cookies, url }) => {
    let cart: { priceId: string; quantity: number }[] = [];
    try { cart = JSON.parse(cookies.get('cart') ?? '[]'); } catch {}

    const { checkout_line_items, subtotal } = await priceCart(cart);

    if (!checkout_line_items?.length || subtotal <= 0) {
      return fail(400, { error: 'Cart is empty or invalid' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: checkout_line_items,
      success_url: `${url.origin}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${url.origin}/checkout`
    });

    // SvelteKit redirect to Stripe Checkout
    throw redirect(303, session.url!);
  }
};
