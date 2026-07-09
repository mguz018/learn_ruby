import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadState, saveState, defaultState, migrate, newProfile, todayKey } from '../lib/storage.js'
import { evaluateSet, nextLevelAfter } from '../lib/mastery.js'
import { recordProfilePractice, updateFamilyStreak } from '../lib/streaks.js'
import { getSubject, getSubjectLevel, subjectMaxLevel, SUBJECT_IDS } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import { evaluateStickers, getSticker } from '../data/stickers.js'
import {
  isConfigured,
  createFamily,
  pullFamily,
  pushFamily,
  getStoredCode,
  setStoredCode,
  formatCode,
  normalizeCode,
} from '../lib/sync.js'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

const HISTORY_CAP = 600
const PUSH_DEBOUNCE = 1500

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const stateRef = useRef(state)
  stateRef.current = state

  // --- Cloud sync state ---
  const [syncCode, setSyncCode] = useState(getStoredCode())
  const [syncStatus, setSyncStatus] = useState('off') // off | syncing | synced | error
  const pushTimer = useRef(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  function schedulePush() {
    if (!isConfigured() || !getStoredCode()) return
    if (pushTimer.current) clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(async () => {
      try {
        setSyncStatus('syncing')
        await pushFamily(getStoredCode(), stateRef.current)
        setSyncStatus('synced')
      } catch (err) {
        console.warn('Sync push failed:', err)
        setSyncStatus('error')
      }
    }, PUSH_DEBOUNCE)
  }

  // Local change: stamp, persist, and (if enabled) push to the cloud.
  function commit(draft) {
    draft.updatedAt = Date.now()
    stateRef.current = draft
    setState(draft)
    schedulePush()
  }
  // Remote change: adopt as-is, no timestamp bump, no echo push (uses setState
  // directly rather than commit(), so schedulePush() is never called).
  function applyRemote(remote) {
    stateRef.current = remote
    setState(remote)
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

        // Achievement stickers (earned, never bought).
        if (streakResult.froze) profile.everFroze = true
        if (beatBest) profile.everBeatBest = true
        const earnedIds = evaluateStickers(profile, draft.family)
        const newStickerIds = earnedIds.filter((id) => !profile.stickers[id])
        for (const id of newStickerIds) profile.stickers[id] = todayKey()

        commit(draft)

        return {
          profileId,
          subjectId,
          playedLevelId,
          newStickers: newStickerIds.map(getSticker).filter(Boolean),
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

      // --- Profile management (customize kids) ---
      addProfile({ name, avatar, color }) {
        let newId
        updateState((d) => {
          const id = `k${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
          newId = id
          const prof = newProfile(id, name?.trim() || 'New Kid', color || '#5b34e8', avatar || '🙂')
          prof.custom = true
          // Custom kids place themselves via the quick check the first time.
          for (const sid of SUBJECT_IDS) prof.subjects[sid].placementDone = false
          d.profiles[id] = prof
        })
        return newId
      },

      updateProfile(id, changes) {
        updateState((d) => {
          const p = d.profiles[id]
          if (!p) return
          if (changes.name != null) p.name = changes.name.trim() || p.name
          if (changes.avatar) p.avatar = changes.avatar
          if (changes.color) p.color = changes.color
        })
      },

      deleteProfile(id) {
        updateState((d) => {
          if (Object.keys(d.profiles).length <= 1) return // keep at least one kid
          delete d.profiles[id]
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

  // Pull remote on mount (and when the app regains focus) and reconcile by
  // last-write-wins timestamp.
  async function pullAndReconcile() {
    const code = getStoredCode()
    if (!isConfigured() || !code) return
    try {
      setSyncStatus('syncing')
      const remote = await pullFamily(code)
      if (remote && (remote.updatedAt || 0) > (stateRef.current.updatedAt || 0)) {
        applyRemote(migrate(remote))
      } else if (!remote || (stateRef.current.updatedAt || 0) > (remote.updatedAt || 0)) {
        await pushFamily(code, stateRef.current)
      }
      setSyncStatus('synced')
    } catch (err) {
      console.warn('Sync pull failed:', err)
      setSyncStatus('error')
    }
  }

  useEffect(() => {
    pullAndReconcile()
    const onFocus = () => {
      if (document.visibilityState === 'visible') pullAndReconcile()
    }
    document.addEventListener('visibilitychange', onFocus)
    return () => document.removeEventListener('visibilitychange', onFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = {
    available: isConfigured(),
    enabled: !!syncCode,
    status: syncStatus,
    code: syncCode ? formatCode(syncCode) : null,

    async enable() {
      const code = await createFamily(stateRef.current)
      setStoredCode(code)
      setSyncCode(normalizeCode(code))
      setSyncStatus('synced')
      return formatCode(code)
    },

    async join(input) {
      const remote = await pullFamily(input)
      if (!remote) throw new Error('No family found for that code. Double-check it and try again.')
      setStoredCode(input)
      setSyncCode(normalizeCode(input))
      applyRemote(migrate(remote))
      setSyncStatus('synced')
    },

    async pushNow() {
      const code = getStoredCode()
      if (!code) return
      setSyncStatus('syncing')
      try {
        await pushFamily(code, stateRef.current)
        setSyncStatus('synced')
      } catch (err) {
        setSyncStatus('error')
        throw err
      }
    },

    disable() {
      setStoredCode(null)
      setSyncCode(null)
      setSyncStatus('off')
    },
  }

  const value = useMemo(() => ({ state, ...actions, sync }), [state, actions, sync])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
