// Belt colors, in order of progression. One belt per level.
// Ordered white -> black, extended with stripes if more levels are added.
export const BELTS = [
  { key: 'white', name: 'White Belt', color: '#f4f4f5', ink: '#3f3f46', glow: '#e4e4e7' },
  { key: 'yellow', name: 'Yellow Belt', color: '#facc15', ink: '#713f12', glow: '#fde68a' },
  { key: 'orange', name: 'Orange Belt', color: '#fb923c', ink: '#7c2d12', glow: '#fed7aa' },
  { key: 'green', name: 'Green Belt', color: '#4ade80', ink: '#14532d', glow: '#bbf7d0' },
  { key: 'blue', name: 'Blue Belt', color: '#38bdf8', ink: '#0c4a6e', glow: '#bae6fd' },
  { key: 'purple', name: 'Purple Belt', color: '#a78bfa', ink: '#4c1d95', glow: '#ddd6fe' },
  { key: 'brown', name: 'Brown Belt', color: '#a16207', ink: '#fef3c7', glow: '#d6a95f' },
  { key: 'red', name: 'Red Belt', color: '#ef4444', ink: '#fee2e2', glow: '#fecaca' },
  { key: 'black', name: 'Black Belt', color: '#27272a', ink: '#fafafa', glow: '#52525b' },
  { key: 'black-red', name: 'Red Stripe', color: '#18181b', ink: '#fca5a5', glow: '#7f1d1d' },
  { key: 'black-gold', name: 'Gold Stripe', color: '#111111', ink: '#fcd34d', glow: '#a16207' },
]

export function beltForLevel(levelIndex) {
  // levelIndex is 0-based. Clamp to last belt if we run out.
  return BELTS[Math.min(levelIndex, BELTS.length - 1)]
}
