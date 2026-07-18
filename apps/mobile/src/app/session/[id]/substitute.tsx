import { spacing } from '@fitness-app/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ExercisePickerList } from '@/components/exercise-picker-list';
import { ThemedView } from '@/components/themed-view';
import { useSessionStore } from '@/stores/session';

export default function SubstituteExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const session = useSessionStore((state) => state.activeSession);
  const substituteExercise = useSessionStore((state) => state.substituteExercise);
  const current = session?.exercises[session.currentExerciseIndex];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Substitute exercise' }} />
      <ExercisePickerList
        onSelectExercise={(exercise) => {
          if (session && session.id === id && current) {
            substituteExercise(current.id, exercise.id);
          }
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
