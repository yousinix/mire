import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export interface GenerateResponse {
  goal: string;
  tasks: string[];
}

export interface GenerateRequest {
  prompt: string;
}

export const POST: RequestHandler = async ({ request }) => {
  const { prompt } = (await request.json()) as GenerateRequest;

  // Mock data response
  const mockResponse: GenerateResponse = {
    goal: `Achieve the following based on your prompt: "${prompt}"`,
    tasks: [
      'Research and gather relevant information',
      'Create a detailed plan of action',
      'Break down the goal into smaller tasks',
      'Set realistic deadlines for each task',
      'Execute the plan step by step',
      'Monitor progress and adjust as needed'
    ]
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return json(mockResponse);
};
