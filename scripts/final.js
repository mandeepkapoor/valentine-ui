/* ===============================
   TAP TO REVEAL LOGIC
================================ */

const revealOverlay = document.getElementById("revealOverlay");

function revealPage() {
  revealOverlay.classList.add("hidden");

  // unlock audio + start heartbeat
  unlockAudio();

  // prevent future clicks
  revealOverlay.removeEventListener("click", revealPage);
}

revealOverlay.addEventListener("click", revealPage);
revealOverlay.addEventListener("touchstart", revealPage);


const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const helpText = document.getElementById("helpText");

/* ===============================
   NO BUTTON
================================ */

function moveNoButton() {
  const x = Math.random() * (window.innerWidth - 120);
  const y = Math.random() * (window.innerHeight - 120);

  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  showHelpText();
  shakeButton();
  vibrate();
}

function showHelpText() {
  helpText.style.opacity = 1;
  setTimeout(() => (helpText.style.opacity = 0), 1200);
}

function shakeButton() {
  noBtn.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 300 }
  );
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNoButton();
});

/* ===============================
   HAPTIC
================================ */

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate([20, 40, 20]);
  }
}

/* ===============================
   HEARTBEAT AUDIO (DOUBLE PULSE)
================================ */

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let audioUnlocked = false;
let heartbeatInterval;

/* Unlock audio on first interaction (iOS requirement) */
function unlockAudio() {
  if (audioUnlocked) return;

  audioCtx = new AudioContext();
  audioUnlocked = true;

  startHeartbeat();
}

/* Attach to any interaction */
["click", "touchstart", "mousedown"].forEach(evt => {
  document.addEventListener(evt, unlockAudio, { once: true });
});

/* Desktop: try autoplay */
window.addEventListener("load", () => {
  try {
    audioCtx = new AudioContext();
    audioUnlocked = true;
    startHeartbeat();
  } catch {
    /* iOS will unlock on interaction */
  }
});

/* Double pulse: LUB + DUB */
function playHeartbeat() {
  if (!audioUnlocked) return;

  const now = audioCtx.currentTime;

  // LUB (stronger)
  pulse(now, 72, 2.0);

  // DUB (softer, delayed)
  pulse(now + 0.18, 58, 1.0);

  screenShake()
}

function pulse(time, frequency, volume) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + 0.4);
}

function startHeartbeat() {
  if (heartbeatInterval) return;

  playHeartbeat();
  vibrate();

  heartbeatInterval = setInterval(() => {
    playHeartbeat();
    vibrate();
  }, 1200);
}

/* ===============================
   CONFETTI
================================ */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];

function fireConfetti() {
  for (let i = 0; i < 240; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -10 - 6,
      size: Math.random() * 4 + 2,
      life: 160,
      color: `hsl(${Math.random() * 360},100%,65%)`
    });
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life--;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  particles = particles.filter(p => p.life > 0);
  requestAnimationFrame(animateConfetti);
}

animateConfetti();

yesBtn.addEventListener("click", () => {
  fireConfetti();
  vibrate();
});


function screenShake() {
  const container = document.querySelector(".container");

  container.classList.remove("shake");
  void container.offsetWidth; // force reflow
  container.classList.add("shake");
}
