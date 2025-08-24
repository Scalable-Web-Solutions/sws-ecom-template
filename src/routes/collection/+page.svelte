<script lang="ts">
    import { addToCart } from '$lib/stores/cart';
    export let data: { catalog: import('$lib/server/catalog').CatalogItem[] };
</script>

<div class="w-full mx-auto text-black h-auto bg-gray-100">

    <div class="text mt-30 w-full">
        <div class="container max-w-7xl mx-auto mt-30 p-5">
            <div class="text">
                <h1 class="text-3xl font-bold">Collection</h1>
            </div>
            <div class="products grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">

                {#each data.catalog as product}
                    <div class="product w-full p-1 rounded-md">
                        <img class="size-80 object-cover" src={product.image} alt={product.name} />

                        <h2 class="text-lg font-bold">{product.name}</h2>
                        <p class="text-sm text-gray-500">{product.description}</p>
                        <p class="text-lg font-bold">${(product.unit_amount/100).toFixed(2)}</p>
                        <button on:click={() => addToCart({ productId: product.productId, priceId: product.priceId, quantity: 1 })} class="bg-black text-white px-4 py-2 rounded-md w-full">Add to Cart</button>

                    </div>
                {/each}

            </div>
        </div>
    </div>
</div>