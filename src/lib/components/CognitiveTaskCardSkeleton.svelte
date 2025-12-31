<script lang="ts">
  import Card from './Card.svelte';
</script>

<Card class="p-4">
  <div class="relative flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <!-- Checkbox skeleton -->
      <div class="h-5 w-5 animate-pulse rounded-full bg-neutral-700"></div>

      <!-- Badge skeleton -->
      <div class="h-6 w-24 animate-pulse rounded-full bg-neutral-700/50"></div>
    </div>

    <!-- Task text skeleton -->
    <div class="flex flex-col gap-2">
      <div class="h-4 w-full animate-pulse rounded bg-neutral-700"></div>
      <div class="h-4 w-3/4 animate-pulse rounded bg-neutral-700"></div>
    </div>
  </div>
</Card>
