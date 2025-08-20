<script lang="ts">
  type Product = {
    id: string;
    name: string;
    priceCents: number;
    image: string;
  };

  export let title: string = 'Best Sellers';
  export let products: Product[] = [];
  export let onAdd: ((id: string) => void) | null = null;

  let scroller: HTMLDivElement;

  const fmt = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  function pageWidth() {
    // Width of exactly one visible "page" (viewport of scroller)
    return scroller?.clientWidth ?? 0;
  }

  function prev() {
    scroller?.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
  }
  function next() {
    scroller?.scrollBy({ left: pageWidth(), behavior: 'smooth' });
  }

  function add(id: string) {
    onAdd ? onAdd(id) : console.log('addToCart', id);
  }
</script>

<section class="w-full bg-white">
  <!-- header -->
  <div class=" w-full px-4 sm:px-6 md:px-8 flex items-center justify-between py-6">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
    <div class="flex gap-2">
      <button class="nav-btn" on:click={prev} aria-label="Previous">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button class="nav-btn" on:click={next} aria-label="Next">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>

  <!-- scroller -->
  <div class="w-full px-4 sm:px-6 md:px-8">
    <div
      bind:this={scroller}
      class="snap-x snap-mandatory overflow-x-auto overflow-y-hidden no-scrollbar"
      tabindex="0"
      aria-label="Product carousel"
    >
      <!-- track (grid columns equal to item width via CSS var) -->
      <div class="track">
        {#each products as p (p.id)}
          <article class="card snap-start">
            <div class="img-wrap">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                on:error={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
              />
            </div>
            <div class="p-4">
              <h3 class="name">{p.name}</h3>
              <div class="price">{fmt(p.priceCents)}</div>
              <button class="add" on:click={() => add(p.id)} data-cta="add_to_cart">Add to cart</button>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* Hide scrollbar without breaking scroll */
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* Responsive: how many items per view. We set a CSS var that defines column width */
  :root { --items: 4; }
  @media (max-width: 1279px) { :root { --items: 3; } }
  @media (max-width: 1023px) { :root { --items: 2; } }
  @media (max-width: 639px)  { :root { --items: 1; } }

  /* Track uses CSS grid with auto-columns equal to (viewport - total gaps)/items */
  .track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - var(--gap-total)) / var(--items));
    column-gap: var(--gap);
    /* gap config */
    --gap: 1.5rem;                 /* 24px, similar to gap-6 */
    --gap-total: calc((var(--items) - 1) * var(--gap));
    padding-bottom: 0.25rem;       /* keeps shadows visible */
  }

  .card {
    height: 50vh;
    min-height: 360px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;           /* rounded-2xl */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 2px rgba(0,0,0,.04);
  }

  /* image area keeps consistent height via aspect ratio (fills remaining space) */
  .img-wrap {
    position: relative;
    flex: 1 1 auto;
    background: #f3f4f6;          /* subtle gray if image fails */
  }
  .img-wrap img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }

  .name {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  }
  .price {
    margin-top: .25rem;
    color: #2563eb;
    font-weight: 700;
  }
  .add {
    margin-top: .75rem;
    width: 100%;
    background: #111827;
    color: white;
    border-radius: .5rem;
    padding: .5rem .75rem;
    font-weight: 600;
  }
  .add:hover { background: #0b1220; }

  /* scroll-snap */
  .snap-x { scroll-snap-type: x mandatory; }
  .snap-start { scroll-snap-align: start; }

  /* arrows */
  .nav-btn {
    background: #fff;
    border: 1px solid #e5e7eb;
    padding: .5rem;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0,0,0,.08);
  }
  .nav-btn:hover { background: #f9fafb; }
</style>
