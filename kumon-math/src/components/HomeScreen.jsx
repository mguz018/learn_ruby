import { useApp } from '../context/AppContext.jsx'
import { beltForLevel } from '../data/belts.js'
import { getLevel } from '../data/levels.js'
import { effectiveStreak, practicedToday, familyAlive } from '../lib/streaks.js'
import StreakBadge from './StreakBadge.jsx'

export default function HomeScreen({ onPickProfile, onParent }) {
  const { state } = useApp()
  const profiles = Object.values(state.profiles)
  const family = state.family
  const bothToday = profiles.every((p) => practicedToday(p))

  return (
    <div className="screen home">
      <header className="home-head">
        <h1 className="brand">
          <span className="brand-emoji">🥋</span> Math Belts
        </h1>
        <p className="tagline">Pick your name to practice</p>
      </header>

      <div className="profile-grid">
        {profiles.map((p) => {
          const belt = beltForLevel(p.currentLevel - 1)
          const level = getLevel(p.currentLevel)
          const streak = effectiveStreak(p)
          return (
            <button
              key={p.id}
              className="profile-card"
              style={{ '--accent': p.color }}
              onClick={() => onPickProfile(p.id)}
            >
              <div className="profile-avatar" aria-hidden>
                {p.avatar}
              </div>
              <div className="profile-name">{p.name}</div>
              <div className="profile-belt" style={{ '--belt': belt.color, '--belt-ink': belt.ink }}>
                <span className="belt-chip" />
                {belt.name}
              </div>
              <div className="profile-level">Level {p.currentLevel} · {level.title}</div>
              <div className="profile-streak-row">
                <StreakBadge count={streak} practicedToday={practicedToday(p)} />
              </div>
            </button>
          )
        })}
      </div>

      <div className={`family-streak ${familyAlive(family) ? 'alive' : 'dormant'}`}>
        <div className="family-streak-icon">🤝</div>
        <div className="family-streak-text">
          <strong>Family Streak: {family.streak} {family.streak === 1 ? 'day' : 'days'}</strong>
          <span>
            {bothToday
              ? 'Both practiced today — teamwork! 🎉'
              : 'Both of you practice today to keep it going!'}
          </span>
        </div>
      </div>

      <button className="parent-link" onClick={onParent}>
        ⚙︎ Grown-ups
      </button>
    </div>
  )
}
