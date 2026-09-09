import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/Text';
import { colors, radius, spacing } from '@/lib/theme';

type Props = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionCard({ title, description, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.card, selected ? styles.selected : null]}
    >
      <Text variant="label">{title}</Text>
      <Text variant="caption" tone="muted">
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  selected: { borderColor: colors.accent, backgroundColor: colors.surfaceRaised },
});
