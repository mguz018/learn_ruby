// localStorage-backed persistence for all progress. One JSON blob under a
// versioned key so we can migrate later if needed.

import { LEVELS } from '../data/levels.js'

const STORAGE_KEY = 'mathbelts.state.v1'

// Default MNIST digit model. This is loaded at runtime from a CDN (see
// recognition.js). It is overridable from the parent dashboard so a better /
// self-hosted model can be swapped in without a code change.
export const DEFAULT_MODEL_URL =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_v1/model.json'

function defaultPerLevel() {
  const out = {}
  for (const lvl of LEVELS) {
    out[lvl.id] = {
      speedSec: lvl.defaultSpeedSec,
      accuracy: lvl.defaultAccuracy,
      problems: lvl.defaultProblems,
    }
  }
  return out
}

export function newProfile(id, name, color, avatar) {
  return {
    id,
    name,
    color,
    avatar,
    currentLevel: 1,
    inputMode: 'handwriting', // 'handwriting' | 'keypad'
    placementDone: false,
    bests: {}, // levelId -> { timeMs, accuracy }
    missedQueue: [], // problems to re-inject next set
    struggles: {}, // factKey -> { misses, attempts }
    recognition: { corrections: 0, recognized: 0 }, // handwriting tuning stats
    streak: {
      count: 0,
      lastPracticeDate: null, // 'YYYY-MM-DD'
      freezes: 1,
      freezeWeek: null, // ISO week key the current freeze was granted for
    },
    history: [], // { date, ts, levelId, timeMs, accuracy, total, correct, leveledUp }
  }
}

export function defaultState() {
  return {
    version: 1,
    profiles: {
      oliver: newProfile('oliver', 'Oliver', '#2c6bed', '🦊'),
      noah: newProfile('noah', 'Noah', '#e0662b', '🐨'),
    },
    family: { streak: 0, lastDate: null, prevDate: null },
    settings: {
      pin: '1234',
      perLevel: defaultPerLevel(),
      modelUrl: DEFAULT_MODEL_URL,
      confidenceThreshold: 0.6,
    },
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return migrate(parsed)
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

// Fill in any keys added after a profile was first created, so upgrades don't
// crash on missing fields.
function migrate(state) {
  const base = defaultState()
  const merged = { ...base, ...state }
  merged.settings = { ...base.settings, ...(state.settings || {}) }
  merged.settings.perLevel = { ...base.settings.perLevel, ...(state.settings?.perLevel || {}) }
  merged.family = { ...base.family, ...(state.family || {}) }
  merged.profiles = { ...state.profiles }
  for (const id of Object.keys(base.profiles)) {
    const p = state.profiles?.[id] || base.profiles[id]
    merged.profiles[id] = {
      ...base.profiles[id],
      ...p,
      streak: { ...base.profiles[id].streak, ...(p.streak || {}) },
      recognition: { ...base.profiles[id].recognition, ...(p.recognition || {}) },
    }
  }
  return merged
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
  const a = dateFromKey(aKey)
  const b = dateFromKey(bKey)
  return Math.round((b - a) / 86400000)
}

// ISO-week key like "2026-W28", used to grant one streak freeze per week.
export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}
