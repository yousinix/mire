import type { ApiEndpointSchema } from '$lib/api';
import { z } from 'zod';

export const schema = {
  method: 'POST',
  request: z.object({
    prompt: z.string().min(1).describe('The user-provided goal to be broken down into tasks')
  }),
  response: z.object({
    goal: z.string().describe('A clear, concise goal statement'),
    tasks: z
      .array(z.string())
      .min(5)
      .max(8)
      .describe('A list of 5-8 specific, actionable tasks to achieve the goal')
  })
} satisfies ApiEndpointSchema;
