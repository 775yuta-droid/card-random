const characters = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
];

let deck = [...characters];
let dealtCards = [];
let isAnimating = false;

const deckElement = document.getElementById("deck");
const dealArea = document.getElementById("deal-area");
const dealBtn = document.getElementById("deal-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const undoBtn = document.getElementById("undo-btn");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateButtons() {
  dealBtn.disabled = deck.length === 0 || isAnimating;
  undoBtn.disabled = dealtCards.length === 0 || isAnimating;
  shuffleBtn.disabled = isAnimating;
}

function createCard(char) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-back">
      </div>
      <div class="card-face card-front">
        ${char}
        <div class="setsu-mark"></div>
      </div>
    </div>
  `;
  return card;
}

function dealCard() {
  if (deck.length === 0 || isAnimating) return;

  isAnimating = true;
  updateButtons();

  const char = deck.pop();
  dealtCards.push(char);

  const card = createCard(char);

  // Start from deck position
  const deckRect = deckElement.getBoundingClientRect();
  const dealRect = dealArea.getBoundingClientRect();

  card.style.left = `${deckRect.left - dealRect.left}px`;
  card.style.top = `${deckRect.top - dealRect.top}px`;

  dealArea.appendChild(card);

  // Trigger animation
  setTimeout(() => {
    card.style.left = "10px";
    card.style.top = "10px";
    card.classList.add("flipped");

    // Cleanup old cards if needed (keep only the last one visible)
    if (dealtCards.length > 1) {
      const oldCards = dealArea.querySelectorAll(".card");
      if (oldCards.length > 1) {
        oldCards[0].style.opacity = "0";
        setTimeout(() => oldCards[0].remove(), 600);
      }
    }

    setTimeout(() => {
      isAnimating = false;
      updateButtons();
    }, 600);
  }, 50);
}

function undoDeal() {
  if (dealtCards.length === 0 || isAnimating) return;

  isAnimating = true;
  updateButtons();

  const char = dealtCards.pop();
  deck.push(char);

  const cards = dealArea.querySelectorAll(".card");
  const lastCard = cards[cards.length - 1];

  if (lastCard) {
    const deckRect = deckElement.getBoundingClientRect();
    const dealRect = dealArea.getBoundingClientRect();

    lastCard.classList.remove("flipped");
    lastCard.style.left = `${deckRect.left - dealRect.left}px`;
    lastCard.style.top = `${deckRect.top - dealRect.top}px`;
    lastCard.style.opacity = "0";

    setTimeout(() => {
      lastCard.remove();
      isAnimating = false;
      updateButtons();
    }, 600);
  } else {
    isAnimating = false;
    updateButtons();
  }
}

function handleShuffle() {
  if (isAnimating) return;

  deckElement.classList.add("shuffle-anim");
  shuffle(deck);

  setTimeout(() => {
    deckElement.classList.remove("shuffle-anim");
  }, 500);
}

// Initial Shuffle
shuffle(deck);

// Event Listeners
dealBtn.addEventListener("click", dealCard);
deckElement.addEventListener("click", dealCard);
shuffleBtn.addEventListener("click", handleShuffle);
undoBtn.addEventListener("click", undoDeal);

updateButtons();

