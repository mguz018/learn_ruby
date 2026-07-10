// Belt / rank colors, in order of progression. One rank per level.
// White -> black covers the classic belts; past black we award vivid "master"
// ranks so an advanced kid always has a next belt to chase.
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
  { key: 'black-red', name: 'Black · Red Stripe', color: '#18181b', ink: '#fca5a5', glow: '#7f1d1d' },
  { key: 'black-gold', name: 'Black · Gold Stripe', color: '#111111', ink: '#fcd34d', glow: '#a16207' },
  { key: 'bronze', name: 'Bronze Star', color: '#b45309', ink: '#fff7ed', glow: '#fbbf24' },
  { key: 'silver', name: 'Silver Star', color: '#94a3b8', ink: '#0f172a', glow: '#e2e8f0' },
  { key: 'gold', name: 'Gold Star', color: '#eab308', ink: '#422006', glow: '#fef08a' },
  { key: 'sapphire', name: 'Sapphire', color: '#2563eb', ink: '#eff6ff', glow: '#93c5fd' },
  { key: 'ruby', name: 'Ruby', color: '#be123c', ink: '#fff1f2', glow: '#fda4af' },
  { key: 'emerald', name: 'Emerald', color: '#059669', ink: '#ecfdf5', glow: '#6ee7b7' },
  { key: 'amethyst', name: 'Amethyst', color: '#7c3aed', ink: '#f5f3ff', glow: '#c4b5fd' },
  { key: 'diamond', name: 'Diamond', color: '#22d3ee', ink: '#083344', glow: '#a5f3fc' },
  { key: 'grandmaster', name: 'Grand Master', color: '#0f172a', ink: '#fde047', glow: '#7c3aed' },
  // Space-themed "master" ranks for deep ladders (e.g. 30-level Math).
  { key: 'titanium', name: 'Titanium', color: '#64748b', ink: '#f8fafc', glow: '#cbd5e1' },
  { key: 'cosmic', name: 'Cosmic', color: '#4338ca', ink: '#e0e7ff', glow: '#818cf8' },
  { key: 'nebula', name: 'Nebula', color: '#9333ea', ink: '#faf5ff', glow: '#d8b4fe' },
  { key: 'nova', name: 'Nova', color: '#db2777', ink: '#fff1f2', glow: '#f9a8d4' },
  { key: 'quasar', name: 'Quasar', color: '#0891b2', ink: '#ecfeff', glow: '#67e8f9' },
  { key: 'pulsar', name: 'Pulsar', color: '#ca8a04', ink: '#fefce8', glow: '#fde047' },
  { key: 'aurora', name: 'Aurora', color: '#059669', ink: '#ecfdf5', glow: '#6ee7b7' },
  { key: 'meteor', name: 'Meteor', color: '#ea580c', ink: '#fff7ed', glow: '#fdba74' },
  { key: 'comet', name: 'Comet', color: '#0ea5e9', ink: '#f0f9ff', glow: '#7dd3fc' },
  { key: 'eclipse', name: 'Eclipse', color: '#1e1b4b', ink: '#c7d2fe', glow: '#4f46e5' },
  { key: 'galaxy', name: 'Galaxy', color: '#312e81', ink: '#e0e7ff', glow: '#a78bfa' },
  { key: 'infinity', name: 'Infinity', color: '#020617', ink: '#38bdf8', glow: '#0ea5e9' },
]

export function beltForLevel(levelIndex) {
  // levelIndex is 0-based. Clamp to last belt if a subject has more levels.
  return BELTS[Math.min(Math.max(levelIndex, 0), BELTS.length - 1)]
}
