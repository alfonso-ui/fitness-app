import { Ionicons } from '@expo/vector-icons';
import type { WorkoutExercise } from '@fitness-app/types';
import { minTouchTarget, radii, spacing, textVariants } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Stepper } from '@/components/stepper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findExercise } from '@/data/exercises';
import { useTheme } from '@/hooks/use-theme';
import { formatRest } from '@/lib/format';
import { useWorkoutsStore } from '@/stores/workouts';

const REST_STEP_SECONDS = 15;
const MAX_SETS = 10;
const MAX_REPS = 50;
const MAX_REST_SECONDS = 600;

function ExerciseEditor({
  workoutId,
  workoutExercise,
  isFirst,
  isLast,
}: {
  workoutId: string;
  workoutExercise: WorkoutExercise;
  isFirst: boolean;
  isLast: boolean;
}) {
  const theme = useTheme();
  const updateExercise = useWorkoutsStore((state) => state.updateExercise);
  const removeExercise = useWorkoutsStore((state) => state.removeExercise);
  const moveExercise = useWorkoutsStore((state) => state.moveExercise);
  const exercise = findExercise(workoutExercise.exerciseId);

  const patch = (changes: Partial<Omit<WorkoutExercise, 'id' | 'exerciseId'>>) =>
    updateExercise(workoutId, workoutExercise.id, changes);

  const iconButton = (
    icon: keyof typeof Ionicons.glyphMap,
    onPress: () => void,
    accessibilityLabel: string,
    disabled = false,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: pressed ? theme.colors.surfaceSelected : 'transparent',
          opacity: disabled ? 0.3 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
    </Pressable>
  );

  return (
    <View style={[styles.editor, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.editorHeader}>
        <ThemedText variant="bodyBold" style={styles.editorTitle}>
          {exercise?.name ?? 'Unknown exercise'}
        </ThemedText>
        {iconButton(
          'chevron-up',
          () => moveExercise(workoutId, workoutExercise.id, -1),
          'Move up',
          isFirst,
        )}
        {iconButton(
          'chevron-down',
          () => moveExercise(workoutId, workoutExercise.id, 1),
          'Move down',
          isLast,
        )}
        {iconButton(
          'trash-outline',
          () => removeExercise(workoutId, workoutExercise.id),
          'Remove exercise',
        )}
      </View>

      <View style={styles.steppers}>
        <Stepper
          label="Sets"
          value={`${workoutExercise.targetSets}`}
          onDecrement={() => patch({ targetSets: workoutExercise.targetSets - 1 })}
          onIncrement={() =>
            patch({ targetSets: Math.min(MAX_SETS, workoutExercise.targetSets + 1) })
          }
          decrementDisabled={workoutExercise.targetSets <= 1}
        />
        <Stepper
          label="Reps min"
          value={`${workoutExercise.targetRepsMin}`}
          onDecrement={() => patch({ targetRepsMin: workoutExercise.targetRepsMin - 1 })}
          onIncrement={() => {
            const targetRepsMin = Math.min(MAX_REPS, workoutExercise.targetRepsMin + 1);
            patch({
              targetRepsMin,
              targetRepsMax: Math.max(targetRepsMin, workoutExercise.targetRepsMax),
            });
          }}
          decrementDisabled={workoutExercise.targetRepsMin <= 1}
        />
        <Stepper
          label="Reps max"
          value={`${workoutExercise.targetRepsMax}`}
          onDecrement={() =>
            patch({
              targetRepsMax: Math.max(
                workoutExercise.targetRepsMin,
                workoutExercise.targetRepsMax - 1,
              ),
            })
          }
          onIncrement={() =>
            patch({ targetRepsMax: Math.min(MAX_REPS, workoutExercise.targetRepsMax + 1) })
          }
          decrementDisabled={workoutExercise.targetRepsMax <= workoutExercise.targetRepsMin}
        />
        <Stepper
          label="Rest"
          value={formatRest(workoutExercise.restSeconds)}
          onDecrement={() =>
            patch({
              restSeconds: Math.max(
                REST_STEP_SECONDS,
                workoutExercise.restSeconds - REST_STEP_SECONDS,
              ),
            })
          }
          onIncrement={() =>
            patch({
              restSeconds: Math.min(
                MAX_REST_SECONDS,
                workoutExercise.restSeconds + REST_STEP_SECONDS,
              ),
            })
          }
          decrementDisabled={workoutExercise.restSeconds <= REST_STEP_SECONDS}
        />
      </View>

      <TextInput
        value={workoutExercise.note ?? ''}
        onChangeText={(note) => patch({ note: note || undefined })}
        placeholder="Note (optional)"
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={`Note for ${exercise?.name ?? 'exercise'}`}
        style={[styles.noteInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
      />
    </View>
  );
}

export default function WorkoutEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const workout = useWorkoutsStore((state) => state.workouts.find((w) => w.id === id));
  const renameWorkout = useWorkoutsStore((state) => state.renameWorkout);

  if (!workout) {
    return (
      <ThemedView style={[styles.container, styles.missing]}>
        <Stack.Screen options={{ headerShown: true, title: 'Edit workout' }} />
        <ThemedText variant="subtitle">Workout not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Edit workout' }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <ThemedText variant="caption" color="textSecondary">
            Name
          </ThemedText>
          <TextInput
            value={workout.name}
            onChangeText={(name) => renameWorkout(workout.id, name)}
            placeholder="Workout name"
            placeholderTextColor={theme.colors.textSecondary}
            accessibilityLabel="Workout name"
            style={[
              styles.nameInput,
              { color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
          />
        </View>

        {workout.exercises.map((workoutExercise, index) => (
          <ExerciseEditor
            key={workoutExercise.id}
            workoutId={workout.id}
            workoutExercise={workoutExercise}
            isFirst={index === 0}
            isLast={index === workout.exercises.length - 1}
          />
        ))}

        <Button
          label="Add exercise"
          variant="secondary"
          onPress={() => router.push(`/workout/${workout.id}/add-exercise`)}
        />
        <Button label="Done" onPress={() => router.back()} />
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
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  field: {
    gap: spacing.xs,
  },
  nameInput: {
    fontSize: textVariants.body.fontSize,
    minHeight: minTouchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  editor: {
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  editorTitle: {
    flex: 1,
  },
  iconButton: {
    width: minTouchTarget - 4,
    height: minTouchTarget - 4,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steppers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  noteInput: {
    fontSize: textVariants.small.fontSize,
    minHeight: minTouchTarget - 4,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
});
