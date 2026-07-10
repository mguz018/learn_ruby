// Renders the current problem large and centered. The problem dominates the
// screen — no timer, no hints.

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

  if (d.type === 'expression') {
    return (
      <div className={`problem expression ${d.instruction ? 'instruction' : ''}`}>
        <span className="expr-text">{d.text}</span>
        {d.equals && (
          <>
            <span className="equals"> = </span>
            <span className="answer-slot">?</span>
          </>
        )}
      </div>
    )
  }

  if (d.type === 'power') {
    return (
      <div className="problem horizontal">
        <span className="operand">
          {d.base}
          <sup className="exponent">{d.exp}</sup>
        </span>
        <span className="equals">=</span>
        <span className="answer-slot">?</span>
      </div>
    )
  }

  if (d.type === 'sqrt') {
    return (
      <div className="problem horizontal">
        <span className="sqrt-sign">√</span>
        <span className="operand sqrt-radicand">{d.n}</span>
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

  if (d.type === 'question') {
    return (
      <div className="problem quiz">
        {d.passage && <div className="passage">{d.passage}</div>}
        <div className="quiz-prompt">{d.prompt}</div>
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
