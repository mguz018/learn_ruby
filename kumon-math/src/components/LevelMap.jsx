import { useApp } from '../context/AppContext.jsx'
import { LEVELS } from '../data/levels.js'
import { beltForLevel } from '../data/belts.js'
import { fmtTime } from '../lib/stats.js'
import { effectiveStreak, practicedToday } from '../lib/streaks.js'
import StreakBadge from './StreakBadge.jsx'

export default function LevelMap({ profile, onStart, onHome }) {
  const { state } = useApp()
  const p = state.profiles[profile.id] // freshest copy
  const currentBelt = beltForLevel(p.currentLevel - 1)

  return (
    <div className="screen levelmap" style={{ '--accent': p.color }}>
      <header className="map-head">
        <button className="ghost-btn" onClick={onHome}>
          ‹ Home
        </button>
        <div className="map-title">
          <span className="map-avatar">{p.avatar}</span>
          <div>
            <div className="map-name">{p.name}</div>
            <StreakBadge count={effectiveStreak(p)} practicedToday={practicedToday(p)} />
          </div>
        </div>
        <div className="map-belt" style={{ '--belt': currentBelt.color, '--belt-ink': currentBelt.ink }}>
          <span className="belt-chip big" />
          {currentBelt.name}
        </div>
      </header>

      <div className="path-scroll">
        <ol className="belt-path">
          {LEVELS.map((lvl, idx) => {
            const belt = beltForLevel(idx)
            const status =
              lvl.id < p.currentLevel ? 'done' : lvl.id === p.currentLevel ? 'current' : 'ahead'
            const best = p.bests[lvl.id]
            return (
              <li key={lvl.id} className={`path-node ${status} ${idx % 2 ? 'right' : 'left'}`}>
                <div
                  className="node-medal"
                  style={{ '--belt': belt.color, '--belt-ink': belt.ink, '--glow': belt.glow }}
                >
                  {status === 'done' ? '★' : status === 'current' ? lvl.id : '🔒'}
                </div>
                <div className="node-info">
                  <div className="node-level">Level {lvl.id}</div>
                  <div className="node-name">{lvl.title}</div>
                  <div className="node-belt">{belt.name}</div>
                  {best && <div className="node-best">Best: {fmtTime(best.timeMs)}</div>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="map-foot">
        <button className="primary-btn big" onClick={onStart}>
          ▶ Start Level {p.currentLevel} Practice
        </button>
      </div>
    </div>
  )
}
