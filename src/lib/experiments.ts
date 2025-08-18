import type { ExperimentsConfig } from "sws-parallel-render-engine";

export const experiments: ExperimentsConfig = {
  ect_hero: {
    id: 'ect_hero',
    variants: ['control', 'Hero', 'HeroAlt'],

    // weight: [0.5, 0.25, 0.25],
    botVariant: 'control',
    enabled: true
  },
};