<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  type Product = {
    id: string;
    name: string;
    priceCents: number;
    image: string;
    badge?: string; // optional "Best Seller", etc.
  };

  export let title: string = "Best Sellers";
  export let products: Product[] = [];
  export let onAdd: ((id: string) => void) | null = null;

  // theme tokens (swap per brand)
  export let accent = "#4f46e5";     // indigo-600
  export let priceColor = "#2563eb"; // blue-600

  let scroller: HTMLDivElement;
  let canPrev = false;
  let canNext = false;

  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  // width of the visible viewport for paging
  const pageWidth = () => scroller?.clientWidth ?? 0;

  function updateArrows() {
    if (!scroller) return;
    // allow for sub-pixel differences
    canPrev = scroller.scrollLeft > 2;
    const max = scroller.scrollWidth - scroller.clientWidth - 2;
    canNext = scroller.scrollLeft < max;
  }

  function prev() {
    if (!scroller) return;
    scroller.scrollBy({ left: -pageWidth(), behavior: "smooth" });
  }
  function next() {
    if (!scroller) return;
    scroller.scrollBy({ left: pageWidth(), behavior: "smooth" });
  }

  function add(id: string) {
    onAdd ? onAdd(id) : console.log("addToCart", id);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  function onWheel(e: WheelEvent) {
    // convert vertical wheel to horizontal scroll for trackpads/mice
    if (!e.ctrlKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scroller?.scrollBy({ left: e.deltaY, behavior: "auto" });
    }
  }

  let resizeObs: ResizeObserver | null = null;

  onMount(() => {
    // initial state
    updateArrows();

    // keep arrows in sync on scroll/resize
    const onScroll = () => updateArrows();
    scroller?.addEventListener("scroll", onScroll, { passive: true });

    // robust resize detection (container width changes with breakpoints)
    if ("ResizeObserver" in window) {
      resizeObs = new ResizeObserver(() => updateArrows());
      resizeObs.observe(scroller);
    } else {
      window.addEventListener("resize", updateArrows);  
    }

    return () => {
      scroller?.removeEventListener("scroll", onScroll);
      resizeObs?.disconnect();
      if (!("ResizeObserver" in window)) window.removeEventListener("resize", updateArrows);
    };
  });

  onDestroy(() => {
    resizeObs?.disconnect();
  });
</script>

<section class="w-full bg-white" aria-labelledby="carousel-title">
  <!-- header -->
  <div class="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between py-6">
    <h2 id="carousel-title" class="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>

    <div class="flex gap-2">
      <button
        class="nav-btn"
        class:disabled={!canPrev}
        aria-label="Previous products"
        on:click={prev}
        disabled={!canPrev}
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="nav-btn"
        class:disabled={!canNext}
        aria-label="Next products"
        on:click={next}
        disabled={!canNext}
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>

  <!-- scroller -->
  <div class="w-full px-4 sm:px-6 md:px-8">
    <div
      bind:this={scroller}
      class="snap-x snap-mandatory overflow-x-auto overflow-y-hidden no-scrollbar relative"
      tabindex="0"
      role="region"
      aria-label="Product carousel"
      on:keydown={onKey}
      on:wheel|passive={onWheel}
    >
      <!-- gradient scroll hints -->
      <div class="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"></div>

      <!-- track -->
      <div class="track">
        {#if products.length === 0}
          <!-- skeletons when no data -->
          {#each Array(4) as _, i}
            <div class="card skeleton">
              <div class="img-wrap skeleton-media"></div>
              <div class="p-4">
                <div class="skeleton-line w-2/3"></div>
                <div class="skeleton-line w-1/3 mt-2"></div>
                <div class="skeleton-btn mt-3"></div>
              </div>
            </div>
          {/each}
        {:else}
          {#each products as p (p.id)}
            <article class="card snap-start" aria-roledescription="slide" aria-label={p.name}>
              <div class="img-wrap">
                {#if p.badge}
                  <span class="badge">{p.badge}</span>
                {/if}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  on:error={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                />
              </div>
              <div class="p-4">
                <h3 class="name">{p.name}</h3>
                <div class="price" style={`color:${priceColor}`}>{fmt(p.priceCents)}</div>
                <button
                  class="add"
                  style={`background:${accent}`}
                  on:click={() => add(p.id)}
                  data-cta="add_to_cart"
                  aria-label={`Add ${p.name} to cart`}
                >
                  Add to cart
                </button>
              </div>
            </article>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  /* hide scrollbar without killing scroll */
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* responsive: items per view (grid auto-columns == one card) */
  :root { --items: 4; }
  @media (max-width: 1279px) { :root { --items: 3; } }
  @media (max-width: 1023px) { :root { --items: 2; } }
  @media (max-width: 639px)  { :root { --items: 1; } }

  /* spacing */
  .track {
    display: grid;
    grid-auto-flow: column;
    --gap: 1.25rem;
    column-gap: var(--gap);
    /* auto column width so exactly --items are visible */
    --gap-total: calc((var(--items) - 1) * var(--gap));
    grid-auto-columns: calc((100% - var(--gap-total)) / var(--items));
    padding: 0 0 .25rem 0; /* keep shadows visible at bottom */
  }

  .card {
    height: 50vh;
    min-height: 360px;
    background: #ffffff;
    border: 1px solid #e5e7eb; /* slate-200 */
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 2px rgba(0,0,0,.04);
    transition: box-shadow .2s ease, transform .2s ease;
  }
  .card:hover { box-shadow: 0 6px 18px rgba(17,24,39,.08); transform: translateY(-2px); }

  .img-wrap {
    position: relative;
    flex: 1 1 auto;
    background: #f3f4f6; /* slate-100 fallback */
  }
  .img-wrap img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
  .badge {
    position: absolute; left: .75rem; top: .75rem;
    background: rgba(255,255,255,.92);
    backdrop-filter: saturate(180%) blur(2px);
    border: 1px solid #e5e7eb;
    font-size: 12px; font-weight: 700;
    color: #111827;
    padding: .15rem .5rem;
    border-radius: 9999px;
  }

  .name {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a; /* slate-900 */
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  }
  .price {
    margin-top: .25rem;
    font-weight: 700;
  }
  .add {
    margin-top: .75rem;
    width: 100%;
    color: #fff;
    border-radius: .5rem;
    padding: .55rem .8rem;
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0,0,0,.08);
    transition: filter .15s ease, transform .15s ease;
  }
  .add:hover { filter: brightness(0.95); }
  .add:focus-visible {
    outline: 2px solid #0000;
    box-shadow: 0 0 0 3px rgba(79,70,229,.4);
  }

  /* scroll snap */
  .snap-x { scroll-snap-type: x mandatory; }
  .snap-start { scroll-snap-align: start; }

  /* arrows */
  .nav-btn {
    background: #fff;
    border: 1px solid #e5e7eb;
    padding: .5rem;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0,0,0,.08);
    transition: background .15s ease, transform .15s ease;
  }
  .nav-btn:hover { background: #f9fafb; }
  .nav-btn:focus-visible { outline: 0; box-shadow: 0 0 0 3px rgba(79,70,229,.35); }
  .nav-btn.disabled,
  .nav-btn[disabled] {
    opacity: .4; cursor: not-allowed;
  }

  /* skeletons for empty/loading state */
  .skeleton { background: #f9fafb; border-color: #eef2f7; }
  .skeleton-media { height: 60%; background: linear-gradient(90deg,#f1f5f9,#f8fafc,#f1f5f9); background-size: 200% 100%; animation: pulse 1.3s infinite; }
  .skeleton-line { height: .9rem; border-radius: .35rem; background: #e5e7eb; }
  .skeleton-btn { height: 2.25rem; border-radius: .5rem; background: #e5e7eb; }
  @keyframes pulse { 0%{background-position:0 0} 100%{background-position:200% 0} }
</style>
