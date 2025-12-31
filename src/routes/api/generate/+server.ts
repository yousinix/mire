import { OPENAI_API_KEY } from '$env/static/private';
import { CognitificationAgent } from '$lib/agents/cognitification.agent';
import { DecompositionAgent } from '$lib/agents/decomposition.agent';
import type { RequestHandler } from './$types';
import { schema, type StreamEvent } from './schema';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { goal } = schema.request.parse(body);

  const decompositionAgent = new DecompositionAgent(OPENAI_API_KEY);
  const cognitificationAgent = new CognitificationAgent(OPENAI_API_KEY);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        // Phase 1: Decomposition
        send({ type: 'phase', data: 'decomposition' });
        const regularTasks = await decompositionAgent.decompose(goal.trim());
        regularTasks.forEach((task, index) => {
          send({ type: 'regular-task', data: { index, task } });
        });

        // Phase 2: Cognitification
        // Start all enhancements in parallel for speed
        send({ type: 'phase', data: 'cognitification' });
        const cognitifications = regularTasks.map((regularTask) => {
          return cognitificationAgent.enhance(regularTask.text);
        });

        // Stream results in order by awaiting promises sequentially
        for (let index = 0; index < cognitifications.length; index++) {
          const cognitiveTask = await cognitifications[index];
          send({ type: 'cognitive-task', data: { index, task: cognitiveTask } });
        }

        send({ type: 'done' });
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
