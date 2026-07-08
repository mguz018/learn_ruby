// Science question bank. Multiple choice, accuracy-focused. Facts are current,
// well-established, and grade 2-6 appropriate.
// Each item: { q, choices, answer, topic }.

export const SCIENCE = {
  // L1 — Living things
  living: [
    { q: 'What do plants need to make their own food?', choices: ['Sunlight, water, and air', 'Only soil', 'Only darkness', 'Meat'], answer: 'Sunlight, water, and air', topic: 'plants' },
    { q: 'Which body part pumps blood around your body?', choices: ['The heart', 'The lungs', 'The stomach', 'The brain'], answer: 'The heart', topic: 'human body' },
    { q: 'Animals that eat only plants are called —', choices: ['herbivores', 'carnivores', 'predators', 'minerals'], answer: 'herbivores', topic: 'animals' },
    { q: 'A baby frog is called a —', choices: ['tadpole', 'puppy', 'chick', 'cub'], answer: 'tadpole', topic: 'life cycles' },
    { q: 'Which of these is a mammal?', choices: ['Dog', 'Snake', 'Frog', 'Eagle'], answer: 'Dog', topic: 'animals' },
    { q: 'What part of a plant takes in water from the soil?', choices: ['Roots', 'Flowers', 'Leaves', 'Seeds'], answer: 'Roots', topic: 'plants' },
    { q: 'Which body part do you use to breathe?', choices: ['Lungs', 'Kidneys', 'Bones', 'Skin'], answer: 'Lungs', topic: 'human body' },
    { q: 'Insects like ants and bees have how many legs?', choices: ['6', '4', '8', '2'], answer: '6', topic: 'animals' },
    { q: 'A caterpillar changes into a —', choices: ['butterfly', 'bird', 'fish', 'bee'], answer: 'butterfly', topic: 'life cycles' },
    { q: 'Fish breathe underwater using their —', choices: ['gills', 'lungs', 'fins', 'scales'], answer: 'gills', topic: 'animals' },
  ],

  // L2 — Earth & space
  earth: [
    { q: 'How many planets are in our solar system?', choices: ['8', '9', '7', '12'], answer: '8', topic: 'space' },
    { q: 'Which planet do we live on?', choices: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Earth', topic: 'space' },
    { q: 'What is the closest star to Earth?', choices: ['The Sun', 'The Moon', 'Mars', 'The North Star'], answer: 'The Sun', topic: 'space' },
    { q: 'Which planet is known as the "Red Planet"?', choices: ['Mars', 'Saturn', 'Neptune', 'Mercury'], answer: 'Mars', topic: 'space' },
    { q: 'In the water cycle, water turns into vapor and rises up. This is called —', choices: ['evaporation', 'condensation', 'gravity', 'erosion'], answer: 'evaporation', topic: 'water cycle' },
    { q: 'Rain, snow, and hail are all forms of —', choices: ['precipitation', 'evaporation', 'wind', 'sunlight'], answer: 'precipitation', topic: 'water cycle' },
    { q: 'What object orbits (goes around) the Earth?', choices: ['The Moon', 'The Sun', 'Mars', 'Jupiter'], answer: 'The Moon', topic: 'space' },
    { q: 'Most of Earth’s surface is covered by —', choices: ['water', 'sand', 'ice', 'forests'], answer: 'water', topic: 'earth' },
    { q: 'A scientist who studies the weather is called a —', choices: ['meteorologist', 'geologist', 'biologist', 'zoologist'], answer: 'meteorologist', topic: 'weather' },
    { q: 'The three main types of rock are igneous, sedimentary, and —', choices: ['metamorphic', 'plastic', 'liquid', 'frozen'], answer: 'metamorphic', topic: 'earth' },
  ],

  // L3 — Matter & energy
  matter: [
    { q: 'What are the three main states of matter?', choices: ['Solid, liquid, gas', 'Hot, warm, cold', 'Big, medium, small', 'Wood, metal, glass'], answer: 'Solid, liquid, gas', topic: 'matter' },
    { q: 'When water freezes, it becomes a —', choices: ['solid (ice)', 'gas', 'liquid', 'plasma'], answer: 'solid (ice)', topic: 'matter' },
    { q: 'When water boils, it turns into a gas called —', choices: ['water vapor (steam)', 'ice', 'oxygen', 'smoke'], answer: 'water vapor (steam)', topic: 'matter' },
    { q: 'A force that pulls objects toward the Earth is —', choices: ['gravity', 'friction', 'magnetism', 'electricity'], answer: 'gravity', topic: 'forces' },
    { q: 'Which of these is a source of light AND heat?', choices: ['The Sun', 'A mirror', 'The Moon', 'A rock'], answer: 'The Sun', topic: 'energy' },
    { q: 'A magnet attracts objects made of —', choices: ['iron', 'wood', 'plastic', 'paper'], answer: 'iron', topic: 'forces' },
    { q: 'Rubbing your hands together to feel warmth uses a force called —', choices: ['friction', 'gravity', 'magnetism', 'light'], answer: 'friction', topic: 'forces' },
    { q: 'Melting an ice cube changes it from a solid to a —', choices: ['liquid', 'gas', 'plasma', 'solid'], answer: 'liquid', topic: 'matter' },
    { q: 'Electricity that flows through wires can power a —', choices: ['light bulb', 'rock', 'leaf', 'cloud'], answer: 'light bulb', topic: 'energy' },
    { q: 'Sound is made by objects that —', choices: ['vibrate', 'freeze', 'glow', 'float'], answer: 'vibrate', topic: 'energy' },
  ],

  // L4 — Ecosystems & the body
  ecosystems: [
    { q: 'The process by which plants make food using sunlight is called —', choices: ['photosynthesis', 'digestion', 'evaporation', 'gravity'], answer: 'photosynthesis', topic: 'plants' },
    { q: 'During photosynthesis, plants release which gas that we breathe?', choices: ['Oxygen', 'Carbon dioxide only', 'Helium', 'Nitrogen only'], answer: 'Oxygen', topic: 'plants' },
    { q: 'In a food chain, the Sun’s energy first goes to —', choices: ['plants', 'lions', 'sharks', 'rocks'], answer: 'plants', topic: 'ecosystems' },
    { q: 'An animal that hunts other animals for food is a —', choices: ['predator', 'producer', 'decomposer', 'herbivore'], answer: 'predator', topic: 'ecosystems' },
    { q: 'Which body system includes your bones?', choices: ['Skeletal system', 'Digestive system', 'Nervous system', 'Water system'], answer: 'Skeletal system', topic: 'human body' },
    { q: 'Your brain and nerves are part of the —', choices: ['nervous system', 'skeletal system', 'muscular system', 'root system'], answer: 'nervous system', topic: 'human body' },
    { q: 'Bees help plants by moving pollen. This is called —', choices: ['pollination', 'digestion', 'condensation', 'reflection'], answer: 'pollination', topic: 'plants' },
    { q: 'A place where an animal naturally lives is its —', choices: ['habitat', 'predator', 'skeleton', 'planet'], answer: 'habitat', topic: 'ecosystems' },
    { q: 'Decomposers like mushrooms and bacteria help by —', choices: ['breaking down dead things', 'making sunlight', 'hunting deer', 'freezing water'], answer: 'breaking down dead things', topic: 'ecosystems' },
    { q: 'Muscles in your body help you —', choices: ['move', 'see colors only', 'grow taller only', 'breathe underwater'], answer: 'move', topic: 'human body' },
  ],

  // L5 — Cells, adaptations & deeper concepts
  advanced: [
    { q: 'The tiny building blocks that make up all living things are called —', choices: ['cells', 'atoms only', 'bricks', 'seeds'], answer: 'cells', topic: 'cells' },
    { q: 'Green plants are green because of a substance called —', choices: ['chlorophyll', 'oxygen', 'water', 'sugar'], answer: 'chlorophyll', topic: 'plants' },
    { q: 'A special feature that helps an animal survive (like a polar bear’s thick fur) is an —', choices: ['adaptation', 'invention', 'illusion', 'eclipse'], answer: 'adaptation', topic: 'adaptations' },
    { q: 'Everything around us is made of tiny particles called —', choices: ['atoms', 'planets', 'cells only', 'waves'], answer: 'atoms', topic: 'matter' },
    { q: 'Animals that are active at night are called —', choices: ['nocturnal', 'extinct', 'tropical', 'magnetic'], answer: 'nocturnal', topic: 'adaptations' },
    { q: 'Dinosaurs are no longer alive today; they are —', choices: ['extinct', 'endangered', 'nocturnal', 'reptiles only'], answer: 'extinct', topic: 'adaptations' },
    { q: 'The force that keeps planets orbiting the Sun is —', choices: ['gravity', 'friction', 'sound', 'electricity'], answer: 'gravity', topic: 'space' },
    { q: 'Water is made of hydrogen and which other element?', choices: ['Oxygen', 'Carbon', 'Iron', 'Gold'], answer: 'Oxygen', topic: 'matter' },
    { q: 'The gas humans breathe OUT is mostly —', choices: ['carbon dioxide', 'oxygen', 'helium', 'hydrogen'], answer: 'carbon dioxide', topic: 'human body' },
    { q: 'A caterpillar in a hard case changing into a butterfly is inside a —', choices: ['chrysalis', 'nest', 'shell', 'burrow'], answer: 'chrysalis', topic: 'life cycles' },
  ],
}
