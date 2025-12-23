// Prize ladder structure
export const PRIZE_LADDER = [
    { level: 1, amount: '₹1,000', isMilestone: false },
    { level: 2, amount: '₹2,000', isMilestone: false },
    { level: 3, amount: '₹3,000', isMilestone: false },
    { level: 4, amount: '₹5,000', isMilestone: true },
    { level: 5, amount: '₹10,000', isMilestone: false },
    { level: 6, amount: '₹20,000', isMilestone: false },
    { level: 7, amount: '₹40,000', isMilestone: true },
    { level: 8, amount: '₹80,000', isMilestone: false },
    { level: 9, amount: '₹1,60,000', isMilestone: false },
    { level: 10, amount: '₹3,20,000', isMilestone: true },
    { level: 11, amount: '₹6,40,000', isMilestone: false },
    { level: 12, amount: '₹12,50,000', isMilestone: true },
    { level: 13, amount: '₹25,00,000', isMilestone: false },
    { level: 14, amount: '₹1 Crore', isMilestone: true },
    { level: 15, amount: '₹7 Crores', isMilestone: true },
];

// Questions data - 15 questions with increasing difficulty
export const QUESTIONS = [
    {
        id: 1,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1, // Index of correct option (0-based)
    },
    {
        id: 2,
        question: 'What is the capital city of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
    },
    {
        id: 3,
        question: 'Who wrote the play "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 1,
    },
    {
        id: 4,
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
    },
    {
        id: 5,
        question: 'Which ocean is the largest?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
    },
    {
        id: 6,
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
    },
    {
        id: 7,
        question: 'What is the smallest prime number?',
        options: ['0', '1', '2', '3'],
        correctAnswer: 2,
    },
    {
        id: 8,
        question: 'Which gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
    },
    {
        id: 9,
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
        correctAnswer: 2,
    },
    {
        id: 10,
        question: 'What is the speed of light in vacuum (approximately)?',
        options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
        correctAnswer: 0,
    },
    {
        id: 11,
        question: 'Which programming language was created by Guido van Rossum?',
        options: ['Java', 'Python', 'JavaScript', 'C++'],
        correctAnswer: 1,
    },
    {
        id: 12,
        question: 'What is the molecular formula for water?',
        options: ['H2O2', 'H2O', 'HO2', 'H3O'],
        correctAnswer: 1,
    },
    {
        id: 13,
        question: 'In which year was the first iPhone released?',
        options: ['2005', '2006', '2007', '2008'],
        correctAnswer: 2,
    },
    {
        id: 14,
        question: 'What is the largest mammal in the world?',
        options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
        correctAnswer: 1,
    },
    {
        id: 15,
        question: 'Who discovered the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Galileo Galilei'],
        correctAnswer: 1,
    },
];

