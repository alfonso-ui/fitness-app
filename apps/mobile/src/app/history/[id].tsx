import { radii, spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findExercise } from '@/data/exercises';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { formatDate, formatDuration, formatSet } from '@/lib/format';
import { completedSetCount, sessionDurationMs, sessionVolume } from '@/lib/session';
import { useSessionHydrated, useSessionStore } from '@/stores/session';

export default function CompletedWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const session = useSessionStore((state) => state.completedSessions.find((s) => s.id === id));
  const activeSession = useSessionStore((state) => state.activeSession);
  const repeatSession = useSessionStore((state) => state.repeatSession);
  const hasHydrated = useSessionHydrated();

  if (!hasHydrated) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: true, title: 'Workout' }} />
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: true, title: 'Workout' }} />
        <ThemedText variant="subtitle">Workout not found</ThemedText>
        <ThemedText color="textSecondary">It may have been removed.</ThemedText>
      </ThemedView>
    );
  }

  const volume = sessionVolume(session);
  const stats = [
    { label: 'Duration', value: formatDuration(sessionDurationMs(session)) },
    { label: 'Sets done', value: `${completedSetCount(session)}` },
    ...(volume > 0 ? [{ label: 'Volume', value: `${Math.round(volume)}` }] : []),
  ];

  const handleRepeat = () => {
    const begin = () => {
      const repeated = repeatSession(session);
      router.replace(`/session/${repeated.id}`);
    };
    if (activeSession) {
      confirmAction(
        {
          title: 'Start this workout again?',
          message: 'You have another workout in progress. Starting this one will discard it.',
          confirmLabel: 'Start new',
          destructive: true,
        },
        begin,
      );
    } else {
      begin();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: session.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText color="textSecondary">
          {formatDate(session.endedAt ?? session.startedAt)}
        </ThemedText>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.stat, { backgroundColor: theme.colors.surface }]}>
              <ThemedText variant="heading">{stat.value}</ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle">Exercises</ThemedText>
          {session.exercises.map((sessionExercise) => {
            const exercise = findExercise(sessionExercise.exerciseId);
            const done = sessionExercise.sets.filter((set) => set.completed);
            return (
              <View
                key={sessionExercise.id}
                style={[styles.exercise, { backgroundColor: theme.colors.surface }]}
              >
                <ThemedText variant="bodyBold">{exercise?.name ?? 'Unknown exercise'}</ThemedText>
                {done.length === 0 ? (
                  <ThemedText variant="small" color="textSecondary">
                    No sets completed
                  </ThemedText>
                ) : (
                  done.map((set, index) => (
                    <View key={set.id} style={styles.setLine}>
                      <ThemedText variant="small" color="textSecondary">
                        Set {index + 1}
                      </ThemedText>
                      <ThemedText variant="small">{formatSet(set)}</ThemedText>
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </View>

        <Button label="Repeat this workout" onPress={handleRepeat} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xxs,
  },
  section: {
    gap: spacing.sm,
  },
  exercise: {
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  setLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
