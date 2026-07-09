import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { SUBJECTS, getSubject, subjectMaxLevel, getSubjectLevel } from '../data/subjects.js'
import { beltForLevel } from '../data/belts.js'
import {
  weeklySummary,
  topStruggles,
  totalSetsThisWeek,
  recognitionCorrectionRate,
  fmtTime,
} from '../lib/stats.js'
import { effectiveStreak } from '../lib/streaks.js'
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
        {[['overview', 'Overview'], ['settings', 'Settings'], ['data', 'Backup']].map(([k, label]) => (
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
      {tab === 'settings' && <SettingsPanel state={state} updateSettings={updateSettings} setPin={setPin} />}
      {tab === 'data' && <DataPanel exportState={exportState} importState={importState} resetAll={resetAll} />}
    </div>
  )
}

function KidOverview({ profile, moveLevel }) {
  const corr = recognitionCorrectionRate(profile)
  const weekSets = totalSetsThisWeek(profile)

  // Aggregate struggles across subjects, tagged with the subject icon.
  const struggles = []
  for (const s of SUBJECTS) {
    for (const row of topStruggles(profile.subjects[s.id], 3)) {
      struggles.push({ ...row, icon: s.icon, subject: s.name })
    }
  }
  struggles.sort((a, b) => b.rate - a.rate || b.misses - a.misses)

  return (
    <section className="kid-card" style={{ '--accent': profile.color }}>
      <div className="kid-card-head">
        <span className="kid-avatar">{profile.avatar}</span>
        <div>
          <h2>{profile.name}</h2>
          <div className="kid-sub">
            🔥 {effectiveStreak(profile)}-day streak · {weekSets} sets this week
          </div>
        </div>
      </div>

      <div className="subject-rows">
        {SUBJECTS.map((s) => {
          const sp = profile.subjects[s.id]
          const belt = beltForLevel(sp.currentLevel - 1)
          const level = getSubjectLevel(s.id, sp.currentLevel)
          const wk = weeklySummary(profile, s.id)
          return (
            <div key={s.id} className="subject-row">
              <div className="sr-head">
                <span className="sr-icon">{s.icon}</span>
                <div className="sr-name">
                  <strong>{s.name}</strong>
                  <span className="sr-belt">
                    <span className="belt-chip" style={{ '--belt': belt.color, '--belt-ink': belt.ink }} />
                    {belt.name} · L{sp.currentLevel}/{subjectMaxLevel(s.id)} · {level.title}
                  </span>
                </div>
              </div>
              <div className="sr-stats">
                <span>{wk.sets} sets</span>
                <span>{wk.sets ? `${Math.round(wk.avgAccuracy * 100)}%` : '—'} acc</span>
                <span>{wk.sets ? fmtTime(wk.avgTimeMs) : '—'}</span>
              </div>
              <div className="sr-move">
                <button className="chip-btn tiny" onClick={() => moveLevel(profile.id, s.id, sp.currentLevel - 1)}>
                  −
                </button>
                <button className="chip-btn tiny" onClick={() => moveLevel(profile.id, s.id, sp.currentLevel + 1)}>
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="struggle-block">
        <div className="trend-label">Struggles — most-missed</div>
        {struggles.length === 0 ? (
          <p className="empty-note">Not enough data yet — keep practicing!</p>
        ) : (
          <ul className="struggle-list">
            {struggles.slice(0, 6).map((s) => (
              <li key={`${s.subject}-${s.key}`}>
                <span className="struggle-key">
                  {s.icon} {s.key}
                </span>
                <span className="struggle-bar-wrap">
                  <span className="struggle-bar" style={{ width: `${Math.round(s.rate * 100)}%` }} />
                </span>
                <span className="struggle-rate">
                  {s.misses}/{s.attempts}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="recog-note">
        ✏️ Math handwriting corrections: <strong>{Math.round(corr * 100)}%</strong>
        {corr > 0.25 ? ' — high; consider the keypad for this kid.' : ' — looking good.'}
      </div>
    </section>
  )
}

function SettingsPanel({ state, updateSettings, setPin }) {
  const [subjectId, setSubjectId] = useState('math')
  const [pinDraft, setPinDraft] = useState('')
  const subject = getSubject(subjectId)
  const usesSpeed = subject.masteryType === 'speed-accuracy'

  return (
    <div className="parent-body">
      <section className="settings-section">
        <h2>Level targets</h2>
        <p className="section-note">
          A kid earns a belt only when they beat the target(s) on their current level.
          {usesSpeed ? ' Math needs both time and accuracy.' : ' This subject is accuracy-only — no time pressure.'}
        </p>

        <div className="subject-subtabs">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              className={`subtab ${subjectId === s.id ? 'active' : ''}`}
              onClick={() => setSubjectId(s.id)}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>

        <div className="level-settings">
          {subject.levels.map((lvl) => {
            const cfg = state.settings.thresholds[subjectId][lvl.id]
            return (
              <div key={lvl.id} className={`level-row ${usesSpeed ? '' : 'no-speed'}`}>
                <div className="level-row-title">
                  <span className="lr-num">{lvl.id}</span> {lvl.title}
                </div>
                {usesSpeed && (
                  <label>
                    Time (s)
                    <input
                      type="number"
                      min="20"
                      value={cfg.speedSec ?? ''}
                      onChange={(e) =>
                        updateSettings((st) => {
                          st.thresholds[subjectId][lvl.id].speedSec = Number(e.target.value) || cfg.speedSec
                        })
                      }
                    />
                  </label>
                )}
                <label>
                  Accuracy %
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={Math.round(cfg.accuracy * 100)}
                    onChange={(e) =>
                      updateSettings((st) => {
                        const pct = Number(e.target.value)
                        st.thresholds[subjectId][lvl.id].accuracy = Math.min(1, Math.max(0.5, pct / 100))
                      })
                    }
                  />
                </label>
                <label>
                  Problems
                  <input
                    type="number"
                    min="4"
                    max="40"
                    value={cfg.problems}
                    onChange={(e) =>
                      updateSettings((st) => {
                        st.thresholds[subjectId][lvl.id].problems = Math.max(4, Number(e.target.value) || cfg.problems)
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
        <h2>Handwriting recognition (Math)</h2>
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
    a.download = `exponential-go-backup-${Date.now()}.json`
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
