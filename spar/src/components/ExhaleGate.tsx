import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { colors, spacing } from '@/lib/theme';

const HOLD_MS = 2000;
const CIRCLE = 220;

type Props = { onComplete: () => void };

/**
 * The exhale gate. Nothing opens until the user has held the button for two full
 * seconds, and the circle expands for the first second and contracts for the
 * second so the hold has a shape to follow rather than being a progress bar.
 *
 * This is the whole mechanism of the app — it is what puts a beat between the
 * spike and the response — so releasing early resets it completely rather than
 * banking partial credit.
 */
export function ExhaleGate({ onComplete }: Props) {
  const scale = useRef(new Animated.Value(0.55)).current;
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useRef(false);

  const clearTimer = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const reset = () => {
    setHolding(false);
    clearTimer();
    scale.stopAnimation();
    Animated.timing(scale, {
      toValue: 0.55,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const start = () => {
    if (done.current) return;
    setHolding(true);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1,
        duration: HOLD_MS / 2,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.55,
        duration: HOLD_MS / 2,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // The timer, not the animation callback, decides completion: an animation
    // interrupted by a release would otherwise still fire.
    timer.current = setTimeout(() => {
      done.current = true;
      setHolding(false);
      onComplete();
    }, HOLD_MS);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Breathe out. Press and hold for two seconds."
        onPressIn={start}
        onPressOut={reset}
        style={styles.target}
      >
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <Text variant="label" style={styles.label}>
          {holding ? 'Keep going' : 'Breathe out'}
        </Text>
      </Pressable>

      <Text variant="caption" tone="faint" style={styles.hint}>
        Press and hold
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md },
  target: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.accent,
    opacity: 0.22,
  },
  label: { color: colors.text },
  hint: { marginTop: spacing.xs },
});
