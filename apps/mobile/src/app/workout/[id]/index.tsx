import { Ionicons } from '@expo/vector-icons';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findExercise } from '@/data/exercises';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { formatRest, formatTargets } from '@/lib/format';
import { useWorkoutsStore } from '@/stores/workouts';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const workout = useWorkoutsStore((state) => state.workouts.find((w) => w.id === id));
  const duplicateWorkout = useWorkoutsStore((state) => state.duplicateWorkout);
  const deleteWorkout = useWorkoutsStore((state) => state.deleteWorkout);

  if (!workout) {
    return (
      <ThemedView style={[styles.container, styles.missing]}>
        <Stack.Screen options={{ headerShown: true, title: 'Workout' }} />
        <ThemedText variant="subtitle">Workout not found</ThemedText>
        <ThemedText color="textSecondary">It may have been deleted.</ThemedText>
      </ThemedView>
    );
  }

  const handleDelete = () => {
    confirmAction(
      {
        title: 'Delete workout?',
        message: `"${workout.name}" will be permanently removed.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
      () => {
        deleteWorkout(workout.id);
        router.back();
      },
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: workout.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Active workout arrives in the next milestone — the button is honest about it. */}
        <Button label="Start workout (coming soon)" onPress={() => {}} disabled />

        <View style={styles.section}>
          <ThemedText variant="subtitle">Exercises</ThemedText>
          {workout.exercises.length === 0 && (
            <ThemedText color="textSecondary">No exercises yet — tap Edit to add some.</ThemedText>
          )}
          {workout.exercises.map((workoutExercise, index) => {
            const exercise = findExercise(workoutExercise.exerciseId);
            return (
              <Pressable
                key={workoutExercise.id}
                accessibilityRole="button"
                onPress={() => exercise && router.push(`/exercise/${exercise.slug}`)}
                style={({ pressed }) => [
                  styles.exerciseRow,
                  {
                    backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface,
                  },
                ]}
              >
                <ThemedText variant="bodyBold" color="primary" style={styles.index}>
                  {index + 1}
                </ThemedText>
                <View style={styles.exerciseInfo}>
                  <ThemedText variant="bodyBold">{exercise?.name ?? 'Unknown exercise'}</ThemedText>
                  <ThemedText variant="small" color="textSecondary">
                    {formatTargets(workoutExercise)} · rest{' '}
                    {formatRest(workoutExercise.restSeconds)}
                  </ThemedText>
                  {workoutExercise.note && (
                    <ThemedText variant="small" color="textSecondary">
                      Note: {workoutExercise.note}
                    </ThemedText>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button label="Edit workout" onPress={() => router.push(`/workout/${workout.id}/edit`)} />
          <Button
            label="Duplicate"
            variant="secondary"
            onPress={() => {
              const copy = duplicateWorkout(workout.id);
              if (copy) router.replace(`/workout/${copy.id}`);
            }}
          />
          <Button label="Delete workout" variant="destructive" onPress={handleDelete} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  missing: {
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
  section: {
    gap: spacing.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  index: {
    minWidth: 22,
  },
  exerciseInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  actions: {
    gap: spacing.sm,
  },
});
