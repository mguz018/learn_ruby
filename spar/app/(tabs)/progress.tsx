import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { spacing } from '@/lib/theme';

export default function Progress() {
  return (
    <Screen>
      <Text variant="title" style={{ marginTop: spacing.xl }}>
        Progress
      </Text>
      <Text variant="body" tone="muted">
        Median pause over time, short-answer rate, and before/after playback arrive
        in session 5.
      </Text>
    </Screen>
  );
}
