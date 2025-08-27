<script lang="ts">
  import { Experiment } from "sws-parallel-render-engine";
  import type { Writable } from "svelte/store";
  import { getContext, onDestroy } from "svelte";

  // experiments store injected at layout level
  const expStore = getContext<Writable<Record<string, string>>>("experiments");

  let experiments: Record<string, string> = {};
  const unsub = expStore?.subscribe((v) => (experiments = v)) ?? (() => {});
  onDestroy(unsub);

  // normalize experiment key; always have a safe default
  $: current = (experiments.ect_hero || "control").toLowerCase();

  // accent token (swap per brand)
  const accent = "indigo-600";
</script>

<section aria-label="Hero" class="relative isolate h-screen">
  <!-- media -->
  <picture>
    <!-- big screens first -->
    <source
      srcset="
        https://images.unsplash.com/photo-1583300418584-8332e32b710e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0 1x,
      "
      type="image/webp" />
    <source
      srcset="
        https://images.unsplash.com/photo-1583300418584-8332e32b710e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0 1x,
        https://images.unsplash.com/photo-1583300418584-8332e32b710e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0 2x
      "
      type="image/jpeg" />
    <!-- fallback img -->
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="https://images.unsplash.com/photo-1583300418584-8332e32b710e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
      alt="Durable canvas backpack in outdoor light"
      fetchpriority="high"
      decoding="async" />
  </picture>

  <!-- gradient/overlay for legibility -->
  <div
    class="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/35 to-transparent"
    aria-hidden="true" />

  <!-- content -->
  <div class="relative z-10 mx-auto max-w-7xl px-6">
    <div class="grid min-h-[82svh] items-center">
      <div class="max-w-xl text-white">
        <Experiment id="ect_hero" {current} let:current>
          {#if current === "control"}
            <h1 class="text-4xl/tight sm:text-5xl md:text-6xl font-extrabold">
              Quality backpacks, zero compromise
            </h1>
          {:else if current === "hero"}
            <h1 class="text-4xl/tight sm:text-5xl md:text-6xl font-extrabold">
              Carry work, not stress
            </h1>
          {:else}
            <h1 class="text-4xl/tight sm:text-5xl md:text-6xl font-extrabold">
              Built to last. Ready for every day.
            </h1>
          {/if}
          <p class="mt-4 text-lg sm:text-xl text-white/90">
            Back-to-school specials site-wide. <span class="font-semibold">2,400+</span> happy customers and counting.
          </p>
        </Experiment>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/collection"
            data-cta="hero_primary"
            class="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-slate-900 font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
            Find a backpack
          </a>
          <a
            href="/get-started"
            data-cta="hero_secondary"
            class={`inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-3 font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${accent}`}>
            See why we convert better
          </a>
        </div>

        <!-- trust row -->
        <div class="mt-5 flex items-center gap-4 text-white/80">
          <span class="inline-flex items-center gap-2 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="opacity-90"><path d="M12 2l9 4v6c0 5-3.8 9.4-9 10-5.2-.6-9-5-9-10V6l9-4z"/></svg>
            Money-back guarantee
          </span>
          <span class="hidden sm:inline text-sm">•</span>
          <span class="hidden sm:inline text-sm">Free 2-day shipping $50+</span>
        </div>
      </div>
    </div>
  </div>
</section>
