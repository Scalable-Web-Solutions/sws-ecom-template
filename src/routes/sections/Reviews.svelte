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
  class="relative w-full h-[50vh] min-h-[360px] bg-blue-500 overflow-hidden flex justify-center items-center flex-col p-10"
  aria-roledescription="carousel"
  aria-label="Customer reviews"
  on:keydown={onKey}
  tabindex="0"
>
<h1 class="text-white text-3xl font-bold text-center">Satisfied Customers!</h1>
  <!-- Slides rail -->
  <div
    bind:this={wrapEl}
    class="h-full flex transition-transform duration-500 will-change-transform"
    style={`transform: translateX(calc(${dragging ? `-${current * 100}% + ${(deltaX / (width || 1)) * 100}%` : `-${current * 100}%`}));`}
    on:pointerdown|passive={onPointerDown}
    on:pointermove|passive={onPointerMove}
    on:pointerup|passive={onPointerUp}
    on:pointercancel|passive={onPointerUp}
    on:touchstart|passive={onPointerDown}
    on:touchmove|passive={onPointerMove}
    on:touchend|passive={onPointerUp}
    on:mouseenter={() => { hovering = true; stop(); }}
    on:mouseleave={() => { hovering = false; start(); }}
  >
    {#each reviews as r, i}
      <article
        class="shrink-0 w-full h-full grid place-items-center px-6"
        aria-roledescription="slide"
        aria-label={`Review ${i + 1} of ${reviews.length}`}
      >
        <div class="max-w-4xl w-full bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm">
          <!-- rating -->
          {#if r.rating}
            <div class="mb-4 flex items-center gap-1 text-yellow-500" aria-label={`Rating: ${r.rating} out of 5`}>
              {#each Array(5) as _, j}
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill={j < (r.rating ?? 0) ? "currentColor" : "none"} stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 2.5l2.472 5.008 5.528.804-4 3.898.944 5.504L10 15.75l-4.944 2.964.944-5.504-4-3.898 5.528-.804L10 2.5z"/>
                </svg>
              {/each}
              {#if r.source}<span class="ml-2 text-sm text-gray-500">via {r.source}</span>{/if}
            </div>
          {/if}

          <p class="text-xl md:text-2xl leading-relaxed text-gray-800">“{r.quote}”</p>

          <div class="mt-6 flex items-center gap-4">
            {#if r.avatar}
              <img src={r.avatar} alt="" class="w-10 h-10 rounded-full object-cover" loading="lazy" />
            {/if}
            <div>
              <div class="font-semibold text-gray-900">{r.name}</div>
              {#if r.role}<div class="text-sm text-gray-500">{r.role}</div>{/if}
            </div>
          </div>
        </div>
      </article>
    {/each}
  </div>

  <!-- Arrows -->
  <button
    class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
    on:click={prev}
    aria-label="Previous review"
  >
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
  </button>
  <button
    class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
    on:click={next}
    aria-label="Next review"
  >
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
  </button>

  <!-- Dots -->
  <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
    {#each reviews as _, i}
      <button
        class={`w-2.5 h-2.5 rounded-full ${i === current ? 'bg-gray-800' : 'bg-gray-400/60'}`}
        aria-label={`Go to review ${i + 1}`}
        aria-current={i === current ? 'true' : 'false'}
        on:click={() => go(i)}
      />
    {/each}
  </div>
</section>
