import { z } from 'zod';
import { regularTaskSchema } from './decomposition.agent';
import { neuroTaskSchema } from './neuro-injection.agent';

export const taskSchema = z.object({
  regular: regularTaskSchema,
  neuro: neuroTaskSchema
});

export type Task = z.infer<typeof taskSchema>;
