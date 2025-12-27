<script lang="ts">
  import { createFetch } from '$lib/api';
  import Card from '$lib/components/Card.svelte';
  import CheckboxGroup from '$lib/components/CheckboxGroup.svelte';
  import { createMutation } from '@tanstack/svelte-query';
  import PromptInput from '$lib/components/PromptInput.svelte';

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
    onSubmit={(value) => mGenerate.mutate({ prompt: value })}
  />

  {#if mGenerate.data}
    <CheckboxGroup items={mGenerate.data.tasks} />
  {/if}
</div>
