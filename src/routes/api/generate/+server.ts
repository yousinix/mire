import { OPENAI_API_KEY } from '$env/static/private';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { schema } from './schema';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt } = schema.request.parse(body);

    // Initialize the OpenAI model with structured output
    const model = new ChatOpenAI({
      modelName: 'gpt-5-mini',
      apiKey: OPENAI_API_KEY
    }).withStructuredOutput(schema.response);

    const template = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a helpful assistant that breaks down goals into actionable tasks. ' +
          'Given a user goal, generate a clear goal statement and a list of 5-8 specific, ' +
          'actionable tasks to achieve it.'
      ],
      ['human', '{userPrompt}']
    ]);

    const chain = template.pipe(model);
    const result = await chain.invoke({
      userPrompt: prompt
    });

    return json(result);
  } catch (error) {
    console.error('Error generating tasks:', error);
    return json(
      {
        goal: prompt,
        tasks: ['Failed to generate tasks. Please try again.']
      },
      { status: 500 }
    );
  }
};
