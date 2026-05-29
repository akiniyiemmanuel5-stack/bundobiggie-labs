/* ═══════════════════════════════════════════════════════════
   AKINIYI EMMANUEL — CYBERPUNK PORTFOLIO
   script.js
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── CUSTOM CURSOR ─── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .goal-card, .contact-link, .edu-extra-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* ─── NAVBAR SCROLL & HAMBURGER ─── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sections = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── HERO CANVAS PARTICLE SYSTEM ─── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Particles */
const PARTICLE_COUNT = 120;
const particles = [];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.6 + 0.2);
    this.radius = Math.random() * 1.8 + 0.4;
    this.alpha  = Math.random() * 0.6 + 0.1;
    this.color  = Math.random() < 0.6
      ? `rgba(0,245,255,${this.alpha})`
      : Math.random() < 0.5
        ? `rgba(168,255,62,${this.alpha})`
        : `rgba(255,45,120,${this.alpha})`;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    /* glow */
    ctx.shadowBlur  = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur  = 0;
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

/* Neural network lines between close particles */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

/* Floating hex shapes */
const hexes = Array.from({ length: 8 }, () => ({
  x: Math.random() * 1000,
  y: Math.random() * 800,
  size: Math.random() * 40 + 15,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.2,
  alpha: Math.random() * 0.08 + 0.02,
  rot: Math.random() * Math.PI,
  rotV: (Math.random() - 0.5) * 0.005
}));

function drawHex(hx, hy, size, rot, alpha) {
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const px = size * Math.cos(angle);
    const py = size * Math.sin(angle);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
  ctx.lineWidth   = 1;
  ctx.stroke();
  ctx.restore();
}

/* Scanlines effect on canvas */
function drawScanlines() {
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, y, canvas.width, 1);
  }
}

/* Mouse repulse */
let mx = -9999, my = -9999;
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;
});

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Radial gradient bg */
  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.7
  );
  grad.addColorStop(0,   'rgba(0,20,40,0.5)');
  grad.addColorStop(0.6, 'rgba(3,5,9,0.8)');
  grad.addColorStop(1,   'rgba(3,5,9,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* Hex shapes */
  hexes.forEach(h => {
    h.x   += h.vx;
    h.y   += h.vy;
    h.rot += h.rotV;
    if (h.x < -60) h.x = canvas.width + 60;
    if (h.x > canvas.width + 60) h.x = -60;
    if (h.y < -60) h.y = canvas.height + 60;
    if (h.y > canvas.height + 60) h.y = -60;
    drawHex(h.x, h.y, h.size, h.rot, h.alpha);
  });

  /* Connections + particles */
  drawConnections();
  particles.forEach(p => {
    /* mouse repulse */
    const dx = p.x - mx, dy = p.y - my;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 80) {
      p.vx += (dx / d) * 0.5;
      p.vy += (dy / d) * 0.5;
    }
    p.update();
    p.draw();
  });

  drawScanlines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ─── TYPING EFFECT ─── */
const phrases = [
  'Computer Science Student',
  'Cybersecurity Learner',
  'AI Prompt Engineer',
  'Web3 Enthusiast',
  'Ethical Hacking Explorer',
  'Python Developer',
  'Future Tech Builder'
];

const typingEl = document.getElementById('typingText');
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  typingEl.textContent = deleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);

  if (!deleting && charIdx > current.length) {
    deleting = true;
    setTimeout(typeEffect, 1800);
    return;
  }
  if (deleting && charIdx < 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typeEffect, 300);
    return;
  }

  setTimeout(typeEffect, deleting ? 45 : 80);
}
typeEffect();

/* ─── STAT COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.val);
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (el.dataset.suffix || '+');
      if (current >= target) clearInterval(timer);
    }, 50);
  });
}

/* ─── SKILL BAR ANIMATION ─── */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.dataset.width;
    bar.style.width = width + '%';
  });
}

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .project-card, .goal-card, .edu-extra-card, .about-card, .edu-main, .contact-link, .contact-form, .contact-intro').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  revealObserver.observe(el);
});

/* ─── SECTION ENTRY OBSERVER (skills & stats) ─── */
let statsAnimated = false;
let skillsAnimated = false;

const sectionTrigger = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;

    if (id === 'hero' && !statsAnimated) {
      statsAnimated = true;
      animateCounters();
    }
    if (id === 'skills' && !skillsAnimated) {
      skillsAnimated = true;
      animateSkillBars();
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('#hero, #skills').forEach(s => sectionTrigger.observe(s));

/* ─── GLITCH OVERLAY RANDOM FLICKER ─── */
const glitchOverlay = document.getElementById('glitchOverlay');
function randomGlitch() {
  const delay    = Math.random() * 8000 + 2000;
  const duration = Math.random() * 150 + 50;
  setTimeout(() => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
      randomGlitch();
    }, duration);
  }, delay);
}
randomGlitch();

/* ─── SKILL CARD 3D TILT ─── */
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `
      perspective(600px)
      rotateX(${-y * 10}deg)
      rotateY(${x * 10}deg)
      translateY(-6px)
      scale(1.02)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
});

/* ─── HERO SECTION 3D PARALLAX ─── */
const heroContent = document.querySelector('.hero-content');
const heroSection = document.getElementById('hero');

heroSection.addEventListener('mousemove', e => {
  const rect = heroSection.getBoundingClientRect();
  const x    = (e.clientX - rect.width  / 2) / rect.width;
  const y    = (e.clientY - rect.height / 2) / rect.height;

  if (heroContent) {
    heroContent.style.transform = `
      perspective(1000px)
      rotateX(${-y * 4}deg)
      rotateY(${x * 4}deg)
      translateZ(10px)
    `;
  }
});

heroSection.addEventListener('mouseleave', () => {
  if (heroContent) {
    heroContent.style.transform = '';
    heroContent.style.transition = 'transform 0.8s ease';
  }
});

/* ─── CONTACT FORM HANDLER ─── */
function handleFormSubmit() {
  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const message = document.getElementById('formMessage').value.trim();
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('sendBtn');

  if (!name || !email || !message) {
    shakeElement(btn);
    return;
  }

  /* Simulate send */
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> SENT!';
    btn.style.background = 'linear-gradient(135deg,#27c93f,#1a8a2a)';
    success.classList.add('show');

    /* Build mailto fallback */
    const mailtoLink = `mailto:akiniyiemmanuel5@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;

    /* Reset after delay */
    setTimeout(() => {
      btn.innerHTML = '<span class="send-glow"></span><i class="fas fa-paper-plane"></i> TRANSMIT MESSAGE';
      btn.style.background = '';
      btn.style.opacity    = '1';
      btn.disabled         = false;
      success.classList.remove('show');
      document.getElementById('formName').value    = '';
      document.getElementById('formEmail').value   = '';
      document.getElementById('formSubject').value = '';
      document.getElementById('formMessage').value = '';
    }, 4000);
  }, 1800);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.style.transform = 'translateX(-6px)';
  setTimeout(() => el.style.transform = 'translateX(6px)',  80);
  setTimeout(() => el.style.transform = 'translateX(-4px)', 160);
  setTimeout(() => el.style.transform = 'translateX(4px)',  240);
  setTimeout(() => el.style.transform = '',                  320);
}

/* ─── PAGE TRANSITION EFFECT (nav clicks) ─── */
const transition = document.getElementById('pageTransition');

document.querySelectorAll('.nav-link, .btn').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('https://wa')) return;

    transition.classList.add('active');
    setTimeout(() => transition.classList.remove('active'), 600);
  });
});

/* ─── HERO BUTTON RIPPLE ─── */
document.querySelectorAll('.btn, .btn-send, .btn-project').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:10px;height:10px;
      background:rgba(255,255,255,0.3);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.5s ease-out forwards;
      left:${e.offsetX - 5}px;
      top:${e.offsetY - 5}px;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

/* Inject ripple keyframe */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(20); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ─── GOAL TIMELINE LINE ANIMATION ─── */
const goalsSection = document.getElementById('goals');
let goalsAnimated  = false;

const goalsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !goalsAnimated) {
    goalsAnimated = true;
    document.querySelectorAll('.node-dot').forEach((dot, i) => {
      setTimeout(() => {
        dot.style.transform = 'scale(1.2)';
        dot.style.boxShadow = '0 0 30px rgba(0,245,255,0.7)';
        setTimeout(() => {
          dot.style.transform = '';
          dot.style.boxShadow = '';
        }, 400);
      }, i * 250);
    });
  }
}, { threshold: 0.3 });

goalsObserver.observe(goalsSection);

/* ─── TERMINAL LINE TYPEWRITER ─── */
const termLines = document.querySelectorAll('.term-output');
termLines.forEach((line, i) => {
  const text = line.textContent;
  line.textContent = '';
  line.style.opacity = '0';
  setTimeout(() => {
    line.style.opacity = '1';
    let c = 0;
    const t = setInterval(() => {
      line.textContent = text.substring(0, c++);
      if (c > text.length) clearInterval(t);
    }, 28);
  }, 1200 + i * 350);
});

/* ─── DATA POINTS ORBIT ANIMATION (CSS Handles rotation,
       but we pulse them on hover of avatar) ─── */
const avatarFrame = document.querySelector('.avatar-frame');
if (avatarFrame) {
  avatarFrame.addEventListener('mouseenter', () => {
    document.querySelectorAll('.data-point span').forEach((el, i) => {
      setTimeout(() => {
        el.style.transform = 'translateX(-50%) rotate(calc(-1 * var(--angle))) scale(1.2)';
        el.style.background = 'rgba(0,245,255,0.2)';
        el.style.borderColor = 'var(--cyan)';
        el.style.color = '#fff';
      }, i * 60);
    });
  });
  avatarFrame.addEventListener('mouseleave', () => {
    document.querySelectorAll('.data-point span').forEach(el => {
      el.style.transform = '';
      el.style.background = '';
      el.style.borderColor = '';
      el.style.color = '';
    });
  });
}

/* ─── BACKGROUND FLOATING ORBS (extra pages) ─── */
function createFloatingOrbs(section) {
  const orbs = [
    { x: '10%',  y: '20%', size: 200, color: 'rgba(0,245,255,0.03)' },
    { x: '80%',  y: '60%', size: 300, color: 'rgba(168,255,62,0.025)' },
    { x: '50%',  y: '85%', size: 180, color: 'rgba(255,45,120,0.025)' }
  ];

  orbs.forEach(orb => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${orb.x};top:${orb.y};
      width:${orb.size}px;height:${orb.size}px;
      background:radial-gradient(circle,${orb.color},transparent 70%);
      border-radius:50%;
      pointer-events:none;
      z-index:0;
      animation: orbFloat ${6 + Math.random()*4}s ease-in-out infinite alternate;
    `;
    section.appendChild(el);
  });
}

const orbStyle = document.createElement('style');
orbStyle.textContent = `
  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(20px,-20px) scale(1.1); }
  }
`;
document.head.appendChild(orbStyle);

document.querySelectorAll('.page:not(#hero)').forEach(s => createFloatingOrbs(s));

/* ─── NAVBAR LOGO GLITCH ─── */
const navLogo = document.querySelector('.nav-logo');
setInterval(() => {
  if (Math.random() < 0.1) {
    navLogo.style.textShadow = `
      2px 0 0 rgba(255,45,120,0.7),
      -2px 0 0 rgba(0,245,255,0.7)
    `;
    setTimeout(() => navLogo.style.textShadow = '', 100);
  }
}, 3000);

/* ─── FORM INPUT FOCUS EFFECTS ─── */
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.querySelector('.form-label').style.color = 'var(--cyan)';
  });
  input.addEventListener('blur', function() {
    this.parentElement.querySelector('.form-label').style.color = '';
  });
});

/* ─── CONSOLE EASTER EGG ─── */
console.log('%c AKINIYI EMMANUEL ', 'background:#00f5ff;color:#030509;font-size:18px;font-weight:bold;padding:6px 14px;border-radius:4px;');
console.log('%c Cybersecurity • AI • Web3 • Nigeria 🇳🇬', 'color:#a8ff3e;font-size:12px;');
console.log('%c https://github.com/akiniyiemmanuel5-stack', 'color:#7a9ab8;font-size:11px;');

/* ─── INIT ─── */
window.addEventListener('load', () => {
  /* Trigger stat counters on initial visible hero */
  if (document.getElementById('hero').getBoundingClientRect().top < window.innerHeight) {
    if (!statsAnimated) { statsAnimated = true; animateCounters(); }
  }
  /* Small flash on load */
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity    = '1';
  }, 100);
});