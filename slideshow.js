const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slideshowContainer = $$('.slideshow-container');

document.addEventListener('slideshow:change', (e) => {
    console.log(`🟢 Slide changed: ${e.detail.old} ➡️ ${e.detail.current}`);
});

slideshowContainer.forEach((container) => {
    const slideWrapper = container.querySelector('.slide-wrapper');
    const slideItems = container.querySelectorAll('.slide-item');
    const controlBtn = container.querySelector('.control-btn');
    const totalSlides = slideItems.length;

    // Create pagination dots based on total slides (excluding clone)
    const dots = initializeDots(container, totalSlides);

    // Clone the first slide and append it to the end (for loop effect)
    const cloneSlide = slideItems[0].cloneNode(true);
    slideWrapper.appendChild(cloneSlide);

    const slideshow = {
        slideWrapper,
        oldSlide: null,
        currentSlide: null,
        totalSlides,
        currentIndex: 0,
        dots,
        autoplayInterval: null,
        isTransitioning: false,
    };

    updateActiveDots(slideshow);
    startAutoplay(slideshow);

    // Handle click on next/prev button
    controlBtn.onclick = (e) => {
        const isNext = e.target.closest('.next-btn');
        const isPrev = e.target.closest('.prev-btn');

        if (isNext) handleNext(slideshow);
        if (isPrev) handlePrev(slideshow);
    };

    // Reset to first slide after reaching cloned one
    slideWrapper.addEventListener('transitionend', () => {
        handleTransitionEnd(slideshow);
    });

    // Attach event for each dot when clicking
    dots.forEach((dot, index) => {
        dot.onclick = () => {
            handleDotClick(slideshow, index);
        };
    });

    // Pause autoplay on hover
    container.addEventListener('mouseenter', () => stopAutoplay(slideshow));
    // Resume autoplay on leave
    container.addEventListener('mouseleave', () => startAutoplay(slideshow));
});

// ===== Autoplay control =====

function startAutoplay(slideshow) {
    stopAutoplay(slideshow); // Clear old interval to avoid double timers
    slideshow.autoplayInterval = setInterval(() => {
        handleNext(slideshow);
    }, 3000);
}

function stopAutoplay(slideshow) {
    if (slideshow.autoplayInterval) {
        clearInterval(slideshow.autoplayInterval);
        slideshow.autoplayInterval = null;
    }
}

// ===== Navigation control =====

function handleNext(slideshow) {
    if (slideshow.isTransitioning) return;

    // Get old slide
    slideshow.oldSlide = slideshow.currentIndex;

    // Whenever slide is transitioning, the flag turns on "true" -> can't interact
    slideshow.currentIndex++;
    slideshow.isTransitioning = true;
    updatePosition(slideshow);
}

function handlePrev(slideshow) {
    if (slideshow.isTransitioning) return;

    // Get old slide
    slideshow.oldSlide = slideshow.currentIndex;

    if (slideshow.currentIndex === 0) {
        jumpToClone(slideshow);

        requestAnimationFrame(() => {
            slideshow.currentIndex = slideshow.totalSlides - 1;
            updatePosition(slideshow);
        });
    } else {
        // Whenever slide is transitioning, the flag turns on "true" -> can't interact
        slideshow.currentIndex--;
        slideshow.isTransitioning = true;
        updatePosition(slideshow);
    }
}

// ===== Helper functions =====

function jumpToClone(slideshow) {
    slideshow.currentIndex = slideshow.totalSlides;
    updatePosition(slideshow, true); // Skip animation
}

function isAtClone(slideshow) {
    return slideshow.currentIndex === slideshow.totalSlides;
}

function initializeDots(container, totalSlides) {
    const dotContainer = container.querySelector('.dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotContainer.appendChild(dot);
    }
    return dotContainer.querySelectorAll('.dot');
}

function handleDotClick(slideshow, index) {
    if (isAtClone(slideshow)) {
        slideshow.currentIndex = 0;
    }

    // Get old slide
    slideshow.oldSlide = slideshow.currentIndex;

    slideshow.currentIndex = index;
    updatePosition(slideshow);
}

function updateActiveDots(slideshow) {
    const activeIndex = slideshow.currentIndex % slideshow.totalSlides;
    slideshow.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

function handleTransitionEnd(slideshow) {
    // logic inside this if here specifically for side clone -> isAtClone
    if (isAtClone(slideshow)) {
        slideshow.currentIndex = 0;
        updatePosition(slideshow, true);
    }

    // After transition end (for all slides):
    // - Get current slide position (which is current index)
    // - Let user interact with slides: the flag turns off "false"
    // - dispatch event slideshow:change to announce abt slide change
    slideshow.currentSlide = slideshow.currentIndex;
    slideshow.isTransitioning = false;

    const slideshowChange = new CustomEvent('slideshow:change', {
        detail: {
            old: slideshow.oldSlide,
            current: slideshow.currentSlide,
        },
    });

    document.dispatchEvent(slideshowChange);
}

function updatePosition(slideshow, skipAnimation = false) {
    const offset = `-${slideshow.currentIndex * 100}%`;

    slideshow.slideWrapper.style.transition = skipAnimation
        ? 'none'
        : 'transform 0.6s ease';

    slideshow.slideWrapper.style.transform = `translateX(${offset})`;

    updateActiveDots(slideshow);
}
