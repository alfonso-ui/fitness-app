import type { SetLog, Workout, WorkoutSession } from '@fitness-app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { makeSet, sessionFromPrevious, sessionFromWorkout } from '@/lib/session';

type SetPatch = Partial<Pick<SetLog, 'weight' | 'reps'>>;

type SessionState = {
  activeSession: WorkoutSession | null;
  completedSessions: WorkoutSession[];
  /** ISO time when the current rest ends, or null when not resting. Timestamp, not a ticking counter — survives backgrounding. */
  restEndsAt: string | null;

  startSession: (workout: Workout) => WorkoutSession;
  /** Start a fresh session from a past one, using that session's own snapshot. */
  repeatSession: (session: WorkoutSession) => WorkoutSession;
  updateSet: (sessionExerciseId: string, setId: string, patch: SetPatch) => void;
  completeSet: (sessionExerciseId: string, setId: string) => void;
  uncompleteSet: (sessionExerciseId: string, setId: string) => void;
  addSet: (sessionExerciseId: string) => void;
  removeSet: (sessionExerciseId: string, setId: string) => void;
  setCurrentExerciseIndex: (index: number) => void;
  substituteExercise: (sessionExerciseId: string, newExerciseId: string) => void;

  startRest: (seconds: number) => void;
  addRestTime: (seconds: number) => void;
  skipRest: () => void;

  finishSession: () => WorkoutSession | null;
  cancelSession: () => void;
  /** Merge completed sessions pulled from the cloud, keeping local ones. */
  mergeRemoteSessions: (remote: WorkoutSession[]) => void;
};

function mapExercise(
  session: WorkoutSession,
  sessionExerciseId: string,
  update: (exercise: WorkoutSession['exercises'][number]) => WorkoutSession['exercises'][number],
): WorkoutSession {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.id === sessionExerciseId ? update(exercise) : exercise,
    ),
  };
}

function mapSet(
  session: WorkoutSession,
  sessionExerciseId: string,
  setId: string,
  update: (set: SetLog) => SetLog,
): WorkoutSession {
  return mapExercise(session, sessionExerciseId, (exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => (set.id === setId ? update(set) : set)),
  }));
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      completedSessions: [],
      restEndsAt: null,

      startSession: (workout) => {
        const session = sessionFromWorkout(workout, get().completedSessions);
        set({ activeSession: session, restEndsAt: null });
        return session;
      },

      repeatSession: (session) => {
        const repeated = sessionFromPrevious(session, get().completedSessions);
        set({ activeSession: repeated, restEndsAt: null });
        return repeated;
      },

      updateSet: (sessionExerciseId, setId, patch) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: mapSet(activeSession, sessionExerciseId, setId, (s) => ({
            ...s,
            ...patch,
          })),
        });
      },

      completeSet: (sessionExerciseId, setId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const exercise = activeSession.exercises.find((e) => e.id === sessionExerciseId);
        const updated = mapSet(activeSession, sessionExerciseId, setId, (s) => ({
          ...s,
          completed: true,
          completedAt: new Date().toISOString(),
        }));
        const restEndsAt = exercise
          ? new Date(Date.now() + exercise.restSeconds * 1000).toISOString()
          : get().restEndsAt;
        set({ activeSession: updated, restEndsAt });
      },

      uncompleteSet: (sessionExerciseId, setId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: mapSet(activeSession, sessionExerciseId, setId, (s) => ({
            ...s,
            completed: false,
            completedAt: undefined,
          })),
        });
      },

      addSet: (sessionExerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: mapExercise(activeSession, sessionExerciseId, (exercise) => ({
            ...exercise,
            sets: [...exercise.sets, makeSet()],
          })),
        });
      },

      removeSet: (sessionExerciseId, setId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: mapExercise(activeSession, sessionExerciseId, (exercise) => ({
            ...exercise,
            sets: exercise.sets.filter((s) => s.id !== setId),
          })),
        });
      },

      setCurrentExerciseIndex: (index) => {
        const { activeSession } = get();
        if (!activeSession) return;
        const clamped = Math.max(0, Math.min(index, activeSession.exercises.length - 1));
        set({ activeSession: { ...activeSession, currentExerciseIndex: clamped } });
      },

      substituteExercise: (sessionExerciseId, newExerciseId) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({
          activeSession: mapExercise(activeSession, sessionExerciseId, (exercise) => ({
            ...exercise,
            exerciseId: newExerciseId,
          })),
        });
      },

      startRest: (seconds) => {
        set({ restEndsAt: new Date(Date.now() + seconds * 1000).toISOString() });
      },

      addRestTime: (seconds) => {
        const { restEndsAt } = get();
        const base = restEndsAt ? Date.parse(restEndsAt) : Date.now();
        set({ restEndsAt: new Date(base + seconds * 1000).toISOString() });
      },

      skipRest: () => set({ restEndsAt: null }),

      finishSession: () => {
        const { activeSession, completedSessions } = get();
        if (!activeSession) return null;
        const finished: WorkoutSession = {
          ...activeSession,
          status: 'completed',
          endedAt: new Date().toISOString(),
        };
        set({
          activeSession: null,
          restEndsAt: null,
          completedSessions: [finished, ...completedSessions],
        });
        return finished;
      },

      cancelSession: () => set({ activeSession: null, restEndsAt: null }),

      mergeRemoteSessions: (remote) => {
        const { completedSessions } = get();
        const byId = new Map(completedSessions.map((session) => [session.id, session]));
        // Completed sessions are immutable, so a simple union by id is
        // enough — add any the device doesn't already have.
        for (const session of remote) {
          if (!byId.has(session.id)) byId.set(session.id, session);
        }
        set({ completedSessions: [...byId.values()] });
      },
    }),
    {
      name: 'sessions-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * True once the persisted session state has loaded from storage. Backed
 * by component-local state that only updates in a browser/native effect,
 * so it never triggers a storage write during static web rendering
 * (where `window` is undefined). Screens use it to wait for a possible
 * saved session before deciding one is missing.
 */
export function useSessionHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useSessionStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useSessionStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useSessionStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  return hydrated;
}
