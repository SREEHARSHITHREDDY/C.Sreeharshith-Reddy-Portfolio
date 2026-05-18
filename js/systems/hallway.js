/**
 * ═══════════════════════════════════════════════
 * hallway.js — First-Person Corridor Navigation
 * Replaces escalator screen on desktop (≥ 769px)
 * C. Sree Harshith Reddy's Empire
 *
 * Flow:
 *  1. goToFloor(fi) calls hallwayTo(fi) on desktop
 *  2. Overlay fades in
 *  3. Corridor rushes toward vanishing point (GSAP)
 *  4. Walker walks forward, shrinking into distance
 *  5. Destination floor number/name zooms out to fill screen
 *  6. White flash → floor resolves
 *  7. Overlay fades out
 * ═══════════════════════════════════════════════
 */

/* ── GUARD — mobile uses escalator ── */
function hallwayAvailable() {
    return window.innerWidth >= 769 && !window.Device?.isReducedMotion;
  }
  
  /* ════════════════════════════════════════════════
     BUILD HTML (injected once on interior mount)
  ════════════════════════════════════════════════ */
  function buildHallwayHTML() {
    if (document.getElementById('hallway-transition')) return;
  
    const el = document.createElement('div');
    el.id = 'hallway-transition';
    el.innerHTML = `
      <div class="hallway-corridor">
  
        <!-- Environment -->
        <div class="hallway-floor"></div>
        <div class="hallway-ceiling"></div>
        <div class="hallway-wall-left"></div>
        <div class="hallway-wall-right"></div>
  
        <!-- Tunnel frames -->
        <div class="hallway-door-frames">
          <div class="hallway-frame"></div>
          <div class="hallway-frame"></div>
          <div class="hallway-frame"></div>
          <div class="hallway-frame"></div>
          <div class="hallway-frame"></div>
        </div>
  
        <!-- Vanishing point glow -->
        <div class="hallway-vp-glow"></div>
  
        <!-- Wall signs -->
        <div class="hallway-signs" id="hallwaySigns"></div>
  
        <!-- Destination card -->
        <div class="hallway-dest" id="hallwayDest">
          <div class="hallway-dest-num"  id="hallwayDestNum">01</div>
          <div class="hallway-dest-name" id="hallwayDestName">About</div>
          <div class="hallway-dest-sub"  id="hallwayDestSub">Bio · Skills · Stats</div>
        </div>
  
        <!-- Walker 1: Harshith (host) -->
        <div class="hallway-walker hallway-walker-host" id="hallwayWalker">
          <div class="hw-head hw-head-host"></div>
          <div class="hw-body hw-body-host"></div>
          <div class="hw-legs">
            <div class="hw-leg left"></div>
            <div class="hw-leg right"></div>
          </div>
          <div class="hw-shadow"></div>
        </div>
        <!-- Walker 2: Visitor -->
        <div class="hallway-walker hallway-walker-visitor" id="hallwayWalkerVisitor">
          <div class="hw-head hw-head-visitor"></div>
          <div class="hw-body hw-body-visitor"></div>
          <div class="hw-legs">
            <div class="hw-leg left"></div>
            <div class="hw-leg right"></div>
          </div>
          <div class="hw-shadow"></div>
        </div>
  
        <!-- Speed blur -->
        <div class="hallway-blur-overlay" id="hallwayBlur"></div>
  
        <!-- HUD -->
        <div class="hallway-hud" id="hallwayHud"></div>
      </div>
    `;
  
    document.body.appendChild(el);
  }
  
  /* ════════════════════════════════════════════════
     BUILD WALL SIGNS
  ════════════════════════════════════════════════ */
  function buildWallSigns(floors) {
    const signsEl = document.getElementById('hallwaySigns');
    if (!signsEl) return;
    signsEl.innerHTML = '';
  
    const sideClasses = ['s-01','s-02','s-03','s-04','s-05'];
    const sides       = ['left','left','left','right','right'];
  
    floors.slice(1).forEach((f, i) => {
      if (i >= 5) return;
      const sign = document.createElement('div');
      sign.className = `hallway-sign ${sideClasses[i]} ${sides[i]}`;
      sign.innerHTML = `<div class="hs-floor">${f.num}</div><div class="hs-name">${f.name}</div>`;
      signsEl.appendChild(sign);
    });
  }
  
  /* ════════════════════════════════════════════════
     BUILD FLOOR HUD
  ════════════════════════════════════════════════ */
  function buildHallwayHud(floors, currentFloor, targetFloor) {
    const hud = document.getElementById('hallwayHud');
    if (!hud) return;
    hud.innerHTML = '';
  
    floors.slice(1).forEach((f, i) => {
      const fi = i + 1;
      if (i > 0) {
        const sep = document.createElement('div');
        sep.className = 'hallway-hud-sep';
        hud.appendChild(sep);
      }
      const num = document.createElement('div');
      num.className = `hallway-hud-floor${fi === targetFloor ? ' active' : ''}`;
      num.textContent = f.num;
      hud.appendChild(num);
    });
  }
  
  /* ════════════════════════════════════════════════
     MAIN HALLWAY TRANSITION
  ════════════════════════════════════════════════ */
  function hallwayTo(targetFloor, currentFloor, floors, onComplete) {
    if (!hallwayAvailable()) return false; // signal: use escalator instead
  
    buildHallwayHTML();
    buildWallSigns(floors);
  
    const floor = floors[targetFloor];
    const overlay  = document.getElementById('hallway-transition');
    const dest     = document.getElementById('hallwayDest');
    const destNum  = document.getElementById('hallwayDestNum');
    const destName = document.getElementById('hallwayDestName');
    const destSub  = document.getElementById('hallwayDestSub');
    const walker   = document.getElementById('hallwayWalker');
    const blur     = document.getElementById('hallwayBlur');
    const hud      = document.getElementById('hallwayHud');
    const frames   = overlay.querySelectorAll('.hallway-frame');
    const signs    = overlay.querySelectorAll('.hallway-sign');
    const vpGlow   = overlay.querySelector('.hallway-vp-glow');
  
    // Set destination info
    destNum.textContent  = floor.num;
    destName.textContent = floor.name;
    destSub.textContent  = floor.sub;
  
    buildHallwayHud(floors, currentFloor, targetFloor);
  
    // Reset all elements
    gsap.set(overlay,  { display: 'flex', opacity: 0 });
    gsap.set(dest,     { scale: 0.05, opacity: 0 });
    const walker2 = document.getElementById('hallwayWalkerVisitor');
    gsap.set(walker,  { opacity: 0, y: 0, scale: 1, x: -14 });
    gsap.set(walker2, { opacity: 0, y: 0, scale: 1, x:  14 });
    gsap.set(blur,     { opacity: 0 });
    gsap.set(hud,      { opacity: 0, y: 20 });
    gsap.set(frames,   { scale: 1, opacity: index => [.5,.4,.3,.2,.1][index] });
    gsap.set(signs,    { opacity: 0, x: i => i < 3 ? -20 : 20 });
    gsap.set(vpGlow,   { scale: 1, opacity: .7 });
  
    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.display = 'none';
        overlay.style.opacity  = '0';
        if (onComplete) onComplete();
      }
    });
  
    // ── Phase 1: Corridor appears (0.0 – 0.4s) ──
    tl.to(overlay, { opacity: 1, duration: .35, ease: 'empireSoft' })
  
    // ── Phase 2: Walker appears, signs slide in (0.3 – 0.8s) ──
      .to(walker,  { opacity: 1, duration: .25, ease: 'empireSoft' }, .3)
      .to(walker2, { opacity: 1, duration: .25, ease: 'empireSoft' }, .35)
      .to(signs,  { opacity: 1, x: 0, duration: .4, stagger: .06, ease: 'empireOut' }, .35)
      .to(hud,    { opacity: 1, y: 0, duration: .4, ease: 'empireOut' }, .4)
  
    // ── Phase 3: Rush forward — frames scale up and out (0.6 – 2.0s) ──
      .to(frames, {
          scale: 12,
          opacity: 0,
          duration: 1.5,
          stagger: .08,
          ease: 'power3.in'
        }, .6)
      .to(vpGlow, { scale: 8, opacity: 0, duration: 1.4, ease: 'power3.in' }, .65)
  
    // Both walkers shrink toward vanishing point (walk away together)
      .to([walker, walker2], {
          scale: .12,
          y: -28,
          opacity: .35,
          duration: 1.3,
          ease: 'power2.in'
        }, .65)
  
    // Speed blur increases
      .to(blur, { opacity: 1, duration: .6, ease: 'power2.in' }, .8)
  
    // ── Phase 4: Destination zooms out (1.6 – 2.4s) ──
      .to(dest, {
          scale: 1,
          opacity: 1,
          duration: .75,
          ease: 'empireSnap'
        }, 1.6)
  
    // Flash + blur clears
      .to(blur, { opacity: 0, duration: .3, ease: 'empireSoft' }, 2.0)
  
    // ── Phase 5: Hold destination then fade out (2.4 – 3.0s) ──
      .to(dest,    { opacity: 0, scale: 1.15, duration: .45, ease: 'empireSoft' }, 2.45)
      .to(overlay, { opacity: 0, duration: .4, ease: 'empireSoft' }, 2.6);
  
    return true; // signal: hallway handled it
  }
  
  /* ════════════════════════════════════════════════
     INIT — called once when interior mounts
  ════════════════════════════════════════════════ */
  function initHallway() {
    buildHallwayHTML();
  }
  
  /* ════════════════════════════════════════════════
     EXPOSE
  ════════════════════════════════════════════════ */
  window.HallwaySystem = { to: hallwayTo, init: initHallway, available: hallwayAvailable };
  window.hallwayTo     = hallwayTo;
  window.initHallway   = initHallway;