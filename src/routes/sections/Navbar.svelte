<script lang="ts">
  import { LogIn, Search, ShoppingCart, Menu, X } from "lucide-svelte";
  import { totalQty } from "$lib/stores/cart";
  import { onMount, onDestroy } from "svelte";

  let showNav = true;
  let lastY = 0;
  let revealTimer: number | undefined;
  let scrolled = false;
  let mobileOpen = false;

  // hide on scroll down, reveal on scroll up / idle
  const onScroll = () => {
    const y = window.scrollY || 0;
    scrolled = y > 4;
    showNav = y <= lastY;
    lastY = y;

    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => (showNav = true), 180);
  };

  const closeMobile = () => (mobileOpen = false);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") mobileOpen = false;
  };

  onMount(() => {
    lastY = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("keydown", onKeydown);
    if (revealTimer) window.clearTimeout(revealTimer);
  });

  const navLink =
    "px-2 py-2 text-sm font-semibold text-slate-900 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded";
</script>

<nav
  aria-label="Primary"
  class="fixed top-0 z-50 w-full transition-transform duration-300"
  style:transform={`translateY(${showNav ? "0" : "-100%"})`}
>
  <!-- promo -->
  <div class="w-full bg-indigo-50 text-indigo-700 text-[13px] font-medium py-1.5 text-center">
    Free shipping on orders over $15
  </div>

  <!-- bar -->
  <div
    class="w-full bg-white/95 backdrop-blur border-b border-slate-200"
    class:shadow-sm={scrolled}
  >
    <div class="container mx-auto h-16 px-4 flex items-center justify-between">
      <!-- left: brand -->
      <a href="/" class="text-xl font-semibold tracking-tight text-slate-900">BrandName</a>

      <!-- center: desktop links -->
      <div class="hidden md:flex items-center gap-6">
        <a class={navLink} href="/collection">Collection</a>
        <a class={navLink} href="/two">Two</a>
        <a class={navLink} href="/three">Three</a>
        <a class={`${navLink} text-indigo-600` } href="/get-started">Get Started</a>
      </div>

      <!-- right: actions -->
      <div class="hidden md:flex items-center gap-5">
        <a aria-label="Search" class="text-slate-700 hover:text-indigo-700" href="/search"><Search /></a>
        <a href="/checkout" class="flex items-center gap-1 text-slate-700 hover:text-indigo-700">
          <ShoppingCart />
          <span class="text-sm font-semibold">{$totalQty}</span>
        </a>
        <a href="/login" class="flex items-center gap-2 text-slate-700 hover:text-indigo-700">
          <LogIn />
          <span class="text-sm font-semibold">Login</span>
        </a>
      </div>

      <!-- mobile trigger -->
      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded border border-slate-200 text-slate-800 hover:text-indigo-700 hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        aria-label="Open menu"
        aria-expanded={mobileOpen}
        on:click={() => (mobileOpen = !mobileOpen)}
      >
        {#if mobileOpen}<X />{:else}<Menu />{/if}
      </button>
    </div>
  </div>

  <!-- mobile sheet -->
  {#if mobileOpen}
    <div
      class="md:hidden fixed inset-0 z-40 bg-black/30"
      on:click={closeMobile}
    />
    <div
      class="md:hidden fixed top-[2.75rem] left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg"
      role="dialog"
      aria-label="Mobile menu"
    >
      <div class="px-4 py-3 flex flex-col gap-1">
        <a class={navLink} href="/collection" on:click={closeMobile}>Collection</a>
        <a class={navLink} href="/two" on:click={closeMobile}>Two</a>
        <a class={navLink} href="/three" on:click={closeMobile}>Three</a>
        <a class={`${navLink} text-indigo-600`} href="/get-started" on:click={closeMobile}>Get Started</a>
        <hr class="my-2 border-slate-200" />
        <a class={navLink} href="/search" on:click={closeMobile}><span class="inline-flex items-center gap-2"><Search /> Search</span></a>
        <a class={navLink} href="/checkout" on:click={closeMobile}><span class="inline-flex items-center gap-2"><ShoppingCart /> Cart ({$totalQty})</span></a>
        <a class={navLink} href="/login" on:click={closeMobile}><span class="inline-flex items-center gap-2"><LogIn /> Login</span></a>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* reserve space so content doesn't jump when nav hides */
  :global(body) {
    padding-top: 5.5rem; /* 1.5rem promo + 4rem bar */
  }
</style>