import { Ionicons } from '@expo/vector-icons';
import type { MeasurementType, SetLog } from '@fitness-app/types';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { RestTimerBar } from '@/components/rest-timer-bar';
import { Stepper } from '@/components/stepper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findExercise } from '@/data/exercises';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { formatSetLine, formatTargets } from '@/lib/format';
import { completedSetCount, previousPerformance } from '@/lib/session';
import { useSessionHydrated, useSessionStore } from '@/stores/session';

const WEIGHT_STEP = 2.5;

type InputMode = 'weight_reps' | 'reps_only' | 'duration';

function inputMode(measurementType: MeasurementType | undefined): InputMode {
  if (measurementType === 'weight_reps') return 'weight_reps';
  if (measurementType === 'duration') return 'duration';
  return 'reps_only';
}

function SetRow({
  sessionExerciseId,
  set,
  index,
  mode,
}: {
  sessionExerciseId: string;
  set: SetLog;
  index: number;
  mode: InputMode;
}) {
  const theme = useTheme();
  const updateSet = useSessionStore((state) => state.updateSet);
  const completeSet = useSessionStore((state) => state.completeSet);
  const uncompleteSet = useSessionStore((state) => state.uncompleteSet);
  const removeSet = useSessionStore((state) => state.removeSet);

  const weight = set.weight ?? 0;
  const reps = set.reps ?? 0;
  const repsStep = mode === 'duration' ? 5 : 1;

  return (
    <View
      style={[
        styles.setRow,
        {
          backgroundColor: set.completed ? theme.colors.surfaceSelected : theme.colors.surface,
          borderColor: set.completed ? theme.colors.success : 'transparent',
        },
      ]}
    >
      <View style={styles.setHeader}>
        <ThemedText variant="bodyBold">Set {index + 1}</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove set ${index + 1}`}
          onPress={() => removeSet(sessionExerciseId, set.id)}
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.steppers}>
        {mode === 'weight_reps' && (
          <View style={styles.stepperSlot}>
            <Stepper
              label="Weight"
              value={`${weight}`}
              onDecrement={() =>
                updateSet(sessionExerciseId, set.id, { weight: Math.max(0, weight - WEIGHT_STEP) })
              }
              onIncrement={() =>
                updateSet(sessionExerciseId, set.id, { weight: weight + WEIGHT_STEP })
              }
              decrementDisabled={weight <= 0}
            />
          </View>
        )}
        <View style={styles.stepperSlot}>
          <Stepper
            label={mode === 'duration' ? 'Seconds' : 'Reps'}
            value={`${reps}`}
            onDecrement={() =>
              updateSet(sessionExerciseId, set.id, { reps: Math.max(0, reps - repsStep) })
            }
            onIncrement={() => updateSet(sessionExerciseId, set.id, { reps: reps + repsStep })}
            decrementDisabled={reps <= 0}
          />
        </View>
      </View>

      {/* Full-width so the primary action stays an easy one-handed tap. */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ checked: set.completed }}
        accessibilityLabel={
          set.completed ? `Set ${index + 1} done, tap to undo` : `Complete set ${index + 1}`
        }
        onPress={() =>
          set.completed
            ? uncompleteSet(sessionExerciseId, set.id)
            : completeSet(sessionExerciseId, set.id)
        }
        style={({ pressed }) => [
          styles.check,
          {
            backgroundColor: set.completed
              ? theme.colors.success
              : pressed
                ? theme.colors.surfaceSelected
                : theme.colors.background,
            borderColor: set.completed ? theme.colors.success : theme.colors.border,
          },
        ]}
      >
        <Ionicons
          name={set.completed ? 'checkmark-circle' : 'checkmark'}
          size={22}
          color={set.completed ? theme.colors.onPrimary : theme.colors.textSecondary}
        />
        <ThemedText variant="bodyBold" color={set.completed ? 'onPrimary' : 'textSecondary'}>
          {set.completed ? 'Done' : 'Complete set'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function FocusModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  const session = useSessionStore((state) => state.activeSession);
  const completedSessions = useSessionStore((state) => state.completedSessions);
  const hasHydrated = useSessionHydrated();
  const addSet = useSessionStore((state) => state.addSet);
  const setCurrentExerciseIndex = useSessionStore((state) => state.setCurrentExerciseIndex);
  const finishSession = useSessionStore((state) => state.finishSession);
  const cancelSession = useSessionStore((state) => state.cancelSession);

  if (!hasHydrated) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!session || session.id !== id) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: true, title: 'Workout' }} />
        <ThemedText variant="subtitle">This workout isn't active</ThemedText>
        <ThemedText color="textSecondary" style={styles.centeredText}>
          It may have been finished or cancelled.
        </ThemedText>
        <Button label="Back to workouts" onPress={() => router.replace('/workouts')} />
      </ThemedView>
    );
  }

  const index = session.currentExerciseIndex;
  const current = session.exercises[index];
  if (!current) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedText variant="subtitle">This workout has no exercises</ThemedText>
        <Button label="Back to workouts" onPress={() => router.replace('/workouts')} />
      </ThemedView>
    );
  }

  const exercise = findExercise(current.exerciseId);
  const mode = inputMode(exercise?.measurementType);
  const previous = previousPerformance(completedSessions, current.exerciseId);
  const totalSets = session.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const doneSets = completedSetCount(session);
  const isLast = index === session.exercises.length - 1;

  const handleFinish = () => {
    confirmAction(
      {
        title: 'Finish workout?',
        message: `${doneSets} of ${totalSets} sets completed.`,
        confirmLabel: 'Finish',
      },
      () => {
        const finished = finishSession();
        if (finished) router.replace(`/session/${finished.id}/summary`);
      },
    );
  };

  const handleCancel = () => {
    confirmAction(
      {
        title: 'Cancel workout?',
        message: 'Your logged sets for this session will be discarded.',
        confirmLabel: 'Discard',
        destructive: true,
      },
      () => {
        cancelSession();
        router.replace('/workouts');
      },
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel workout"
            onPress={handleCancel}
            hitSlop={8}
            style={styles.topButton}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </Pressable>
          <View style={styles.topTitle}>
            <ThemedText variant="small" color="textSecondary">
              {session.name}
            </ThemedText>
            <ThemedText variant="bodyBold">
              Exercise {index + 1} of {session.exercises.length}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Finish workout"
            onPress={handleFinish}
            hitSlop={8}
            style={styles.topButton}
          >
            <ThemedText variant="bodyBold" color="primary">
              Finish
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary,
                width: `${totalSets === 0 ? 0 : (doneSets / totalSets) * 100}%`,
              },
            ]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.media, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="barbell-outline" size={40} color={theme.colors.textSecondary} />
          </View>

          <ThemedText variant="title">{exercise?.name ?? 'Unknown exercise'}</ThemedText>
          <ThemedText color="textSecondary">
            Target {formatTargets(current)} · rest {current.restSeconds}s
          </ThemedText>
          {current.note && (
            <ThemedText variant="small" color="textSecondary">
              Note: {current.note}
            </ThemedText>
          )}

          <View style={[styles.previous, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="time-outline" size={18} color={theme.colors.textSecondary} />
            <ThemedText variant="small" color="textSecondary" style={styles.previousText}>
              {previous
                ? `Last time: ${formatSetLine(previous.sets)}`
                : 'First time doing this exercise'}
            </ThemedText>
          </View>

          {current.sets.map((set, setIndex) => (
            <SetRow
              key={set.id}
              sessionExerciseId={current.id}
              set={set}
              index={setIndex}
              mode={mode}
            />
          ))}

          <Button label="Add set" variant="secondary" onPress={() => addSet(current.id)} />
          <Button
            label="Substitute exercise"
            variant="secondary"
            onPress={() => router.push(`/session/${session.id}/substitute`)}
          />
        </ScrollView>

        <RestTimerBar />

        <View style={styles.bottomBar}>
          <View style={styles.navButton}>
            <Button
              label="Previous"
              variant="secondary"
              disabled={index === 0}
              onPress={() => setCurrentExerciseIndex(index - 1)}
            />
          </View>
          <View style={styles.navButton}>
            <Button
              label={isLast ? 'Finish' : 'Next'}
              onPress={() => (isLast ? handleFinish() : setCurrentExerciseIndex(index + 1))}
            />
          </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  topButton: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    marginHorizontal: spacing.md,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  media: {
    height: 140,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  previous: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    marginVertical: spacing.xs,
  },
  previousText: {
    flex: 1,
  },
  setRow: {
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  steppers: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  stepperSlot: {
    flex: 1,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: minTouchTarget,
    borderRadius: radii.md,
    borderWidth: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  navButton: {
    flex: 1,
  },
});
