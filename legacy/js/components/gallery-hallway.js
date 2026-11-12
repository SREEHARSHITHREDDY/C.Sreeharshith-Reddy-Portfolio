/**
 * ═══════════════════════════════════════════════
 * gallery-hallway.js — Wall-Mounted Gallery
 * Floor 03: Work (left) | Volunteering (right)
 * Floor 04: Achievements (left) | Certs (right)
 * C. Sree Harshith Reddy's Empire
 * ═══════════════════════════════════════════════
 */

/* ════════════════════════════════════════════════
   FLOOR 03 DATA — Experience
════════════════════════════════════════════════ */
const EXP_WORK = [
    {
      title: 'Co-Founder',
      sub:   'RainC · Remote',
      date:  'Oct 2024 – Jul 2025',
      badge: 'Startup · Leadership',
      bullets: [
        'Led AI-focused learning initiatives to mentor students in emerging technologies',
        'Designed structured mentorship programs for early-stage skill development',
        'Collaborated on international innovation exposure programs (India–Japan)',
        'Enabled access to curated learning resources from leading tech platforms'
      ],
      skills: ['AI Concepts','Leadership','Mentorship','Entrepreneurship']
    }
  ];
  
  const EXP_VOL = [
    {
      title: 'Cyber Crime Intervention Officer',
      sub:   'National Security Database',
      date:  'Jan 2025 – Present',
      badge: 'Volunteering',
      bullets: [
        'Contributed to cybersecurity awareness and intervention initiatives',
        'Promoted cyber safety practices and digital responsibility'
      ],
      skills: []
    },
    {
      title: 'Member — Dean Fellow Leadership Cell',
      sub:   'Academic Integration Team, Woxsen University',
      date:  'Jul 2025 – Present',
      badge: 'Leadership',
      bullets: [
        'Supported academic coordination and student engagement initiatives',
        'Collaborated with leadership teams to enhance student experience'
      ],
      skills: []
    },
    {
      title: 'Senior Executive',
      sub:   'Woxsen Japan Centre',
      date:  'Apr 2025 – Present',
      badge: 'Leadership',
      bullets: [
        'Facilitated international collaboration and cultural exchange programs',
        'Contributed to Indo-Japan academic and innovation initiatives'
      ],
      skills: []
    },
    {
      title: 'AI Department Executive (HoD)',
      sub:   'Arthaverse Club',
      date:  'Apr 2025 – Mar 2026',
      badge: 'Leadership',
      bullets: [
        'Led AI domain activities, workshops, and technical initiatives',
        'Coordinated execution of AI-based projects and events'
      ],
      skills: []
    },
    {
      title: 'L&D Ambassador',
      sub:   'Centre of Talent Development',
      date:  'Nov 2024 – Present',
      badge: 'Mentorship',
      bullets: [
        'Promoted learning and development initiatives across student communities',
        'Supported peers in skill-building and career development'
      ],
      skills: []
    },
    {
      title: 'Student Ambassador',
      sub:   'AI Research Centre, Woxsen University',
      date:  'Jul – Oct 2025',
      badge: 'Leadership',
      bullets: [
        'Represented the AI Research Centre in student outreach initiatives',
        'Assisted in organizing and promoting AI-focused events'
      ],
      skills: []
    },
    {
      title: 'Executive',
      sub:   'Woxsen Tech Club',
      date:  'Aug 2024 – Mar 2025',
      badge: 'Leadership',
      bullets: [
        'Supported execution of technical events and workshops',
        'Collaborated with team members to improve student engagement'
      ],
      skills: []
    }
  ];
  
  /* ════════════════════════════════════════════════
     FLOOR 04 DATA — Achievements & Certs
  ════════════════════════════════════════════════ */
  const ACH_LIST = [
    {
      title: 'Hyperspace Innovation Hackathon',
      sub:   'Technest · Microsoft · AWS · IPEC-TBI',
      date:  'Feb 2026',
      badge: 'Hackathon',
      desc:  'Participated as part of Team Code Commandos across AI, Space Tech, and Open Innovation. Recognized for technical depth and problem-solving approach.'
    },
    {
      title: 'DecentraHack — Anantya 2026',
      sub:   'Pimpri Chinchwad College of Engineering',
      date:  'Jan 2026',
      badge: 'Hackathon',
      desc:  'Participated in a national-level hackathon focused on decentralized technologies, demonstrating technical implementation skills.'
    },
    {
      title: 'Agnirva Space Internship Program',
      sub:   'Agnirva · ISRO Registered · IN-SPACe',
      date:  'Jan 2025',
      badge: 'Internship',
      desc:  'Completed 8-week space internship — ~80 hours across 440+ structured tasks, gaining exposure to space technologies.'
    },
    {
      title: 'National Students Paryavaran Competition',
      sub:   'Ministry of Environment, Forest & Climate Change, GoI',
      date:  '2025',
      badge: 'National',
      desc:  'Participated in a national-level environmental competition, demonstrating engagement in sustainability issues.'
    }
  ];
  
  const CERT_LIST = [
    {
      title:  'Professional Career Development & Industry Orientation',
      issuer: 'Skillified Mentor',
      date:   'Mar 2026',
      cred:   'd90d01fc-68a1-4e5e-ad99',
      link:   null,
      skills: ['Career Development','Industry Exposure','Professional Skills']
    },
    {
      title:  'Economics Micro & Macro — Professional Diploma',
      issuer: 'European Open University',
      date:   'Feb 2026',
      cred:   '—',
      link:   null,
      skills: ['Microeconomics','Macroeconomics','Economic Analysis']
    },
    {
      title:  'Write Professional Emails in English',
      issuer: 'Georgia Institute of Technology · Coursera',
      date:   'Mar 2025',
      cred:   'EHJ56C1W9IE2',
      link:   'https://coursera.org/verify/EHJ56C1W9IE2',
      skills: ['Business Communication','Professional Writing']
    },
    {
      title:  'Java Programming: Solving Problems with Software',
      issuer: 'Duke University · Coursera',
      date:   'Apr 2025',
      cred:   'MTBWB0BUN7PP',
      link:   'https://coursera.org/verify/MTBWB0BUN7PP',
      skills: ['Java','Problem Solving','OOP']
    },
    {
      title:  'Data Structures Using Python — An Introduction',
      issuer: 'Packt · Coursera',
      date:   'Feb 2025',
      cred:   'UCJWA8KDQHVN',
      link:   'https://coursera.org/verify/UCJWA8KDQHVN',
      skills: ['Data Structures','Python']
    },
    {
      title:  'Advanced Functional Ceramics',
      issuer: 'Yonsei University · Coursera',
      date:   'Mar 2025',
      cred:   'YBAZDESCB410',
      link:   'https://coursera.org/verify/YBAZDESCB410',
      skills: ['Materials Science','Engineering Concepts']
    }
  ];
  
  /* ════════════════════════════════════════════════
     FRAME BUILDER HELPERS
  ════════════════════════════════════════════════ */
  function buildWorkFrame(item) {
    const bullets = item.bullets.map(b => `<li>${b}</li>`).join('');
    const skills  = item.skills.map(s => `<span class="gh-skill-chip">${s}</span>`).join('');
    return `
      <div class="gh-frame gh-type-work">
        <div class="gh-frame-screws"></div>
        <div class="gh-frame-bar"></div>
        <div class="gh-frame-inner">
          <div class="gh-frame-type">Work Experience</div>
          <div class="gh-frame-title">${item.title}</div>
          <div class="gh-frame-sub">${item.sub}</div>
          <div class="gh-frame-meta">
            <span class="gh-frame-date">${item.date}</span>
            <span class="gh-frame-badge">${item.badge}</span>
          </div>
          <ul class="gh-frame-bullets">${bullets}</ul>
          ${skills ? `<div class="gh-frame-skills">${skills}</div>` : ''}
        </div>
      </div>`;
  }
  
  function buildVolFrame(item) {
    const bullets = item.bullets.map(b => `<li>${b}</li>`).join('');
    return `
      <div class="gh-frame gh-type-vol">
        <div class="gh-frame-screws"></div>
        <div class="gh-frame-bar"></div>
        <div class="gh-frame-inner">
          <div class="gh-frame-type">Volunteering & Leadership</div>
          <div class="gh-frame-title">${item.title}</div>
          <div class="gh-frame-sub">${item.sub}</div>
          <div class="gh-frame-meta">
            <span class="gh-frame-date">${item.date}</span>
            <span class="gh-frame-badge">${item.badge}</span>
          </div>
          <ul class="gh-frame-bullets">${bullets}</ul>
        </div>
      </div>`;
  }
  
  function buildAchFrame(item) {
    return `
      <div class="gh-frame gh-type-achievement">
        <div class="gh-frame-screws"></div>
        <div class="gh-frame-bar"></div>
        <div class="gh-frame-inner">
          <div class="gh-frame-type">Achievement</div>
          <div class="gh-frame-title">${item.title}</div>
          <div class="gh-frame-sub">${item.sub}</div>
          <div class="gh-frame-meta">
            <span class="gh-frame-date">${item.date}</span>
            <span class="gh-frame-badge">${item.badge}</span>
          </div>
          <ul class="gh-frame-bullets"><li>${item.desc}</li></ul>
        </div>
      </div>`;
  }
  
  function buildCertFrame(item) {
    const skills = item.skills.map(s => `<span class="gh-skill-chip">${s}</span>`).join('');
    const link   = item.link
      ? `<a class="gh-verify-link" href="${item.link}" target="_blank" rel="noopener noreferrer">Verify ↗</a>`
      : `<span style="font-family:var(--font-mono);font-size:.38rem;color:rgba(124,58,237,.3);">${item.cred}</span>`;
    return `
      <div class="gh-frame gh-type-cert">
        <div class="gh-frame-screws"></div>
        <div class="gh-frame-bar"></div>
        <div class="gh-frame-inner">
          <div class="gh-frame-type">Certification</div>
          <div class="gh-frame-title">${item.title}</div>
          <div class="gh-frame-sub">${item.issuer}</div>
          <div class="gh-frame-meta">
            <span class="gh-frame-date">${item.date}</span>
            ${link}
          </div>
          ${skills ? `<div class="gh-frame-skills">${skills}</div>` : ''}
        </div>
      </div>`;
  }
  
  /* ════════════════════════════════════════════════
     ROW BUILDER — pairs left + right items
  ════════════════════════════════════════════════ */
  function buildGalleryRows(leftItems, rightItems, leftBuilder, rightBuilder) {
    const count = Math.max(leftItems.length, rightItems.length);
    let html = '';
    for (let i = 0; i < count; i++) {
      const L = leftItems[i]  ? `<div class="gh-wall-side left"><div>${leftBuilder(leftItems[i])}</div></div>`   : '<div class="gh-wall-side left gh-empty"></div>';
      const R = rightItems[i] ? `<div class="gh-wall-side right"><div>${rightBuilder(rightItems[i])}</div></div>` : '<div class="gh-wall-side right gh-empty"></div>';
      html += `<div class="gh-row">${L}<div class="gh-spacer"></div>${R}</div>`;
      if (i < count - 1) html += '<div class="gh-row-sep"></div>';
    }
    return html;
  }
  
  /* ════════════════════════════════════════════════
     BUILD GALLERY HALLWAY
  ════════════════════════════════════════════════ */
  function buildGalleryHallway(floorEl, tag, title, leftLabel, rightLabel, leftDot, rightDot, rowsHTML, footerText) {
    if (floorEl.querySelector('.gallery-hallway')) return; // already built
  
    const hall = document.createElement('div');
    hall.className = 'gallery-hallway';
    hall.innerHTML = `
      <div class="gh-ceiling"></div>
      <div class="gh-ceiling-glow"></div>
      <div class="gh-floor-ref"></div>
  
      <div class="gh-header">
        <div class="gh-floor-tag">${tag}</div>
        <div class="gh-floor-title">${title}</div>
        <div class="gh-wall-labels">
          <div class="gh-wall-lbl">
            <div class="gh-wall-dot" style="background:${leftDot};box-shadow:0 0 6px ${leftDot}66;"></div>
            ${leftLabel}
          </div>
          <div class="gh-wall-lbl right">
            ${rightLabel}
            <div class="gh-wall-dot" style="background:${rightDot};box-shadow:0 0 6px ${rightDot}66;"></div>
          </div>
        </div>
      </div>
  
      <div class="gh-body">
        <div class="gh-walkway"></div>
        ${rowsHTML}
      </div>
  
      <div class="gh-footer">
        <div class="gh-footer-line"></div>
        <span>${footerText}</span>
        <div class="gh-footer-line"></div>
      </div>
    `;
    floorEl.appendChild(hall);
  }
  
  /* ════════════════════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════════════════════ */
  function setupGalleryReveal(floorEl) {
    const rows = floorEl.querySelectorAll('.gh-row');
    const obs  = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const row = e.target;
        if (window.gsap) {
          const left  = row.querySelector('.gh-wall-side.left .gh-frame');
          const right = row.querySelector('.gh-wall-side.right .gh-frame');
          if (left)  gsap.fromTo(left,  { opacity:0, x:-50 }, { opacity:1, x:0, duration:.7, ease:'empireOut' });
          if (right) gsap.fromTo(right, { opacity:0, x:50  }, { opacity:1, x:0, duration:.7, ease:'empireOut', delay:.1 });
        } else {
          row.classList.add('gh-visible');
        }
        obs.unobserve(row);
      });
    }, { root: floorEl, threshold: 0.08 });
    rows.forEach(r => obs.observe(r));
  }
  
  /* ════════════════════════════════════════════════
     FLOOR 03 INIT
  ════════════════════════════════════════════════ */
  function initExperienceGallery() {
    const floor = document.getElementById('floor-experience');
    if (!floor) return;
    floor.scrollTop = 0;
  
    const rowsHTML = buildGalleryRows(
      EXP_WORK, EXP_VOL,
      buildWorkFrame, buildVolFrame
    );
  
    buildGalleryHallway(
      floor,
      '// Floor 03 — Experience',
      'Experience',
      'Work Experience',
      'Volunteering & Leadership',
      'var(--gold)',
      'var(--cyan)',
      rowsHTML,
      `${EXP_WORK.length} Work · ${EXP_VOL.length} Volunteering Roles`
    );
  
    setTimeout(() => setupGalleryReveal(floor), 150);
  }
  
  /* ════════════════════════════════════════════════
     FLOOR 04 INIT
  ════════════════════════════════════════════════ */
  function initAchievementsGallery() {
    const floor = document.getElementById('floor-achievements');
    if (!floor) return;
    floor.scrollTop = 0;
  
    const rowsHTML = buildGalleryRows(
      ACH_LIST, CERT_LIST,
      buildAchFrame, buildCertFrame
    );
  
    buildGalleryHallway(
      floor,
      '// Floor 04 — Achievements',
      'Achievements',
      'Achievements & Hackathons',
      'Certifications',
      'var(--gold)',
      'var(--accent)',
      rowsHTML,
      `${ACH_LIST.length} Achievements · ${CERT_LIST.length} Certifications`
    );
  
    setTimeout(() => setupGalleryReveal(floor), 150);
  }
  
  /* ── Override floor init functions ── */
  window.initExperienceFloor   = initExperienceGallery;
  window.initAchievementsFloor = initAchievementsGallery;
  window.initExperienceGallery = initExperienceGallery;
  window.initAchievementsGallery = initAchievementsGallery;