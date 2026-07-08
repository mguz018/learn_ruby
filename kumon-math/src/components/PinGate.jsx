import { useState } from 'react'

export default function PinGate({ expected, onUnlock, onCancel }) {
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)

  function press(d) {
    if (entry.length >= 6) return
    const next = entry + d
    setEntry(next)
    setError(false)
    if (next.length >= String(expected).length && next === String(expected)) {
      onUnlock()
    }
  }

  function check() {
    if (entry === String(expected)) onUnlock()
    else {
      setError(true)
      setEntry('')
    }
  }

  return (
    <div className="screen pin-gate">
      <button className="ghost-btn back-corner" onClick={onCancel}>
        ‹ Back
      </button>
      <div className="pin-card">
        <div className="pin-lock">🔒</div>
        <h1>Grown-ups only</h1>
        <p>Enter the PIN</p>
        <div className={`pin-dots ${error ? 'error' : ''}`}>
          {Array.from({ length: Math.max(4, entry.length) }).map((_, i) => (
            <span key={i} className={`pin-dot ${i < entry.length ? 'filled' : ''}`} />
          ))}
        </div>
        {error && <div className="pin-error">Wrong PIN — try again</div>}
        <div className="keypad-grid pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
            <button key={k} className="key" onClick={() => press(k)}>
              {k}
            </button>
          ))}
          <button className="key key-fn" onClick={() => setEntry('')}>
            C
          </button>
          <button className="key" onClick={() => press('0')}>
            0
          </button>
          <button className="key key-fn" onClick={check}>
            ✓
          </button>
        </div>
        <p className="pin-hint">Default PIN is 1234 (change it inside)</p>
      </div>
    </div>
  )
}
