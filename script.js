let visitorCount = 42851;

window.addEventListener('load', () => {
    animateVisitorCounter();
    initSparkles();
    initCursorTrail();
    setupNavigation();
    initRandomEffects();
    playStartupSound();
    setupGuestbook();
    setupGameCards();
    setupVideoPlayer();
    initEasterEggs();
    initClickSounds();
    initPacmanExplosion();
});

// Create a shared audio context for better performance
let sharedAudioContext = null;
function getAudioContext() {
    if (!sharedAudioContext) {
        sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return sharedAudioContext;
}

function createClickSound() {
    return function playClick() {
        try {
            const audioContext = getAudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.01);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Silent fail if audio context is blocked
        }
    };
}

const playClickAudio = createClickSound();

function initClickSounds() {
    // Add click sound to all buttons and links
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, a, .pixel-btn, .nav-btn, input[type="submit"], .game-card, .video-item, .youtuber-card')) {
            playClickAudio();
        }
    });
}

function animateVisitorCounter() {
    const counter = document.getElementById('visitor-count');
    const targetCount = visitorCount + Math.floor(Math.random() * 10);
    let currentCount = visitorCount;

    const interval = setInterval(() => {
        if (currentCount < targetCount) {
            currentCount++;
            counter.textContent = currentCount.toString().padStart(6, '0');
        } else {
            clearInterval(interval);
        }
    }, 100);
}

function initSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    let sparkleThrottle = 0;

    document.addEventListener('mousemove', (e) => {
        sparkleThrottle++;
        if (sparkleThrottle % 20 === 0 && Math.random() > 0.95) {
            createSparkle(e.pageX, e.pageY, sparklesContainer);
        }
    });

    // Reduce frequency from 500ms to 2000ms
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y, sparklesContainer);
        }
    }, 2000);
}

function createSparkle(x, y, container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1500);
}

function initCursorTrail() {
    const trail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailThrottle = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;

        trailThrottle++;
        if (trailThrottle % 10 === 0 && Math.random() > 0.95) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
            trail.appendChild(dot);

            setTimeout(() => dot.remove(), 300);
        }
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-btn');
    navLinks.forEach((link, index) => {
        link.style.setProperty('--i', index);
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').slice(1);
            showSection(target);
            playClickSound();
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.style.animation = 'slideIn 0.5s ease-out';
    }
}

function initRandomEffects() {
    setInterval(() => {
        if (Math.random() > 0.95) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 100);
        }
    }, 5000);

    setInterval(() => {
        const randomWidget = document.querySelectorAll('.widget')[Math.floor(Math.random() * document.querySelectorAll('.widget').length)];
        randomWidget.style.animation = 'wiggle 0.5s ease-in-out';
        setTimeout(() => {
            randomWidget.style.animation = 'float 6s ease-in-out infinite';
        }, 500);
    }, 8000);
}

function playStartupSound() {
    console.log('🔊 Windows XP startup sound would play here!');
}

function playClickSound() {
    playClickAudio();
    console.log('🔊 Click!');

    const body = document.body;
    body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        body.style.transform = 'scale(1)';
    }, 100);
}

function showPopup(title, message, icon = '💻') {
    const modal = document.getElementById('popup-modal');
    const popupTitle = modal.querySelector('.popup-title');
    const popupMessage = modal.querySelector('.popup-message');
    const popupIcon = modal.querySelector('.popup-icon');

    popupTitle.textContent = title;
    popupMessage.innerHTML = message;
    popupIcon.textContent = icon;

    modal.style.display = 'flex';

    // Add drag functionality
    makeDraggable(modal.querySelector('.popup-window'));

    // Play error sound effect
    playSystemSound();
}

function closePopup() {
    const modal = document.getElementById('popup-modal');
    modal.style.display = 'none';
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.popup-header');

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function playSystemSound() {
    console.log('🔊 Windows XP Error Sound!');
}

function setupGuestbook() {
    const signButton = document.querySelector('.guestbook-form button');
    if (signButton) {
        signButton.addEventListener('click', () => {
            const nameInput = document.querySelector('.guestbook-form input');
            const messageInput = document.querySelector('.guestbook-form textarea');

            if (nameInput.value && messageInput.value) {
                addGuestbookEntry(nameInput.value, messageInput.value);
                nameInput.value = '';
                messageInput.value = '';
                showPopup('Guestbook Signed!', 'Thanks for signing my guestbook!<br>You\'re awesome! Come back soon!<br><br>Don\'t forget to add me on MSN!', '✍️');
            } else {
                showPopup('Error', 'Please fill in all fields!<br>I need to know who you are!', '⚠️');
            }
        });
    }
}

function addGuestbookEntry(name, message) {
    const entriesContainer = document.querySelector('.guestbook-entries');
    const newEntry = document.createElement('div');
    newEntry.className = 'entry';
    newEntry.innerHTML = `<strong>${name}:</strong> ${message}`;
    entriesContainer.insertBefore(newEntry, entriesContainer.firstChild);
}

function setupGameCards() {
    const gameCards = document.querySelectorAll('.game-card button');
    gameCards.forEach(button => {
        button.addEventListener('click', () => {
            const gameName = button.parentElement.querySelector('h4').textContent;
            showPopup(
                'Adobe Flash Player',
                `<div style="text-align: center;">
                    <div style="font-size: 48px; margin: 20px;">🎮</div>
                    <strong>Loading ${gameName}...</strong><br><br>
                    <div style="background: #e0e0e0; height: 20px; border: 1px solid #000; margin: 10px 0;">
                        <div style="background: linear-gradient(90deg, #0088ff, #0044ff); height: 100%; width: 75%; animation: loading 2s infinite;"></div>
                    </div>
                    <br>
                    Remember when we waited for Flash to load?<br>
                    Those were simpler times!<br><br>
                    <small>Flash Player is no longer supported (RIP 2020)</small>
                </div>`,
                '🎮'
            );
            createExplosion(button);
        });
    });
}

function setupVideoPlayer() {
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoName = item.querySelector('h4').textContent;
            showPopup(
                'YouTube - Broadcast Yourself',
                `<div style="text-align: center;">
                    <div style="background: #000; color: #fff; padding: 20px; margin: -10px -10px 10px -10px;">
                        <div style="font-size: 48px;">▶</div>
                        <strong>${videoName}</strong>
                    </div>
                    <div style="margin: 20px 0;">
                        Buffering... Please wait<br>
                        <span class="blink">████████░░</span> 80%
                    </div>
                    <br>
                    <small>Connection Speed: 56k dial-up detected</small><br>
                    <small>Estimated time: 17 minutes</small><br><br>
                    <em>"Broadcast Yourself" - YouTube 2005-2012</em>
                </div>`,
                '📹'
            );
            item.style.background = '#ffd93d';
            setTimeout(() => {
                item.style.background = '#f0f0f0';
            }, 1000);
        });
    });

    // Add subscribe button functionality for YouTubers
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const youtuberName = button.parentElement.querySelector('h4').textContent;
            showPopup(
                'YouTube Subscription',
                `<div style="text-align: center;">
                    <div style="font-size: 48px; color: red;">📺</div>
                    <strong>Subscribed to ${youtuberName}!</strong><br><br>
                    You'll now receive email notifications<br>
                    whenever they upload a new video!<br><br>
                    <small>Don't forget to rate 5 stars!</small><br>
                    <div style="font-size: 24px; margin: 10px;">⭐⭐⭐⭐⭐</div>
                    <br>
                    <em>Also add them as a friend on MySpace!</em>
                </div>`,
                '✅'
            );
            button.textContent = 'SUBSCRIBED!';
            button.style.background = '#ff0000';
        });
    });
}

function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.textContent = ['💥', '⚡', '🔥', '✨'][Math.floor(Math.random() * 4)];
        particle.style.fontSize = '30px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';

        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let posX = x;
        let posY = y;
        let opacity = 1;

        const animateParticle = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animateParticle);
    }
}

function initPacmanExplosion() {
    const pacmanImages = document.querySelectorAll('.pacman-explode');

    pacmanImages.forEach((pacman) => {
        let isExploded = false;
        let explosionTimeout = null;

        pacman.addEventListener('mouseenter', function() {
            if (!isExploded) {
                // Create explosion sound effect
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // Create explosion sound
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.5);

                gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);

                // Add exploded class after animation
                explosionTimeout = setTimeout(() => {
                    this.classList.add('exploded');
                    isExploded = true;

                    // Reset after 3 seconds
                    setTimeout(() => {
                        this.classList.remove('exploded');
                        isExploded = false;
                    }, 3000);
                }, 500);
            }
        });

        pacman.addEventListener('mouseleave', function() {
            // Cancel explosion if mouse leaves quickly
            if (explosionTimeout && !isExploded) {
                clearTimeout(explosionTimeout);
            }
        });
    });
}

function initEasterEggs() {
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiPattern.join(',')) {
            activatePartyMode();
            konamiCode = [];
        }
    });

    document.addEventListener('dblclick', (e) => {
        if (e.shiftKey) {
            const nyanCat = document.createElement('div');
            nyanCat.innerHTML = '=^.^=';
            nyanCat.style.position = 'fixed';
            nyanCat.style.fontSize = '50px';
            nyanCat.style.left = '-100px';
            nyanCat.style.top = Math.random() * window.innerHeight + 'px';
            nyanCat.style.zIndex = '10000';
            document.body.appendChild(nyanCat);

            let pos = -100;
            const flyAcross = setInterval(() => {
                pos += 10;
                nyanCat.style.left = pos + 'px';

                if (pos > window.innerWidth) {
                    clearInterval(flyAcross);
                    nyanCat.remove();
                }
            }, 30);
        }
    });
}

function activatePartyMode() {
    showPopup(
        'ACHIEVEMENT UNLOCKED!',
        `<div style="text-align: center;">
            <div style="font-size: 64px; animation: spin 1s linear infinite;">🎉</div>
            <h2 style="color: #ff00ff;">PARTY MODE ACTIVATED!</h2>
            <br>
            You entered the Konami Code!<br>
            ↑ ↑ ↓ ↓ ← → ← → B A<br><br>
            <strong>+1000 Internet Points!</strong><br><br>
            <marquee>YOU ARE AWESOME! YOU ARE AWESOME! YOU ARE AWESOME!</marquee>
        </div>`,
        '🏆'
    );

    document.body.style.animation = 'partyMode 0.5s infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes partyMode {
            0% { filter: hue-rotate(0deg) saturate(2); }
            100% { filter: hue-rotate(360deg) saturate(2); }
        }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createSparkle(x, y, document.getElementById('sparkles'));
        }, i * 100);
    }

    setTimeout(() => {
        document.body.style.animation = '';
        showPopup('System Message', 'Party mode deactivated!<br>Thanks for being awesome! 🌟', '💫');
    }, 10000);
}

const musicPlayerButtons = document.querySelectorAll('.player-controls button');
musicPlayerButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent.includes('Play')) {
            showPopup(
                'Windows Media Player',
                `<div style="text-align: center;">
                    <div style="font-size: 48px; animation: pulse 1s infinite;">🎵</div>
                    <strong>Now Playing:</strong><br>
                    009 Sound System - Dreamscape<br><br>
                    <div style="background: #000; color: #0f0; padding: 10px; font-family: monospace;">
                        ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫<br>
                        [■■■■■■■□□□] 70%<br>
                        02:34 / 03:47
                    </div>
                    <br>
                    <small>The unofficial anthem of every<br>YouTube tutorial from 2007-2009!</small><br><br>
                    <em>"Let me show you how to..."</em>
                </div>`,
                '🎵'
            );
            document.querySelector('.cd-animation').style.animationPlayState = 'running';
        } else {
            document.querySelector('.cd-animation').style.animationPlayState = 'paused';
        }
    });
});

window.addEventListener('beforeunload', (e) => {
    const confirmationMessage = 'Are you sure you want to leave my awesome site? 😢';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
});

console.log('%c Welcome to the Console, Hacker! ', 'background: #00ff00; color: #000; font-size: 20px; font-weight: bold;');
console.log('%c You found the secret developer area! 🎮', 'color: #ff00ff; font-size: 16px;');
console.log('%c Type party() for a surprise!', 'color: #00ffff; font-size: 14px;');

window.party = function() {
    activatePartyMode();
};

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showPopup(
        '⚠️ WARNING ⚠️',
        `<div style="text-align: center; color: red;">
            <div style="font-size: 48px;">🚫</div>
            <strong>RIGHT-CLICK DISABLED!</strong><br><br>
            This website is protected by:<br>
            ✓ No-Right-Click Script v2.0<br>
            ✓ Anti-Copy Technology<br>
            ✓ Image Guard Pro<br><br>
            <small>Copyright © 2008 - All Rights Reserved</small><br>
            <small>Violators will be reported to their ISP!</small><br><br>
            <em>(Just kidding! But every website had this...)</em>
        </div>`,
        '🔒'
    );
    return false;
});