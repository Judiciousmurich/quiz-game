// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: 2,
        userAnswer: null
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1,
        userAnswer: null
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: 2,
        userAnswer: null
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: 3,
        userAnswer: null
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Iron", "Silver"],
        answer: 1,
        userAnswer: null
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        answer: 1,
        userAnswer: null
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "Korea", "Thailand"],
        answer: 1,
        userAnswer: null
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
        answer: 2,
        userAnswer: null
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: 1,
        userAnswer: null
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gl", "Gd", "Au"],
        answer: 3,
        userAnswer: null
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const scoreScreen = document.getElementById('score-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const reviewBtn = document.getElementById('review-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const scoreTitle = document.getElementById('score-title');
const scoreMessage = document.getElementById('score-message');
const feedbackText = document.getElementById('feedback-text');

// Game variables
let currentQuestion = 0;
let quizCompleted = false;

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);
reviewBtn.addEventListener('click', reviewAnswers);

// Functions
function startQuiz() {
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestion = 0;
    quizCompleted = false;
    
    // Reset user answers
    questions.forEach(q => q.userAnswer = null);
    
    // Create question indicators if they don't exist
    if (!document.getElementById('question-indicators')) {
        createQuestionIndicators();
    }
    
    loadQuestion();
    updateNavButtons();
    updateQuestionIndicators();
}

function createQuestionIndicators() {
    // Create container for question indicators
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.id = 'question-indicators';
    indicatorsContainer.classList.add('question-indicators');
    
    // Create an indicator for each question
    for (let i = 0; i < questions.length; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('question-indicator');
        indicator.setAttribute('data-question', i);
        indicator.textContent = i + 1;
        
        // Add click event to jump to question
        indicator.addEventListener('click', () => {
            currentQuestion = i;
            loadQuestion();
            updateNavButtons();
            updateQuestionIndicators();
        });
        
        indicatorsContainer.appendChild(indicator);
    }
    
    // Insert indicators after the progress bar
    const progressBarContainer = document.querySelector('.progress-bar-container');
    progressBarContainer.after(indicatorsContainer);
    
    // Add status message for unanswered questions
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusMessage.classList.add('status-message');
    document.getElementById('question-indicators').after(statusMessage);
}

function updateQuestionIndicators() {
    const indicators = document.querySelectorAll('.question-indicator');
    
    // Update each indicator's appearance based on whether it's answered/current
    indicators.forEach((indicator, index) => {
        // Reset classes
        indicator.classList.remove('current', 'answered', 'unanswered');
        
        // Add appropriate class
        if (index === currentQuestion) {
            indicator.classList.add('current');
        }
        
        if (questions[index].userAnswer !== null) {
            indicator.classList.add('answered');
        } else {
            indicator.classList.add('unanswered');
        }
    });
    
    // Update status message
    updateStatusMessage();
}

function updateStatusMessage() {
    const statusMessage = document.getElementById('status-message');
    const unansweredQuestions = questions.filter(q => q.userAnswer === null);
    
    if (unansweredQuestions.length === 0) {
        statusMessage.textContent = "All questions answered! You can finish the quiz.";
        statusMessage.classList.add('all-answered');
        statusMessage.classList.remove('some-unanswered');
    } else {
        const unansweredIndexes = questions
            .map((q, index) => q.userAnswer === null ? index + 1 : null)
            .filter(index => index !== null);
        
        statusMessage.textContent = `Unanswered questions: ${unansweredIndexes.join(', ')}`;
        statusMessage.classList.add('some-unanswered');
        statusMessage.classList.remove('all-answered');
    }
}

function loadQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    
    // Update progress indicators
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
    // Clear previous options and feedback
    optionsContainer.innerHTML = '';
    feedbackText.textContent = '';
    
    // Create and add options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        optionElement.addEventListener('click', selectOption);
        
        // If this question has been answered before, show the selection
        if (question.userAnswer !== null) {
            if (index === question.userAnswer) {
                optionElement.classList.add('selected');
                
                // Show if the answer was correct or incorrect
                if (question.userAnswer === question.answer) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                    feedbackText.textContent = "That's incorrect. Try again or move to the next question.";
                }
            } else if (index === question.answer && question.userAnswer !== question.answer) {
                // Highlight the correct answer if the user got it wrong
                optionElement.classList.add('correct');
            }
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update the question indicators
    updateQuestionIndicators();
}

function selectOption(e) {
    // Get selected option
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
    const question = questions[currentQuestion];
    
    // Remove previous selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Save the user's answer
    question.userAnswer = selectedIndex;
    
    // Highlight current selection
    selectedOption.classList.add('selected');
    
    // Show feedback if answer is incorrect
    if (selectedIndex !== question.answer) {
        selectedOption.classList.add('incorrect');
        feedbackText.textContent = "That's incorrect. Try again or move to the next question.";
    } else {
        selectedOption.classList.add('correct');
        feedbackText.textContent = "";
    }
    
    // Update the question indicators and nav buttons
    updateQuestionIndicators();
    updateNavButtons();
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        updateNavButtons();
    }
}

function showNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
        updateNavButtons();
    } else {
        // If we're on the last question and the user clicks next, show the score
        calculateScore();
        showScore();
    }
}

function updateNavButtons() {
    // Disable previous button on first question
    prevBtn.disabled = currentQuestion === 0;
    
    // Check if all questions have been answered
    const allQuestionsAnswered = questions.every(q => q.userAnswer !== null);
    
    // Change next button text on last question
    if (currentQuestion === questions.length - 1 && !quizCompleted) {
        nextBtn.textContent = "Finish Quiz";
    } else {
        nextBtn.textContent = "Next";
    }
    
    // Enable the Finish button if all questions are answered
    if (currentQuestion === questions.length - 1 && !allQuestionsAnswered) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
    
    // If all questions are answered, always enable the Finish button on the last question
    if (allQuestionsAnswered && currentQuestion === questions.length - 1) {
        nextBtn.disabled = false;
    }
}

function calculateScore() {
    let score = 0;
    questions.forEach(question => {
        if (question.userAnswer === question.answer) {
            score++;
        }
    });
    return score;
}

function showScore() {
    questionScreen.classList.add('hide');
    scoreScreen.classList.remove('hide');
    
    const score = calculateScore();
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
    
    quizCompleted = true;
}

function reviewAnswers() {
    scoreScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestion = 0;
    loadQuestion();
    updateNavButtons();
}

function restartQuiz() {
    scoreScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    currentQuestion = 0;
    questions.forEach(q => q.userAnswer = null);
    quizCompleted = false;
}