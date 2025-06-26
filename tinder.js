const players = [
    {
        name: 'Anna',
        photo: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        name: 'Ben',
        photo: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        name: 'Emma',
        photo: 'https://images.unsplash.com/photo-1547955922-85912e223015?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        name: 'Nathan',
        photo: 'https://images.unsplash.com/photo-1492370284958-c20b15c692d2?q=80&w=1349&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
        name: 'Ella',
        photo: 'https://images.unsplash.com/photo-1596854372407-baba7fef6e51?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
];

const container = document.querySelector('.card-container');
const ignoreBtn = document.querySelector('.ignore');
const likeBtn = document.querySelector('.like');

// State variables to track gesture interaction
let isTouching = false;
let startX = 0;
let deltaX = 0;
let currentCard = null;

const COLOR_LIKE = 'rgba(14, 96, 14, 0.8)';
const COLOR_IGNORE = 'rgba(186, 14, 14, 0.8)';
const COLOR_RESET = 'white';

renderPlayers(players);

// STEP 1: Handle user starts touching the screen
container.addEventListener('touchstart', (e) => {
    // Get the last card
    currentCard = container.querySelector('.card:last-child');
    if (!currentCard) return;

    // Save the initial horizontal touch position
    startX = e.touches[0].clientX;
    isTouching = true;
});

// STEP 2: Handle user dragging the card (finger moves)
container.addEventListener('touchmove', (e) => {
    if (!isTouching || !currentCard) return;

    // Calculate horizontal distance moved to update UI
    deltaX = e.touches[0].clientX - startX;

    // Move + rotate the card based on swipe distance
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${
        deltaX * 0.05
    }deg)`;

    resetButtons();

    if (deltaX > 0) {
        currentCard.style.borderColor = COLOR_LIKE;
        likeBtn.style.backgroundColor = COLOR_LIKE;
    } else {
        currentCard.style.borderColor = COLOR_IGNORE;
        ignoreBtn.style.backgroundColor = COLOR_IGNORE;
    }
});

// STEP 3: Handle user lifts finger (end gesture)
container.addEventListener('touchend', (e) => {
    if (!currentCard) return;

    // Decide whether to accept or cancel the swipe
    deltaX = e.changedTouches[0].clientX - startX;

    if (isSwipeEnough(deltaX)) {
        handleSuccessfulSwipe(deltaX);
    } else {
        resetCardPosition();
    }

    isTouching = false;
});

// === HELPER FUNCTIONS ===

// Animate the card flying out on a strong swipe
function handleSuccessfulSwipe(deltaX) {
    currentCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    currentCard.style.transform = `translateX(${deltaX * 5}px) rotate(${
        deltaX * 0.2
    }deg)`;
    currentCard.style.opacity = 0;

    resetButtons();

    // Wait until animation is finished before removing from DOM
    currentCard.addEventListener('transitionend', handleTransitionEnd);
}

function resetButtons() {
    likeBtn.style.backgroundColor = COLOR_RESET;
    ignoreBtn.style.backgroundColor = COLOR_RESET;
}

// Swipe light -> reset card position
function resetCardPosition() {
    currentCard.style.transition = 'transform 0.3s ease';
    currentCard.style.transform = 'translateX(0) rotate(0deg)';
    currentCard.style.borderColor = 'transparent';

    resetButtons();

    currentCard = null;
}

function isSwipeEnough(deltaX, threshold = 50) {
    return Math.abs(deltaX) >= threshold;
}

// Remove the card element from DOM after animation
function handleTransitionEnd(e) {
    const card = e.target;
    if (card) {
        card.remove();
    }
    currentCard = null;
}

function renderPlayers(players) {
    players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div class="card-content">
                <img class="card-img" src="${player.photo}" alt="${player.name}" />
                <div class="card-info">${player.name}</div>
            </div>
        `;

        container.appendChild(card);
    });
}
