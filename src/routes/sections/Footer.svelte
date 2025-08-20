<script lang="ts">
  // Svelte 5-friendly props
  const { brand = 'BrandName', year = new Date().getFullYear() } =
    $props<{ brand?: string; year?: number }>();

  // Edit these to match the store
  const cols = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'New Arrivals', href: '/new' },
        { label: 'Best Sellers', href: '/best-sellers' },
        { label: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Shipping & Returns', href: '/shipping-returns' },
        { label: 'Warranty', href: '/warranty' },
        { label: 'Order Tracking', href: '/track' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Affiliates', href: '/affiliates' }
      ]
    }
  ];

  const socials = [
    { name: 'Instagram', href: 'https://instagram.com', icon: 'M12 2.2c3.2 0 3.6 0 4.9.1...' },
    { name: 'Twitter', href: 'https://x.com', icon: 'M22 5.9c-.8.4-1.7.7-2.6.8...' },
    { name: 'Facebook', href: 'https://facebook.com', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'M10 15l5.2-3L10 9v6z M23 7s-.2-1.7-.9-2.4...' }
  ];

  function submitNewsletter(e: SubmitEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const email = String(fd.get('email') || '').trim();
    if (!email) return;
    // Hook into your analytics + backend
    window.analytics?.trackEvent?.('newsletter_optin', { email });
    (e.target as HTMLFormElement).reset();
  }
</script>

<footer class="bg-[#0B1220] text-white mt-24">
  <!-- top -->
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-14">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- brand + newsletter -->
      <div class="md:col-span-1">
        <a href="/" class="inline-flex items-center gap-2 group">
          <div class="h-9 w-9 rounded-lg bg-white/10 grid place-items-center group-hover:bg-white/15 transition">
            <!-- simple logo mark -->
            <div class="h-4 w-4 rounded-sm bg-white/90"></div>
          </div>
          <span class="text-2xl font-bold tracking-tight">{brand}</span>
        </a>

        <p class="mt-4 text-white/70 max-w-xs">
          Bags built for work, travel, and everyday carry. Designed to last, priced to love.
        </p>

        <form class="mt-6 flex items-center gap-3" on:submit={submitNewsletter}>
          <label class="sr-only" for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            placeholder="Your email"
            class="w-full max-w-xs rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            class="rounded-lg bg-white text-[#0B1220] px-4 py-2 font-semibold hover:bg-white/90"
            type="submit"
            data-cta="newsletter_subscribe"
          >
            Join
          </button>
        </form>

        <div class="mt-5 flex items-center gap-3">
          {#each socials as s}
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label={s.name}
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d={s.icon} />
              </svg>
            </a>
          {/each}
        </div>
      </div>

      <!-- link columns -->
      {#each cols as col}
        <nav class="md:col-span-1">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-white/70">{col.title}</h3>
          <ul class="mt-4 space-y-3">
            {#each col.links as l}
              <li>
                <a href={l.href} class="text-white/90 hover:text-white transition">{l.label}</a>
              </li>
            {/each}
          </ul>
        </nav>
      {/each}
    </div>

    <!-- payment & trust -->
    <div class="mt-12 border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3 text-white/70 text-sm">
        <svg class="w-10 h-6" viewBox="0 0 40 24" fill="none"><rect width="40" height="24" rx="4" fill="#fff"/><rect x="3" y="6" width="34" height="12" rx="2" fill="#0B1220"/></svg>
        <svg class="w-10 h-6" viewBox="0 0 40 24" fill="none"><rect width="40" height="24" rx="4" fill="#fff"/><circle cx="15" cy="12" r="6" fill="#F59E0B"/><circle cx="25" cy="12" r="6" fill="#EF4444" fill-opacity=".8"/></svg>
        <svg class="w-10 h-6" viewBox="0 0 40 24" fill="none"><rect width="40" height="24" rx="4" fill="#111827"/><rect x="7" y="7" width="26" height="10" rx="2" fill="#fff"/></svg>
        <span class="ml-2">Secure checkout</span>
      </div>

      <div class="flex items-center gap-3 text-white/70 text-sm">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 4v6c0 5-3.8 9.7-9 10-5.2-.3-9-5-9-10V6l9-4z"/></svg>
        <span>30-day money-back guarantee</span>
      </div>
    </div>
  </div>

  <!-- bottom bar -->
  <div class="border-t border-white/10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <p class="text-white/60 text-sm">© {year} {brand}. All rights reserved.</p>
      <div class="flex items-center gap-5 text-sm">
        <a class="text-white/70 hover:text-white" href="/privacy">Privacy</a>
        <a class="text-white/70 hover:text-white" href="/terms">Terms</a>
        <a class="text-white/70 hover:text-white" href="/accessibility">Accessibility</a>
        <span class="inline-flex items-center gap-2 text-white/70">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17.9V14h4.6a8.1 8.1 0 01-4.6 5.9zM6.4 14H11v5.9A8.1 8.1 0 016.4 14zM11 4.1V10H6.4A8.1 8.1 0 0111 4.1zM12 4.1A8.1 8.1 0 0116.6 10H13V4.1z"/></svg>
          United States
        </span>
      </div>
    </div>
  </div>
</footer>
