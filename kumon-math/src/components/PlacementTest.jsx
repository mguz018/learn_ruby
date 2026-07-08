import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateProblem } from '../lib/problems.js'
import { MAX_LEVEL, getLevel } from '../data/levels.js'
import ProblemView from './ProblemView.jsx'
import Keypad from './Keypad.jsx'

// Quick mixed quiz: one problem per level, climbing until the first miss, which
// places the kid at that level. Pass everything -> top level.
export default function PlacementTest({ profile, onDone, onHome }) {
  const { setPlacement } = useApp()
  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [problem, setProblem] = useState(() => generateProblem(1))
  const [value, setValue] = useState('')
  const [choice, setChoice] = useState('')
  const [count, setCount] = useState(0)

  function place(atLevel) {
    setPlacement(profile.id, Math.max(1, Math.min(MAX_LEVEL, atLevel)))
    onDone()
  }

  function submit() {
    const given = problem.answerType === 'choice' ? choice : value
    if (given === '') return
    const correct =
      problem.answerType === 'choice' ? given === problem.answer : Number(given) === Number(problem.answer)

    if (!correct) {
      // First miss — start them here.
      place(level)
      return
    }
    const nextLevel = level + 1
    setCount((c) => c + 1)
    if (nextLevel > MAX_LEVEL) {
      place(MAX_LEVEL)
      return
    }
    setLevel(nextLevel)
    setProblem(generateProblem(nextLevel))
    setValue('')
    setChoice('')
  }

  if (!started) {
    return (
      <div className="screen placement intro" style={{ '--accent': profile.color }}>
        <button className="ghost-btn back-corner" onClick={onHome}>
          ‹ Home
        </button>
        <div className="placement-card">
          <div className="summary-avatar">{profile.avatar}</div>
          <h1>Hi {profile.name}! 👋</h1>
          <p>Let’s find your starting belt with a few quick questions. Just do your best!</p>
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
    <div className="screen placement" style={{ '--accent': profile.color }}>
      <header className="session-head">
        <button className="ghost-btn" onClick={() => place(1)}>
          ✕
        </button>
        <div className="placement-label">Finding your level… (Q{count + 1})</div>
        <span style={{ width: 44 }} />
      </header>

      <main className="problem-stage">
        <ProblemView problem={problem} />
      </main>

      <section className="input-stage">
        {problem.answerType === 'choice' ? (
          <div className="choice-input">
            {problem.choices.map((c) => (
              <button
                key={c}
                className={`choice-btn ${choice === c ? 'selected' : ''}`}
                onClick={() => setChoice(c)}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <Keypad value={value} onChange={setValue} maxLen={problem.answer.length} />
        )}
        <button className="check-btn" onClick={submit}>
          Check ✓
        </button>
      </section>
    </div>
  )
}
