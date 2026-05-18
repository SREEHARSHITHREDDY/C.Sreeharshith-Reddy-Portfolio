/**
 * reception.js — Lobby / Ground Floor Logic
 * GSAP-powered · C. Sree Harshith Reddy's Empire
 */

let visitorName = '';

/* ── NAME PROMPT ── */
function initNamePrompt() {
  const prompt = document.getElementById('namePrompt');
  if (!prompt) return;
  document.body.style.overflow = 'hidden';
  prompt.classList.remove('hidden');
  if (window.EmpireAnim?.namePromptIn) {
    EmpireAnim.namePromptIn();
  } else {
    setTimeout(() => document.getElementById('visitorNameInput')?.focus(), 300);
  }
}

function submitVisitorName(skip) {
  visitorName = skip ? '' : (document.getElementById('visitorNameInput')?.value || '').trim();
  document.body.style.overflow = '';
  if (window.EmpireAnim?.namePromptOut) {
    EmpireAnim.namePromptOut(() => document.getElementById('namePrompt').classList.add('hidden'));
  } else {
    const p = document.getElementById('namePrompt');
    if (p) { p.style.opacity='0'; p.style.transition='opacity .5s'; setTimeout(()=>p.classList.add('hidden'),500); }
  }
  if (window.updateHoloName) updateHoloName(visitorName);
}

/* ── RECEPTION INIT ── */
function initReception() {
  // Boot subsystems
  if (window.initHallway)       initHallway();
  if (window.initHoloDisplay)   initHoloDisplay();
  if (window.initDialogueSystem) initDialogueSystem();

  /* ── Show desk + receptionist ── */
  const deskArea = document.getElementById('deskArea');
  const recArea  = document.getElementById('recArea');

  if (window.gsap) {
    gsap.set(deskArea, { opacity:0, y:40 });
    gsap.set(recArea,  { opacity:0, x:-20 });
    gsap.to(deskArea, { opacity:1, y:0, duration:.9, delay:.4, ease:'empireOut',
      onComplete: () => deskArea.classList.add('show') });
    gsap.to(recArea,  { opacity:1, x:0, duration:.75, delay:.6, ease:'empireOut',
      onComplete: () => recArea.classList.add('show') });

    // Floor buttons stagger
    const btns = document.querySelectorAll('.floor-btn');
    gsap.fromTo(btns, { opacity:0, x:-10 }, { opacity:1, x:0, duration:.4, stagger:.07, delay:.8, ease:'empireOut' });
  } else {
    setTimeout(() => { deskArea?.classList.add('show'); recArea?.classList.add('show'); }, 400);
  }

  /* ── Greeting bubble typewriter ── */
  setTimeout(() => {
    const bubble = document.getElementById('greetingBubble');
    if (window.EmpireAnim?.greetingBubbleIn) EmpireAnim.greetingBubbleIn();
    else if (bubble) bubble.classList.add('show');
    runPersonalisedGreeting();
  }, 900);

  /* ── Interaction zone — both characters ── */
  setTimeout(() => initInteractionZone(), 1400);

  /* ── Esc prompt ── */
  setTimeout(() => {
    const esc = document.getElementById('escPrompt');
    if (!esc) return;
    if (window.gsap) {
      gsap.fromTo(esc, { opacity:0, y:10 }, { opacity:1, y:0, duration:.6, ease:'empireOut',
        onComplete: ()=>esc.classList.add('show') });
    } else {
      esc.classList.add('show');
    }
  }, 4500);

  /* ── Ambient loops ── */
  setTimeout(() => window.EmpireAnim?.ambientLoops?.(), 1800);

  /* ── Floor dialogue ── */
  if (window.triggerFloorDialogue) setTimeout(() => triggerFloorDialogue(0), 5500);
}

/* ── PERSONALISED TYPEWRITER GREETING ── */
function runPersonalisedGreeting() {
  const textEl = document.getElementById('bubbleText');
  const curEl  = document.getElementById('bubbleCursor');
  if (!textEl) return;
  const name = visitorName ? `, ${visitorName}` : '';
  const lines = [
    `Good day${name}! Welcome to\nC. Sree Harshith Reddy's Empire.`,
    `I'm your guide for today.`,
    `Select a floor from the panel\nor scroll down to begin.`
  ];
  let li=0, ci=0, full='';
  function next() {
    if (li>=lines.length) { if(curEl) curEl.style.display='none'; return; }
    const ln=lines[li];
    if (ci<ln.length) { full+=ln[ci]; textEl.textContent=full; ci++; setTimeout(next,36); }
    else { full+='\n'; ci=0; li++; setTimeout(next,700); }
  }
  next();
}

/* ── INTERACTION ZONE ── */
function initInteractionZone() {
  const zone        = document.getElementById('recInteraction');
  const hostText    = document.getElementById('recHostBubbleText');
  const hostCursor  = document.getElementById('recHostCursor');
  const visitorBubble = document.getElementById('recVisitorBubble');
  const visitorLabel  = document.getElementById('recVisitorLabel');
  const visitorNameEl = document.getElementById('recVisitorBubbleName');
  const handshake     = document.getElementById('recHandshake');
  const host          = document.getElementById('recHostFigure');
  const visitor       = document.getElementById('recVisitorFigure');

  if (!zone) return;

  // Force show — don't rely on CSS transition alone
  zone.style.opacity = '1';
  zone.classList.add('show');

  // Visitor name
  const vName = (typeof visitorName !== 'undefined' && visitorName) ? visitorName : 'Visitor';
  if (visitorLabel)   { visitorLabel.textContent = vName; visitorLabel.classList.add('show'); }
  if (visitorNameEl)  visitorNameEl.textContent = `— ${vName}`;

  // GSAP character entrance
  if (window.gsap) {
    gsap.fromTo(host,    { opacity:0, x:-40 }, { opacity:1, x:0, duration:.75, ease:'empireOut' });
    gsap.fromTo(visitor, { opacity:0, x:40  }, { opacity:1, x:0, duration:.75, ease:'empireOut', delay:.2 });
  } else {
    if (host)    host.style.opacity    = '1';
    if (visitor) visitor.style.opacity = '1';
  }

  // Host bubble typewriter
  if (hostText && hostCursor) {
    const lines = [`Hi ${vName}!`, `Welcome to my Empire.`, `Let me show\nyou around.`];
    let li=0, ci=0, full='';
    hostCursor.style.display = 'inline-block';
    function tick() {
      if (li>=lines.length) { hostCursor.style.display='none'; return; }
      const ln=lines[li];
      if (ci<ln.length) { full+=ln[ci]; hostText.textContent=full; ci++; setTimeout(tick,45); }
      else { full+='\n'; ci=0; li++; setTimeout(tick,650); }
    }
    setTimeout(tick, 500);
  }

  // Visitor bubble + handshake appear after host finishes (~3.5s)
  setTimeout(() => {
    if (visitorBubble) {
      visitorBubble.style.transition = 'opacity .5s';
      visitorBubble.style.opacity    = '1';
      visitorBubble.classList.add('show');
    }
    if (handshake) {
      handshake.style.transition = 'opacity .5s';
      handshake.style.opacity    = '1';
      handshake.classList.add('show');
    }
  }, 3500);
}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('addToast');
  if (!t) { t=document.createElement('div'); t.id='addToast'; document.body.appendChild(t); }
  t.textContent = msg;
  if (window.gsap) {
    gsap.fromTo(t, {opacity:0,y:10}, {opacity:1,y:0,duration:.3,ease:'empireOut',
      onComplete:()=>gsap.to(t,{opacity:0,y:-8,duration:.4,delay:2,ease:'empireSoft'})});
  } else {
    t.style.opacity='1';
    setTimeout(()=>{t.style.opacity='0';},2400);
  }
}

/* ── EXPOSE ── */
window.initNamePrompt     = initNamePrompt;
window.submitVisitorName  = submitVisitorName;
window.initReception      = initReception;
window.showToast          = showToast;
window.initInteractionZone= initInteractionZone;
Object.defineProperty(window,'visitorName',{get:()=>visitorName,set:v=>{visitorName=v;}});