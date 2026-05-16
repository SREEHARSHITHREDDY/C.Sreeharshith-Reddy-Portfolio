/**
 * ═══════════════════════════════════════════════
 * scene.js — Outdoor Scroll Experience
 * Stars · 3D Building · Character · Helicopter · Dust
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ── DOM REFS ── */
const scene       = document.getElementById('scene');
const cityBg      = document.getElementById('cityBg');
const scrollHud   = document.getElementById('scrollHud');
const hudValue    = document.getElementById('hudValue');
const hudFill     = document.getElementById('hudFill');
const scrollHint  = document.getElementById('scrollHint');
const building    = document.getElementById('building');
const doorL       = document.getElementById('doorL');
const doorR       = document.getElementById('doorR');
const welcomeText = document.getElementById('welcomeText');
const groundGlow  = document.getElementById('groundGlow');
const entranceGlow= document.getElementById('entranceGlow');
const blocks      = Array.from({ length: 10 }, (_, i) => document.getElementById(`blk${i}`));
const character   = document.getElementById('character');
const charShadow  = document.getElementById('charShadow');
const distTag     = document.getElementById('distTag');
const footCanvas  = document.getElementById('footCanvas');
const footCtx     = footCanvas.getContext('2d');

/* ── STATE ── */
const THRESHOLDS = [.38,.34,.30,.25,.22,.18,.15,.12,.07,.04];
const DELAYS     = [0, 40, 70, 55, 55, 70, 35, 70, 15, 0];
let doorsOpen      = false;
let prevProgress   = 0;
let isWalking      = false;
let walkStopTimer  = null;
let lastFootX      = -999;
let entryTriggered = false;
const dustParticles = [];

/* ── GENERATORS ── */
function generateStars(count = 180) {
  const wrap = document.getElementById('starsWrap');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s  = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2 + .8;
    const x  = Math.random() * 100;
    const y  = Math.random() * 100;
    const d  = (Math.random() * 3 + 2).toFixed(1);
    const dl = (Math.random() * 4).toFixed(1);
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${x}%;top:${y}%;--d:${d}s;--dl:${dl}s;`;
    frag.appendChild(s);
  }
  wrap.appendChild(frag);
}

function generateCityBg() {
  const container = document.getElementById('cityBg');
  const frag = document.createDocumentFragment();
  [[18,60],[28,95],[22,75],[35,130],[20,55],[30,110],[18,65],[42,155],
   [25,80],[30,100],[20,70],[36,125],[24,85],[28,95],[18,50],[40,140],
   [22,70],[26,90],[32,115],[20,60],[28,95],[18,55],[34,120],[22,75]]
  .forEach(([w, h]) => {
    const el = document.createElement('div');
    el.className = 'cb';
    el.style.cssText = `width:${w}px;height:${h}px;`;
    frag.appendChild(el);
  });
  container.appendChild(frag);
}

function generateRoadDashes(n = 5) {
  const container = document.getElementById('roadDashes');
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'rd';
    container.appendChild(d);
  }
}

/* ── SCROLL HANDLER ── */
function onScroll() {
  if (entryTriggered) return;
  const sceneTop = scene.offsetTop;
  const progress = Math.max(0, Math.min(1,
    (window.scrollY - sceneTop) / (scene.offsetHeight - window.innerHeight)
  ));

  // HUD
  scrollHud.classList.toggle('visible', progress > .005);
  const pct = Math.round(progress * 100);
  hudValue.textContent = `${pct}%`;
  hudFill.style.width  = `${pct}%`;

  // Scroll hint
  scrollHint.classList.toggle('hide', progress > .03);

  // City background fade
  cityBg.style.opacity = Math.max(0, .24 - progress * .55).toFixed(3);

  // Sky gradient intensify
  const bl = Math.min(progress * 1.4, 1);
  document.getElementById('sky').style.background =
    `radial-gradient(ellipse 70% ${55 + bl * 20}% at 50% 0%,rgba(44,16,82,${(.85 + bl * .15).toFixed(2)}) 0%,transparent 70%),` +
    `linear-gradient(180deg,#0d0720 0%,#09061a 40%,#07060e 100%)`;

  // Building blocks
  blocks.forEach((blk, i) => {
    if (progress >= THRESHOLDS[i]) {
      if (!blk.classList.contains('vis'))
        setTimeout(() => blk.classList.add('vis'), DELAYS[i]);
    } else {
      blk.classList.remove('vis');
    }
  });

  // Building scale
  const zp = Math.min(progress / .82, 1);
  const ez = zp * zp * (3 - 2 * zp);
  building.style.transform = `translateX(-50%) scale(${(.28 + ez * .97).toFixed(4)})`;

  // Entrance glow
  const ga = Math.max(0, Math.min(1, (progress - .38) / .3));
  entranceGlow.style.opacity = ga.toFixed(3);

  // Doors
  if (progress >= .82 && !doorsOpen) {
    doorsOpen = true;
    doorL.classList.add('open'); doorR.classList.add('open');
    groundGlow.classList.add('show'); welcomeText.classList.add('show');
  } else if (progress < .78 && doorsOpen) {
    doorsOpen = false;
    doorL.classList.remove('open'); doorR.classList.remove('open');
    groundGlow.classList.remove('show'); welcomeText.classList.remove('show');
  }

  // Character
  updateCharacter(progress);

  // Walk start/stop
  const scrolling = Math.abs(progress - prevProgress) > .0003;
  if (scrolling && progress > .04 && progress < .90) startWalking();
  else if (!scrolling) scheduleStopWalking();

  prevProgress = progress;

  // Entry trigger
  if (progress >= .92) triggerEntry();
}

/* ── CHARACTER ── */
function updateCharacter(p) {
  const vw = window.innerWidth;
  const wt = Math.max(0, Math.min(1, (p - .04) / .78));
  const we = wt * wt * (3 - 2 * wt);
  const cx = vw * .05 + we * (vw * .5 - vw * .05);
  const cs = .45 + we * .60;

  charShadow.style.width = `${22 + (1 - we) * 28}px`;

  let op = 1;
  if (p < .04) op = 0;
  else if (p < .08) op = (p - .04) / .04;
  else if (p > .85) op = Math.max(0, 1 - (p - .85) / .07);

  character.style.opacity   = op.toFixed(3);
  character.style.left      = `${cx}px`;
  character.style.transform = `translateX(-50%) scale(${cs.toFixed(3)})`;

  const dp = Math.round(we * 100);
  distTag.textContent = dp < 95
    ? (dp < 10 ? 'far away' : dp < 40 ? 'approaching' : dp < 75 ? 'almost there' : 'entering...')
    : '';

  if (isWalking && op > .2 && Math.abs(cx - lastFootX) > 28) {
    spawnDust(cx, window.innerHeight - 108);
    lastFootX = cx;
  }
}

function startWalking() {
  if (!isWalking) {
    isWalking = true;
    character.classList.add('walking');
  }
  if (walkStopTimer) { clearTimeout(walkStopTimer); walkStopTimer = null; }
}

function scheduleStopWalking() {
  if (walkStopTimer) return;
  walkStopTimer = setTimeout(() => {
    isWalking = false;
    character.classList.remove('walking');
    walkStopTimer = null;
  }, 180);
}

/* ── DUST PARTICLES ── */
function spawnDust(x, gy) {
  const n = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    dustParticles.push({
      x: x + (Math.random() - .5) * 14,
      y: gy - 4,
      vx: (Math.random() - .5) * .8,
      vy: -(Math.random() * .8 + .2),
      r: Math.random() * 3 + 1,
      life: 1,
      decay: .04 + Math.random() * .03
    });
  }
}

function animateDust() {
  if (footCanvas.width !== window.innerWidth) {
    footCanvas.width  = window.innerWidth;
    footCanvas.height = 40;
  }
  footCtx.clearRect(0, 0, footCanvas.width, footCanvas.height);
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    const p = dustParticles[i];
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0) { dustParticles.splice(i, 1); continue; }
    footCtx.beginPath();
    footCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    footCtx.fillStyle = `rgba(124,58,237,${(p.life * .3).toFixed(2)})`;
    footCtx.fill();
  }
  requestAnimationFrame(animateDust);
}

/* ── WINDOW LIGHTING FLICKER ── */
function startWindowFlicker() {
  setInterval(() => {
    document.querySelectorAll('.win.l1,.win.l2,.win.l3').forEach(w => {
      if (Math.random() > .91) {
        w.style.opacity = '.22';
        setTimeout(() => { w.style.opacity = ''; }, 100 + Math.random() * 200);
      }
    });
  }, 850);
}

/* ── WING SPLIT ANIMATION ── */
function initWingSplit() {
  const wL = document.getElementById('wingL');
  const wR = document.getElementById('wingR');
  wL.style.cssText += 'transform:translateX(-55px);transition:transform 1.1s cubic-bezier(.22,1,.36,1);';
  wR.style.cssText += 'transform:translateX(55px); transition:transform 1.1s cubic-bezier(.22,1,.36,1);';
  new MutationObserver(() => {
    const on = document.getElementById('blk6').classList.contains('vis');
    wL.style.transform = on ? 'translateX(0)' : 'translateX(-55px)';
    wR.style.transform = on ? 'translateX(0)' : 'translateX(55px)';
  }).observe(document.getElementById('blk6'), { attributes: true, attributeFilter: ['class'] });
}

/* ── HELICOPTER ── */
function startHelicopter() {
  const heli = document.getElementById('helicopter');
  if (!heli) return;
  // CSS animation handles arrival — add hover class after 4s
  setTimeout(() => { heli.classList.add('heli-hover'); }, 4000);
  // Fade out on first scroll
  window.addEventListener('scroll', function fadeHeli() {
    if (window.scrollY > 80) {
      heli.style.opacity   = '0';
      heli.style.transition = 'opacity 1s';
      window.removeEventListener('scroll', fadeHeli);
    }
  }, { passive: true });
}

/* ── ENTRY TRIGGER ── */
function triggerEntry() {
  if (entryTriggered) return;
  entryTriggered = true;

  const flashOverlay      = document.getElementById('flash-overlay');
  const transitionOverlay = document.getElementById('transition-overlay');
  const interior          = document.getElementById('interior');
  const interiorNav       = document.getElementById('interior-nav');

  document.body.style.overflow = 'hidden';

  if (window.EmpireAnim?.entryTransition) {
    EmpireAnim.entryTransition(
      // midpoint — swap scene → interior
      () => {
        interior.classList.add('mounted');
        window.scrollTo({ top: 0, behavior: 'instant' });
        scene.style.display = 'none';
        document.body.style.overflow = '';
        interior.classList.add('visible');
      },
      // complete — reveal nav and start reception
      () => {
        EmpireAnim.navIn();
        if (typeof initReception === 'function') initReception();
      }
    );
  } else {
    transitionOverlay.classList.add('dark');
    setTimeout(() => {
      interior.classList.add('mounted');
      window.scrollTo({ top: 0, behavior: 'instant' });
      scene.style.display = 'none';
      document.body.style.overflow = '';
      setTimeout(() => {
        interior.classList.add('visible');
        setTimeout(() => {
          interiorNav.classList.add('show');
          setTimeout(() => {
            transitionOverlay.classList.remove('dark');
            transitionOverlay.classList.add('clear');
            if (typeof initReception === 'function') initReception();
          }, 300);
        }, 300);
      }, 200);
    }, 500);
  }
}

/* ── EXPORT FOR INIT ── */
window.SceneModule = {
  generateStars,
  generateCityBg,
  generateRoadDashes,
  initWingSplit,
  startWindowFlicker,
  animateDust,
  startHelicopter,
  onScroll
};