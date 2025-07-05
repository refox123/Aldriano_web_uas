document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const movesDisplay = document.getElementById("moves");
  const timeDisplay = document.getElementById("time");
  const resetButton = document.getElementById("reset");
  const winMessage = document.getElementById("win-message");
  const finalMoves = document.getElementById("final-moves");
  const finalTime = document.getElementById("final-time");
  const playAgainButton = document.getElementById("play-again");

  let cards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let moves = 0;
  let timer;
  let seconds = 0;
  let matchedPairs = 0;
  const totalPairs = 8;

  // Icons for the cards
  const icons = [
    "fa-heart",
    "fa-star",
    "fa-flag",
    "fa-key",
    "fa-bell",
    "fa-smile",
    "fa-moon",
    "fa-sun",
  ];

  // Duplicate the icons to create pairs
  const cardIcons = [...icons, ...icons];

  // Initialize game
  function initGame() {
    shuffleCards();
    createBoard();
    startTimer();
  }

  // Shuffle cards using Fisher-Yates algorithm
  function shuffleCards() {
    for (let i = cardIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardIcons[i], cardIcons[j]] = [cardIcons[j], cardIcons[i]];
    }
  }

  // Create the game board
  function createBoard() {
    gameBoard.innerHTML = "";
    cards = [];
    matchedPairs = 0;

    cardIcons.forEach((icon, index) => {
      const card = document.createElement("div");
      card.classList.add("card-container", "w-full", "h-24", "cursor-pointer");
      card.dataset.index = index;

      card.innerHTML = `
                        <div class="card w-full h-full relative">
                            <div class="card-face card-front">
                                <i class="fas ${icon}"></i>
                            </div>
                            <div class="card-face card-back"></div>
                        </div>
                    `;

      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
      cards.push(card);
    });
  }

  // Flip a card
  function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("matched"))
      return;

    const cardInner = this.querySelector(".card");

    // Flip animation
    this.classList.add("flip-in");
    setTimeout(() => {
      this.querySelector(".card-front").style.transform = "rotateY(0deg)";
      this.querySelector(".card-back").style.transform = "rotateY(180deg)";
      this.classList.remove("flip-in");
    }, 250);

    if (!hasFlippedCard) {
      // First card flip
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Second card flip
    secondCard = this;
    lockBoard = true;

    checkForMatch();
  }

  // Check if cards match
  function checkForMatch() {
    const firstIcon = firstCard.querySelector(".card-front i").className;
    const secondIcon = secondCard.querySelector(".card-front i").className;

    moves++;
    movesDisplay.textContent = moves;

    const isMatch = firstIcon === secondIcon;

    if (isMatch) {
      disableCards();
      matchedPairs++;
      checkWin();
    } else {
      unflipCards();
    }
  }

  // Disable matched cards
  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    resetBoard();
  }

  // Unflip non-matching cards
  function unflipCards() {
    setTimeout(() => {
      [firstCard, secondCard].forEach((card) => {
        const cardInner = card.querySelector(".card");
        card.classList.add("flip-out");

        setTimeout(() => {
          card.querySelector(".card-front").style.transform = "rotateY(180deg)";
          card.querySelector(".card-back").style.transform = "rotateY(0deg)";
          card.classList.remove("flip-out");
        }, 250);
      });

      resetBoard();
    }, 1000);
  }

  // Reset board state
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Check if player has won
  function checkWin() {
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      winMessage.classList.remove("hidden");
      finalMoves.textContent = moves;
      finalTime.textContent = formatTime(seconds);
    }
  }

  // Start game timer
  function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timeDisplay.textContent = "00:00";

    timer = setInterval(() => {
      seconds++;
      timeDisplay.textContent = formatTime(seconds);
    }, 1000);
  }

  // Format time as MM:SS
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Reset game
  function resetGame() {
    clearInterval(timer);
    moves = 0;
    seconds = 0;
    movesDisplay.textContent = "0";
    timeDisplay.textContent = "00:00";
    winMessage.classList.add("hidden");
    initGame();
  }

  // Event listeners
  resetButton.addEventListener("click", resetGame);
  playAgainButton.addEventListener("click", resetGame);

  // Start the game
  initGame();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Animation on scroll
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionVisible = 150;

    if (sectionTop < windowHeight - sectionVisible) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }
  });
});

// Initialize sections to be initially hidden then animate in
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section:not(#home)");

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  setTimeout(() => {
    const homeSection = document.getElementById("home");
    const homeContent = homeSection.querySelector(".home-content");
    homeContent.style.opacity = "1";
    homeContent.style.transform = "translateY(0)";
  }, 100);
});
