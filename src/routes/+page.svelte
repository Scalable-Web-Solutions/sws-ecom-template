<script lang='ts'>
    import NavCta from "./components/NavCta.svelte";
    import Objections from "./components/Objections.svelte";
    import Footer from "./sections/Footer.svelte";
    import Hero from "./sections/Hero.svelte";
    import Information from "./sections/Information.svelte";
    import Navbar from "./sections/Navbar.svelte";
    import ProductCarousel from "./sections/ProductCarousel.svelte";
    import ProductTaste from "./sections/ProductTaste.svelte";
    import Reviews from "./sections/Reviews.svelte";

    const reviews = [
        {
            quote: "I love this product! It's so easy to use and the results are amazing.",
            name: "John Doe",
            role: "Customer",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5
        },
        {
            quote: "I love this product! It's so easy to use and the results are amazing.",
            name: "John Doe",
            role: "Customer",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5
        },
        {
            quote: "I love this product! It's so easy to use and the results are amazing.",
            name: "John Doe",
            role: "Customer",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5
        },
    ]

    const products = [
    {
      id: 'backpack_school',
      name: 'Back to School Bundle',
      priceCents: 4999,
      image: 'https://images.unsplash.com/photo-1680039211156-66c721b87625?q=80&w=1000&auto=format'
    },
    {
      id: 'backpack_minimal',
      name: 'Minimalist Tech Pack',
      priceCents: 12999,
      image: 'https://images.unsplash.com/photo-1667411424477-f1492385208f?q=80&w=1200&auto=format'
    },
    {
      id: 'backpack_outdoor',
      name: 'Adventure Gear Kit',
      priceCents: 8999,
      image: 'https://images.unsplash.com/photo-1569697008488-e88ca8a71a39?q=80&w=900&auto=format'
    },
    {
      id: 'sling_daily',
      name: 'Daily Sling',
      priceCents: 3999,
      image: 'https://images.unsplash.com/photo-1604176354204-926a0f7d2d0c?q=80&w=1000&auto=format'
    },
    {
      id: 'camera_cube',
      name: 'Camera Cube',
      priceCents: 5999,
      image: 'https://images.unsplash.com/photo-1526178611012-1b4568d5d5c6?q=80&w=1000&auto=format'
    }
  ];
</script>
<NavCta/>
<Navbar/>
<Hero/> 
<Objections/>
<Information/>
<ProductTaste/>
<Reviews reviews={reviews} />
<ProductCarousel products={products} />
<Footer/>