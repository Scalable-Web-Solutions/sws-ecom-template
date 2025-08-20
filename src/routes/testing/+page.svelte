<script lang="ts">
  async function checkout() {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          // Use a real Price ID from Stripe Dashboard (test mode)
          { price: 'price_1Rxx5uIJ90jjf7chHo5UTegX', quantity: 1 }
          // OR use price_data:
          // {
          //   price_data: {
          //     currency: 'usd',
          //     product_data: { name: 'My Product' },
          //     unit_amount: 1999
          //   },
          //   quantity: 1
          // }
        ]
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Checkout failed:', data);
      alert(data.error ?? 'Checkout failed');
      return;
    }

    window.location.href = data.url;
  }
</script>

<button on:click={checkout} class="bg-black text-white px-4 py-2 rounded">Checkout</button>
