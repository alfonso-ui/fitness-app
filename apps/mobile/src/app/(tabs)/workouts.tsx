import { Ionicons } from '@expo/vector-icons';
import type { Workout, WorkoutTemplate } from '@fitness-app/types';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { workoutTemplates } from '@/data/templates';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutsStore } from '@/stores/workouts';

function WorkoutRow({ workout, onPress }: { workout: Workout; onPress: () => void }) {
  const theme = useTheme();
  const count = workout.exercises.length;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${workout.name}, ${count} exercises`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface },
      ]}
    >
      <View style={styles.cardInfo}>
        <ThemedText variant="bodyBold">{workout.name}</ThemedText>
        <ThemedText variant="small" color="textSecondary">
          {count === 1 ? '1 exercise' : `${count} exercises`}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </Pressable>
  );
}

function TemplateRow({ template, onUse }: { template: WorkoutTemplate; onUse: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Use template ${template.name}`}
      onPress={onUse}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface },
      ]}
    >
      <View style={styles.cardInfo}>
        <ThemedText variant="bodyBold">{template.name}</ThemedText>
        <ThemedText variant="small" color="textSecondary">
          {template.description}
        </ThemedText>
      </View>
      <View style={[styles.useBadge, { backgroundColor: theme.colors.primary }]}>
        <Ionicons name="add" size={18} color={theme.colors.onPrimary} />
        <ThemedText variant="small" color="onPrimary">
          Use
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const workouts = useWorkoutsStore((state) => state.workouts);
  const createWorkout = useWorkoutsStore((state) => state.createWorkout);
  const createFromTemplate = useWorkoutsStore((state) => state.createFromTemplate);

  const sorted = [...workouts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText variant="title">Workouts</ThemedText>

          <Button
            label="New workout"
            onPress={() => {
              const workout = createWorkout('My Workout');
              router.push(`/workout/${workout.id}/edit`);
            }}
          />

          <View style={styles.section}>
            <ThemedText variant="subtitle">My workouts</ThemedText>
            {sorted.length === 0 ? (
              <ThemedText color="textSecondary">
                Nothing here yet. Start from a template below, or build your own.
              </ThemedText>
            ) : (
              sorted.map((workout) => (
                <WorkoutRow
                  key={workout.id}
                  workout={workout}
                  onPress={() => router.push(`/workout/${workout.id}`)}
                />
              ))
            )}
          </View>

          <View style={styles.section}>
            <ThemedText variant="subtitle">Templates</ThemedText>
            {workoutTemplates.map((template) => (
              <TemplateRow
                key={template.slug}
                template={template}
                onUse={() => {
                  const workout = createFromTemplate(template);
                  router.push(`/workout/${workout.id}`);
                }}
              />
            ))}
          </View>
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
  section: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  cardInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  useBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs + spacing.xxs,
    borderRadius: radii.full,
    gap: spacing.xxs,
  },
});
