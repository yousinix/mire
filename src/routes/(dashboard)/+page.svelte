<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';
  import type { GenerateRequest, GenerateResponse } from '../api/generate/+server';

  let prompt = $state('');

  const mutation = createMutation(() => ({
    mutationFn: async (promptText: string): Promise<GenerateResponse> => {
      const body: GenerateRequest = { prompt: promptText };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      return response.json() as Promise<GenerateResponse>;
    }
  }));

  function handleSubmit() {
    if (!prompt.trim()) return;
    mutation.mutate(prompt);
  }
</script>

<div>
  <form onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={prompt}
      placeholder="Enter your prompt..."
      disabled={mutation.isPending}
    />
    <button type="submit" disabled={mutation.isPending || !prompt.trim()}>
      {mutation.isPending ? 'Generating...' : 'Submit'}
    </button>
  </form>

  {#if mutation.isPending}
    <div>
      <p>Loading...</p>
    </div>
  {/if}

  {#if mutation.isError}
    <div>
      <p>Error: {mutation.error?.message || 'An error occurred'}</p>
    </div>
  {/if}

  {#if mutation.isSuccess && mutation.data}
    <div>
      <p>{mutation.data.goal}</p>

      <ul>
        {#each mutation.data.tasks as task}
          <li>{task}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
