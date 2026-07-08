import { useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateSet } from '../lib/problems.js'
import { getLevel } from '../data/levels.js'
import ProblemView from './ProblemView.jsx'
import Keypad from './Keypad.jsx'
import HandwritingInput from './HandwritingInput.jsx'
import { playCorrect, playWrong } from '../lib/sound.js'

export default function Session({ profile, levelId, onFinish, onQuit }) {
  const { state, finishSet, setInputMode } = useApp()
  const level = getLevel(levelId)
  const thresholds = state.settings.perLevel[levelId] || {}
  const setSize = thresholds.problems ?? level.defaultProblems

  const problems = useMemo(
    () => generateSet(levelId, setSize, profile.missedQueue),
    // Regenerate only when the level/size changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelId, setSize],
  )

  const [index, setIndex] = useState(0)
  const [inputMode, setMode] = useState(profile.inputMode)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [rewritePrompt, setRewritePrompt] = useState(false)

  // Per-problem input state.
  const [keypadValue, setKeypadValue] = useState('')
  const [hwPayload, setHwPayload] = useState({ value: '', unsure: false, filledCount: 0 })
  const [choiceValue, setChoiceValue] = useState('')

  const results = useRef([])
  const startTime = useRef(null)
  const advancing = useRef(false)
  const recog = useRef({ corrections: 0, recognized: 0 })

  const problem = problems[index]
  const expectedLength = problem.answer.replace('-', '').length

  function resetInputs() {
    setKeypadValue('')
    setHwPayload({ value: '', unsure: false, filledCount: 0 })
    setChoiceValue('')
    setRewritePrompt(false)
  }

  function toggleMode() {
    const next = inputMode === 'handwriting' ? 'keypad' : 'handwriting'
    setMode(next)
    setInputMode(profile.id, next)
    resetInputs()
  }

  function currentGiven() {
    if (problem.answerType === 'choice') return choiceValue
    if (inputMode === 'keypad') return keypadValue
    return hwPayload.value
  }

  function grade(given) {
    if (problem.answerType === 'choice') return given === problem.answer
    if (given === '') return false
    return Number(given) === Number(problem.answer)
  }

  function onCheck() {
    if (advancing.current) return
    const given = currentGiven()

    // Nothing entered yet — ignore.
    if (given === '' || (problem.answerType === 'number' && inputMode === 'handwriting' && hwPayload.filledCount === 0)) {
      return
    }
    // Unsure handwriting — ask for a rewrite rather than guessing.
    if (inputMode === 'handwriting' && problem.answerType === 'number' && hwPayload.unsure) {
      setRewritePrompt(true)
      return
    }

    // Timer starts on the first submitted answer (silent — never shown mid-set).
    if (startTime.current === null) startTime.current = Date.now()

    // Recognition stats for parent tuning.
    if (inputMode === 'handwriting' && problem.answerType === 'number') {
      recog.current.recognized += hwPayload.filledCount
    }

    const correct = grade(given)
    results.current.push({ problem, given, correct })
    if (correct) playCorrect()
    else playWrong()
    setFeedback(correct ? 'correct' : 'wrong')

    advancing.current = true
    setTimeout(() => {
      advancing.current = false
      setFeedback(null)
      if (index + 1 >= problems.length) {
        finalize()
      } else {
        setIndex((i) => i + 1)
        resetInputs()
      }
    }, 300)
  }

  function finalize() {
    const timeMs = startTime.current ? Date.now() - startTime.current : 0
    const result = finishSet(profile.id, levelId, {
      results: results.current,
      timeMs,
      recognition: recog.current,
    })
    onFinish(result)
  }

  const progress = ((index) / problems.length) * 100

  return (
    <div className={`screen session ${feedback ? `flash-${feedback}` : ''}`} style={{ '--accent': profile.color }}>
      <header className="session-head">
        <button className="ghost-btn" onClick={onQuit}>
          ✕ Quit
        </button>
        <div className="progress-track" aria-label={`Problem ${index + 1} of ${problems.length}`}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span className="progress-text">
            {index + 1} / {problems.length}
          </span>
        </div>
        <button className="mode-toggle" onClick={toggleMode} title="Switch input">
          {inputMode === 'handwriting' ? '⌨️' : '✏️'}
        </button>
      </header>

      <main className="problem-stage">
        <ProblemView problem={problem} />
      </main>

      <section className="input-stage">
        {problem.answerType === 'choice' ? (
          <ChoiceInput choices={problem.choices} value={choiceValue} onPick={setChoiceValue} />
        ) : inputMode === 'handwriting' ? (
          <HandwritingInput
            key={problem.uid}
            expectedLength={expectedLength}
            modelUrl={state.settings.modelUrl}
            confidenceThreshold={state.settings.confidenceThreshold}
            onChange={setHwPayload}
            onCorrection={() => (recog.current.corrections += 1)}
            onModelFailed={() => {
              // Auto-fall back to keypad so the child is never stuck.
              setMode('keypad')
              setInputMode(profile.id, 'keypad')
            }}
          />
        ) : (
          <Keypad value={keypadValue} onChange={setKeypadValue} maxLen={expectedLength} />
        )}

        {rewritePrompt && (
          <div className="rewrite-prompt">Hmm, one number is hard to read — please rewrite the yellow box.</div>
        )}

        <button className="check-btn" onClick={onCheck}>
          Check ✓
        </button>
      </section>
    </div>
  )
}

function ChoiceInput({ choices, value, onPick }) {
  const labels = { '<': 'less than', '=': 'equal', '>': 'greater than' }
  return (
    <div className="choice-input">
      {choices.map((c) => (
        <button
          key={c}
          className={`choice-btn ${value === c ? 'selected' : ''}`}
          onClick={() => onPick(c)}
          aria-label={labels[c] || c}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
