// Beginner Spanish question bank. Multiple choice, accuracy-focused. Basic,
// accurate vocabulary and phrases for grade 3-6 learners.
// Each item: { q, choices, answer, topic }.

export const SPANISH = {
  // L1 — Greetings & basics
  greetings: [
    { q: '"Hola" means —', choices: ['Hello', 'Goodbye', 'Please', 'Thanks'], answer: 'Hello', topic: 'greetings' },
    { q: '"Adiós" means —', choices: ['Goodbye', 'Hello', 'Yes', 'Sorry'], answer: 'Goodbye', topic: 'greetings' },
    { q: '"Gracias" means —', choices: ['Thank you', 'Please', 'Hello', 'Water'], answer: 'Thank you', topic: 'greetings' },
    { q: '"Por favor" means —', choices: ['Please', 'Thank you', 'Goodbye', 'Friend'], answer: 'Please', topic: 'greetings' },
    { q: '"Sí" means —', choices: ['Yes', 'No', 'Maybe', 'Hello'], answer: 'Yes', topic: 'basics' },
    { q: '"No" means —', choices: ['No', 'Yes', 'Please', 'Never'], answer: 'No', topic: 'basics' },
    { q: 'How do you say "Good morning" in Spanish?', choices: ['Buenos días', 'Buenas noches', 'Hola', 'Adiós'], answer: 'Buenos días', topic: 'greetings' },
    { q: '"Buenas noches" means —', choices: ['Good night', 'Good morning', 'Good afternoon', 'Hello'], answer: 'Good night', topic: 'greetings' },
    { q: 'How do you say "Thank you very much"?', choices: ['Muchas gracias', 'Por favor', 'De nada', 'Hasta luego'], answer: 'Muchas gracias', topic: 'greetings' },
    { q: '"Amigo" means —', choices: ['Friend', 'Family', 'Teacher', 'Enemy'], answer: 'Friend', topic: 'basics' },
  ],

  // L2 — Numbers & colors
  numberscolors: [
    { q: '"Uno" means —', choices: ['One', 'Two', 'Three', 'Ten'], answer: 'One', topic: 'numbers' },
    { q: '"Tres" means —', choices: ['Three', 'Two', 'Four', 'Six'], answer: 'Three', topic: 'numbers' },
    { q: '"Cinco" means —', choices: ['Five', 'Four', 'Nine', 'Seven'], answer: 'Five', topic: 'numbers' },
    { q: '"Diez" means —', choices: ['Ten', 'Eight', 'Twelve', 'Two'], answer: 'Ten', topic: 'numbers' },
    { q: 'How do you say "two" in Spanish?', choices: ['Dos', 'Doce', 'Diez', 'Tres'], answer: 'Dos', topic: 'numbers' },
    { q: '"Rojo" means —', choices: ['Red', 'Blue', 'Green', 'Yellow'], answer: 'Red', topic: 'colors' },
    { q: '"Azul" means —', choices: ['Blue', 'Black', 'Green', 'Red'], answer: 'Blue', topic: 'colors' },
    { q: '"Verde" means —', choices: ['Green', 'Purple', 'Blue', 'Orange'], answer: 'Green', topic: 'colors' },
    { q: '"Amarillo" means —', choices: ['Yellow', 'White', 'Red', 'Brown'], answer: 'Yellow', topic: 'colors' },
    { q: 'How do you say "black" in Spanish?', choices: ['Negro', 'Blanco', 'Gris', 'Rojo'], answer: 'Negro', topic: 'colors' },
  ],

  // L3 — Animals & food
  animalsfood: [
    { q: '"Perro" means —', choices: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Dog', topic: 'animals' },
    { q: '"Gato" means —', choices: ['Cat', 'Dog', 'Horse', 'Cow'], answer: 'Cat', topic: 'animals' },
    { q: '"Pájaro" means —', choices: ['Bird', 'Fish', 'Frog', 'Bear'], answer: 'Bird', topic: 'animals' },
    { q: '"Caballo" means —', choices: ['Horse', 'Cow', 'Pig', 'Sheep'], answer: 'Horse', topic: 'animals' },
    { q: '"Agua" means —', choices: ['Water', 'Milk', 'Juice', 'Bread'], answer: 'Water', topic: 'food' },
    { q: '"Manzana" means —', choices: ['Apple', 'Banana', 'Orange', 'Grape'], answer: 'Apple', topic: 'food' },
    { q: '"Pan" means —', choices: ['Bread', 'Cheese', 'Meat', 'Rice'], answer: 'Bread', topic: 'food' },
    { q: '"Leche" means —', choices: ['Milk', 'Water', 'Coffee', 'Soup'], answer: 'Milk', topic: 'food' },
    { q: 'How do you say "fish" (the animal) in Spanish?', choices: ['Pez', 'Perro', 'Pollo', 'Pan'], answer: 'Pez', topic: 'animals' },
    { q: 'How do you say "apple" in Spanish?', choices: ['Manzana', 'Naranja', 'Uva', 'Pera'], answer: 'Manzana', topic: 'food' },
  ],

  // L4 — Family & everyday words
  family: [
    { q: '"Madre" means —', choices: ['Mother', 'Father', 'Sister', 'Aunt'], answer: 'Mother', topic: 'family' },
    { q: '"Padre" means —', choices: ['Father', 'Mother', 'Brother', 'Uncle'], answer: 'Father', topic: 'family' },
    { q: '"Hermano" means —', choices: ['Brother', 'Sister', 'Cousin', 'Friend'], answer: 'Brother', topic: 'family' },
    { q: '"Hermana" means —', choices: ['Sister', 'Brother', 'Mother', 'Daughter'], answer: 'Sister', topic: 'family' },
    { q: '"Casa" means —', choices: ['House', 'School', 'Car', 'Store'], answer: 'House', topic: 'everyday' },
    { q: '"Escuela" means —', choices: ['School', 'House', 'Park', 'Church'], answer: 'School', topic: 'everyday' },
    { q: '"Libro" means —', choices: ['Book', 'Pencil', 'Desk', 'Bag'], answer: 'Book', topic: 'everyday' },
    { q: '"Gracias" is to "thank you" as "familia" is to —', choices: ['Family', 'Friend', 'House', 'School'], answer: 'Family', topic: 'family' },
    { q: 'How do you say "dog" in Spanish? (family pet review)', choices: ['Perro', 'Gato', 'Casa', 'Padre'], answer: 'Perro', topic: 'everyday' },
    { q: '"Niño" means —', choices: ['Boy', 'Girl', 'Man', 'Baby'], answer: 'Boy', topic: 'family' },
  ],

  // L5 — Useful phrases
  phrases: [
    { q: 'How do you ask "How are you?" in Spanish?', choices: ['¿Cómo estás?', '¿Qué hora es?', '¿Dónde está?', '¿Cuántos años?'], answer: '¿Cómo estás?', topic: 'phrases' },
    { q: '"Me llamo Ana" means —', choices: ['My name is Ana', 'I like Ana', 'Where is Ana?', 'Goodbye Ana'], answer: 'My name is Ana', topic: 'phrases' },
    { q: '"De nada" means —', choices: ["You're welcome", 'Good night', 'See you later', 'Excuse me'], answer: "You're welcome", topic: 'phrases' },
    { q: 'How do you say "See you later"?', choices: ['Hasta luego', 'Buenos días', 'Por favor', 'Muy bien'], answer: 'Hasta luego', topic: 'phrases' },
    { q: '"Muy bien" means —', choices: ['Very good', 'Very bad', 'Not much', 'Good night'], answer: 'Very good', topic: 'phrases' },
    { q: 'How do you say "Please" politely in Spanish?', choices: ['Por favor', 'Gracias', 'Perdón', 'Adiós'], answer: 'Por favor', topic: 'phrases' },
    { q: '"¿Qué tal?" is a friendly way to ask —', choices: ["How's it going?", 'What time is it?', 'How old are you?', 'Where are you?'], answer: "How's it going?", topic: 'phrases' },
    { q: '"Buenas tardes" means —', choices: ['Good afternoon', 'Good morning', 'Good night', 'Goodbye'], answer: 'Good afternoon', topic: 'phrases' },
    { q: 'How do you say "I don\'t understand"?', choices: ['No entiendo', 'No gracias', 'No hay', 'No es'], answer: 'No entiendo', topic: 'phrases' },
    { q: '"Perdón" is used to say —', choices: ['Sorry / Excuse me', 'Hello', 'Thank you', 'Goodbye'], answer: 'Sorry / Excuse me', topic: 'phrases' },
  ],
}
