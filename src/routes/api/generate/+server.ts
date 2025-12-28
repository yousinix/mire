import { OPENAI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { schema } from './schema';
import { NeuroAgentWorkflow } from '$lib/agents/workflow';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { goal } = schema.request.parse(body);

    const workflow = new NeuroAgentWorkflow(OPENAI_API_KEY);
    const result = await workflow.execute(goal.trim());

    return json(result);
  } catch (error) {
    console.error('Error in multi-agent workflow:', error);
    return json(
      {
        goal: '',
        originalTasks: [],
        enhancedTasks: [],
        error: 'Failed to process request. Please try again.'
      },
      { status: 500 }
    );
  }
};
