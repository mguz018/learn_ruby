// Money & Financial Literacy question bank. Multiple choice, accuracy-focused.
// U.S. coins/bills and basic money smarts, grade 3-6. { q, choices, answer, topic }.

export const MONEY = {
  // L1 — Coins & bills
  coins: [
    { q: 'How many cents is a quarter worth?', choices: ['25¢', '10¢', '5¢', '50¢'], answer: '25¢', topic: 'coins' },
    { q: 'How many cents is a dime worth?', choices: ['10¢', '5¢', '25¢', '1¢'], answer: '10¢', topic: 'coins' },
    { q: 'How many cents is a nickel worth?', choices: ['5¢', '10¢', '1¢', '25¢'], answer: '5¢', topic: 'coins' },
    { q: 'How many cents is a penny worth?', choices: ['1¢', '5¢', '10¢', '2¢'], answer: '1¢', topic: 'coins' },
    { q: 'How many cents are in one dollar?', choices: ['100¢', '50¢', '10¢', '25¢'], answer: '100¢', topic: 'coins' },
    { q: 'How many quarters make one dollar?', choices: ['4', '2', '5', '10'], answer: '4', topic: 'coins' },
    { q: 'How many dimes make one dollar?', choices: ['10', '5', '4', '20'], answer: '10', topic: 'coins' },
    { q: 'Two quarters equal how many cents?', choices: ['50¢', '25¢', '40¢', '75¢'], answer: '50¢', topic: 'coins' },
    { q: 'How many nickels make 25 cents?', choices: ['5', '4', '2', '10'], answer: '5', topic: 'coins' },
    { q: 'A dime plus a nickel equals —', choices: ['15¢', '10¢', '20¢', '25¢'], answer: '15¢', topic: 'coins' },
  ],

  // L2 — Making change & adding money
  change: [
    { q: 'You pay $1 for a 75¢ snack. How much change?', choices: ['25¢', '15¢', '35¢', '50¢'], answer: '25¢', topic: 'change' },
    { q: 'A toy costs 60¢. You pay with a dollar. Your change is —', choices: ['40¢', '30¢', '50¢', '60¢'], answer: '40¢', topic: 'change' },
    { q: 'You have 3 quarters. How much money is that?', choices: ['75¢', '50¢', '60¢', '$1'], answer: '75¢', topic: 'counting' },
    { q: 'A pencil is 30¢ and an eraser is 20¢. Total?', choices: ['50¢', '40¢', '60¢', '55¢'], answer: '50¢', topic: 'adding' },
    { q: 'You have $5 and spend $2. How much is left?', choices: ['$3', '$2', '$7', '$4'], answer: '$3', topic: 'change' },
    { q: 'Two dollars and three quarters equal —', choices: ['$2.75', '$2.25', '$3.00', '$2.50'], answer: '$2.75', topic: 'counting' },
    { q: 'A book costs $4. You pay with a $10 bill. Change?', choices: ['$6', '$5', '$4', '$14'], answer: '$6', topic: 'change' },
    { q: 'You save 50¢ each week. After 4 weeks you have —', choices: ['$2.00', '$1.50', '$2.50', '$1.00'], answer: '$2.00', topic: 'saving' },
    { q: 'A dollar bill plus two quarters is —', choices: ['$1.50', '$1.25', '$2.00', '$1.75'], answer: '$1.50', topic: 'counting' },
    { q: 'Which is the MOST money?', choices: ['3 quarters', '5 dimes', '10 nickels', '50 pennies'], answer: '3 quarters', topic: 'comparing' },
  ],

  // L3 — Saving & spending
  saving: [
    { q: 'Something you NEED to live is a —', choices: ['need', 'want', 'wish', 'toy'], answer: 'need', topic: 'needs vs wants' },
    { q: 'Which of these is a WANT, not a need?', choices: ['A video game', 'Food', 'Water', 'A warm coat in winter'], answer: 'A video game', topic: 'needs vs wants' },
    { q: 'Putting money away to use later is called —', choices: ['saving', 'spending', 'borrowing', 'losing'], answer: 'saving', topic: 'saving' },
    { q: 'A plan for how to use your money is a —', choices: ['budget', 'coin', 'store', 'bank'], answer: 'budget', topic: 'budgeting' },
    { q: 'A safe place to keep and grow your money is a —', choices: ['bank', 'pocket', 'trash can', 'toy box'], answer: 'bank', topic: 'banking' },
    { q: 'If you want a $10 toy and save $2 a week, how many weeks to save enough?', choices: ['5 weeks', '2 weeks', '10 weeks', '8 weeks'], answer: '5 weeks', topic: 'saving' },
    { q: 'Doing chores or a job to get money is called —', choices: ['earning', 'spending', 'wasting', 'wishing'], answer: 'earning', topic: 'earning' },
    { q: 'Which is a smart money choice?', choices: ['Save some of your money', 'Spend it all right away', 'Lose it', 'Give it all away by accident'], answer: 'Save some of your money', topic: 'smart choices' },
    { q: 'Money you get regularly for chores is often called an —', choices: ['allowance', 'account', 'amount', 'apple'], answer: 'allowance', topic: 'earning' },
    { q: 'Comparing prices to get the best deal is being a smart —', choices: ['shopper', 'saver only', 'spender', 'banker'], answer: 'shopper', topic: 'smart choices' },
  ],

  // L4 — Money smarts
  smarts: [
    { q: 'Extra money a bank pays you for saving is called —', choices: ['interest', 'a tax', 'a fee', 'change'], answer: 'interest', topic: 'banking' },
    { q: 'A card that spends money you already have in the bank is a —', choices: ['debit card', 'credit card', 'gift card', 'library card'], answer: 'debit card', topic: 'banking' },
    { q: 'Borrowing money now that you must pay back later uses —', choices: ['credit', 'coins', 'savings', 'change'], answer: 'credit', topic: 'credit' },
    { q: 'Money the government collects to pay for roads and schools is called —', choices: ['taxes', 'tips', 'interest', 'change'], answer: 'taxes', topic: 'taxes' },
    { q: 'The money you have left after spending is your —', choices: ['savings', 'debt', 'bill', 'price'], answer: 'savings', topic: 'saving' },
    { q: 'Giving some money to help others is called —', choices: ['donating', 'earning', 'saving', 'buying'], answer: 'donating', topic: 'giving' },
    { q: 'A small extra amount you leave for good service at a restaurant is a —', choices: ['tip', 'tax', 'fine', 'sale'], answer: 'tip', topic: 'spending' },
    { q: 'When something you want is cheaper than usual, it is on —', choices: ['sale', 'credit', 'interest', 'loan'], answer: 'sale', topic: 'spending' },
    { q: 'Owing money that you have to pay back is called —', choices: ['debt', 'savings', 'profit', 'allowance'], answer: 'debt', topic: 'credit' },
    { q: 'A goal like "save $20 for a gift" is a —', choices: ['savings goal', 'shopping list', 'price tag', 'receipt'], answer: 'savings goal', topic: 'saving' },
  ],
}
