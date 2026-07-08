// Big, touch-friendly numeric keypad — the fallback input mode.

export default function Keypad({ value, onChange, maxLen = 4 }) {
  const press = (digit) => {
    if (value.length >= maxLen) return
    onChange(value + digit)
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
        <button className="key key-fn" onClick={clear} aria-label="Clear">
          C
        </button>
        <button className="key" onClick={() => press('0')}>
          0
        </button>
        <button className="key key-fn" onClick={back} aria-label="Backspace">
          ⌫
        </button>
      </div>
    </div>
  )
}
