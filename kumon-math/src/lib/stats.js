// Analytics for the parent dashboard: weekly summaries and struggle detection,
// scoped per subject.

import { todayKey, daysBetween } from './storage.js'

export function weeklySummary(profile, subjectId, days = 7) {
  const today = todayKey()
  const recent = profile.history.filter(
    (h) => h.subjectId === subjectId && daysBetween(h.date, today) < days,
  )
  const sets = recent.length
  const avgAccuracy = sets ? recent.reduce((s, h) => s + h.accuracy, 0) / sets : 0
  const avgTimeMs = sets ? recent.reduce((s, h) => s + h.timeMs, 0) / sets : 0

  const byDay = {}
  for (const h of recent) {
    if (!byDay[h.date]) byDay[h.date] = []
    byDay[h.date].push(h.accuracy)
  }
  const trend = Object.keys(byDay)
    .sort()
    .map((date) => ({
      date,
      accuracy: byDay[date].reduce((a, b) => a + b, 0) / byDay[date].length,
    }))

  return { sets, avgAccuracy, avgTimeMs, trend }
}

// Sets completed this week across ALL subjects (for the streak/overview header).
export function totalSetsThisWeek(profile, days = 7) {
  const today = todayKey()
  return profile.history.filter((h) => daysBetween(h.date, today) < days).length
}

export function topStruggles(subjectProgress, limit = 5, minAttempts = 2) {
  return Object.entries(subjectProgress.struggles || {})
    .map(([key, v]) => ({ key, misses: v.misses, attempts: v.attempts, rate: v.attempts ? v.misses / v.attempts : 0 }))
    .filter((r) => r.misses > 0 && r.attempts >= minAttempts)
    .sort((a, b) => b.rate - a.rate || b.misses - a.misses)
    .slice(0, limit)
}

export function recognitionCorrectionRate(profile) {
  const r = profile.recognition || { corrections: 0, recognized: 0 }
  if (!r.recognized) return 0
  return r.corrections / r.recognized
}

export function fmtTime(ms) {
  if (ms == null) return '—'
  const totalSec = Math.round(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m === 0) return `${s}s`
  return `${m}m ${String(s).padStart(2, '0')}s`
}
