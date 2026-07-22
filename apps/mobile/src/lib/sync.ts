import type { Workout, WorkoutExercise, WorkoutSession } from '@fitness-app/types';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useSessionStore } from '@/stores/session';
import { useWorkoutsStore } from '@/stores/workouts';

/**
 * Outcome of a sync attempt. The app is fully usable in every case —
 * sync is a background convenience, never a blocker.
 * - `ok`: pushed and pulled successfully
 * - `not-configured`: no Supabase credentials in this build
 * - `signed-out`: nobody is signed in, so there is nothing to sync
 * - `not-provisioned`: signed in, but the cloud tables don't exist yet
 *   (migration 0002 hasn't been run) — treated as a clean no-op
 * - `error`: an unexpected failure; local data is untouched
 */
export type SyncOutcome = 'ok' | 'not-configured' | 'signed-out' | 'not-provisioned' | 'error';

// ---------------------------------------------------------------------------
// Row <-> domain mapping. The database stores nested exercises/sets as jsonb,
// so these are plain field renames, no normalisation.
// ---------------------------------------------------------------------------

type WorkoutRow = {
  id: string;
  user_id: string;
  name: string;
  exercises: WorkoutExercise[];
  source_template_slug: string | null;
  created_at: string;
  updated_at: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  workout_id: string;
  name: string;
  status: WorkoutSession['status'];
  exercises: WorkoutSession['exercises'];
  current_exercise_index: number;
  started_at: string;
  ended_at: string | null;
  updated_at: string;
};

function workoutToRow(workout: Workout, userId: string): WorkoutRow {
  return {
    id: workout.id,
    user_id: userId,
    name: workout.name,
    exercises: workout.exercises,
    source_template_slug: workout.sourceTemplateSlug ?? null,
    created_at: workout.createdAt,
    updated_at: workout.updatedAt,
  };
}

function rowToWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    name: row.name,
    exercises: row.exercises,
    sourceTemplateSlug: row.source_template_slug ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sessionToRow(session: WorkoutSession, userId: string): SessionRow {
  return {
    id: session.id,
    user_id: userId,
    workout_id: session.workoutId,
    name: session.name,
    status: session.status,
    exercises: session.exercises,
    current_exercise_index: session.currentExerciseIndex,
    started_at: session.startedAt,
    ended_at: session.endedAt ?? null,
    // Completed sessions are immutable, so their end time is a stable
    // last-write marker.
    updated_at: session.endedAt ?? session.startedAt,
  };
}

function rowToSession(row: SessionRow): WorkoutSession {
  return {
    id: row.id,
    workoutId: row.workout_id,
    name: row.name,
    status: row.status,
    exercises: row.exercises,
    currentExerciseIndex: row.current_exercise_index,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
  };
}

/** Postgres/PostgREST codes that mean "the table isn't there yet". */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === 'PGRST205' || // PostgREST: table not in schema cache
    error.code === '42P01' || // Postgres: undefined_table
    /does not exist/i.test(error.message ?? '')
  );
}

/**
 * Two-way sync for the signed-in user. Pulls remote rows and merges them
 * into the local stores (last-write-wins by timestamp), then pushes the
 * merged local set back up so the server matches. Local data is the
 * source of truth and is never deleted by a sync.
 *
 * Never throws: every failure maps to a SyncOutcome so callers can show
 * status without risk to the workout in progress.
 */
export async function syncAll(userId: string | undefined): Promise<SyncOutcome> {
  if (!isSupabaseConfigured) return 'not-configured';
  if (!userId) return 'signed-out';

  try {
    // 1. Pull.
    const [workoutsRes, sessionsRes] = await Promise.all([
      supabase.from('workouts').select('*').eq('user_id', userId),
      supabase.from('workout_sessions').select('*').eq('user_id', userId).eq('status', 'completed'),
    ]);

    if (isMissingTable(workoutsRes.error) || isMissingTable(sessionsRes.error)) {
      return 'not-provisioned';
    }
    if (workoutsRes.error || sessionsRes.error) return 'error';

    const remoteWorkouts = (workoutsRes.data as WorkoutRow[]).map(rowToWorkout);
    const remoteSessions = (sessionsRes.data as SessionRow[]).map(rowToSession);

    // 2. Merge remote into local (newer wins).
    useWorkoutsStore.getState().mergeRemoteWorkouts(remoteWorkouts);
    useSessionStore.getState().mergeRemoteSessions(remoteSessions);

    // 3. Push the merged local set up. Any local row with no user_id yet
    //    (created while signed out) is adopted into this account here.
    const localWorkouts = useWorkoutsStore.getState().workouts;
    const localSessions = useSessionStore
      .getState()
      .completedSessions.filter((session) => session.status === 'completed');

    if (localWorkouts.length > 0) {
      const { error } = await supabase
        .from('workouts')
        .upsert(localWorkouts.map((workout) => workoutToRow(workout, userId)));
      if (error) return 'error';
    }
    if (localSessions.length > 0) {
      const { error } = await supabase
        .from('workout_sessions')
        .upsert(localSessions.map((session) => sessionToRow(session, userId)));
      if (error) return 'error';
    }

    return 'ok';
  } catch {
    return 'error';
  }
}
