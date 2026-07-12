import { Ionicons } from '@expo/vector-icons';
import type { Exercise } from '@fitness-app/types';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { difficultyLabels, equipmentLabels, muscleGroupLabels } from '@/lib/labels';

export type ExerciseCardProps = {
  exercise: Exercise;
  onPress: () => void;
};

export function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${exercise.name}, ${muscleGroupLabels[exercise.primaryMuscle]}, ${equipmentLabels[exercise.equipment]}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface,
        },
      ]}
    >
      <View style={styles.info}>
        <ThemedText variant="bodyBold">{exercise.name}</ThemedText>
        <ThemedText variant="small" color="textSecondary">
          {muscleGroupLabels[exercise.primaryMuscle]} · {equipmentLabels[exercise.equipment]} ·{' '}
          {difficultyLabels[exercise.difficulty]}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minTouchTarget + spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xxs,
  },
});
