// localStorage-backed persistence. Progress is per-subject: each profile keeps
// an independent belt track for Math, Reading, History, and Science. Streaks,
// input preference, and recognition stats stay at the profile level (shared).

import { SUBJECTS, SUBJECT_IDS, recommendedStart } from '../data/subjects.js'

const STORAGE_KEY = 'mathbelts.state.v1'

// MNIST digit model, loaded at runtime from a CDN (see recognition.js) and
// overridable from the parent dashboard.
export const DEFAULT_MODEL_URL =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_v1/model.json'

function subjectProgress() {
  return {
    currentLevel: 1,
    placementDone: false,
    bests: {}, // levelId -> { timeMs, accuracy }
    missedQueue: [],
    struggles: {}, // factKey -> { misses, attempts }
  }
}

function defaultThresholds() {
  const out = {}
  for (const s of SUBJECTS) {
    out[s.id] = {}
    for (const lvl of s.levels) {
      out[s.id][lvl.id] = {
        speedSec: lvl.defaultSpeedSec,
        accuracy: lvl.defaultAccuracy,
        problems: lvl.defaultProblems,
      }
    }
  }
  return out
}

export function newProfile(id, name, color, avatar) {
  const subjects = {}
  for (const sid of SUBJECT_IDS) {
    // Seat the kid at a grade-appropriate belt out of the box.
    subjects[sid] = { ...subjectProgress(), currentLevel: recommendedStart(id, sid), placementDone: true }
  }
  return {
    id,
    name,
    color,
    avatar,
    inputMode: 'handwriting', // 'handwriting' | 'keypad' (math numeric entry)
    recognition: { corrections: 0, recognized: 0 },
    streak: { count: 0, lastPracticeDate: null, freezes: 1, freezeWeek: null },
    history: [], // { date, ts, subjectId, levelId, timeMs, accuracy, total, correct, leveledUp }
    stickers: {}, // achievementId -> earned date
    everFroze: false,
    everBeatBest: false,
    custom: false, // true for parent-added profiles
    subjects,
  }
}

export function defaultState() {
  return {
    version: 2,
    profiles: {
      oliver: newProfile('oliver', 'Oliver', '#2c6bed', '🦒'),
      noah: newProfile('noah', 'Noah', '#e0662b', '🐧🦉'),
    },
    family: { streak: 0, lastDate: null },
    settings: {
      pin: '1234',
      thresholds: defaultThresholds(),
      modelUrl: DEFAULT_MODEL_URL,
      confidenceThreshold: 0.6,
      dailyGoal: 2, // sets per day per kid for the daily goal ring
    },
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return migrate(JSON.parse(raw))
  } catch (err) {
    console.warn('Failed to load state, starting fresh:', err)
    return defaultState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Failed to save state:', err)
  }
}

// Merge a loaded/imported blob onto defaults, upgrading the old single-track
// (v1) shape into per-subject progress where needed.
export function migrate(state) {
  const base = defaultState()
  const merged = { ...base, ...state }

  merged.settings = { ...base.settings, ...(state.settings || {}) }
  // Deep-merge thresholds so new levels/subjects always have defaults.
  merged.settings.thresholds = mergeThresholds(base.settings.thresholds, state.settings)
  merged.family = { ...base.family, ...(state.family || {}) }

  merged.profiles = {}
  // Union of the two built-in profiles and any parent-added custom profiles.
  const ids = new Set([...Object.keys(base.profiles), ...Object.keys(state.profiles || {})])
  for (const id of ids) {
    const p = state.profiles?.[id]
    const builtIn = base.profiles[id]
    // Custom profiles have no built-in template; build one from their own data.
    const template = builtIn || newProfile(id, p?.name || 'Kid', p?.color || '#5b34e8', p?.avatar || '🙂')
    merged.profiles[id] = migrateProfile(template, p, !!builtIn)
  }
  return merged
}

function mergeThresholds(baseTh, oldSettings) {
  const out = {}
  for (const sid of Object.keys(baseTh)) {
    out[sid] = { ...baseTh[sid] }
    // v2 shape
    const provided = oldSettings?.thresholds?.[sid]
    if (provided) {
      for (const lvl of Object.keys(provided)) out[sid][lvl] = { ...out[sid][lvl], ...provided[lvl] }
    }
  }
  // v1 shape: settings.perLevel held math thresholds
  if (oldSettings?.perLevel) {
    for (const lvl of Object.keys(oldSettings.perLevel)) {
      out.math[lvl] = { ...out.math[lvl], ...oldSettings.perLevel[lvl] }
    }
  }
  return out
}

function migrateProfile(baseProfile, p, isBuiltIn = true) {
  if (!p) return baseProfile
  const out = {
    ...baseProfile,
    ...p,
    streak: { ...baseProfile.streak, ...(p.streak || {}) },
    recognition: { ...baseProfile.recognition, ...(p.recognition || {}) },
    stickers: { ...(p.stickers || {}) },
  }
  // Built-in kids (Oliver/Noah) adopt the current canonical avatar so avatar
  // changes reach saved profiles; custom kids keep the avatar they were given.
  if (isBuiltIn && !p.custom) out.avatar = baseProfile.avatar

  if (p.subjects) {
    // v2: ensure every subject exists.
    out.subjects = {}
    for (const sid of SUBJECT_IDS) {
      out.subjects[sid] = { ...subjectProgress(), ...(p.subjects[sid] || {}) }
    }
  } else {
    // v1 -> v2: move old top-level math progress into subjects.math.
    out.subjects = {}
    for (const sid of SUBJECT_IDS) out.subjects[sid] = subjectProgress()
    out.subjects.math = {
      currentLevel: p.currentLevel ?? 1,
      placementDone: p.placementDone ?? false,
      bests: p.bests || {},
      missedQueue: p.missedQueue || [],
      struggles: p.struggles || {},
    }
  }

  // Ensure history entries carry a subjectId (old ones were all math).
  out.history = (p.history || []).map((h) => ({ subjectId: h.subjectId || 'math', ...h }))

  // Seat any UNTOUCHED subject at the kid's recommended level, so an advanced
  // kid parked at level 1 (e.g. after skipping placement) gets a proper path
  // without losing any real progress. "Untouched" = still level 1, no bests,
  // and no completed sets in that subject.
  for (const sid of SUBJECT_IDS) {
    const sp = out.subjects[sid]
    const noHistory = !out.history.some((h) => h.subjectId === sid)
    const noBests = !sp.bests || Object.keys(sp.bests).length === 0
    if ((sp.currentLevel || 1) <= 1 && noBests && noHistory) {
      sp.currentLevel = recommendedStart(baseProfile.id, sid)
      sp.placementDone = true
    }
  }

  // Drop stale v1 top-level fields.
  delete out.currentLevel
  delete out.placementDone
  delete out.bests
  delete out.missedQueue
  delete out.struggles
  return out
}

// ---- Date helpers (local time) ----------------------------------------------

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
export function dateFromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export function daysBetween(aKey, bKey) {
  return Math.round((dateFromKey(bKey) - dateFromKey(aKey)) / 86400000)
}
export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}
