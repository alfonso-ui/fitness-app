import { spacing } from '@fitness-app/ui';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type ScreenPlaceholderProps = {
  title: string;
  description: string;
};

/**
 * Temporary screen body used while the real feature is not built yet.
 * Every placeholder states what the screen will become, so the shell
 * is honest about its current state.
 */
export function ScreenPlaceholder({ title, description }: ScreenPlaceholderProps) {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText variant="title">{title}</ThemedText>
        <ThemedText color="textSecondary" style={styles.description}>
          {description}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
