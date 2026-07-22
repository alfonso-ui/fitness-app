import { spacing } from '@fitness-app/ui';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/stores/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const sendPasswordReset = useAuthStore((state) => state.sendPasswordReset);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSend = async () => {
    setBusy(true);
    setError(null);
    const result = await sendPasswordReset(email);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Reset password' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {sent ? (
            <>
              <ThemedText variant="subtitle">Check your email</ThemedText>
              <ThemedText color="textSecondary">
                If an account exists for {email.trim()}, we've sent a link to reset the password.
              </ThemedText>
              <Button label="Back to sign in" onPress={() => router.replace('/auth/sign-in')} />
            </>
          ) : (
            <>
              <ThemedText color="textSecondary">
                Enter your email address and we'll send you a link to set a new password.
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
              {error && (
                <ThemedText variant="small" color="danger">
                  {error}
                </ThemedText>
              )}
              <Button
                label={busy ? 'Sending…' : 'Send reset link'}
                onPress={handleSend}
                disabled={busy || email.length === 0}
              />
            </>
          )}
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
});
