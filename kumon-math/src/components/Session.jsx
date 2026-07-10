import { useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateSet } from '../lib/problems.js'
import { getSubject, getSubjectLevel } from '../data/subjects.js'
import ProblemView from './ProblemView.jsx'
import Keypad from './Keypad.jsx'
import HandwritingInput from './HandwritingInput.jsx'
import { playCorrect, playWrong } from '../lib/sound.js'

export default function Session({ profile, subjectId, levelId, onFinish, onQuit }) {
  const { state, finishSet, setInputMode } = useApp()
  const subject = getSubject(subjectId)
  const level = getSubjectLevel(subjectId, levelId)
  const thresholds = state.settings.thresholds?.[subjectId]?.[levelId] || {}
  const setSize = thresholds.problems ?? level.defaultProblems

  const problems = useMemo(
    () => generateSet(subjectId, levelId, setSize, profile.subjects[subjectId].missedQueue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjectId, levelId, setSize],
  )

  const [index, setIndex] = useState(0)
  const [inputMode, setMode] = useState(profile.inputMode)
  const [feedback, setFeedback] = useState(null)
  const [rewritePrompt, setRewritePrompt] = useState(false)

  const [keypadValue, setKeypadValue] = useState('')
  const [hwPayload, setHwPayload] = useState({ value: '', unsure: false, filledCount: 0 })
  const [choiceValue, setChoiceValue] = useState('')

  const results = useRef([])
  const startTime = useRef(null)
  const advancing = useRef(false)
  const recog = useRef({ corrections: 0, recognized: 0 })

  const problem = problems[index]
  const isChoice = problem.answerType === 'choice'
  const needsKeypad = !!problem.needsKeypad
  const canHandwrite = subject.numeric && !isChoice && !needsKeypad
  const expectedLength = problem.answer.replace(/[^0-9]/g, '').length || 1

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
    if (isChoice) return choiceValue
    if (inputMode === 'keypad' || needsKeypad) return keypadValue
    return hwPayload.value
  }

  function grade(given) {
    if (isChoice) return given === problem.answer
    if (given === '') return false
    return Number(given) === Number(problem.answer)
  }

  function onCheck() {
    if (advancing.current) return
    const given = currentGiven()
    const usingHandwriting = canHandwrite && inputMode === 'handwriting'

    if (given === '' || (usingHandwriting && hwPayload.filledCount === 0)) return
    if (usingHandwriting && hwPayload.unsure) {
      setRewritePrompt(true)
      return
    }

    // Timer starts on the first submitted answer — never shown mid-set.
    if (startTime.current === null) startTime.current = Date.now()
    if (usingHandwriting) recog.current.recognized += hwPayload.filledCount

    const correct = grade(given)
    results.current.push({ problem, given, correct })
    if (correct) playCorrect()
    else playWrong()
    setFeedback(correct ? 'correct' : 'wrong')

    advancing.current = true
    setTimeout(() => {
      advancing.current = false
      setFeedback(null)
      if (index + 1 >= problems.length) finalize()
      else {
        setIndex((i) => i + 1)
        resetInputs()
      }
    }, 300)
  }

  function finalize() {
    const timeMs = startTime.current ? Date.now() - startTime.current : 0
    const result = finishSet(profile.id, subjectId, levelId, {
      results: results.current,
      timeMs,
      recognition: recog.current,
    })
    onFinish(result)
  }

  const progress = (index / problems.length) * 100
  const showToggle = canHandwrite

  return (
    <div
      className={`screen session ${subject.numeric ? '' : 'quiz-session'} ${feedback ? `flash-${feedback}` : ''}`}
      style={{ '--accent': subject.color }}
    >
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
        {showToggle ? (
          <button className="mode-toggle" onClick={toggleMode} title="Switch input">
            {inputMode === 'handwriting' ? '⌨️' : '✏️'}
          </button>
        ) : (
          <span style={{ width: 44 }} />
        )}
      </header>

      <main className={`problem-stage ${subject.numeric ? '' : 'quiz-stage'}`}>
        <ProblemView problem={problem} />
      </main>

      <section className="input-stage">
        {isChoice ? (
          <ChoiceInput
            choices={problem.choices}
            value={choiceValue}
            onPick={setChoiceValue}
            textChoices={!!problem.textChoices}
          />
        ) : canHandwrite && inputMode === 'handwriting' ? (
          <HandwritingInput
            key={problem.uid}
            expectedLength={expectedLength}
            confidenceThreshold={state.settings.confidenceThreshold}
            onChange={setHwPayload}
            onCorrection={() => (recog.current.corrections += 1)}
            // Stay in handwriting even if the model can't load — the kid can tap
            // the corner toggle to switch to the keypad if they want.
          />
        ) : (
          <Keypad
            value={keypadValue}
            onChange={setKeypadValue}
            maxLen={needsKeypad ? 6 : expectedLength}
            allowDecimal={needsKeypad}
          />
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

function ChoiceInput({ choices, value, onPick, textChoices }) {
  const symbolLabels = { '<': 'less than', '=': 'equal', '>': 'greater than' }
  if (textChoices) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    return (
      <div className="choice-input text">
        {choices.map((c, i) => (
          <button
            key={c}
            className={`text-choice ${value === c ? 'selected' : ''}`}
            onClick={() => onPick(c)}
          >
            <span className="choice-letter">{letters[i]}</span>
            <span className="choice-text-label">{c}</span>
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="choice-input">
      {choices.map((c) => (
        <button
          key={c}
          className={`choice-btn ${value === c ? 'selected' : ''}`}
          onClick={() => onPick(c)}
          aria-label={symbolLabels[c] || c}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
