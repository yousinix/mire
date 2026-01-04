<script lang="ts">
  import type { CognitiveTask } from '$lib/agents/cognitification.agent';
  import type { RegularTask } from '$lib/agents/decomposition.agent';
  import Card from '$lib/components/Card.svelte';
  import CognitiveTaskCard from '$lib/components/CognitiveTaskCard.svelte';
  import CognitiveTaskCardSkeleton from '$lib/components/CognitiveTaskCardSkeleton.svelte';
  import PromptInput from '$lib/components/PromptInput.svelte';
  import { createSessionManager } from '$lib/session/session-manager.svelte';
  import { createStream } from '$lib/stream.svelte';
  import { ChevronRight } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import * as Tone from 'tone';

  let synth: Tone.Synth | null = null;
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
  onMount(() => {
    synth = new Tone.Synth().toDestination();
  });

  const sessionManager = createSessionManager();

  let prompt = $state('');
  let regularTasks = $state<RegularTask[]>([]);
  let cognitiveTasks = $state<CognitiveTask[]>([]);

  const stream = createStream('/api/generate', {
    onMutate() {
      // Clear tasks when a new goal is submitted
      regularTasks = [];
      cognitiveTasks = [];
      sessionManager.reset();
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
    },
    onDone() {
      // Create a new session with all the data,
      // after the stream is done
      sessionManager.new({
        prompt: prompt,
        regularTasks: regularTasks,
        cognitiveTasks: cognitiveTasks
      });
    }
  });

  const startedCognitification = $derived.by(() =>
    stream.events.some((e) => e.type === 'phase' && e.data === 'cognitification')
  );

  const loadingMessage = $derived.by(() => {
    const lastEvent = stream.events.at(-1);
    if (lastEvent?.type !== 'phase') return '';

    switch (lastEvent.data) {
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
    'py-[30vh]': stream.events.length === 0, // Visually center when no event has occurred
    'py-[15vh]': stream.events.length !== 0
  }}
>
  <button
    class="mb-2 flex cursor-pointer px-2 text-2xl font-bold"
    onclick={() => location.reload()}
  >
    <h1>mire</h1>
  </button>
  <PromptInput
    value={prompt}
    loading={stream.isLoading}
    onSubmit={(value) => {
      prompt = value;
      stream.mutate({ goal: value });
    }}
  />

  {#if !prompt && stream.events.length === 0 && sessionManager.sessions.length > 0}
    <Card class="px-2 py-3">
      {#each sessionManager.sessions.slice(0, 5) as session, i (i)}
        <button
          class="flex w-full cursor-pointer items-center justify-between rounded px-4 py-1 text-neutral-400 hover:bg-neutral-800/70"
          onclick={() => {
            prompt = session.prompt;
            regularTasks = session.regularTasks;
            cognitiveTasks = session.cognitiveTasks;
            sessionManager.load(session.key);
          }}
        >
          <p>{session.prompt}</p>
          <ChevronRight class="size-5" />
        </button>
      {/each}
    </Card>
  {/if}

  <p class="px-2 text-sm">
    {#if stream.error}
      <span class="text-red-400">{stream.error}</span>
    {:else}
      <span class="animate-pulse text-neutral-400">{loadingMessage}</span>
    {/if}
  </p>

  {#each cognitiveTasks as task, i (i)}
    <CognitiveTaskCard
      {task}
      onToggleDone={(done) => {
        synth!.triggerAttackRelease(done ? 'C4' : 'G4', '8n');
        sessionManager.current!.update((s) => {
          s.cognitiveTasks[i].done = done;
        });
      }}
    />
  {/each}

  {#if startedCognitification}
    {#each Array(regularTasks.length - cognitiveTasks.length) as _, i (i)}
      <CognitiveTaskCardSkeleton />
    {/each}
  {/if}
</div>
