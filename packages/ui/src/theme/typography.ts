import { Platform, type TextStyle } from 'react-native';

/** System font stacks per platform — no custom fonts until branding is approved. */
export const fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  web: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    rounded: 'ui-rounded, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
});

/**
 * Text variants used across the app. Sizes favor legibility at arm's
 * length in a gym — body text never goes below 16, captions never
 * below 12.
 */
export const textVariants = {
  title: { fontSize: 32, lineHeight: 38, fontWeight: 700 },
  heading: { fontSize: 24, lineHeight: 30, fontWeight: 600 },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: 600 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: 400 },
  bodyBold: { fontSize: 16, lineHeight: 24, fontWeight: 600 },
  small: { fontSize: 14, lineHeight: 20, fontWeight: 500 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: 500 },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
