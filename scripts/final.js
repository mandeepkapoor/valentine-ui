const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const helpText = document.getElementById("helpText");

/* NO button */

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
  setTimeout(() => helpText.style.opacity = 0, 1200);
}

function shakeButton() {
  noBtn.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-6px)" },
    { transform: "translateX(6px)" },
    { transform: "translateX(0)" }
  ], { duration: 300 });
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNoButton();
});

/* HAPTIC */

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(30);
}

/* HEARTBEAT SOUND */

let audioUnlocked = false;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function unlockAudio() {
  if (audioUnlocked) return;
  audioCtx = new AudioContext();
  audioUnlocked = true;
}

document.addEventListener("click", unlockAudio);
document.addEventListener("touchstart", unlockAudio);

function playHeartbeat() {
  if (!audioUnlocked) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.frequency.value = 90;
  osc.type = "sine";

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

setInterval(() => {
  playHeartbeat();
  vibrate();
}, 1200);

/* CONFETTI */

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
      color: `hsl(${Math.random()*360},100%,65%)`
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
