import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { COGNITIVE_CONSTRAINTS } from './constraints';

export const cognitiveTaskSchema = z.object({
  text: z.string().describe('The rewritten task with the cognitive constraint applied'),
  reasoning: z.string().describe('Brief explanation of how the constraint enhances the task'),
  done: z.boolean().default(false).describe('Whether the task is completed'),
  constraint: z.object({
    name: z.string().describe('Name of the cognitive constraint applied to the task'),
    icon: z.string().describe('Icon representing the cognitive constraint')
  }),
});

export type CognitiveTask = z.infer<typeof cognitiveTaskSchema>;

/**
 * Agent B: Cognitification Agent
 * Applies cognitive constraints to make tasks more challenging and engaging
 */
export class CognitificationAgent {
  constructor(private readonly apiKey: string) {}

  async enhance(task: string): Promise<CognitiveTask> {
    const outputSchema = z.object({
      text: z.string().describe('The rewritten task with the cognitive constraint applied'),
      reasoning: z.string().describe('Brief explanation of how the constraint enhances the task'),
      constraintName: z
        .union(COGNITIVE_CONSTRAINTS.map((c) => z.literal(c.name)))
        .describe('Name of the cognitive constraint applied to the task')
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

Cognitive Constraints to choose from:
(Choose the most suitable one for the task)
${COGNITIVE_CONSTRAINTS.map((c) => '- ' + c.name + ': ' + c.description).join('\n')}

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
        'Original Task: {task}\n\nRewrite this task by applying a suitable cognitive constraint.'
      ]
    ]);

    const chain = template.pipe(model);
    const result = await chain.invoke({ task });
    const constraint = COGNITIVE_CONSTRAINTS.find((c) => c.name === result.constraintName)!;

    return {
      text: result.text,
      reasoning: result.reasoning,
      done: false,
      constraint: {
        name: constraint.name,
        icon: constraint.icon
      }
    };
  }
}
