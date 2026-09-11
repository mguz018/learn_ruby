import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { colors, type as typeScale } from '@/lib/theme';

type Variant = keyof typeof typeScale;
type Tone = 'default' | 'muted' | 'faint';

type Props = TextProps & { variant?: Variant; tone?: Tone };

export function Text({ variant = 'body', tone = 'default', style, ...rest }: Props) {
  return <RNText {...rest} style={[typeScale[variant], tones[tone], style]} />;
}

const tones = StyleSheet.create({
  default: { color: colors.text },
  muted: { color: colors.textMuted },
  faint: { color: colors.textFaint },
});
