import { useEffect } from 'react'
import { getLevel } from '../data/levels.js'
import { playFanfare } from '../lib/sound.js'

// Full-screen belt promotion celebration with confetti + fanfare.
export default function BeltCelebration({ belt, profile, toLevel, onContinue }) {
  const nextLevel = getLevel(toLevel)

  useEffect(() => {
    playFanfare()
  }, [])

  const confetti = Array.from({ length: 40 })

  return (
    <div className="screen celebration" style={{ '--belt': belt.color, '--belt-ink': belt.ink, '--glow': belt.glow }}>
      <div className="confetti-layer" aria-hidden>
        {confetti.map((_, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 10) * 0.12}s`,
              background: ['#facc15', '#38bdf8', '#4ade80', '#f472b6', '#fb923c'][i % 5],
            }}
          />
        ))}
      </div>

      <div className="celebration-inner">
        <div className="celebrate-belt">
          <div className="belt-big" />
          <div className="belt-knot" />
        </div>
        <h1 className="celebrate-title">New Belt!</h1>
        <div className="celebrate-belt-name">{belt.name}</div>
        <p className="celebrate-msg">
          Amazing, {profile.name}! You mastered it and earned your {belt.name}.
        </p>
        <p className="celebrate-next">Next up: Level {toLevel} — {nextLevel.title}</p>
        <button className="primary-btn big glow-btn" onClick={onContinue}>
          Awesome! →
        </button>
      </div>
    </div>
  )
}
