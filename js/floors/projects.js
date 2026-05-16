/**
 * ═══════════════════════════════════════════════
 * projects.js — Floor 02: 3D Carousel System
 * Data · Carousel · Filters · Modal · Add Project
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ══════════════════════════════════════════════
   PROJECT DATA
══════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: 1, cat: 'enterprise', year: 2025,
    title: 'Shopping Matrix',
    tagline: 'AI-driven multi-vendor e-commerce intelligence platform',
    about: 'Shopping Matrix is an AI-powered multi-vendor e-commerce intelligence platform that analyzes large-scale sales trends, customer behavior, and inventory performance. It provides predictive insights and strategic recommendations to help vendors optimize pricing and maximize revenue.',
    features: [
      'AI-based demand forecasting and trend prediction',
      'Customer behavior and product analytics',
      'Dynamic pricing and discount optimization',
      'Vendor performance dashboards',
      'Inventory optimization engine'
    ],
    impact: 'Improves vendor profitability and operational efficiency through data-driven decision-making and reduced inventory mismanagement.',
    team: [
      { init: 'CSHR', name: 'C. Sree Harshith Reddy',    role: 'Lead / Developer' },
      { init: 'HSSR', name: 'Ch. Hemanth Sri Sai Raja',   role: 'Team Member' },
      { init: 'KSP',  name: 'Krishna Sankeerth Pagoti',   role: 'Team Member' },
      { init: 'DP',   name: 'D. Pragnya',                 role: 'Team Member' }
    ],
    mentor: { init: 'SBP', name: 'Dr. S. Bhanu Prakash', role: 'Mentor' },
    techImpl: 'Built predictive ML models and a decision-support engine to process multi-vendor datasets. Designed scalable architecture for structured commerce data and optimization insights.',
    stack: ['Python','Machine Learning','Data Analytics','React','Node.js','Cloud Deployment']
  },
  {
    id: 2, cat: 'research', year: 2025,
    title: 'AI-DetectChain',
    tagline: 'Blockchain-inspired AI-powered supply chain integrity framework',
    about: 'AI-DetectChain is a blockchain-inspired framework that enhances supply chain transparency using hash chaining and anomaly detection. It identifies tampered, duplicate, or missing transaction records in datasets.',
    features: [
      'SHA-256 hash-based chaining',
      'AI-driven anomaly detection',
      'Duplicate & missing record validation',
      'Transparent supply chain simulation',
      'Cybersecurity verification layer'
    ],
    impact: 'Strengthens data integrity and digital trust in supply chain systems aligned with secure infrastructure practices.',
    team: [
      { init: 'CSHR', name: 'C. Sree Harshith Reddy',  role: 'Lead / Developer' },
      { init: 'KSP',  name: 'Krishna Sankeerth Pagoti', role: 'Team Member' },
      { init: 'MRP',  name: 'M. Ruthwika Prakash',      role: 'Team Member' },
      { init: 'MSY',  name: 'M. Sai Yaswanth',          role: 'Team Member' },
      { init: 'GSV',  name: 'G. Sai Vaibhav',           role: 'Team Member' }
    ],
    mentor: { init: 'MG', name: 'Prof. Meher Gayatri', role: 'Mentor' },
    techImpl: 'Implemented blockchain-style hashing architecture with rule-based anomaly detection to validate transactions and detect inconsistencies.',
    stack: ['Python','SHA-256 Hashing','Data Structures','Cybersecurity Concepts','Simulation']
  },
  {
    id: 3, cat: 'research', year: 2025,
    title: 'AI Safety Filter',
    tagline: 'Modular AI content moderation and safety system',
    about: 'AI Safety Filter is a modular system designed to detect harmful or unsafe inputs using contextual validation and risk classification techniques.',
    features: [
      'Context-aware input validation',
      'Risk classification and severity tagging',
      'Multi-layer filtering architecture',
      'Modular moderation pipeline',
      'Compliance-focused design'
    ],
    impact: 'Enhances AI reliability and ensures safe, policy-compliant outputs.',
    team: [
      { init: 'CSHR', name: 'C. Sree Harshith Reddy', role: 'Lead / Developer' },
      { init: 'RG',   name: 'Rithvik Gattu',          role: 'Team Member' },
      { init: 'GST',  name: 'Gaddam Sai Teja',         role: 'Team Member' },
      { init: 'MSY',  name: 'M. Sai Yaswanth',         role: 'Team Member' },
      { init: 'GSV',  name: 'G. Sai Vaibhav',          role: 'Team Member' }
    ],
    mentor: { init: 'VT', name: 'Prof. Vaishali Thakur', role: 'Mentor' },
    techImpl: 'Designed a layered moderation pipeline combining validation logic and contextual classification for safe AI responses.',
    stack: ['Python','AI Safety Principles','Content Moderation','Rule-Based Systems']
  },
  {
    id: 4, cat: 'innovation', year: 2025,
    title: 'TopicSpin',
    tagline: 'AI-powered structured reasoning and content generation system',
    about: 'TopicSpin is an AI-based reasoning system that converts broad topics into structured, presentation-ready content using contextual analysis.',
    features: [
      'Topic segmentation and refinement',
      'Structured summaries and outlines',
      'Context-aware reasoning',
      'Automated content generation',
      'Logical flow optimization'
    ],
    impact: 'Reduces manual effort in structuring content and improves clarity in presentations.',
    team: [{ init: 'CSHR', name: 'C. Sree Harshith Reddy', role: 'Developer' }],
    mentor: { init: 'JG', name: 'Joshua Gnanaselvan', role: 'Mentor' },
    techImpl: 'Built a reasoning pipeline using contextual analysis and segmentation to transform raw topics into structured outputs.',
    stack: ['Python','NLP Concepts','Prompt Engineering','Structured Reasoning']
  },
  {
    id: 5, cat: 'enterprise', year: 2025,
    title: 'Peer Grading Platform',
    tagline: 'Full-stack collaborative academic evaluation system',
    about: 'Peer Grading Platform is a full-stack system designed to streamline student evaluation workflows with structured grading and analytics.',
    features: [
      'Role-based authentication',
      'Section-wise grading system',
      'Duplicate submission detection',
      'Automated student management',
      'Real-time analytics dashboard'
    ],
    impact: 'Improves grading transparency, efficiency, and accuracy in academic environments.',
    team: [{ init: 'CSHR', name: 'C. Sree Harshith Reddy', role: 'Developer' }],
    mentor: { init: 'JG', name: 'Joshua Gnanaselvan', role: 'Mentor' },
    techImpl: 'Developed using React and TypeScript with a cloud backend supporting authentication, grading workflows, and analytics.',
    stack: ['React','TypeScript','Node.js','Cloud Backend','Authentication Systems']
  },
  {
    id: 6, cat: 'research', year: 2024,
    title: 'Smart Stream',
    tagline: 'IoT-based smart water monitoring and leakage detection system',
    about: 'Smart Stream is an IoT-enabled system that monitors water usage in real time and detects leakages using sensor data and analytics.',
    features: [
      'Real-time flow and pressure monitoring',
      'Leakage detection system',
      'Cloud dashboard visualization',
      'Historical usage analytics',
      'Sustainability insights'
    ],
    impact: 'Promotes efficient water usage and enables early leakage detection.',
    team: [
      { init: 'CSHR', name: 'C. Sree Harshith Reddy', role: 'Developer' },
      { init: 'RG',   name: 'Rithvik Gattu',          role: 'Team Member' },
      { init: 'GST',  name: 'Gaddam Sai Teja',         role: 'Team Member' },
      { init: 'YAA',  name: 'Y. Akhil Abhinay',        role: 'Team Member' }
    ],
    mentor: { init: 'SBP', name: 'Dr. S. Bhanu Prakash', role: 'Mentor' },
    techImpl: 'Integrated IoT sensors with microcontrollers and cloud-based systems for real-time monitoring and analytics.',
    stack: ['IoT Sensors','Microcontroller','Embedded Systems','Cloud Dashboard','Data Visualization']
  },
  {
    id: 7, cat: 'product', year: 2025,
    title: 'SyncMates',
    tagline: 'Collaborative calendar-based scheduling platform',
    about: 'SyncMates is a collaborative scheduling platform that helps users manage events, connect with friends, and avoid conflicts using a unified system.',
    features: [
      'Shared calendar system',
      'Friend-based collaboration',
      'Conflict detection algorithms',
      'Unified planning interface',
      'Productivity-focused tools'
    ],
    impact: 'Enhances coordination and productivity through centralized scheduling.',
    team: [{ init: 'CSHR', name: 'C. Sree Harshith Reddy', role: 'Developer' }],
    mentor: null,
    techImpl: 'Built an interactive system with calendar sync logic and event conflict detection.',
    stack: ['React','JavaScript','Node.js','Calendar APIs','Cloud Backend']
  }
];

/* ══════════════════════════════════════════════
   CAROUSEL STATE
══════════════════════════════════════════════ */
let projIndex    = 0;
let projFiltered = [0,1,2,3,4,5,6];
let projHinted   = false;

/* ══════════════════════════════════════════════
   FLOOR INIT
══════════════════════════════════════════════ */
function initProjectsFloor() {
  projFiltered = PROJECTS.map((_, i) => i);
  projIndex    = 0;
  projHinted   = false;
  updateCarousel();
  buildDots();

  const stage = document.getElementById('projStage');
  if (!stage) return;

  // Wheel scroll
  stage.onwheel = e => {
    e.stopPropagation();
    hideHint();
    if (e.deltaY > 8 || e.deltaX > 8)  projAdvance(1);
    if (e.deltaY < -8 || e.deltaX < -8) projAdvance(-1);
  };

  // Touch swipe
  let tx0 = 0;
  stage.ontouchstart = e => { tx0 = e.touches[0].clientX; };
  stage.ontouchmove  = e => { e.preventDefault(); };
  stage.ontouchend   = e => {
    const dx = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) { hideHint(); projAdvance(dx > 0 ? 1 : -1); }
  };

  // Keyboard
  if (document._projKey) document.removeEventListener('keydown', document._projKey);
  document._projKey = e => {
    const fp = document.getElementById('floor-projects');
    if (!fp || !fp.classList.contains('active-floor')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); hideHint(); projAdvance(1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    { e.preventDefault(); hideHint(); projAdvance(-1); }
  };
  document.addEventListener('keydown', document._projKey);

  // Filters
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('pf-active'));
      btn.classList.add('pf-active');
      const cat      = btn.dataset.cat;
      const allCards = document.querySelectorAll('#floor-projects .proj-card');
      projFiltered   = [];
      allCards.forEach((c, i) => {
        if (cat === 'all' || c.dataset.cat === cat) projFiltered.push(i);
      });
      projIndex = 0;
      updateCarousel();
      buildDots();
    };
  });
}

/* ══════════════════════════════════════════════
   CAROUSEL LOGIC
══════════════════════════════════════════════ */
function projAdvance(dir) {
  const len = projFiltered.length;
  if (len === 0) return;
  projIndex = (projIndex + dir + len) % len;
  updateCarousel();
}

function projGoTo(pos) {
  if (pos < 0 || pos >= projFiltered.length) return;
  projIndex = pos;
  updateCarousel();
}

function updateCarousel() {
  const allCards = Array.from(document.querySelectorAll('#floor-projects .proj-card'));
  const len      = projFiltered.length;

  allCards.forEach((card, i) => {
    const fi = projFiltered.indexOf(i);
    if (fi === -1) { card.dataset.state = 'far'; return; }

    let rel = fi - projIndex;
    if (rel >  Math.floor(len / 2)) rel -= len;
    if (rel < -Math.floor(len / 2)) rel += len;

    if      (rel ===  0) card.dataset.state = 'active';
    else if (rel === -1) card.dataset.state = 'prev';
    else if (rel === -2) card.dataset.state = 'prev2';
    else if (rel ===  1) card.dataset.state = 'next';
    else if (rel ===  2) card.dataset.state = 'next2';
    else                 card.dataset.state = 'far';
  });

  // Dots
  document.querySelectorAll('.proj-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === projIndex);
  });

  // Counter
  const ct = document.getElementById('projCountTxt');
  if (ct) {
    const n = String(projIndex + 1).padStart(2, '0');
    const t = String(projFiltered.length).padStart(2, '0');
    ct.innerHTML = `<strong>${n}</strong> / ${t}`;
  }

  // Progress bar
  const bar = document.getElementById('projBarFill');
  if (bar && projFiltered.length > 1)
    bar.style.width = ((projIndex / (projFiltered.length - 1)) * 100).toFixed(1) + '%';
}

function buildDots() {
  const dotsEl = document.getElementById('projDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  projFiltered.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'proj-dot' + (i === projIndex ? ' active' : '');
    d.onclick   = () => projGoTo(i);
    dotsEl.appendChild(d);
  });
}

function hideHint() {
  if (projHinted) return;
  projHinted = true;
  const h = document.getElementById('projHint');
  if (h) h.classList.add('hidden');
}

/* ══════════════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════════════ */
function openModal(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;

  const cat = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
  document.getElementById('modalMeta').innerHTML = `
    <div class="modal-cat-year">${cat} · ${p.year}</div>
    <div class="modal-title">${p.title}</div>
    <div class="modal-tagline">${p.tagline}</div>`;

  const teamRows  = p.team.map(m => `
    <div class="ms-member">
      <div class="ms-avatar">${m.init}</div>
      <div class="ms-member-info">
        <div class="ms-member-name">${m.name}</div>
        <div class="ms-member-role">${m.role}</div>
      </div>
    </div>`).join('');

  const mentorRow = p.mentor ? `
    <div class="ms-team-divider"></div>
    <div class="ms-member">
      <div class="ms-avatar mentor-av">${p.mentor.init}</div>
      <div class="ms-member-info">
        <div class="ms-member-name">${p.mentor.name}</div>
        <div class="ms-member-role mentor-role">${p.mentor.role}</div>
      </div>
    </div>` : '';

  const feats = p.features.map(f => `<div class="ms-feature">${f}</div>`).join('');
  const chips = p.stack.map(s  => `<span class="ms-chip">${s}</span>`).join('');

  document.getElementById('modalBody').innerHTML = `
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">◎</div>About</div>
      <p class="ms-text">${p.about}</p>
    </div>
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">★</div>Key Features</div>
      <div class="ms-features">${feats}</div>
    </div>
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">⚡</div>Impact</div>
      <p class="ms-text">${p.impact}</p>
    </div>
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">◈</div>Team</div>
      <div class="ms-team">${teamRows}${mentorRow}</div>
    </div>
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">⚙</div>Technical Implementation</div>
      <p class="ms-text">${p.techImpl}</p>
    </div>
    <div class="ms-block">
      <div class="ms-label"><div class="ms-label-icon">◧</div>Tech Stack</div>
      <div class="ms-chips">${chips}</div>
    </div>`;

  document.getElementById('projModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('projModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  const m = document.getElementById('projModal');
  if (m && e.target === m) closeModal();
});

/* ══════════════════════════════════════════════
   ADD PROJECT (live add)
══════════════════════════════════════════════ */
function submitAddProject() {
  const title = document.getElementById('ap-title').value.trim();
  if (!title) { alert('Please enter a project title.'); return; }

  const cat     = document.getElementById('ap-cat').value;
  const year    = document.getElementById('ap-year').value || '2025';
  const tagline = document.getElementById('ap-tagline').value.trim();
  const about   = document.getElementById('ap-about').value.trim();
  const stack   = document.getElementById('ap-stack').value.split(',').map(s => s.trim()).filter(Boolean);
  const teamRaw = document.getElementById('ap-team').value.trim();
  const mentor  = document.getElementById('ap-mentor').value.trim();

  const teamLines = teamRaw.split('\n').filter(Boolean).map(l => {
    const parts = l.split('—');
    return {
      init: (parts[0] || '?').trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4),
      name: (parts[0] || '?').trim(),
      role: (parts[1] || 'Member').trim()
    };
  });

  const newId = PROJECTS.length + 1;
  PROJECTS.push({
    id: newId, cat, year: parseInt(year), title, tagline,
    about, features: [], impact: '',
    team: teamLines,
    mentor: mentor ? {
      init: mentor.split(' ').map(w => w[0]).join('').slice(0, 3),
      name: mentor, role: 'Mentor'
    } : null,
    techImpl: '', stack
  });

  closeAddModal('addProjectModal');
  ['ap-title','ap-tagline','ap-year','ap-about','ap-stack','ap-team','ap-mentor']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

  const currentFloor = window.NavModule?.currentFloor ?? 2; // fallback
  if (currentFloor === 2) {
    projFiltered = [...Array(PROJECTS.length).keys()];
    updateCarousel();
    buildDots();
  }
  if (typeof showToast === 'function') showToast('Project added!');
}

/* ── EXPOSE ── */
window.initProjectsFloor = initProjectsFloor;
window.projAdvance       = projAdvance;
window.projGoTo          = projGoTo;
window.openModal         = openModal;
window.closeModal        = closeModal;
window.submitAddProject  = submitAddProject;
window.PROJECTS          = PROJECTS;
