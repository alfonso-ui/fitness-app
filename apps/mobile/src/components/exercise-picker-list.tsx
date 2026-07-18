import type { Equipment, Exercise, MuscleGroup } from '@fitness-app/types';
import { spacing } from '@fitness-app/ui';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { ExerciseCard } from '@/components/exercise-card';
import { FilterChip } from '@/components/filter-chip';
import { SearchInput } from '@/components/search-input';
import { ThemedText } from '@/components/themed-text';
import { exercises } from '@/data/exercises';
import { equipmentLabels, muscleGroupLabels } from '@/lib/labels';

// Only offer filter values that actually match at least one exercise.
const muscleOptions = [...new Set(exercises.map((e) => e.primaryMuscle))];
const equipmentOptions = [...new Set(exercises.map((e) => e.equipment))];

export type ExercisePickerListProps = {
  onSelectExercise: (exercise: Exercise) => void;
};

/**
 * Searchable, filterable exercise list. Used by the Exercises tab
 * (navigate to detail) and the workout builder (pick to add).
 */
export function ExercisePickerList({ onSelectExercise }: ExercisePickerListProps) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      if (muscle && exercise.primaryMuscle !== muscle) return false;
      if (equipment && exercise.equipment !== equipment) return false;
      if (search && !exercise.name.toLowerCase().includes(search)) return false;
      return exercise.isActive;
    });
  }, [query, muscle, equipment]);

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search exercises" />
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {muscleOptions.map((option) => (
              <FilterChip
                key={option}
                label={muscleGroupLabels[option]}
                selected={muscle === option}
                onPress={() => setMuscle(muscle === option ? null : option)}
              />
            ))}
          </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {equipmentOptions.map((option) => (
              <FilterChip
                key={option}
                label={equipmentLabels[option]}
                selected={equipment === option}
                onPress={() => setEquipment(equipment === option ? null : option)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(exercise) => exercise.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={() => onSelectExercise(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText variant="subtitle">No exercises found</ThemedText>
            <ThemedText color="textSecondary" style={styles.emptyText}>
              Try a different search, or clear the filters above.
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    paddingHorizontal: spacing.md,
  },
  filters: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
  },
});
