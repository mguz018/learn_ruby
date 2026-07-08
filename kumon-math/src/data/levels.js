// The 11 Kumon-style levels. Each introduces ONE tiny new concept.
// `gen` keys map to generators in ../lib/problems.js.
// Default mastery targets are per-level and overridable in the parent dashboard.
//
// speedTargetSec is the total time budget for a full set at the default set
// size; it scales automatically if the parent changes problems-per-set.

export const LEVELS = [
  {
    id: 1,
    gen: 'addWithin10',
    title: 'Adding to 10',
    concept: 'Add two numbers that make 10 or less',
    example: '3 + 4',
    defaultSpeedSec: 120,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 2,
    gen: 'addWithin20',
    title: 'Adding to 20',
    concept: 'Sums up to 20',
    example: '8 + 7',
    defaultSpeedSec: 150,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 3,
    gen: 'add2DigitNoRegroup',
    title: 'Two-Digit Adding',
    concept: 'Add two-digit numbers, no carrying',
    example: '34 + 25',
    defaultSpeedSec: 180,
    defaultAccuracy: 0.95,
    defaultProblems: 15,
  },
  {
    id: 4,
    gen: 'add2DigitRegroup',
    title: 'Adding with Carrying',
    concept: 'Two-digit addition that needs carrying',
    example: '47 + 38',
    defaultSpeedSec: 210,
    defaultAccuracy: 0.95,
    defaultProblems: 15,
  },
  {
    id: 5,
    gen: 'subWithin20',
    title: 'Subtracting to 20',
    concept: 'Take away, staying at or above 0',
    example: '15 - 8',
    defaultSpeedSec: 150,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 6,
    gen: 'sub2DigitRegroup',
    title: 'Subtracting with Borrowing',
    concept: 'Two-digit subtraction that needs borrowing',
    example: '52 - 27',
    defaultSpeedSec: 210,
    defaultAccuracy: 0.95,
    defaultProblems: 15,
  },
  {
    id: 7,
    gen: 'mult2to5',
    title: 'Times Tables 2–5',
    concept: 'Multiplication facts for 2, 3, 4, 5',
    example: '4 × 6',
    defaultSpeedSec: 150,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 8,
    gen: 'mult6to9',
    title: 'Times Tables 6–9',
    concept: 'Multiplication facts for 6, 7, 8, 9',
    example: '7 × 8',
    defaultSpeedSec: 165,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 9,
    gen: 'mixedMultDiv',
    title: 'Multiply & Divide',
    concept: 'Mixed multiplication and division facts',
    example: '42 ÷ 6',
    defaultSpeedSec: 180,
    defaultAccuracy: 0.95,
    defaultProblems: 20,
  },
  {
    id: 10,
    gen: 'multiDigitMult',
    title: 'Big Multiplication',
    concept: 'Two-digit times one-digit',
    example: '36 × 7',
    defaultSpeedSec: 240,
    defaultAccuracy: 0.95,
    defaultProblems: 12,
  },
  {
    id: 11,
    gen: 'fractions',
    title: 'Fractions',
    concept: 'Identify, compare, and add same-denominator fractions',
    example: '2/7 + 3/7',
    defaultSpeedSec: 240,
    defaultAccuracy: 0.9,
    defaultProblems: 12,
  },
]

export const MAX_LEVEL = LEVELS.length

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id) || LEVELS[0]
}
