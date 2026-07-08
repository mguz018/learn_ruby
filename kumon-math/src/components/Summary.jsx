import { useState } from 'react'
import { getLevel } from '../data/levels.js'
import { fmtTime } from '../lib/stats.js'
import BeltCelebration from './BeltCelebration.jsx'
import ProblemView from './ProblemView.jsx'

export default function Summary({ result, profile, onNextSet, onDone }) {
  const [celebrating, setCelebrating] = useState(result.leveledUp)
  const level = getLevel(result.playedLevelId)
  const accuracyPct = Math.round(result.accuracy * 100)
  const missed = result.missedProblems

  if (celebrating && result.newBelt) {
    return (
      <BeltCelebration
        belt={result.newBelt}
        profile={profile}
        fromLevel={result.fromLevel}
        toLevel={result.nextLevel}
        onContinue={() => setCelebrating(false)}
      />
    )
  }

  return (
    <div className="screen summary" style={{ '--accent': profile.color }}>
      <header className="summary-head">
        <div className="summary-avatar">{profile.avatar}</div>
        <h1>{result.mastered ? 'Set Complete! 🌟' : 'Set Complete'}</h1>
        <p className="summary-sub">
          {level.title} · Level {result.playedLevelId}
        </p>
      </header>

      <div className="stat-cards">
        <div className={`stat-card ${result.speedPass ? 'pass' : 'miss'}`}>
          <div className="stat-value">{fmtTime(result.timeMs)}</div>
          <div className="stat-label">Time {result.speedPass ? '✓' : ''}</div>
          <div className="stat-target">Target: under {fmtTime(result.speedTargetSec * 1000)}</div>
        </div>
        <div className={`stat-card ${result.accuracyPass ? 'pass' : 'miss'}`}>
          <div className="stat-value">{accuracyPct}%</div>
          <div className="stat-label">Accuracy {result.accuracyPass ? '✓' : ''}</div>
          <div className="stat-target">
            {result.correct} / {result.total} · target {Math.round(result.accuracyTarget * 100)}%
          </div>
        </div>
      </div>

      {result.beatBest ? (
        <div className="best-banner beat">⚡ New personal best! You beat your old time!</div>
      ) : result.currentBest ? (
        <div className="best-banner">
          Your best time on this level: <strong>{fmtTime(result.currentBest.timeMs)}</strong>
        </div>
      ) : null}

      {result.streakFroze && (
        <div className="freeze-banner">❄️ A streak freeze saved your streak — nice save!</div>
      )}

      {!result.mastered && (
        <div className="repeat-note">
          Almost there! Practice this level again to earn your next belt. You’ll get a fresh set.
        </div>
      )}

      {missed.length > 0 && (
        <div className="missed-block">
          <h2>Let’s look at these ({missed.length})</h2>
          <p className="missed-note">These will show up again next time so you can master them.</p>
          <ul className="missed-list">
            {missed.map((m, i) => (
              <li key={i} className="missed-item">
                <div className="missed-problem">
                  <ProblemView problem={m.problem} />
                </div>
                <div className="missed-answers">
                  <span className="you-said">
                    You wrote: <b>{m.given || '—'}</b>
                  </span>
                  <span className="correct-was">
                    Correct: <b>{m.problem.answer}</b>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="summary-actions">
        <button className="primary-btn big" onClick={onNextSet}>
          ▶ Next Set
        </button>
        <button className="ghost-btn big" onClick={onDone}>
          Done for now
        </button>
      </div>
    </div>
  )
}
