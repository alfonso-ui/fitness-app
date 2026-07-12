import { Ionicons } from '@expo/vector-icons';
import { radii, spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ExerciseCard } from '@/components/exercise-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findExercise } from '@/data/exercises';
import { useTheme } from '@/hooks/use-theme';
import {
  difficultyLabels,
  equipmentLabels,
  movementPatternLabels,
  muscleGroupLabels,
} from '@/lib/labels';

export default function ExerciseDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const theme = useTheme();
  const exercise = slug ? findExercise(slug) : undefined;

  if (!exercise) {
    return (
      <ThemedView style={[styles.container, styles.missing]}>
        <Stack.Screen options={{ headerShown: true, title: 'Exercise' }} />
        <ThemedText variant="subtitle">Exercise not found</ThemedText>
        <ThemedText color="textSecondary">
          This exercise doesn't exist or is no longer available.
        </ThemedText>
      </ThemedView>
    );
  }

  const alternatives = exercise.alternatives
    .map((alternativeSlug) => findExercise(alternativeSlug))
    .filter((alternative) => alternative !== undefined);

  const facts = [
    { label: 'Muscle', value: muscleGroupLabels[exercise.primaryMuscle] },
    { label: 'Equipment', value: equipmentLabels[exercise.equipment] },
    { label: 'Level', value: difficultyLabels[exercise.difficulty] },
    { label: 'Pattern', value: movementPatternLabels[exercise.movementPattern] },
  ];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: exercise.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Demonstration media placeholder — real licensed assets arrive in the media milestone. */}
        <View style={[styles.media, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="barbell-outline" size={48} color={theme.colors.textSecondary} />
          <ThemedText variant="small" color="textSecondary">
            Demonstration coming soon
          </ThemedText>
        </View>

        <ThemedText color="textSecondary">{exercise.description}</ThemedText>

        <View style={styles.facts}>
          {facts.map((fact) => (
            <View key={fact.label} style={[styles.fact, { backgroundColor: theme.colors.surface }]}>
              <ThemedText variant="caption" color="textSecondary">
                {fact.label}
              </ThemedText>
              <ThemedText variant="small">{fact.value}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText variant="subtitle">How to do it</ThemedText>
          {exercise.instructions.map((step, index) => (
            <View key={step} style={styles.step}>
              <ThemedText variant="bodyBold" color="primary" style={styles.stepNumber}>
                {index + 1}
              </ThemedText>
              <ThemedText style={styles.stepText}>{step}</ThemedText>
            </View>
          ))}
        </View>

        {exercise.tips.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="subtitle">Coaching tips</ThemedText>
            {exercise.tips.map((tip) => (
              <View key={tip} style={styles.step}>
                <Ionicons name="bulb-outline" size={18} color={theme.colors.primary} />
                <ThemedText style={styles.stepText}>{tip}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {exercise.safetyNotes && (
          <View style={[styles.safety, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.danger} />
            <ThemedText variant="small" style={styles.stepText}>
              {exercise.safetyNotes}
            </ThemedText>
          </View>
        )}

        {alternatives.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="subtitle">Alternatives</ThemedText>
            {alternatives.map((alternative) => (
              <ExerciseCard
                key={alternative.id}
                exercise={alternative}
                onPress={() => router.push(`/exercise/${alternative.slug}`)}
              />
            ))}
          </View>
        )}
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
  },
  media: {
    height: 200,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.xxs,
  },
  section: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepNumber: {
    minWidth: 22,
  },
  stepText: {
    flex: 1,
  },
  safety: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
  },
});
