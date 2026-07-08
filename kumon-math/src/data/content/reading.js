// Reading question bank. Multiple choice, accuracy-focused (no speed pressure).
// Pools span roughly grade 2 -> grade 6 so the placement test can seat each kid.
// Each item: { q, passage?, choices, answer, topic }.  `answer` must be one of
// `choices` verbatim. Shuffle happens at set-build time.

export const READING = {
  // L1 — Synonyms
  synonyms: [
    { q: 'Which word means the SAME as "happy"?', choices: ['glad', 'angry', 'tired', 'hungry'], answer: 'glad', topic: 'synonyms' },
    { q: 'Which word means the SAME as "big"?', choices: ['large', 'tiny', 'soft', 'fast'], answer: 'large', topic: 'synonyms' },
    { q: 'Which word means the SAME as "fast"?', choices: ['quick', 'slow', 'heavy', 'quiet'], answer: 'quick', topic: 'synonyms' },
    { q: 'Which word means the SAME as "smart"?', choices: ['clever', 'silly', 'weak', 'loud'], answer: 'clever', topic: 'synonyms' },
    { q: 'Which word means the SAME as "start"?', choices: ['begin', 'stop', 'finish', 'close'], answer: 'begin', topic: 'synonyms' },
    { q: 'Which word means the SAME as "tired"?', choices: ['sleepy', 'awake', 'strong', 'brave'], answer: 'sleepy', topic: 'synonyms' },
    { q: 'Which word means the SAME as "cold"?', choices: ['chilly', 'warm', 'sunny', 'dry'], answer: 'chilly', topic: 'synonyms' },
    { q: 'Which word means the SAME as "shout"?', choices: ['yell', 'whisper', 'walk', 'sit'], answer: 'yell', topic: 'synonyms' },
    { q: 'Which word means the SAME as "little"?', choices: ['small', 'giant', 'wide', 'tall'], answer: 'small', topic: 'synonyms' },
    { q: 'Which word means the SAME as "pretty"?', choices: ['beautiful', 'ugly', 'dark', 'empty'], answer: 'beautiful', topic: 'synonyms' },
    { q: 'Which word means the SAME as "jump"?', choices: ['leap', 'crawl', 'rest', 'stare'], answer: 'leap', topic: 'synonyms' },
    { q: 'Which word means the SAME as "gift"?', choices: ['present', 'problem', 'promise', 'plate'], answer: 'present', topic: 'synonyms' },
  ],

  // L2 — Antonyms
  antonyms: [
    { q: 'Which word means the OPPOSITE of "hot"?', choices: ['cold', 'warm', 'boiling', 'spicy'], answer: 'cold', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "up"?', choices: ['down', 'over', 'above', 'high'], answer: 'down', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "happy"?', choices: ['sad', 'glad', 'cheerful', 'merry'], answer: 'sad', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "open"?', choices: ['close', 'wide', 'door', 'enter'], answer: 'close', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "empty"?', choices: ['full', 'hollow', 'light', 'open'], answer: 'full', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "day"?', choices: ['night', 'noon', 'morning', 'sun'], answer: 'night', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "loud"?', choices: ['quiet', 'noisy', 'sharp', 'busy'], answer: 'quiet', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "begin"?', choices: ['end', 'start', 'open', 'go'], answer: 'end', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "brave"?', choices: ['afraid', 'bold', 'strong', 'proud'], answer: 'afraid', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "ancient"?', choices: ['modern', 'old', 'dusty', 'past'], answer: 'modern', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "generous"?', choices: ['selfish', 'kind', 'giving', 'friendly'], answer: 'selfish', topic: 'antonyms' },
    { q: 'Which word means the OPPOSITE of "shrink"?', choices: ['grow', 'melt', 'fall', 'freeze'], answer: 'grow', topic: 'antonyms' },
  ],

  // L3 — Context clues (meaning from a sentence)
  context: [
    { q: 'The soup was so BLAND that Mia added salt and pepper. "Bland" means —', choices: ['having little flavor', 'very spicy', 'too hot', 'frozen'], answer: 'having little flavor', topic: 'context clues' },
    { q: 'The hikers were EXHAUSTED after climbing all day. "Exhausted" means —', choices: ['very tired', 'excited', 'hungry', 'lost'], answer: 'very tired', topic: 'context clues' },
    { q: 'The stubborn mule REFUSED to move no matter how hard we pulled. "Refused" means —', choices: ['would not', 'wanted to', 'tried to', 'started to'], answer: 'would not', topic: 'context clues' },
    { q: 'Her room was IMMACULATE — not a speck of dust anywhere. "Immaculate" means —', choices: ['perfectly clean', 'very messy', 'brightly painted', 'quite small'], answer: 'perfectly clean', topic: 'context clues' },
    { q: 'The tiny puppy was TIMID and hid behind its mother. "Timid" means —', choices: ['shy', 'brave', 'angry', 'loud'], answer: 'shy', topic: 'context clues' },
    { q: 'We had to POSTPONE the picnic because of the rain. "Postpone" means —', choices: ['put off until later', 'cancel forever', 'begin early', 'enjoy'], answer: 'put off until later', topic: 'context clues' },
    { q: 'The magician AMAZED the crowd with his tricks. "Amazed" means —', choices: ['filled with wonder', 'bored', 'confused', 'annoyed'], answer: 'filled with wonder', topic: 'context clues' },
    { q: 'The desert is an ARID place with almost no rain. "Arid" means —', choices: ['very dry', 'very wet', 'very cold', 'very green'], answer: 'very dry', topic: 'context clues' },
    { q: 'He gave a BRIEF answer — just one short sentence. "Brief" means —', choices: ['short', 'long', 'loud', 'rude'], answer: 'short', topic: 'context clues' },
    { q: 'The FRAGILE vase shattered the moment it fell. "Fragile" means —', choices: ['easily broken', 'very heavy', 'brightly colored', 'very old'], answer: 'easily broken', topic: 'context clues' },
    { q: 'The twins are IDENTICAL and look exactly alike. "Identical" means —', choices: ['exactly the same', 'very different', 'related', 'friendly'], answer: 'exactly the same', topic: 'context clues' },
    { q: 'The teacher told us to be PUNCTUAL and arrive on time. "Punctual" means —', choices: ['on time', 'polite', 'quiet', 'prepared'], answer: 'on time', topic: 'context clues' },
  ],

  // L4 — Grammar & parts of speech
  grammar: [
    { q: 'Which word is a NOUN? "The dog ran quickly."', choices: ['dog', 'ran', 'quickly', 'the'], answer: 'dog', topic: 'nouns' },
    { q: 'Which word is a VERB? "She sings beautifully."', choices: ['sings', 'she', 'beautifully', 'a'], answer: 'sings', topic: 'verbs' },
    { q: 'Which word is an ADJECTIVE? "The tall tree swayed."', choices: ['tall', 'tree', 'swayed', 'the'], answer: 'tall', topic: 'adjectives' },
    { q: 'Which sentence is written correctly?', choices: ['We are going to the park.', 'we are going to the park', 'We are going to the park', 'we Are going to the Park.'], answer: 'We are going to the park.', topic: 'punctuation' },
    { q: 'Choose the correct word: "Their going to ___ house."', choices: ['their', 'there', 'they’re', 'thair'], answer: 'their', topic: 'homophones' },
    { q: 'Which word is a PRONOUN? "He gave it to them."', choices: ['He', 'gave', 'to', 'and'], answer: 'He', topic: 'pronouns' },
    { q: 'What is the plural of "child"?', choices: ['children', 'childs', 'childes', 'childrens'], answer: 'children', topic: 'plurals' },
    { q: 'Which word is an ADVERB? "The turtle moved slowly."', choices: ['slowly', 'turtle', 'moved', 'the'], answer: 'slowly', topic: 'adverbs' },
    { q: 'Choose the correct contraction for "do not".', choices: ["don't", "do'nt", "dont'", "does'nt"], answer: "don't", topic: 'contractions' },
    { q: 'Which word correctly completes the sentence: "She has two ___."', choices: ['boxes', 'boxs', 'boxies', 'box'], answer: 'boxes', topic: 'plurals' },
    { q: 'Which is the past tense of "run"?', choices: ['ran', 'runned', 'running', 'runs'], answer: 'ran', topic: 'verb tense' },
    { q: 'Which word is the SUBJECT? "The rabbit hopped away."', choices: ['rabbit', 'hopped', 'away', 'the'], answer: 'rabbit', topic: 'sentence parts' },
  ],

  // L5 — Main idea & details (short passages)
  mainidea: [
    {
      passage:
        'Honeybees live together in large groups called colonies. Each bee has a job. Worker bees gather nectar from flowers, the queen lays eggs, and drones help the queen. By working together, the colony makes honey and stays healthy.',
      q: 'What is the MAIN idea of this passage?',
      choices: ['Honeybees work together, each with a job', 'Flowers make nectar', 'Honey tastes sweet', 'Drones are lazy'],
      answer: 'Honeybees work together, each with a job',
      topic: 'main idea',
    },
    {
      passage:
        'Honeybees live together in large groups called colonies. Each bee has a job. Worker bees gather nectar from flowers, the queen lays eggs, and drones help the queen.',
      q: 'According to the passage, what do worker bees do?',
      choices: ['Gather nectar', 'Lay eggs', 'Guard the drones', 'Build roads'],
      answer: 'Gather nectar',
      topic: 'details',
    },
    {
      passage:
        'Volcanoes form when melted rock, called magma, pushes up through the Earth’s surface. When a volcano erupts, magma flows out as lava. Over many years, the cooled lava can build a tall mountain.',
      q: 'What is this passage MOSTLY about?',
      choices: ['How volcanoes form and erupt', 'Why mountains are cold', 'How to climb a volcano', 'Where lava is sold'],
      answer: 'How volcanoes form and erupt',
      topic: 'main idea',
    },
    {
      passage:
        'Volcanoes form when melted rock, called magma, pushes up through the Earth’s surface. When a volcano erupts, magma flows out as lava.',
      q: 'What is melted rock underground called?',
      choices: ['Magma', 'Lava', 'Ash', 'Steam'],
      answer: 'Magma',
      topic: 'details',
    },
    {
      passage:
        'Maria planted a small seed in a pot by her window. She watered it every day and made sure it got plenty of sunlight. After two weeks, a tiny green sprout appeared. Maria was thrilled to see her plant begin to grow.',
      q: 'Why did Maria’s seed grow?',
      choices: ['She gave it water and sunlight', 'She kept it in the dark', 'She never watered it', 'She planted it outside'],
      answer: 'She gave it water and sunlight',
      topic: 'cause & effect',
    },
    {
      passage:
        'Maria planted a small seed in a pot by her window. She watered it every day. After two weeks, a tiny green sprout appeared. Maria was thrilled.',
      q: 'How did Maria feel at the end?',
      choices: ['Thrilled', 'Bored', 'Angry', 'Scared'],
      answer: 'Thrilled',
      topic: 'details',
    },
    {
      passage:
        'The public library is a place where anyone can borrow books for free. It also offers computers, quiet reading areas, and story times for young children. Librarians help visitors find what they need.',
      q: 'What is the BEST title for this passage?',
      choices: ['What a Library Offers', 'How to Write a Book', 'The History of Computers', 'A Quiet Nap'],
      answer: 'What a Library Offers',
      topic: 'main idea',
    },
    {
      passage:
        'The public library offers computers, quiet reading areas, and story times for young children. Librarians help visitors find what they need.',
      q: 'Who helps visitors find what they need?',
      choices: ['Librarians', 'Teachers', 'Doctors', 'Firefighters'],
      answer: 'Librarians',
      topic: 'details',
    },
  ],

  // L6 — Inference & comprehension (harder passages)
  inference: [
    {
      passage:
        'Jamal grabbed his umbrella and rain boots before heading out the door. He glanced up at the gray, heavy clouds and quickened his pace toward the bus stop.',
      q: 'What can you INFER about the weather?',
      choices: ['It is about to rain', 'It is a sunny day', 'It is snowing hard', 'It is very windy only'],
      answer: 'It is about to rain',
      topic: 'inference',
    },
    {
      passage:
        'When Priya opened the oven, a delicious smell filled the kitchen. She smiled, slipped on her mitts, and carefully set the tray on the counter to cool.',
      q: 'What was Priya MOST likely doing?',
      choices: ['Baking something', 'Washing dishes', 'Reading a book', 'Painting a wall'],
      answer: 'Baking something',
      topic: 'inference',
    },
    {
      passage:
        'The championship was tied with seconds left. Devon’s hands shook as he stepped to the free-throw line. The crowd fell silent. He took a deep breath and released the ball.',
      q: 'How does Devon most likely feel?',
      choices: ['Nervous', 'Bored', 'Sleepy', 'Relaxed'],
      answer: 'Nervous',
      topic: 'inference',
    },
    {
      passage:
        'Every autumn, monarch butterflies travel thousands of miles from Canada and the United States all the way to warm forests in Mexico. No single butterfly makes the whole round trip; it takes several generations to complete the journey.',
      q: 'Why is the monarch migration surprising?',
      choices: ['It takes several generations to finish', 'Butterflies cannot fly', 'They travel only one mile', 'They fly to the Moon'],
      answer: 'It takes several generations to finish',
      topic: 'inference',
    },
    {
      passage:
        'Sam noticed muddy paw prints leading from the back door to the couch, where his dog Rex sat looking very guilty. A chewed shoe lay nearby.',
      q: 'What probably happened?',
      choices: ['Rex came in muddy and chewed the shoe', 'Sam cleaned the whole house', 'A stranger cooked dinner', 'It snowed indoors'],
      answer: 'Rex came in muddy and chewed the shoe',
      topic: 'inference',
    },
    {
      passage:
        'The old lighthouse had guided ships safely for a hundred years. But when its light finally went dark, sailors had to rely on new electronic maps and radios to find their way to shore.',
      q: 'What is the main lesson of this passage?',
      choices: ['New tools can replace old ones', 'Ships never get lost', 'Lighthouses are useless', 'Sailors dislike maps'],
      answer: 'New tools can replace old ones',
      topic: 'theme',
    },
    {
      passage:
        'Elena practiced the piano for an hour every single day, even when she wanted to play outside. Months later, she performed a difficult song flawlessly at the school concert.',
      q: 'What does this passage suggest?',
      choices: ['Practice leads to improvement', 'Pianos are easy', 'Concerts are boring', 'Elena hated music'],
      answer: 'Practice leads to improvement',
      topic: 'theme',
    },
    {
      passage:
        'The scientists cheered as the little rover’s wheels finally turned on the dusty red surface. After a journey of seven months through space, it had landed safely and was ready to explore.',
      q: 'Where did the rover most likely land?',
      choices: ['Mars', 'The ocean', 'A rainforest', 'A city street'],
      answer: 'Mars',
      topic: 'inference',
    },
  ],
}
