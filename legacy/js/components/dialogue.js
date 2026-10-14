/**
 * ═══════════════════════════════════════════════
 * dialogue.js — Dialogue Cloud System
 * Speech bubbles · Subtitle bar · Guide narration
 * C. Sree Harshith Reddy's Empire
 *
 * Features:
 *  · Reusable dialogue cloud component
 *  · Typewriter text reveal
 *  · Multi-line / multi-step sequences
 *  · Action buttons (View More / Continue)
 *  · Subtitle bar for subtle floor context
 *  · Floor-specific dialogue scripts
 *  · GSAP-powered show/hide
 *  · Auto-dismiss with configurable delay
 * ═══════════════════════════════════════════════
 */

/* ════════════════════════════════════════════════
   DIALOGUE SCRIPTS — one per floor
════════════════════════════════════════════════ */
const DIALOGUE_SCRIPTS = {

  // Floor G — Reception (called after holo display settles)
  reception: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Your Host',
      lines: [
        'Welcome to my Empire. This is where ideas become reality.',
        'Use the floor directory to explore — each floor tells a part of my story.',
        'Feel free to look around. I\'ll be right here if you need guidance.'
      ],
      position: 'bottom-left', tail: 'left',
      actions: [{ label: 'Let\'s Begin →', primary: true, dismiss: true }]
    }
  ],

  // Floor 01 — About
  about: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Floor 01',
      lines: [
        'This floor is about who I am — a builder, thinker, and founder.',
        'I\'m specialising in AI/ML at Woxsen University, and co-founded RainC to mentor the next generation.',
        'Scroll down to explore my skills and tech stack.'
      ],
      position: 'bottom-left', tail: 'left',
      actions: [
        { label: 'View Skills ↓', primary: false, scrollTo: 'aboutPanelB' },
        { label: 'Continue', primary: true, dismiss: true }
      ]
    }
  ],

  // Floor 02 — Projects
  projects: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Floor 02',
      lines: [
        'Each project here solves a real problem — from AI-powered supply chains to IoT water monitoring.',
        'Use the carousel to explore. Click any card for full details including the team and tech stack.',
        'Filter by category using the buttons at the top.'
      ],
      position: 'bottom-left', tail: 'left',
      actions: [
        { label: 'View All Projects', primary: false, dismiss: true },
        { label: 'Got it →', primary: true, dismiss: true }
      ]
    }
  ],

  // Floor 03 — Experience
  experience: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Floor 03',
      lines: [
        'On the left — my professional journey as Co-Founder of RainC.',
        'On the right — leadership and volunteering across seven organisations.',
        'Every role here shaped how I think and build.'
      ],
      position: 'bottom-left', tail: 'left',
      actions: [{ label: 'Understood →', primary: true, dismiss: true }]
    }
  ],

  // Floor 04 — Achievements
  achievements: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Floor 04',
      lines: [
        'Hackathons, internships, and certified credentials — this floor is the proof.',
        'Switch between Achievements and Certifications using the tabs above.',
      ],
      position: 'bottom-left', tail: 'left',
      actions: [{ label: 'Impressive →', primary: true, dismiss: true }]
    }
  ],

  // Floor 05 — Contact
  contact: [
    {
      speaker: 'SH', name: 'Sree Harshith', role: 'Floor 05',
      lines: [
        'You\'ve made it to the top floor. That means something.',
        'I\'m open to internships, collaborations, and conversations about building the future.',
        'Drop a message — I respond within 24 hours.'
      ],
      position: 'bottom-left', tail: 'left',
      actions: [
        { label: 'Send Message', primary: true, action: () => document.getElementById('cfName')?.focus() },
        { label: 'Maybe later', primary: false, dismiss: true }
      ]
    }
  ]
};

/* ════════════════════════════════════════════════
   FLOOR → SCRIPT MAP
════════════════════════════════════════════════ */
const FLOOR_DIALOGUE_MAP = {
  0: 'reception',
  1: 'about',
  2: 'projects',
  3: 'experience',
  4: 'achievements',
  5: 'contact'
};

/* ════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════ */
let activeCloud    = null;
let dialogueSeen   = new Set(); // floors already shown dialogue
let typewriterTimer = null;

/* ════════════════════════════════════════════════
   BUILD CLOUD ELEMENT
════════════════════════════════════════════════ */
function buildCloud(script, stepIndex = 0) {
  const step = Array.isArray(script) ? script[stepIndex] : script;
  const cloud = document.createElement('div');
  cloud.className = `dialogue-cloud dc-pos-${step.position} tail-${step.tail || 'left'}`;
  cloud.id = 'dialogueCloud';

  // Floor badge
  if (step.role) {
    cloud.innerHTML += `<div class="dc-floor-badge">${step.role}</div>`;
  }

  // Speaker row
  cloud.innerHTML += `
    <div class="dc-speaker">
      <div class="dc-speaker-avatar">${step.speaker}</div>
      <span class="dc-speaker-name">${step.name}</span>
      <span class="dc-speaker-role">${step.role || ''}</span>
    </div>`;

  // Text area
  cloud.innerHTML += `
    <div class="dc-text" id="dcText"></div>`;

  // Progress dots if multi-line
  if (step.lines && step.lines.length > 1) {
    const dots = step.lines.map((_, i) =>
      `<div class="dc-dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');
    cloud.innerHTML += `<div class="dc-progress" id="dcProgress">${dots}</div>`;
  }

  // Actions
  if (step.actions?.length) {
    const btns = step.actions.map(a =>
      `<button class="dc-btn${a.primary ? ' dc-btn-primary' : ''}"
        data-dismiss="${!!a.dismiss}"
        data-scroll="${a.scrollTo || ''}"
        data-label="${a.label}"
      >${a.label}</button>`
    ).join('');
    cloud.innerHTML += `
      <div class="dc-actions" id="dcActions">
        ${btns}
        <button class="dc-skip">Dismiss ✕</button>
      </div>`;
  }

  return { cloud, step };
}

/* ════════════════════════════════════════════════
   TYPEWRITER ENGINE
════════════════════════════════════════════════ */
function typewriterLines(lines, textEl, progressEl, onComplete) {
  let lineIndex = 0;
  let charIndex = 0;
  let fullText  = '';

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'dc-cursor';
  textEl.appendChild(cursor);

  function tick() {
    if (lineIndex >= lines.length) {
      cursor.remove();
      if (onComplete) onComplete();
      return;
    }

    const line = lines[lineIndex];

    if (charIndex < line.length) {
      // Insert before cursor
      const textNode = document.createTextNode(line[charIndex]);
      textEl.insertBefore(textNode, cursor);
      charIndex++;
      typewriterTimer = setTimeout(tick, 28);
    } else {
      // Line done
      lineIndex++;
      charIndex = 0;
      if (lineIndex < lines.length) {
        fullText += '\n';
        textEl.insertBefore(document.createTextNode('\n'), cursor);
        // Update progress dots
        if (progressEl) {
          progressEl.querySelectorAll('.dc-dot').forEach((d, i) => {
            d.classList.toggle('active', i === lineIndex);
            d.classList.toggle('done', i < lineIndex);
          });
        }
        typewriterTimer = setTimeout(tick, 500); // pause between lines
      } else {
        cursor.remove();
        if (onComplete) onComplete();
      }
    }
  }

  tick();
}

/* ════════════════════════════════════════════════
   SHOW CLOUD
════════════════════════════════════════════════ */
function showDialogueCloud(script, stepIndex = 0) {
  dismissCloud(false); // clear existing without animation

  const layer = document.getElementById('dialogue-layer');
  if (!layer) return;

  const { cloud, step } = buildCloud(script, stepIndex);
  layer.appendChild(cloud);
  activeCloud = cloud;

  // Bind action buttons
  cloud.querySelectorAll('.dc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scrollTarget = btn.dataset.scroll;
      const shouldDismiss = btn.dataset.dismiss === 'true';
      const label = btn.dataset.label;

      // Find matching action
      const action = step.actions?.find(a => a.label === label);
      if (action?.action) action.action();

      if (scrollTarget) {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (shouldDismiss) dismissCloud(true);
    });
  });

  // Dismiss button
  cloud.querySelector('.dc-skip')?.addEventListener('click', () => dismissCloud(true));

  // GSAP show
  if (window.gsap) {
    gsap.fromTo(cloud,
      { opacity: 0, y: 16, scale: .94 },
      { opacity: 1, y: 0,  scale: 1,
        duration: .55, ease: 'empireSnap' }
    );
  } else {
    cloud.style.opacity   = '1';
    cloud.style.transform = 'none';
  }

  // Start typewriter
  const textEl     = cloud.querySelector('#dcText');
  const progressEl = cloud.querySelector('#dcProgress');
  const actionsEl  = cloud.querySelector('#dcActions');
  if (actionsEl) actionsEl.style.opacity = '0';

  typewriterLines(step.lines, textEl, progressEl, () => {
    // Reveal actions after text completes
    if (actionsEl) {
      if (window.gsap) {
        gsap.to(actionsEl, { opacity: 1, y: 0, duration: .4, ease: 'empireOut' });
      } else {
        actionsEl.style.opacity = '1';
      }
    }

    // Auto-dismiss if configured
    if (step.autoDismiss) {
      setTimeout(() => dismissCloud(true), step.autoDismiss);
    }
  });
}

/* ════════════════════════════════════════════════
   DISMISS CLOUD
════════════════════════════════════════════════ */
function dismissCloud(animate = true) {
  if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }

  const cloud = document.getElementById('dialogueCloud');
  if (!cloud) return;

  if (animate && window.gsap) {
    gsap.to(cloud, {
      opacity: 0, y: 10, scale: .94,
      duration: .35, ease: 'empireSoft',
      onComplete: () => cloud.remove()
    });
  } else {
    cloud.remove();
  }
  activeCloud = null;
}

/* ════════════════════════════════════════════════
   SUBTITLE BAR
════════════════════════════════════════════════ */
function showSubtitle(name, avatar, text, duration = 4000) {
  const bar = document.getElementById('dialogue-subtitle');
  if (!bar) return;

  bar.querySelector('.ds-avatar').textContent  = avatar;
  bar.querySelector('.ds-name').textContent    = name;
  bar.querySelector('.ds-text').textContent    = text;

  bar.classList.add('show');

  if (window.gsap) {
    gsap.fromTo(bar,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: .4, ease: 'empireOut' }
    );
  }

  if (duration > 0) {
    setTimeout(() => hideSubtitle(), duration);
  }
}

function hideSubtitle() {
  const bar = document.getElementById('dialogue-subtitle');
  if (!bar) return;
  if (window.gsap) {
    gsap.to(bar, { opacity: 0, y: 8, duration: .35, ease: 'empireSoft',
      onComplete: () => bar.classList.remove('show')
    });
  } else {
    bar.classList.remove('show');
  }
}

/* ════════════════════════════════════════════════
   FLOOR TRIGGER — called from nav.js on floor resolve
════════════════════════════════════════════════ */
function triggerFloorDialogue(floorIndex) {
  const key    = FLOOR_DIALOGUE_MAP[floorIndex];
  const script = DIALOGUE_SCRIPTS[key];
  if (!script) return;

  // Only show once per session per floor (unless reception)
  if (floorIndex !== 0 && dialogueSeen.has(floorIndex)) {
    // Show subtitle reminder instead
    const step = script[0];
    showSubtitle(step.name, step.speaker, script[0].lines[0], 3500);
    return;
  }

  dialogueSeen.add(floorIndex);

  // Delay so floor content animates in first
  const delay = floorIndex === 0 ? 6500 : 900; // reception: wait for scene to settle
  setTimeout(() => showDialogueCloud(script), delay);
}

/* ════════════════════════════════════════════════
   BUILD SUBTITLE BAR HTML (injected once)
════════════════════════════════════════════════ */
function buildSubtitleBar() {
  if (document.getElementById('dialogue-subtitle')) return;
  const bar = document.createElement('div');
  bar.id = 'dialogue-subtitle';
  bar.innerHTML = `
    <div class="ds-avatar">SH</div>
    <div class="ds-content">
      <div class="ds-name">Sree Harshith</div>
      <div class="ds-text"></div>
    </div>
    <button class="ds-close" onclick="hideSubtitle()">✕</button>`;
  document.body.appendChild(bar);
}

/* ════════════════════════════════════════════════
   BUILD DIALOGUE LAYER (injected once)
════════════════════════════════════════════════ */
function buildDialogueLayer() {
  if (document.getElementById('dialogue-layer')) return;
  const layer = document.createElement('div');
  layer.id = 'dialogue-layer';
  document.body.appendChild(layer);
}

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
function initDialogueSystem() {
  buildDialogueLayer();
  buildSubtitleBar();
}

/* ════════════════════════════════════════════════
   EXPOSE
════════════════════════════════════════════════ */
window.DialogueSystem       = {
  show:               showDialogueCloud,
  dismiss:            dismissCloud,
  showSubtitle:       showSubtitle,
  hideSubtitle:       hideSubtitle,
  triggerFloor:       triggerFloorDialogue,
  scripts:            DIALOGUE_SCRIPTS,
  seen:               dialogueSeen,
};
window.triggerFloorDialogue = triggerFloorDialogue;
window.showDialogueCloud    = showDialogueCloud;
window.dismissCloud         = dismissCloud;
window.showSubtitle         = showSubtitle;
window.hideSubtitle         = hideSubtitle;
window.initDialogueSystem   = initDialogueSystem;