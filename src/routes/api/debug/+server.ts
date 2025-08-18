// src/routes/api/debug/+server.ts
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ locals }) => {
  return new Response(JSON.stringify({
    experiments: (locals as any).experiments ?? null,
    anonId: (locals as any).anonId ?? null
  }), { headers: { 'content-type': 'application/json' } });
};