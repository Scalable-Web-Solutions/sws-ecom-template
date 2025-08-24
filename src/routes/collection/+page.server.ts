import type { PageServerLoad } from './$types';
import { getCatalog } from '$lib/server/catalog';

export const load: PageServerLoad = async () => {
  const catalog = await getCatalog();
  return { catalog };
};
