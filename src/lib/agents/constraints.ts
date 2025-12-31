/**
 * Cognitive Constraints Database
 * Different types of cognitive challenges that can be applied to tasks
 */
export type CognitiveConstraint = {
  name: string;
  icon: string;
  description: string;
};

export const COGNITIVE_CONSTRAINTS: CognitiveConstraint[] = [
  {
    name: 'Spatial Reasoning',
    icon: '📦',
    description:
      'Requires visualizing and manipulating objects in 3D space, optimizing for volume and arrangement'
  },
  {
    name: 'Pattern Recognition',
    icon: '🔍',
    description: 'Requires identifying patterns, sequences, and categorization systems'
  },
  {
    name: 'Memory Challenge',
    icon: '🧠',
    description: 'Tasks that require memorization, recall, or working memory'
  },
  {
    name: 'Motor Skills',
    icon: '✋',
    description: 'Physical dexterity and precision challenges'
  },
  {
    name: 'Sensory Constraint',
    icon: '👁️',
    description: 'Limiting sensory input to increase difficulty'
  },
  {
    name: 'Novelty',
    icon: '✨',
    description: 'Adding creative or unusual approaches to standard tasks'
  },
  {
    name: 'Time Pressure',
    icon: '⏱️',
    description: 'Strict time limits that increase urgency and decision-making speed'
  },
  {
    name: 'Resource Limitation',
    icon: '🎯',
    description: 'Restricting available tools or resources'
  },
  {
    name: 'Problem Solving',
    icon: '🧩',
    description: 'Requires analytical thinking and strategy development'
  },
  {
    name: 'Precision',
    icon: '🎯',
    description: 'Requires exactness and attention to detail'
  }
];
