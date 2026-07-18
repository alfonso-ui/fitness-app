/**
 * A performed workout. When a session starts, the workout plan is
 * SNAPSHOTTED into the session (targets copied per exercise), so later
 * edits to the source Workout never rewrite historical sessions.
 */

export type SetLog = {
  id: string;
  /** Load in the user's unit. null for bodyweight / reps-only / not-yet-entered. */
  weight: number | null;
  /** Reps performed — or seconds held for duration exercises. null until entered. */
  reps: number | null;
  completed: boolean;
  /** ISO timestamp set when the set is marked complete. */
  completedAt?: string;
  /** Reserved: warm-up sets get dedicated UI in a later milestone. */
  isWarmup: boolean;
};

/** A planned exercise inside a session, plus the sets performed against it. */
export type SessionExercise = {
  /** Carried from the source WorkoutExercise.id. */
  id: string;
  /** References Exercise.id. Changes when the user substitutes mid-workout. */
  exerciseId: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  restSeconds: number;
  note?: string;
  sets: SetLog[];
};

export type SessionStatus = 'active' | 'completed' | 'cancelled';

export type WorkoutSession = {
  id: string;
  /** Source workout, kept for "repeat this workout" — the plan itself is snapshotted below. */
  workoutId: string;
  name: string;
  status: SessionStatus;
  exercises: SessionExercise[];
  /** Which exercise Focus Mode is showing; restored on resume. */
  currentExerciseIndex: number;
  startedAt: string;
  endedAt?: string;
};
