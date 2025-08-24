<!-- src/routes/checkout/+page.svelte -->
<script lang="ts">
  export let data: {
    priced: {
      items: {
        name: string;
        quantity: number;
        line_total: number;
        unit_amount?: number; // optional, if you return it
        image?: string;       // optional, if you return it
      }[];
      subtotal: number;
      currency: string;
    }
  };

  $: pricing = data.priced;

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: pricing.currency?.toUpperCase?.() || 'USD'
    });
</script>

<div class="min-h-[100vh] bg-gray-50">
  <div class="mx-auto max-w-6xl px-4 py-10 mt-30">
    <h1 class="text-3xl font-bold tracking-tight">Checkout</h1>
    {#if pricing.items.length === 0}
      <div class="mt-8 rounded-xl bg-white p-8 shadow-sm">
        <p class="text-gray-600">Your cart is empty.</p>
        <a href="/" class="mt-4 inline-block text-blue-600 font-medium hover:underline">Continue shopping →</a>
      </div>
    {:else}
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart list -->
        <section class="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Your Items</h2>
            <a href="/collection" class="text-sm text-blue-600 hover:underline">Continue shopping</a>
          </div>

          <div class="divide-y">
            {#each pricing.items as i}
              <div class="py-4 flex items-center gap-4">
                <!-- Optional thumbnail -->
                {#if i.image}
                  <img src={i.image} alt={i.name} class="h-16 w-16 rounded-md object-cover border" />
                {:else}
                  <div class="h-16 w-16 rounded-md bg-gray-100 border grid place-items-center text-xs text-gray-500">No image</div>
                {/if}

                <div class="flex-1">
                  <p class="font-medium">{i.name}</p>
                  <p class="text-sm text-gray-500">Qty: {i.quantity}</p>
                </div>
                <div class="text-right">
                  {#if i.unit_amount !== undefined}
                    <p class="text-sm text-gray-500">{fmt(i.unit_amount)} each</p>
                  {/if}
                  <p class="font-semibold">{fmt(i.line_total)}</p>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Summary / Pay -->
        <aside class="lg:col-span-1 rounded-xl bg-white p-6 shadow-sm h-fit">
          <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">{fmt(pricing.subtotal)}</span>
            </div>
            <!-- Add taxes/shipping when you compute them server-side -->
            <div class="flex justify-between">
              <span class="text-gray-600">Estimated tax</span>
              <span class="font-medium">—</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">—</span>
            </div>
            <div class="border-t pt-3 flex justify-between text-base">
              <span class="font-semibold">Total</span>
              <span class="font-semibold">{fmt(pricing.subtotal)}</span>
            </div>
          </div>

          <form method="POST" action="?/checkout" class="mt-6">
            <button
              class="w-full bg-black text-white px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Pay {fmt(pricing.subtotal)}
            </button>
          </form>

          <p class="mt-3 text-xs text-gray-500">
            By continuing, you agree to our Terms & Refund Policy.
          </p>
        </aside>
      </div>
    {/if}
  </div>
</div>
