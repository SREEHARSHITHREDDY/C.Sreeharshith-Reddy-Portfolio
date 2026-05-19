/**
 * ═══════════════════════════════════════════════
 * nav.js — Floor Navigation System
 * Escalator · Floor Panel · Desk · Lobby Walk
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ── FLOOR REGISTRY ── */
const FLOORS = [
  { num: 'G',  name: 'Reception',     sub: 'Ground lobby',         pageId: null },
  { num: '01', name: 'About',         sub: 'Bio · Skills · Stats',  pageId: 'floor-about' },
  { num: '02', name: 'Projects',      sub: 'Enterprise · Research', pageId: 'floor-projects' },
  { num: '03', name: 'Experience',    sub: 'Work · Volunteering',   pageId: 'floor-experience' },
  { num: '04', name: 'Achievements',  sub: 'Certifications · Awards',pageId: 'floor-achievements' },
  { num: '05', name: 'Contact',       sub: "Let's connect",         pageId: 'floor-contact' }
];

let currentFloor  = 0;
let transitioning = false;

/* ── PUBLIC ENTRY POINTS ── */
function deskFloorClick(e, fi) {
  e.preventDefault();
  if (fi === 0 || transitioning) return;
  goToFloor(fi);
}

function goToFloor(fi) {
  if (fi === currentFloor || transitioning) return;

  // Safety: always clear esc-transition overlay before navigating
  const escEl = document.getElementById('esc-transition');
  if (escEl) escEl.classList.remove('show');

  if (currentFloor === 0) {
    lobbyWalkThenEscalate(fi);
  } else if (window.hallwayTo && window.HallwaySystem?.available()) {
    transitioning = true;
    const handled = hallwayTo(fi, currentFloor, FLOORS, () => {
      currentFloor = fi;
      resolveToFloor(fi);
    });
    if (!handled) {
      transitioning = false;
      escalateTo(fi);
    }
  } else {
    escalateTo(fi);
  }
}

/* ── LOBBY WALK SEQUENCE — both characters walk to escalator ── */
function lobbyWalkThenEscalate(targetFloor) {
  transitioning = true;

  const deskArea   = document.getElementById('deskArea');
  const recArea    = document.getElementById('recArea');
  const recPrompt  = document.getElementById('escPrompt');
  const holoMount  = document.getElementById('holoMount');
  const zone       = document.getElementById('recInteraction');
  const host       = document.getElementById('recHostFigure');
  const visitor    = document.getElementById('recVisitorFigure');
  const handshake  = document.getElementById('recHandshake');

  if (window.gsap) {
    // 1. Fade out static elements (desk, receptionist, holo, prompt)
    gsap.to([deskArea, recArea, recPrompt, holoMount], {
      opacity: 0, duration: .6, ease: 'empireSoft'
    });

    // 2. Handshake fades, characters separate
    if (handshake) gsap.to(handshake, { opacity:0, duration:.3 });

    // 3. Both characters walk right together — slower, cinematic
    if (host && visitor && zone) {
      // Add walking legs animation class
      const hostLegs    = host.querySelectorAll('.rec-host-leg');
      const visitorLegs = visitor.querySelectorAll('.rec-visitor-leg');
      hostLegs.forEach((l,i)    => { l.style.animation = `${i===0?'swing-left':'swing-right'} .5s ease-in-out infinite`; });
      visitorLegs.forEach((l,i) => { l.style.animation = `${i===0?'swing-left':'swing-right'} .5s ease-in-out infinite`; });

      // Walk the whole zone to the right (escalator side) — slow, 1.8s
      // Use xPercent + x to avoid fighting the translateX(-50%) CSS transform
      gsap.to(zone, {
        x: '+=65vw',   /* slide right by 65% viewport width */
        duration: 1.8,
        ease: 'power1.inOut',
        delay: .4,
        onComplete: () => {
          // Stop walking
          hostLegs.forEach(l    => l.style.animation = '');
          visitorLegs.forEach(l => l.style.animation = '');
          gsap.to(zone, { opacity:0, duration:.3,
            onComplete: () => escalateTo(targetFloor)
          });
        }
      });
    } else {
      // Fallback if zone not found
      setTimeout(() => escalateTo(targetFloor), 800);
    }

  } else {
    // No GSAP fallback
    if (deskArea) { deskArea.style.transition='opacity .5s'; deskArea.style.opacity='0'; }
    if (recArea)  { recArea.style.transition='opacity .5s';  recArea.style.opacity='0'; }
    if (zone)     { zone.style.transition='opacity .8s .5s'; zone.style.opacity='0'; }
    setTimeout(() => escalateTo(targetFloor), 1400);
  }
}

/* ── ESCALATOR TRANSITION ── */
function escalateTo(targetFloor) {
  const escTrans  = document.getElementById('esc-transition');
  const escPanel  = document.getElementById('escBuildingPanel');
  const escDestF  = document.getElementById('escDestFloor');
  const escDestN  = document.getElementById('escDestName');
  const escRider        = document.getElementById('escMainRider');
  const escVisitorRider = document.getElementById('escVisitorRider');
  const escVisitorLabel = document.getElementById('escVisitorLabel');
  const escCount        = document.getElementById('escCounter');
  const floor           = FLOORS[targetFloor];

  // Update visitor label with name
  if (escVisitorLabel && typeof visitorName !== 'undefined' && visitorName) {
    escVisitorLabel.textContent = visitorName.toUpperCase().slice(0, 6);
  }

  // Build side panel
  escPanel.innerHTML = '';
  [...FLOORS].reverse().forEach((f, ri) => {
    const fi  = FLOORS.length - 1 - ri;
    const row = document.createElement('div');
    row.className = 'esc-floor-row' +
      (fi === currentFloor  ? ' current'     : '') +
      (fi === targetFloor   ? ' destination' : '');
    row.innerHTML = `
      <div class="efr-num">${f.num}</div>
      <div class="efr-info"><div class="efr-name">${f.name}</div></div>
      <div class="efr-indicator"></div>`;
    row.onclick = () => { if (!transitioning) goToFloor(fi); };
    escPanel.appendChild(row);
  });

  // Set destination header
  escDestF.textContent = floor.num;
  escDestN.textContent = floor.name;
  escRider.style.bottom = '10px';
  if (escVisitorRider) escVisitorRider.style.bottom = '10px';
  escCount.textContent  = FLOORS[currentFloor].num;

  // Show overlay
  escTrans.classList.add('show');

  // Animate both riders together
  setTimeout(() => {
    const trackH = 280, riderH = 36;
    const frac   = targetFloor / (FLOORS.length - 1);
    const dest   = Math.round(frac * (trackH - riderH));
    escRider.style.bottom = dest + 'px';
    if (escVisitorRider) escVisitorRider.style.bottom = dest + 'px';

    // Floor counter ticks
    let counted = currentFloor;
    const dir   = targetFloor > currentFloor ? 1 : -1;
    const steps = Math.abs(targetFloor - currentFloor) || 1;
    const ci    = setInterval(() => {
      counted += dir;
      const safe = Math.max(0, Math.min(FLOORS.length - 1, counted));
      escCount.textContent = FLOORS[safe].num;
      if (counted === targetFloor) clearInterval(ci);
    }, 2200 / steps);
  }, 100);

  // Resolve after animation
  setTimeout(() => {
    escTrans.classList.remove('show');
    currentFloor = targetFloor;
    resolveToFloor(targetFloor);
  }, 2600);
}

/* ── FLOOR RESOLVER ── */
function resolveToFloor(fi) {
  // Hide all floor pages
  document.querySelectorAll('.floor-page').forEach(p => {
    p.classList.remove('active-floor');
    p.style.display = 'none';
  });

  // Hide reception
  document.getElementById('reception-scene').style.display = 'none';

  if (fi === 0) {
    // Back to lobby — restore all reception elements
    const recScene = document.getElementById('reception-scene');
    if (recScene) recScene.style.display = 'block';
    const deskArea = document.getElementById('deskArea');
    if (deskArea) { deskArea.style.opacity='1'; deskArea.style.transform=''; }
    const recArea  = document.getElementById('recArea');
    if (recArea)  { recArea.style.opacity='1'; recArea.style.transform=''; }
    const holoMount = document.getElementById('holoMount');
    if (holoMount) holoMount.style.opacity='1';
    const recInteraction = document.getElementById('recInteraction');
    if (recInteraction) { recInteraction.style.opacity='1'; recInteraction.style.transform=''; }
    const escPrompt = document.getElementById('escPrompt');
    if (escPrompt) escPrompt.classList.add('show');
    const lc = document.getElementById('lobby-char');
    if (lc) lc.style.opacity = '0';
  } else {
    const page = document.getElementById(FLOORS[fi].pageId);
    if (page) {
      page.style.display = 'flex';
      page.classList.add('active-floor');
    }
  }

  updateFloorPanel(fi);

  // Directory panel visibility
  const fdp = document.getElementById('floorDirPanel');
  if (fi > 0) fdp.classList.add('show');
  else fdp.classList.remove('show');

  updateDeskEscalator(fi);

  // GSAP floor page enter wipe
  if (fi > 0) {
    const page = document.getElementById(FLOORS[fi].pageId);
    if (page && window.EmpireAnim?.floorEnter) EmpireAnim.floorEnter(page);
  }

  // Floor init hooks
  if (fi === 1 && typeof initAboutSection === 'function')       setTimeout(initAboutSection, 100);
  if (fi === 2 && typeof initProjectsFloor === 'function')      setTimeout(initProjectsFloor, 100);
  if (fi === 3 && typeof initExperienceFloor === 'function')    setTimeout(initExperienceFloor, 100);
  if (fi === 4 && typeof initAchievementsFloor === 'function')  setTimeout(initAchievementsFloor, 100);
  if (fi === 5) setTimeout(initContactFloor, 100);

  // FAB visibility + GSAP entrance
  const fabProjects = document.getElementById('fabProjects');
  const fabExp      = document.getElementById('fabExp');
  const fabAch      = document.getElementById('fabAch');
  [fabProjects, fabExp, fabAch].forEach(f => { if (f) f.classList.remove('fab-visible'); });
  const activeFab = fi === 2 ? fabProjects : fi === 3 ? fabExp : fi === 4 ? fabAch : null;
  if (activeFab) {
    activeFab.classList.add('fab-visible');
    if (window.EmpireAnim?.fabIn) EmpireAnim.fabIn(activeFab);
  }

  // Trigger floor dialogue cloud
  if (window.triggerFloorDialogue) triggerFloorDialogue(fi);

  transitioning = false;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ── UI UPDATERS ── */
function updateFloorPanel(fi) {
  document.querySelectorAll('.fdp-floor').forEach(f => {
    f.classList.toggle('fdp-current', parseInt(f.dataset.fi) === fi);
  });
  document.querySelectorAll('.nav-links a').forEach((a, i) => {
    a.classList.toggle('active-nav', i + 1 === fi);
  });
}

function updateDeskEscalator(fi) {
  document.querySelectorAll('.esc-lvl').forEach(l => {
    l.classList.toggle('cur', parseInt(l.dataset.fi) === fi);
  });
  const shaft   = document.getElementById('escShaft');
  const rider   = document.getElementById('escRider');
  const readout = document.getElementById('escReadout');
  if (!shaft || !rider || !readout) return;

  const shH     = shaft.offsetHeight || 100;
  const rH      = 26;
  const usable  = shH - rH - 10;
  const topPx   = 5 + usable * (1 - fi / (FLOORS.length - 1));
  rider.style.top     = Math.round(topPx) + 'px';
  readout.textContent = FLOORS[fi].num;

  document.querySelectorAll('.floor-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.fi) === fi);
  });
}

/* ── ADD MODAL HELPERS ── */
function openAddModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.EmpireAnim?.modalOpen) EmpireAnim.modalOpen(el);
}
function closeAddModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.EmpireAnim?.modalClose) {
    EmpireAnim.modalClose(el, () => { el.classList.remove('open'); document.body.style.overflow = ''; });
  } else {
    el.classList.remove('open'); document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.addEventListener('click', e => {
  document.querySelectorAll('.add-modal').forEach(m => {
    if (e.target === m) closeAddModal(m.id);
  });
});

/* ── EXTERNAL LINK SECURITY ── */
function fixExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    if (!a.rel.includes('noopener')) a.rel = 'noopener noreferrer';
  });
}

/* ── EXPOSE GLOBALLY ── */
window.NavModule = { goToFloor, deskFloorClick, FLOORS };
window.goToFloor     = goToFloor;
window.deskFloorClick = deskFloorClick;
window.openAddModal  = openAddModal;
window.closeAddModal = closeAddModal;
window.fixExternalLinks = fixExternalLinks;
window.resolveToFloor = resolveToFloor;