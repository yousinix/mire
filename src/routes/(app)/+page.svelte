<script lang="ts">
  import type { CognitiveTask } from '$lib/agents/cognitification.agent';
  import type { RegularTask } from '$lib/agents/decomposition.agent';
  import CognitiveTaskCard from '$lib/components/CognitiveTaskCard.svelte';
  import CognitiveTaskCardSkeleton from '$lib/components/CognitiveTaskCardSkeleton.svelte';
  import PromptInput from '$lib/components/PromptInput.svelte';
  import { createStream } from '$lib/stream.svelte';
  import { onMount } from 'svelte';
  import * as Tone from 'tone';

  let synth: Tone.Synth | null = null;
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
  onMount(() => {
    synth = new Tone.Synth().toDestination();
  });

  let regularTasks = $state<RegularTask[]>([]);
  let cognitiveTasks = $state<CognitiveTask[]>([]);

  const stream = createStream('/api/generate', {
    onMutate() {
      // Clear tasks when a new goal is submitted
      regularTasks = [];
      cognitiveTasks = [];
    },
    async onData(event) {
      switch (event.type) {
        case 'regular-task':
          regularTasks.push(event.data.task);
          break;

        case 'cognitive-task':
          const note = notes[event.data.index % notes.length];
          synth!.triggerAttackRelease(note, '8n');

          cognitiveTasks.push(event.data.task);
          await new Promise((r) => setTimeout(r, 500)); // slight delay for better UX

          break;
      }
    }
  });

  const startedCognitification = $derived.by(
    () =>
      (stream.event?.type === 'phase' && stream.event?.data === 'cognitification') ||
      stream.event?.type === 'cognitive-task'
  );

  const loadingMessage = $derived.by(() => {
    if (stream.event?.type !== 'phase') {
      return '';
    }

    switch (stream.event.data) {
      case 'decomposition':
        return 'Breaking down into tasks...';
      case 'cognitification':
        return 'Applying cognitive enhancements...';
      default:
        return '';
    }
  });
</script>

<div
  class={{
    'mx-auto flex h-full w-200 flex-col gap-2 p-6 transition-[padding] duration-1000': true,
    'py-[30vh]': stream.event === null, // Visually center when no event has occurred
    'py-[15vh]': stream.event !== null
  }}
>
  <h1 class="mb-2 px-2 text-2xl font-bold">mire</h1>
  <PromptInput loading={stream.isLoading} onSubmit={(prompt) => stream.mutate({ goal: prompt })} />
  <p class="animate-pulse px-2 text-sm text-neutral-400">{loadingMessage}</p>

  {#if stream.error}
    <p class="px-2 text-sm text-red-400">{stream.error}</p>
  {/if}

  {#each cognitiveTasks as task, i (i)}
    <CognitiveTaskCard
      {task}
      onToggleDone={(done) => {
        synth!.triggerAttackRelease(done ? 'C4' : 'G4', '8n');
      }}
    />
  {/each}

  {#if startedCognitification}
    {#each Array(regularTasks.length - cognitiveTasks.length) as _, i (i)}
      <CognitiveTaskCardSkeleton />
    {/each}
  {/if}
</div>
