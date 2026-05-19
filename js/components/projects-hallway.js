/**
 * projects-hallway.js — Museum Exhibition Layout
 * Clean grid: wall text | display case, alternating
 * C. Sree Harshith Reddy's Empire
 */

const PH_ICONS = { enterprise:'◈', research:'◎', innovation:'◬', product:'◧' };

function buildProjectsHallway() {
  const floor = document.getElementById('floor-projects');
  if (!floor || floor.querySelector('.proj-hallway')) return;

  // Hide old carousel
  const stage = floor.querySelector('.proj-stage');
  if (stage) stage.style.display = 'none';

  const hallway = document.createElement('div');
  hallway.className = 'proj-hallway';

  // Ceiling + floor accents
  hallway.innerHTML = `
    <div class="ph-ceiling-track"></div>
    <div class="ph-ceiling-glow"></div>
    <div class="ph-floor-line"></div>
    <div class="ph-body" id="phBody"></div>
    <div class="ph-footer">
      <div class="ph-footer-line"></div>
      <span>${PROJECTS.length} Projects · End of Exhibition</span>
      <div class="ph-footer-line"></div>
    </div>`;

  floor.appendChild(hallway);

  const body = hallway.querySelector('#phBody');

  PROJECTS.forEach((p, i) => {
    const side   = i % 2 === 0 ? 'ph-left' : 'ph-right';
    const chips  = p.stack.slice(0,3).map(s => `<span class="ph-chip">${s}</span>`).join('');
    const extra  = p.stack.length > 3 ? `<span class="ph-chip">+${p.stack.length-3}</span>` : '';

    const row = document.createElement('div');
    row.className = `ph-project-row ${side}`;
    row.dataset.id  = p.id;
    row.dataset.cat = p.cat;

    const wall = `
      <div class="ph-wall">
        <div class="ph-cat-label">${p.cat} · ${p.year}</div>
        <div class="ph-wall-title" onclick="openModal(${p.id})">${p.title}</div>
        <div class="ph-wall-desc">${p.tagline}</div>
        <div class="ph-stack-chips">${chips}${extra}</div>
      </div>`;

    const display = `
      <div class="ph-display-zone">
        <div class="ph-case ph-cat-${p.cat}" onclick="openModal(${p.id})">
          <div class="ph-case-cover">
            <div class="ph-case-icon">${PH_ICONS[p.cat]||'◈'}</div>
            <div class="ph-case-glow"></div>
            <span class="ph-case-year">${p.year}</span>
          </div>
          <div class="ph-case-body">
            <div class="ph-case-title">${p.title}</div>
            <div class="ph-case-tag">${p.cat} Project</div>
            <div class="ph-case-footer">
              <span class="ph-cat-pill pill-${p.cat}">${p.cat}</span>
              <button class="ph-view-btn">View ↗</button>
            </div>
          </div>
          <div class="ph-case-base"></div>
        </div>
      </div>`;

    // ph-left: wall | case — ph-right: case | wall
    row.innerHTML = side === 'ph-left' ? wall + display : display + wall;
    body.appendChild(row);
  });
}

/* Scroll reveal with GSAP */
function setupHallwayScrollReveal() {
  const floor = document.getElementById('floor-projects');
  if (!floor) return;
  const rows = floor.querySelectorAll('.ph-project-row');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const row   = e.target;
      const isLeft = row.classList.contains('ph-left');
      if (window.gsap) {
        const wall = row.querySelector('.ph-wall');
        const case_ = row.querySelector('.ph-case');
        gsap.fromTo(wall,  { opacity:0, x: isLeft ? -40 : 40 },
                           { opacity:1, x:0, duration:.65, ease:'empireOut' });
        gsap.fromTo(case_, { opacity:0, y:24, scale:.95 },
                           { opacity:1, y:0, scale:1, duration:.6, ease:'empireSnap', delay:.12 });
      } else {
        row.classList.add('ph-visible');
      }
      obs.unobserve(row);
    });
  }, { root: floor, threshold: 0.1 });

  rows.forEach(r => obs.observe(r));
}

/* Filter */
function setupHallwayFilters() {
  document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('pf-active'));
      btn.classList.add('pf-active');
      const cat   = btn.dataset.cat;
      const floor = document.getElementById('floor-projects');
      floor.querySelectorAll('.ph-project-row').forEach(row => {
        const show = cat === 'all' || row.dataset.cat === cat;
        row.style.display = show ? 'grid' : 'none';
        if (show && !row.classList.contains('ph-visible')) {
          row.classList.add('ph-visible');
        }
      });
    };
  });
}

/* Main init */
function initProjectsHallway() {
  buildProjectsHallway();
  const floor = document.getElementById('floor-projects');
  if (!floor) return;
  floor.scrollTop = 0;
  setTimeout(() => { setupHallwayScrollReveal(); setupHallwayFilters(); }, 150);
}

window.initProjectsFloor    = initProjectsHallway;
window.initProjectsHallway  = initProjectsHallway;