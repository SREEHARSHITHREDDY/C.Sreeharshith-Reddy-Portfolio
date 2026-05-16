/**
 * ═══════════════════════════════════════════════
 * reception.js — Lobby / Ground Floor Logic
 * Receptionist typewriter · Personalised greeting
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ── NAME PROMPT ── */
let visitorName = '';

function initNamePrompt() {
  const prompt = document.getElementById('namePrompt');
  if (!prompt) return;
  document.body.style.overflow = 'hidden'; // lock scroll until name entered
  prompt.classList.remove('hidden');
  setTimeout(() => {
    const inp = document.getElementById('visitorNameInput');
    if (inp) inp.focus();
  }, 300);
}

function submitVisitorName(skip) {
  visitorName = skip ? '' : (document.getElementById('visitorNameInput')?.value || '').trim();
  const prompt = document.getElementById('namePrompt');
  if (prompt) {
    prompt.style.opacity    = '0';
    prompt.style.transition = 'opacity .5s';
    setTimeout(() => { prompt.classList.add('hidden'); }, 500);
  }
  document.body.style.overflow = ''; // restore scroll
}

/* ── RECEPTION INIT ── */
function initReception() {
  // Show desk + receptionist
  setTimeout(() => {
    const deskArea = document.getElementById('deskArea');
    const recArea  = document.getElementById('recArea');
    if (deskArea) deskArea.classList.add('show');
    if (recArea)  recArea.classList.add('show');
  }, 400);

  // Start personalised greeting
  setTimeout(() => {
    const bubble = document.getElementById('greetingBubble');
    if (bubble) bubble.classList.add('show');
    runPersonalisedGreeting();
  }, 900);

  // Show escalator prompt after greeting finishes
  setTimeout(() => {
    const esc = document.getElementById('escPrompt');
    if (esc) esc.classList.add('show');
  }, 4500);
}

/* ── PERSONALISED TYPEWRITER GREETING ── */
function runPersonalisedGreeting() {
  const textEl = document.getElementById('bubbleText');
  const curEl  = document.getElementById('bubbleCursor');
  if (!textEl) return;

  const name  = visitorName ? `, ${visitorName}` : '';
  const lines = [
    `Good day${name}! Welcome to\nC. Sree Harshith Reddy's Empire.`,
    `I'm your guide for today.`,
    `Select a floor from the panel\nor scroll down to begin.`
  ];

  let li = 0, ci = 0, fullText = '';

  function next() {
    if (li >= lines.length) {
      if (curEl) curEl.style.display = 'none';
      return;
    }
    const ln = lines[li];
    if (ci < ln.length) {
      fullText += ln[ci];
      textEl.textContent = fullText;
      ci++;
      setTimeout(next, 36);
    } else {
      fullText += '\n';
      ci = 0;
      li++;
      setTimeout(next, 700);
    }
  }
  next();
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('addToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'addToast';
    document.body.appendChild(t);
  }
  t.textContent  = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2400);
}

/* ── EXPOSE ── */
window.initNamePrompt        = initNamePrompt;
window.submitVisitorName     = submitVisitorName;
window.initReception         = initReception;
window.showToast             = showToast;
Object.defineProperty(window, 'visitorName', {
  get: () => visitorName,
  set: v => { visitorName = v; }
});
