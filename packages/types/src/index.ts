/**
 * Shared domain types. Add types when the feature that needs them
 * lands — no speculative modeling ahead of a milestone.
 */

export type { Equipment, ExperienceLevel, MeasurementType, MuscleGroup } from './core';
export type { Difficulty, Exercise, ExerciseMedia, MovementPattern } from './exercise';
export type {
  SessionExercise,
  SessionStatus,
  SetLog,
  WorkoutSession,
} from './session';
export type { Workout, WorkoutExercise, WorkoutTemplate } from './workout';
