// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: 3
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Iron", "Silver"],
        answer: 1
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        answer: 1
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "Korea", "Thailand"],
        answer: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
        answer: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gl", "Gd", "Au"],
        answer: 3
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const progressScreen = document.getElementById('progress-screen');
const scoreScreen = document.getElementById('score-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const scoreTitle = document.getElementById('score-title');
const scoreMessage = document.getElementById('score-message');

// Game variables
let currentQuestion = 0;
let score = 0;
let userAnswer = null;

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Functions
function startQuiz() {
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create and add options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });
}

function selectOption(e) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    // Get selected option
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
    userAnswer = selectedIndex;

    // Highlight current selection
    selectedOption.classList.add('selected');

    // Show correct/incorrect feedback
    const correctIndex = questions[currentQuestion].answer;

    if (selectedIndex === correctIndex) {
        selectedOption.classList.add('correct');
        score++;
    } else {
        selectedOption.classList.add('incorrect');
        const correctOption = document.querySelector(`.option[data-index="${correctIndex}"]`);
        correctOption.classList.add('correct');
    }

    // Disable further selections
    document.querySelectorAll('.option').forEach(option => {
        option.removeEventListener('click', selectOption);
    });

    // Show progress screen after a short delay
    setTimeout(() => {
        questionScreen.classList.add('hide');
        progressScreen.classList.remove('hide');
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    }, 1000);
}

function showNextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        progressScreen.classList.add('hide');
        questionScreen.classList.remove('hide');
        loadQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    progressScreen.classList.add('hide');
    scoreScreen.classList.remove('hide');
    scoreTitle.textContent = `Your Score: ${score}/${questions.length}`;

    // Set appropriate message based on score
    if (score === questions.length) {
        scoreMessage.textContent = "Perfect! You're a quiz master!";
    } else if (score >= questions.length * 0.7) {
        scoreMessage.textContent = "Great job! Try again to beat your score!";
    } else if (score >= questions.length * 0.5) {
        scoreMessage.textContent = "Good effort! Keep practicing!";
    } else {
        scoreMessage.textContent = "Nice try! Better luck next time!";
    }
}

function restartQuiz() {
    scoreScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    currentQuestion = 0;
    score = 0;
}
