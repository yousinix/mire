<script lang="ts">
  import { COGNITIVE_CONSTRAINTS } from '$lib/agents/constraints';
  import type { Task } from '$lib/agents/task';
  import Card from './Card.svelte';

  interface Props {
    task: Task;
    onToggleDone?: (done: boolean) => void;
    onToggleNeuro?: (useNeuro: boolean) => void;
  }

  let { task = $bindable(), onToggleDone, onToggleNeuro }: Props = $props();

  let done = $state(false);
  let useNeuro = $state(true);

  function handleCheckboxChange(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    done = checked;
    onToggleDone?.(checked);
  }

  function handleNeuroToggle() {
    useNeuro = !useNeuro;
    onToggleNeuro?.(useNeuro);
  }

  function getConstraintIcon(constraint?: string): string {
    if (!constraint) return '⚡';

    const iconMap: Record<string, string> = {
      SPATIAL_REASONING: '📦',
      PATTERN_RECOGNITION: '🔍',
      MEMORY_CHALLENGE: '🧠',
      MOTOR_SKILLS: '✋',
      SENSORY_CONSTRAINT: '👁️',
      NOVELTY: '✨',
      TIME_PRESSURE: '⏱️',
      RESOURCE_LIMITATION: '🎯',
      PROBLEM_SOLVING: '🧩',
      PRECISION: '🎯'
    };

    // Try to find matching constraint from COGNITIVE_CONSTRAINTS
    const matchedKey = Object.keys(COGNITIVE_CONSTRAINTS).find(
      (key) =>
        constraint.toLowerCase().includes(key.toLowerCase()) ||
        COGNITIVE_CONSTRAINTS[key].name.toLowerCase() === constraint.toLowerCase()
    );

    return matchedKey ? iconMap[matchedKey as keyof typeof iconMap] : '⚡';
  }

  const displayText = $derived(useNeuro ? task.neuro.text : task.regular.text);

  const constraintIcon = $derived(getConstraintIcon(task.neuro.constraint));
</script>

<Card class="p-4">
  <div class="relative flex items-center gap-3">
    <label class="flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={done}
        onchange={handleCheckboxChange}
        class="h-5 w-5 cursor-pointer"
      />
    </label>

    <div class="flex-1 text-[0.95rem] leading-relaxed">
      {displayText}
      {#if useNeuro}
        <p class="mt-2 text-sm text-gray-500 italic">
          {task.neuro.reasoning}
        </p>
      {/if}
    </div>

    {#if task.neuro.text}
      <button
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 transition-all duration-200 hover:border-gray-400"
        class:!bg-blue-500={useNeuro}
        class:!border-blue-500={useNeuro}
        onclick={handleNeuroToggle}
        title={task.neuro.constraint || 'Neuro-adapted version available'}
      >
        <span
          class="text-lg transition-[filter] duration-200"
          class:grayscale-0={useNeuro}
          class:grayscale={!useNeuro}
        >
          {constraintIcon}
        </span>
      </button>
    {/if}
  </div>
</Card>
