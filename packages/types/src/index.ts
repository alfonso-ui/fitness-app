/**
 * Shared domain types.
 *
 * The workout/session model (Workout, WorkoutSession, SetLog, …) lands
 * with its own milestone — do not add speculative types before the
 * feature that needs them.
 */

export type { Equipment, ExperienceLevel, MeasurementType, MuscleGroup } from './core';
export type { Difficulty, Exercise, ExerciseMedia, MovementPattern } from './exercise';
export type { Workout, WorkoutExercise, WorkoutTemplate } from './workout';
