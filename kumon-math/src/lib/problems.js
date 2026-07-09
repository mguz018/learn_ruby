// Problem generators. Math levels are generated fresh every time; Reading /
// History / Science levels draw from curated banks. Both produce the same
// problem shape so the drill engine treats them uniformly.
//
// Problem shape:
// {
//   uid, subjectId, levelId,
//   op,                 // '+','-','×','÷','fraction','expr','quiz'
//   display,            // { type, ...fields } — how ProblemView renders it
//   answer,             // canonical answer as a string
//   answerType,         // 'number' | 'choice'
//   choices,            // for answerType 'choice'
//   textChoices,        // true when choices are words/phrases (stacked buttons)
//   needsKeypad,        // true when a numeric answer isn't plain digits (decimals)
//   factKey,            // stable key for struggle detection
// }

import { getSubjectLevel } from '../data/subjects.js'

let counter = 0
function uid() {
  counter += 1
  return `p${counter}_${(counter * 2654435761) % 100000}`
}
function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function arith(a, b, op, answer, factKey) {
  return {
    uid: uid(),
    subjectId: 'math',
    op,
    display: { type: 'horizontal', a, b, op },
    answer: String(answer),
    answerType: 'number',
    factKey,
  }
}
function expr(text, answer, factKey, opts = {}) {
  return {
    uid: uid(),
    subjectId: 'math',
    op: 'expr',
    display: { type: 'expression', text, equals: opts.equals !== false, instruction: !!opts.instruction },
    answer: String(answer),
    answerType: 'number',
    needsKeypad: /[.]/.test(String(answer)),
    factKey,
  }
}

// ---- Basic math (levels 1-11) ----------------------------------------------

function addWithin10() {
  const a = rnd(0, 9)
  const b = rnd(0, 10 - a)
  return arith(a, b, '+', a + b, `${Math.min(a, b)}+${Math.max(a, b)}`)
}
function addWithin20() {
  let a, b
  do {
    a = rnd(2, 18)
    b = rnd(2, 20 - a)
  } while (a + b <= 10)
  return arith(a, b, '+', a + b, `${Math.min(a, b)}+${Math.max(a, b)}`)
}
function add2DigitNoRegroup() {
  const aOnes = rnd(0, 8)
  const bOnes = rnd(0, 9 - aOnes)
  const aTens = rnd(1, 8)
  const bTens = rnd(1, 9 - aTens)
  const a = aTens * 10 + aOnes
  const b = bTens * 10 + bOnes
  return arith(a, b, '+', a + b, 'add: no carry')
}
function add2DigitRegroup() {
  let a, b
  do {
    a = rnd(15, 89)
    b = rnd(15, 89)
  } while ((a % 10) + (b % 10) < 10)
  return arith(a, b, '+', a + b, 'add: carry')
}
function subWithin20() {
  const a = rnd(2, 20)
  const b = rnd(0, a)
  return arith(a, b, '-', a - b, `${a}-${b}`)
}
function sub2DigitRegroup() {
  let a, b
  do {
    a = rnd(21, 99)
    b = rnd(11, a - 1)
  } while (a % 10 >= b % 10)
  const acrossZero = a % 10 === 0
  return arith(a, b, '-', a - b, acrossZero ? 'sub: borrow across zero' : 'sub: borrow')
}
function multRange(tables) {
  const a = pick(tables)
  const b = rnd(1, 12)
  return arith(a, b, '×', a * b, `${Math.min(a, b)}×${Math.max(a, b)}`)
}
const mult2to5 = () => multRange([2, 3, 4, 5])
const mult6to9 = () => multRange([6, 7, 8, 9])
function mixedMultDiv() {
  const a = rnd(2, 9)
  const b = rnd(2, 9)
  if (Math.random() < 0.5) return arith(a, b, '×', a * b, `${Math.min(a, b)}×${Math.max(a, b)}`)
  const product = a * b
  return arith(product, a, '÷', b, `${product}÷${a}`)
}
function multiDigitMult() {
  const a = rnd(12, 99)
  const b = rnd(2, 9)
  return arith(a, b, '×', a * b, `2-digit × ${b}`)
}

// fractions (level 11)
function fractionAdd() {
  const denom = rnd(3, 9)
  const n1 = rnd(1, denom - 2)
  const n2 = rnd(1, denom - n1)
  return {
    uid: uid(), subjectId: 'math', op: 'fraction',
    display: { type: 'fraction-add', n1, n2, denom },
    answer: String(n1 + n2), answerType: 'number', factKey: 'fraction: add',
  }
}
function fractionCompare() {
  const denom = rnd(3, 9)
  const n1 = rnd(1, denom)
  const n2 = rnd(1, denom)
  const answer = n1 < n2 ? '<' : n1 > n2 ? '>' : '='
  return {
    uid: uid(), subjectId: 'math', op: 'fraction',
    display: { type: 'fraction-compare', n1, n2, denom },
    answer, answerType: 'choice', choices: ['<', '=', '>'], factKey: 'fraction: compare',
  }
}
function fractionIdentify() {
  const denom = rnd(2, 8)
  const shaded = rnd(1, denom)
  return {
    uid: uid(), subjectId: 'math', op: 'fraction',
    display: { type: 'fraction-identify', denom, shaded },
    answer: String(shaded), answerType: 'number', factKey: 'fraction: identify',
  }
}
const fractions = () => pick([fractionAdd, fractionCompare, fractionIdentify])()

// ---- Advanced math (levels 12-20) ------------------------------------------

function mult2x2() {
  const a = rnd(11, 99)
  const b = rnd(11, 99)
  return arith(a, b, '×', a * b, '2-digit × 2-digit')
}
function longDivision() {
  const d = rnd(3, 9)
  const q = rnd(12, 140)
  const dividend = d * q
  return arith(dividend, d, '÷', q, `long division ÷${d}`)
}
function orderOfOps() {
  const a = rnd(2, 9)
  const b = rnd(2, 9)
  const c = rnd(2, 9)
  const forms = [
    { text: `${a} + ${b} × ${c}`, val: a + b * c },
    { text: `${a} × ${b} + ${c}`, val: a * b + c },
    { text: `${a} × ${b} − ${c}`, val: a * b - c },
    { text: `${b * c} ÷ ${c} + ${a}`, val: b + a },
  ]
  const f = pick(forms.filter((x) => x.val >= 0))
  return expr(f.text, f.val, 'order of operations')
}
function fractionOfNumber() {
  const d = rnd(2, 6)
  const n = rnd(1, d - 1)
  const whole = d * rnd(2, 12)
  return expr(`${n}⁄${d} of ${whole}`, (n / d) * whole, `fraction of a number`)
}
function percentOf() {
  const p = pick([10, 20, 25, 50, 5, 40, 75, 30, 60])
  const base = pick([20, 40, 60, 80, 100, 120, 200, 50, 160])
  const val = (p / 100) * base
  if (!Number.isInteger(val)) return percentOf()
  return expr(`${p}% of ${base}`, val, `percent of a number`)
}
function exponents() {
  if (Math.random() < 0.65) {
    const b = rnd(2, 15)
    return {
      uid: uid(), subjectId: 'math', op: 'expr',
      display: { type: 'power', base: b, exp: 2 },
      answer: String(b * b), answerType: 'number', factKey: 'squares',
    }
  }
  const b = rnd(2, 6)
  return {
    uid: uid(), subjectId: 'math', op: 'expr',
    display: { type: 'power', base: b, exp: 3 },
    answer: String(b ** 3), answerType: 'number', factKey: 'cubes',
  }
}
function rounding() {
  const toHundred = Math.random() < 0.5
  const n = toHundred ? rnd(120, 4980) : rnd(12, 989)
  const place = toHundred ? 100 : 10
  const answer = Math.round(n / place) * place
  return expr(`Round ${n} to the nearest ${toHundred ? 'hundred' : 'ten'}`, answer, 'rounding', {
    equals: false,
    instruction: true,
  })
}
function decimalAddSub() {
  const a10 = rnd(5, 95)
  const b10 = rnd(5, 95)
  const plus = Math.random() < 0.5 || b10 > a10 ? true : Math.random() < 0.5
  let res10
  let op
  if (plus) {
    op = '+'
    res10 = a10 + b10
  } else {
    op = '-'
    res10 = a10 - b10
  }
  const a = a10 / 10
  const b = b10 / 10
  const answer = res10 / 10
  return {
    uid: uid(), subjectId: 'math', op,
    display: { type: 'horizontal', a: a.toFixed(1), b: b.toFixed(1), op },
    answer: String(answer), answerType: 'number', needsKeypad: true, factKey: 'decimals',
  }
}
function meanAverage() {
  const k = rnd(3, 4)
  const mean = rnd(3, 20)
  // Build k numbers that average to `mean` and are all positive.
  const nums = []
  let remaining = mean * k
  for (let i = 0; i < k - 1; i += 1) {
    const lo = Math.max(1, remaining - (k - 1 - i) * (mean * 2))
    const hi = Math.min(mean * 2, remaining - (k - 1 - i))
    const v = rnd(lo, Math.max(lo, hi))
    nums.push(v)
    remaining -= v
  }
  nums.push(remaining)
  return expr(`Mean of ${shuffle(nums).join(', ')}`, mean, 'averages', { equals: false, instruction: true })
}

// ---- Bank questions (Reading / History / Science) --------------------------

function bankProblem(subjectId, levelId, pool) {
  const item = pick(pool)
  return {
    uid: uid(),
    subjectId,
    levelId,
    op: 'quiz',
    display: { type: 'question', prompt: item.q, passage: item.passage || null },
    choices: shuffle(item.choices),
    answer: item.answer,
    answerType: 'choice',
    textChoices: true,
    factKey: item.topic || 'general',
  }
}

// ---- Registry & public API -------------------------------------------------

const GENERATORS = {
  addWithin10, addWithin20, add2DigitNoRegroup, add2DigitRegroup,
  subWithin20, sub2DigitRegroup, mult2to5, mult6to9, mixedMultDiv,
  multiDigitMult, fractions, mult2x2, longDivision, orderOfOps,
  fractionOfNumber, percentOf, exponents, rounding, decimalAddSub, meanAverage,
}

export function generateProblem(subjectId, levelId) {
  const level = getSubjectLevel(subjectId, levelId)
  let p
  if (level.gen) {
    p = GENERATORS[level.gen]()
  } else {
    p = bankProblem(subjectId, levelId, level.pool)
  }
  p.subjectId = subjectId
  p.levelId = levelId
  return p
}

export function generateSet(subjectId, levelId, count, missed = []) {
  const set = []
  const reviewCap = Math.max(0, Math.min(missed.length, Math.ceil(count / 3)))
  for (let i = 0; i < reviewCap; i += 1) {
    set.push({ ...missed[i], uid: uid(), review: true })
  }

  let guard = 0
  const usedKeys = new Set(set.map(problemKey))
  while (set.length < count && guard < count * 60) {
    guard += 1
    const p = generateProblem(subjectId, levelId)
    const key = problemKey(p)
    // Avoid duplicates within a set (until the bank/pool is exhausted).
    if (usedKeys.has(key) && usedKeys.size < count * 3) continue
    if (set.length > 0 && problemKey(set[set.length - 1]) === key) continue
    set.push(p)
    usedKeys.add(key)
  }
  return set
}

export function problemKey(p) {
  const d = p.display
  if (d.type === 'horizontal') return `${d.a}${d.op}${d.b}`
  if (d.type === 'expression') return `e:${d.text}`
  if (d.type === 'power') return `pw:${d.base}^${d.exp}`
  if (d.type === 'fraction-add') return `fa:${d.n1}/${d.denom}+${d.n2}/${d.denom}`
  if (d.type === 'fraction-compare') return `fc:${d.n1}/${d.denom}?${d.n2}/${d.denom}`
  if (d.type === 'fraction-identify') return `fi:${d.shaded}/${d.denom}`
  // Include the answer so questions that share a prompt (e.g. several "Which
  // word is spelled correctly?" items) are treated as distinct.
  if (d.type === 'question') return `q:${d.prompt}|${p.answer}`
  return p.uid
}
