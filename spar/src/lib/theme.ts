// Calm, dark-first. Deliberately no red anywhere: a defended answer is
// information, not failure, so "defended" reads as a neutral slate.
export const colors = {
  bg: '#0E1113',
  surface: '#171B1F',
  surfaceRaised: '#212730',
  border: '#2C333B',
  text: '#F0F3F5',
  textMuted: '#9AA6B2',
  textFaint: '#69747F',
  accent: '#6FA8A0',
  accentPressed: '#5A8C85',
  accentText: '#08110F',
  neutralNote: '#8C93A8',
} as const;

// Hands are meant to be a little shaky, so nothing interactive is small.
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;
export const tapTarget = 60;

export const type = {
  display: { fontSize: 34, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700' },
  body: { fontSize: 17, fontWeight: '400' },
  label: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;
