import type { Workout, WorkoutExercise, WorkoutTemplate } from '@fitness-app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { newId } from '@/lib/id';

const NEW_EXERCISE_DEFAULTS = {
  targetSets: 3,
  targetRepsMin: 8,
  targetRepsMax: 12,
  restSeconds: 90,
} as const;

type ExercisePatch = Partial<Omit<WorkoutExercise, 'id' | 'exerciseId'>>;

type WorkoutsState = {
  workouts: Workout[];
  createWorkout: (name: string) => Workout;
  createFromTemplate: (template: WorkoutTemplate) => Workout;
  duplicateWorkout: (id: string) => Workout | undefined;
  deleteWorkout: (id: string) => void;
  renameWorkout: (id: string, name: string) => void;
  addExercise: (workoutId: string, exerciseId: string) => void;
  removeExercise: (workoutId: string, workoutExerciseId: string) => void;
  moveExercise: (workoutId: string, workoutExerciseId: string, direction: -1 | 1) => void;
  updateExercise: (workoutId: string, workoutExerciseId: string, patch: ExercisePatch) => void;
  /** Merge workouts pulled from the cloud, newer `updatedAt` winning per id. */
  mergeRemoteWorkouts: (remote: Workout[]) => void;
};

function withUpdate(
  workouts: Workout[],
  id: string,
  update: (workout: Workout) => Workout,
): Workout[] {
  return workouts.map((workout) =>
    workout.id === id ? { ...update(workout), updatedAt: new Date().toISOString() } : workout,
  );
}

export const useWorkoutsStore = create<WorkoutsState>()(
  persist(
    (set, get) => ({
      workouts: [],

      createWorkout: (name) => {
        const now = new Date().toISOString();
        const workout: Workout = {
          id: newId(),
          name,
          exercises: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ workouts: [workout, ...state.workouts] }));
        return workout;
      },

      createFromTemplate: (template) => {
        const now = new Date().toISOString();
        const workout: Workout = {
          id: newId(),
          name: template.name,
          exercises: template.exercises.map((exercise) => ({ ...exercise, id: newId() })),
          sourceTemplateSlug: template.slug,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ workouts: [workout, ...state.workouts] }));
        return workout;
      },

      duplicateWorkout: (id) => {
        const source = get().workouts.find((workout) => workout.id === id);
        if (!source) return undefined;
        const now = new Date().toISOString();
        const copy: Workout = {
          ...source,
          id: newId(),
          name: `${source.name} (copy)`,
          exercises: source.exercises.map((exercise) => ({ ...exercise, id: newId() })),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ workouts: [copy, ...state.workouts] }));
        return copy;
      },

      deleteWorkout: (id) => {
        set((state) => ({ workouts: state.workouts.filter((workout) => workout.id !== id) }));
      },

      renameWorkout: (id, name) => {
        set((state) => ({ workouts: withUpdate(state.workouts, id, (w) => ({ ...w, name })) }));
      },

      addExercise: (workoutId, exerciseId) => {
        set((state) => ({
          workouts: withUpdate(state.workouts, workoutId, (workout) => ({
            ...workout,
            exercises: [
              ...workout.exercises,
              { id: newId(), exerciseId, ...NEW_EXERCISE_DEFAULTS },
            ],
          })),
        }));
      },

      removeExercise: (workoutId, workoutExerciseId) => {
        set((state) => ({
          workouts: withUpdate(state.workouts, workoutId, (workout) => ({
            ...workout,
            exercises: workout.exercises.filter((exercise) => exercise.id !== workoutExerciseId),
          })),
        }));
      },

      moveExercise: (workoutId, workoutExerciseId, direction) => {
        set((state) => ({
          workouts: withUpdate(state.workouts, workoutId, (workout) => {
            const index = workout.exercises.findIndex((e) => e.id === workoutExerciseId);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= workout.exercises.length) return workout;
            const exercises = [...workout.exercises];
            const [moved] = exercises.splice(index, 1);
            if (moved) exercises.splice(target, 0, moved);
            return { ...workout, exercises };
          }),
        }));
      },

      updateExercise: (workoutId, workoutExerciseId, patch) => {
        set((state) => ({
          workouts: withUpdate(state.workouts, workoutId, (workout) => ({
            ...workout,
            exercises: workout.exercises.map((exercise) =>
              exercise.id === workoutExerciseId ? { ...exercise, ...patch } : exercise,
            ),
          })),
        }));
      },

      mergeRemoteWorkouts: (remote) => {
        const byId = new Map(get().workouts.map((workout) => [workout.id, workout]));
        for (const incoming of remote) {
          const existing = byId.get(incoming.id);
          // Last-write-wins: adopt the remote row only when it is newer.
          if (!existing || incoming.updatedAt > existing.updatedAt) {
            byId.set(incoming.id, incoming);
          }
        }
        set({ workouts: [...byId.values()] });
      },
    }),
    {
      name: 'workouts-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
