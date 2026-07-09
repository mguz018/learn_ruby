import { SUBJECTS, subjectMaxLevel } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import { getSubjectLevel } from '../data/subjects.js'
import { useApp } from '../context/AppContext.jsx'
import { setsToday } from '../lib/stats.js'
import { effectiveStreak } from '../lib/streaks.js'
import { STICKERS } from '../data/stickers.js'

export default function SubjectPicker({ profile, onPick, onHome, onOpenHub }) {
  const { state } = useApp()
  const p = state.profiles[profile.id]
  const goal = state.settings.dailyGoal || 2
  const done = setsToday(p)
  const earned = Object.keys(p.stickers || {}).length

  return (
    <div className="screen subjects" style={{ '--accent': profile.color }}>
      <header className="map-head">
        <button className="ghost-btn" onClick={onHome}>
          ‹ Home
        </button>
        <div className="map-title">
          <span className="map-avatar">{p.avatar}</span>
          <div className="map-name">{p.name}</div>
        </div>
        <span style={{ width: 60 }} />
      </header>

      <button className="progress-strip" onClick={onOpenHub}>
        <span className="ps-item">🔥 <b>{effectiveStreak(p)}</b> day streak</span>
        <span className="ps-item">
          🎯 Today <b>{done}/{goal}</b>
          <span className="ps-dots">
            {Array.from({ length: goal }).map((_, i) => (
              <span key={i} className={`ps-dot ${i < done ? 'on' : ''}`} />
            ))}
          </span>
        </span>
        <span className="ps-item">🏅 <b>{earned}</b>/{STICKERS.length} stickers ›</span>
      </button>

      <p className="subjects-prompt">What do you want to practice?</p>

      <div className="subject-grid">
        {SUBJECTS.map((s) => {
          const sp = profile.subjects[s.id]
          const belt = beltForLevel(sp.currentLevel - 1)
          const level = getSubjectLevel(s.id, sp.currentLevel)
          const max = subjectMaxLevel(s.id)
          return (
            <button
              key={s.id}
              className="subject-card"
              style={{ '--subject': s.color }}
              onClick={() => onPick(s.id)}
            >
              <div className="subject-icon">{s.icon}</div>
              <div className="subject-name">{s.name}</div>
              <div className="subject-belt" style={{ '--belt': belt.color, '--belt-ink': belt.ink }}>
                <span className="belt-chip" />
                {belt.name}
              </div>
              <div className="subject-progress">
                {sp.placementDone ? (
                  <>
                    Level {sp.currentLevel} of {max} · {level.title}
                  </>
                ) : (
                  'Tap to start with a quick check'
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
