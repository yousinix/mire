import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export const regularTaskSchema = z.object({
  text: z.string().describe('The original task without enhancements')
});

export type RegularTask = z.infer<typeof regularTaskSchema>;

/**
 * Agent A: Decomposition Agent
 * Breaks down a user's goal into concrete, actionable sub-tasks
 */
export class DecompositionAgent {
  constructor(private readonly apiKey: string) {}

  async decompose(goal: string): Promise<RegularTask[]> {
    const outputSchema = z.object({
      tasks: z
        .array(z.string())
        .min(3)
        .max(8)
        .describe('List of concrete sub-tasks to achieve the goal')
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-5-mini',
      apiKey: this.apiKey
      // Commented out because the model doesn't support this option
      // temperature: 0.7
    }).withStructuredOutput(outputSchema);

    const template = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are an expert task decomposition specialist. Your job is to break down user goals into clear, actionable sub-tasks.

Guidelines:
- Break the goal into 3-8 concrete, specific sub-tasks
- Each task should be a clear action that can be completed
- Tasks should be ordered logically (if applicable)
- Focus on the practical steps needed to accomplish the goal
`
      ],
      ['human', 'User Goal: {goal}\n\nBreak this down into actionable sub-tasks.']
    ]);

    const chain = template.pipe(model);
    const result = await chain.invoke({ goal });

    return result.tasks.map((text) => ({ text }));
  }
}
