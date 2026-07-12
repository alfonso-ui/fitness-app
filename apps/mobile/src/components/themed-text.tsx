import type { ColorName, TextVariant } from '@fitness-app/ui';
import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  variant?: TextVariant;
  color?: ColorName;
};

export function ThemedText({ style, variant = 'body', color = 'text', ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text style={[theme.textVariants[variant], { color: theme.colors[color] }, style]} {...rest} />
  );
}
