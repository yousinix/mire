import { taskSchema } from '$lib/agents/task';
import type { StreamSchema } from '$lib/stream.svelte';
import { z } from 'zod';

export const schema = {
  method: 'POST',
  request: z.object({
    goal: z.string().min(1).describe('The user-provided goal to be broken down into tasks')
  }),
  events: z.union([
    z.object({ type: z.literal('decomposing'), data: z.undefined() }),
    z.object({
      type: z.literal('enhancing'),
      data: z.object({ taskCount: z.number() })
    }),
    z.object({
      type: z.literal('task'),
      data: z.object({ index: z.number(), task: taskSchema })
    }),
    z.object({ type: z.literal('done'), data: z.undefined() }),
    z.object({ type: z.literal('error'), data: z.object({ message: z.string() }) })
  ])
} satisfies StreamSchema;

export type StreamEvent = z.infer<typeof schema.events>;
