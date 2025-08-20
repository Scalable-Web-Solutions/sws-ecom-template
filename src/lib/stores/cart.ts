import { writable, derived } from 'svelte/store';

export type CartLine = {
  productId: string;
  priceId: string;
  quantity: number;
};

export const cart = writable<CartLine[]>([]);

export const totalQty = derived(cart, ($c) => $c.reduce((n, i) => n + i.quantity, 0));
