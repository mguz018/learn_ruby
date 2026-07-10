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
  const { state, updateSettings, moveLevel, setPin, importState, exportState, resetAll, deleteProfile } =
    useApp()
  const profiles = Object.values(state.profiles)
  const [tab, setTab] = useState('overview')
  const canDelete = profiles.length > 1

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
          <p className="section-note" style={{ margin: 0 }}>
            Add or customize kids from the Home screen (tap ＋ Add a kid, or the ✏️ on a card).
          </p>
          {profiles.map((p) => (
            <KidOverview
              key={p.id}
              profile={p}
              moveLevel={moveLevel}
              onDelete={
                canDelete
                  ? () => {
                      if (window.confirm(`Remove ${p.name} and erase their progress? This cannot be undone.`))
                        deleteProfile(p.id)
                    }
                  : null
              }
            />
          ))}
        </div>
      )}
      {tab === 'settings' && <SettingsPanel state={state} updateSettings={updateSettings} setPin={setPin} />}
      {tab === 'data' && <DataPanel exportState={exportState} importState={importState} resetAll={resetAll} />}
    </div>
  )
}

function KidOverview({ profile, moveLevel, onDelete }) {
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

      {onDelete && (
        <button className="remove-kid" onClick={onDelete}>
          Remove {profile.name}
        </button>
      )}
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
        <h2>Daily goal</h2>
        <label className="wide-label">
          Sets per day for the daily-goal ring: <strong>{state.settings.dailyGoal || 2}</strong>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={state.settings.dailyGoal || 2}
            onChange={(e) =>
              updateSettings((s) => {
                s.dailyGoal = Number(e.target.value)
              })
            }
          />
          <span className="section-note">Each kid’s “Today” ring fills as they finish sets.</span>
        </label>
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
            Below this, a digit box turns yellow and asks for a rewrite instead of guessing. The
            digit recognizer ships with the app (works offline) — no setup needed.
          </span>
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
      <SyncPanel />
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

function statusLabel(s) {
  return s === 'synced'
    ? 'up to date ✓'
    : s === 'syncing'
      ? 'syncing…'
      : s === 'error'
        ? 'connection problem'
        : 'idle'
}

function SyncPanel() {
  const { sync } = useApp()
  const [joinCode, setJoinCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [showCode, setShowCode] = useState('')

  if (!sync.available) {
    return (
      <section className="settings-section sync-section">
        <h2>☁️ Sync across devices</h2>
        <p className="section-note">
          Cloud sync isn’t switched on for this site yet. A grown-up can enable it by adding the
          Supabase keys in Netlify (see <code>SETUP-SYNC.md</code> in the project). Until then,
          progress is saved on this device — use Export/Import below to move it.
        </p>
      </section>
    )
  }

  async function run(fn, okMsg) {
    setBusy(true)
    setMsg('')
    try {
      const r = await fn()
      if (okMsg) setMsg(okMsg)
      return r
    } catch (e) {
      setMsg('✕ ' + (e.message || 'Something went wrong'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="settings-section sync-section">
      <h2>
        ☁️ Sync across devices <span className={`sync-dot ${sync.status}`} />
      </h2>
      {sync.enabled ? (
        <>
          <p className="section-note">
            This device is syncing. Enter this code on another device to share the same progress:
          </p>
          <div className="sync-code">{sync.code}</div>
          <div className="data-actions">
            <button className="chip-btn" onClick={() => navigator.clipboard?.writeText(sync.code)}>
              Copy code
            </button>
            <button className="chip-btn" disabled={busy} onClick={() => run(() => sync.pushNow(), '✓ Synced.')}>
              Sync now
            </button>
            <button className="chip-btn" onClick={sync.disable}>
              Stop on this device
            </button>
          </div>
          <p className="sync-status-line">Status: {statusLabel(sync.status)}</p>
        </>
      ) : (
        <>
          <p className="section-note">
            Turn on sync to back up progress to the cloud and use it on your other devices.
          </p>
          <div className="data-actions">
            <button
              className="primary-btn"
              disabled={busy}
              onClick={() =>
                run(async () => setShowCode(await sync.enable()), 'Sync is on! Save this code for other devices.')
              }
            >
              Turn on sync
            </button>
          </div>
          {showCode && <div className="sync-code">{showCode}</div>}
          <div className="sync-join">
            <p className="section-note" style={{ marginBottom: 6 }}>
              Already have a family code from another device?
            </p>
            <div className="data-actions">
              <input
                className="text-input"
                placeholder="XXXX-XXXX-XXXX"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button
                className="chip-btn"
                disabled={busy || !joinCode.trim()}
                onClick={() =>
                  run(
                    () => sync.join(joinCode),
                    '✓ Connected! This device now shares that family’s progress.',
                  ).then(() => setJoinCode(''))
                }
              >
                Connect
              </button>
            </div>
          </div>
        </>
      )}
      {msg && <div className="data-msg">{msg}</div>}
    </section>
  )
}
