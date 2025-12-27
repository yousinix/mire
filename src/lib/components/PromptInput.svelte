<script lang="ts">
  import { Send } from '@lucide/svelte';
  import Card from './Card.svelte';

  interface Props {
    loading?: boolean;
    error?: string;
    onSubmit: (value: string) => void;
  }

  let props: Props = $props();
  let value = $state('');

  function handleSubmit() {
    if (value.trim() && !props.loading) {
      props.onSubmit(value);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    }
  }
</script>

<Card class="p-2">
  <div class="flex items-end gap-2">
    <textarea
      bind:value
      class="flex-1 resize-none border-none bg-transparent px-2 py-1 focus:ring-0 disabled:opacity-50"
      placeholder="Enter your prompt..."
      onkeydown={handleKeydown}
      disabled={props.loading}
      rows="3"
    ></textarea>

    <button
      onclick={handleSubmit}
      disabled={props.loading || !value.trim()}
      class="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Submit"
    >
      <Send class="size-4" />
    </button>
  </div>

  {#if props.error}
    <p class="mt-2 text-red-400">{props.error}</p>
  {/if}
</Card>
