import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { PhraseListEditor } from '@/components/PhraseListEditor';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';

const MIN_SORE_SPOTS = 3;
const MAX_SORE_SPOTS = 5;

export default function SoreSpotsStep() {
  const { draft, update } = useOnboarding();
  const filled = draft.soreSpots.filter((spot) => spot.trim().length > 0).length;

  return (
    <Screen
      footer={
        <Button
          label="Next"
          onPress={() => router.push('/off-limits')}
          disabled={filled < MIN_SORE_SPOTS}
        />
      }
    >
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text variant="title">What are you sensitive about?</Text>
        <Text variant="body" tone="muted">
          Three to five things that get under your skin. These are what the jabs
          will aim at, so be honest — vague answers make for weak practice.
        </Text>
        <Text variant="caption" tone="faint">
          For example: my age, my job, my kids, my body, my side projects
        </Text>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <PhraseListEditor
          values={draft.soreSpots}
          onChange={(soreSpots) => update({ soreSpots })}
          max={MAX_SORE_SPOTS}
          placeholder="A sore spot"
          addLabel="Add another"
        />
      </View>

      <Text variant="caption" tone="faint">
        {filled} of {MIN_SORE_SPOTS} minimum
      </Text>
    </Screen>
  );
}
