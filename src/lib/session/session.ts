import type { CognitiveTask } from "$lib/agents/cognitification.agent";
import type { RegularTask } from "$lib/agents/decomposition.agent";

export const SESSION_PREFIX = 'mire-session';

export type SessionData = {
  prompt: string;
  regularTasks: RegularTask[];
  cognitiveTasks: CognitiveTask[];
  createdAt: number;
};

export class Session {
  key: string;
  prompt: string;
  regularTasks: RegularTask[];
  cognitiveTasks: CognitiveTask[];
  createdAt: number;

  constructor(data: SessionData, key: string) {
    this.key = key;
    this.prompt = data.prompt;
    this.regularTasks = data.regularTasks;
    this.cognitiveTasks = data.cognitiveTasks;
    this.createdAt = data.createdAt;
  }

  update(updater: (session: this) => void) {
    updater(this);
    this.save();
  }

  save() {
    localStorage.setItem(
      this.key,
      JSON.stringify({
        prompt: this.prompt,
        regularTasks: this.regularTasks,
        cognitiveTasks: this.cognitiveTasks,
        createdAt: this.createdAt
      })
    );
  }
}
