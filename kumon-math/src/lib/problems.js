// Problem generators — one per level. Problems are ALWAYS generated fresh,
// never hardcoded, so repeating a level gives a new set every time.
//
// Problem shape:
// {
//   uid:        unique per instance (for React keys / dedupe)
//   levelId:    number
//   op:         '+', '-', '×', '÷', or 'fraction'
//   display:    { type, ...fields } — how ProblemView renders it
//   answer:     canonical answer as a string ('12', '<', ...)
//   answerType: 'number' | 'choice'
//   choices:    array (only for answerType === 'choice')
//   factKey:    stable key for struggle detection ('7×8', 'sub: borrow across zero', ...)
// }

let counter = 0
function uid() {
  counter += 1
  return `p${Date.now().toString(36)}_${counter}`
}

function rnd(min, max) {
  // inclusive integer in [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function arith(levelId, a, b, op, answer, factKey) {
  return {
    uid: uid(),
    levelId,
    op,
    display: { type: 'horizontal', a, b, op },
    answer: String(answer),
    answerType: 'number',
    factKey,
  }
}

// ---- Level generators -------------------------------------------------------

function addWithin10() {
  const a = rnd(0, 9)
  const b = rnd(0, 10 - a)
  return arith(1, a, b, '+', a + b, `${Math.min(a, b)}+${Math.max(a, b)}`)
}

function addWithin20() {
  // Bias toward sums that cross 10 (the actual new skill).
  let a, b
  do {
    a = rnd(2, 18)
    b = rnd(2, 20 - a)
  } while (a + b <= 10)
  return arith(2, a, b, '+', a + b, `${Math.min(a, b)}+${Math.max(a, b)}`)
}

function digits(n) {
  return { tens: Math.floor(n / 10), ones: n % 10 }
}

function add2DigitNoRegroup() {
  // Each column must sum to < 10 so there is no carrying.
  const aOnes = rnd(0, 8)
  const bOnes = rnd(0, 9 - aOnes)
  const aTens = rnd(1, 8)
  const bTens = rnd(1, 9 - aTens)
  const a = aTens * 10 + aOnes
  const b = bTens * 10 + bOnes
  return arith(3, a, b, '+', a + b, 'add: no carry')
}

function add2DigitRegroup() {
  // Force a carry in the ones column.
  let a, b
  do {
    a = rnd(15, 89)
    b = rnd(15, 89)
  } while ((a % 10) + (b % 10) < 10)
  return arith(4, a, b, '+', a + b, 'add: carry')
}

function subWithin20() {
  const a = rnd(2, 20)
  const b = rnd(0, a)
  return arith(5, a, b, '-', a - b, `${a}-${b}`)
}

function sub2DigitRegroup() {
  // Force borrowing in the ones column; sometimes borrow across a zero.
  let a, b
  do {
    a = rnd(21, 99)
    b = rnd(11, a - 1)
  } while ((a % 10) >= (b % 10))
  const acrossZero = a % 10 === 0
  return arith(6, a, b, '-', a - b, acrossZero ? 'sub: borrow across zero' : 'sub: borrow')
}

function multInRange(levelId, tables) {
  const a = pick(tables)
  const b = rnd(1, 12)
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  return arith(levelId, a, b, '×', a * b, `${lo}×${hi}`)
}

function mult2to5() {
  return multInRange(7, [2, 3, 4, 5])
}

function mult6to9() {
  return multInRange(8, [6, 7, 8, 9])
}

function mixedMultDiv() {
  const a = rnd(2, 9)
  const b = rnd(2, 9)
  if (Math.random() < 0.5) {
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    return arith(9, a, b, '×', a * b, `${lo}×${hi}`)
  }
  // division: (a*b) / a = b, always a whole number
  const product = a * b
  return arith(9, product, a, '÷', b, `${product}÷${a}`)
}

function multiDigitMult() {
  const a = rnd(12, 99)
  const b = rnd(2, 9)
  return arith(10, a, b, '×', a * b, `2-digit × ${b}`)
}

// ---- Fractions (level 11) ---------------------------------------------------

function fractionAdd() {
  const denom = rnd(3, 9)
  const n1 = rnd(1, denom - 2)
  const n2 = rnd(1, denom - n1) // keep sum <= denom (proper fraction)
  return {
    uid: uid(),
    levelId: 11,
    op: 'fraction',
    display: { type: 'fraction-add', n1, n2, denom },
    answer: String(n1 + n2),
    answerType: 'number',
    factKey: 'fraction: add',
  }
}

function fractionCompare() {
  const denom = rnd(3, 9)
  let n1 = rnd(1, denom)
  let n2 = rnd(1, denom)
  const answer = n1 < n2 ? '<' : n1 > n2 ? '>' : '='
  return {
    uid: uid(),
    levelId: 11,
    op: 'fraction',
    display: { type: 'fraction-compare', n1, n2, denom },
    answer,
    answerType: 'choice',
    choices: ['<', '=', '>'],
    factKey: 'fraction: compare',
  }
}

function fractionIdentify() {
  // Show a bar split into `denom` parts with `shaded` filled; ask numerator.
  const denom = rnd(2, 8)
  const shaded = rnd(1, denom)
  return {
    uid: uid(),
    levelId: 11,
    op: 'fraction',
    display: { type: 'fraction-identify', denom, shaded },
    answer: String(shaded),
    answerType: 'number',
    factKey: 'fraction: identify',
  }
}

function fractions() {
  return pick([fractionAdd, fractionCompare, fractionIdentify])()
}

// ---- Registry ---------------------------------------------------------------

export const GENERATORS = {
  addWithin10,
  addWithin20,
  add2DigitNoRegroup,
  add2DigitRegroup,
  subWithin20,
  sub2DigitRegroup,
  mult2to5,
  mult6to9,
  mixedMultDiv,
  multiDigitMult,
  fractions,
}

import { getLevel } from '../data/levels.js'

export function generateProblem(levelId) {
  const level = getLevel(levelId)
  const gen = GENERATORS[level.gen]
  return gen()
}

// Build a full set. Missed problems (from the previous set) are re-injected at
// the front for spaced repetition, then the rest are freshly generated. We
// avoid two identical prompts back-to-back.
export function generateSet(levelId, count, missed = []) {
  const set = []
  const seen = new Set()

  // Re-inject up to a third of the set as review of missed items.
  const reviewCap = Math.max(0, Math.min(missed.length, Math.ceil(count / 3)))
  for (let i = 0; i < reviewCap; i += 1) {
    const m = missed[i]
    // Regenerate a fresh instance of the same problem (new uid) so it can be
    // re-graded, but keep the same numbers for genuine review.
    set.push({ ...m, uid: uid(), review: true })
  }

  let guard = 0
  while (set.length < count && guard < count * 40) {
    guard += 1
    const p = generateProblem(levelId)
    const key = problemKey(p)
    if (set.length > 0 && problemKey(set[set.length - 1]) === key) continue
    set.push(p)
    seen.add(key)
  }
  return set
}

export function problemKey(p) {
  const d = p.display
  if (d.type === 'horizontal') return `${d.a}${d.op}${d.b}`
  if (d.type === 'fraction-add') return `fa:${d.n1}/${d.denom}+${d.n2}/${d.denom}`
  if (d.type === 'fraction-compare') return `fc:${d.n1}/${d.denom}?${d.n2}/${d.denom}`
  if (d.type === 'fraction-identify') return `fi:${d.shaded}/${d.denom}`
  return p.uid
}
