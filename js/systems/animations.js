/**
 * ═══════════════════════════════════════════════
 * animations.js — GSAP Cinematic Animation System
 * C. Sree Harshith Reddy's Empire
 *
 * Covers:
 *  · Name prompt staggered reveal
 *  · Entry transition (overlay sweep)
 *  · Nav bar slide-down
 *  · Reception desk + receptionist rise
 *  · Greeting bubble pop
 *  · Floor panel clip-path reveals
 *  · Escalator transition choreography
 *  · Lobby walk (replaces setInterval)
 *  · Floor content stagger reveals
 *  · Floating ambient pulse loops
 * ═══════════════════════════════════════════════
 */

/* ── GSAP availability guard ── */
if (typeof gsap === 'undefined') {
    console.warn('[Empire] GSAP not loaded — animations.js skipped');
  }
  
  /* ── REGISTER PLUGINS ── */
  gsap.registerPlugin(CustomEase);
  
  /* ── CUSTOM EASES ── */
  CustomEase.create('empireOut',   'M0,0 C0.22,1 0.36,1 1,1');        // signature ease-out-expo
  CustomEase.create('empireSoft',  'M0,0 C0.25,0.46 0.45,0.94 1,1');  // smooth ease
  CustomEase.create('empireSnap',  'M0,0 C0.34,1.56 0.64,1 1,1');     // subtle overshoot
  
  /* ════════════════════════════════════════════════
     1. NAME PROMPT — staggered cinematic reveal
  ════════════════════════════════════════════════ */
  function animateNamePromptIn() {
    const tl = gsap.timeline({ defaults: { ease: 'empireOut' } });
  
    // Reset state
    gsap.set('#namePrompt', { opacity: 0 });
    gsap.set('.np-deco',    { opacity: 0, scaleX: 0 });
    gsap.set('.np-title',   { opacity: 0, y: 40, skewY: 3 });
    gsap.set('.np-label',   { opacity: 0, y: 20 });
    gsap.set('.np-input-wrap', { opacity: 0, y: 24, scaleX: .95 });
    gsap.set('.np-skip',    { opacity: 0 });
  
    tl.to('#namePrompt',      { opacity: 1, duration: .3 })
      .to('.np-deco',         { opacity: 1, scaleX: 1, duration: .6, stagger: .12 }, '-=.1')
      .to('.np-title',        { opacity: 1, y: 0, skewY: 0, duration: .75 }, '-=.35')
      .to('.np-label',        { opacity: 1, y: 0, duration: .5 }, '-=.45')
      .to('.np-input-wrap',   { opacity: 1, y: 0, scaleX: 1, duration: .6 }, '-=.35')
      .to('.np-skip',         { opacity: 1, duration: .4 }, '-=.2')
      .add(() => {
        const inp = document.getElementById('visitorNameInput');
        if (inp) inp.focus();
      });
  
    return tl;
  }
  
  function animateNamePromptOut(cb) {
    const tl = gsap.timeline({ onComplete: cb });
  
    tl.to('.np-input-wrap, .np-title, .np-label', {
        opacity: 0, y: -20, duration: .35, stagger: .06, ease: 'empireSoft'
      })
      .to('#namePrompt', { opacity: 0, duration: .3, ease: 'empireSoft' }, '-=.15')
      .add(() => {
        document.getElementById('namePrompt').classList.add('hidden');
      });
  
    return tl;
  }
  
  /* ════════════════════════════════════════════════
     2. ENTRY TRANSITION — cinematic building entry
  ════════════════════════════════════════════════ */
  function animateEntryTransition(onMidpoint, onComplete) {
    const overlay = document.getElementById('transition-overlay');
    const label   = overlay.querySelector('.transition-label');
  
    const tl = gsap.timeline();
  
    // Fade to dark
    tl.set(overlay, { opacity: 0, pointerEvents: 'all' })
      .to(overlay,  { opacity: 1, duration: .45, ease: 'empireSoft' })
      .to(label,    { opacity: 1, duration: .3,  ease: 'empireSoft' }, '-=.1')
      .add(onMidpoint)
      // Hold briefly then clear
      .to(label,    { opacity: 0, duration: .25, ease: 'empireSoft' }, '+=.25')
      .to(overlay,  { opacity: 0, duration: .6,  ease: 'empireOut',
                      onComplete: () => {
                        overlay.style.pointerEvents = 'none';
                        if (onComplete) onComplete();
                      }
                    }, '-=.1');
  
    return tl;
  }
  
  /* ════════════════════════════════════════════════
     3. NAV BAR — slide down on interior entry
  ════════════════════════════════════════════════ */
  function animateNavIn() {
    const nav = document.getElementById('interior-nav');
    gsap.set(nav, { display: 'flex', y: -60, opacity: 0 });
    gsap.to(nav, {
      y: 0, opacity: 1,
      duration: .75, delay: .3,
      ease: 'empireOut'
    });
  }
  
  /* ════════════════════════════════════════════════
     4. RECEPTION — desk + receptionist rise
  ════════════════════════════════════════════════ */
  function animateReceptionIn() {
    const deskArea = document.getElementById('deskArea');
    const recArea  = document.getElementById('recArea');
    const escPrompt = document.getElementById('escPrompt');
  
    const tl = gsap.timeline();
  
    // Desk rises from below
    gsap.set(deskArea, { display: 'flex', opacity: 0, y: 60 });
    tl.to(deskArea, {
        opacity: 1, y: 0,
        duration: .9, delay: .4,
        ease: 'empireOut'
      })
      .add(() => deskArea.classList.add('show'));
  
    // Receptionist slides in from left
    gsap.set(recArea, { display: 'flex', opacity: 0, x: -30 });
    tl.to(recArea, {
        opacity: 1, x: 0,
        duration: .75,
        ease: 'empireOut'
      }, '-=.5')
      .add(() => recArea.classList.add('show'));
  
    // Floor buttons stagger in
    const btns = document.querySelectorAll('.floor-btn');
    gsap.set(btns, { opacity: 0, x: -12 });
    tl.to(btns, {
        opacity: 1, x: 0,
        duration: .45,
        stagger: .07,
        ease: 'empireOut'
      }, '-=.4');
  
    return tl;
  }
  
  /* ════════════════════════════════════════════════
     5. GREETING BUBBLE — typewriter container pop
  ════════════════════════════════════════════════ */
  function animateGreetingBubbleIn() {
    const bubble = document.getElementById('greetingBubble');
    if (!bubble) return;
  
    gsap.set(bubble, { opacity: 0, scale: .88, transformOrigin: 'bottom left', y: 10 });
    gsap.to(bubble, {
      opacity: 1, scale: 1, y: 0,
      duration: .55,
      ease: 'empireSnap',
      onComplete: () => bubble.classList.add('show')
    });
  }
  
  /* ════════════════════════════════════════════════
     6. FLOOR PANEL REVEALS — clip-path wipe
  ════════════════════════════════════════════════ */
  function animateAboutPanelA() {
    const panel  = document.getElementById('aboutPanelA');
    const header = panel.querySelector('.about-section-header');
    const tagline = panel.querySelector('.about-tagline');
    const bio    = panel.querySelectorAll('.about-bio-p');
    const stats  = panel.querySelectorAll('.stat-card');
    const cue    = panel.querySelector('.about-scroll-cue');
  
    gsap.set(panel, { opacity: 1 });
    gsap.set([header, tagline, bio, cue], { opacity: 0, y: 32 });
    gsap.set(stats, { opacity: 0, y: 24, scale: .95 });
  
    const tl = gsap.timeline({ defaults: { ease: 'empireOut' } });
  
    tl.to(header,  { opacity: 1, y: 0, duration: .65 })
      .to(tagline,  { opacity: 1, y: 0, duration: .55 }, '-=.35')
      .to(bio,      { opacity: 1, y: 0, duration: .5, stagger: .12 }, '-=.3')
      .to(stats,    { opacity: 1, y: 0, scale: 1, duration: .45, stagger: .08 }, '-=.2')
      .to(cue,      { opacity: 1, y: 0, duration: .4 }, '-=.1');
  
    panel.classList.add('panel-visible');
    return tl;
  }
  
  function animateAboutPanelB() {
    const panel = document.getElementById('aboutPanelB');
    const rows  = panel.querySelectorAll('.skill-row');
    const chips = panel.querySelectorAll('.tech-chip');
    const headers = panel.querySelectorAll('.skills-col-header');
  
    gsap.set(panel, { opacity: 1 });
    gsap.set(headers, { opacity: 0, x: -20 });
    gsap.set(rows,  { opacity: 0, x: -16 });
    gsap.set(chips, { opacity: 0, scale: .8, y: 8 });
  
    const tl = gsap.timeline({ defaults: { ease: 'empireOut' } });
  
    tl.to(headers, { opacity: 1, x: 0, duration: .5, stagger: .1 })
      .to(rows,    { opacity: 1, x: 0, duration: .45, stagger: .07 }, '-=.3')
      .to(chips,   { opacity: 1, scale: 1, y: 0, duration: .35, stagger: .04 }, '-=.5');
  
    panel.classList.add('panel-visible');
    return tl;
  }
  
  /* ════════════════════════════════════════════════
     7. ESCALATOR TRANSITION — full choreography
  ════════════════════════════════════════════════ */
  function animateEscalatorIn(targetFloor, floors) {
    const escTrans = document.getElementById('esc-transition');
    const header   = escTrans.querySelector('.esc-dest-header');
    const panel    = document.getElementById('escBuildingPanel');
    const rider    = document.getElementById('escMainRider');
    const counter  = document.getElementById('escCounter');
    const rows     = panel.querySelectorAll('.esc-floor-row');
  
    // Set initial states
    gsap.set(escTrans, { display: 'flex' });
    gsap.set(header,   { opacity: 0, y: -20 });
    gsap.set(rows,     { opacity: 0, x: -18 });
    gsap.set(rider,    { bottom: 10 });
  
    const tl = gsap.timeline();
  
    // Fade in overlay
    tl.fromTo(escTrans, { opacity: 0 }, { opacity: 1, duration: .35, ease: 'empireSoft' })
      .to(header, { opacity: 1, y: 0, duration: .45, ease: 'empireOut' }, '-=.1')
      .to(rows,   { opacity: 1, x: 0, duration: .4,  stagger: .06, ease: 'empireOut' }, '-=.25');
  
    // Rider travels up
    const trackH = 280, riderH = 36;
    const frac   = targetFloor / (floors.length - 1);
    const destPx = Math.round(frac * (trackH - riderH));
  
    tl.to(rider, {
        bottom: destPx,
        duration: 1.8,
        ease: 'empireOut',
        delay: .15
      }, '-=.1');
  
    // Floor counter ticks
    let counted  = 0; // will be set by nav.js to currentFloor
    const dir    = 1;
    const steps  = targetFloor;
  
    return tl;
  }
  
  function animateEscalatorOut(cb) {
    const escTrans = document.getElementById('esc-transition');
  
    gsap.to(escTrans, {
      opacity: 0,
      duration: .5,
      ease: 'empireSoft',
      onComplete: () => {
        escTrans.style.display = 'none';
        escTrans.classList.remove('show');
        if (cb) cb();
      }
    });
  }
  
  /* ════════════════════════════════════════════════
     8. LOBBY WALK — GSAP ticker replaces setInterval
  ════════════════════════════════════════════════ */
  function animateLobbyWalk(onComplete) {
    const lc       = document.getElementById('lobby-char');
    const deskArea = document.getElementById('deskArea');
    const recArea  = document.getElementById('recArea');
  
    // Fade out desk + rec
    gsap.to([deskArea, recArea], {
      opacity: 0, duration: .5, ease: 'empireSoft'
    });
  
    // Place char at center, show it
    gsap.set(lc, { left: '50%', xPercent: -50, opacity: 1 });
    lc.classList.add('lc-walking');
  
    // Walk right off screen
    gsap.to(lc, {
      left: '105%',
      xPercent: 0,
      duration: 1.1,
      ease: 'empireOut',
      onComplete: () => {
        lc.classList.remove('lc-walking');
        gsap.set(lc, { opacity: 0 });
        if (onComplete) onComplete();
      }
    });
  }
  
  /* ════════════════════════════════════════════════
     9. FLOOR CONTENT REVEALS — experience, achievements
  ════════════════════════════════════════════════ */
  function animateExpEntries(floor) {
    const leftEntries  = floor.querySelectorAll('.exp-col-work .exp-entry');
    const rightEntries = floor.querySelectorAll('.exp-col-vol .exp-entry');
  
    gsap.set(leftEntries,  { opacity: 0, x: -28, filter: 'blur(4px)' });
    gsap.set(rightEntries, { opacity: 0, x:  28, filter: 'blur(4px)' });
  
    const obs = new IntersectionObserver(recs => {
      recs.forEach(rec => {
        if (!rec.isIntersecting) return;
        const el   = rec.target;
        const side = el.dataset.side;
        gsap.to(el, {
          opacity: 1, x: 0, filter: 'blur(0px)',
          duration: .6, ease: 'empireOut',
          clearProps: 'filter'
        });
        el.classList.add('exp-in');
        obs.unobserve(el);
      });
    }, { root: floor, threshold: 0.08 });
  
    [...leftEntries, ...rightEntries].forEach(e => obs.observe(e));
  }
  
  function animateAchCards(floor) {
    const cards = floor.querySelectorAll('.ach-card, .cert-card');
    gsap.set(cards, { opacity: 0, y: 28, scale: .96 });
    cards.forEach(c => c.classList.remove('ach-in'));
  
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        gsap.to(e.target, {
          opacity: 1, y: 0, scale: 1,
          duration: .55, ease: 'empireSnap',
          delay: Array.from(cards).indexOf(e.target) * 0.06
        });
        e.target.classList.add('ach-in');
        obs.unobserve(e.target);
      });
    }, { root: floor, threshold: 0.08 });
  
    cards.forEach(c => obs.observe(c));
  }
  
  /* ════════════════════════════════════════════════
     10. FLOOR PAGE ENTER — wipe in new floor content
  ════════════════════════════════════════════════ */
  function animateFloorEnter(pageEl) {
    if (!pageEl) return;
    const children = pageEl.children;
  
    gsap.set(pageEl, { opacity: 0 });
    gsap.to(pageEl, {
      opacity: 1, duration: .45, ease: 'empireSoft'
    });
  
    // Stagger first-level children
    gsap.fromTo(children,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: .55, stagger: .08, ease: 'empireOut', delay: .1 }
    );
  }
  
  /* ════════════════════════════════════════════════
     11. AMBIENT LOOPS — subtle living UI pulses
  ════════════════════════════════════════════════ */
  function startAmbientLoops() {
    // Floor dir panel dots pulse on active
    gsap.to('.fdp-floor.fdp-current .fdp-dot', {
      boxShadow: '0 0 12px rgba(245,158,11,.9)',
      repeat: -1, yoyo: true,
      duration: 1.4, ease: 'empireSoft'
    });
  
    // Desk nameplate dots
    gsap.to('.nameplate-dot', {
      scale: 1.4, opacity: .5,
      repeat: -1, yoyo: true,
      duration: 1.2, stagger: .6, ease: 'empireSoft'
    });
  
    // Nav CTA glow
    gsap.to('.nav-cta', {
      boxShadow: '0 0 18px rgba(124,58,237,.5)',
      repeat: -1, yoyo: true,
      duration: 2, ease: 'empireSoft'
    });
  }
  
  /* ════════════════════════════════════════════════
     12. CAROUSEL CARD TRANSITION — smooth state switch
  ════════════════════════════════════════════════ */
  function animateCarouselActive(card) {
    gsap.fromTo(card,
      { scale: .9, opacity: .4 },
      { scale: 1, opacity: 1, duration: .55, ease: 'empireSnap' }
    );
  }
  
  /* ════════════════════════════════════════════════
     13. MODAL OPEN / CLOSE
  ════════════════════════════════════════════════ */
  function animateModalOpen(modalEl) {
    const inner = modalEl.querySelector('.proj-modal-inner, .add-modal-box');
    gsap.set(modalEl, { display: 'flex', opacity: 0 });
    gsap.set(inner,   { scale: .92, y: 24, opacity: 0 });
  
    gsap.to(modalEl, { opacity: 1, duration: .3, ease: 'empireSoft' });
    gsap.to(inner,   { scale: 1, y: 0, opacity: 1, duration: .5, ease: 'empireSnap' });
  }
  
  function animateModalClose(modalEl, cb) {
    const inner = modalEl.querySelector('.proj-modal-inner, .add-modal-box');
  
    gsap.to(inner,   { scale: .94, y: 16, opacity: 0, duration: .3, ease: 'empireSoft' });
    gsap.to(modalEl, {
      opacity: 0, duration: .35, ease: 'empireSoft',
      onComplete: () => {
        modalEl.style.display = 'none';
        if (cb) cb();
      }
    });
  }
  
  /* ════════════════════════════════════════════════
     14. FAB BUTTON ENTER
  ════════════════════════════════════════════════ */
  function animateFabIn(fabEl) {
    gsap.fromTo(fabEl,
      { opacity: 0, scale: .7, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: .5, ease: 'empireSnap' }
    );
  }
  
  /* ════════════════════════════════════════════════
     EXPORT — override original functions
  ════════════════════════════════════════════════ */
  window.EmpireAnim = {
    namePromptIn:      animateNamePromptIn,
    namePromptOut:     animateNamePromptOut,
    entryTransition:   animateEntryTransition,
    navIn:             animateNavIn,
    receptionIn:       animateReceptionIn,
    greetingBubbleIn:  animateGreetingBubbleIn,
    aboutPanelA:       animateAboutPanelA,
    aboutPanelB:       animateAboutPanelB,
    escalatorIn:       animateEscalatorIn,
    escalatorOut:      animateEscalatorOut,
    lobbyWalk:         animateLobbyWalk,
    expEntries:        animateExpEntries,
    achCards:          animateAchCards,
    floorEnter:        animateFloorEnter,
    ambientLoops:      startAmbientLoops,
    carouselActive:    animateCarouselActive,
    modalOpen:         animateModalOpen,
    modalClose:        animateModalClose,
    fabIn:             animateFabIn,
  };