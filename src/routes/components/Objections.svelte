<script lang="ts">
  import { Package, Clock, Truck } from "lucide-svelte";

  // allow overrides if you need different promos per client
  export let items: { icon: "shipping" | "clock" | "truck"; text: string }[] = [
    { icon: "shipping", text: "Free shipping over $15" },
    { icon: "clock",    text: "2-day shipping" },
    { icon: "truck",    text: "30-day returns" }
  ];

  const Icon = (name: string) => {
    switch (name) {
      case "shipping": return Package;
      case "clock":    return Clock;
      case "truck":    return Truck;
      default:         return Package;
    }
  };
</script>

<!-- Promo strip -->
<div class="w-full bg-slate-50 text-slate-800 border-b border-slate-200">
  <div
    class="mx-auto max-w-7xl px-3 h-9 flex items-center justify-center gap-6
           text-[13px] font-medium tracking-tight"
  >
    <!-- wraps to two rows on very small screens -->
    <ul class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {#each items as it, i}
        <li class="flex items-center gap-2">
          {#key it.icon}
            {@const I = Icon(it.icon)}
            <I class="w-4 h-4 text-slate-700" />
          {/key}
          <span class="whitespace-nowrap">{it.text}</span>
        </li>
        {#if i < items.length - 1}
          <span class="hidden sm:inline text-slate-300">|</span>
        {/if}
      {/each}
    </ul>
  </div>
</div>
