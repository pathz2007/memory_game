document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const restartBtn = document.getElementById('restart-btn');
    const winScreen = document.getElementById('win-screen');
    const playAgainBtn = document.getElementById('play-again-btn');
    const finalStatsElement = document.getElementById('final-stats');

    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');
    const winSound = document.getElementById('win-sound');

    const animals = ['panda', 'puppy', 'kitten', 'bunny', 'lion', 'elephant', 'fox', 'penguin'];
    let cards = [...animals, ...animals];

    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let boardLocked = false;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function startGame() {
        // Reset all game state
        shuffle(cards);
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        boardLocked = false;
        movesElement.textContent = '0';
        timerElement.textContent = '0s';
        winScreen.classList.remove('show');

        // Create cards
        cards.forEach(animal => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.animal = animal;

            card.innerHTML = `
                <div class="card-face card-face--front"></div>
                <div class="card-face card-face--back">
                    <img src="assets/${animal}.png" alt="${animal}">
                </div>
            `;
            gameBoard.appendChild(card);
            card.addEventListener('click', handleCardClick);
        });

        startTimer();
    }

    function startTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = `${seconds}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function handleCardClick(e) {
        if (boardLocked) return;
        const clickedCard = e.currentTarget;
        if (clickedCard.classList.contains('is-flipped')) return;

        flipCard(clickedCard);
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function flipCard(card) {
        card.classList.add('is-flipped');
        playSound(flipSound);
    }

    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound play failed:", e));
        }
    }

    function checkForMatch() {
        moves++;
        movesElement.textContent = moves;
        boardLocked = true;

        const [card1, card2] = flippedCards;
        if (card1.dataset.animal === card2.dataset.animal) {
            // Match
            setTimeout(() => {
                card1.removeEventListener('click', handleCardClick);
                card2.removeEventListener('click', handleCardClick);
                matchedPairs++;
                playSound(matchSound);
                resetTurn();
                if (matchedPairs === animals.length) {
                    winGame();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                unflipCards();
                resetTurn();
            }, 1200);
        }
    }

    function unflipCards() {
        flippedCards.forEach(card => card.classList.remove('is-flipped'));
    }

    function resetTurn() {
        flippedCards = [];
        boardLocked = false;
    }

    function winGame() {
        stopTimer();
        playSound(winSound);
        finalStatsElement.textContent = `You finished in ${seconds} seconds with ${moves} moves!`;
        winScreen.classList.add('show');
    }

    // Event Listeners
    restartBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);

    // Initial Start
    startGame();
});
