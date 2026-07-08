import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadState, saveState, defaultState, todayKey } from '../lib/storage.js'
import { evaluateSet, nextLevelAfter } from '../lib/mastery.js'
import { recordProfilePractice, updateFamilyStreak } from '../lib/streaks.js'
import { getLevel } from '../data/levels.js'
import { beltForLevel } from '../data/belts.js'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

const HISTORY_CAP = 400

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  // Keep a synchronous mirror so finishSet can compute + return a summary from
  // the freshest state without waiting for a re-render.
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    saveState(state)
  }, [state])

  function commit(draft) {
    stateRef.current = draft
    setState(draft)
  }

  function updateState(mutator) {
    const draft = structuredClone(stateRef.current)
    mutator(draft)
    commit(draft)
    return draft
  }

  function thresholdsFor(state, levelId) {
    const lvl = getLevel(levelId)
    const cfg = state.settings.perLevel[levelId] || {}
    return {
      speedSec: cfg.speedSec ?? lvl.defaultSpeedSec,
      accuracy: cfg.accuracy ?? lvl.defaultAccuracy,
      problems: cfg.problems ?? lvl.defaultProblems,
    }
  }

  const actions = useMemo(() => {
    return {
      setInputMode(profileId, mode) {
        updateState((d) => {
          d.profiles[profileId].inputMode = mode
        })
      },

      setPlacement(profileId, level) {
        updateState((d) => {
          const p = d.profiles[profileId]
          p.currentLevel = level
          p.placementDone = true
        })
      },

      // Core: process a completed set, mutate progress, and return a summary.
      finishSet(profileId, playedLevelId, tally) {
        const { results, timeMs, recognition } = tally
        const draft = structuredClone(stateRef.current)
        const p = draft.profiles[profileId]
        const thresholds = thresholdsFor(draft, playedLevelId)

        const correct = results.filter((r) => r.correct).length
        const total = results.length
        const evalResult = evaluateSet({ levelId: playedLevelId, correct, total, timeMs, thresholds })

        // Personal best (best time on a set that met the accuracy target).
        const prevBest = p.bests[playedLevelId]
        let beatBest = false
        if (evalResult.accuracyPass) {
          if (!prevBest || timeMs < prevBest.timeMs) {
            beatBest = !!prevBest
            p.bests[playedLevelId] = { timeMs, accuracy: evalResult.accuracy }
          }
        }

        // Missed problems -> queue for spaced repetition next set.
        const missed = results.filter((r) => !r.correct).map((r) => r.problem)
        p.missedQueue = missed

        // Struggle detection.
        for (const r of results) {
          const key = r.problem.factKey || 'other'
          if (!p.struggles[key]) p.struggles[key] = { misses: 0, attempts: 0 }
          p.struggles[key].attempts += 1
          if (!r.correct) p.struggles[key].misses += 1
        }

        // Handwriting recognition tuning stats.
        if (recognition) {
          p.recognition.corrections += recognition.corrections || 0
          p.recognition.recognized += recognition.recognized || 0
        }

        // Level progression.
        const { nextLevel, leveledUp } = nextLevelAfter(p, playedLevelId, evalResult.mastered)
        const fromLevel = p.currentLevel
        p.currentLevel = nextLevel

        // History (capped).
        p.history.push({
          date: todayKey(),
          ts: Date.now(),
          levelId: playedLevelId,
          timeMs,
          accuracy: evalResult.accuracy,
          total,
          correct,
          leveledUp,
        })
        if (p.history.length > HISTORY_CAP) {
          p.history = p.history.slice(-HISTORY_CAP)
        }

        // Streaks.
        const streakResult = recordProfilePractice(p)
        updateFamilyStreak(draft.family, draft.profiles)

        commit(draft)

        return {
          profileId,
          playedLevelId,
          correct,
          total,
          timeMs,
          accuracy: evalResult.accuracy,
          mastered: evalResult.mastered,
          speedPass: evalResult.speedPass,
          accuracyPass: evalResult.accuracyPass,
          speedTargetSec: evalResult.speedTargetSec,
          accuracyTarget: evalResult.accuracyTarget,
          leveledUp,
          fromLevel,
          nextLevel,
          newBelt: leveledUp ? beltForLevel(nextLevel - 1) : null,
          prevBest,
          currentBest: p.bests[playedLevelId],
          beatBest,
          missedProblems: results.filter((r) => !r.correct),
          streakCount: p.streak.count,
          streakFroze: streakResult.froze,
          familyStreak: draft.family.streak,
        }
      },

      // Parent dashboard knobs.
      updateSettings(mutator) {
        updateState((d) => mutator(d.settings))
      },

      moveLevel(profileId, level) {
        updateState((d) => {
          const clamped = Math.max(1, Math.min(11, level))
          d.profiles[profileId].currentLevel = clamped
        })
      },

      setPin(pin) {
        updateState((d) => {
          d.settings.pin = pin
        })
      },

      importState(json) {
        const parsed = typeof json === 'string' ? JSON.parse(json) : json
        // Basic shape check before committing.
        if (!parsed || !parsed.profiles) throw new Error('That does not look like a Math Belts backup.')
        commit(loadStateFrom(parsed))
      },

      exportState() {
        return JSON.stringify(stateRef.current, null, 2)
      },

      resetAll() {
        commit(defaultState())
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({ state, ...actions }), [state, actions])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Re-run migration on imported data by round-tripping through storage helpers.
function loadStateFrom(parsed) {
  const base = defaultState()
  const merged = { ...base, ...parsed }
  merged.settings = { ...base.settings, ...(parsed.settings || {}) }
  merged.settings.perLevel = { ...base.settings.perLevel, ...(parsed.settings?.perLevel || {}) }
  merged.family = { ...base.family, ...(parsed.family || {}) }
  merged.profiles = {}
  for (const id of Object.keys(base.profiles)) {
    const p = parsed.profiles?.[id] || base.profiles[id]
    merged.profiles[id] = {
      ...base.profiles[id],
      ...p,
      streak: { ...base.profiles[id].streak, ...(p.streak || {}) },
      recognition: { ...base.profiles[id].recognition, ...(p.recognition || {}) },
    }
  }
  return merged
}
