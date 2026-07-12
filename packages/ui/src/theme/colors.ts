/**
 * PROVISIONAL palette — final branding is not approved yet.
 * These values exist so screens are built against tokens, never
 * hard-coded hex values. Swapping the brand later means editing
 * this file only.
 */

export const lightColors = {
  background: '#FFFFFF',
  surface: '#F4F5F7',
  surfaceSelected: '#E7E9EC',
  text: '#17181A',
  textSecondary: '#5F646C',
  border: '#E2E4E8',
  primary: '#4F5BD5',
  onPrimary: '#FFFFFF',
  success: '#1D9A6C',
  danger: '#C64242',
} as const;

export const darkColors = {
  background: '#0B0C0F',
  surface: '#17191E',
  surfaceSelected: '#23262D',
  text: '#F5F6F8',
  textSecondary: '#A6ABB5',
  border: '#2A2E36',
  primary: '#8A96F0',
  onPrimary: '#0B0C0F',
  success: '#3DC08D',
  danger: '#E57373',
} as const;

export type ColorName = keyof typeof lightColors;
