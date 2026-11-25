const birthday = new Date(2026, 10, 29, 0, 0, 0); // Month is zero-based: 10 = November
const $ = (id) => document.getElementById(id);

function updateCountdown() {
  const now = new Date();
  const diff = birthday - now;
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id => $(id).textContent = "00");
    $("countdownMessage").textContent = "It's your day, Affu. Let the celebration begin! ✨";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  $("days").textContent = String(days).padStart(2,"0");
  $("hours").textContent = String(hours).padStart(2,"0");
  $("minutes").textContent = String(minutes).padStart(2,"0");
  $("seconds").textContent = String(seconds).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

$("beginBtn").addEventListener("click", () => {
  $("countdown").scrollIntoView({behavior:"smooth"});
  showToast("Your little birthday journey begins ✦");
});

let candlesOut = false;
$("blowBtn").addEventListener("click", () => {
  candlesOut = !candlesOut;
  $("flames").classList.toggle("off", candlesOut);
  $("cakeCaption").textContent = candlesOut ? "Wish made. May it find its way to you. ♡" : "Make a wish, Affu ✨";
  $("blowBtn").textContent = candlesOut ? "Light the candles again" : "Blow out the candles";
  if (candlesOut) showerConfetti(35);
});

$("confettiBtn").addEventListener("click", () => {
  showerConfetti(65);
  showToast("A little extra sparkle, just for you ✨");
});

$("envelopeBtn").addEventListener("click", () => {
  const open = $("envelopeBtn").classList.toggle("open");
  $("envelopeBtn").setAttribute("aria-expanded", String(open));
  $("letterContent").hidden = !open;
  $("envelopeHint").textContent = open ? "A note, written especially for you ♡" : "Tap the envelope to open your letter";
  if (open) setTimeout(() => $("letterContent").scrollIntoView({behavior:"smooth",block:"center"}), 350);
});

$("againBtn").addEventListener("click", () => {
  showerConfetti(80);
  window.scrollTo({top:0,behavior:"smooth"});
  showToast("Happy Birthday, Affu! ♡");
});

function showerConfetti(count) {
  const symbols = ["✦","✧","♡","❀","·"];
  for (let i=0;i<count;i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    piece.style.left = Math.random()*100 + "vw";
    piece.style.color = ["#e9aeb9","#d9b985","#f3e4dc","#c5b9e8"][Math.floor(Math.random()*4)];
    piece.style.animationDuration = (3+Math.random()*4) + "s";
    piece.style.animationDelay = (Math.random()*1.2) + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 8500);
  }
}
let toastTimer;
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
}

// Secret entry: change this word if you want a different unlock code.
const SECRET_WORD = "AFFU";
$("unlockForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = $("secretInput").value.trim().toUpperCase();
  if (entered === SECRET_WORD) {
    $("secretGate").classList.add("hidden");
    document.body.classList.remove("locked");
    $("cinematicWash").classList.remove("play");
    void $("cinematicWash").offsetWidth;
    $("cinematicWash").classList.add("play");
    setTimeout(() => showToast("Welcome to your surprise, Affu ✦"), 1900);
  } else {
    $("gateHint").textContent = "Not quite! Try the hint and have another go.";
    $("gateHint").classList.add("error");
    $("secretInput").value = "";
    $("secretInput").focus();
  }
});

let windowOpen = false;
function toggleWindow() {
  windowOpen = !windowOpen;
  $("windowMoment").querySelector(".window-scene").classList.toggle("open", windowOpen);
  $("openWindowBtn").textContent = windowOpen ? "Close the window" : "Open the window";
  $("windowHint").textContent = windowOpen ? "There you go — a sky full of possibilities ✨" : "Tap the window to let the stars in";
  if (windowOpen) showerConfetti(24);
}
$("openWindowBtn").addEventListener("click", toggleWindow);
$("shutterLeft").addEventListener("click", () => { if (!windowOpen) toggleWindow(); });
$("shutterRight").addEventListener("click", () => { if (!windowOpen) toggleWindow(); });

// Optional, soft synthesized chime. It starts only after the visitor taps SOUND ON.
let audioContext = null;
let soundOn = false;
let chimeTimer = null;
function playSoftChime() {
  if (!soundOn) return;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 659.25];
  const now = audioContext.currentTime;
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + index * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.035, now + index * 0.55 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.55 + 0.48);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(now + index * 0.55);
    oscillator.stop(now + index * 0.55 + 0.5);
  });
}
$("soundToggle").addEventListener("click", async () => {
  soundOn = !soundOn;
  $("soundToggle").textContent = soundOn ? "♫ SOUND ON" : "♫ SOUND OFF";
  $("soundToggle").setAttribute("aria-pressed", String(soundOn));
  if (soundOn) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") await audioContext.resume();
    playSoftChime();
    chimeTimer = setInterval(playSoftChime, 4200);
    showToast("A soft birthday chime is on ♡");
  } else {
    clearInterval(chimeTimer);
    showToast("Sound turned off");
  }
});

// Share QR: works after publishing to an http(s) address.
const pageUrl = window.location.href;
const copyLinkButton = $("copyLinkBtn");
const isPublishedUrl = /^https?:\/\//i.test(pageUrl) && !/localhost|127\.0\.0\.1/i.test(window.location.hostname);
if (isPublishedUrl && window.QRCode) {
  $("qrPlaceholder").hidden = true;
  $("birthdayQr").innerHTML = "";
  new QRCode($("birthdayQr"), { text: pageUrl, width: 170, height: 170, colorDark: "#171b2b", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
  $("qrStatus").textContent = "Scan this code with another phone to open the birthday surprise.";
  copyLinkButton.disabled = false;
} else {
  $("qrStatus").textContent = "Publish this website first. Your live QR code will appear here automatically.";
  copyLinkButton.disabled = true;
}
copyLinkButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pageUrl);
    showToast("Website link copied ✦");
  } catch (error) {
    showToast("Copy isn't available here. Copy the address from your browser.");
  }
});
