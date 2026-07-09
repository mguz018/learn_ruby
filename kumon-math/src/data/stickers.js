// Earned achievement stickers — collectible, never purchasable. Each is checked
// against a context derived from the kid's real play history, so they can even
// be awarded retroactively. Once earned, a sticker is kept forever.

import { SUBJECTS, subjectMaxLevel } from './subjects.js'

export const STICKERS = [
  { id: 'getting_started', emoji: '🌱', name: 'Getting Started', desc: 'Finish your very first set', check: (c) => c.sets >= 1 },
  { id: 'perfect', emoji: '💯', name: 'Perfecto!', desc: 'Get 100% on a set', check: (c) => c.perfect >= 1 },
  { id: 'first_belt', emoji: '🥋', name: 'First Belt', desc: 'Earn your first new belt', check: (c) => c.belts >= 1 },
  { id: 'streak_3', emoji: '🔥', name: 'On a Roll', desc: 'Reach a 3-day streak', check: (c) => c.streak >= 3 },
  { id: 'speedster', emoji: '🚀', name: 'Speedster', desc: 'Beat your own best time', check: (c) => c.beatBest },
  { id: 'sharp_shooter', emoji: '🎯', name: 'Sharp Shooter', desc: 'Get 100% five times', check: (c) => c.perfect >= 5 },
  { id: 'explorer', emoji: '🧭', name: 'Explorer', desc: 'Try every subject at least once', check: (c) => c.subjectsTried >= c.totalSubjects },
  { id: 'streak_7', emoji: '⚡', name: 'Week Warrior', desc: 'Reach a 7-day streak', check: (c) => c.streak >= 7 },
  { id: 'bookworm', emoji: '📚', name: 'Bookworm', desc: 'Finish 25 sets', check: (c) => c.sets >= 25 },
  { id: 'belt_collector', emoji: '🎖️', name: 'Belt Collector', desc: 'Earn 5 belts', check: (c) => c.belts >= 5 },
  { id: 'nice_save', emoji: '❄️', name: 'Nice Save', desc: 'A streak freeze saved your streak', check: (c) => c.everFroze },
  { id: 'team_players', emoji: '🤝', name: 'Team Players', desc: 'Keep a 7-day family streak', check: (c) => c.familyStreak >= 7 },
  { id: 'number_ninja', emoji: '🧮', name: 'Number Ninja', desc: 'Reach Math Level 15', check: (c) => c.mathLevel >= 15 },
  { id: 'top_class', emoji: '👑', name: 'Top of the Class', desc: 'Reach the final belt in a subject', check: (c) => c.anySubjectAtTop },
  { id: 'streak_30', emoji: '🏆', name: 'Unstoppable', desc: 'Reach a 30-day streak', check: (c) => c.streak >= 30 },
  { id: 'century', emoji: '🌟', name: 'Century Club', desc: 'Finish 100 sets', check: (c) => c.sets >= 100 },
]

export function stickerContext(profile, family) {
  const history = profile.history || []
  const subjectsTried = new Set(history.map((h) => h.subjectId)).size
  const anySubjectAtTop = SUBJECTS.some(
    (s) => (profile.subjects[s.id]?.currentLevel || 1) >= subjectMaxLevel(s.id),
  )
  return {
    sets: history.length,
    perfect: history.filter((h) => h.accuracy >= 1).length,
    belts: history.filter((h) => h.leveledUp).length,
    streak: profile.streak?.count || 0,
    beatBest: !!profile.everBeatBest,
    everFroze: !!profile.everFroze,
    subjectsTried,
    totalSubjects: SUBJECTS.length,
    familyStreak: family?.streak || 0,
    mathLevel: profile.subjects?.math?.currentLevel || 1,
    anySubjectAtTop,
  }
}

// Returns the array of sticker ids the profile currently qualifies for.
export function evaluateStickers(profile, family) {
  const ctx = stickerContext(profile, family)
  return STICKERS.filter((s) => {
    try {
      return s.check(ctx)
    } catch {
      return false
    }
  }).map((s) => s.id)
}

export function getSticker(id) {
  return STICKERS.find((s) => s.id === id)
}
