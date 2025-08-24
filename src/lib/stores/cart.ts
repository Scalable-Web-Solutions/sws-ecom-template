import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';

export type CartLine = { productId: string; priceId: string; quantity: number };

const KEY = 'cart_v1';

function loadInitial(): CartLine[] {
  if (!browser) return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

const _cart = writable<CartLine[]>(loadInitial());

if (browser) {
  _cart.subscribe(v => localStorage.setItem(KEY, JSON.stringify(v)));
}

export const cart = _cart;

export function addToCart(line: CartLine) {
  cart.update(items => {
    const idx = items.findIndex(i => i.priceId === line.priceId);
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + (line.quantity || 1) };
      return [...items];
    }
    return [...items, { ...line, quantity: line.quantity || 1 }];
  });
}

export function setQty(priceId: string, qty: number) {
  cart.update(items => {
    if (qty <= 0) return items.filter(i => i.priceId !== priceId);
    const idx = items.findIndex(i => i.priceId === priceId);
    if (idx > -1) items[idx] = { ...items[idx], quantity: qty };
    return [...items];
  });
}

export function removeFromCart(priceId: string) {
  cart.update(items => items.filter(i => i.priceId !== priceId));
}

export function clearCart() {
  cart.set([]);
}

if (browser) {
  let t: number | undefined;
  cart.subscribe((v) => {
    localStorage.setItem(KEY, JSON.stringify(v));
    clearTimeout(t);
    t = window.setTimeout(() => {
      fetch('/api/cart-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: v })
      });
    }, 150);
  });
}

export const totalQty = derived(cart, ($c) => $c.reduce((n, i) => n + (i.quantity || 0), 0));