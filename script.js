// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: 2,
        userAnswer: null,
        checked: false
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1,
        userAnswer: null,
        checked: false
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        answer: 2,
        userAnswer: null,
        checked: false
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: 3,
        userAnswer: null,
        checked: false
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Iron", "Silver"],
        answer: 1,
        userAnswer: null,
        checked: false
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        answer: 1,
        userAnswer: null,
        checked: false
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "Korea", "Thailand"],
        answer: 1,
        userAnswer: null,
        checked: false
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
        answer: 2,
        userAnswer: null,
        checked: false
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        answer: 1,
        userAnswer: null,
        checked: false
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gl", "Gd", "Au"],
        answer: 3,
        userAnswer: null,
        checked: false
    }
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const scoreScreen = document.getElementById('score-screen');
const startBtn = document.getElementById('start-btn');
const checkBtn = document.getElementById('check-btn');
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
const timerDisplay = document.getElementById('timer-display');
const timerBar = document.getElementById('timer-bar');
const timerContainer = document.querySelector('.timer-container');
const timePerQuestionInput = document.getElementById('time-per-question');

// Game variables
let currentQuestion = 0;
let quizCompleted = false;
let timePerQuestion = 30; // Default time in seconds
let timer = null;
let timeLeft = 0;

// Event Listeners
startBtn.addEventListener('click', startQuiz);
checkBtn.addEventListener('click', checkAnswer);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);
reviewBtn.addEventListener('click', reviewAnswers);

// Functions
function startQuiz() {
    // Get time per question from input
    timePerQuestion = parseInt(timePerQuestionInput.value) || 30;
    
    // Ensure reasonable time limits
    if (timePerQuestion < 10) timePerQuestion = 10;
    if (timePerQuestion > 120) timePerQuestion = 120;
    
    startScreen.classList.add('hide');
    questionScreen.classList.remove('hide');
    currentQuestion = 0;
    quizCompleted = false;
    
    // Reset user answers
    questions.forEach(q => {
        q.userAnswer = null;
        q.checked = false;
    });
    
    loadQuestion();
    updateNavButtons();
    startTimer();
}

function loadQuestion() {
    // Clear any existing timer
    clearInterval(timer);
    
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
        
        // If this question has been answered and checked before, show the result
        if (question.checked && question.userAnswer !== null) {
            if (index === question.userAnswer) {
                optionElement.classList.add('selected');
                
                // Show if the answer was correct or incorrect
                if (question.userAnswer === question.answer) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                    feedbackText.textContent = "That's incorrect.";
                }
            } else if (index === question.answer && question.userAnswer !== question.answer) {
                // Highlight the correct answer if the user got it wrong
                optionElement.classList.add('correct');
            }
        } 
        // If the question has been answered but not checked, just show it as selected
        else if (!question.checked && question.userAnswer === index) {
            optionElement.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update check button state
    updateCheckButton();
    
    // Start timer if the question hasn't been checked yet
    if (!question.checked) {
        startTimer();
    } else {
        // If already checked, hide the timer
        timerContainer.classList.add('hide');
        checkBtn.disabled = true;
    }
}

function selectOption(e) {
    const question = questions[currentQuestion];
    
    // Only allow selection if the answer hasn't been checked yet
    if (!question.checked) {
        // Get selected option
        const selectedOption = e.target;
        const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
        
        // Remove previous selections
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Save the user's answer
        question.userAnswer = selectedIndex;
        
        // Highlight current selection
        selectedOption.classList.add('selected');
        
        // Enable check button
        updateCheckButton();
    }
}

function checkAnswer() {
    clearInterval(timer);
    const question = questions[currentQuestion];
    const selectedIndex = question.userAnswer;
    
    if (selectedIndex !== null) {
        question.checked = true;
        
        // Get the selected option element
        const options = document.querySelectorAll('.option');
        const selectedOption = options[selectedIndex];
        
        // Show whether the answer is correct or incorrect
        if (selectedIndex === question.answer) {
            selectedOption.classList.add('correct');
            feedbackText.textContent = "Correct!";
        } else {
            selectedOption.classList.add('incorrect');
            options[question.answer].classList.add('correct');
            feedbackText.textContent = "That's incorrect.";
        }
        
        // Disable check button
        checkBtn.disabled = true;
        
        // Hide the timer
        timerContainer.classList.add('hide');
    }
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
    
    // Change next button text on last question if quiz is not completed
    if (currentQuestion === questions.length - 1 && !quizCompleted) {
        nextBtn.textContent = "Finish Quiz";
    } else {
        nextBtn.textContent = "Next";
    }
}

function updateCheckButton() {
    const question = questions[currentQuestion];
    checkBtn.disabled = question.userAnswer === null || question.checked;
}

function startTimer() {
    // Reset time left
    timeLeft = timePerQuestion;
    
    // Show the timer container
    timerContainer.classList.remove('hide');
    timerContainer.classList.remove('timer-warning');
    
    // Update timer display
    timerDisplay.textContent = timeLeft;
    timerBar.style.width = '100%';
    
    // Clear any existing timer
    clearInterval(timer);
    
    // Start new timer
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        // Update timer bar
        const percentage = (timeLeft / timePerQuestion) * 100;
        timerBar.style.width = `${percentage}%`;
        
        // Add warning class when time is running low
        if (timeLeft <= 5) {
            timerContainer.classList.add('timer-warning');
        }
        
        // When time runs out
        if (timeLeft <= 0) {
            clearInterval(timer);
            
            // Auto-check the answer if user has selected an option
            if (questions[currentQuestion].userAnswer !== null && !questions[currentQuestion].checked) {
                checkAnswer();
            }
            
            // Move to next question after a short delay
            setTimeout(() => {
                if (currentQuestion < questions.length - 1) {
                    showNextQuestion();
                } else {
                    calculateScore();
                    showScore();
                }
            }, 1000);
        }
    }, 1000);
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
    clearInterval(timer);
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
    clearInterval(timer);
    scoreScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    currentQuestion = 0;
    questions.forEach(q => {
        q.userAnswer = null;
        q.checked = false;
    });
    quizCompleted = false;
}