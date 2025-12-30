<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import GridPattern from '$lib/components/GridPattern.svelte';

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen text-gray-200">
  <div class="min-h-screen relative z-1 p-4">
    {@render children()}
  </div>
  <GridPattern
    size={30}
    class="fixed inset-0 z-0 mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] stroke-neutral-700 stroke-2"
  />
</div>
