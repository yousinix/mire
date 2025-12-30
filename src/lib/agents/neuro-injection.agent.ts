import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { getRandomConstraint } from './constraints';

export const neuroTaskSchema = z.object({
  text: z.string().describe('The rewritten task with the cognitive constraint applied'),
  reasoning: z.string().describe('Brief explanation of how the constraint enhances the task'),
  constraint: z.object({
    name: z.string().describe('Name of the cognitive constraint applied to the task'),
    icon: z.string().describe('Icon representing the cognitive constraint')
  })
});

export type NeuroTask = z.infer<typeof neuroTaskSchema>;

/**
 * Agent B: Neuro-Injection Agent
 * Applies cognitive constraints to make tasks more challenging and engaging
 */
export class NeuroInjectionAgent {
  constructor(private readonly apiKey: string) {}

  async enhance(task: string): Promise<NeuroTask> {
    const constraint = getRandomConstraint();
    const outputSchema = z.object({
      enhancedTask: z.string().describe('The rewritten task with the cognitive constraint applied'),
      reasoning: z.string().describe('Brief explanation of how the constraint enhances the task')
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-5-mini',
      apiKey: this.apiKey
      // Commented out because the model doesn't support this option
      // temperature: 0.8
    }).withStructuredOutput(outputSchema);

    const template = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
You are a creative cognitive enhancement specialist. Your job is to take ordinary tasks and make them more engaging and challenging by applying cognitive constraints.

Cognitive Constraint to Apply:
Name: ${constraint.name}
Description: ${constraint.description}
Examples: ${constraint.examples.join(', ')}

Guidelines:
- Rewrite the task to incorporate the cognitive constraint naturally
- Make it challenging but still related to the original goal
- Be creative and engaging - make it sound fun!
- The enhanced task should still accomplish the original objective
- Keep the core purpose of the task intact
- Keep the rewritten task as short and clear as possible (1 sentence max)

Output Format:
- The enhanced task description
- A brief reasoning for how this makes the task more engaging`
      ],
      [
        'human',
        'Original Task: {task}\n\nRewrite this task by applying the "{constraintName}" cognitive constraint.'
      ]
    ]);

    const chain = template.pipe(model);
    const result = await chain.invoke({
      task,
      constraintName: constraint.name
    });

    return {
      text: result.enhancedTask,
      reasoning: result.reasoning,
      constraint: {
        name: constraint.name,
        icon: constraint.icon
      }
    };
  }
}
