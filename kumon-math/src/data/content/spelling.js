// Spelling & Word Skills question bank. Multiple choice, accuracy-focused.
// Grade 3-6 spelling, homophones, prefixes/suffixes, and word rules.
// Each item: { q, choices, answer, topic }.

export const SPELLING = {
  // L1 — Spell it right
  spelling: [
    { q: 'Which word is spelled CORRECTLY?', choices: ['because', 'becuase', 'becouse', 'becase'], answer: 'because', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['friend', 'freind', 'frend', 'friynd'], answer: 'friend', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['beautiful', 'beautifull', 'beutiful', 'butiful'], answer: 'beautiful', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['tomorrow', 'tomorow', 'tommorow', 'tommorrow'], answer: 'tomorrow', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['different', 'diffrent', 'diferent', 'differant'], answer: 'different', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['necessary', 'neccessary', 'necesary', 'neccesary'], answer: 'necessary', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['believe', 'beleive', 'belive', 'beleeve'], answer: 'believe', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['weird', 'wierd', 'werd', 'weerd'], answer: 'weird', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['favorite', 'faverite', 'favorit', 'favourit'], answer: 'favorite', topic: 'spelling' },
    { q: 'Which word is spelled CORRECTLY?', choices: ['probably', 'probaly', 'probubly', 'probbably'], answer: 'probably', topic: 'spelling' },
  ],

  // L2 — Homophones (sound alike)
  homophones: [
    { q: 'Choose the right word: "I have ___ dogs." (a number)', choices: ['two', 'too', 'to', 'tue'], answer: 'two', topic: 'homophones' },
    { q: 'Choose the right word: "Put the book over ___."', choices: ['there', 'their', "they're", 'thair'], answer: 'there', topic: 'homophones' },
    { q: 'Choose the right word: "___ going to the park." (they are)', choices: ["They're", 'Their', 'There', 'Theyre'], answer: "They're", topic: 'homophones' },
    { q: 'Choose the right word: "The dog wagged ___ tail."', choices: ['its', "it's", 'its’', 'itts'], answer: 'its', topic: 'homophones' },
    { q: 'Choose the right word: "___ a sunny day." (it is)', choices: ["It's", 'Its', 'Its’', 'Itis'], answer: "It's", topic: 'homophones' },
    { q: 'Choose the right word: "Can you ___ the music?"', choices: ['hear', 'here', 'heir', 'hier'], answer: 'hear', topic: 'homophones' },
    { q: 'Choose the right word: "We won the game, so we ___ the trophy."', choices: ['won', 'one', 'wun', 'own'], answer: 'won', topic: 'homophones' },
    { q: 'Choose the right word: "I ate a ___ of bread." (not two)', choices: ['piece', 'peace', 'peese', 'peice'], answer: 'piece', topic: 'homophones' },
    { q: 'Choose the right word: "The wind ___ hard." (past tense of blow)', choices: ['blew', 'blue', 'blow', 'bleu'], answer: 'blew', topic: 'homophones' },
    { q: 'Choose the right word: "She is my ___ friend." (number 1)', choices: ['one', 'won', 'wun', 'own'], answer: 'one', topic: 'homophones' },
  ],

  // L3 — Prefixes & suffixes
  affixes: [
    { q: 'The prefix "un-" in "unhappy" means —', choices: ['not', 'again', 'before', 'very'], answer: 'not', topic: 'prefixes' },
    { q: 'The prefix "re-" in "redo" means —', choices: ['again', 'not', 'before', 'under'], answer: 'again', topic: 'prefixes' },
    { q: 'The suffix "-ful" in "helpful" means —', choices: ['full of', 'without', 'small', 'again'], answer: 'full of', topic: 'suffixes' },
    { q: 'The suffix "-less" in "fearless" means —', choices: ['without', 'full of', 'more', 'before'], answer: 'without', topic: 'suffixes' },
    { q: 'The prefix "pre-" in "preview" means —', choices: ['before', 'after', 'not', 'again'], answer: 'before', topic: 'prefixes' },
    { q: '"Rewrite" means to —', choices: ['write again', 'not write', 'write before', 'stop writing'], answer: 'write again', topic: 'prefixes' },
    { q: 'The suffix "-er" in "teacher" means a —', choices: ['person who does something', 'small thing', 'place', 'time'], answer: 'person who does something', topic: 'suffixes' },
    { q: '"Unlock" means —', choices: ['to open something locked', 'to lock again', 'to lock before', 'to break'], answer: 'to open something locked', topic: 'prefixes' },
    { q: 'The prefix "tri-" in "triangle" means —', choices: ['three', 'two', 'one', 'many'], answer: 'three', topic: 'prefixes' },
    { q: 'The prefix "bi-" in "bicycle" means —', choices: ['two', 'three', 'one', 'round'], answer: 'two', topic: 'prefixes' },
  ],

  // L4 — Plurals & word rules
  wordrules: [
    { q: 'What is the plural of "baby"?', choices: ['babies', 'babys', 'babyes', 'babis'], answer: 'babies', topic: 'plurals' },
    { q: 'What is the plural of "leaf"?', choices: ['leaves', 'leafs', 'leafes', 'leavs'], answer: 'leaves', topic: 'plurals' },
    { q: 'What is the plural of "mouse"?', choices: ['mice', 'mouses', 'mouse', 'mices'], answer: 'mice', topic: 'plurals' },
    { q: 'What is the plural of "foot"?', choices: ['feet', 'foots', 'feets', 'footes'], answer: 'feet', topic: 'plurals' },
    { q: 'What is the plural of "box"?', choices: ['boxes', 'boxs', 'boxies', 'box'], answer: 'boxes', topic: 'plurals' },
    { q: 'Which is the correct contraction for "cannot"?', choices: ["can't", "cant'", "ca'nt", "cann't"], answer: "can't", topic: 'contractions' },
    { q: 'What is the past tense of "swim"?', choices: ['swam', 'swimmed', 'swum', 'swimed'], answer: 'swam', topic: 'verb tense' },
    { q: 'Two words joined to make one (like "sun" + "flower") make a —', choices: ['compound word', 'plural', 'prefix', 'rhyme'], answer: 'compound word', topic: 'compound words' },
    { q: 'What is the plural of "child"?', choices: ['children', 'childs', 'childes', 'childrens'], answer: 'children', topic: 'plurals' },
    { q: 'Which word is a compound word?', choices: ['rainbow', 'running', 'happy', 'quickly'], answer: 'rainbow', topic: 'compound words' },
  ],
}
