import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { PhraseListEditor } from '@/components/PhraseListEditor';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';

const MAX_OFF_LIMITS = 10;

export default function OffLimitsStep() {
  const { draft, update } = useOnboarding();

  return (
    <Screen footer={<Button label="Next" onPress={() => router.push('/mode')} />}>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text variant="title">What is off limits?</Text>
        <Text variant="body" tone="muted">
          Anything here will never be touched. You can add to this list any time,
          and there is a "Too much" button in every session.
        </Text>
        <Text variant="caption" tone="faint">
          Race, religion, sexual orientation, gender identity, disability, illness,
          and anything to do with trauma or self-harm are already excluded — you
          do not need to list them.
        </Text>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <PhraseListEditor
          values={draft.offLimits}
          onChange={(offLimits) => update({ offLimits })}
          max={MAX_OFF_LIMITS}
          placeholder="A topic to avoid"
          addLabel="Add another"
        />
      </View>
    </Screen>
  );
}
