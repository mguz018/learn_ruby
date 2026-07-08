import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateProblem } from '../lib/problems.js'
import { getSubject, subjectMaxLevel, recommendedStart } from '../data/subjects.js'
import ProblemView from './ProblemView.jsx'
import Keypad from './Keypad.jsx'

// Anchor-and-adjust placement: start near the kid's expected level (their
// current seat) and move up while they're getting things right, or down while
// they're missing — so an advanced kid confirms their level in a question or
// two instead of grinding up from level 1.
export default function PlacementTest({ profile, subjectId, onDone, onBack }) {
  const { setPlacement } = useApp()
  const subject = getSubject(subjectId)
  const maxLevel = subjectMaxLevel(subjectId)
  const anchor = Math.min(
    maxLevel,
    profile.subjects[subjectId].currentLevel || recommendedStart(profile.id, subjectId),
  )

  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(anchor)
  const [mode, setMode] = useState('anchor') // 'anchor' | 'up' | 'down'
  const [problem, setProblem] = useState(() => generateProblem(subjectId, anchor))
  const [value, setValue] = useState('')
  const [choice, setChoice] = useState('')
  const [count, setCount] = useState(0)

  function place(atLevel) {
    setPlacement(profile.id, subjectId, Math.max(1, Math.min(maxLevel, atLevel)))
    onDone()
  }

  function goTo(nextLevel, nextMode) {
    setLevel(nextLevel)
    setMode(nextMode)
    setProblem(generateProblem(subjectId, nextLevel))
    setValue('')
    setChoice('')
    setCount((c) => c + 1)
  }

  function submit() {
    const given = problem.answerType === 'choice' ? choice : value
    if (given === '') return
    const correct =
      problem.answerType === 'choice' ? given === problem.answer : Number(given) === Number(problem.answer)

    if (correct) {
      // Descending and now correct -> we found their floor.
      if (mode === 'down') return place(level)
      if (level >= maxLevel) return place(maxLevel)
      return goTo(level + 1, 'up')
    }
    // Wrong:
    if (mode === 'up') return place(level) // was climbing; this level is the practice level
    if (level <= 1) return place(1)
    return goTo(level - 1, 'down')
  }

  if (!started) {
    return (
      <div className="screen placement intro" style={{ '--accent': subject.color }}>
        <button className="ghost-btn back-corner" onClick={onBack}>
          ‹ Back
        </button>
        <div className="placement-card">
          <div className="summary-avatar">{subject.icon}</div>
          <h1>{subject.name} Check</h1>
          <p>
            Hi {profile.name}! We’ll start around Level {anchor} and just check a couple of
            questions to find your best starting belt. Do your best!
          </p>
          <button className="primary-btn big" onClick={() => setStarted(true)}>
            Start
          </button>
          <button className="ghost-btn" onClick={() => place(anchor)}>
            Skip — keep Level {anchor}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`screen placement ${subject.numeric ? '' : 'quiz-session'}`}
      style={{ '--accent': subject.color }}
    >
      <header className="session-head">
        <button className="ghost-btn" onClick={() => place(anchor)}>
          ✕
        </button>
        <div className="placement-label">Finding your level… (Q{count + 1})</div>
        <span style={{ width: 44 }} />
      </header>

      <main className={`problem-stage ${subject.numeric ? '' : 'quiz-stage'}`}>
        <ProblemView problem={problem} />
      </main>

      <section className="input-stage">
        {problem.answerType === 'choice' ? (
          <ChoiceButtons problem={problem} value={choice} onPick={setChoice} />
        ) : (
          <Keypad
            value={value}
            onChange={setValue}
            maxLen={problem.needsKeypad ? 6 : problem.answer.replace(/[^0-9]/g, '').length || 1}
            allowDecimal={!!problem.needsKeypad}
          />
        )}
        <button className="check-btn" onClick={submit}>
          Check ✓
        </button>
      </section>
    </div>
  )
}

function ChoiceButtons({ problem, value, onPick }) {
  if (problem.textChoices) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    return (
      <div className="choice-input text">
        {problem.choices.map((c, i) => (
          <button key={c} className={`text-choice ${value === c ? 'selected' : ''}`} onClick={() => onPick(c)}>
            <span className="choice-letter">{letters[i]}</span>
            <span className="choice-text-label">{c}</span>
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="choice-input">
      {problem.choices.map((c) => (
        <button key={c} className={`choice-btn ${value === c ? 'selected' : ''}`} onClick={() => onPick(c)}>
          {c}
        </button>
      ))}
    </div>
  )
}
