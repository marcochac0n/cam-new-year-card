const targetDate = new Date("2025-12-31T23:59:59-06:00");

const card = document.getElementById("card");
const seal = document.getElementById("seal");
const lockText = document.getElementById("lock-text");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let ready = false;

/* Subtle sound via Web Audio API */
function playSealSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 220;
  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.stop(ctx.currentTime + 0.2);
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0 && !ready) {
    ready = true;
    seal.classList.add("ready");
    lockText.innerHTML = "<strong>Toca el sello para abrir la carta</strong>";
  }

  if (diff > 0) {
    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 60000) % 60;
    const h = Math.floor(diff / 3600000) % 24;
    const d = Math.floor(diff / 86400000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minutesEl.textContent = String(m).padStart(2, "0");
    secondsEl.textContent = String(s).padStart(2, "0");
  }
}

seal.addEventListener("click", () => {
  if (!ready || card.classList.contains("open")) return;

  playSealSound();
  seal.classList.add("opened");
  card.classList.add("open");
});

updateCountdown();
setInterval(updateCountdown, 1000);
