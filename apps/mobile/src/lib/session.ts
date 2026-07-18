import type { SessionExercise, SetLog, Workout, WorkoutSession } from '@fitness-app/types';

import { newId } from '@/lib/id';

/** Build a fresh, empty set for an exercise. */
export function makeSet(): SetLog {
  return { id: newId(), weight: null, reps: null, completed: false, isWarmup: false };
}

/** The target fields a session needs, shared by workouts and past sessions. */
type PlannedExercise = Omit<SessionExercise, 'sets'>;

/**
 * Snapshot a plan into a new active session. Targets are copied so later
 * edits to the source workout never touch this session. Sets are
 * pre-seeded and, where history exists, pre-filled with last time's
 * weight and reps so the user usually just confirms each set.
 */
function buildSession(
  workoutId: string,
  name: string,
  plan: PlannedExercise[],
  history: WorkoutSession[],
): WorkoutSession {
  return {
    id: newId(),
    workoutId,
    name,
    status: 'active',
    currentExerciseIndex: 0,
    startedAt: new Date().toISOString(),
    exercises: plan.map((exercise) => {
      const previous = previousPerformance(history, exercise.exerciseId);
      const setCount = Math.max(1, exercise.targetSets);
      return {
        ...exercise,
        sets: Array.from({ length: setCount }, (_ignored, index) => {
          const priorSet =
            previous?.sets[index] ?? previous?.sets[previous.sets.length - 1] ?? undefined;
          return {
            ...makeSet(),
            weight: priorSet?.weight ?? null,
            reps: priorSet?.reps ?? exercise.targetRepsMin,
          };
        }),
      };
    }),
  };
}

export function sessionFromWorkout(
  workout: Workout,
  history: WorkoutSession[] = [],
): WorkoutSession {
  return buildSession(workout.id, workout.name, workout.exercises, history);
}

/**
 * Repeat a past session using its own snapshot, so it still works even
 * if the source workout has since been edited or deleted.
 */
export function sessionFromPrevious(
  previous: WorkoutSession,
  history: WorkoutSession[] = [],
): WorkoutSession {
  const plan = previous.exercises.map(({ sets: _sets, ...targets }) => targets);
  return buildSession(previous.workoutId, previous.name, plan, history);
}

export function completedSetCount(session: WorkoutSession): number {
  return session.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
    0,
  );
}

/** Total volume (weight × reps) over completed sets that have both values. */
export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce((sum, set) => {
        if (set.completed && set.weight != null && set.reps != null) {
          return sum + set.weight * set.reps;
        }
        return sum;
      }, 0),
    0,
  );
}

export function sessionDurationMs(session: WorkoutSession): number {
  const end = session.endedAt ? Date.parse(session.endedAt) : Date.now();
  return Math.max(0, end - Date.parse(session.startedAt));
}

/**
 * The most recent completed sets logged for an exercise, across prior
 * completed sessions — the "what did I do last time" reference shown in
 * Focus Mode. Returns null when there is no history yet.
 */
export function previousPerformance(
  completedSessions: WorkoutSession[],
  exerciseId: string,
): { date: string; sets: SetLog[] } | null {
  const ordered = [...completedSessions].sort((a, b) =>
    (b.endedAt ?? b.startedAt).localeCompare(a.endedAt ?? a.startedAt),
  );
  for (const session of ordered) {
    const match = session.exercises.find(
      (exercise: SessionExercise) => exercise.exerciseId === exerciseId,
    );
    const done = match?.sets.filter((set) => set.completed) ?? [];
    if (done.length > 0) {
      return { date: session.endedAt ?? session.startedAt, sets: done };
    }
  }
  return null;
}
