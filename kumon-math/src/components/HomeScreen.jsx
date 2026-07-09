import { useApp } from '../context/AppContext.jsx'
import { SUBJECTS } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import { effectiveStreak, practicedToday, familyAlive } from '../lib/streaks.js'
import StreakBadge from './StreakBadge.jsx'

export default function HomeScreen({ onPickProfile, onParent, onAddProfile, onEditProfile }) {
  const { state } = useApp()
  const profiles = Object.values(state.profiles)
  const family = state.family
  const bothToday = profiles.every((p) => practicedToday(p))

  return (
    <div className="screen home">
      <header className="home-head">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden>
            <svg viewBox="0 0 48 48" width="100%" height="100%">
              <defs>
                <linearGradient id="egGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#6d3bf5" />
                  <stop offset="0.5" stopColor="#4468f0" />
                  <stop offset="1" stopColor="#22b8d6" />
                </linearGradient>
              </defs>
              <path
                d="M7 40 C 20 40, 24 12, 41 8"
                fill="none"
                stroke="url(#egGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path d="M31 8 L43 6 L41 18 Z" fill="#22b8d6" />
            </svg>
          </span>
          <h1 className="brand">Exponential Go</h1>
        </div>
        <p className="tagline">Level up a little every day — pick your name to start</p>
      </header>

      <div className="profile-grid">
        {profiles.map((p) => (
          <div className="profile-card-wrap" key={p.id}>
            <button
              className="profile-card"
              style={{ '--accent': p.color }}
              onClick={() => onPickProfile(p.id)}
            >
              <div className="profile-avatar" aria-hidden>
                {p.avatar}
              </div>
              <div className="profile-name">{p.name}</div>
              <div className="profile-streak-row">
                <StreakBadge count={effectiveStreak(p)} practicedToday={practicedToday(p)} />
              </div>
              <div className="subject-chips">
                {SUBJECTS.map((s) => {
                  const belt = beltForLevel(p.subjects[s.id].currentLevel - 1)
                  return (
                    <span key={s.id} className="subject-chip" title={`${s.name}: ${belt.name}`}>
                      <span className="sc-icon">{s.icon}</span>
                      <span className="sc-belt" style={{ background: belt.color }} />
                    </span>
                  )
                })}
              </div>
            </button>
            <button
              className="card-edit"
              onClick={() => onEditProfile(p.id)}
              aria-label={`Edit ${p.name}`}
            >
              ✏️
            </button>
          </div>
        ))}
        <button className="profile-card add-card" onClick={onAddProfile}>
          <div className="add-plus">＋</div>
          <div className="add-label">Add a kid</div>
        </button>
      </div>

      <div className={`family-streak ${familyAlive(family) ? 'alive' : 'dormant'}`}>
        <div className="family-streak-icon">🤝</div>
        <div className="family-streak-text">
          <strong>
            Family Streak: {family.streak} {family.streak === 1 ? 'day' : 'days'}
          </strong>
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
