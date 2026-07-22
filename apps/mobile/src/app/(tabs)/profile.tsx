import { Ionicons } from '@expo/vector-icons';
import { radii, spacing } from '@fitness-app/ui';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { useAuthStore } from '@/stores/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    confirmAction(
      {
        title: 'Sign out?',
        message: 'Your workouts stay on this device. You can sign back in any time.',
        confirmLabel: 'Sign out',
      },
      () => {
        void signOut();
      },
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText variant="title">Profile</ThemedText>

          {!ready ? null : user ? (
            <>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="person" size={24} color={theme.colors.onPrimary} />
                </View>
                <View style={styles.cardInfo}>
                  <ThemedText variant="caption" color="textSecondary">
                    Signed in as
                  </ThemedText>
                  <ThemedText variant="bodyBold">{user.email}</ThemedText>
                </View>
              </View>
              <Button label="Sign out" variant="secondary" onPress={handleSignOut} />
            </>
          ) : (
            <>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceSelected }]}>
                  <Ionicons name="cloud-outline" size={24} color={theme.colors.textSecondary} />
                </View>
                <View style={styles.cardInfo}>
                  <ThemedText variant="bodyBold">Back up your workouts</ThemedText>
                  <ThemedText variant="small" color="textSecondary">
                    An account keeps your history safe and lets you train from more than one device.
                    The app works without one.
                  </ThemedText>
                </View>
              </View>
              <Button label="Create an account" onPress={() => router.push('/auth/sign-up')} />
              <Button
                label="Sign in"
                variant="secondary"
                onPress={() => router.push('/auth/sign-in')}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
});
