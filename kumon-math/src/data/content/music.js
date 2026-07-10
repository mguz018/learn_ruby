// Music question bank. Multiple choice, accuracy-focused. Beginner music
// literacy, grade 3-6. { q, choices, answer, topic }.

export const MUSIC = {
  // L1 — Notes & basics
  notes: [
    { q: 'How many letters are used to name musical notes?', choices: ['7 (A–G)', '5', '10', '12'], answer: '7 (A–G)', topic: 'notes' },
    { q: 'Which of these is a musical note name?', choices: ['G', 'H', 'J', 'Z'], answer: 'G', topic: 'notes' },
    { q: 'The set of 5 lines that music is written on is called the —', choices: ['staff', 'stage', 'string', 'scale'], answer: 'staff', topic: 'staff' },
    { q: 'After the note G, the music alphabet starts over at —', choices: ['A', 'H', 'F', 'C'], answer: 'A', topic: 'notes' },
    { q: 'A group of notes going up or down in order is a —', choices: ['scale', 'staff', 'song', 'string'], answer: 'scale', topic: 'scales' },
    { q: 'The symbol at the start of the staff that sets the notes is a —', choices: ['clef', 'flag', 'dot', 'bar'], answer: 'clef', topic: 'staff' },
    { q: 'A song’s words are called the —', choices: ['lyrics', 'beats', 'notes', 'clefs'], answer: 'lyrics', topic: 'basics' },
    { q: 'A pleasing series of notes you can sing is a —', choices: ['melody', 'staff', 'rest', 'clef'], answer: 'melody', topic: 'basics' },
    { q: 'Eight notes in a row (like C to the next C) make an —', choices: ['octave', 'octagon', 'ounce', 'orbit'], answer: 'octave', topic: 'scales' },
    { q: 'The most common clef, used for higher notes, is the —', choices: ['treble clef', 'bass clef', 'key clef', 'note clef'], answer: 'treble clef', topic: 'staff' },
  ],

  // L2 — Rhythm & beats
  rhythm: [
    { q: 'How many beats does a whole note usually get?', choices: ['4', '1', '2', '8'], answer: '4', topic: 'note values' },
    { q: 'How many beats does a quarter note usually get?', choices: ['1', '2', '4', '3'], answer: '1', topic: 'note values' },
    { q: 'How many beats does a half note usually get?', choices: ['2', '1', '4', '3'], answer: '2', topic: 'note values' },
    { q: 'A symbol for silence (no sound) in music is a —', choices: ['rest', 'note', 'clef', 'staff'], answer: 'rest', topic: 'rhythm' },
    { q: 'The steady pulse you clap or tap along to is the —', choices: ['beat', 'lyric', 'clef', 'note'], answer: 'beat', topic: 'rhythm' },
    { q: 'How fast or slow music is played is called the —', choices: ['tempo', 'timbre', 'title', 'tone'], answer: 'tempo', topic: 'tempo' },
    { q: 'Two quarter notes together last as long as one —', choices: ['half note', 'whole note', 'rest', 'octave'], answer: 'half note', topic: 'note values' },
    { q: 'The pattern of long and short sounds in music is the —', choices: ['rhythm', 'melody', 'staff', 'clef'], answer: 'rhythm', topic: 'rhythm' },
    { q: 'Vertical lines that divide the staff into measures are —', choices: ['bar lines', 'note stems', 'clefs', 'rests'], answer: 'bar lines', topic: 'rhythm' },
    { q: 'A whole note lasts as long as how many quarter notes?', choices: ['4', '2', '1', '8'], answer: '4', topic: 'note values' },
  ],

  // L3 — Instruments
  instruments: [
    { q: 'Which instrument is a STRING instrument?', choices: ['Violin', 'Trumpet', 'Flute', 'Drum'], answer: 'Violin', topic: 'instruments' },
    { q: 'Which instrument is a BRASS instrument?', choices: ['Trumpet', 'Violin', 'Flute', 'Guitar'], answer: 'Trumpet', topic: 'instruments' },
    { q: 'Which instrument is a PERCUSSION instrument (you hit it)?', choices: ['Drum', 'Piano tune', 'Flute', 'Cello'], answer: 'Drum', topic: 'instruments' },
    { q: 'Which instrument do you blow into and is made of wood or metal (a woodwind)?', choices: ['Flute', 'Trumpet', 'Violin', 'Drum'], answer: 'Flute', topic: 'instruments' },
    { q: 'A guitar makes sound from its vibrating —', choices: ['strings', 'keys', 'reeds', 'drumheads'], answer: 'strings', topic: 'instruments' },
    { q: 'Which of these has black and white keys?', choices: ['Piano', 'Violin', 'Trumpet', 'Flute'], answer: 'Piano', topic: 'instruments' },
    { q: 'A large group of musicians playing together is an —', choices: ['orchestra', 'audience', 'octave', 'opera house'], answer: 'orchestra', topic: 'ensembles' },
    { q: 'The person who leads an orchestra with a baton is the —', choices: ['conductor', 'singer', 'drummer', 'composer'], answer: 'conductor', topic: 'ensembles' },
    { q: 'Which instrument is the LOWEST-sounding string instrument here?', choices: ['Double bass', 'Violin', 'Viola', 'Guitar'], answer: 'Double bass', topic: 'instruments' },
    { q: 'A person who writes music is a —', choices: ['composer', 'conductor', 'painter', 'poet'], answer: 'composer', topic: 'basics' },
  ],

  // L4 — Music terms
  terms: [
    { q: 'In music, "forte" means to play —', choices: ['loud', 'soft', 'fast', 'slow'], answer: 'loud', topic: 'dynamics' },
    { q: 'In music, "piano" (as a direction) means to play —', choices: ['soft', 'loud', 'fast', 'high'], answer: 'soft', topic: 'dynamics' },
    { q: 'How loud or soft music is played is called its —', choices: ['dynamics', 'tempo', 'melody', 'lyrics'], answer: 'dynamics', topic: 'dynamics' },
    { q: '"Allegro" means the music is —', choices: ['fast', 'slow', 'quiet', 'sad'], answer: 'fast', topic: 'tempo' },
    { q: 'When many notes sound together in a pleasing way, that’s —', choices: ['harmony', 'rhythm', 'silence', 'a rest'], answer: 'harmony', topic: 'harmony' },
    { q: 'The overall feeling of a song (happy, calm, spooky) is its —', choices: ['mood', 'tempo', 'clef', 'bar'], answer: 'mood', topic: 'expression' },
    { q: 'To sing or play notes smoothly connected is to play —', choices: ['legato', 'staccato', 'forte', 'piano'], answer: 'legato', topic: 'articulation' },
    { q: 'Short, detached notes are played —', choices: ['staccato', 'legato', 'slowly', 'loudly'], answer: 'staccato', topic: 'articulation' },
    { q: '"Duet" means music played by how many people?', choices: ['2', '1', '3', '4'], answer: '2', topic: 'ensembles' },
    { q: 'The highness or lowness of a sound is its —', choices: ['pitch', 'beat', 'tempo', 'lyric'], answer: 'pitch', topic: 'basics' },
  ],
}
