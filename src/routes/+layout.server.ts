
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    experiments: ((locals as any).experiments) as Record<string, string>,
    anonId: (locals as any).anonId ?? null
  };
};
