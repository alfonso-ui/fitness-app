import { Ionicons } from '@expo/vector-icons';
import { radii, spacing } from '@fitness-app/ui';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth';

const MIN_PASSWORD_LENGTH = 6;

export default function SignUpScreen() {
  const router = useRouter();
  const theme = useTheme();
  const signUp = useAuthStore((state) => state.signUp);
  const pendingConfirmationEmail = useAuthStore((state) => state.pendingConfirmationEmail);
  const clearPendingConfirmation = useAuthStore((state) => state.clearPendingConfirmation);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignUp = async () => {
    setBusy(true);
    setError(null);
    const result = await signUp(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // With confirmation on, the pending state below shows instead.
    if (useAuthStore.getState().pendingConfirmationEmail) return;
    // This screen can be the entry point (deep link, or a reload sitting
    // on it), where there is no history and back() would throw.
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  if (pendingConfirmationEmail) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Check your email' }} />
        <View style={styles.confirm}>
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="mail-outline" size={32} color={theme.colors.primary} />
          </View>
          <ThemedText variant="subtitle">Confirm your email</ThemedText>
          <ThemedText color="textSecondary" style={styles.centeredText}>
            We sent a confirmation link to {pendingConfirmationEmail}. Open it, then come back and
            sign in.
          </ThemedText>
          <Button
            label="Back to sign in"
            onPress={() => {
              clearPendingConfirmation();
              router.replace('/auth/sign-in');
            }}
          />
        </View>
      </ThemedView>
    );
  }

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Create account' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText color="textSecondary">
            An account backs up your workouts and history. Everything you have logged so far stays
            on this device either way.
          </ThemedText>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            secureTextEntry
            error={passwordTooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
          />

          {error && (
            <ThemedText variant="small" color="danger">
              {error}
            </ThemedText>
          )}

          <Button
            label={busy ? 'Creating account…' : 'Create account'}
            onPress={handleSignUp}
            disabled={busy || email.length === 0 || password.length < MIN_PASSWORD_LENGTH}
          />
          <Button
            label="I already have an account"
            variant="secondary"
            onPress={() => router.replace('/auth/sign-in')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  confirm: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
