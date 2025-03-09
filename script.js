// Quiz questions
const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: 2,
    userAnswer: null,
    checked: false,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
    userAnswer: null,
    checked: false,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    answer: 2,
    userAnswer: null,
    checked: false,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    answer: 3,
    userAnswer: null,
    checked: false,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Iron", "Silver"],
    answer: 1,
    userAnswer: null,
    checked: false,
  },
  {
    question: "In which year did World War II end?",
    options: ["1943", "1945", "1947", "1950"],
    answer: 1,
    userAnswer: null,
    checked: false,
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Korea", "Thailand"],
    answer: 1,
    userAnswer: null,
    checked: false,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
    answer: 2,
    userAnswer: null,
    checked: false,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    answer: 1,
    userAnswer: null,
    checked: false,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gl", "Gd", "Au"],
    answer: 3,
    userAnswer: null,
    checked: false,
  },
];

// DOM Elements
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const scoreScreen = document.getElementById("score-screen");
const startBtn = document.getElementById("start-btn");
const checkBtn = document.getElementById("check-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");
const restartBtn = document.getElementById("restart-btn");
const reviewBtn = document.getElementById("review-btn");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const scoreTitle = document.getElementById("score-title");
const scoreMessage = document.getElementById("score-message");
const feedbackText = document.getElementById("feedback-text");
const timerDisplay = document.getElementById("timer-display");
const timerBar = document.getElementById("timer-bar");
const timerContainer = document.querySelector(".timer-container");
const timePerQuestionInput = document.getElementById("time-per-question");
const questionIndicators = document.getElementById("question-indicators");
const unansweredAlert = document.getElementById("unanswered-alert");

// Game variables
let currentQuestion = 0;
let quizCompleted = false;
let timePerQuestion = 30;
let timer = null;
let timeLeft = 0;

// Event Listeners
startBtn.addEventListener("click", startQuiz);
checkBtn.addEventListener("click", checkAnswer);
prevBtn.addEventListener("click", showPreviousQuestion);
nextBtn.addEventListener("click", showNextQuestion);
finishBtn.addEventListener("click", finishQuiz);
restartBtn.addEventListener("click", restartQuiz);
reviewBtn.addEventListener("click", reviewAnswers);

// Functions
function startQuiz() {
  // Get time per question from input
  timePerQuestion = parseInt(timePerQuestionInput.value) || 30;

  // Ensure reasonable time limits
  if (timePerQuestion < 10) timePerQuestion = 10;
  if (timePerQuestion > 120) timePerQuestion = 120;

  startScreen.classList.add("hide");
  questionScreen.classList.remove("hide");
  currentQuestion = 0;
  quizCompleted = false;

  // Reset user answers
  questions.forEach((q) => {
    q.userAnswer = null;
    q.checked = false;
  });

  // Create question indicators
  createQuestionIndicators();

  loadQuestion();
  updateNavButtons();
  startTimer();
}

function createQuestionIndicators() {
  questionIndicators.innerHTML = "";

  questions.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("question-indicator");
    indicator.textContent = index + 1;
    indicator.addEventListener("click", () => {
      currentQuestion = index;
      loadQuestion();
      updateNavButtons();
    });
    questionIndicators.appendChild(indicator);
  });

  updateQuestionIndicators();
}

function updateQuestionIndicators() {
  const indicators = document.querySelectorAll(".question-indicator");

  indicators.forEach((indicator, index) => {
    indicator.classList.remove("current", "answered", "unanswered");

    if (index === currentQuestion) {
      indicator.classList.add("current");
    }

    if (questions[index].userAnswer !== null) {
      indicator.classList.add("answered");
    } else {
      indicator.classList.add("unanswered");
    }
  });
}

function loadQuestion() {
  clearInterval(timer);

  const question = questions[currentQuestion];
  questionText.textContent = question.question;

  optionsContainer.innerHTML = "";
  feedbackText.textContent = "";
  unansweredAlert.classList.add("hide");

  // Create and add options
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.textContent = option;
    optionElement.setAttribute("data-index", index);
    optionElement.addEventListener("click", selectOption);

    if (question.checked && question.userAnswer !== null) {
      if (index === question.userAnswer) {
        optionElement.classList.add("selected");

        if (question.userAnswer === question.answer) {
          optionElement.classList.add("correct");
        } else {
          optionElement.classList.add("incorrect");
          feedbackText.textContent = "That's incorrect.";
        }
      }
    } else if (!question.checked && question.userAnswer === index) {
      optionElement.classList.add("selected");
    }

    optionsContainer.appendChild(optionElement);
  });

  updateCheckButton();
  updateFinishButton();
  updateQuestionIndicators();

  if (!question.checked) {
    startTimer();
  } else {
    timerContainer.classList.add("hide");
    checkBtn.disabled = true;
  }
}

function selectOption(e) {
  const question = questions[currentQuestion];

  if (!question.checked) {
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.getAttribute("data-index"));

    document.querySelectorAll(".option").forEach((option) => {
      option.classList.remove("selected");
    });

    question.userAnswer = selectedIndex;

    selectedOption.classList.add("selected");

    updateCheckButton();

    updateQuestionIndicators();

    updateFinishButton();
  }
}

function checkAnswer() {
  clearInterval(timer);
  const question = questions[currentQuestion];
  const selectedIndex = question.userAnswer;

  if (selectedIndex !== null) {
    question.checked = true;

    const options = document.querySelectorAll(".option");
    const selectedOption = options[selectedIndex];

    if (selectedIndex === question.answer) {
      selectedOption.classList.add("correct");
      feedbackText.textContent = "Correct!";
    } else {
      selectedOption.classList.add("incorrect");

      feedbackText.textContent = "That's incorrect.";
    }

    checkBtn.disabled = true;

    timerContainer.classList.add("hide");

    updateQuestionIndicators();
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
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;

  nextBtn.disabled = currentQuestion === questions.length - 1;

  updateFinishButton();
}

function updateCheckButton() {
  const question = questions[currentQuestion];
  checkBtn.disabled = question.userAnswer === null || question.checked;
}

function updateFinishButton() {
  // Count how many questions have been answered
  const answeredCount = questions.filter((q) => q.userAnswer !== null).length;

  // Enable finish button if all questions have been answered
  finishBtn.disabled = answeredCount < questions.length;

  // Update the answered count display
  document.getElementById("answered-count").textContent = answeredCount;
  document.getElementById("total-count").textContent = questions.length;
}

function finishQuiz() {
  // Check if all questions are answered
  const unansweredQuestions = questions.filter((q) => q.userAnswer === null);

  if (unansweredQuestions.length === 0) {
    // All questions answered, show score
    calculateScore();
    showScore();
  } else {
    // Show alert with unanswered questions
    unansweredAlert.classList.remove("hide");
    unansweredAlert.innerHTML = `<p>You have ${unansweredQuestions.length} unanswered questions:</p>`;

    const list = document.createElement("ul");
    unansweredQuestions.forEach((_, index) => {
      const item = document.createElement("li");
      item.textContent = `Question ${index + 1}`;
      item.addEventListener("click", () => {
        currentQuestion = index;
        loadQuestion();
        updateNavButtons();
        unansweredAlert.classList.add("hide");
      });
      list.appendChild(item);
    });

    unansweredAlert.appendChild(list);
  }
}

function startTimer() {
  timeLeft = timePerQuestion;

  timerContainer.classList.remove("hide");
  timerContainer.classList.remove("timer-warning");

  timerDisplay.textContent = timeLeft;
  timerBar.style.width = "100%";

  clearInterval(timer);

  // Start new timer
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    const percentage = (timeLeft / timePerQuestion) * 100;
    timerBar.style.width = `${percentage}%`;

    if (timeLeft <= 5) {
      timerContainer.classList.add("timer-warning");
    }

    // When time runs out
    if (timeLeft <= 0) {
      clearInterval(timer);

      // Auto-check the answer if user has selected an option
      if (
        questions[currentQuestion].userAnswer !== null &&
        !questions[currentQuestion].checked
      ) {
        checkAnswer();
      }

      // Move to next question after a short delay
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          showNextQuestion();
        } else {
          timerContainer.classList.add("hide");
          feedbackText.textContent = "Time's up for this question!";
          updateQuestionIndicators();
        }
      }, 1000);
    }
  }, 1000);
}

function calculateScore() {
  let score = 0;
  questions.forEach((question) => {
    if (question.userAnswer === question.answer) {
      score++;
    }
  });
  return score;
}

function showScore() {
  clearInterval(timer);
  questionScreen.classList.add("hide");
  scoreScreen.classList.remove("hide");

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
  scoreScreen.classList.add("hide");
  questionScreen.classList.remove("hide");
  currentQuestion = 0;
  loadQuestion();
  updateNavButtons();
}

function restartQuiz() {
  clearInterval(timer);
  scoreScreen.classList.add("hide");
  startScreen.classList.remove("hide");
  currentQuestion = 0;
  questions.forEach((q) => {
    q.userAnswer = null;
    q.checked = false;
  });
  quizCompleted = false;
}
