import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { colors, radius, spacing, tapTarget } from '@/lib/theme';

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  max: number;
  placeholder: string;
  addLabel: string;
};

/** A fixed set of free-text rows. Used for sore spots, off-limits, and Settings. */
export function PhraseListEditor({ values, onChange, max, placeholder, addLabel }: Props) {
  const setAt = (index: number, text: string) =>
    onChange(values.map((value, i) => (i === index ? text : value)));

  const removeAt = (index: number) => onChange(values.filter((_, i) => i !== index));

  return (
    <View style={styles.wrap}>
      {values.map((value, index) => (
        // Rows have no stable id until they are saved, and reordering is not
        // possible here, so the index is a safe key.
        <View key={index} style={styles.row}>
          <TextField
            value={value}
            onChangeText={(text) => setAt(index, text)}
            placeholder={placeholder}
            maxLength={120}
            style={styles.field}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove item ${index + 1}`}
            onPress={() => removeAt(index)}
            style={styles.remove}
          >
            <Text variant="label" tone="muted">
              ×
            </Text>
          </Pressable>
        </View>
      ))}

      {values.length < max ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange([...values, ''])}
          style={styles.add}
        >
          <Text variant="label" tone="muted">
            {addLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  field: { flex: 1 },
  remove: {
    width: tapTarget,
    height: tapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  add: {
    minHeight: tapTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
});
