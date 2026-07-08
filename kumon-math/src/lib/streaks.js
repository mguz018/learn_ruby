// Streak logic: personal daily streak (with one weekly freeze) and the
// cooperative family streak (alive only when BOTH kids practice the same day).

import { todayKey, daysBetween, isoWeekKey } from './storage.js'

// Grant the once-per-week streak freeze if we've rolled into a new week.
function grantWeeklyFreeze(streak, today) {
  const week = isoWeekKey(new Date(today.replace(/-/g, '/')))
  if (streak.freezeWeek !== week) {
    streak.freezes = 1 // one freeze per week, not stockpiled
    streak.freezeWeek = week
  }
}

// Record that `profile` practiced today. Mutates and returns { froze } so the
// UI can celebrate a saved streak. Call once per completed set; repeat calls
// the same day are no-ops for the count.
export function recordProfilePractice(profile) {
  const today = todayKey()
  const s = profile.streak
  grantWeeklyFreeze(s, today)

  if (s.lastPracticeDate === today) {
    s.lastPracticeDate = today
    return { froze: false, alreadyToday: true }
  }

  let froze = false
  if (!s.lastPracticeDate) {
    s.count = 1
  } else {
    const gap = daysBetween(s.lastPracticeDate, today)
    if (gap === 1) {
      s.count += 1
    } else if (gap === 2 && s.freezes > 0) {
      // Exactly one missed day — spend a freeze to keep the streak alive.
      s.freezes -= 1
      s.count += 1
      froze = true
    } else {
      s.count = 1
    }
  }
  s.lastPracticeDate = today
  return { froze, alreadyToday: false }
}

// Update the cooperative family streak. Call after both profiles' practice
// records are up to date for today.
export function updateFamilyStreak(family, profiles) {
  const today = todayKey()
  const bothToday = Object.values(profiles).every((p) => p.streak.lastPracticeDate === today)
  if (!bothToday) return
  if (family.lastDate === today) return

  if (family.lastDate && daysBetween(family.lastDate, today) === 1) {
    family.streak += 1
  } else {
    family.streak = 1
  }
  family.lastDate = today
}

// Non-mutating "what would the badge show right now" for a personal streak.
export function effectiveStreak(profile) {
  const s = profile.streak
  if (!s.lastPracticeDate) return 0
  const gap = daysBetween(s.lastPracticeDate, todayKey())
  if (gap <= 1) return s.count
  if (gap === 2 && s.freezes > 0) return s.count // a freeze would save it
  return 0
}

export function practicedToday(profile) {
  return profile.streak.lastPracticeDate === todayKey()
}

export function familyAlive(family) {
  if (!family.lastDate) return false
  return daysBetween(family.lastDate, todayKey()) <= 1
}
