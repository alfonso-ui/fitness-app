import { spacing } from '@fitness-app/ui';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/stores/auth';

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // Opened from Profile there is history to pop, but this screen can
    // also be the entry point (deep link, or a reload sitting on it),
    // where back() would throw.
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Sign in' }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText color="textSecondary">
            Sign in to back up your workouts and reach them from any device.
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
            placeholder="Your password"
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            secureTextEntry
          />

          {error && (
            <ThemedText variant="small" color="danger">
              {error}
            </ThemedText>
          )}

          <Button
            label={busy ? 'Signing in…' : 'Sign in'}
            onPress={handleSignIn}
            disabled={busy || email.length === 0 || password.length === 0}
          />

          <View style={styles.links}>
            <Button
              label="Forgot your password?"
              variant="secondary"
              onPress={() => router.push('/auth/forgot-password')}
            />
            <Button
              label="Create an account"
              variant="secondary"
              onPress={() => router.replace('/auth/sign-up')}
            />
          </View>
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
  links: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
