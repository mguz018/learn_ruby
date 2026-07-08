// Mastery gating: a kid advances only when they hit BOTH the speed target AND
// the accuracy target for the level. Otherwise they repeat the level with a
// fresh set.

import { MAX_LEVEL } from '../data/levels.js'

export function evaluateSet({ levelId, correct, total, timeMs, thresholds }) {
  const accuracy = total > 0 ? correct / total : 0
  // Speed budget scales with the configured set size, so changing
  // problems-per-set keeps the same per-problem pace.
  const budgetMs = thresholds.speedSec * 1000 * (total / thresholds.problems)

  const speedPass = timeMs <= budgetMs
  const accuracyPass = accuracy >= thresholds.accuracy
  const mastered = speedPass && accuracyPass

  return {
    accuracy,
    speedPass,
    accuracyPass,
    mastered,
    budgetMs,
    speedTargetSec: Math.round(budgetMs / 1000),
    accuracyTarget: thresholds.accuracy,
  }
}

// Given the profile's current level and a mastery result on that level, return
// the level to play next and whether they leveled up. Only mastering the level
// you are CURRENTLY on advances you.
export function nextLevelAfter(profile, playedLevelId, mastered) {
  const onCurrent = playedLevelId === profile.currentLevel
  if (mastered && onCurrent && profile.currentLevel < MAX_LEVEL) {
    return { nextLevel: profile.currentLevel + 1, leveledUp: true }
  }
  return { nextLevel: profile.currentLevel, leveledUp: false }
}
