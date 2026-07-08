// Big, touch-friendly numeric keypad — the fallback input mode (and the required
// mode for decimal answers, where a per-digit handwriting box doesn't fit).

export default function Keypad({ value, onChange, maxLen = 4, allowDecimal = false }) {
  const press = (digit) => {
    if (value.length >= maxLen) return
    onChange(value + digit)
  }
  const dot = () => {
    if (value.includes('.') || value === '' || value.length >= maxLen) return
    onChange(value + '.')
  }
  const back = () => onChange(value.slice(0, -1))
  const clear = () => onChange('')

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="keypad">
      <div className="keypad-display">
        <span className={value ? 'kd-value' : 'kd-placeholder'}>{value || 'Type your answer'}</span>
      </div>
      <div className="keypad-grid">
        {keys.map((k) => (
          <button key={k} className="key" onClick={() => press(k)}>
            {k}
          </button>
        ))}
        {allowDecimal ? (
          <button className="key" onClick={dot} aria-label="Decimal point">
            .
          </button>
        ) : (
          <button className="key key-fn" onClick={clear} aria-label="Clear">
            C
          </button>
        )}
        <button className="key" onClick={() => press('0')}>
          0
        </button>
        {allowDecimal ? (
          <button className="key key-fn" onClick={back} aria-label="Backspace">
            ⌫
          </button>
        ) : (
          <button className="key key-fn" onClick={back} aria-label="Backspace">
            ⌫
          </button>
        )}
      </div>
      {allowDecimal && (
        <button className="key-clear-row" onClick={clear}>
          Clear
        </button>
      )}
    </div>
  )
}
