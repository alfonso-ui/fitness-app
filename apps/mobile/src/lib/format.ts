import type { WorkoutExercise } from '@fitness-app/types';

/** "90s" → "1m 30s", "60" → "1m", "45" → "45s". */
export function formatRest(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  if (rest === 0) return `${minutes}m`;
  return `${minutes}m ${rest}s`;
}

/** "3 × 8–12" or "3 × 10" when the range collapses to one number. */
export function formatTargets(exercise: WorkoutExercise): string {
  const { targetSets, targetRepsMin, targetRepsMax } = exercise;
  const reps =
    targetRepsMin === targetRepsMax ? `${targetRepsMin}` : `${targetRepsMin}–${targetRepsMax}`;
  return `${targetSets} × ${reps}`;
}
