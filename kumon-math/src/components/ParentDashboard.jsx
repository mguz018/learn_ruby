import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { LEVELS, getLevel } from '../data/levels.js'
import { beltForLevel } from '../data/belts.js'
import { weeklySummary, topStruggles, recognitionCorrectionRate, fmtTime } from '../lib/stats.js'
import PinGate from './PinGate.jsx'

export default function ParentDashboard({ onExit }) {
  const { state } = useApp()
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return <PinGate expected={state.settings.pin} onUnlock={() => setUnlocked(true)} onCancel={onExit} />
  }
  return <Dashboard onExit={onExit} />
}

function Dashboard({ onExit }) {
  const { state, updateSettings, moveLevel, setPin, importState, exportState, resetAll } = useApp()
  const profiles = Object.values(state.profiles)
  const [tab, setTab] = useState('overview')

  return (
    <div className="screen parent">
      <header className="parent-head">
        <button className="ghost-btn" onClick={onExit}>
          ‹ Exit
        </button>
        <h1>Parent Dashboard</h1>
        <span style={{ width: 60 }} />
      </header>

      <nav className="parent-tabs">
        {[
          ['overview', 'Overview'],
          ['settings', 'Settings'],
          ['data', 'Backup'],
        ].map(([k, label]) => (
          <button key={k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="parent-body">
          {profiles.map((p) => (
            <KidOverview key={p.id} profile={p} moveLevel={moveLevel} />
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <SettingsPanel state={state} updateSettings={updateSettings} setPin={setPin} />
      )}

      {tab === 'data' && (
        <DataPanel exportState={exportState} importState={importState} resetAll={resetAll} />
      )}
    </div>
  )
}

function KidOverview({ profile, moveLevel }) {
  const summary = weeklySummary(profile)
  const struggles = topStruggles(profile)
  const belt = beltForLevel(profile.currentLevel - 1)
  const level = getLevel(profile.currentLevel)
  const corr = recognitionCorrectionRate(profile)

  return (
    <section className="kid-card" style={{ '--accent': profile.color }}>
      <div className="kid-card-head">
        <span className="kid-avatar">{profile.avatar}</span>
        <div>
          <h2>{profile.name}</h2>
          <div className="kid-sub">
            <span className="belt-chip" style={{ '--belt': belt.color, '--belt-ink': belt.ink }} />
            {belt.name} · Level {profile.currentLevel} · {level.title}
          </div>
        </div>
      </div>

      <div className="kid-stats">
        <Metric label="Sets this week" value={summary.sets} />
        <Metric label="Avg accuracy" value={`${Math.round(summary.avgAccuracy * 100)}%`} />
        <Metric label="Avg time" value={fmtTime(summary.avgTimeMs)} />
      </div>

      <div className="trend-block">
        <div className="trend-label">Accuracy trend (7 days)</div>
        <Sparkline points={summary.trend.map((t) => t.accuracy)} />
      </div>

      <div className="struggle-block">
        <div className="trend-label">Struggles — most-missed</div>
        {struggles.length === 0 ? (
          <p className="empty-note">Not enough data yet — keep practicing!</p>
        ) : (
          <ul className="struggle-list">
            {struggles.map((s) => (
              <li key={s.key}>
                <span className="struggle-key">{s.key}</span>
                <span className="struggle-bar-wrap">
                  <span className="struggle-bar" style={{ width: `${Math.round(s.rate * 100)}%` }} />
                </span>
                <span className="struggle-rate">
                  {s.misses}/{s.attempts} missed
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="recog-note">
        ✏️ Handwriting corrections: <strong>{Math.round(corr * 100)}%</strong> of recognized digits
        {corr > 0.25 ? ' — high; consider switching this kid to the keypad.' : ' — looking good.'}
      </div>

      <div className="level-move">
        <span>Move level:</span>
        <button className="chip-btn" onClick={() => moveLevel(profile.id, profile.currentLevel - 1)}>
          − Down
        </button>
        <button className="chip-btn" onClick={() => moveLevel(profile.id, profile.currentLevel + 1)}>
          + Up
        </button>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

function Sparkline({ points }) {
  if (!points || points.length === 0) return <div className="empty-note">No sets yet.</div>
  const w = 280
  const h = 60
  const max = 1
  const min = 0
  const step = points.length > 1 ? w / (points.length - 1) : w
  const coords = points.map((p, i) => {
    const x = points.length > 1 ? i * step : w / 2
    const y = h - ((p - min) / (max - min)) * h
    return [x, y]
  })
  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <line x1="0" y1={h - 0.95 * h} x2={w} y2={h - 0.95 * h} className="spark-goal" />
      <path d={path} className="spark-line" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" className="spark-dot" />
      ))}
    </svg>
  )
}

function SettingsPanel({ state, updateSettings, setPin }) {
  const [pinDraft, setPinDraft] = useState('')
  return (
    <div className="parent-body">
      <section className="settings-section">
        <h2>Level targets</h2>
        <p className="section-note">
          A kid levels up only when they beat BOTH the time and accuracy target on their current level.
        </p>
        <div className="level-settings">
          {LEVELS.map((lvl) => {
            const cfg = state.settings.perLevel[lvl.id]
            return (
              <div key={lvl.id} className="level-row">
                <div className="level-row-title">
                  <span className="lr-num">{lvl.id}</span> {lvl.title}
                </div>
                <label>
                  Time (s)
                  <input
                    type="number"
                    min="20"
                    value={cfg.speedSec}
                    onChange={(e) =>
                      updateSettings((s) => {
                        s.perLevel[lvl.id].speedSec = Number(e.target.value) || cfg.speedSec
                      })
                    }
                  />
                </label>
                <label>
                  Accuracy %
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={Math.round(cfg.accuracy * 100)}
                    onChange={(e) =>
                      updateSettings((s) => {
                        const pct = Number(e.target.value)
                        s.perLevel[lvl.id].accuracy = Math.min(1, Math.max(0.5, pct / 100))
                      })
                    }
                  />
                </label>
                <label>
                  Problems
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={cfg.problems}
                    onChange={(e) =>
                      updateSettings((s) => {
                        s.perLevel[lvl.id].problems = Math.max(5, Number(e.target.value) || cfg.problems)
                      })
                    }
                  />
                </label>
              </div>
            )
          })}
        </div>
      </section>

      <section className="settings-section">
        <h2>Handwriting recognition</h2>
        <label className="wide-label">
          Confidence threshold: {Math.round(state.settings.confidenceThreshold * 100)}%
          <input
            type="range"
            min="0.3"
            max="0.95"
            step="0.05"
            value={state.settings.confidenceThreshold}
            onChange={(e) =>
              updateSettings((s) => {
                s.confidenceThreshold = Number(e.target.value)
              })
            }
          />
          <span className="section-note">
            Below this, a digit box turns yellow and asks for a rewrite instead of guessing.
          </span>
        </label>
        <label className="wide-label">
          MNIST model URL (loaded from CDN)
          <input
            type="text"
            className="text-input"
            value={state.settings.modelUrl}
            onChange={(e) =>
              updateSettings((s) => {
                s.modelUrl = e.target.value
              })
            }
          />
        </label>
      </section>

      <section className="settings-section">
        <h2>Parent PIN</h2>
        <div className="pin-change">
          <input
            type="text"
            inputMode="numeric"
            className="text-input"
            placeholder="New PIN (4–6 digits)"
            value={pinDraft}
            onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <button
            className="chip-btn"
            disabled={pinDraft.length < 4}
            onClick={() => {
              setPin(pinDraft)
              setPinDraft('')
            }}
          >
            Save PIN
          </button>
        </div>
      </section>
    </div>
  )
}

function DataPanel({ exportState, importState, resetAll }) {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')

  function doExport() {
    const json = exportState()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `math-belts-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function doImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importState(reader.result)
        setMsg('✓ Backup restored!')
      } catch (err) {
        setMsg(`✕ ${err.message}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="parent-body">
      <section className="settings-section">
        <h2>Backup &amp; restore</h2>
        <p className="section-note">All progress lives on this device. Export a JSON backup to keep it safe.</p>
        <div className="data-actions">
          <button className="primary-btn" onClick={doExport}>
            ⬇ Export backup
          </button>
          <button className="chip-btn" onClick={() => fileRef.current?.click()}>
            ⬆ Import backup
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={doImport} />
        </div>
        {msg && <div className="data-msg">{msg}</div>}
      </section>

      <section className="settings-section danger">
        <h2>Reset</h2>
        <p className="section-note">Erase all profiles and progress on this device. This cannot be undone.</p>
        <button
          className="danger-btn"
          onClick={() => {
            if (window.confirm('Erase ALL progress for both kids? This cannot be undone.')) resetAll()
          }}
        >
          Reset everything
        </button>
      </section>
    </div>
  )
}
