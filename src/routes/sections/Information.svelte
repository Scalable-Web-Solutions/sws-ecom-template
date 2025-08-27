<script>
  import { Package, Clock, Receipt, ShieldCheck } from "lucide-svelte";
</script>

<section class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
  <div class="max-w-6xl mx-auto px-6 text-center">
    <!-- Heading -->
    <h2 class="text-3xl sm:text-4xl font-bold mb-12">Our Commitment to You</h2>

    <!-- Features -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
      <div class="flex flex-col items-center space-y-3">
        <Package class="w-12 h-12" />
        <h3 class="text-xl font-semibold">Free Shipping*</h3>
        <p class="text-sm text-white/90">On all orders over $15</p>
      </div>

      <div class="flex flex-col items-center space-y-3">
        <Clock class="w-12 h-12" />
        <h3 class="text-xl font-semibold">24/7 Support</h3>
        <p class="text-sm text-white/90">Always available for you</p>
      </div>

      <div class="flex flex-col items-center space-y-3">
        <Receipt class="w-12 h-12" />
        <h3 class="text-xl font-semibold">Money Back Guarantee</h3>
        <p class="text-sm text-white/90">30-day hassle-free returns</p>
      </div>
    </div>

    <!-- CTA -->
    <a
      href="/collection"
      data-cta="commitment_cta"
      class="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-blue-700 font-semibold shadow-lg hover:bg-slate-100 transition"
    >
      Order Now
    </a>
  </div>
</section>
