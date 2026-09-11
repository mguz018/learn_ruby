import { View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/lib/theme';
import { useSession } from '@/state/session';

export default function Home() {
  const { profile } = useSession();

  return (
    <Screen>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Text variant="display">Hi {profile?.name || 'there'}</Text>
        <Text variant="body" tone="muted">
          Streak, median pause, and the Start button land here in session 2.
        </Text>
      </View>
    </Screen>
  );
}
