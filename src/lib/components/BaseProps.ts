import type { Snippet } from 'svelte';
import type { ClassValue } from 'svelte/elements';

export interface BaseProps {
  class?: ClassValue;
  children: Snippet;
}
