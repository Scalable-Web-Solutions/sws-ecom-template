<script>
    import { Clock, Package, Truck } from "lucide-svelte";

</script>
<div class="w-full h-7 bg-gray-100 text-black font-semibold text-lg">
    <div class="flex justify-center items-center gap-20">
        <div class="box flex items-center gap-2">
            <Package/>
            <p>FREE SHIPPING OVER $15</p>
        </div>
        <div class="box flex items-center gap-2">
            <Clock/>
            <p>2 DAY SHIPPING</p>
        </div>
        <div class="box flex items-center gap-2">
            <Truck/>
            <p>30 DAY RETURN</p>
        </div>
    </div>
</div>