import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Module-level count of active pen pointers, shared across every box. While a
// pen is down anywhere, touch input (a resting palm) is ignored on all boxes.
let activePens = 0

const BACK_W = 150
const BACK_H = 190
const RECOGNIZE_DEBOUNCE = 400 // ms — wait for multi-stroke digits (4, 5) to finish

// One answer box: one handwritten digit. Recognized independently — never
// freeform multi-digit segmentation.
const DigitBox = forwardRef(function DigitBox(
  { index, recognizeFn, confidenceThreshold, onResult, disabled },
  ref,
) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const activePointerId = useRef(null)
  const debounceTimer = useRef(null)
  const hasInk = useRef(false)
  const [result, setResult] = useState(null) // { digit, confidence }

  useImperativeHandle(ref, () => ({
    clear: () => clearBox(),
    hasInk: () => hasInk.current,
    getResult: () => result,
  }))

  useEffect(() => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1e293b'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pos(e) {
    const c = canvasRef.current
    const rect = c.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height,
    }
  }

  function onPointerDown(e) {
    if (disabled) return
    // Palm rejection: ignore touch while any pen is active.
    if (e.pointerType === 'touch' && activePens > 0) return
    if (drawing.current) return

    if (e.pointerType === 'pen') activePens += 1
    drawing.current = true
    activePointerId.current = e.pointerId
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (_) {
      /* not supported — ignore */
    }
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    // A dot so a single tap registers.
    ctx.lineTo(x + 0.1, y + 0.1)
    ctx.stroke()
    hasInk.current = true
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    e.preventDefault()
  }

  function onPointerMove(e) {
    if (!drawing.current || e.pointerId !== activePointerId.current) return
    if (e.pointerType === 'touch' && activePens > 0 && e.pointerId !== activePointerId.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    e.preventDefault()
  }

  function endStroke(e) {
    if (e.pointerId !== activePointerId.current) return
    if (e.pointerType === 'pen' && activePens > 0) activePens -= 1
    drawing.current = false
    activePointerId.current = null
    // Debounce so multi-stroke digits aren't recognized mid-writing.
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(runRecognition, RECOGNIZE_DEBOUNCE)
  }

  function runRecognition() {
    if (!recognizeFn) return
    const res = recognizeFn(canvasRef.current)
    setResult(res)
    onResult?.(index, res)
  }

  function clearBox() {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, c.width, c.height)
    hasInk.current = false
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setResult(null)
    onResult?.(index, null)
  }

  const lowConfidence = result && result.confidence < confidenceThreshold
  const boxClass = [
    'digit-box',
    result ? 'has-digit' : '',
    lowConfidence ? 'low-confidence' : '',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="digit-box-wrap">
      <div className={boxClass}>
        <canvas
          ref={canvasRef}
          width={BACK_W}
          height={BACK_H}
          className="digit-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={endStroke}
          style={{ touchAction: 'none' }}
        />
        <button
          type="button"
          className="box-clear"
          onClick={clearBox}
          aria-label={`Clear box ${index + 1}`}
        >
          ⌫
        </button>
      </div>
      <div className={`read-digit ${lowConfidence ? 'unsure' : ''}`}>
        {result ? (lowConfidence ? '?' : result.digit) : '·'}
      </div>
    </div>
  )
})

export default DigitBox
