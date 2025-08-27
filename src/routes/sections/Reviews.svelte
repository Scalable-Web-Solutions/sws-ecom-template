<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type Review = {
    quote: string;
    name: string;
    role?: string;
    avatar?: string;   // URL
    rating?: number;   // 1-5
    source?: string;   // e.g., “Google”, “Shopify”
  };

  export let reviews: Review[] = [];
  export let interval = 5000;      // autoplay interval
  export let autoplay = true;

  let current = 0;
  let timer: number | null = null;
  let hovering = false;
  let reduceMotion = false;

  // drag / swipe
  let wrapEl: HTMLDivElement;
  let width = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  const clampIndex = (i: number) => (i + reviews.length) % reviews.length;
  const next = () => (current = clampIndex(current + 1));
  const prev = () => (current = clampIndex(current - 1));
  const go = (i: number) => (current = clampIndex(i));

  function start() {
    if (!autoplay || reduceMotion || hovering || timer) return;
    timer = window.setInterval(() => next(), interval);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function onPointerDown(e: PointerEvent | TouchEvent) {
    dragging = true;
    stop();
    width = wrapEl?.clientWidth ?? 1;
    startX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = 0;
  }
  function onPointerMove(e: PointerEvent | TouchEvent) {
    if (!dragging) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = x - startX;
  }
  function onPointerUp() {
    if (!dragging) return;
    const threshold = Math.min(120, width * 0.12);
    if (deltaX > threshold) prev();
    else if (deltaX < -threshold) next();
    deltaX = 0;
    dragging = false;
    start();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  onMount(() => {
    reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  });

  onDestroy(() => stop());
</script>

<!-- Wrapper -->
<section 
  class="relative w-full min-h-[420px] bg-gradient-to-r from-indigo-600 to-blue-600 flex flex-col items-center justify-center px-6 py-12"
  aria-roledescription="carousel"
  aria-label="Customer reviews"
  aria-live="polite"
  tabindex="0"
>
  <h2 class="text-white text-3xl sm:text-4xl font-bold mb-8">Satisfied Customers!</h2>

  <!-- Review cards -->
  <div class="relative w-full max-w-4xl overflow-hidden">
    <div
      bind:this={wrapEl}
      class="flex transition-transform duration-500"
      style={`transform: translateX(${dragging 
        ? `calc(-${current * 100}% + ${(deltaX / (width || 1)) * 100}%)` 
        : `-${current * 100}%`});`}
      on:pointerdown|passive={onPointerDown}
      on:pointermove|passive={onPointerMove}
      on:pointerup|passive={onPointerUp}
    >
      {#each reviews as r, i}
        <article class="shrink-0 w-full px-4" aria-roledescription="slide">
          <div class="bg-white rounded-xl p-8 shadow hover:shadow-md transition">
            {#if r.rating}
              <div class="flex items-center gap-2 mb-4 text-yellow-500">
                {#each Array(5) as _, j}
                  <svg class="w-5 h-5" fill={j < r.rating ? "currentColor" : "none"} stroke="currentColor" />
                {/each}
                <span class="text-sm text-gray-500">{r.rating.toFixed(1)}/5</span>
                {#if r.source}<span class="ml-2 text-sm text-gray-400">via {r.source}</span>{/if}
              </div>
            {/if}
            <p class="text-lg sm:text-xl italic text-gray-800">“{r.quote}”</p>
            <div class="mt-6 flex items-center gap-3">
              <img src={r.avatar || "/default-avatar.png"} alt="" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <div class="font-semibold text-gray-900">{r.name}</div>
                {#if r.role}<div class="text-sm text-gray-500">{r.role}</div>{/if}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>

  <!-- Dots / arrows remain same -->
</section>
