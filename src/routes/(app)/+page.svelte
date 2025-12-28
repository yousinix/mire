<script lang="ts">
  import { createFetch } from '$lib/api';
  import { createMutation } from '@tanstack/svelte-query';
  import PromptInput from '$lib/components/PromptInput.svelte';
  import TaskCard from '$lib/components/TaskCard.svelte';

  const mGenerate = createMutation(() => ({
    mutationFn: createFetch('/api/generate')
  }));
</script>

<div class="mx-auto flex h-full w-200 flex-col gap-2 p-6">
  <h1
    class={{
      'mb-4 text-2xl font-bold transition-[margin-top] duration-1000': true,
      'mt-[30vh]': mGenerate.isPending || mGenerate.isIdle,
      'mt-[15vh]': mGenerate.isSuccess
    }}
  >
    mire
  </h1>
  <PromptInput
    loading={mGenerate.isPending}
    error={mGenerate.error?.message}
    onSubmit={(value) => mGenerate.mutate({ goal: value })}
  />

  {#if mGenerate.data}
    {#each mGenerate.data as task}
      <TaskCard {task} />
    {/each}
  {/if}
</div>
