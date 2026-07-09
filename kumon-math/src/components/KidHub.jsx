import { useApp } from '../context/AppContext.jsx'
import { STICKERS } from '../data/stickers.js'
import { setsToday, practicedDays } from '../lib/stats.js'
import { effectiveStreak, practicedToday } from '../lib/streaks.js'
import { todayKey } from '../lib/storage.js'
import StreakBadge from './StreakBadge.jsx'

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function KidHub({ profile, onBack }) {
  const { state } = useApp()
  const p = state.profiles[profile.id]
  const goal = state.settings.dailyGoal || 2
  const doneToday = setsToday(p)
  const earnedCount = Object.keys(p.stickers || {}).length

  return (
    <div className="screen kidhub" style={{ '--accent': p.color }}>
      <header className="map-head">
        <button className="ghost-btn" onClick={onBack}>
          ‹ Back
        </button>
        <div className="map-title">
          <span className="map-avatar">{p.avatar}</span>
          <div className="map-name">{p.name}’s Progress</div>
        </div>
        <span style={{ width: 60 }} />
      </header>

      <div className="hub-top">
        <GoalRing done={doneToday} goal={goal} color={p.color} />
        <div className="hub-streak">
          <StreakBadge count={effectiveStreak(p)} practicedToday={practicedToday(p)} />
          <div className="hub-streak-sub">
            {doneToday >= goal
              ? 'Daily goal complete — awesome! 🎉'
              : `${goal - doneToday} more set${goal - doneToday === 1 ? '' : 's'} to hit today’s goal`}
          </div>
        </div>
      </div>

      <section className="hub-section">
        <h2 className="hub-h2">📅 Practice Calendar</h2>
        <StreakCalendar profiles={state.profiles} profileId={p.id} />
      </section>

      <section className="hub-section">
        <h2 className="hub-h2">
          🏅 Sticker Book <span className="sticker-count">{earnedCount} / {STICKERS.length}</span>
        </h2>
        <div className="sticker-grid">
          {STICKERS.map((s) => {
            const earned = p.stickers?.[s.id]
            return (
              <div key={s.id} className={`sticker ${earned ? 'earned' : 'locked'}`} title={s.desc}>
                <div className="sticker-emoji">{earned ? s.emoji : '❔'}</div>
                <div className="sticker-name">{s.name}</div>
                <div className="sticker-desc">{s.desc}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function GoalRing({ done, goal, color }) {
  const pct = Math.min(done / goal, 1)
  const R = 46
  const C = 2 * Math.PI * R
  const complete = done >= goal
  return (
    <div className="goal-ring">
      <svg viewBox="0 0 110 110" width="110" height="110">
        <circle cx="55" cy="55" r={R} className="ring-track" />
        <circle
          cx="55"
          cy="55"
          r={R}
          className="ring-progress"
          style={{
            stroke: complete ? 'var(--good)' : color,
            strokeDasharray: C,
            strokeDashoffset: C * (1 - pct),
          }}
        />
      </svg>
      <div className="goal-ring-label">
        {complete ? <span className="goal-check">✓</span> : <span className="goal-num">{done}</span>}
        <span className="goal-of">of {goal}</span>
        <span className="goal-word">today</span>
      </div>
    </div>
  )
}

function StreakCalendar({ profiles, profileId }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthName = now.toLocaleString('default', { month: 'long' })
  const first = new Date(year, month, 1)
  const startDow = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = todayKey()

  const mine = practicedDays(profiles[profileId])
  // A "family day" = every kid practiced that day.
  const allSets = Object.values(profiles).map((pr) => practicedDays(pr))
  const familyDay = (key) => allSets.every((s) => s.has(key))

  const cells = []
  for (let i = 0; i < startDow; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ d, key })
  }

  return (
    <div className="calendar">
      <div className="cal-month">{monthName} {year}</div>
      <div className="cal-grid">
        {DAY_LABELS.map((l, i) => (
          <div key={`h${i}`} className="cal-dow">{l}</div>
        ))}
        {cells.map((c, i) =>
          c === null ? (
            <div key={`b${i}`} className="cal-cell blank" />
          ) : (
            <div
              key={c.key}
              className={`cal-cell ${mine.has(c.key) ? 'practiced' : ''} ${
                familyDay(c.key) ? 'family' : ''
              } ${c.key === today ? 'today' : ''}`}
            >
              {c.d}
            </div>
          ),
        )}
      </div>
      <div className="cal-legend">
        <span><span className="dot practiced" /> Practiced</span>
        <span><span className="dot family" /> Family day 🤝</span>
      </div>
    </div>
  )
}
