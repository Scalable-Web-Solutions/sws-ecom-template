<script lang="ts">
  // could come from your store/API
  type Product = {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    image: string;
    badge?: string;       // e.g. "Best Seller"
    rating?: number;      // 0–5
    reviews?: number;
  };

  export let products: Product[] = [
    {
      id: "bts",
      title: "Back to School Bundle",
      subtitle: "Everything you need for a fresh start",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1680039211156-66c721b87625?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
      badge: "Bundle",
      rating: 4.8,
      reviews: 241
    },
    {
      id: "tech",
      title: "Minimalist Tech Pack",
      subtitle: "Clean design, maximum efficiency",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1667411424477-f1492385208f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
      badge: "Best Seller",
      rating: 4.9,
      reviews: 412
    },
    {
      id: "outdoor",
      title: "Adventure Gear Kit",
      subtitle: "Built for trails, travel & tough weather",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1569697008488-e88ca8a71a39?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
      badge: "Top Rated",
      rating: 4.7,
      reviews: 318
    }
  ];

  const money = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

  const accent = "indigo-600"; // swap per brand
</script>

<section class="bg-slate-50 py-16">
  <div class="mx-auto max-w-7xl px-6">
    <!-- Title -->
    <header class="text-center">
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Best Sellers</h2>
      <p class="mt-2 text-slate-600">Customer favorites picked for performance and value</p>
    </header>

    <!-- Grid -->
    <ul
      class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      aria-label="Best selling products"
    >
      {#each products as p}
        <li class="group rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden transition hover:shadow-md">
          <!-- media -->
          <div class="relative">
            <img
              src={p.image}
              alt={p.title}
              class="h-72 w-full object-cover sm:h-80"
              loading="lazy"
              decoding="async"
            />
            {#if p.badge}
              <span class={`absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-${accent} ring-1 ring-slate-200`}>
                {p.badge}
              </span>
            {/if}
          </div>

          <!-- content -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-slate-900">{p.title}</h3>
            <p class="mt-1 text-sm text-slate-600">{p.subtitle}</p>

            <!-- rating / price -->
            <div class="mt-4 flex items-center justify-between">
              {#if p.rating}
                <div class="flex items-center gap-1 text-amber-500">
                  <!-- simple star row (5) with fill based on rating -->
                  {#each Array(5) as _, i}
                    <svg
                      aria-hidden="true"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill={(i + 1) <= Math.round(p.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      stroke-width="1.2"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.463c.967 0 1.37 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.978 8.72c-.783-.57-.379-1.81.588-1.81h3.463a1 1 0 00.95-.69l1.07-3.292z"/>
                    </svg>
                  {/each}
                  <span class="ml-1 text-xs text-slate-500">{p.rating.toFixed(1)} ({p.reviews ?? 0})</span>
                </div>
              {:else}
                <span />
              {/if}

              <span class={`text-lg font-bold text-${accent}`}>{money(p.price)}</span>
            </div>

            <!-- CTA -->
            <div class="mt-5 flex items-center gap-3">
              <a
                href={`/product/${p.id}`}
                class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                View details
              </a>
              <button
                data-cta="add_to_cart"
                class={`inline-flex items-center justify-center rounded-md bg-${accent} px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:shadow-md hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${accent}/40`}
                on:click={() => {/* hook into cart */}}
              >
                Add to cart
              </button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
