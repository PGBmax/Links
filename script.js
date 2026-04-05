'use strict';

/* ══════════════════════════════════════
   STARFIELD — warm-tinted stars
══════════════════════════════════════ */
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], shooters = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars();
}

/* Star colors: warm whites, gold hints, pale orange */
const starColors = [
  [255, 240, 220],
  [255, 230, 200],
  [255, 220, 180],
  [255, 210, 160],
  [255, 245, 235],
  [255, 200, 140],
];

function buildStars() {
  stars = [];
  const n = Math.round(W * H / 3000);
  for (let i = 0; i < n; i++) {
    const c = starColors[Math.floor(Math.random() * starColors.length)];
    stars.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.3 + 0.15,
      a:  Math.random(),
      da: (Math.random() - 0.5) * 0.015,
      c,
    });
  }
}

function spawnShooter() {
  const angle = (Math.random() * 30 + 8) * Math.PI / 180;
  const fromRight = Math.random() > 0.5;
  shooters.push({
    x:     fromRight ? W * (0.3 + Math.random() * 0.7) : Math.random() * W * 0.7,
    y:     Math.random() * H * 0.45,
    vx:    (fromRight ? -1 : 1) * Math.cos(angle) * (Math.random() * 7 + 7),
    vy:    Math.sin(angle) * (Math.random() * 7 + 7),
    len:   Math.random() * 100 + 70,
    alpha: 1,
  });
}

function drawFrame() {
  ctx.clearRect(0, 0, W, H);

  /* stars */
  for (const s of stars) {
    s.a += s.da;
    if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
    s.a = Math.max(0.05, Math.min(1, s.a));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${s.a})`;
    ctx.fill();
  }

  /* shooting stars — golden streaks */
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s  = shooters[i];
    s.x     += s.vx;
    s.y     += s.vy;
    s.alpha -= 0.012;
    if (s.alpha <= 0 || s.x < -80 || s.x > W + 80 || s.y > H + 80) {
      shooters.splice(i, 1); continue;
    }

    const speed = Math.hypot(s.vx, s.vy);
    const tailX = s.x - (s.vx / speed) * s.len;
    const tailY = s.y - (s.vy / speed) * s.len;

    const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
    grad.addColorStop(0, `rgba(255,200,100,0)`);
    grad.addColorStop(0.6, `rgba(255,180,60,${s.alpha * 0.4})`);
    grad.addColorStop(1, `rgba(255,220,140,${s.alpha})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.6;
    ctx.stroke();

    /* bright head */
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,230,160,${s.alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener('resize', resize);
resize();
drawFrame();

/* Spawn shooting stars every 3-7s */
setInterval(() => {
  if (Math.random() > 0.3) spawnShooter();
}, 3500);
setTimeout(spawnShooter, 2000);

/* ══════════════════════════════════════
   SOLAR EMBERS — floating warm particles
══════════════════════════════════════ */
const emberColors = [
  'rgba(240,168,48,',
  'rgba(255,140,0,',
  'rgba(255,200,100,',
  'rgba(200,120,20,',
  'rgba(255,180,60,',
  'rgba(180,100,30,',
];

for (let i = 0; i < 22; i++) {
  const sz    = (Math.random() * 2.5 + 0.6).toFixed(1);
  const c     = emberColors[i % emberColors.length];
  const op    = (Math.random() * 0.3 + 0.1).toFixed(2);
  const dur   = (Math.random() * 20 + 12).toFixed(1);
  const delay = (Math.random() * 8).toFixed(1);
  const dx1   = (Math.random() * 70 - 35).toFixed(0);
  const dy1   = (Math.random() * 70 - 35).toFixed(0);
  const dx2   = (Math.random() * 90 - 45).toFixed(0);
  const dy2   = (Math.random() * 90 - 45).toFixed(0);
  const name  = `ember${i}`;

  const ks = document.createElement('style');
  ks.textContent = `@keyframes ${name}{
    0%{transform:translate(0,0);opacity:${op}}
    50%{transform:translate(${dx1}px,${dy1}px);opacity:${Math.min(1, +op + 0.15).toFixed(2)}}
    100%{transform:translate(${dx2}px,${dy2}px);opacity:${Math.max(0, +op - 0.05).toFixed(2)}}
  }`;
  document.head.appendChild(ks);

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    `width:${sz}px`, `height:${sz}px`,
    'border-radius:50%',
    `left:${(Math.random() * 100).toFixed(1)}vw`,
    `top:${(Math.random() * 100).toFixed(1)}vh`,
    `background:${c}${op})`,
    `box-shadow:0 0 ${+sz * 3}px ${c}0.3)`,
    'z-index:2', 'pointer-events:none',
    `animation:${name} ${dur}s ease-in-out ${delay}s infinite alternate`,
  ].join(';');
  document.body.appendChild(el);
}

/* ══════════════════════════════════════
   CUSTOM CURSOR — golden sun cursor
══════════════════════════════════════ */
const cursorEl    = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = -200, my = -200, tx = -200, ty = -200;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorEl.style.left = mx + 'px';
  cursorEl.style.top  = my + 'px';
});

(function animTrail() {
  tx += (mx - tx) * 0.1;
  ty += (my - ty) * 0.1;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

/* Expand cursor on interactive elements */
document.querySelectorAll('a, .link-card, button, .code-toggle').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorEl.style.width  = '22px';
    cursorEl.style.height = '22px';
    cursorEl.style.background = '#ffd080';
    cursorEl.style.boxShadow = '0 0 20px 6px rgba(255,200,100,.5), 0 0 50px 10px rgba(255,140,0,.2)';
    cursorTrail.style.borderColor = 'rgba(240,168,48,.35)';
  });
  el.addEventListener('mouseleave', () => {
    cursorEl.style.width  = '12px';
    cursorEl.style.height = '12px';
    cursorEl.style.background = '#f0a830';
    cursorEl.style.boxShadow = '0 0 16px 5px rgba(240,168,48,.5), 0 0 40px 8px rgba(255,140,0,.2)';
    cursorTrail.style.borderColor = 'rgba(240,168,48,.2)';
  });
});

/* ══════════════════════════════════════
   RIPPLE — warm golden ripple
══════════════════════════════════════ */
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 750);
  });
});

/* ══════════════════════════════════════
   CODE PREVIEW TOGGLE
══════════════════════════════════════ */
function toggleCode(e, btn) {
  e.preventDefault();
  e.stopPropagation();
  const preview = btn.closest('.project-card').querySelector('.code-preview');
  const isOpen  = preview.classList.toggle('open');
  btn.classList.toggle('active', isOpen);
  btn.textContent = isOpen ? '✕' : '{ }';
}

/* ══════════════════════════════════════
   TYPING BIO — warm emoji
══════════════════════════════════════ */
const bioEl   = document.getElementById('bio');
const bioText = "Étudiant à l'École 42 · 19 ans · Dev en devenir ☀️";
let idx = 0;

function typeNext() {
  if (idx < bioText.length) {
    bioEl.textContent = bioText.slice(0, idx + 1);
    idx++;
    setTimeout(typeNext, idx === 1 ? 600 : Math.random() * 50 + 30);
  } else {
    /* Remove typing cursor after done */
    setTimeout(() => bioEl.classList.remove('typing'), 800);
  }
}

setTimeout(typeNext, 1200);

/* ══════════════════════════════════════
   PARALLAX SUN on scroll
══════════════════════════════════════ */
const sunEl = document.getElementById('sun');
if (sunEl) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sunEl.style.transform = `translateX(-50%) translateY(${scrollY * 0.15}px) scale(${0.92 + Math.sin(Date.now() / 3000) * 0.08})`;
  }, { passive: true });
}
