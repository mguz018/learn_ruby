// Logic & Coding question bank. Multiple choice, accuracy-focused. Age 8-12
// reasoning, patterns, and beginner computer-science concepts.
// Each item: { q, choices, answer, topic }.

export const LOGIC = {
  // L1 — Patterns & sequences
  patterns: [
    { q: 'What comes next? 2, 4, 6, 8, ___', choices: ['10', '9', '12', '16'], answer: '10', topic: 'patterns' },
    { q: 'What comes next? 5, 10, 15, 20, ___', choices: ['25', '30', '22', '24'], answer: '25', topic: 'patterns' },
    { q: 'What comes next? 1, 2, 4, 8, ___', choices: ['16', '10', '12', '32'], answer: '16', topic: 'patterns' },
    { q: 'What comes next? 3, 6, 9, 12, ___', choices: ['15', '14', '18', '13'], answer: '15', topic: 'patterns' },
    { q: 'Pattern: circle, square, circle, square, ___', choices: ['circle', 'square', 'triangle', 'star'], answer: 'circle', topic: 'patterns' },
    { q: 'What comes next? 100, 90, 80, 70, ___', choices: ['60', '65', '75', '50'], answer: '60', topic: 'patterns' },
    { q: 'What comes next? 1, 3, 5, 7, ___', choices: ['9', '8', '10', '11'], answer: '9', topic: 'patterns' },
    { q: 'Pattern: A, B, C, D, ___', choices: ['E', 'F', 'D', 'A'], answer: 'E', topic: 'patterns' },
    { q: 'What comes next? 2, 4, 8, 16, ___', choices: ['32', '24', '20', '18'], answer: '32', topic: 'patterns' },
    { q: 'What comes next? 20, 17, 14, 11, ___', choices: ['8', '9', '7', '10'], answer: '8', topic: 'patterns' },
  ],

  // L2 — Reasoning
  reasoning: [
    { q: 'Which one does NOT belong? apple, banana, carrot, grape', choices: ['carrot', 'apple', 'banana', 'grape'], answer: 'carrot', topic: 'odd one out' },
    { q: 'Which one does NOT belong? dog, cat, fish, car', choices: ['car', 'dog', 'cat', 'fish'], answer: 'car', topic: 'odd one out' },
    { q: 'If ALL cats are animals, and Milo is a cat, then Milo is —', choices: ['an animal', 'a dog', 'a plant', 'a fish'], answer: 'an animal', topic: 'logic' },
    { q: 'Tom is taller than Sam. Sam is taller than Ben. Who is tallest?', choices: ['Tom', 'Sam', 'Ben', 'Can’t tell'], answer: 'Tom', topic: 'logic' },
    { q: 'Which is the same shape as a stop sign?', choices: ['octagon', 'circle', 'square', 'triangle'], answer: 'octagon', topic: 'reasoning' },
    { q: 'Red, blue, and green are all —', choices: ['colors', 'shapes', 'numbers', 'animals'], answer: 'colors', topic: 'categories' },
    { q: 'If today is Wednesday, what day is tomorrow?', choices: ['Thursday', 'Tuesday', 'Friday', 'Monday'], answer: 'Thursday', topic: 'reasoning' },
    { q: 'Which does NOT belong? triangle, square, circle, purple', choices: ['purple', 'triangle', 'square', 'circle'], answer: 'purple', topic: 'odd one out' },
    { q: 'A robin, an eagle, and a sparrow are all kinds of —', choices: ['birds', 'fish', 'bugs', 'trees'], answer: 'birds', topic: 'categories' },
    { q: 'If you have 3 red balls and 2 blue balls, which color do you have MORE of?', choices: ['red', 'blue', 'same', 'green'], answer: 'red', topic: 'reasoning' },
  ],

  // L3 — Coding concepts
  coding: [
    { q: 'A step-by-step set of instructions to solve a problem is an —', choices: ['algorithm', 'answer', 'internet', 'emoji'], answer: 'algorithm', topic: 'coding' },
    { q: 'Repeating an instruction several times in code is called a —', choices: ['loop', 'jump', 'gap', 'list'], answer: 'loop', topic: 'coding' },
    { q: 'Finding and fixing mistakes in code is called —', choices: ['debugging', 'deleting', 'downloading', 'drawing'], answer: 'debugging', topic: 'coding' },
    { q: 'A mistake or error in a program is called a —', choices: ['bug', 'cloud', 'byte', 'link'], answer: 'bug', topic: 'coding' },
    { q: 'In coding, the ORDER of the steps is called the —', choices: ['sequence', 'shuffle', 'shape', 'screen'], answer: 'sequence', topic: 'coding' },
    { q: 'Instructions that run only IF something is true use a —', choices: ['condition (if statement)', 'crayon', 'camera', 'clock'], answer: 'condition (if statement)', topic: 'coding' },
    { q: 'To make a character walk 4 steps, the BEST tool is a —', choices: ['loop that repeats 4 times', 'a single guess', 'a random number', 'a delete key'], answer: 'loop that repeats 4 times', topic: 'coding' },
    { q: 'If a recipe says the wrong oven time, that is like a code —', choices: ['bug', 'loop', 'variable', 'screen'], answer: 'bug', topic: 'coding' },
    { q: 'A named box that stores a value in a program is a —', choices: ['variable', 'volcano', 'vowel', 'village'], answer: 'variable', topic: 'coding' },
    { q: 'Which is the correct order to make toast?', choices: ['Put bread in, toast it, take it out', 'Take it out, toast it, put bread in', 'Toast it, put bread in, take it out', 'Eat it, toast it, put bread in'], answer: 'Put bread in, toast it, take it out', topic: 'sequence' },
  ],

  // L4 — Computers & binary
  computers: [
    { q: 'Computers store information using only which two digits?', choices: ['0 and 1', '1 and 2', 'A and B', '5 and 10'], answer: '0 and 1', topic: 'binary' },
    { q: 'The number system that uses only 0 and 1 is called —', choices: ['binary', 'decimal', 'roman', 'random'], answer: 'binary', topic: 'binary' },
    { q: 'The "brain" of a computer that does the thinking is the —', choices: ['CPU', 'screen', 'mouse', 'speaker'], answer: 'CPU', topic: 'hardware' },
    { q: 'Which of these is HARDWARE (a physical part)?', choices: ['keyboard', 'a website', 'an app', 'a password'], answer: 'keyboard', topic: 'hardware' },
    { q: 'Programs and apps that run on a computer are called —', choices: ['software', 'hardware', 'furniture', 'batteries'], answer: 'software', topic: 'hardware' },
    { q: 'A single 0 or 1 in binary is called a —', choices: ['bit', 'byte', 'bug', 'beep'], answer: 'bit', topic: 'binary' },
    { q: 'In binary, what is 1 + 1 written as?', choices: ['10', '2', '11', '01'], answer: '10', topic: 'binary' },
    { q: 'The device you use to point and click is a —', choices: ['mouse', 'monitor', 'modem', 'memory'], answer: 'mouse', topic: 'hardware' },
    { q: 'The part that shows pictures and text is the —', choices: ['monitor (screen)', 'keyboard', 'CPU', 'cable'], answer: 'monitor (screen)', topic: 'hardware' },
    { q: 'A group of 8 bits together is called a —', choices: ['byte', 'bit', 'word', 'page'], answer: 'byte', topic: 'binary' },
  ],
}
