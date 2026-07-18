import type { Equipment, ExperienceLevel, MeasurementType, MuscleGroup } from './core';

/** Fundamental movement categories, used for substitution and program balance. */
export type MovementPattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'push_horizontal'
  | 'push_vertical'
  | 'pull_horizontal'
  | 'pull_vertical'
  | 'carry'
  | 'core'
  | 'isolation';

export type Difficulty = ExperienceLevel;

/**
 * Internal media record for an exercise demonstration.
 *
 * Deliberately provider-agnostic: the domain model never stores
 * provider-specific URLs directly (handoff §20). Seed exercises omit
 * `media` entirely and the UI renders a placeholder — real, licensed
 * assets arrive in the media milestone.
 */
export type ExerciseMedia = {
  posterUrl?: string;
  videoUrl?: string;
};

export type Exercise = {
  /** Stable internal id. For seed data this equals the slug. */
  id: string;
  /** URL-safe unique identifier, e.g. "barbell-back-squat". */
  slug: string;
  name: string;
  /** One or two sentences: what the exercise is and why you'd do it. */
  description: string;
  /** Ordered how-to steps. */
  instructions: string[];
  /** Short coaching cues. */
  tips: string[];
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  movementPattern: MovementPattern;
  difficulty: Difficulty;
  measurementType: MeasurementType;
  /** True when the exercise trains one side at a time (each-side logging). */
  isUnilateral: boolean;
  /** Slugs of reasonable substitutions. */
  alternatives: string[];
  tags: string[];
  safetyNotes?: string;
  media?: ExerciseMedia;
  /** Inactive exercises stay resolvable in history but are hidden from discovery. */
  isActive: boolean;
};
