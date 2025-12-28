import { taskSchema } from '$lib/agents/workflow';
import type { ApiEndpointSchema } from '$lib/api';
import { z } from 'zod';

export const schema = {
  method: 'POST',
  request: z.object({
    goal: z.string().min(1).describe('The user-provided goal to be broken down into tasks')
  }),
  response: z
    .array(taskSchema)
    .describe('List of tasks, either original or neuro-enhanced based on feasibility checks')
} satisfies ApiEndpointSchema;
