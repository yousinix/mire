import { cognitiveTaskSchema } from '$lib/agents/cognitification.agent';
import { regularTaskSchema } from '$lib/agents/decomposition.agent';
import type { StreamSchema } from '$lib/stream.svelte';
import { z } from 'zod';

export const schema = {
  method: 'POST',
  request: z.object({
    goal: z.string().min(1).describe('The user-provided goal to be broken down into tasks')
  }),
  events: z.union([
    z.object({
      type: z.literal('phase'),
      data: z.union([z.literal('decomposition'), z.literal('cognitification')])
    }),
    z.object({
      type: z.literal('regular-task'),
      data: z.object({ index: z.number(), task: regularTaskSchema })
    }),
    z.object({
      type: z.literal('cognitive-task'),
      data: z.object({ index: z.number(), task: cognitiveTaskSchema })
    }),
    z.object({ type: z.literal('done') }),
    z.object({ type: z.literal('error'), data: z.object({ message: z.string() }) })
  ])
} satisfies StreamSchema;

export type StreamEvent = z.infer<typeof schema.events>;
