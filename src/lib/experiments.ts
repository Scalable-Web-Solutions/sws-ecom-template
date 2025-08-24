import type { ExperimentsConfig } from "sws-parallel-render-engine";

export const experiments: ExperimentsConfig = {
  ect_hero: {
    id: 'ect_hero',
    variants: ['control', 'Hero', 'HeroAlt'],

    weight: [0.80, 0.10, 0.10],
    botVariant: 'control',
    enabled: true
  },
};