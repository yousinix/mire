import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { schema, type StreamEvent } from './schema';
import { DecompositionAgent } from '$lib/agents/decomposition.agent';
import { NeuroInjectionAgent } from '$lib/agents/neuro-injection.agent';
import type { Task } from '$lib/agents/task';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { goal } = schema.request.parse(body);

  const decompositionAgent = new DecompositionAgent(OPENAI_API_KEY);
  const neuroInjectionAgent = new NeuroInjectionAgent(OPENAI_API_KEY);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        // Phase 1: Decomposition
        send({ type: 'decomposing', data: undefined });
        const regularTasks = await decompositionAgent.decompose(goal.trim());

        // Phase 2: Enhancement - send task count first
        // Start all enhancements in parallel for speed
        send({ type: 'enhancing', data: { taskCount: regularTasks.length } });
        const injectionPromises = regularTasks.map(async (regularTask) => {
          const neuroTask = await neuroInjectionAgent.enhance(regularTask.text);
          return { regular: regularTask, neuro: neuroTask } as Task;
        });

        // Stream results in order by awaiting promises sequentially
        for (let index = 0; index < injectionPromises.length; index++) {
          const task = await injectionPromises[index];
          send({ type: 'task', data: { index, task } });
        }

        send({ type: 'done', data: undefined });
      } catch (error) {
        console.error('Error in streaming workflow:', error);
        send({ type: 'error', data: { message: 'Failed to process request. Please try again.' } });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
};
