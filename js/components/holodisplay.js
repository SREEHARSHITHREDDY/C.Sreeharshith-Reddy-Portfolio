/**
 * ═══════════════════════════════════════════════
 * holodisplay.js — Holographic Plasma Screen
 * Mounted above reception · Visitor welcome display
 * C. Sree Harshith Reddy's Empire
 *
 * Features:
 *  · Typewriter reveal of visitor name
 *  · Glitch effect on name display
 *  · Scanline + grid overlay animations (CSS)
 *  · Live clock metric
 *  · GSAP-powered mount animation
 *  · Auto-updates when visitorName changes
 * ═══════════════════════════════════════════════
 */

/* ── BUILD HTML ── */
function buildHoloDisplay() {
    const el = document.createElement('div');
    el.className = 'holo-mount';
    el.id        = 'holoMount';
  
    el.innerHTML = `
      <!-- Ceiling brackets -->
      <div class="holo-bracket-row">
        <div class="holo-bracket left"></div>
        <div class="holo-bracket-bar"></div>
        <div class="holo-bracket right"></div>
      </div>
  
      <!-- Main screen -->
      <div class="holo-bezel">
        <div class="holo-screen">
          <div class="holo-grid"></div>
          <div class="holo-glow-bg"></div>
          <div class="holo-scan-line"></div>
  
          <!-- Status row -->
          <div class="holo-status-row">
            <div class="holo-status-dot"></div>
            <span class="holo-status-label">EMPIRE · VISITOR SYSTEM · ONLINE</span>
            <span class="holo-status-id" id="holoSessionId">SESSION —</span>
          </div>
  
          <div class="holo-divider"></div>
  
          <!-- Welcome line -->
          <div class="holo-welcome-line">WELCOME TO THE EMPIRE</div>
  
          <!-- Visitor name -->
          <div class="holo-name-display" id="holoName">
            <span id="holoNameText"></span><span class="holo-cursor" id="holoCursor"></span>
          </div>
  
          <div class="holo-divider"></div>
  
          <!-- Metrics row -->
          <div class="holo-metrics">
            <div class="holo-metric">
              <div class="holo-metric-val" id="holoProjects">07</div>
              <div class="holo-metric-label">Projects</div>
            </div>
            <div class="holo-metric-sep"></div>
            <div class="holo-metric">
              <div class="holo-metric-val" id="holoClock">--:--</div>
              <div class="holo-metric-label">Local Time</div>
            </div>
            <div class="holo-metric-sep"></div>
            <div class="holo-metric">
              <div class="holo-metric-val">HYD</div>
              <div class="holo-metric-label">Location</div>
            </div>
          </div>
        </div>
        <div class="holo-bezel-bar"></div>
      </div>
  
      <!-- Stand -->
      <div class="holo-stand"></div>
      <div class="holo-stand-base"></div>
    `;
  
    // Inject into reception scene, before everything else
    const scene = document.getElementById('reception-scene');
    if (scene) scene.insertBefore(el, scene.firstChild);
  
    return el;
  }
  
  /* ── TYPEWRITER NAME REVEAL ── */
  function holoTypewriterName(name) {
    const textEl   = document.getElementById('holoNameText');
    const cursorEl = document.getElementById('holoCursor');
    if (!textEl) return;
  
    const displayName = name ? name.toUpperCase() : 'VALUED GUEST';
    let i = 0;
    textEl.textContent = '';
    if (cursorEl) cursorEl.style.display = 'inline-block';
  
    const interval = setInterval(() => {
      textEl.textContent += displayName[i];
      i++;
      if (i >= displayName.length) {
        clearInterval(interval);
        // Glitch effect after reveal
        setTimeout(() => triggerHoloGlitch(), 400);
        // Hide cursor after settle
        setTimeout(() => {
          if (cursorEl) cursorEl.style.display = 'none';
        }, 2000);
      }
    }, 80);
  }
  
  /* ── GLITCH EFFECT ── */
  function triggerHoloGlitch() {
    const nameEl = document.getElementById('holoName');
    if (!nameEl) return;
    nameEl.classList.add('glitch');
    setTimeout(() => nameEl.classList.remove('glitch'), 150);
    // Second glitch pulse
    setTimeout(() => {
      nameEl.classList.add('glitch');
      setTimeout(() => nameEl.classList.remove('glitch'), 100);
    }, 300);
  }
  
  /* ── LIVE CLOCK ── */
  function startHoloClock() {
    const clockEl = document.getElementById('holoClock');
    if (!clockEl) return;
  
    function tick() {
      const now = new Date();
      const h   = String(now.getHours()).padStart(2, '0');
      const m   = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}`;
    }
    tick();
    setInterval(tick, 30000); // update every 30s
  }
  
  /* ── SESSION ID ── */
  function setHoloSessionId() {
    const el = document.getElementById('holoSessionId');
    if (!el) return;
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    el.textContent = `SESSION ${id}`;
  }
  
  /* ── MOUNT ANIMATION (GSAP) ── */
  function animateHoloMount(el) {
    if (window.gsap) {
      gsap.set(el, { opacity: 0, y: -30, scaleY: 0.6, transformOrigin: 'top center' });
      gsap.to(el, {
        opacity: 1, y: 0, scaleY: 1,
        duration: 1.1,
        delay: 0.6,
        ease: 'empireOut',
        onComplete: () => {
          // Flicker on for authenticity
          gsap.to(el, { opacity: .4, duration: .06, yoyo: true, repeat: 3,
            onComplete: () => gsap.set(el, { opacity: 1 })
          });
        }
      });
  
      // Bezel glow pulse loop
      gsap.to('.holo-bezel', {
        boxShadow: '0 0 0 1px rgba(124,58,237,.2), 0 0 60px rgba(124,58,237,.35), 0 0 100px rgba(124,58,237,.12), inset 0 0 30px rgba(124,58,237,.08)',
        repeat: -1, yoyo: true,
        duration: 2.5, ease: 'empireSoft'
      });
  
    } else {
      // Fallback — plain CSS
      el.style.transition = 'opacity 1s';
      setTimeout(() => { el.style.opacity = '1'; }, 600);
    }
  }
  
  /* ── MAIN INIT ── */
  function initHoloDisplay() {
    const existing = document.getElementById('holoMount');
    if (existing) existing.remove(); // reset on re-entry
  
    const el = buildHoloDisplay();
    setHoloSessionId();
    startHoloClock();
    animateHoloMount(el);
  
    // Name reveal — triggered after mount animation settles
    const name = (typeof visitorName !== 'undefined' && visitorName) ? visitorName : '';
    setTimeout(() => holoTypewriterName(name), 1800);
  }
  
  /* ── UPDATE NAME (called if name changes) ── */
  function updateHoloName(name) {
    const textEl = document.getElementById('holoNameText');
    const cursorEl = document.getElementById('holoCursor');
    if (!textEl) return;
  
    // Glitch out current name
    triggerHoloGlitch();
    setTimeout(() => {
      textEl.textContent = '';
      if (cursorEl) cursorEl.style.display = 'inline-block';
      holoTypewriterName(name);
    }, 200);
  }
  
  /* ── EXPOSE ── */
  window.initHoloDisplay  = initHoloDisplay;
  window.updateHoloName   = updateHoloName;
  window.triggerHoloGlitch = triggerHoloGlitch;