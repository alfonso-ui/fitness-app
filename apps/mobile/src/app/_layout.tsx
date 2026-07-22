import { themes } from '@fitness-app/ui';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth';

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const theme = themes[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  // Restore any stored session and keep the store in sync with Supabase.
  useEffect(() => initializeAuth(), [initializeAuth]);

  // Keep React Navigation's chrome (headers, tab bar, backgrounds) in
  // sync with our design tokens so no screen ever mixes color systems.
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
