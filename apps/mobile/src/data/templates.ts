import type { WorkoutTemplate } from '@fitness-app/types';

import { findExercise } from '@/data/exercises';

/**
 * Curated starter templates. Deliberately few (handoff §11) — quality
 * over quantity. Exercise references are seed-catalog slugs.
 */
export const workoutTemplates: WorkoutTemplate[] = [
  {
    slug: 'full-body-starter',
    name: 'Full Body Starter',
    description: 'Six fundamental movements covering the whole body. The best place to begin.',
    exercises: [
      {
        exerciseId: 'goblet-squat',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'push-up',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 15,
        restSeconds: 90,
      },
      {
        exerciseId: 'one-arm-dumbbell-row',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'romanian-deadlift',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 120,
      },
      {
        exerciseId: 'seated-dumbbell-shoulder-press',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'dead-bug',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 10,
        restSeconds: 60,
      },
    ],
  },
  {
    slug: 'upper-body',
    name: 'Upper Body',
    description: 'Balanced pushing and pulling for chest, back, shoulders, and arms.',
    exercises: [
      {
        exerciseId: 'barbell-bench-press',
        targetSets: 3,
        targetRepsMin: 6,
        targetRepsMax: 10,
        restSeconds: 120,
      },
      {
        exerciseId: 'barbell-row',
        targetSets: 3,
        targetRepsMin: 6,
        targetRepsMax: 10,
        restSeconds: 120,
      },
      {
        exerciseId: 'seated-dumbbell-shoulder-press',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'lat-pulldown',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'dumbbell-curl',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 15,
        restSeconds: 60,
      },
      {
        exerciseId: 'cable-triceps-pushdown',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 15,
        restSeconds: 60,
      },
    ],
  },
  {
    slug: 'lower-body',
    name: 'Lower Body',
    description: 'Squat, hinge, and single-leg work for strong legs and glutes.',
    exercises: [
      {
        exerciseId: 'barbell-back-squat',
        targetSets: 3,
        targetRepsMin: 5,
        targetRepsMax: 8,
        restSeconds: 150,
      },
      {
        exerciseId: 'romanian-deadlift',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 10,
        restSeconds: 120,
      },
      {
        exerciseId: 'dumbbell-lunge',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'seated-leg-curl',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 15,
        restSeconds: 60,
      },
      {
        exerciseId: 'standing-calf-raise',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 15,
        restSeconds: 60,
      },
    ],
  },
  {
    slug: 'beginner-dumbbell',
    name: 'Beginner Dumbbell',
    description: 'A complete session with just a pair of dumbbells — perfect for home.',
    exercises: [
      {
        exerciseId: 'goblet-squat',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'incline-dumbbell-press',
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'one-arm-dumbbell-row',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 12,
        restSeconds: 90,
      },
      {
        exerciseId: 'dumbbell-lateral-raise',
        targetSets: 3,
        targetRepsMin: 12,
        targetRepsMax: 15,
        restSeconds: 60,
      },
      {
        exerciseId: 'glute-bridge',
        targetSets: 3,
        targetRepsMin: 12,
        targetRepsMax: 15,
        restSeconds: 60,
      },
      {
        exerciseId: 'hammer-curl',
        targetSets: 3,
        targetRepsMin: 10,
        targetRepsMax: 15,
        restSeconds: 60,
      },
    ],
  },
];

if (__DEV__) {
  for (const template of workoutTemplates) {
    for (const exercise of template.exercises) {
      if (!findExercise(exercise.exerciseId)) {
        console.warn(
          `[templates] ${template.slug} references unknown exercise: ${exercise.exerciseId}`,
        );
      }
    }
  }
}
