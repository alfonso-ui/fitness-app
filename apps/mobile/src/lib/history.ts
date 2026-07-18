import type { SetLog, WorkoutSession } from '@fitness-app/types';

/** Completed sessions, newest first. */
export function sortedByDate(sessions: WorkoutSession[]): WorkoutSession[] {
  return [...sessions].sort((a, b) =>
    (b.endedAt ?? b.startedAt).localeCompare(a.endedAt ?? a.startedAt),
  );
}

/** How many sessions finished within the last `days` days. */
export function countInLastDays(sessions: WorkoutSession[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return sessions.filter((session) => Date.parse(session.endedAt ?? session.startedAt) >= cutoff)
    .length;
}

/** Heaviest completed set; falls back to most reps when nothing is weighted. */
export function bestSet(sets: SetLog[]): SetLog | null {
  const done = sets.filter((set) => set.completed);
  if (done.length === 0) return null;
  return done.reduce((best, set) => {
    const bestWeight = best.weight ?? 0;
    const setWeight = set.weight ?? 0;
    if (setWeight !== bestWeight) return setWeight > bestWeight ? set : best;
    return (set.reps ?? 0) > (best.reps ?? 0) ? set : best;
  });
}

export type ExerciseHistoryEntry = {
  sessionId: string;
  sessionName: string;
  date: string;
  sets: SetLog[];
};

/** Every past appearance of an exercise, newest first. */
export function exerciseHistory(
  sessions: WorkoutSession[],
  exerciseId: string,
): ExerciseHistoryEntry[] {
  return sortedByDate(sessions).flatMap((session) => {
    const match = session.exercises.find((exercise) => exercise.exerciseId === exerciseId);
    const done = match?.sets.filter((set) => set.completed) ?? [];
    if (done.length === 0) return [];
    return [
      {
        sessionId: session.id,
        sessionName: session.name,
        date: session.endedAt ?? session.startedAt,
        sets: done,
      },
    ];
  });
}

/** Best completed set ever recorded for an exercise. */
export function personalBest(sessions: WorkoutSession[], exerciseId: string): SetLog | null {
  const allSets = exerciseHistory(sessions, exerciseId).flatMap((entry) => entry.sets);
  return bestSet(allSets);
}
