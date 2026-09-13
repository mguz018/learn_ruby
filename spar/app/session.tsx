import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { fetchRecentJabTexts, savePauseRep, saveJab } from '@/api/reps';
import { endSession, startSession } from '@/api/sessions';
import { Button } from '@/components/Button';
import { ExhaleGate } from '@/components/ExhaleGate';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { pickFallbackJab } from '@/data/fallbackJabs';
import { say, stopSpeaking } from '@/lib/speech';
import { formatSeconds } from '@/lib/stats';
import { colors, radius, spacing, tapTarget } from '@/lib/theme';
import { useSession } from '@/state/session';

const REP_CAP = 10;

type Phase =
  | 'loading'
  | 'listen'   // the jab is playing; nothing on screen but the fact that it is
  | 'exhale'   // the gate
  | 'open'     // timing, waiting for the tap
  | 'result'
  | 'capped';

export default function SessionScreen() {
  const { userId, profile } = useSession();

  const [phase, setPhase] = useState<Phase>('loading');
  const [repNumber, setRepNumber] = useState(1);
  const [responseMs, setResponseMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useRef<string | null>(null);
  const jabId = useRef<string | null>(null);
  const jabText = useRef<string>('');
  const openedAt = useRef<number>(0);
  const recentTexts = useRef<string[]>([]);
  // Set when the screen unmounts so async work in flight stops touching state.
  const gone = useRef(false);

  const difficulty = profile?.difficulty ?? 1;
  const mode = profile?.mode ?? 'pause_only';

  // --- one rep ------------------------------------------------------------

  const beginRep = useCallback(async () => {
    if (!userId || gone.current) return;
    setResponseMs(null);
    setPhase('listen');

    try {
      const text = pickFallbackJab(difficulty, recentTexts.current);
      const jab = await saveJab(userId, text, difficulty);
      if (gone.current) return;

      jabId.current = jab.id;
      jabText.current = text;
      recentTexts.current = [text, ...recentTexts.current].slice(0, 20);

      // Heard, never read: the text is not on screen until the rep is graded.
      await say(text);
      if (gone.current) return;

      setPhase('exhale');
    } catch (caught) {
      if (gone.current) return;
      setError(caught instanceof Error ? caught.message : 'Something went wrong.');
    }
  }, [userId, difficulty]);

  // --- session lifecycle --------------------------------------------------

  useEffect(() => {
    gone.current = false;

    const begin = async () => {
      if (!userId) return;
      try {
        recentTexts.current = await fetchRecentJabTexts(userId);
        if (gone.current) return;

        const created = await startSession(userId, mode, difficulty);
        if (gone.current) return;

        sessionId.current = created.id;
        void beginRep();
      } catch (caught) {
        if (gone.current) return;
        setError(caught instanceof Error ? caught.message : 'Could not start.');
      }
    };

    void begin();

    return () => {
      gone.current = true;
      stopSpeaking();
      // Leaving mid-session still closes the row, so the ten-rep cap and the
      // session history do not inherit a row that never ends.
      const id = sessionId.current;
      if (id) void endSession(id, 'stopped');
    };
  }, [userId, mode, difficulty, beginRep]);

  // --- transitions --------------------------------------------------------

  const onExhaleComplete = useCallback(() => {
    openedAt.current = Date.now();
    setPhase('open');
  }, []);

  const onThatsAJab = useCallback(async () => {
    const ms = Date.now() - openedAt.current;
    setResponseMs(ms);
    setPhase('result');

    if (!userId || !sessionId.current || !jabId.current) return;
    try {
      await savePauseRep({
        userId,
        sessionId: sessionId.current,
        jabId: jabId.current,
        mode,
        responseMs: ms,
      });
    } catch (caught) {
      if (gone.current) return;
      setError(caught instanceof Error ? caught.message : 'Could not save that rep.');
    }
  }, [userId, mode]);

  const onNext = useCallback(() => {
    if (repNumber >= REP_CAP) {
      const id = sessionId.current;
      if (id) void endSession(id, 'completed');
      sessionId.current = null;
      setPhase('capped');
      return;
    }
    setRepNumber((n) => n + 1);
    void beginRep();
  }, [repNumber, beginRep]);

  // --- render -------------------------------------------------------------

  if (error) {
    return (
      <Screen footer={<Button label="Back" onPress={() => router.back()} />}>
        <Text variant="title" style={{ marginTop: spacing.xl }}>
          That did not work
        </Text>
        <Text variant="body" tone="muted">
          {error}
        </Text>
      </Screen>
    );
  }

  if (phase === 'capped') {
    return (
      <Screen footer={<Button label="Done" onPress={() => router.replace('/home')} />}>
        <View style={{ gap: spacing.md, marginTop: spacing.xxl }}>
          <Text variant="title">That is ten. Stop here.</Text>
          <Text variant="body" tone="muted">
            Practising while flooded reinforces the wrong thing. The pause is
            built by doing a few reps while you can still feel yourself think,
            not by pushing through until you are numb.
          </Text>
          <Text variant="body" tone="muted">
            Come back tomorrow.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} footer={<FooterNote />}>
      <View style={styles.body}>
        <Text variant="caption" tone="faint">
          Rep {repNumber} of {REP_CAP}
        </Text>

        <View style={styles.stage}>
          {phase === 'loading' ? <ActivityIndicator color={colors.accent} /> : null}

          {phase === 'listen' ? (
            <View style={styles.centered}>
              <Text variant="title">Listen</Text>
              <Text variant="body" tone="muted">
                Let it land.
              </Text>
            </View>
          ) : null}

          {phase === 'exhale' ? <ExhaleGate onComplete={onExhaleComplete} /> : null}

          {phase === 'open' ? (
            <View style={styles.centered}>
              <Text variant="body" tone="muted">
                Name it when you feel it.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void onThatsAJab()}
                style={styles.jabButton}
              >
                <Text variant="title">That&apos;s a jab.</Text>
              </Pressable>
            </View>
          ) : null}

          {phase === 'result' ? (
            <View style={styles.centered}>
              <Text variant="caption" tone="faint">
                You paused for
              </Text>
              <Text variant="display">{formatSeconds(responseMs)}</Text>
              <Text variant="caption" tone="muted" style={styles.jabEcho}>
                “{jabText.current}”
              </Text>
            </View>
          ) : null}
        </View>

        {phase === 'result' ? (
          <Button label={repNumber >= REP_CAP ? 'Finish' : 'Next'} onPress={onNext} />
        ) : null}
      </View>
    </Screen>
  );
}

function FooterNote() {
  return (
    <Text variant="caption" tone="faint" style={styles.footerNote}>
      This is play, not combat.
    </Text>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centered: { alignItems: 'center', gap: spacing.sm },
  jabButton: {
    minHeight: tapTarget + 20,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceRaised,
    marginTop: spacing.md,
  },
  jabEcho: { marginTop: spacing.lg, textAlign: 'center' },
  footerNote: { textAlign: 'center' },
});
