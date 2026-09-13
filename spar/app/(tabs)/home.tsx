import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { fetchRepStats, type RepStatRow } from '@/api/reps';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { computeStreak, formatSeconds, median } from '@/lib/stats';
import { colors, radius, spacing } from '@/lib/theme';
import { useSession } from '@/state/session';

export default function Home() {
  const { userId, profile } = useSession();
  const [rows, setRows] = useState<RepStatRow[] | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setRows(await fetchRepStats(userId));
    } catch {
      // Home is not worth an error screen. No numbers is the honest fallback.
      setRows([]);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Numbers should be right the moment a session ends, not on next launch.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const times = (rows ?? [])
    .map((r) => r.response_ms)
    .filter((ms): ms is number => ms !== null);
  const streak = computeStreak((rows ?? []).map((r) => r.created_at));
  const medianMs = median(times);

  const mode = profile?.mode ?? 'pause_only';

  return (
    <Screen
      footer={
        <Button label="Start" onPress={() => router.push('/session')} />
      }
    >
      <View style={{ gap: spacing.xs, marginTop: spacing.lg }}>
        <Text variant="body" tone="muted">
          {profile?.name ? `Hi ${profile.name}` : 'Hi'}
        </Text>
      </View>

      <View style={styles.headline}>
        <Text variant="caption" tone="faint">
          Median pause, last 14 days
        </Text>
        <Text variant="display">{formatSeconds(medianMs)}</Text>
        {medianMs === null ? (
          <Text variant="caption" tone="muted">
            Do a session and this fills in.
          </Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <Stat label="Streak" value={streak === 0 ? '—' : `${streak}d`} />
        <Stat label="Reps, 14d" value={`${times.length}`} />
        <Stat label="Level" value={`${profile?.difficulty ?? 1}`} />
      </View>

      <Text variant="caption" tone="faint" style={{ marginTop: spacing.lg }}>
        {mode === 'pause_only'
          ? 'Pause only. The jab plays, you breathe out, you name it.'
          : 'Full mode. You answer out loud.'}
      </Text>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="title">{value}</Text>
      <Text variant="caption" tone="faint">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headline: { gap: spacing.xs, marginTop: spacing.xl },
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  stat: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});
