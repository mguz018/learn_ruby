// History question bank. Multiple choice, accuracy-focused. Facts are kept to
// well-established, unambiguous points appropriate for grades 2-6.
// Each item: { q, choices, answer, topic }.

export const HISTORY = {
  // L1 — U.S. symbols & basics
  symbols: [
    { q: 'Who was the FIRST president of the United States?', choices: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams'], answer: 'George Washington', topic: 'presidents' },
    { q: 'How many stars are on the U.S. flag today?', choices: ['50', '13', '48', '100'], answer: '50', topic: 'flag' },
    { q: 'What do the 50 stars on the flag stand for?', choices: ['The 50 states', 'The 50 presidents', '50 wars', '50 colonies'], answer: 'The 50 states', topic: 'flag' },
    { q: 'What do the 13 stripes on the flag stand for?', choices: ['The 13 original colonies', '13 presidents', '13 states today', '13 wars'], answer: 'The 13 original colonies', topic: 'flag' },
    { q: 'What is the capital of the United States?', choices: ['Washington, D.C.', 'New York City', 'Los Angeles', 'Boston'], answer: 'Washington, D.C.', topic: 'geography' },
    { q: 'Which country GAVE the Statue of Liberty to the United States?', choices: ['France', 'England', 'Spain', 'Canada'], answer: 'France', topic: 'monuments' },
    { q: 'On July 4th, Americans celebrate —', choices: ['Independence Day', 'New Year’s Day', 'Thanksgiving', 'Labor Day'], answer: 'Independence Day', topic: 'holidays' },
    { q: 'Which bird is a national symbol of the United States?', choices: ['Bald eagle', 'Penguin', 'Robin', 'Turkey'], answer: 'Bald eagle', topic: 'symbols' },
    { q: 'The famous cracked bell in Philadelphia is called the —', choices: ['Liberty Bell', 'Big Ben', 'Freedom Bell', 'Church Bell'], answer: 'Liberty Bell', topic: 'monuments' },
    { q: 'Whose faces are carved on Mount Rushmore? (all are —)', choices: ['U.S. presidents', 'explorers', 'inventors', 'kings'], answer: 'U.S. presidents', topic: 'monuments' },
  ],

  // L2 — Explorers & early America
  explorers: [
    { q: 'In 1492, who sailed across the Atlantic Ocean and reached the Americas?', choices: ['Christopher Columbus', 'George Washington', 'Neil Armstrong', 'Marco Polo'], answer: 'Christopher Columbus', topic: 'explorers' },
    { q: 'What was the name of the ship that carried the Pilgrims to America in 1620?', choices: ['The Mayflower', 'The Santa Maria', 'The Titanic', 'The Nina'], answer: 'The Mayflower', topic: 'pilgrims' },
    { q: 'The Pilgrims and Wampanoag people shared a harvest feast we now remember as the first —', choices: ['Thanksgiving', 'Fourth of July', 'Halloween', 'Election Day'], answer: 'Thanksgiving', topic: 'pilgrims' },
    { q: 'Native Americans were the FIRST people to live in —', choices: ['the Americas', 'Europe', 'Africa', 'Australia'], answer: 'the Americas', topic: 'native peoples' },
    { q: 'Sacagawea is famous for helping guide which expedition?', choices: ['Lewis and Clark', 'Columbus', 'The Pilgrims', 'The Wright Brothers'], answer: 'Lewis and Clark', topic: 'exploration' },
    { q: 'The Pilgrims first settled at a colony called —', choices: ['Plymouth', 'Chicago', 'Miami', 'Denver'], answer: 'Plymouth', topic: 'pilgrims' },
    { q: 'How many original colonies did England have in America?', choices: ['13', '50', '7', '20'], answer: '13', topic: 'colonies' },
    { q: 'Explorers in the 1400s and 1500s were often searching for new —', choices: ['trade routes', 'video games', 'railroads', 'airplanes'], answer: 'trade routes', topic: 'explorers' },
    { q: 'Which ocean did European explorers cross to reach the Americas?', choices: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'], answer: 'Atlantic Ocean', topic: 'geography' },
    { q: 'The people already living in America when Europeans arrived are called —', choices: ['Native Americans', 'Colonists', 'Pilgrims', 'Explorers'], answer: 'Native Americans', topic: 'native peoples' },
  ],

  // L3 — Revolution & founding
  revolution: [
    { q: 'The Declaration of Independence was signed in what year?', choices: ['1776', '1492', '1865', '1900'], answer: '1776', topic: 'founding' },
    { q: 'Who was the main author of the Declaration of Independence?', choices: ['Thomas Jefferson', 'George Washington', 'Ben Franklin', 'John Hancock'], answer: 'Thomas Jefferson', topic: 'founding' },
    { q: 'The American colonies fought for independence from which country?', choices: ['Great Britain', 'France', 'Spain', 'Mexico'], answer: 'Great Britain', topic: 'revolution' },
    { q: 'Benjamin Franklin is famous for an experiment with a kite and —', choices: ['lightning (electricity)', 'gravity', 'magnets', 'sound'], answer: 'lightning (electricity)', topic: 'founders' },
    { q: 'Who led the American army during the Revolutionary War?', choices: ['George Washington', 'Abraham Lincoln', 'Paul Revere', 'Thomas Edison'], answer: 'George Washington', topic: 'revolution' },
    { q: 'Paul Revere is famous for his midnight ride to warn that —', choices: ['the British were coming', 'a storm was near', 'school was closed', 'gold was found'], answer: 'the British were coming', topic: 'revolution' },
    { q: 'The document that begins "We the People" and set up the U.S. government is the —', choices: ['Constitution', 'Declaration of Independence', 'Bill of Sale', 'Mayflower Compact'], answer: 'Constitution', topic: 'founding' },
    { q: 'The first ten amendments to the Constitution are called the —', choices: ['Bill of Rights', 'Ten Commandments', 'Rule Book', 'Magna Carta'], answer: 'Bill of Rights', topic: 'founding' },
    { q: 'On which day in 1776 is Independence adopted (Independence Day)?', choices: ['July 4', 'December 25', 'January 1', 'November 11'], answer: 'July 4', topic: 'founding' },
    { q: 'A country ruled by elected leaders chosen by the people is a —', choices: ['democracy', 'kingdom', 'colony', 'castle'], answer: 'democracy', topic: 'government' },
  ],

  // L4 — Growing nation, Civil War & civil rights
  nation: [
    { q: 'Who was president during the American Civil War?', choices: ['Abraham Lincoln', 'George Washington', 'Franklin Roosevelt', 'John Adams'], answer: 'Abraham Lincoln', topic: 'civil war' },
    { q: 'The Civil War (1861–1865) was fought mainly over —', choices: ['slavery and keeping the country together', 'taxes on tea', 'land in Europe', 'oil'], answer: 'slavery and keeping the country together', topic: 'civil war' },
    { q: 'Harriet Tubman is famous for helping enslaved people escape using the —', choices: ['Underground Railroad', 'Pony Express', 'first airplane', 'Erie Canal'], answer: 'Underground Railroad', topic: 'civil rights' },
    { q: 'Abraham Lincoln’s Emancipation Proclamation helped to —', choices: ['free enslaved people', 'start a railroad', 'build the White House', 'end World War II'], answer: 'free enslaved people', topic: 'civil war' },
    { q: 'Rosa Parks became famous for refusing to give up her seat on a —', choices: ['bus', 'train', 'plane', 'boat'], answer: 'bus', topic: 'civil rights' },
    { q: 'Dr. Martin Luther King Jr. is best known for his "I Have a ___" speech.', choices: ['Dream', 'Plan', 'Book', 'Song'], answer: 'Dream', topic: 'civil rights' },
    { q: 'The Wright Brothers built and flew the first powered —', choices: ['airplane', 'car', 'rocket', 'submarine'], answer: 'airplane', topic: 'inventions' },
    { q: 'Thomas Edison is famous for inventing a practical —', choices: ['light bulb', 'telephone', 'car', 'computer'], answer: 'light bulb', topic: 'inventions' },
    { q: 'In 1969, Neil Armstrong became the first person to walk on the —', choices: ['Moon', 'Mars', 'Sun', 'ocean floor'], answer: 'Moon', topic: 'space' },
    { q: 'Amelia Earhart was a famous pioneer in —', choices: ['flying airplanes', 'painting', 'baseball', 'medicine'], answer: 'flying airplanes', topic: 'inventions' },
  ],

  // L5 — World history & ancient civilizations
  ancient: [
    { q: 'The ancient pyramids and pharaohs are from which civilization?', choices: ['Egypt', 'Rome', 'Greece', 'China'], answer: 'Egypt', topic: 'ancient egypt' },
    { q: 'Ancient Egypt grew up along which great river?', choices: ['The Nile', 'The Amazon', 'The Mississippi', 'The Thames'], answer: 'The Nile', topic: 'ancient egypt' },
    { q: 'The Great Wall was built to protect which country?', choices: ['China', 'Egypt', 'Italy', 'Greece'], answer: 'China', topic: 'ancient china' },
    { q: 'The Olympic Games began in ancient —', choices: ['Greece', 'Egypt', 'England', 'Peru'], answer: 'Greece', topic: 'ancient greece' },
    { q: 'The Colosseum, where gladiators once fought, is in which ancient city?', choices: ['Rome', 'Athens', 'Cairo', 'London'], answer: 'Rome', topic: 'ancient rome' },
    { q: 'The idea of democracy (rule by the people) began in ancient —', choices: ['Greece', 'Egypt', 'China', 'Mexico'], answer: 'Greece', topic: 'ancient greece' },
    { q: 'Ancient Egyptians wrote using picture symbols called —', choices: ['hieroglyphics', 'emojis', 'letters', 'numbers'], answer: 'hieroglyphics', topic: 'ancient egypt' },
    { q: 'The Maya and Aztec civilizations built pyramids in —', choices: ['the Americas', 'Africa', 'Australia', 'Antarctica'], answer: 'the Americas', topic: 'ancient americas' },
    { q: 'Mummies were made by the ancient people of —', choices: ['Egypt', 'Ireland', 'Canada', 'Norway'], answer: 'Egypt', topic: 'ancient egypt' },
    { q: 'A leader (king) of ancient Egypt was called a —', choices: ['pharaoh', 'president', 'senator', 'knight'], answer: 'pharaoh', topic: 'ancient egypt' },
  ],
}
