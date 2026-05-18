/**
 * ═══════════════════════════════════════════════
 * projects-hallway.js — Museum Exhibition Layout
 * Replaces carousel with hallway display for Floor 02
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ── Category pill colours ── */
const PH_CAT_PILL = {
    enterprise: 'color:rgba(180,160,255,.7);border:1px solid rgba(124,58,237,.3);',
    research:   'color:rgba(100,220,240,.7);border:1px solid rgba(6,182,212,.3);',
    innovation: 'color:rgba(245,200,100,.7);border:1px solid rgba(245,158,11,.3);',
    product:    'color:rgba(200,160,255,.7);border:1px solid rgba(192,132,252,.3);'
  };
  
  /* ── Category icons ── */
  const PH_CAT_ICON = {
    enterprise: '◈', research: '◎', innovation: '◬', product: '◧'
  };
  
  /* ════════════════════════════════════════════════
     BUILD HALLWAY HTML
  ════════════════════════════════════════════════ */
  function buildProjectsHallway() {
    const floor = document.getElementById('floor-projects');
    if (!floor) return;
  
    // Check if hallway already built
    if (floor.querySelector('.proj-hallway')) return;
  
    // Hide old carousel elements (CSS hides them, but also hide from DOM flow)
    const stage = floor.querySelector('.proj-stage');
    if (stage) stage.style.display = 'none';
  
    // Build hallway wrapper
    const hallway = document.createElement('div');
    hallway.className = 'proj-hallway';
  
    // Environment elements
    hallway.innerHTML = `
      <div class="ph-ceiling-track"></div>
      <div class="ph-ceiling-glow"></div>
      <div class="ph-floor-line"></div>
      <div class="ph-body" id="phBody">
        <div class="ph-corridor"></div>
      </div>
      <div class="ph-footer">
        <div class="ph-footer-line"></div>
        <span>${PROJECTS.length} Projects · End of Exhibition</span>
        <div class="ph-footer-line"></div>
      </div>
    `;
  
    floor.appendChild(hallway);
  
    // Build project rows
    const body = hallway.querySelector('#phBody');
    PROJECTS.forEach((p, i) => {
      const side  = i % 2 === 0 ? 'ph-left' : 'ph-right';
      const chips = p.stack.slice(0, 3).map(s => `<span class="ph-chip">${s}</span>`).join('');
  
      const row = document.createElement('div');
      row.className = `ph-project-row ${side}`;
      row.dataset.id = p.id;
  
      row.innerHTML = `
        <!-- Wall: title + description -->
        <div class="ph-wall">
          <div class="ph-cat-label">${p.cat} · ${p.year}</div>
          <div class="ph-wall-title" onclick="openModal(${p.id})">${p.title}</div>
          <div class="ph-wall-desc">${p.tagline}</div>
          <div class="ph-stack-chips">${chips}${p.stack.length > 3 ? `<span class="ph-chip">+${p.stack.length-3} more</span>` : ''}</div>
        </div>
  
        <!-- Display case in corridor -->
        <div class="ph-display-zone">
          <div class="ph-case ph-cat-${p.cat}" onclick="openModal(${p.id})">
            <div class="ph-case-cover">
              <div class="ph-case-icon">${PH_CAT_ICON[p.cat] || '◈'}</div>
              <span class="ph-case-year">${p.year}</span>
            </div>
            <div class="ph-case-body">
              <div class="ph-case-title">${p.title}</div>
              <div class="ph-case-tag">${p.cat} Project</div>
              <div class="ph-case-footer">
                <span class="ph-cat-pill" style="${PH_CAT_PILL[p.cat]}">${p.cat}</span>
                <button class="ph-view-btn">View ↗</button>
              </div>
            </div>
            <div class="ph-case-base"></div>
          </div>
        </div>
      `;
  
      body.appendChild(row);
  
      // Divider between rows (not after last)
      if (i < PROJECTS.length - 1) {
        const div = document.createElement('div');
        div.className = 'ph-row-divider';
        body.appendChild(div);
      }
    });
  }
  
  /* ════════════════════════════════════════════════
     SCROLL REVEAL — rows fade in as you scroll
  ════════════════════════════════════════════════ */
  function setupHallwayScrollReveal() {
    const floor = document.getElementById('floor-projects');
    const rows  = floor.querySelectorAll('.ph-project-row');
    if (!rows.length) return;
  
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
  
        const row = e.target;
        if (window.gsap) {
          const wall = row.querySelector('.ph-wall');
          const case_ = row.querySelector('.ph-case');
          const isLeft = row.classList.contains('ph-left');
  
          gsap.fromTo(wall,  { opacity:0, x: isLeft ? -40 : 40 },
                             { opacity:1, x:0, duration:.7, ease:'empireOut' });
          gsap.fromTo(case_, { opacity:0, y:30, scale:.94 },
                             { opacity:1, y:0, scale:1, duration:.65, ease:'empireSnap', delay:.15 });
        } else {
          row.classList.add('ph-visible');
        }
        obs.unobserve(row);
      });
    }, { root: floor, threshold: 0.1 });
  
    rows.forEach(r => obs.observe(r));
  }
  
  /* ════════════════════════════════════════════════
     FILTER — hide/show rows by category
  ════════════════════════════════════════════════ */
  function setupHallwayFilters() {
    document.querySelectorAll('.pf-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('pf-active'));
        btn.classList.add('pf-active');
        const cat = btn.dataset.cat;
        const floor = document.getElementById('floor-projects');
  
        floor.querySelectorAll('.ph-project-row, .ph-row-divider').forEach(el => {
          if (el.classList.contains('ph-row-divider')) {
            el.style.display = cat === 'all' ? '' : 'none';
            return;
          }
          const id  = parseInt(el.dataset.id);
          const p   = PROJECTS.find(x => x.id === id);
          const show = cat === 'all' || (p && p.cat === cat);
          el.style.display = show ? 'flex' : 'none';
          if (show && !el.classList.contains('ph-visible')) {
            el.classList.add('ph-visible');
          }
        });
      };
    });
  }
  
  /* ════════════════════════════════════════════════
     MAIN INIT — called from initProjectsFloor
  ════════════════════════════════════════════════ */
  function initProjectsHallway() {
    buildProjectsHallway();
  
    const floor = document.getElementById('floor-projects');
    if (!floor) return;
  
    // Reset scroll
    floor.scrollTop = 0;
  
    // Setup reveal + filters
    setTimeout(() => {
      setupHallwayScrollReveal();
      setupHallwayFilters();
    }, 150);
  }
  
  /* ── Override initProjectsFloor ── */
  window.initProjectsFloor = initProjectsHallway;
  window.initProjectsHallway = initProjectsHallway;