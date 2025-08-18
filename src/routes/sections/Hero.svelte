<script lang="ts">
  import { Experiment } from "sws-parallel-render-engine";
  import type { Writable } from 'svelte/store';
  import { getContext, onDestroy } from "svelte";

  const expStore = getContext<Writable<Record<string, string>>>('experiments');

  let experiments: Record<string, string> = {};
  const unsub = expStore?.subscribe((v) => (experiments = v)) ?? (() => {});
  onDestroy(unsub);

  // derive with a fallback so it’s never undefined
  $: current = experiments.ect_hero ?? 'control';
</script>

<div class="h-screen relative z-10 text-white">
  <img class="w-full h-full absolute inset-0 object-cover z-10"
       src="https://images.unsplash.com/photo-1583300418584-8332e32b710e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"/>
  <div class="relative flex z-50 h-full justify-center flex-col">
    <div class="p-20 space-y-3 mt-20">
    <Experiment id="ect_hero" {current} let:current>
        {#if current === "control"}
          <h1 class="text-6xl font-bold">QUALITY BACKPACKS</h1>
        {:else if current === "Hero"}
          <h1 class="text-6xl font-bold">CARRY WORK, NOT STRESS</h1>
        {:else if current === "HeroAlt"}
          <h1 class="text-6xl font-bold">BACKPACKS BUILT TO LAST</h1>
        {/if}
        <p class="text-2xl">Back to school specials, site-wide! <br/>2,400+ happy customers.</p>
    </Experiment>


      <button data-cta="hero_cta" class="bg-white text-black px-5 py-3 rounded-full font-semibold">FIND A BACKPACK</button>
    </div>
  </div>
</div>
