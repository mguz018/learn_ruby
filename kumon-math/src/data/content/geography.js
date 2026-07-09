// Geography question bank. Multiple choice, accuracy-focused. Facts are
// well-established and grade 3-6 appropriate. Each item: { q, choices, answer, topic }.

export const GEOGRAPHY = {
  // L1 — Continents & oceans
  continents: [
    { q: 'How many continents are there on Earth?', choices: ['7', '5', '8', '10'], answer: '7', topic: 'continents' },
    { q: 'Which is the LARGEST continent?', choices: ['Asia', 'Africa', 'Europe', 'Australia'], answer: 'Asia', topic: 'continents' },
    { q: 'Which is the largest ocean?', choices: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], answer: 'Pacific Ocean', topic: 'oceans' },
    { q: 'Which continent is the coldest and covered in ice?', choices: ['Antarctica', 'Europe', 'Africa', 'Asia'], answer: 'Antarctica', topic: 'continents' },
    { q: 'On which continent is the United States located?', choices: ['North America', 'South America', 'Europe', 'Asia'], answer: 'North America', topic: 'continents' },
    { q: 'How many oceans are there on Earth?', choices: ['5', '3', '7', '4'], answer: '5', topic: 'oceans' },
    { q: 'Which continent is home to the Sahara Desert?', choices: ['Africa', 'Asia', 'Australia', 'Europe'], answer: 'Africa', topic: 'continents' },
    { q: 'The imaginary line around the middle of the Earth is the —', choices: ['Equator', 'Prime Meridian', 'Tropic', 'Border'], answer: 'Equator', topic: 'map skills' },
    { q: 'Which continent is also a single country?', choices: ['Australia', 'Africa', 'Europe', 'Asia'], answer: 'Australia', topic: 'continents' },
    { q: 'The northernmost point on Earth is the —', choices: ['North Pole', 'South Pole', 'Equator', 'Everest'], answer: 'North Pole', topic: 'map skills' },
  ],

  // L2 — U.S. states & capitals
  usa: [
    { q: 'What is the capital of the United States?', choices: ['Washington, D.C.', 'New York', 'Chicago', 'Boston'], answer: 'Washington, D.C.', topic: 'US capitals' },
    { q: 'How many states are in the United States?', choices: ['50', '48', '52', '13'], answer: '50', topic: 'US states' },
    { q: 'What is the capital of California?', choices: ['Sacramento', 'Los Angeles', 'San Francisco', 'San Diego'], answer: 'Sacramento', topic: 'US capitals' },
    { q: 'What is the capital of Texas?', choices: ['Austin', 'Houston', 'Dallas', 'El Paso'], answer: 'Austin', topic: 'US capitals' },
    { q: 'Which is the LARGEST U.S. state by area?', choices: ['Alaska', 'Texas', 'California', 'Montana'], answer: 'Alaska', topic: 'US states' },
    { q: 'Which state is a chain of islands in the Pacific?', choices: ['Hawaii', 'Florida', 'Alaska', 'Maine'], answer: 'Hawaii', topic: 'US states' },
    { q: 'What is the capital of New York State?', choices: ['Albany', 'New York City', 'Buffalo', 'Rochester'], answer: 'Albany', topic: 'US capitals' },
    { q: 'The Statue of Liberty stands in the harbor of which city?', choices: ['New York City', 'Boston', 'Miami', 'Seattle'], answer: 'New York City', topic: 'landmarks' },
    { q: 'The Grand Canyon is located in which state?', choices: ['Arizona', 'Nevada', 'Utah', 'Colorado'], answer: 'Arizona', topic: 'landmarks' },
    { q: 'Which river forms much of the border between the U.S. and Mexico?', choices: ['Rio Grande', 'Mississippi', 'Colorado', 'Hudson'], answer: 'Rio Grande', topic: 'rivers' },
  ],

  // L3 — World countries & capitals
  world: [
    { q: 'What is the capital of France?', choices: ['Paris', 'London', 'Rome', 'Madrid'], answer: 'Paris', topic: 'world capitals' },
    { q: 'What is the capital of Japan?', choices: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'], answer: 'Tokyo', topic: 'world capitals' },
    { q: 'What is the capital of Italy?', choices: ['Rome', 'Venice', 'Milan', 'Naples'], answer: 'Rome', topic: 'world capitals' },
    { q: 'What is the capital of England?', choices: ['London', 'Paris', 'Dublin', 'Berlin'], answer: 'London', topic: 'world capitals' },
    { q: 'What is the capital of Egypt?', choices: ['Cairo', 'Athens', 'Baghdad', 'Tunis'], answer: 'Cairo', topic: 'world capitals' },
    { q: 'The Eiffel Tower is located in which country?', choices: ['France', 'Italy', 'Spain', 'Germany'], answer: 'France', topic: 'landmarks' },
    { q: 'What is the capital of Canada?', choices: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], answer: 'Ottawa', topic: 'world capitals' },
    { q: 'Which country is directly south of the United States?', choices: ['Mexico', 'Canada', 'Brazil', 'Cuba'], answer: 'Mexico', topic: 'countries' },
    { q: 'The Great Wall is found in which country?', choices: ['China', 'India', 'Japan', 'Korea'], answer: 'China', topic: 'landmarks' },
    { q: 'What is the capital of Australia?', choices: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], answer: 'Canberra', topic: 'world capitals' },
  ],

  // L4 — Landforms & natural features
  landforms: [
    { q: 'What is the longest river in the world (by most measures)?', choices: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], answer: 'Nile', topic: 'rivers' },
    { q: 'What is the tallest mountain above sea level?', choices: ['Mount Everest', 'Mount Kilimanjaro', 'Denali', 'Mont Blanc'], answer: 'Mount Everest', topic: 'mountains' },
    { q: 'The largest rainforest in the world is the —', choices: ['Amazon', 'Congo', 'Sahara', 'Taiga'], answer: 'Amazon', topic: 'features' },
    { q: 'A very dry area with little rain and lots of sand is a —', choices: ['desert', 'delta', 'glacier', 'peninsula'], answer: 'desert', topic: 'features' },
    { q: 'The largest desert that is hot is the —', choices: ['Sahara', 'Gobi', 'Mojave', 'Atacama'], answer: 'Sahara', topic: 'features' },
    { q: 'A piece of land surrounded by water on all sides is an —', choices: ['island', 'isthmus', 'mountain', 'valley'], answer: 'island', topic: 'features' },
    { q: 'Melted-ice rivers that move slowly down mountains are called —', choices: ['glaciers', 'geysers', 'canyons', 'dunes'], answer: 'glaciers', topic: 'features' },
    { q: 'The Rocky Mountains are located on which continent?', choices: ['North America', 'Europe', 'Asia', 'Africa'], answer: 'North America', topic: 'mountains' },
    { q: 'A large body of salt water smaller than an ocean is a —', choices: ['sea', 'lake', 'pond', 'river'], answer: 'sea', topic: 'features' },
    { q: 'The Amazon River flows mostly through which country?', choices: ['Brazil', 'Egypt', 'India', 'Canada'], answer: 'Brazil', topic: 'rivers' },
  ],

  // L5 — Map skills & Earth
  mapskills: [
    { q: 'On a compass, which direction is opposite North?', choices: ['South', 'East', 'West', 'Up'], answer: 'South', topic: 'directions' },
    { q: 'The four main compass directions are North, South, East, and —', choices: ['West', 'Up', 'Left', 'Center'], answer: 'West', topic: 'directions' },
    { q: 'The half of Earth north of the equator is the —', choices: ['Northern Hemisphere', 'Southern Hemisphere', 'East Pole', 'Equator Zone'], answer: 'Northern Hemisphere', topic: 'hemispheres' },
    { q: 'A book of maps is called an —', choices: ['atlas', 'almanac', 'encyclopedia', 'index'], answer: 'atlas', topic: 'map skills' },
    { q: 'The small map feature that shows what symbols mean is the —', choices: ['key (legend)', 'title', 'border', 'compass'], answer: 'key (legend)', topic: 'map skills' },
    { q: 'Lines that measure distance north or south of the equator are lines of —', choices: ['latitude', 'longitude', 'altitude', 'gravity'], answer: 'latitude', topic: 'map skills' },
    { q: 'Which direction does the sun rise from?', choices: ['East', 'West', 'North', 'South'], answer: 'East', topic: 'directions' },
    { q: 'The imaginary line from the North Pole to the South Pole at 0° longitude is the —', choices: ['Prime Meridian', 'Equator', 'Tropic of Cancer', 'Date Line'], answer: 'Prime Meridian', topic: 'map skills' },
    { q: 'A model of the Earth shaped like a ball is a —', choices: ['globe', 'map', 'chart', 'graph'], answer: 'globe', topic: 'map skills' },
    { q: 'Which continent lies in BOTH the Northern and Southern Hemispheres?', choices: ['Africa', 'Europe', 'Australia', 'Antarctica'], answer: 'Africa', topic: 'hemispheres' },
  ],
}
