import type { Difficulty, Equipment, MovementPattern, MuscleGroup } from '@fitness-app/types';

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  glutes: 'Glutes',
  quadriceps: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  full_body: 'Full Body',
};

export const equipmentLabels: Record<Equipment, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  cable: 'Cable',
  kettlebell: 'Kettlebell',
  resistance_band: 'Band',
  bodyweight: 'Bodyweight',
  other: 'Other',
};

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const movementPatternLabels: Record<MovementPattern, string> = {
  squat: 'Squat',
  hinge: 'Hinge',
  lunge: 'Lunge',
  push_horizontal: 'Horizontal Push',
  push_vertical: 'Vertical Push',
  pull_horizontal: 'Horizontal Pull',
  pull_vertical: 'Vertical Pull',
  carry: 'Carry',
  core: 'Core',
  isolation: 'Isolation',
};
