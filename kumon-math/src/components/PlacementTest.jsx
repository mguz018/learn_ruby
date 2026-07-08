import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateProblem } from '../lib/problems.js'
import { getSubject, subjectMaxLevel } from '../data/subjects.js'
import ProblemView from './ProblemView.jsx'
import Keypad from './Keypad.jsx'

// Quick mixed quiz: one problem per level, climbing until the first miss, which
// places the kid at that level. Pass everything -> top level.
export default function PlacementTest({ profile, subjectId, onDone, onBack }) {
  const { setPlacement } = useApp()
  const subject = getSubject(subjectId)
  const maxLevel = subjectMaxLevel(subjectId)

  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [problem, setProblem] = useState(() => generateProblem(subjectId, 1))
  const [value, setValue] = useState('')
  const [choice, setChoice] = useState('')
  const [count, setCount] = useState(0)

  function place(atLevel) {
    setPlacement(profile.id, subjectId, Math.max(1, Math.min(maxLevel, atLevel)))
    onDone()
  }

  function submit() {
    const given = problem.answerType === 'choice' ? choice : value
    if (given === '') return
    const correct =
      problem.answerType === 'choice' ? given === problem.answer : Number(given) === Number(problem.answer)

    if (!correct) {
      place(level)
      return
    }
    const nextLevel = level + 1
    setCount((c) => c + 1)
    if (nextLevel > maxLevel) {
      place(maxLevel)
      return
    }
    setLevel(nextLevel)
    setProblem(generateProblem(subjectId, nextLevel))
    setValue('')
    setChoice('')
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
            Hi {profile.name}! Let’s find your starting belt in {subject.name} with a few quick
            questions. Just do your best!
          </p>
          <button className="primary-btn big" onClick={() => setStarted(true)}>
            Start
          </button>
          <button className="ghost-btn" onClick={() => place(1)}>
            Skip — start at Level 1
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
        <button className="ghost-btn" onClick={() => place(1)}>
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
