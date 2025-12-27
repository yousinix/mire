<script lang="ts">
  import Card from './Card.svelte';

  interface Props {
    items: string[];
    onChange?: (values: string[]) => void;
  }

  let props: Props = $props();
  let values: string[] = $state([]);

  $effect(() => {
    props.onChange?.(values);
  });
</script>

<Card class="p-4">
  <div class="flex flex-col gap-1">
    {#each props.items as item}
      <label class="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          value={item}
          class="cursor-pointer rounded-full border border-neutral-600 bg-neutral-800 p-2 checked:bg-blue-600 focus:ring-0 focus:ring-offset-0"
          bind:group={values}
        />
        <span>{item}</span>
      </label>
    {/each}
  </div>
</Card>
