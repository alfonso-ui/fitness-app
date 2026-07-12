import type { ColorName } from '@fitness-app/ui';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  color?: ColorName;
};

export function ThemedView({ style, color = 'background', ...rest }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme.colors[color] }, style]} {...rest} />;
}
