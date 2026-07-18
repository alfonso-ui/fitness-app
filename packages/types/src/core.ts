/**
 * Base domain unions shared across features.
 *
 * This is intentionally a small set. Add values only when a feature
 * actually needs them.
 */

/** How a set is measured. Most strength work is weight × reps. */
export type MeasurementType = 'weight_reps' | 'reps_only' | 'duration' | 'distance';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'full_body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'kettlebell'
  | 'resistance_band'
  | 'bodyweight'
  | 'other';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
