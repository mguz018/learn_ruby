import { useEffect, useRef, useState } from 'react'
import DigitBox from './DigitBox.jsx'
import { loadRecognizer, recognizeDigit, isReady } from '../lib/recognition.js'

// Arranges one box per expected digit, loads the recognizer, assembles the
// per-box results into an answer string, and reports recognition stats up.
export default function HandwritingInput({
  expectedLength,
  modelUrl,
  confidenceThreshold,
  onChange,
  onCorrection,
  onModelFailed,
}) {
  const boxCount = Math.max(1, Math.min(expectedLength, 4))
  const [ready, setReady] = useState(isReady())
  const [loadError, setLoadError] = useState(false)
  const results = useRef(new Array(boxCount).fill(null))
  const prev = useRef(new Array(boxCount).fill(null))

  useEffect(() => {
    let cancelled = false
    if (isReady()) {
      setReady(true)
      return
    }
    loadRecognizer(modelUrl)
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch((err) => {
        console.warn('Recognizer failed to load:', err)
        if (!cancelled) {
          setLoadError(true)
          onModelFailed?.(err)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl])

  function handleResult(index, res) {
    const before = prev.current[index]
    // A "correction" is when a box that had been read as a digit is changed or
    // cleared — the signal we track to know how well handwriting is working.
    if (before && (!res || res.digit !== before.digit)) {
      onCorrection?.()
    }
    prev.current[index] = res
    results.current[index] = res
    emit()
  }

  function emit() {
    const filled = results.current.filter(Boolean)
    const value = filled.map((r) => r.digit).join('')
    const unsure = filled.some((r) => r.confidence < confidenceThreshold)
    onChange?.({ value, unsure, filledCount: filled.length })
  }

  if (loadError) {
    return (
      <div className="hw-fallback-note">
        Handwriting model couldn’t load. Switching to the number pad is recommended.
      </div>
    )
  }

  return (
    <div className="handwriting">
      {!ready && (
        <div className="hw-loading">
          <span className="spinner" /> Warming up handwriting…
        </div>
      )}
      <div className={`digit-boxes ${ready ? '' : 'dim'}`}>
        {Array.from({ length: boxCount }).map((_, i) => (
          <DigitBox
            key={i}
            index={i}
            disabled={!ready}
            recognizeFn={recognizeDigit}
            confidenceThreshold={confidenceThreshold}
            onResult={handleResult}
          />
        ))}
      </div>
      <p className="hw-hint">Write one number in each box ✏️</p>
    </div>
  )
}
