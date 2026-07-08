// Renders the current problem large and centered. The problem should dominate
// the screen — no timer, no hints, no clutter.

export default function ProblemView({ problem }) {
  const d = problem.display

  if (d.type === 'horizontal') {
    return (
      <div className="problem horizontal">
        <span className="operand">{d.a}</span>
        <span className="operator">{d.op}</span>
        <span className="operand">{d.b}</span>
        <span className="equals">=</span>
        <span className="answer-slot">?</span>
      </div>
    )
  }

  if (d.type === 'fraction-add') {
    return (
      <div className="problem fraction-row">
        <Fraction n={d.n1} d={d.denom} />
        <span className="operator">+</span>
        <Fraction n={d.n2} d={d.denom} />
        <span className="equals">=</span>
        <div className="answer-fraction">
          <span className="answer-slot small">?</span>
          <span className="frac-bar" />
          <span className="frac-denom">{d.denom}</span>
        </div>
      </div>
    )
  }

  if (d.type === 'fraction-compare') {
    return (
      <div className="problem fraction-row">
        <Fraction n={d.n1} d={d.denom} />
        <span className="operator">?</span>
        <Fraction n={d.n2} d={d.denom} />
      </div>
    )
  }

  if (d.type === 'fraction-identify') {
    return (
      <div className="problem identify">
        <FractionBar denom={d.denom} shaded={d.shaded} />
        <div className="identify-prompt">
          How many parts are shaded? <span className="of-denom">(out of {d.denom})</span>
        </div>
      </div>
    )
  }

  return null
}

function Fraction({ n, d }) {
  return (
    <span className="frac">
      <span className="frac-num">{n}</span>
      <span className="frac-bar" />
      <span className="frac-denom">{d}</span>
    </span>
  )
}

function FractionBar({ denom, shaded }) {
  return (
    <div className="fraction-bar" role="img" aria-label={`${shaded} of ${denom} parts shaded`}>
      {Array.from({ length: denom }).map((_, i) => (
        <span key={i} className={`fb-cell ${i < shaded ? 'on' : ''}`} />
      ))}
    </div>
  )
}
