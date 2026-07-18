import type { Exercise } from '@fitness-app/types';

import { armExercises } from './arms';
import { backExercises } from './back';
import { chestExercises } from './chest';
import { coreExercises } from './core';
import { legExercises } from './legs';
import { shoulderExercises } from './shoulders';

/**
 * Local seed catalog. This is the single source of exercises until the
 * Supabase milestone, where it becomes the database seed (ADR 0004).
 */
export const exercises: Exercise[] = [
  ...chestExercises,
  ...backExercises,
  ...shoulderExercises,
  ...armExercises,
  ...legExercises,
  ...coreExercises,
];

const bySlug = new Map(exercises.map((exercise) => [exercise.slug, exercise]));

export function findExercise(slug: string): Exercise | undefined {
  return bySlug.get(slug);
}

// Data integrity checks, development builds only: duplicate slugs and
// alternatives pointing at exercises that don't exist.
if (__DEV__) {
  if (bySlug.size !== exercises.length) {
    const seen = new Set<string>();
    for (const { slug } of exercises) {
      if (seen.has(slug)) console.warn(`[exercises] duplicate slug: ${slug}`);
      seen.add(slug);
    }
  }
  for (const exercise of exercises) {
    for (const alternative of exercise.alternatives) {
      if (!bySlug.has(alternative)) {
        console.warn(`[exercises] ${exercise.slug} references unknown alternative: ${alternative}`);
      }
    }
  }
}
