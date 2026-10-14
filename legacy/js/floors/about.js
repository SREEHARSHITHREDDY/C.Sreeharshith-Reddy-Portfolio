/**
 * about.js — Floor 01: About Section
 * GSAP-powered · C. Sree Harshith Reddy's Empire
 */

function initAboutSection() {
  const contentEl = document.querySelector('.about-floor-content');
  const panelA    = document.getElementById('aboutPanelA');
  const panelB    = document.getElementById('aboutPanelB');

  panelA.classList.remove('panel-visible');
  panelB.classList.remove('panel-visible');
  document.querySelectorAll('.skill-fill').forEach(b => b.style.width = '0%');
  document.querySelectorAll('.stat-num').forEach(n => { n.textContent = '0'; });
  if (contentEl) contentEl.scrollTop = 0;

  if (window.EmpireAnim?.aboutPanelA) {
    requestAnimationFrame(() => {
      EmpireAnim.aboutPanelA();
      setTimeout(animateStats, 600);
    });
  } else {
    requestAnimationFrame(() => {
      panelA.classList.add('panel-visible');
      setTimeout(animateStats, 400);
    });
  }

  if (!contentEl) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (window.EmpireAnim?.aboutPanelB) {
        EmpireAnim.aboutPanelB();
      } else {
        panelB.classList.add('panel-visible');
      }
      setTimeout(animateSkillBars, 200);
      obs.disconnect();
    });
  }, { root: contentEl, threshold: 0.15 });
  obs.observe(panelB);

  const cue = document.getElementById('aboutScrollCue');
  if (cue) {
    cue.style.cursor = 'pointer';
    cue.onclick = () => panelB.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.max(1, Math.ceil(target / 40));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 35);
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    if (window.gsap) {
      gsap.to(bar, { width: bar.dataset.width + '%', duration: 1.2, ease: 'empireOut', delay: .05 });
    } else {
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 50);
    }
  });
}

window.initAboutSection = initAboutSection;