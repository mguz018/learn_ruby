// Mastery gating.
//   'speed-accuracy' (Math): must beat BOTH the time and accuracy target.
//   'accuracy' (Reading/History/Science): belt earned on accuracy alone; time is
//     tracked for the summary but never gates progress.
// Fail either required target -> repeat the level with a fresh set.

export function evaluateSet({ correct, total, timeMs, thresholds, masteryType }) {
  const accuracy = total > 0 ? correct / total : 0
  const accuracyPass = accuracy >= thresholds.accuracy

  const usesSpeed = masteryType === 'speed-accuracy' && thresholds.speedSec != null
  let speedPass = true
  let budgetMs = null
  if (usesSpeed) {
    budgetMs = thresholds.speedSec * 1000 * (total / thresholds.problems)
    speedPass = timeMs <= budgetMs
  }

  const mastered = accuracyPass && speedPass

  return {
    accuracy,
    speedPass,
    accuracyPass,
    usesSpeed,
    mastered,
    budgetMs,
    speedTargetSec: budgetMs != null ? Math.round(budgetMs / 1000) : null,
    accuracyTarget: thresholds.accuracy,
  }
}

// Advance only if you mastered the level you're CURRENTLY on and there's a
// higher level to reach.
export function nextLevelAfter(currentLevel, playedLevelId, mastered, maxLevel) {
  const onCurrent = playedLevelId === currentLevel
  if (mastered && onCurrent && currentLevel < maxLevel) {
    return { nextLevel: currentLevel + 1, leveledUp: true }
  }
  return { nextLevel: currentLevel, leveledUp: false }
}
