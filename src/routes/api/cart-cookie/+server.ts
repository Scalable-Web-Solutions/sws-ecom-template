import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { cart } = await request.json().catch(() => ({ cart: [] }));
  cookies.set('cart', JSON.stringify(cart ?? []), {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  });
  return new Response('ok');
};
