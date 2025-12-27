<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import GridPattern from '$lib/components/GridPattern.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  let { children } = $props();

  const queryClient = new QueryClient();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="h-scree text-gray-200">
    <div class="relative z-1 h-screen">
      {@render children()}
    </div>
    <GridPattern
      size={30}
      class="fixed inset-0 z-0 mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] stroke-neutral-700 stroke-2"
    />
  </div>
</QueryClientProvider>
