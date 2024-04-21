let questions = [];
let currentIndex = 1;
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const answerElement = document.getElementById("answer");
const card = document.getElementById("card");
const cardLabel = document.getElementById("card-label");
const qnumber = document.getElementById("qnumber");

// Load questions from JSON file
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    shuffleQuestions();
    showQuestion();
  })
  .catch(error => console.error(error));


// Shuffle the questions
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

// Shuffle the options
function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
}

// Display the current question
function showQuestion() {
  if (currentIndex >= questions.length) {
    return;
  }

  const question = questions[currentIndex];
  questionElement.textContent = question.question;
  qnumber.textContent = currentIndex;

  optionsElement.innerHTML = "";
  shuffleOptions(question.options);

  for (const option of question.options) {
    const optionElement = document.createElement("button");
    optionElement.textContent = option;
    optionElement.addEventListener("click", () => {
      answerElement.textContent = question.answer;
      card.classList.add("flipped");
    });
    optionsElement.appendChild(optionElement);
  }

  answerElement.textContent = "";
  card.classList.remove("flipped");
}

// Move to the next question
function nextQuestion() {
  currentIndex++;
  showQuestion();
}

// Listen for the spacebar key press
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    nextQuestion();
  }
});