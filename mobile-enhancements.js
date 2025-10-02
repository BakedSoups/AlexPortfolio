// Mobile and Touch Device Enhancements for Alex's Gaming Website

// Detect if device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialize mobile enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile || isTouchDevice) {
        initMobileEnhancements();
    }

    // Add responsive navigation
    enhanceNavigation();

    // Add viewport height fix for mobile browsers
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
});

function initMobileEnhancements() {
    // Disable hover effects on touch devices
    disableHoverEffects();

    // Improve touch targets
    improveTouchTargets();

    // Add touch-friendly sparkles
    initTouchSparkles();

    // Optimize animations for mobile
    optimizeMobileAnimations();

    // Add mobile-specific navigation
    addMobileNavToggle();

    // Fix marquee for mobile
    fixMobileMarquee();

    // Add touch gestures
    addTouchGestures();
}

function disableHoverEffects() {
    // Add class to body for CSS to target
    document.body.classList.add('touch-device');

    // Remove hover states from CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .touch-device .nav-btn:hover,
        .touch-device .pixel-btn:hover,
        .touch-device .game-card:hover,
        .touch-device .youtuber-card:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

function improveTouchTargets() {
    // Make all clickable elements at least 44x44 pixels
    const clickableElements = document.querySelectorAll('button, a, .pixel-btn, .nav-btn, input[type="submit"]');
    clickableElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.height < 44) {
            element.style.minHeight = '44px';
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
        }
    });
}

function initTouchSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    if (!sparklesContainer) return;

    // Create sparkles on touch
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        createMobileSparkle(touch.pageX, touch.pageY, sparklesContainer);
    });

    // Create sparkles on touch move (less frequently)
    let touchMoveThrottle = 0;
    document.addEventListener('touchmove', (e) => {
        touchMoveThrottle++;
        if (touchMoveThrottle % 10 === 0) {
            const touch = e.touches[0];
            createMobileSparkle(touch.pageX, touch.pageY, sparklesContainer);
        }
    });
}

function createMobileSparkle(x, y, container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle mobile-sparkle';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '20px';
    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
}

function optimizeMobileAnimations() {
    // Reduce animation complexity on mobile
    if (isMobile) {
        const style = document.createElement('style');
        style.innerHTML = `
            @media (max-width: 768px) {
                .sparkle {
                    animation-duration: 1s !important;
                }
                .cursor-trail {
                    display: none !important;
                }
                .cd-animation {
                    animation: none !important;
                }
                .mood-bar {
                    animation: none !important;
                }
                marquee {
                    animation: scroll-left 20s linear infinite;
                }
                @keyframes scroll-left {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addMobileNavToggle() {
    // Navigation is now always visible at top, no toggle needed
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    // Add smooth scroll for mobile nav
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            .main-nav {
                position: sticky;
                top: 0;
                z-index: 998;
                background: linear-gradient(45deg, #660000, #000066, #006600, #660066, #666600),
                            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);
                background-size: 300% 100%, 20px 100%;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            .main-nav::-webkit-scrollbar {
                height: 6px;
            }
            .main-nav::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.5);
            }
            .main-nav::-webkit-scrollbar-thumb {
                background: #ff0000;
                border-radius: 3px;
            }
        }
    `;
    document.head.appendChild(style);
}

function fixMobileMarquee() {
    // Convert marquee to CSS animation on mobile
    const marquees = document.querySelectorAll('marquee');
    marquees.forEach(marquee => {
        if (window.innerWidth <= 768) {
            const content = marquee.innerHTML;
            const div = document.createElement('div');
            div.className = 'mobile-marquee';
            div.innerHTML = content;
            div.style.cssText = `
                white-space: nowrap;
                overflow: hidden;
                animation: scroll-left 15s linear infinite;
            `;
            marquee.parentNode.replaceChild(div, marquee);
        }
    });
}

function addTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    // Swipe to navigate sections
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            const sections = ['home', 'games', 'videos', 'music', 'guestbook'];
            const currentSection = sections.find(id => {
                const section = document.getElementById(id);
                return section && section.style.display !== 'none';
            });

            const currentIndex = sections.indexOf(currentSection);

            if (diff > 0 && currentIndex < sections.length - 1) {
                // Swipe left - next section
                showSection(sections[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous section
                showSection(sections[currentIndex - 1]);
            }
        }
    }

    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';

            // Update nav active state
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('href') === '#' + sectionId) {
                    btn.classList.add('active');
                }
            });

            // Scroll to top on mobile
            window.scrollTo(0, 0);
        }
    }
}

function enhanceNavigation() {
    // Make navigation sticky on scroll
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            nav.classList.add('sticky-nav');
        } else {
            nav.classList.remove('sticky-nav');
        }

        lastScrollTop = scrollTop;
    });

    // Add sticky nav styles
    const style = document.createElement('style');
    style.innerHTML = `
        .sticky-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 998;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        @media (max-width: 768px) {
            .sticky-nav {
                position: static;
            }
        }
    `;
    document.head.appendChild(style);
}

function setViewportHeight() {
    // Fix for mobile browser viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Add CSS custom property
    const style = document.createElement('style');
    style.innerHTML = `
        .window-frame {
            max-height: calc(var(--vh, 1vh) * 100 - 100px);
        }
        @media (max-width: 768px) {
            .site-header {
                min-height: calc(var(--vh, 1vh) * 15);
            }
        }
    `;
    if (!document.querySelector('style[data-viewport]')) {
        style.setAttribute('data-viewport', 'true');
        document.head.appendChild(style);
    }
}

// Performance optimization for mobile
if (isMobile) {
    // Lazy load images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.complete) return;
        imageObserver.observe(img);
    });

    // Throttle scroll events
    let ticking = false;
    function requestTick(callback) {
        if (!ticking) {
            requestAnimationFrame(callback);
            ticking = true;
        }
    }

    window.addEventListener('scroll', () => {
        requestTick(() => {
            ticking = false;
        });
    });
}

// Add mobile-specific styles for better UX
const mobileStyles = document.createElement('style');
mobileStyles.innerHTML = `
    /* Improve text readability on mobile */
    @media (max-width: 768px) {
        body {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
        }

        /* Prevent horizontal scroll */
        body, html {
            overflow-x: hidden;
            max-width: 100%;
        }

        /* Better tap highlighting */
        a, button {
            -webkit-tap-highlight-color: rgba(255, 255, 255, 0.2);
        }

        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }

        /* Hide scrollbars on mobile for better aesthetics */
        ::-webkit-scrollbar {
            display: none;
        }

        /* Active state for mobile */
        .nav-btn:active,
        .pixel-btn:active {
            transform: scale(0.95);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(mobileStyles);

console.log('Mobile enhancements loaded! Device:', isMobile ? 'Mobile' : 'Desktop', '| Touch:', isTouchDevice);