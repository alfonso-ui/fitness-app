import { Ionicons } from '@expo/vector-icons';
import { radii, spacing } from '@fitness-app/ui';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { completedSetCount } from '@/lib/session';
import { useSessionStore } from '@/stores/session';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const activeSession = useSessionStore((state) => state.activeSession);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <ThemedText variant="title">LiftFlow</ThemedText>

          {activeSession ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Resume workout ${activeSession.name}`}
              onPress={() => router.push(`/session/${activeSession.id}`)}
              style={({ pressed }) => [
                styles.resumeCard,
                { backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.primary },
              ]}
            >
              <View style={styles.resumeInfo}>
                <ThemedText variant="small" color="onPrimary">
                  Workout in progress
                </ThemedText>
                <ThemedText variant="heading" color="onPrimary">
                  {activeSession.name}
                </ThemedText>
                <ThemedText variant="small" color="onPrimary">
                  {completedSetCount(activeSession)} sets logged · tap to resume
                </ThemedText>
              </View>
              <Ionicons name="play-circle" size={40} color={theme.colors.onPrimary} />
            </Pressable>
          ) : (
            <ThemedText color="textSecondary">
              Pick a workout to get started. Your next recommended workout and recent activity will
              appear here as the app grows.
            </ThemedText>
          )}
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
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: radii.lg,
    gap: spacing.md,
  },
  resumeInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
});
