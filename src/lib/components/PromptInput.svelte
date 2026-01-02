<script lang="ts">
  import { Send } from '@lucide/svelte';
  import Card from './Card.svelte';

  interface Props {
    value: string;
    loading?: boolean;
    onSubmit: (value: string) => void;
  }

  let { value = $bindable(), ...props }: Props = $props();

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (value.trim() && !props.loading) {
      props.onSubmit(value);
    }
  }
</script>

<Card class="px-3 py-2">
  <form onsubmit={handleSubmit}>
    <div class="flex items-center gap-2">
      <input
        bind:value
        type="text"
        class="flex-1 border-none bg-transparent focus:ring-0 disabled:opacity-50"
        placeholder="What do you want to do today?"
        disabled={props.loading}
      />

      <button
        type="submit"
        disabled={props.loading || !value.trim()}
        class="cursor-pointer rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send class="size-4" />
      </button>
    </div>
  </form>
</Card>
