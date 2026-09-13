import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/lib/theme';
import { useSession } from '@/state/session';

export default function Settings() {
  const { profile, signOut } = useSession();
  const [busy, setBusy] = useState(false);

  const deleteEverything = () => {
    Alert.alert(
      'Delete all your data?',
      'Your profile, your lists, every rep and every recording. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            const { error } = await supabase.rpc('delete_all_my_data');
            setBusy(false);
            if (error) {
              Alert.alert('Could not delete', error.message);
              return;
            }
            await signOut();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Text variant="title" style={{ marginTop: spacing.xl }}>
        Settings
      </Text>

      <View style={{ gap: spacing.xs }}>
        <Text variant="body" tone="muted">
          Signed in as {profile?.name || 'you'}.
        </Text>
        <Text variant="caption" tone="faint">
          Sore spots, off-limits, countdown length, difficulty and mode become
          editable here in session 5.
        </Text>
      </View>

      <View style={{ gap: spacing.xs, marginTop: spacing.lg }}>
        <Text variant="label" tone="muted">
          This is skill practice, not therapy.
        </Text>
        <Text variant="caption" tone="faint">
          Spar trains a pause. It does not treat anxiety, trauma, or anything else.
          If you need support: [support resources link — TODO].
        </Text>
      </View>

      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Button label="Sign out" variant="secondary" onPress={() => void signOut()} />
        <Button label="Delete all my data" variant="ghost" onPress={deleteEverything} busy={busy} />
      </View>
    </Screen>
  );
}
