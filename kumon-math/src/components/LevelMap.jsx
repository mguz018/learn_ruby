import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { getSubject } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import { fmtTime } from '../lib/stats.js'

export default function LevelMap({ profile, subjectId, onStartLevel, onBack, onRecheck }) {
  const { state } = useApp()
  const p = state.profiles[profile.id]
  const subject = getSubject(subjectId)
  const sp = p.subjects[subjectId]
  const currentBelt = beltForLevel(sp.currentLevel - 1)
  const [lockedId, setLockedId] = useState(null)

  function tapNode(lvl, status) {
    if (status === 'ahead') {
      // Locked: mastery gating means you unlock the next belt by earning it.
      setLockedId(lvl.id)
      setTimeout(() => setLockedId((cur) => (cur === lvl.id ? null : cur)), 1500)
      return
    }
    onStartLevel(lvl.id)
  }

  return (
    <div className="screen levelmap" style={{ '--accent': subject.color }}>
      <header className="map-head">
        <button className="ghost-btn" onClick={onBack}>
          ‹ Back
        </button>
        <div className="map-title">
          <span className="map-avatar">{subject.icon}</span>
          <div>
            <div className="map-name">{subject.name}</div>
            <div className="map-sub">{p.name}</div>
          </div>
        </div>
        <div className="map-belt" style={{ '--belt': currentBelt.color, '--belt-ink': currentBelt.ink }}>
          <span className="belt-chip big" />
          {currentBelt.name}
        </div>
      </header>

      <p className="map-hint">Tap your glowing level to practice — or tap a belt you’ve earned to review it.</p>

      <div className="path-scroll">
        <ol className="belt-path">
          {subject.levels.map((lvl, idx) => {
            const belt = beltForLevel(idx)
            const status =
              lvl.id < sp.currentLevel ? 'done' : lvl.id === sp.currentLevel ? 'current' : 'ahead'
            const best = sp.bests[lvl.id]
            return (
              <li key={lvl.id} className={`path-node-row ${idx % 2 ? 'right' : 'left'}`}>
                <button
                  className={`path-node ${status} ${lockedId === lvl.id ? 'shake' : ''}`}
                  onClick={() => tapNode(lvl, status)}
                  aria-label={`Level ${lvl.id}, ${lvl.title}, ${
                    status === 'ahead' ? 'locked' : status === 'done' ? 'earned' : 'current'
                  }`}
                >
                  <span
                    className="node-medal"
                    style={{ '--belt': belt.color, '--belt-ink': belt.ink, '--glow': belt.glow }}
                  >
                    {status === 'done' ? '★' : status === 'current' ? lvl.id : '🔒'}
                  </span>
                  <span className="node-info">
                    <span className="node-level">Level {lvl.id}</span>
                    <span className="node-name">{lvl.title}</span>
                    <span className="node-belt">{belt.name}</span>
                    {best && <span className="node-best">Best: {fmtTime(best.timeMs)}</span>}
                    {status === 'done' && <span className="node-replay">↻ Tap to review</span>}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {lockedId && (
        <div className="locked-toast">🔒 Earn the belts before it to unlock Level {lockedId}!</div>
      )}

      <div className="map-foot">
        <button className="primary-btn big" onClick={() => onStartLevel(sp.currentLevel)}>
          ▶ Start Level {sp.currentLevel} · {subject.levels[sp.currentLevel - 1]?.title}
        </button>
        <button className="ghost-btn recheck-btn" onClick={onRecheck}>
          Too easy or too hard? Take the quick level check
        </button>
      </div>
    </div>
  )
}
