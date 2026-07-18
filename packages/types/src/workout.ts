/**
 * A planned exercise inside a workout: which exercise, and the targets
 * the user is aiming for. Actual performed sets are a separate model
 * that arrives with the active-workout milestone.
 */
export type WorkoutExercise = {
  /** Stable id within the workout (survives reordering). */
  id: string;
  /** References Exercise.id. */
  exerciseId: string;
  targetSets: number;
  /** Lower bound of the target rep range. */
  targetRepsMin: number;
  /** Upper bound; equal to targetRepsMin when the target is a single number. */
  targetRepsMax: number;
  restSeconds: number;
  note?: string;
};

export type Workout = {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  /** Slug of the template this workout was created from, if any. */
  sourceTemplateSlug?: string;
  createdAt: string;
  updatedAt: string;
};

/** A curated starting point users can turn into their own workout. */
export type WorkoutTemplate = {
  slug: string;
  name: string;
  description: string;
  exercises: Omit<WorkoutExercise, 'id'>[];
};
