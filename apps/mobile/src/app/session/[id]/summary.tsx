import { Ionicons } from '@expo/vector-icons';
import { radii, spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { formatDuration } from '@/lib/format';
import { completedSetCount, sessionDurationMs, sessionVolume } from '@/lib/session';
import { useSessionHydrated, useSessionStore } from '@/stores/session';

export default function SessionSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const session = useSessionStore((state) => state.completedSessions.find((s) => s.id === id));
  const hasHydrated = useSessionHydrated();

  if (!hasHydrated) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: true, title: 'Summary' }} />
        <ThemedText variant="subtitle">Summary not found</ThemedText>
        <Button label="Back to workouts" onPress={() => router.replace('/workouts')} />
      </ThemedView>
    );
  }

  const volume = sessionVolume(session);
  const stats = [
    { label: 'Duration', value: formatDuration(sessionDurationMs(session)) },
    { label: 'Exercises', value: `${session.exercises.length}` },
    { label: 'Sets done', value: `${completedSetCount(session)}` },
    ...(volume > 0 ? [{ label: 'Total volume', value: `${Math.round(volume)}` }] : []),
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
            <Ionicons name="checkmark" size={40} color={theme.colors.onPrimary} />
          </View>
          <ThemedText variant="title" style={styles.centeredText}>
            Workout complete
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centeredText}>
            Nice work on {session.name}. That's another one in the books.
          </ThemedText>

          <View style={styles.stats}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={[styles.stat, { backgroundColor: theme.colors.surface }]}
              >
                <ThemedText variant="heading">{stat.value}</ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  {stat.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Done" onPress={() => router.replace('/workouts')} />
        </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  centeredText: {
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  stat: {
    minWidth: 140,
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    gap: spacing.xxs,
  },
  footer: {
    padding: spacing.md,
  },
});
