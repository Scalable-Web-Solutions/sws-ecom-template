<script lang="ts">
  import { LogIn, Search, ShoppingCart } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";

  let showNav = true;
  let lastScrollY = 0;
  let timeout: number | null = null;
  let ticking = false; // throttle with rAF

  function getScrollY(): number {
    return typeof window !== "undefined" ? window.scrollY : lastScrollY;
  }

  function updateNav() {
    const currentY = getScrollY();

    // scrolling down -> hide, up -> show
    showNav = currentY <= lastScrollY;
    lastScrollY = currentY;

    // if user stops scrolling for 200ms, show it again
    if (timeout) clearTimeout(timeout);
    if (typeof window !== "undefined") {
      timeout = window.setTimeout(() => {
        showNav = true;
      }, 200);
    }
    ticking = false;
  }

  function handleScroll() {
    if (ticking) return;
    if (typeof window === "undefined") return;
    ticking = true;
    window.requestAnimationFrame(updateNav);
  }

  onMount(() => {
    lastScrollY = getScrollY();
    window.addEventListener("scroll", handleScroll, { passive: true });
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
    }
    if (timeout) clearTimeout(timeout);
  });
</script>

<nav
  class="fixed z-50 top-0 bg-white w-full text-black transition-transform duration-300"
  style:transform={`translateY(${showNav ? "0" : "-100%"})`}
>
  <!-- promo strip -->
  <div class="w-full h-7 bg-blue-500 text-white font-semibold text-sm flex items-center justify-center">
    FREE SHIPPING OVER $15
  </div>

  <!-- 5rem total height minus 1.75rem strip -->
  <div class="container mx-auto flex justify-between items-center h-[calc(7rem-1.75rem)] px-4">
    <div class="font-semibold text-2xl">BrandName</div>

    <div class="flex items-center gap-4 font-semibold">
      <a>ONE</a>
      <a>TWO</a>
      <a>THREE</a>
      <a class="text-blue-500">GET STARTED</a>
    </div>

    <div class="flex items-center gap-6">
      <Search />
      <div class="flex items-center gap-1">
        <ShoppingCart />
        <span>(0)</span>
      </div>
      <div class="flex gap-2 items-center">
        <LogIn />
        <span class="font-semibold">Login</span>
      </div>
    </div>
  </div>
</nav>
