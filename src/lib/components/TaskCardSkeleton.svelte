<script lang="ts">
  import Card from './Card.svelte';
</script>

<Card class="p-4">
  <div class="flex items-center gap-3">
    <!-- Checkbox skeleton -->
    <div class="h-5 w-5 animate-pulse rounded bg-neutral-700"></div>

    <!-- Content skeleton -->
    <div class="flex flex-1 flex-col gap-2">
      <div class="h-4 w-full animate-pulse rounded bg-neutral-700"></div>
      <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-700"></div>
      <div class="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-700"></div>
    </div>

    <!-- Button skeleton -->
    <div class="h-8 w-8 animate-pulse rounded-md bg-neutral-700"></div>
  </div>
</Card>
