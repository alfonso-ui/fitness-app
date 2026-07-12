import { darkColors, lightColors } from './colors';
import { radii } from './radii';
import { minTouchTarget, spacing } from './spacing';
import { fonts, textVariants } from './typography';

export const themes = {
  light: {
    colors: lightColors,
    spacing,
    radii,
    fonts,
    textVariants,
    minTouchTarget,
  },
  dark: {
    colors: darkColors,
    spacing,
    radii,
    fonts,
    textVariants,
    minTouchTarget,
  },
} as const;

export type ColorSchemeName = keyof typeof themes;
export type Theme = (typeof themes)[ColorSchemeName];

export type { ColorName } from './colors';
export type { RadiusName } from './radii';
// Raw scheme-independent tokens, for static StyleSheet.create() usage.
export { radii } from './radii';
export type { SpacingName } from './spacing';
export { minTouchTarget, spacing } from './spacing';
export type { TextVariant } from './typography';
export { fonts, textVariants } from './typography';
