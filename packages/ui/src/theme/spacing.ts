export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type SpacingName = keyof typeof spacing;

/**
 * Minimum touch-target size (points). Workout controls are used
 * mid-set with one hand — never build interactive elements smaller
 * than this.
 */
export const minTouchTarget = 44;
