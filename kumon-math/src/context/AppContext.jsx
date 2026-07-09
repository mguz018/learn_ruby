import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadState, saveState, defaultState, migrate, todayKey } from '../lib/storage.js'
import { evaluateSet, nextLevelAfter } from '../lib/mastery.js'
import { recordProfilePractice, updateFamilyStreak } from '../lib/streaks.js'
import { getSubject, getSubjectLevel, subjectMaxLevel } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

const HISTORY_CAP = 600

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
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

  function thresholdsFor(st, subjectId, levelId) {
    const lvl = getSubjectLevel(subjectId, levelId)
    const cfg = st.settings.thresholds?.[subjectId]?.[levelId] || {}
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

      setPlacement(profileId, subjectId, level) {
        updateState((d) => {
          const sp = d.profiles[profileId].subjects[subjectId]
          sp.currentLevel = level
          sp.placementDone = true
        })
      },

      finishSet(profileId, subjectId, playedLevelId, tally) {
        const { results, timeMs, recognition } = tally
        const draft = structuredClone(stateRef.current)
        const profile = draft.profiles[profileId]
        const sp = profile.subjects[subjectId]
        const subject = getSubject(subjectId)
        const thresholds = thresholdsFor(draft, subjectId, playedLevelId)

        const correct = results.filter((r) => r.correct).length
        const total = results.length
        const evalResult = evaluateSet({
          correct,
          total,
          timeMs,
          thresholds,
          masteryType: subject.masteryType,
        })

        // Personal best time (among accuracy-passing sets) — beat-your-own-time.
        const prevBest = sp.bests[playedLevelId]
        let beatBest = false
        if (evalResult.accuracyPass) {
          if (!prevBest || timeMs < prevBest.timeMs) {
            beatBest = !!prevBest
            sp.bests[playedLevelId] = { timeMs, accuracy: evalResult.accuracy }
          }
        }

        // Missed -> spaced repetition next set.
        sp.missedQueue = results.filter((r) => !r.correct).map((r) => r.problem)

        // Struggle detection (per subject).
        for (const r of results) {
          const key = r.problem.factKey || 'other'
          if (!sp.struggles[key]) sp.struggles[key] = { misses: 0, attempts: 0 }
          sp.struggles[key].attempts += 1
          if (!r.correct) sp.struggles[key].misses += 1
        }

        if (recognition) {
          profile.recognition.corrections += recognition.corrections || 0
          profile.recognition.recognized += recognition.recognized || 0
        }

        const { nextLevel, leveledUp } = nextLevelAfter(
          sp.currentLevel,
          playedLevelId,
          evalResult.mastered,
          subjectMaxLevel(subjectId),
        )
        const fromLevel = sp.currentLevel
        sp.currentLevel = nextLevel

        profile.history.push({
          date: todayKey(),
          ts: Date.now(),
          subjectId,
          levelId: playedLevelId,
          timeMs,
          accuracy: evalResult.accuracy,
          total,
          correct,
          leveledUp,
        })
        if (profile.history.length > HISTORY_CAP) profile.history = profile.history.slice(-HISTORY_CAP)

        const streakResult = recordProfilePractice(profile)
        updateFamilyStreak(draft.family, draft.profiles)

        commit(draft)

        return {
          profileId,
          subjectId,
          playedLevelId,
          correct,
          total,
          timeMs,
          accuracy: evalResult.accuracy,
          usesSpeed: evalResult.usesSpeed,
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
          currentBest: sp.bests[playedLevelId],
          beatBest,
          missedProblems: results.filter((r) => !r.correct),
          streakCount: profile.streak.count,
          streakFroze: streakResult.froze,
          familyStreak: draft.family.streak,
        }
      },

      updateSettings(mutator) {
        updateState((d) => mutator(d.settings))
      },

      moveLevel(profileId, subjectId, level) {
        updateState((d) => {
          const clamped = Math.max(1, Math.min(subjectMaxLevel(subjectId), level))
          d.profiles[profileId].subjects[subjectId].currentLevel = clamped
        })
      },

      setPin(pin) {
        updateState((d) => {
          d.settings.pin = pin
        })
      },

      importState(json) {
        const parsed = typeof json === 'string' ? JSON.parse(json) : json
        if (!parsed || !parsed.profiles) throw new Error('That does not look like an Exponential Go backup.')
        commit(migrate(parsed))
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
