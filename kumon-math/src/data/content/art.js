// Art question bank. Multiple choice, accuracy-focused. Colors, art terms, and
// famous artists, grade 3-6. { q, choices, answer, topic }.

export const ART = {
  // L1 — Colors
  colors: [
    { q: 'Which are the three PRIMARY colors?', choices: ['Red, yellow, blue', 'Green, orange, purple', 'Black, white, gray', 'Pink, brown, teal'], answer: 'Red, yellow, blue', topic: 'color' },
    { q: 'Red + yellow makes —', choices: ['orange', 'green', 'purple', 'brown'], answer: 'orange', topic: 'mixing' },
    { q: 'Blue + yellow makes —', choices: ['green', 'orange', 'purple', 'red'], answer: 'green', topic: 'mixing' },
    { q: 'Red + blue makes —', choices: ['purple', 'green', 'orange', 'yellow'], answer: 'purple', topic: 'mixing' },
    { q: 'Green, orange, and purple are called —', choices: ['secondary colors', 'primary colors', 'warm colors', 'shades'], answer: 'secondary colors', topic: 'color' },
    { q: 'Which is a WARM color?', choices: ['Red', 'Blue', 'Green', 'Purple'], answer: 'Red', topic: 'color' },
    { q: 'Which is a COOL color?', choices: ['Blue', 'Red', 'Orange', 'Yellow'], answer: 'Blue', topic: 'color' },
    { q: 'Adding white to a color makes a lighter —', choices: ['tint', 'shade', 'line', 'shape'], answer: 'tint', topic: 'color' },
    { q: 'Adding black to a color makes a darker —', choices: ['shade', 'tint', 'texture', 'form'], answer: 'shade', topic: 'color' },
    { q: 'Colors opposite each other on the color wheel are —', choices: ['complementary', 'primary', 'neutral', 'pastel'], answer: 'complementary', topic: 'color' },
  ],

  // L2 — Art terms
  terms: [
    { q: 'A picture of a person, especially their face, is a —', choices: ['portrait', 'landscape', 'still life', 'collage'], answer: 'portrait', topic: 'genres' },
    { q: 'A painting of nature, like mountains and fields, is a —', choices: ['landscape', 'portrait', 'sculpture', 'sketch'], answer: 'landscape', topic: 'genres' },
    { q: 'Art you can walk around because it is 3-D is a —', choices: ['sculpture', 'painting', 'drawing', 'photo'], answer: 'sculpture', topic: 'forms' },
    { q: 'How a surface feels or looks like it feels (rough, smooth) is its —', choices: ['texture', 'value', 'line', 'hue'], answer: 'texture', topic: 'elements' },
    { q: 'A mark that connects two points and can be straight or curvy is a —', choices: ['line', 'shape', 'color', 'form'], answer: 'line', topic: 'elements' },
    { q: 'A flat, enclosed area like a circle or square is a —', choices: ['shape', 'line', 'texture', 'value'], answer: 'shape', topic: 'elements' },
    { q: 'Artwork made by gluing paper, photos, and objects together is a —', choices: ['collage', 'portrait', 'mural', 'statue'], answer: 'collage', topic: 'forms' },
    { q: 'A large painting made directly on a wall is a —', choices: ['mural', 'sketch', 'sculpture', 'collage'], answer: 'mural', topic: 'forms' },
    { q: 'A quick, rough drawing is called a —', choices: ['sketch', 'sculpture', 'frame', 'palette'], answer: 'sketch', topic: 'process' },
    { q: 'The board an artist mixes paint colors on is a —', choices: ['palette', 'canvas', 'easel', 'frame'], answer: 'palette', topic: 'tools' },
  ],

  // L3 — Famous artists & works
  artists: [
    { q: 'Who painted the famous "Mona Lisa"?', choices: ['Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso', 'Claude Monet'], answer: 'Leonardo da Vinci', topic: 'artists' },
    { q: 'Who painted "The Starry Night"?', choices: ['Vincent van Gogh', 'Leonardo da Vinci', 'Michelangelo', 'Frida Kahlo'], answer: 'Vincent van Gogh', topic: 'artists' },
    { q: 'Which artist is famous for cubism and shapes, like "Guernica"?', choices: ['Pablo Picasso', 'Claude Monet', 'Rembrandt', 'Georgia O’Keeffe'], answer: 'Pablo Picasso', topic: 'artists' },
    { q: 'Michelangelo painted the ceiling of which famous chapel?', choices: ['The Sistine Chapel', 'The Eiffel Tower', 'The White House', 'The Louvre'], answer: 'The Sistine Chapel', topic: 'artists' },
    { q: 'Georgia O’Keeffe is best known for painting large —', choices: ['flowers', 'battles', 'cars', 'castles'], answer: 'flowers', topic: 'artists' },
    { q: 'Claude Monet helped start which art movement?', choices: ['Impressionism', 'Cubism', 'Pop Art', 'Realism'], answer: 'Impressionism', topic: 'movements' },
    { q: 'Frida Kahlo is famous for painting many —', choices: ['self-portraits', 'landscapes', 'buildings', 'cartoons'], answer: 'self-portraits', topic: 'artists' },
    { q: 'The famous museum in Paris that holds the Mona Lisa is the —', choices: ['Louvre', 'Colosseum', 'Big Ben', 'Guggenheim'], answer: 'Louvre', topic: 'museums' },
    { q: 'Vincent van Gogh is known for bold colors and thick —', choices: ['brushstrokes', 'photographs', 'letters', 'sculptures'], answer: 'brushstrokes', topic: 'artists' },
    { q: 'Andy Warhol was famous for a colorful style called —', choices: ['Pop Art', 'Impressionism', 'Cubism', 'Realism'], answer: 'Pop Art', topic: 'movements' },
  ],

  // L4 — Techniques & tools
  techniques: [
    { q: 'Shaping clay into a bowl or figure is called —', choices: ['sculpting', 'sketching', 'framing', 'printing'], answer: 'sculpting', topic: 'techniques' },
    { q: 'Paint that mixes with water and dries light and see-through is —', choices: ['watercolor', 'oil paint', 'clay', 'charcoal'], answer: 'watercolor', topic: 'media' },
    { q: 'A stand that holds a canvas while you paint is an —', choices: ['easel', 'anvil', 'oven', 'apron'], answer: 'easel', topic: 'tools' },
    { q: 'Pressing a carved shape in ink onto paper to make copies is —', choices: ['printmaking', 'painting', 'weaving', 'sculpting'], answer: 'printmaking', topic: 'techniques' },
    { q: 'The surface (often cloth) that artists paint on is a —', choices: ['canvas', 'palette', 'kiln', 'chisel'], answer: 'canvas', topic: 'tools' },
    { q: 'Drawing with a soft, black burnt stick is drawing with —', choices: ['charcoal', 'crayon', 'ink pen', 'chalk paint'], answer: 'charcoal', topic: 'media' },
    { q: 'Art made from small tiles or pieces of glass is a —', choices: ['mosaic', 'mural', 'sketch', 'sculpture'], answer: 'mosaic', topic: 'forms' },
    { q: 'Folding paper into shapes like a crane is the art of —', choices: ['origami', 'collage', 'pottery', 'printing'], answer: 'origami', topic: 'techniques' },
    { q: 'Shading to make a drawing look 3-D uses light and —', choices: ['shadow', 'glue', 'water', 'sound'], answer: 'shadow', topic: 'techniques' },
    { q: 'A special oven used to harden clay pottery is a —', choices: ['kiln', 'easel', 'palette', 'loom'], answer: 'kiln', topic: 'tools' },
  ],
}
