import type { Exercise } from '@fitness-app/types';

export type ExerciseSeed = Omit<Exercise, 'id' | 'isActive'>;

/** Seed exercises derive their id from the slug and are always active. */
export function defineExercise(seed: ExerciseSeed): Exercise {
  return { id: seed.slug, isActive: true, ...seed };
}
