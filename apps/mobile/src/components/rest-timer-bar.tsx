import { Ionicons } from '@expo/vector-icons';
import { minTouchTarget, radii, spacing } from '@fitness-app/ui';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useCountdown } from '@/hooks/use-countdown';
import { useTheme } from '@/hooks/use-theme';
import { formatClock } from '@/lib/format';
import { useSessionStore } from '@/stores/session';

/**
 * Rest countdown, shown only while resting. Derives its remaining time
 * from the stored end-timestamp, so it stays accurate across
 * backgrounding, and dismisses itself when it reaches zero.
 */
export function RestTimerBar() {
  const theme = useTheme();
  const restEndsAt = useSessionStore((state) => state.restEndsAt);
  const addRestTime = useSessionStore((state) => state.addRestTime);
  const skipRest = useSessionStore((state) => state.skipRest);
  const remaining = useCountdown(restEndsAt);

  // Auto-dismiss when rest actually ends, scheduled from the timestamp
  // itself — never from the ticking display value, which lags a render
  // behind restEndsAt and would otherwise fire an immediate false skip.
  useEffect(() => {
    if (!restEndsAt) return;
    const msLeft = Date.parse(restEndsAt) - Date.now();
    if (msLeft <= 0) {
      skipRest();
      return;
    }
    const timeout = setTimeout(skipRest, msLeft);
    return () => clearTimeout(timeout);
  }, [restEndsAt, skipRest]);

  if (!restEndsAt) return null;

  const control = (label: string, icon: keyof typeof Ionicons.glyphMap, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        { backgroundColor: pressed ? theme.colors.surfaceSelected : theme.colors.surface },
      ]}
    >
      <Ionicons name={icon} size={18} color={theme.colors.text} />
      <ThemedText variant="small">{label}</ThemedText>
    </Pressable>
  );

  return (
    <View style={[styles.bar, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.label}>
        <Ionicons name="timer-outline" size={20} color={theme.colors.onPrimary} />
        <ThemedText variant="heading" color="onPrimary">
          {formatClock(remaining)}
        </ThemedText>
        <ThemedText variant="small" color="onPrimary">
          rest
        </ThemedText>
      </View>
      <View style={styles.controls}>
        {control('+15s', 'add', () => addRestTime(15))}
        {control('Skip', 'play-skip-forward', skipRest)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    gap: spacing.md,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: minTouchTarget - 8,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
  },
});
