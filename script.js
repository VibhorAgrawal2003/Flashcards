let flashcards = [];
let flowercards = [];
let currentIndex = 0;
let repeatQueue = [];
let showingFront = true;
let isAnimating = false;

const flashcardElement = document.getElementById("flashcard");
const frontElement = flashcardElement.querySelector(".front");
const backElement = flashcardElement.querySelector(".back");
const fontSelect = document.getElementById("font-select");
const sampleText = document.getElementById("sample-text");

document.getElementById("upload").addEventListener("change", handleFileUpload);
document.addEventListener("keydown", handleKeyDown);
fontSelect.addEventListener("change", changeFontStyle);
window.addEventListener('load', loadDefaultFile);
window.addEventListener('load', updateSidebar);

function changeFontStyle() {
  const selectedFont = fontSelect.value;
  document.querySelector(".front").style.fontFamily = selectedFont;
  document.querySelector(".back").style.fontFamily = selectedFont;
}

function loadDefaultFile() {
  const defaultFilePath = 'sample/flowers.json';

  fetch(defaultFilePath)
    .then(response => response.json())
    .then(data => {
      flashcards = shuffle(data);
      currentIndex = 0;
      repeatQueue = [];
      showCard();
    })
    .catch(err => {
      alert("Failed to load the default file.");
      console.error(err);
    });
}

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        flashcards = shuffle(data);
        currentIndex = 0;
        repeatQueue = [];
        showCard();
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  } else {
    loadDefaultFile();
  }
  event.target.blur();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showCard() {
  if (currentIndex < flashcards.length) {
    const card = flashcards[currentIndex];
    frontElement.textContent = card.front;
    backElement.textContent = card.back;
    showingFront = true;
    isAnimating = false;
  } else {
    alert("All cards reviewed!");
    resetDeck();
  }
}

function resetDeck() {
  shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
  currentIndex = 0;
  flashcardElement.classList.remove("flipped");
  showCard();
}

function handleKeyDown(event) {
  if (isAnimating) return;

  if (event.code === "Space") {
    if (showingFront) {
      flipCard();
    } else {
      nextCard();
    }
  } else if (event.code === "KeyR") {
    resetDeck();
  }
}

function flipCard() {
  flashcardElement.classList.add("flipped");
  document.querySelector(".back").style.color = "black";
  showingFront = false;
}

function nextCard() {
  isAnimating = true;
  currentIndex++;
  flashcardElement.classList.remove("flipped");
  document.querySelector(".back").style.color = "white";
  setTimeout(300);
  showCard();
}

function loadFlashcards(collectionName) {
  const flashcardsData = localStorage.getItem(collectionName);
  if (flashcardsData) {
    const flashcardsArray = JSON.parse(flashcardsData);
    flashcards = shuffle(flashcardsArray);
    currentIndex = 0;
    repeatQueue = [];
    showCard();
  } else {
    alert("Collection not found.");
  }
}

function updateSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const collectionName = localStorage.key(i);
    const collectionItem = document.createElement("div");
    collectionItem.textContent = collectionName;
    collectionItem.classList.add("collection-item");
    collectionItem.addEventListener("click", () => loadFlashcards(collectionName));
    sidebar.appendChild(collectionItem);
  }
}

function saveFlashcards() {
  const collectionName = prompt("Enter a name for your flashcards collection:");
  if (collectionName) {
    if (localStorage.getItem(collectionName)) {
      alert("This collection already exists.");
    } else {
      const flashcardsData = JSON.stringify(flashcards);
      localStorage.setItem(collectionName, flashcardsData);
      alert("Flashcards collection saved!");
      updateSidebar();
    }
  }
}