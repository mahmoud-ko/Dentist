/* ============================================
   BIRTHDAY EXPERIENCE - INTERACTIVE SCRIPT
   ============================================ */

// ---- State ----
let noCount = 0;
let candlesBlown = 0;
const totalCandles = 5;
let audioContext = null;

// ---- DOM Elements ----
const screens = document.querySelectorAll('.screen');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const noCounter = document.getElementById('no-counter');
const cakeContainer = document.getElementById('cake-container');
const candlesContainer = document.getElementById('candles-container');
const blowInstruction = document.getElementById('blow-instruction');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const envelope = document.getElementById('envelope');
const messageCard = document.getElementById('message-card');
const btnClose = document.getElementById('btn-close');
const balloonsContainer = document.getElementById('balloons-container');
const particleCanvas = document.getElementById('particles');
const confettiCanvas = document.getElementById('confetti-canvas');

// ---- Particle Background ----
const pCtx = particleCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            color: ['#d4a574', '#e8a0bf', '#a29bfe', '#ffd700'][Math.floor(Math.random() * 4)]
        });
    }
}

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = p.color;
        pCtx.globalAlpha = p.opacity;
        pCtx.fill();
    });
    pCtx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
}

resizeParticleCanvas();
createParticles();
animateParticles();
window.addEventListener('resize', () => {
    resizeParticleCanvas();
    createParticles();
});

// ---- Confetti System ----
const cCtx = confettiCanvas.getContext('2d');
let confetti = [];
let confettiActive = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

function launchConfetti() {
    confettiActive = true;
    const colors = ['#d4a574', '#e8a0bf', '#a29bfe', '#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3'];
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * 200,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 3 + 2,
            vx: (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }
    animateConfetti();
}

function animateConfetti() {
    if (!confettiActive) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti = confetti.filter(c => c.y < confettiCanvas.height + 50 && c.opacity > 0);
    
    if (confetti.length === 0) {
        confettiActive = false;
        return;
    }

    confetti.forEach(c => {
        c.y += c.vy;
        c.x += c.vx;
        c.rotation += c.rotSpeed;
        c.opacity -= 0.002;
        
        cCtx.save();
        cCtx.translate(c.x, c.y);
        cCtx.rotate(c.rotation * Math.PI / 180);
        cCtx.globalAlpha = c.opacity;
        cCtx.fillStyle = c.color;
        cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        cCtx.restore();
    });
    
    requestAnimationFrame(animateConfetti);
}

// ---- Sound Effects (Web Audio API) ----
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, type = 'sine', gain = 0.3) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const g = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc.connect(g);
    g.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

function playClickSound() {
    playTone(800, 0.1, 'sine', 0.2);
}

function playSuccessSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
        setTimeout(() => playTone(note, 0.3, 'sine', 0.2), i * 100);
    });
}

function playCandleBlowSound() {
    playTone(200, 0.3, 'triangle', 0.15);
    setTimeout(() => playTone(150, 0.2, 'triangle', 0.1), 100);
}

function playBirthdayMelody() {
    // Happy Birthday melody notes (simplified)
    const melody = [
        { note: 264, dur: 0.3 }, { note: 264, dur: 0.15 },
        { note: 297, dur: 0.4 }, { note: 264, dur: 0.4 },
        { note: 352, dur: 0.4 }, { note: 330, dur: 0.6 },
        { note: 264, dur: 0.3 }, { note: 264, dur: 0.15 },
        { note: 297, dur: 0.4 }, { note: 264, dur: 0.4 },
        { note: 396, dur: 0.4 }, { note: 352, dur: 0.6 },
        { note: 264, dur: 0.3 }, { note: 264, dur: 0.15 },
        { note: 528, dur: 0.4 }, { note: 440, dur: 0.4 },
        { note: 352, dur: 0.4 }, { note: 330, dur: 0.4 },
        { note: 297, dur: 0.6 },
    ];
    let time = 0;
    melody.forEach(({ note, dur }) => {
        setTimeout(() => playTone(note, dur, 'sine', 0.15), time * 1000);
        time += dur + 0.05;
    });
}

function playChimeSoundscape() {
    // Soft chimes for finale
    const chimes = [523, 659, 784, 880, 1047, 1175, 1319];
    let delay = 0;
    for (let i = 0; i < 3; i++) {
        chimes.forEach((note, j) => {
            setTimeout(() => playTone(note, 1.5, 'sine', 0.08), delay);
            delay += 300;
        });
        delay += 500;
    }
}

// ---- Screen Navigation ----
function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ---- NO Button Responses ----
const noMessages = [
    "Hmm, are you sure? 🤔",
    "Really? That crown says otherwise... 👑",
    "My sources say you're lying 😂",
    "The cake disagrees with you 🎂",
    "Last chance to be honest! 😤",
    "OK the YES button is getting impatient...",
    "You can't escape your birthday! 🎉",
    "The universe knows the truth 🌟",
    "Fine, but the button won't stop growing! 😅",
    "JUST ACCEPT IT ALREADY 🎊"
];

// ---- Entry Screen Logic ----
btnNo.addEventListener('click', () => {
    initAudio();
    playClickSound();
    noCount++;
    
    // Grow YES button
    const scale = 1 + noCount * 0.2;
    const fontSize = 1.1 + noCount * 0.1;
    btnYes.style.transform = `scale(${Math.min(scale, 3)})`;
    btnYes.style.fontSize = `${Math.min(fontSize, 2)}rem`;
    
    // Shrink/move NO button
    const noScale = Math.max(1 - noCount * 0.08, 0.4);
    btnNo.style.transform = `scale(${noScale})`;
    btnNo.style.opacity = Math.max(1 - noCount * 0.1, 0.3);
    
    // Random position offset for NO button
    const offsetX = (Math.random() - 0.5) * noCount * 20;
    const offsetY = (Math.random() - 0.5) * noCount * 10;
    btnNo.style.transform = `scale(${noScale}) translate(${offsetX}px, ${offsetY}px)`;
    
    // Show message
    const msgIndex = Math.min(noCount - 1, noMessages.length - 1);
    noCounter.textContent = noMessages[msgIndex];
    noCounter.classList.add('shake');
    setTimeout(() => noCounter.classList.remove('shake'), 500);
    
    // Add glow to YES after 3 clicks
    if (noCount >= 3) {
        btnYes.classList.add('glow');
    }
});

btnYes.addEventListener('click', () => {
    initAudio();
    playSuccessSound();
    launchConfetti();
    
    // Transition to cake screen
    setTimeout(() => {
        showScreen('screen-cake');
        createCandles();
        setTimeout(playBirthdayMelody, 1500);
    }, 800);
});

// ---- Cake Screen Logic ----
function createCandles() {
    candlesContainer.innerHTML = '';
    for (let i = 0; i < totalCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.animationDelay = `${i * 0.1}s`;
        
        const flame = document.createElement('div');
        flame.className = 'candle-flame';
        flame.style.animationDelay = `${Math.random() * 0.5}s`;
        
        const smoke = document.createElement('div');
        smoke.className = 'candle-smoke';
        
        candle.appendChild(smoke);
        candle.appendChild(flame);
        candlesContainer.appendChild(candle);
        
        // Click to blow out
        candle.addEventListener('click', () => blowCandle(candle, flame, smoke));
    }
}

function blowCandle(candle, flame, smoke) {
    if (flame.classList.contains('blown')) return;
    
    playCandleBlowSound();
    flame.classList.add('blown');
    smoke.classList.add('active');
    candle.style.cursor = 'default';
    candlesBlown++;
    
    // Update instruction
    if (candlesBlown < totalCandles) {
        blowInstruction.textContent = `🕯️ ${totalCandles - candlesBlown} candle${totalCandles - candlesBlown > 1 ? 's' : ''} left!`;
    }
    
    // All candles blown
    if (candlesBlown >= totalCandles) {
        blowInstruction.textContent = "✨ Make a wish! ✨";
        playSuccessSound();
        launchConfetti();
        
        setTimeout(() => {
            showScreen('screen-envelope');
        }, 2000);
    }
}

// ---- Envelope Screen Logic ----
envelopeWrapper.addEventListener('click', () => {
    initAudio();
    playClickSound();
    envelope.classList.add('opening');
    
    setTimeout(() => {
        playSuccessSound();
        showScreen('screen-message');
    }, 1000);
});

// ---- Message Screen Logic ----
btnClose.addEventListener('click', () => {
    initAudio();
    playClickSound();
    
    // Burn animation on message card
    messageCard.classList.add('envelope-burn');
    
    setTimeout(() => {
        showScreen('screen-finale');
        startFinale();
    }, 1500);
});

// ---- Finale ----
function startFinale() {
    launchConfetti();
    createBalloons();
    playChimeSoundscape();
    
    // Keep launching confetti
    let finaleInterval = setInterval(() => {
        launchConfetti();
    }, 4000);
    
    // Keep creating balloons
    let balloonInterval = setInterval(() => {
        addBalloon();
    }, 800);
    
    // Stop after 30s
    setTimeout(() => {
        clearInterval(finaleInterval);
        clearInterval(balloonInterval);
    }, 30000);
}

function createBalloons() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => addBalloon(), i * 300);
    }
}

function addBalloon() {
    const balloons = ['🎈', '🎈', '🎈', '💖', '⭐', '🎈', '✨'];
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = balloons[Math.floor(Math.random() * balloons.length)];
    balloon.style.left = Math.random() * 100 + '%';
    balloon.style.fontSize = (Math.random() * 2 + 2) + 'rem';
    balloon.style.animationDuration = (Math.random() * 4 + 4) + 's';
    balloon.style.animationDelay = Math.random() * 0.5 + 's';
    balloonsContainer.appendChild(balloon);
    
    // Remove after animation
    setTimeout(() => balloon.remove(), 9000);
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    showScreen('screen-entry');
});
