<script lang="ts">
  import type { CognitiveTask } from '$lib/agents/cognitification.agent';
  import Card from './Card.svelte';

  interface Props {
    task: CognitiveTask;
    onToggleDone?: (done: boolean) => void;
  }

  let { task = $bindable(), onToggleDone }: Props = $props();

  let done = $state(false);
  let showTooltip = $state(false);

  function handleDoneChanged(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    done = checked;
    onToggleDone?.(checked);
  }
</script>

<Card class="p-4">
  <div class="relative flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        checked={done}
        onchange={handleDoneChanged}
        class="size-5 cursor-pointer rounded-full border border-neutral-600 bg-neutral-800 checked:bg-blue-600 focus:ring-0 focus:ring-offset-0"
      />

      <span class="relative">
        <span
          role="button"
          tabindex="0"
          onmouseenter={() => (showTooltip = true)}
          onmouseleave={() => (showTooltip = false)}
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-700/50 px-3 py-1 text-xs font-medium transition-colors hover:bg-neutral-700"
        >
          <span class="text-base text-[0.8rem]">{task.constraint.icon}</span>
          <span>{task.constraint.name}</span>
        </span>

        {#if showTooltip}
          <div
            class="absolute top-full left-0 z-10 mt-2 w-64 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm text-gray-200 shadow-lg"
          >
            <div class="mb-1 text-xs font-semibold text-gray-400">Reasoning</div>
            {task.reasoning}
            <div
              class="absolute -top-1 left-4 h-2 w-2 rotate-45 border-t border-l border-neutral-700 bg-neutral-800"
            ></div>
          </div>
        {/if}
      </span>
    </div>
    <div class={{ 'text-neutral-500 line-through': done }}>
      {task.text}
    </div>
  </div>
</Card>
