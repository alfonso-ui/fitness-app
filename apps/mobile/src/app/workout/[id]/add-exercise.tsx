import { spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ExercisePickerList } from '@/components/exercise-picker-list';
import { ThemedView } from '@/components/themed-view';
import { useWorkoutsStore } from '@/stores/workouts';

export default function AddExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addExercise = useWorkoutsStore((state) => state.addExercise);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Add exercise' }} />
      <ExercisePickerList
        onSelectExercise={(exercise) => {
          if (id) addExercise(id, exercise.id);
          router.back();
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
  },
});
