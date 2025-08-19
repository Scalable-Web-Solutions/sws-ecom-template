<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  // import { addToCart as addToCartStore } from '$lib/cart';

  export type Product = {
    id: string;
    name: string;
    priceCents: number;
    image: string;
  };

  export let products: Product[] = [];
  export let autoplay = false;
  export let interval = 5000;
  export let fixedItemsPerView: number | null = null; // if set, overrides responsive
  export let onAdd: ((id: string) => void) | null = null;

  const fmt = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  let container: HTMLDivElement;
  let track: HTMLDivElement;

  let itemsPerView = 4;
  const gapPx = 24; // gap-6
  let index = 0;
  let maxIndex = 0;

  // deterministic card width in px
  let itemWidth = 0;

  // autoplay
  let timer: number | null = null;
  let hovering = false;

  // drag/swipe
  let dragging = false;
  let startX = 0;
  let deltaX = 0;
  let wrapWidth = 1;

  // --- sizing helpers (fixed version) ---
  function getContainerPadding() {
    if (!container) return 0;
    const cs = getComputedStyle(container);
    return parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
  }

  function calcResponsive() {
    const w = container?.clientWidth ?? 0;

    if (fixedItemsPerView) {
      itemsPerView = Math.max(1, Math.min(fixedItemsPerView, 4));
    } else {
      itemsPerView = w < 640 ? 1 : w < 1024 ? 2 : w < 1280 ? 3 : 4;
    }

    const innerW = Math.max(0, w - getContainerPadding());
    const totalGap = gapPx * (itemsPerView - 1);
    itemWidth = Math.max(0, (innerW - totalGap) / itemsPerView);

    maxIndex = Math.max(0, products.length - itemsPerView);
    index = Math.min(index, maxIndex);
  }

  function calcIndexTranslatePx() {
    return Math.max(0, index) * (itemWidth + gapPx);
  }
  function calcDragTranslatePx() {
    const base = calcIndexTranslatePx();
    return `${-base + -deltaX}px`;
  }

  // autoplay
  function start() {
    if (!autoplay || hovering || timer || maxIndex === 0) return;
    timer = window.setInterval(() => {
      index = index >= maxIndex ? 0 : index + 1;
    }, interval);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function prev() { index = Math.max(0, index - 1); }
  function next() { index = Math.min(maxIndex, index + 1); }

  function handleAdd(id: string) {
    if (onAdd) onAdd(id);
    // else addToCartStore(id, 1);
  }

  // dragging
  function onDown(e: PointerEvent | TouchEvent) {
    dragging = true;
    stop();
    wrapWidth = container?.clientWidth || 1;
    startX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = 0;
  }
  function onMove(e: PointerEvent | TouchEvent) {
    if (!dragging) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
    deltaX = x - startX;
  }
  function onUp() {
    if (!dragging) return;
    const threshold = Math.min(100, wrapWidth * 0.08);
    if (deltaX > threshold) prev();
    else if (deltaX < -threshold) next();
    deltaX = 0;
    dragging = false;
    start();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  }

  let ro: ResizeObserver | null = null;
  onMount(() => {
    calcResponsive();
    ro = new ResizeObserver(() => calcResponsive());
    if (container) ro.observe(container);
    start();
    return () => {
      stop();
      ro?.disconnect();
    };
  });

  onDestroy(stop);
</script>

<section
  class="relative w-full h-[50vh] min-h-[360px] bg-white"
  aria-label="Products"
  on:keydown={onKey}
  tabindex="0"
>
  <div
    class="h-full px-4 sm:px-6 md:px-8"
    bind:this={container}
    on:pointerdown|passive={onDown}
    on:pointermove|passive={onMove}
    on:pointerup|passive={onUp}
    on:pointercancel|passive={onUp}
    on:touchstart|passive={onDown}
    on:touchmove|passive={onMove}
    on:touchend|passive={onUp}
    on:mouseenter={() => { hovering = true; stop(); }}
    on:mouseleave={() => { hovering = false; start(); }}
  >
    <!-- Track -->
    <div
      bind:this={track}
      class="h-full flex gap-6 transition-transform duration-500 will-change-transform"
      style={`transform: translateX(${dragging ? calcDragTranslatePx() : `-${calcIndexTranslatePx()}px`});`}
    >
      {#each products as p}
        <article
          class="shrink-0 h-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={`width:${itemWidth}px`}
        >
          <!-- image area keeps consistent row height -->
          <div class="relative w-full flex-1">
            <img
              src={p.image}
              alt={p.name}
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div class="p-4">
            <h3 class="text-base font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
            <div class="mt-1 text-blue-600 font-bold">{fmt(p.priceCents)}</div>
            <button
              class="mt-3 w-full rounded-lg bg-black text-white py-2 text-sm font-semibold hover:bg-gray-900"
              on:click={() => handleAdd(p.id)}
            >
              Add to cart
            </button>
          </div>
        </article>
      {/each}
    </div>
  </div>

  <!-- Arrows -->
  {#if maxIndex > 0}
    <button
      class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
      on:click={prev}
      aria-label="Previous products"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow p-2 hover:bg-white"
      on:click={next}
      aria-label="Next products"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>
  {/if}
</section>

<style>
  /* clamp long product names */
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
</style>
