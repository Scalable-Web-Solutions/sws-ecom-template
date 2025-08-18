import { sequence } from '@sveltejs/kit/hooks';
import { experimentHandle } from 'sws-parallel-render-engine';
import type { ExperimentsConfig } from 'sws-parallel-render-engine';
import { experiments as experimentNames } from "$lib/sws-config";

const config: ExperimentsConfig = {
  ect_hero: { id: 'ect_hero', variants: ['control', 'Hero', 'HeroAlt'], enabled: true }
};

const exp = experimentHandle({ config });

export const handle = sequence(exp);