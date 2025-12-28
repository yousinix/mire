import { DecompositionAgent, regularTaskSchema } from './decomposition.agent';
import { NeuroInjectionAgent, neuroTaskSchema } from './neuro-injection.agent';
import z from 'zod';

export const taskSchema = z.object({
  regular: regularTaskSchema,
  neuro: neuroTaskSchema
});

export type Task = z.infer<typeof taskSchema>;

/**
 * Multi-Agent Workflow Orchestrator
 * Coordinates the three agents to transform user goals into neuro-enhanced tasks
 */
export class NeuroAgentWorkflow {
  private decompositionAgent: DecompositionAgent;
  private neuroInjectionAgent: NeuroInjectionAgent;

  constructor(apiKey: string) {
    this.decompositionAgent = new DecompositionAgent(apiKey);
    this.neuroInjectionAgent = new NeuroInjectionAgent(apiKey);
  }

  async execute(goal: string): Promise<Task[]> {
    console.log('🚀 Starting Multi-Agent Workflow');
    console.log(`Goal: "${goal}"`);

    // Step 1: Decomposition
    console.log('\n📋 Step 1: Decomposing goal into sub-tasks...');
    const regularTasks = await this.decompositionAgent.decompose(goal);
    console.log(`✅ Decomposed into ${regularTasks.length} tasks`);

    console.log('\n🧠 Step 2: Applying cognitive constraints...');
    const neuroTasks = await Promise.all(
      regularTasks.map((task) => this.neuroInjectionAgent.enhance(task.text))
    );
    console.log(`✅ Applied cognitive constraints to all tasks`);

    return neuroTasks.map((neuroTask, index) => ({
      regular: regularTasks[index],
      neuro: neuroTask
    }));
  }
}
