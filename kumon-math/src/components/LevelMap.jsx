import { useApp } from '../context/AppContext.jsx'
import { getSubject } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import { fmtTime } from '../lib/stats.js'

export default function LevelMap({ profile, subjectId, onStart, onBack }) {
  const { state } = useApp()
  const p = state.profiles[profile.id]
  const subject = getSubject(subjectId)
  const sp = p.subjects[subjectId]
  const currentBelt = beltForLevel(sp.currentLevel - 1)

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

      <div className="path-scroll">
        <ol className="belt-path">
          {subject.levels.map((lvl, idx) => {
            const belt = beltForLevel(idx)
            const status =
              lvl.id < sp.currentLevel ? 'done' : lvl.id === sp.currentLevel ? 'current' : 'ahead'
            const best = sp.bests[lvl.id]
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
          ▶ Start Level {sp.currentLevel} · {getSubject(subjectId).levels[sp.currentLevel - 1]?.title}
        </button>
      </div>
    </div>
  )
}
