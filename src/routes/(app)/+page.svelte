<script lang="ts">
  import type { RegularTask } from '$lib/agents/decomposition.agent';
  import type { NeuroTask } from '$lib/agents/neuro-injection.agent';
  import NeuroTaskCard from '$lib/components/NeuroTaskCard.svelte';
  import PromptInput from '$lib/components/PromptInput.svelte';
  import NeuroTaskCardSkeleton from '$lib/components/NeuroTaskCardSkeleton.svelte';
  import { createStream } from '$lib/stream.svelte';
  import { onMount } from 'svelte';
  import * as Tone from 'tone';

  let synth: Tone.Synth | null = null;
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
  onMount(() => {
    synth = new Tone.Synth().toDestination();
  });

  let regularTasks = $state<RegularTask[]>([]);
  let neuroTasks = $state<NeuroTask[]>([]);

  const stream = createStream('/api/generate', {
    onMutate() {
      // Clear tasks when a new goal is submitted
      regularTasks = [];
      neuroTasks = [];
    },
    async onData(event) {
      switch (event.type) {
        case 'regular-task':
          regularTasks.push(event.data.task);
          break;

        case 'neuro-task':
          const note = notes[event.data.index % notes.length];
          synth!.triggerAttackRelease(note, '8n');

          neuroTasks.push(event.data.task);
          await new Promise((r) => setTimeout(r, 500)); // slight delay for better UX

          break;
      }
    }
  });

  const startedEnhancing = $derived.by(
    () => stream.event?.type === 'enhancing' || stream.event?.type === 'neuro-task'
  );

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

  {#each neuroTasks as task, i (i)}
    <NeuroTaskCard
      {task}
      onToggleDone={(done) => {
        synth!.triggerAttackRelease(done ? 'C4' : 'G4', '8n');
      }}
    />
  {/each}

  {#if startedEnhancing}
    {#each Array(regularTasks.length - neuroTasks.length) as _, i (i)}
      <NeuroTaskCardSkeleton />
    {/each}
  {/if}
</div>
