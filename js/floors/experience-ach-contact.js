/**
 * ═══════════════════════════════════════════════
 * experience.js — Floor 03: Experience Timeline
 * achievements.js — Floor 04
 * contact.js — Floor 05
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ══════════════════════════════════════════════
   FLOOR 03 — EXPERIENCE
══════════════════════════════════════════════ */
function initExperienceFloor() {
  const floor = document.getElementById('floor-experience');
  if (!floor) return;
  floor.scrollTop = 0;

  // Reset all entries
  floor.querySelectorAll('.exp-entry').forEach(e => e.classList.remove('exp-in'));

  // Stagger delays per column
  floor.querySelectorAll('.exp-col-work .exp-entry').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
  floor.querySelectorAll('.exp-col-vol .exp-entry').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.10}s`;
  });

  // IntersectionObserver on floor scroll container
  const entries = Array.from(floor.querySelectorAll('.exp-entry'));
  const obs = new IntersectionObserver(recs => {
    recs.forEach(rec => {
      if (rec.isIntersecting) {
        rec.target.classList.add('exp-in');
        obs.unobserve(rec.target);
      }
    });
  }, { root: floor, threshold: 0.08 });

  entries.forEach(e => obs.observe(e));
}

/* ── ADD EXPERIENCE ── */
function submitAddExp() {
  const role = document.getElementById('ae-role').value.trim();
  if (!role) { alert('Please enter a role.'); return; }

  const org       = document.getElementById('ae-org').value.trim();
  const dur       = document.getElementById('ae-dur').value.trim();
  const type      = document.getElementById('ae-type').value;
  const bullets   = document.getElementById('ae-bullets').value.trim().split('\n').filter(Boolean);
  const skills    = document.getElementById('ae-skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);

  const badgeMap  = { work: 'exp-badge-startup', vol: 'exp-badge-vol', lead: 'exp-badge-lead', mentor: 'exp-badge-mentor' };
  const badgeLbls = { work: 'Work', vol: 'Volunteering', lead: 'Leadership', mentor: 'Mentorship' };
  const colId     = type === 'work' ? 'exp-col-work' : 'exp-col-vol';
  const col       = document.querySelector(`#floor-experience .${colId}`);
  if (!col) { closeAddModal('addExpModal'); return; }

  const entry = document.createElement('div');
  entry.className      = 'exp-entry exp-in';
  entry.dataset.side   = type === 'work' ? 'left' : 'right';

  const bulletHTML = bullets.map(b => `<li>${b}</li>`).join('');
  const skillHTML  = skills.length && type === 'work'
    ? `<div class="exp-skills">${skills.map(s => `<span class="exp-skill">${s}</span>`).join('')}</div>`
    : '';

  entry.innerHTML = `
    <div class="exp-entry-dot"></div>
    <div class="exp-card"><div class="exp-card-body">
      <div class="exp-role-row">
        <div class="exp-role">${role}</div>
        <span class="exp-badge ${badgeMap[type]}">${badgeLbls[type]}</span>
      </div>
      <div class="exp-meta-row">
        <div class="exp-meta-dot" style="background:var(--gold)"></div>
        <span class="exp-company">${org}</span>
        <span class="exp-duration">${dur}</span>
      </div>
      <ul class="exp-bullets">${bulletHTML}</ul>${skillHTML}
    </div></div>`;

  col.appendChild(entry);
  closeAddModal('addExpModal');
  ['ae-role','ae-org','ae-dur','ae-bullets','ae-skills']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  if (typeof showToast === 'function') showToast('Entry added!');
}

/* ══════════════════════════════════════════════
   FLOOR 04 — ACHIEVEMENTS
══════════════════════════════════════════════ */
function initAchievementsFloor() {
  const floor = document.getElementById('floor-achievements');
  if (!floor) return;
  floor.scrollTop = 0;

  // Tab switching
  floor.querySelectorAll('.ach-tab').forEach(tab => {
    tab.onclick = () => {
      floor.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('ach-tab-active'));
      floor.querySelectorAll('.ach-section').forEach(s => s.classList.remove('ach-section-active'));
      tab.classList.add('ach-tab-active');
      const key = tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
      document.getElementById(`achTab${key}`).classList.add('ach-section-active');
      revealAchCards(floor);
    };
  });

  revealAchCards(floor);
}

function revealAchCards(floor) {
  const cards = floor.querySelectorAll('.ach-card,.cert-card');
  cards.forEach(c => c.classList.remove('ach-in'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('ach-in'); obs.unobserve(e.target); }
    });
  }, { root: floor, threshold: 0.08 });

  cards.forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.07}s`;
    obs.observe(c);
  });
}

/* ── ADD ACHIEVEMENT / CERT ── */
function submitAddAch() {
  const title  = document.getElementById('aa-title').value.trim();
  if (!title) { alert('Please enter a title.'); return; }

  const issuer = document.getElementById('aa-issuer').value.trim();
  const date   = document.getElementById('aa-date').value.trim();
  const type   = document.getElementById('aa-type').value;
  const desc   = document.getElementById('aa-desc').value.trim();
  const cred   = document.getElementById('aa-cred').value.trim();
  const link   = document.getElementById('aa-link').value.trim();
  const skills = document.getElementById('aa-skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);

  if (type === 'certification') {
    const grid = document.querySelector('#achTabCertifications .cert-grid');
    if (!grid) return;
    const card = document.createElement('div');
    card.className = 'cert-card ach-in';
    const skillHTML  = skills.map(s => `<span class="cert-skill">${s}</span>`).join('');
    const footerHTML = link
      ? `<a class="cert-link" href="${link}" target="_blank" rel="noopener noreferrer">Verify ↗</a>`
      : `<span class="cert-no-link">No link</span>`;
    card.innerHTML = `
      <div class="cert-header">
        <div class="cert-issuer-badge">${(issuer || '?')[0].toUpperCase()}</div>
        <div class="cert-header-info">
          <div class="cert-title">${title}</div>
          <div class="cert-issuer">${issuer}</div>
          <div class="cert-date">${date}</div>
        </div>
      </div>
      <div class="cert-skills">${skillHTML}</div>
      <div class="cert-footer"><div class="cert-cred">${cred || '—'}</div>${footerHTML}</div>`;
    grid.appendChild(card);
  } else {
    const grid = document.querySelector('#achTabAchievements .ach-grid');
    if (!grid) return;
    const card        = document.createElement('div');
    card.className    = 'ach-card ach-in';
    const coverClass  = type === 'internship' ? 'ach-cover-internship' : 'ach-cover-achievement';
    const badgeClass  = type === 'internship' ? 'badge-internship' : 'badge-achievement';
    const badgeLabel  = type === 'internship' ? 'Internship' : 'Achievement';
    card.innerHTML = `
      <div class="ach-cover ${coverClass}">
        <div class="ach-cover-grid"></div>
        <div class="ach-cover-glow"></div>
        <div class="ach-cover-icon">${(title || 'A')[0]}</div>
        <span class="ach-type-badge ${badgeClass}">${badgeLabel}</span>
        <span class="ach-date-badge">${date}</span>
      </div>
      <div class="ach-card-body">
        <div class="ach-card-title">${title}</div>
        <div class="ach-card-issuer">${issuer}</div>
        <div class="ach-card-desc">${desc}</div>
      </div>`;
    grid.appendChild(card);
  }

  closeAddModal('addAchModal');
  ['aa-title','aa-issuer','aa-date','aa-desc','aa-cred','aa-link','aa-skills']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  if (typeof showToast === 'function') showToast('Added successfully!');
}

/* ══════════════════════════════════════════════
   FLOOR 05 — CONTACT
══════════════════════════════════════════════ */
let cfChannel = 'email';

function selectChannel(ch) {
  cfChannel = ch;
  document.getElementById('cfChannelEmail').classList.toggle('cf-channel-active', ch === 'email');
  document.getElementById('cfEmailForm').style.display = ch === 'email' ? 'block' : 'none';
  document.getElementById('cfActions').style.display   = ch === 'email' ? 'flex'  : 'none';
}

function sendContactEmail() {
  const name    = (document.getElementById('cfName')?.value    || '').trim();
  const email   = (document.getElementById('cfEmail')?.value   || '').trim();
  const subject = (document.getElementById('cfSubject')?.value || '').trim() || 'Reaching out via portfolio';
  const message = (document.getElementById('cfMessage')?.value || '').trim();

  if (!name || !message) {
    if (typeof showToast === 'function') showToast('Please fill in your name and message.');
    return;
  }

  const body = encodeURIComponent(
    `Hi Harshith,\n\n${message}\n\n---\nFrom: ${name}${email ? '\nEmail: ' + email : ''}`
  );
  const subj = encodeURIComponent(subject);
  window.location.href = `mailto:reddyharshith20@gmail.com?subject=${subj}&body=${body}`;

  document.getElementById('cfSuccess').classList.add('show');
  document.getElementById('cfEmailForm').style.display = 'none';
  document.getElementById('cfActions').style.display   = 'none';
}

function resetContactForm() {
  ['cfName','cfEmail','cfSubject','cfMessage'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('cfSuccess').classList.remove('show');
  document.getElementById('cfEmailForm').style.display = 'block';
  document.getElementById('cfActions').style.display   = 'flex';
}

/* ── EXPOSE ── */
window.initExperienceFloor   = initExperienceFloor;
window.submitAddExp          = submitAddExp;
window.initAchievementsFloor = initAchievementsFloor;
window.submitAddAch          = submitAddAch;
window.selectChannel         = selectChannel;
window.sendContactEmail      = sendContactEmail;
window.resetContactForm      = resetContactForm;
