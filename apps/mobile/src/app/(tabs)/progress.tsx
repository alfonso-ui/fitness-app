import { Ionicons } from '@expo/vector-icons';
import type { WorkoutSession } from '@fitness-app/types';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, formatDuration } from '@/lib/format';
import { countInLastDays, sortedByDate } from '@/lib/history';
import { completedSetCount, sessionDurationMs } from '@/lib/session';
import { useSessionStore } from '@/stores/session';

function SessionRow({ session, onPress }: { session: WorkoutSession; onPress: () => void }) {
  const theme = useTheme();
  const sets = completedSetCount(session);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${session.name}, ${formatDate(session.endedAt ?? session.startedAt)}, ${sets} sets`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface },
      ]}
    >
      <View style={styles.rowInfo}>
        <ThemedText variant="bodyBold">{session.name}</ThemedText>
        <ThemedText variant="small" color="textSecondary">
          {formatDate(session.endedAt ?? session.startedAt)} ·{' '}
          {formatDuration(sessionDurationMs(session))} · {sets} {sets === 1 ? 'set' : 'sets'}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </Pressable>
  );
}

export default function ProgressScreen() {
  const router = useRouter();
  const theme = useTheme();
  const completedSessions = useSessionStore((state) => state.completedSessions);

  const history = sortedByDate(completedSessions);
  const stats = [
    { label: 'This week', value: `${countInLastDays(completedSessions, 7)}` },
    { label: 'This month', value: `${countInLastDays(completedSessions, 30)}` },
    { label: 'All time', value: `${completedSessions.length}` },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText variant="title">Progress</ThemedText>

          {history.length === 0 ? (
            <View style={[styles.empty, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="trending-up-outline" size={32} color={theme.colors.textSecondary} />
              <ThemedText variant="subtitle">No workouts yet</ThemedText>
              <ThemedText color="textSecondary" style={styles.emptyText}>
                Finish your first workout and it will show up here, along with your weekly count and
                history.
              </ThemedText>
            </View>
          ) : (
            <>
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

              <View style={styles.section}>
                <ThemedText variant="subtitle">History</ThemedText>
                {history.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onPress={() => router.push(`/history/${session.id}`)}
                  />
                ))}
              </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  rowInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.md,
  },
  emptyText: {
    textAlign: 'center',
  },
});
