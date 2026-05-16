/**
 * reception.js — Lobby / Ground Floor Logic
 * GSAP-powered · C. Sree Harshith Reddy's Empire
 */

let visitorName = '';

function initNamePrompt() {
  const prompt = document.getElementById('namePrompt');
  if (!prompt) return;
  document.body.style.overflow = 'hidden';
  prompt.classList.remove('hidden');

  if (window.EmpireAnim?.namePromptIn) {
    EmpireAnim.namePromptIn();
  } else {
    setTimeout(() => { document.getElementById('visitorNameInput')?.focus(); }, 300);
  }
}

function submitVisitorName(skip) {
  visitorName = skip ? '' : (document.getElementById('visitorNameInput')?.value || '').trim();
  document.body.style.overflow = '';

  if (window.EmpireAnim?.namePromptOut) {
    EmpireAnim.namePromptOut(() => document.getElementById('namePrompt').classList.add('hidden'));
  } else {
    const p = document.getElementById('namePrompt');
    if (p) { p.style.opacity = '0'; p.style.transition = 'opacity .5s'; setTimeout(() => p.classList.add('hidden'), 500); }
  }
}

function initReception() {
  if (window.EmpireAnim?.receptionIn) {
    EmpireAnim.receptionIn();
    setTimeout(() => { EmpireAnim.greetingBubbleIn?.(); runPersonalisedGreeting(); }, 900);
    setTimeout(() => {
      const esc = document.getElementById('escPrompt');
      if (esc) gsap.fromTo(esc, { opacity:0, y:10 }, { opacity:1, y:0, duration:.6, ease:'empireOut', onComplete:()=>esc.classList.add('show') });
    }, 4500);
    setTimeout(() => EmpireAnim.ambientLoops?.(), 1500);
  } else {
    setTimeout(() => { document.getElementById('deskArea')?.classList.add('show'); document.getElementById('recArea')?.classList.add('show'); }, 400);
    setTimeout(() => { document.getElementById('greetingBubble')?.classList.add('show'); runPersonalisedGreeting(); }, 900);
    setTimeout(() => document.getElementById('escPrompt')?.classList.add('show'), 4500);
  }
}

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
    if (li >= lines.length) { if (curEl) curEl.style.display = 'none'; return; }
    const ln = lines[li];
    if (ci < ln.length) { fullText += ln[ci]; textEl.textContent = fullText; ci++; setTimeout(next, 36); }
    else { fullText += '\n'; ci = 0; li++; setTimeout(next, 700); }
  }
  next();
}

function showToast(msg) {
  let t = document.getElementById('addToast');
  if (!t) { t = document.createElement('div'); t.id = 'addToast'; document.body.appendChild(t); }
  t.textContent = msg;
  if (window.gsap) {
    gsap.fromTo(t, { opacity:0, y:10 }, { opacity:1, y:0, duration:.3, ease:'empireOut',
      onComplete: () => gsap.to(t, { opacity:0, y:-8, duration:.4, delay:2, ease:'empireSoft' })
    });
  } else {
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 2400);
  }
}

window.initNamePrompt    = initNamePrompt;
window.submitVisitorName = submitVisitorName;
window.initReception     = initReception;
window.showToast         = showToast;
Object.defineProperty(window, 'visitorName', { get: () => visitorName, set: v => { visitorName = v; } });