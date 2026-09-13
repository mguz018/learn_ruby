import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { spacing } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';

export default function NameStep() {
  const { draft, update } = useOnboarding();

  return (
    <Screen
      footer={
        <Button
          label="Next"
          onPress={() => router.push('/sore-spots')}
          disabled={draft.name.trim().length === 0}
        />
      }
    >
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text variant="display">What should we call you?</Text>
        <Text variant="body" tone="muted">
          Four short questions, then you can start.
        </Text>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <TextField
          label="Name"
          value={draft.name}
          onChangeText={(name) => update({ name })}
          autoFocus
          maxLength={60}
          placeholder="Your name"
        />
      </View>
    </Screen>
  );
}
