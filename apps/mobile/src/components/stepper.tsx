import { Ionicons } from '@expo/vector-icons';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export type StepperProps = {
  label: string;
  /** Already-formatted value, e.g. "3", "8", "1m 30s". */
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
  decrementDisabled?: boolean;
};

/**
 * Large-touch-target increment/decrement control — the standard way to
 * adjust numbers in this app; typing is a last resort (handoff §18.3).
 */
export function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
  decrementDisabled = false,
}: StepperProps) {
  const theme = useTheme();

  const stepButton = (
    icon: 'remove' | 'add',
    onPress: () => void,
    disabled: boolean,
    accessibilityLabel: string,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepButton,
        {
          backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.text} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ThemedText variant="caption" color="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.controls}>
        {stepButton('remove', onDecrement, decrementDisabled, `Decrease ${label}`)}
        <ThemedText variant="bodyBold" style={styles.value}>
          {value}
        </ThemedText>
        {stepButton('add', onIncrement, false, `Increase ${label}`)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepButton: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 52,
    textAlign: 'center',
  },
});
