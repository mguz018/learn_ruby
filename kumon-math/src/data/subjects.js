// Subject registry — the source of truth for every track (Math, Reading,
// History, Science), each with its own ordered levels and belt progression.
//
// masteryType:
//   'speed-accuracy' — must beat BOTH a time target and an accuracy target (Math)
//   'accuracy'       — belt earned on accuracy alone; time is tracked but never
//                      gates progress (Reading / History / Science). Rushing a
//                      read-and-think subject shouldn't be rewarded.
//
// Math levels are procedurally generated (`gen`). Reading/History/Science levels
// draw from curated banks (`pool`).

import { READING } from './content/reading.js'
import { HISTORY } from './content/history.js'
import { SCIENCE } from './content/science.js'
import { GEOGRAPHY } from './content/geography.js'
import { SPANISH } from './content/spanish.js'
import { LOGIC } from './content/logic.js'
import { SPELLING } from './content/spelling.js'

const MATH_LEVELS = [
  { id: 1, gen: 'addWithin10', title: 'Adding to 10', concept: 'Add two numbers that make 10 or less', example: '3 + 4', defaultSpeedSec: 120, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 2, gen: 'addWithin20', title: 'Adding to 20', concept: 'Sums up to 20', example: '8 + 7', defaultSpeedSec: 150, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 3, gen: 'add2DigitNoRegroup', title: 'Two-Digit Adding', concept: 'Add two-digit numbers, no carrying', example: '34 + 25', defaultSpeedSec: 180, defaultAccuracy: 0.95, defaultProblems: 15 },
  { id: 4, gen: 'add2DigitRegroup', title: 'Adding with Carrying', concept: 'Two-digit addition that needs carrying', example: '47 + 38', defaultSpeedSec: 210, defaultAccuracy: 0.95, defaultProblems: 15 },
  { id: 5, gen: 'subWithin20', title: 'Subtracting to 20', concept: 'Take away, staying at or above 0', example: '15 - 8', defaultSpeedSec: 150, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 6, gen: 'sub2DigitRegroup', title: 'Subtracting with Borrowing', concept: 'Two-digit subtraction that needs borrowing', example: '52 - 27', defaultSpeedSec: 210, defaultAccuracy: 0.95, defaultProblems: 15 },
  { id: 7, gen: 'mult2to5', title: 'Times Tables 2–5', concept: 'Multiplication facts for 2, 3, 4, 5', example: '4 × 6', defaultSpeedSec: 150, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 8, gen: 'mult6to9', title: 'Times Tables 6–9', concept: 'Multiplication facts for 6, 7, 8, 9', example: '7 × 8', defaultSpeedSec: 165, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 9, gen: 'mixedMultDiv', title: 'Multiply & Divide', concept: 'Mixed multiplication and division facts', example: '42 ÷ 6', defaultSpeedSec: 180, defaultAccuracy: 0.95, defaultProblems: 20 },
  { id: 10, gen: 'multiDigitMult', title: 'Big Multiplication', concept: 'Two-digit times one-digit', example: '36 × 7', defaultSpeedSec: 240, defaultAccuracy: 0.95, defaultProblems: 12 },
  { id: 11, gen: 'fractions', title: 'Fractions', concept: 'Identify, compare, and add same-denominator fractions', example: '2/7 + 3/7', defaultSpeedSec: 240, defaultAccuracy: 0.9, defaultProblems: 12 },
  // --- Advanced (grade 4-6) ---
  { id: 12, gen: 'mult2x2', title: 'Two-Digit × Two-Digit', concept: 'Multiply two 2-digit numbers', example: '24 × 36', defaultSpeedSec: 300, defaultAccuracy: 0.9, defaultProblems: 10 },
  { id: 13, gen: 'longDivision', title: 'Long Division', concept: 'Divide larger numbers by one digit (no remainder)', example: '256 ÷ 4', defaultSpeedSec: 300, defaultAccuracy: 0.9, defaultProblems: 10 },
  { id: 14, gen: 'orderOfOps', title: 'Order of Operations', concept: 'Multiply/divide before add/subtract', example: '3 + 4 × 2', defaultSpeedSec: 240, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 15, gen: 'fractionOfNumber', title: 'Fraction of a Number', concept: 'Find a fraction of a whole number', example: '2/3 of 12', defaultSpeedSec: 240, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 16, gen: 'percentOf', title: 'Percentages', concept: 'Find a percent of a number', example: '25% of 80', defaultSpeedSec: 240, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 17, gen: 'exponents', title: 'Powers & Squares', concept: 'Squares, cubes, and small powers', example: '7²', defaultSpeedSec: 200, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 18, gen: 'rounding', title: 'Rounding', concept: 'Round to the nearest ten or hundred', example: 'round 347 to tens', defaultSpeedSec: 200, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 19, gen: 'decimalAddSub', title: 'Decimals', concept: 'Add and subtract decimals', example: '3.5 + 2.7', defaultSpeedSec: 260, defaultAccuracy: 0.9, defaultProblems: 12 },
  { id: 20, gen: 'meanAverage', title: 'Averages (Mean)', concept: 'Find the mean of a small set of numbers', example: 'mean of 4, 8, 6', defaultSpeedSec: 260, defaultAccuracy: 0.9, defaultProblems: 10 },
]

// Helper to build a bank level (accuracy-only, no speed target).
function bank(id, title, concept, example, pool) {
  return { id, title, concept, example, pool, defaultAccuracy: 0.85, defaultProblems: 8, defaultSpeedSec: null }
}

const READING_LEVELS = [
  bank(1, 'Synonyms', 'Words that mean the same', 'happy = glad', READING.synonyms),
  bank(2, 'Antonyms', 'Words that mean the opposite', 'hot ↔ cold', READING.antonyms),
  bank(3, 'Context Clues', 'Figure out a word from the sentence', 'bland = little flavor', READING.context),
  bank(4, 'Grammar & Word Types', 'Nouns, verbs, adjectives, and more', 'find the verb', READING.grammar),
  bank(5, 'Main Idea', 'Find the main idea and key details', 'what is it mostly about?', READING.mainidea),
  bank(6, 'Inference', 'Read between the lines to draw conclusions', 'what can you tell?', READING.inference),
]

const HISTORY_LEVELS = [
  bank(1, 'U.S. Symbols', 'Flags, monuments, and basics', 'first president?', HISTORY.symbols),
  bank(2, 'Explorers & Early America', 'Columbus, Pilgrims, and Native peoples', 'the Mayflower', HISTORY.explorers),
  bank(3, 'Revolution & Founding', 'Independence and the founders', '1776', HISTORY.revolution),
  bank(4, 'A Growing Nation', 'Civil War, civil rights, and inventors', 'Lincoln', HISTORY.nation),
  bank(5, 'Ancient Civilizations', 'Egypt, Greece, Rome, and China', 'the pyramids', HISTORY.ancient),
]

const SCIENCE_LEVELS = [
  bank(1, 'Living Things', 'Plants, animals, and the body', 'the heart pumps blood', SCIENCE.living),
  bank(2, 'Earth & Space', 'Planets, weather, and the water cycle', '8 planets', SCIENCE.earth),
  bank(3, 'Matter & Energy', 'States of matter and forces', 'solid, liquid, gas', SCIENCE.matter),
  bank(4, 'Ecosystems & Body', 'Food chains and body systems', 'photosynthesis', SCIENCE.ecosystems),
  bank(5, 'Cells & Adaptations', 'Cells, atoms, and how living things survive', 'cells', SCIENCE.advanced),
]

const GEOGRAPHY_LEVELS = [
  bank(1, 'Continents & Oceans', 'The 7 continents and 5 oceans', '7 continents', GEOGRAPHY.continents),
  bank(2, 'U.S. States', 'States, capitals, and landmarks', 'capital of Texas', GEOGRAPHY.usa),
  bank(3, 'World Capitals', 'Countries and their capitals', 'Paris, France', GEOGRAPHY.world),
  bank(4, 'Landforms', 'Rivers, mountains, and deserts', 'the Amazon', GEOGRAPHY.landforms),
  bank(5, 'Map Skills', 'Directions, hemispheres, and maps', 'the Equator', GEOGRAPHY.mapskills),
]

const SPANISH_LEVELS = [
  bank(1, 'Greetings', 'Hello, goodbye, please, thank you', 'hola = hello', SPANISH.greetings),
  bank(2, 'Numbers & Colors', 'Count and name colors', 'rojo = red', SPANISH.numberscolors),
  bank(3, 'Animals & Food', 'Everyday words for animals and food', 'perro = dog', SPANISH.animalsfood),
  bank(4, 'Family & Home', 'Family members and everyday words', 'casa = house', SPANISH.family),
  bank(5, 'Useful Phrases', 'Short sentences and questions', '¿Cómo estás?', SPANISH.phrases),
]

const LOGIC_LEVELS = [
  bank(1, 'Patterns', 'Find what comes next', '2, 4, 6, 8, ?', LOGIC.patterns),
  bank(2, 'Reasoning', 'Odd-one-out and if-then thinking', 'which does not belong?', LOGIC.reasoning),
  bank(3, 'Coding Concepts', 'Algorithms, loops, and debugging', 'what is a loop?', LOGIC.coding),
  bank(4, 'Computers & Binary', '0s and 1s, hardware and software', '0 and 1', LOGIC.computers),
]

const SPELLING_LEVELS = [
  bank(1, 'Spell It Right', 'Choose the correct spelling', 'because', SPELLING.spelling),
  bank(2, 'Sound-Alikes', 'Homophones like their/there', 'two / too / to', SPELLING.homophones),
  bank(3, 'Prefixes & Suffixes', 'Word parts and their meanings', 'un- means not', SPELLING.affixes),
  bank(4, 'Word Rules', 'Plurals, contractions, and compounds', 'baby → babies', SPELLING.wordrules),
]

export const SUBJECTS = [
  { id: 'math', name: 'Math', icon: '🔢', color: '#2563eb', masteryType: 'speed-accuracy', numeric: true, levels: MATH_LEVELS },
  { id: 'reading', name: 'Reading', icon: '📖', color: '#16a34a', masteryType: 'accuracy', numeric: false, levels: READING_LEVELS },
  { id: 'history', name: 'History', icon: '🏛️', color: '#b45309', masteryType: 'accuracy', numeric: false, levels: HISTORY_LEVELS },
  { id: 'science', name: 'Science', icon: '🔬', color: '#7c3aed', masteryType: 'accuracy', numeric: false, levels: SCIENCE_LEVELS },
  { id: 'geography', name: 'Geography', icon: '🗺️', color: '#0d9488', masteryType: 'accuracy', numeric: false, levels: GEOGRAPHY_LEVELS },
  { id: 'spelling', name: 'Spelling', icon: '🔤', color: '#db2777', masteryType: 'accuracy', numeric: false, levels: SPELLING_LEVELS },
  { id: 'logic', name: 'Logic & Code', icon: '🧩', color: '#ea580c', masteryType: 'accuracy', numeric: false, levels: LOGIC_LEVELS },
  { id: 'spanish', name: 'Spanish', icon: '🗣️', color: '#4f46e5', masteryType: 'accuracy', numeric: false, levels: SPANISH_LEVELS },
]

export const SUBJECT_IDS = SUBJECTS.map((s) => s.id)

// Grade-appropriate starting levels so advanced kids don't grind through
// kindergarten content. Oliver is an advanced 5th grader; Noah an advanced 3rd
// grader. These seat each kid on a sensible belt out of the box; the placement
// check anchors here (and adjusts up/down), and the mastery gate self-corrects
// if a seat is slightly off. Parents can also nudge levels in the dashboard.
export const RECOMMENDED_START = {
  oliver: { math: 13, reading: 5, history: 3, science: 4, geography: 3, spelling: 3, logic: 2, spanish: 2 },
  noah: { math: 8, reading: 3, history: 2, science: 2, geography: 2, spelling: 2, logic: 1, spanish: 1 },
  _default: { math: 1, reading: 1, history: 1, science: 1, geography: 1, spelling: 1, logic: 1, spanish: 1 },
}

export function recommendedStart(profileId, subjectId) {
  const r = RECOMMENDED_START[profileId] || RECOMMENDED_START._default
  return Math.min(r[subjectId] || 1, getSubject(subjectId).levels.length)
}

export function getSubject(id) {
  return SUBJECTS.find((s) => s.id === id) || SUBJECTS[0]
}

export function getSubjectLevel(subjectId, levelId) {
  const s = getSubject(subjectId)
  return s.levels.find((l) => l.id === levelId) || s.levels[0]
}

export function subjectMaxLevel(subjectId) {
  return getSubject(subjectId).levels.length
}
