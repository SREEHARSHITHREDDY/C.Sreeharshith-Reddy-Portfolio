/**
 * experience-ach-contact.js — Floors 03 / 04 / 05
 * GSAP-powered · C. Sree Harshith Reddy's Empire
 */

/* ══ FLOOR 03 — EXPERIENCE ══ */
function initExperienceFloor() {
  const floor = document.getElementById('floor-experience');
  if (!floor) return;
  floor.scrollTop = 0;
  floor.querySelectorAll('.exp-entry').forEach(e => e.classList.remove('exp-in'));

  if (window.EmpireAnim?.expEntries) {
    EmpireAnim.expEntries(floor);
  } else {
    floor.querySelectorAll('.exp-col-work .exp-entry').forEach((el, i) => el.style.transitionDelay = `${i * 0.12}s`);
    floor.querySelectorAll('.exp-col-vol  .exp-entry').forEach((el, i) => el.style.transitionDelay = `${i * 0.10}s`);
    const obs = new IntersectionObserver(recs => {
      recs.forEach(rec => { if (rec.isIntersecting) { rec.target.classList.add('exp-in'); obs.unobserve(rec.target); } });
    }, { root: floor, threshold: 0.08 });
    floor.querySelectorAll('.exp-entry').forEach(e => obs.observe(e));
  }
}

function submitAddExp() {
  const role = document.getElementById('ae-role').value.trim();
  if (!role) { alert('Please enter a role.'); return; }
  const org     = document.getElementById('ae-org').value.trim();
  const dur     = document.getElementById('ae-dur').value.trim();
  const type    = document.getElementById('ae-type').value;
  const bullets = document.getElementById('ae-bullets').value.trim().split('\n').filter(Boolean);
  const skills  = document.getElementById('ae-skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);
  const badgeMap  = { work:'exp-badge-startup', vol:'exp-badge-vol', lead:'exp-badge-lead', mentor:'exp-badge-mentor' };
  const badgeLbls = { work:'Work', vol:'Volunteering', lead:'Leadership', mentor:'Mentorship' };
  const colId   = type === 'work' ? 'exp-col-work' : 'exp-col-vol';
  const col     = document.querySelector(`#floor-experience .${colId}`);
  if (!col) { closeAddModal('addExpModal'); return; }
  const entry   = document.createElement('div');
  entry.className    = 'exp-entry exp-in';
  entry.dataset.side = type === 'work' ? 'left' : 'right';
  const bulletHTML   = bullets.map(b => `<li>${b}</li>`).join('');
  const skillHTML    = skills.length && type === 'work' ? `<div class="exp-skills">${skills.map(s=>`<span class="exp-skill">${s}</span>`).join('')}</div>` : '';
  entry.innerHTML = `<div class="exp-entry-dot"></div><div class="exp-card"><div class="exp-card-body"><div class="exp-role-row"><div class="exp-role">${role}</div><span class="exp-badge ${badgeMap[type]}">${badgeLbls[type]}</span></div><div class="exp-meta-row"><div class="exp-meta-dot" style="background:var(--gold)"></div><span class="exp-company">${org}</span><span class="exp-duration">${dur}</span></div><ul class="exp-bullets">${bulletHTML}</ul>${skillHTML}</div></div>`;
  col.appendChild(entry);
  if (window.gsap) gsap.fromTo(entry, { opacity:0, x: type==='work'?-28:28 }, { opacity:1, x:0, duration:.6, ease:'empireOut' });
  closeAddModal('addExpModal');
  ['ae-role','ae-org','ae-dur','ae-bullets','ae-skills'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  if (typeof showToast === 'function') showToast('Entry added!');
}

/* ══ FLOOR 04 — ACHIEVEMENTS ══ */
function initAchievementsFloor() {
  const floor = document.getElementById('floor-achievements');
  if (!floor) return;
  floor.scrollTop = 0;
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
  if (window.EmpireAnim?.achCards) {
    EmpireAnim.achCards(floor);
  } else {
    const cards = floor.querySelectorAll('.ach-card,.cert-card');
    cards.forEach(c => c.classList.remove('ach-in'));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ach-in'); obs.unobserve(e.target); } });
    }, { root: floor, threshold: 0.08 });
    cards.forEach((c,i) => { c.style.transitionDelay = `${i*0.07}s`; obs.observe(c); });
  }
}

function submitAddAch() {
  const title  = document.getElementById('aa-title').value.trim();
  if (!title) { alert('Please enter a title.'); return; }
  const issuer = document.getElementById('aa-issuer').value.trim();
  const date   = document.getElementById('aa-date').value.trim();
  const type   = document.getElementById('aa-type').value;
  const desc   = document.getElementById('aa-desc').value.trim();
  const cred   = document.getElementById('aa-cred').value.trim();
  const link   = document.getElementById('aa-link').value.trim();
  const skills = document.getElementById('aa-skills').value.trim().split(',').map(s=>s.trim()).filter(Boolean);

  if (type === 'certification') {
    const grid = document.querySelector('#achTabCertifications .cert-grid');
    if (!grid) return;
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML = `<div class="cert-header"><div class="cert-issuer-badge">${(issuer||'?')[0].toUpperCase()}</div><div class="cert-header-info"><div class="cert-title">${title}</div><div class="cert-issuer">${issuer}</div><div class="cert-date">${date}</div></div></div><div class="cert-skills">${skills.map(s=>`<span class="cert-skill">${s}</span>`).join('')}</div><div class="cert-footer"><div class="cert-cred">${cred||'—'}</div>${link?`<a class="cert-link" href="${link}" target="_blank" rel="noopener noreferrer">Verify ↗</a>`:`<span class="cert-no-link">No link</span>`}</div>`;
    grid.appendChild(card);
    if (window.gsap) gsap.fromTo(card, { opacity:0, y:20, scale:.95 }, { opacity:1, y:0, scale:1, duration:.55, ease:'empireSnap' });
  } else {
    const grid = document.querySelector('#achTabAchievements .ach-grid');
    if (!grid) return;
    const coverClass = type==='internship'?'ach-cover-internship':'ach-cover-achievement';
    const badgeClass = type==='internship'?'badge-internship':'badge-achievement';
    const badgeLabel = type==='internship'?'Internship':'Achievement';
    const card = document.createElement('div');
    card.className = 'ach-card';
    card.innerHTML = `<div class="ach-cover ${coverClass}"><div class="ach-cover-grid"></div><div class="ach-cover-glow"></div><div class="ach-cover-icon">${(title||'A')[0]}</div><span class="ach-type-badge ${badgeClass}">${badgeLabel}</span><span class="ach-date-badge">${date}</span></div><div class="ach-card-body"><div class="ach-card-title">${title}</div><div class="ach-card-issuer">${issuer}</div><div class="ach-card-desc">${desc}</div></div>`;
    grid.appendChild(card);
    if (window.gsap) gsap.fromTo(card, { opacity:0, y:20, scale:.95 }, { opacity:1, y:0, scale:1, duration:.55, ease:'empireSnap' });
  }

  closeAddModal('addAchModal');
  ['aa-title','aa-issuer','aa-date','aa-desc','aa-cred','aa-link','aa-skills'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  if (typeof showToast === 'function') showToast('Added successfully!');
}

/* ══ FLOOR 05 — CONTACT ══ */
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
  if (!name || !message) { if (typeof showToast === 'function') showToast('Please fill in your name and message.'); return; }
  const body = encodeURIComponent(`Hi Harshith,\n\n${message}\n\n---\nFrom: ${name}${email?'\nEmail: '+email:''}`);
  window.location.href = `mailto:reddyharshith20@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  const success = document.getElementById('cfSuccess');
  if (success) {
    document.getElementById('cfEmailForm').style.display = 'none';
    document.getElementById('cfActions').style.display   = 'none';
    if (window.gsap) gsap.fromTo(success, { opacity:0, y:12 }, { opacity:1, y:0, duration:.5, ease:'empireOut', onStart: ()=>success.classList.add('show') });
    else success.classList.add('show');
  }
}

function resetContactForm() {
  ['cfName','cfEmail','cfSubject','cfMessage'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('cfSuccess').classList.remove('show');
  document.getElementById('cfEmailForm').style.display = 'block';
  document.getElementById('cfActions').style.display   = 'flex';
}

window.initExperienceFloor   = initExperienceFloor;
window.submitAddExp          = submitAddExp;
window.initAchievementsFloor = initAchievementsFloor;
window.submitAddAch          = submitAddAch;
window.selectChannel         = selectChannel;
window.sendContactEmail      = sendContactEmail;
window.resetContactForm      = resetContactForm;

/* ══ FLOOR 05 — CONTACT INIT ══ */
function initContactFloor() {
  const floor = document.getElementById('floor-contact');
  if (!floor) return;
  floor.scrollTop = 0;

  if (!window.gsap) return;

  // Animate header elements in
  const tag     = floor.querySelector('.contact-ftag');
  const title   = floor.querySelector('.contact-title');
  const status  = floor.querySelector('.contact-status');
  const grid    = floor.querySelector('.contact-grid');
  const closing = floor.querySelector('.contact-closing');

  gsap.set([tag, title, status], { opacity:0, y:20 });
  gsap.set(grid,    { opacity:0, y:30 });
  gsap.set(closing, { opacity:0 });

  const tl = gsap.timeline({ defaults:{ ease:'empireOut' } });
  tl.to(tag,     { opacity:1, y:0, duration:.5 })
    .to(title,   { opacity:1, y:0, duration:.65 }, '-=.3')
    .to(status,  { opacity:1, y:0, duration:.45 }, '-=.35')
    .to(grid,    { opacity:1, y:0, duration:.7  }, '-=.2')
    .to(closing, { opacity:1,       duration:.5, delay:.3 });

  // Stagger social cards
  const cards = floor.querySelectorAll('.social-card');
  gsap.fromTo(cards,
    { opacity:0, x:-20 },
    { opacity:1, x:0, duration:.45, stagger:.08, ease:'empireOut', delay:.6 }
  );

  // Status dot pulse
  gsap.to('.contact-status-dot', {
    boxShadow: '0 0 22px rgba(34,197,94,.95)',
    repeat:-1, yoyo:true, duration:1.8, ease:'empireSoft'
  });
}

window.initContactFloor = initContactFloor;