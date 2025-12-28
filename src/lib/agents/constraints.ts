/**
 * Cognitive Constraints Database
 * Different types of cognitive challenges that can be applied to tasks
 */

export type CognitiveConstraint = {
  name: string;
  description: string;
  examples: string[];
};

export const COGNITIVE_CONSTRAINTS: Record<string, CognitiveConstraint> = {
  SPATIAL_REASONING: {
    name: 'Spatial Reasoning',
    description:
      'Requires visualizing and manipulating objects in 3D space, optimizing for volume and arrangement',
    examples: [
      'Tetris-style packing challenge',
      'Optimize cubic space utilization',
      'Create geometric arrangements'
    ]
  },
  PATTERN_RECOGNITION: {
    name: 'Pattern Recognition',
    description: 'Requires identifying patterns, sequences, and categorization systems',
    examples: [
      'Sort by color gradient',
      'Organize by frequency of use patterns',
      'Create a Dewey Decimal-style system'
    ]
  },
  MEMORY_CHALLENGE: {
    name: 'Memory Challenge',
    description: 'Tasks that require memorization, recall, or working memory',
    examples: [
      'Do it without looking at the list after first read',
      'Memorize positions before moving',
      'Recall and replicate previous organization'
    ]
  },
  MOTOR_SKILLS: {
    name: 'Motor Skills',
    description: 'Physical dexterity and precision challenges',
    examples: [
      'Use non-dominant hand only',
      'Balance items while carrying',
      'Complete within time limit'
    ]
  },
  SENSORY_CONSTRAINT: {
    name: 'Sensory Constraint',
    description: 'Limiting sensory input to increase difficulty',
    examples: ['Do it blindfolded', 'Work in silence (no audio cues)', 'Use touch only']
  },
  NOVELTY: {
    name: 'Novelty',
    description: 'Adding creative or unusual approaches to standard tasks',
    examples: [
      'Invent a new categorization system',
      'Use unconventional tools',
      'Apply a theme (e.g., color-code by emotions)'
    ]
  },
  TIME_PRESSURE: {
    name: 'Time Pressure',
    description: 'Strict time limits that increase urgency and decision-making speed',
    examples: [
      'Complete in half the normal time',
      'Speed challenge with timer',
      'Beat your previous record'
    ]
  },
  RESOURCE_LIMITATION: {
    name: 'Resource Limitation',
    description: 'Restricting available tools or resources',
    examples: [
      'Use only 3 containers',
      'No labels allowed',
      'Single trip only - carry everything at once'
    ]
  },
  PROBLEM_SOLVING: {
    name: 'Problem Solving',
    description: 'Requires analytical thinking and strategy development',
    examples: [
      'Create a system that minimizes future effort',
      'Optimize for multiple variables',
      'Solve a puzzle to determine order'
    ]
  },
  PRECISION: {
    name: 'Precision',
    description: 'Requires exactness and attention to detail',
    examples: [
      'Align items within millimeters',
      'Perfect symmetry required',
      'No items can touch edges'
    ]
  }
};

/**
 * Get a random constraint from the available pool
 */
export function getRandomConstraint(): CognitiveConstraint {
  const keys = Object.keys(COGNITIVE_CONSTRAINTS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return COGNITIVE_CONSTRAINTS[randomKey];
}
