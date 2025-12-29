<script lang="ts">
  import type { Task } from '$lib/agents/task';
  import { createStream } from '$lib/stream.svelte';
  import PromptInput from '$lib/components/PromptInput.svelte';
  import TaskCard from '$lib/components/TaskCard.svelte';
  import TaskCardSkeleton from '$lib/components/TaskCardSkeleton.svelte';
  import { onMount } from 'svelte';
  import * as Tone from 'tone';

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];

  let synth: Tone.Synth | null = null;
  onMount(() => {
    synth = new Tone.Synth().toDestination();
  });

  let tasks = $state<(Task | null)[]>([]);
  const stream = createStream('/api/generate', {
    onMutate() {
      // Clear tasks when a new goal is submitted
      tasks = [];
    },
    async onData(event) {
      switch (event.type) {
        case 'enhancing':
          // Initialize tasks array with nulls (skeleton placeholders)
          tasks = Array(event.data.taskCount).fill(null);
          break;
        case 'task':
          // Replace the skeleton at this index with the actual task
          tasks[event.data.index] = event.data.task;

          if (synth) {
            const note = notes[event.data.index % notes.length];
            synth.triggerAttackRelease(note, '8n');
          }

          await new Promise((r) => setTimeout(r, 500)); // slight delay for better UX
          break;
      }
    }
  });

  const loadingMessage = $derived.by(() => {
    switch (stream.event?.type) {
      case 'decomposing':
        return 'Breaking down into tasks...';
      case 'enhancing':
        return 'Applying cognitive enhancements...';
      default:
        return '';
    }
  });
</script>

<div class="mx-auto flex h-full w-200 flex-col gap-2 p-6">
  <h1
    class={{
      'mb-4 px-2 text-2xl font-bold transition-[margin-top] duration-1000': true,
      'mt-[30vh]': stream.event === null, // Visually center when no event has occurred
      'mt-[15vh]': stream.event !== null
    }}
  >
    mire
  </h1>
  <PromptInput loading={stream.isLoading} onSubmit={(prompt) => stream.mutate({ goal: prompt })} />

  {#if loadingMessage}
    <p class="animate-pulse px-2 text-sm text-neutral-400">{loadingMessage}</p>
  {/if}

  {#if stream.error}
    <p class="px-2 text-sm text-red-400">{stream.error}</p>
  {/if}

  {#each tasks as task, i (i)}
    {#if task}
      <TaskCard {task} />
    {:else}
      <TaskCardSkeleton />
    {/if}
  {/each}
</div>
