<script>
    import { AppleIcon, Clock, LucideReceiptText, Package, ReceiptEuroIcon } from "lucide-svelte";

</script>
<div class="h-[50vh] bg-white">
    <div class="flex flex-col items-center p-10 h-full">
        <div class="text text-3xl font-bold">
            Our commitment to you
        </div>
        <div class="text font-semibold h-full flex gap-20">
            <div class="flex flex-col items-center justify-center">
                <Package class="w-15 h-15"/>
                <h1 class="text-2xl">Free Shipping*</h1>
                <p class="text-sm">*Free shipping on all orders over $15</p>
            </div>
            <div class="flex flex-col items-center justify-center">
                <Clock class="w-15 h-15"/>
                <h1 class="text-2xl">24/7 Support</h1>
                <p class="text-sm">24/7 support available</p>
            </div>
            <div class="flex flex-col items-center justify-center">
                <LucideReceiptText class="w-15 h-15"/>
                <h1 class="text-2xl">Money Back Guarantee</h1>

                <p class="text-sm">30-day money back guarantee</p>
            </div>
        </div>
        <button class="bg-black text-white px-5 py-2 rounded-full font-semibold mr-[26px]">ORDER NOW</button>
    </div>
</div>