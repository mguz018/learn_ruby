import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

import { updateProfile } from '@/api/profile';
import { replacePhrases } from '@/api/phrases';
import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/lib/theme';
import { useOnboarding } from '@/state/onboarding';
import { useSession } from '@/state/session';

export default function ModeStep() {
  const { draft, update } = useOnboarding();
  const { userId, refreshProfile } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    if (!userId) return;
    setBusy(true);
    setError(null);
    try {
      // Lists first, profile last: onboarded_at is the flag the index route
      // gates on, so it should not flip until everything else has landed.
      await replacePhrases('sore_spots', userId, draft.soreSpots);
      await replacePhrases('off_limits', userId, draft.offLimits);
      await updateProfile(userId, {
        name: draft.name.trim(),
        mode: draft.mode,
        onboarded_at: new Date().toISOString(),
      });
      await refreshProfile();
      router.replace('/home');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button label="Start" onPress={finish} busy={busy} />}>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text variant="title">How do you want to start?</Text>
        <Text variant="body" tone="muted">
          You can change this any time in Settings.
        </Text>
      </View>

      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        <OptionCard
          title="Pause only"
          description="The jab plays, you breathe out, you tap “That's a jab.” No comeback needed. This is where almost everyone should start — the pause is the skill."
          selected={draft.mode === 'pause_only'}
          onPress={() => update({ mode: 'pause_only' })}
        />
        <OptionCard
          title="Full"
          description="You answer out loud and get graded on how calm the answer was, never on how funny it was."
          selected={draft.mode === 'full'}
          onPress={() => update({ mode: 'full' })}
        />
      </View>

      {error ? (
        <Text variant="caption" tone="muted">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
