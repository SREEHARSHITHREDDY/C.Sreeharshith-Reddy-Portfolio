/**
 * ═══════════════════════════════════════════════
 * performance.js — Performance & Mobile Layer
 * Lazy loading · Mobile detection · Optimizations
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ════════════════════════════════════════════════
   DEVICE DETECTION
════════════════════════════════════════════════ */
const Device = {
    isMobile:       window.innerWidth < 768,
    isTablet:       window.innerWidth >= 768 && window.innerWidth < 1024,
    isTouch:        ('ontouchstart' in window) || navigator.maxTouchPoints > 0,
    isReducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isLowEnd:       navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2,
    isSafari:       /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  };
  
  /* ════════════════════════════════════════════════
     MOBILE SCENE OPTIMISATIONS
     Reduce star count, skip dust, simplify building
  ════════════════════════════════════════════════ */
  function applyMobileFallbacks() {
    if (!Device.isMobile && !Device.isLowEnd) return;
  
    // Fewer stars
    window._starCount = Device.isMobile ? 60 : 100;
  
    // Skip dust particles on mobile (canvas perf)
    window._skipDust = Device.isMobile;
  
    // Skip helicopter on mobile (already hidden via CSS, stop JS too)
    window._skipHeli = Device.isMobile;
  
    // Reduce window flicker interval
    window._flickerInterval = Device.isMobile ? 2000 : 850;
  
    // Disable GSAP ambient loops on low-end
    if (Device.isLowEnd) window._skipAmbientLoops = true;
  
    console.info('[Empire] Mobile/low-end mode active');
  }
  
  /* ════════════════════════════════════════════════
     REDUCED MOTION — disable GSAP animations
  ════════════════════════════════════════════════ */
  function applyReducedMotion() {
    if (!Device.isReducedMotion) return;
  
    // Override EmpireAnim — instant show/hide instead of GSAP
    if (window.EmpireAnim) {
      const instant = (el, cb) => {
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
        if (cb) cb();
      };
      window.EmpireAnim.namePromptIn    = () => { document.getElementById('visitorNameInput')?.focus(); };
      window.EmpireAnim.namePromptOut   = (cb) => instant(null, cb);
      window.EmpireAnim.receptionIn     = () => {
        document.getElementById('deskArea')?.classList.add('show');
        document.getElementById('recArea')?.classList.add('show');
      };
      window.EmpireAnim.greetingBubbleIn= () => document.getElementById('greetingBubble')?.classList.add('show');
      window.EmpireAnim.floorEnter      = (el) => { if (el) el.style.opacity = '1'; };
      window.EmpireAnim.ambientLoops    = () => {}; // no-op
      window.EmpireAnim.fabIn           = (el) => { if (el) el.style.opacity = '1'; };
    }
  
    console.info('[Empire] Reduced motion mode active');
  }
  
  /* ════════════════════════════════════════════════
     GSAP TICKER OPTIMISATION
     Pause ticker when tab is hidden
  ════════════════════════════════════════════════ */
  function setupVisibilityPause() {
    if (!window.gsap) return;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) gsap.globalTimeline.pause();
      else                  gsap.globalTimeline.resume();
    });
  }
  
  /* ════════════════════════════════════════════════
     RESIZE HANDLER — re-detect on orientation change
  ════════════════════════════════════════════════ */
  let resizeTimer;
  function setupResizeHandler() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        Device.isMobile = window.innerWidth < 768;
        Device.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
        // Reposition dialogue cloud if open
        const cloud = document.getElementById('dialogueCloud');
        if (cloud && Device.isMobile) {
          cloud.style.left   = '16px';
          cloud.style.right  = '16px';
          cloud.style.bottom = '70px';
        }
  
        // Foot canvas resize
        const fc = document.getElementById('footCanvas');
        if (fc) fc.width = window.innerWidth;
      }, 250);
    });
  }
  
  /* ════════════════════════════════════════════════
     TOUCH SWIPE — floor dir panel on mobile
     Swipe up to open, swipe down to close
  ════════════════════════════════════════════════ */
  function setupMobileSwipe() {
    if (!Device.isTouch) return;
  
    let startY = 0;
    document.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
    }, { passive: true });
  
    document.addEventListener('touchend', e => {
      const dy = startY - e.changedTouches[0].clientY;
      // Swipe right on projects carousel
      const fp = document.getElementById('floor-projects');
      if (fp?.classList.contains('active-floor')) return; // carousel handles its own touch
    }, { passive: true });
  }
  
  /* ════════════════════════════════════════════════
     SAFARI BACKDROP-FILTER FIX
  ════════════════════════════════════════════════ */
  function fixSafariBackdrop() {
    if (!Device.isSafari) return;
    // Force GPU layer on blurred elements
    document.querySelectorAll(
      '#interior-nav, .add-modal, .dialogue-cloud, #dialogue-subtitle, .floor-add-fab'
    ).forEach(el => {
      el.style.webkitTransform = 'translateZ(0)';
    });
  }
  
  /* ════════════════════════════════════════════════
     FONT LOADING PERFORMANCE
     Ensure fonts are loaded before reveal
  ════════════════════════════════════════════════ */
  function ensureFontsLoaded() {
    if (!document.fonts?.ready) return Promise.resolve();
    return document.fonts.ready;
  }
  
  /* ════════════════════════════════════════════════
     LAZY IMAGE LOADING (future-proof for assets)
  ════════════════════════════════════════════════ */
  function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;
  
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px' });
  
    imgs.forEach(img => obs.observe(img));
  }
  
  /* ════════════════════════════════════════════════
     SCROLL PERFORMANCE — passive listeners audit
  ════════════════════════════════════════════════ */
  function auditScrollListeners() {
    // Ensure all scroll listeners are passive
    // (scene.js already uses { passive: true })
    // This is a runtime check + fix for any third-party additions
    const origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, opts) {
      if (type === 'scroll' || type === 'touchmove') {
        if (typeof opts === 'object') opts.passive = opts.passive ?? true;
        else if (opts === undefined) opts = { passive: true };
      }
      return origAddEventListener.call(this, type, fn, opts);
    };
  }
  
  /* ════════════════════════════════════════════════
     CSS CUSTOM PROPERTY — expose device info
  ════════════════════════════════════════════════ */
  function exposeDeviceVars() {
    const root = document.documentElement;
    root.style.setProperty('--is-mobile',  Device.isMobile  ? '1' : '0');
    root.style.setProperty('--is-touch',   Device.isTouch   ? '1' : '0');
    // Safe area insets for notched phones
    root.style.setProperty('--safe-top',    'env(safe-area-inset-top, 0px)');
    root.style.setProperty('--safe-bottom', 'env(safe-area-inset-bottom, 0px)');
  }
  
  /* ════════════════════════════════════════════════
     MOBILE VIEWPORT HEIGHT FIX
     Fixes 100vh on mobile browsers with address bar
  ════════════════════════════════════════════════ */
  function fixMobileVH() {
    function setVH() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH, { passive: true });
  }
  
  /* ════════════════════════════════════════════════
     MOBILE NAV CTA — floating bottom button
  ════════════════════════════════════════════════ */
  function injectMobileContactBtn() {
    if (!Device.isMobile) return;
    if (document.getElementById('mobileContactBtn')) return;
  
    const btn = document.createElement('button');
    btn.id        = 'mobileContactBtn';
    btn.innerHTML = "Let's Talk";
    btn.style.cssText = `
      position: fixed; bottom: 64px; left: 50%; transform: translateX(-50%);
      z-index: 190; display: none;
      font-family: var(--font-mono); font-size: .5rem; letter-spacing: 3px;
      text-transform: uppercase; padding: 10px 28px; border-radius: 24px;
      background: var(--accent); border: none; color: #fff; cursor: pointer;
      box-shadow: 0 4px 20px rgba(124,58,237,.5);
    `;
    btn.onclick = () => {
      if (window.goToFloor) goToFloor(5);
      btn.style.display = 'none';
    };
    document.body.appendChild(btn);
  
    // Show when on floors 1-4
    const origResolve = window.resolveToFloor;
    if (origResolve) {
      window.resolveToFloor = function(fi) {
        origResolve(fi);
        btn.style.display = (fi > 0 && fi < 5) ? 'block' : 'none';
      };
    }
  }
  
  /* ════════════════════════════════════════════════
     MAIN INIT
  ════════════════════════════════════════════════ */
  function initPerformance() {
    exposeDeviceVars();
    fixMobileVH();
    applyMobileFallbacks();
    applyReducedMotion();
    setupVisibilityPause();
    setupResizeHandler();
    setupMobileSwipe();
    setupLazyLoading();
    fixSafariBackdrop();
    injectMobileContactBtn();
  
    // Log device info in dev
    console.info('[Empire Performance]', {
      mobile: Device.isMobile,
      touch:  Device.isTouch,
      reducedMotion: Device.isReducedMotion,
      lowEnd: Device.isLowEnd,
    });
  }
  
  /* ════════════════════════════════════════════════
     EXPOSE
  ════════════════════════════════════════════════ */
  window.Device          = Device;
  window.initPerformance = initPerformance;
  
  // Auto-init immediately — performance setup runs before everything else
  initPerformance();