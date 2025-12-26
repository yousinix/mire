<script lang="ts">
  import { createFetch } from '$lib/api';
  import { createMutation } from '@tanstack/svelte-query';

  let prompt = $state('');

  const mGenerate = createMutation(() => ({
    mutationFn: createFetch('/api/generate')
  }));

  function handleSubmit() {
    if (!prompt.trim()) return;
    mGenerate.mutate({ prompt: prompt.trim() });
  }
</script>

<div>
  <form onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={prompt}
      placeholder="Enter your prompt..."
      disabled={mGenerate.isPending}
    />
    <button type="submit" disabled={mGenerate.isPending || !prompt.trim()}>
      {mGenerate.isPending ? 'Generating...' : 'Submit'}
    </button>
  </form>

  {#if mGenerate.isPending}
    <div>
      <p>Loading...</p>
    </div>
  {/if}

  {#if mGenerate.isError}
    <div>
      <p>Error: {mGenerate.error?.message || 'An error occurred'}</p>
    </div>
  {/if}

  {#if mGenerate.isSuccess && mGenerate.data}
    <div>
      <p>{mGenerate.data.goal}</p>

      <ul>
        {#each mGenerate.data.tasks as task}
          <li>- {task}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
