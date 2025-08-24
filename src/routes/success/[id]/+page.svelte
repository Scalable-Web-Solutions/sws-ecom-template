<!-- src/routes/success/+page.svelte -->
<script lang="ts">
  // purely client UI, nothing server-side needed here
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
  <!-- Checkmark icon -->
  <svg class="w-20 h-20 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>

  <h1 class="text-3xl font-bold mb-2">Payment successful</h1>
  <p class="text-gray-600 mb-6">A receipt has been sent to your email address.</p>

  <a href="/" class="bg-black text-white px-6 py-3 rounded-md font-semibold">Return Home</a>
</div>
