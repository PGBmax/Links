'use strict';

/* ══════════════════════════════════════
   STARFIELD
══════════════════════════════════════ */
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], shooters = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars();
}

function buildStars() {
  stars = [];
  const n = Math.round(W * H / 2600);
  for (let i = 0; i < n; i++) {
    stars.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.4 + 0.2,
      a:  Math.random(),
      da: (Math.random() - 0.5) * 0.018,
    });
  }
}

function spawnShooter() {
  const angle = (Math.random() * 25 + 10) * Math.PI / 180;
  shooters.push({
    x:     Math.random() * W * 0.75,
    y:     Math.random() * H * 0.4,
    vx:    Math.cos(angle) * (Math.random() * 8 + 8),
    vy:    Math.sin(angle) * (Math.random() * 8 + 8),
    len:   Math.random() * 120 + 80,
    alpha: 1,
  });
}

function drawFrame() {
  ctx.clearRect(0, 0, W, H);

  /* stars */
  for (const s of stars) {
    s.a += s.da;
    if (s.a <= 0.08 || s.a >= 1) s.da *= -1;
    s.a = Math.max(0.08, Math.min(1, s.a));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,210,255,${s.a})`;
    ctx.fill();
  }

  /* shooting stars */
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s     = shooters[i];
    s.x        += s.vx;
    s.y        += s.vy;
    s.alpha    -= 0.014;
    if (s.alpha <= 0 || s.x > W + 80 || s.y > H + 80) { shooters.splice(i, 1); continue; }

    const speed = Math.hypot(s.vx, s.vy);
    const tailX = s.x - (s.vx / speed) * s.len;
    const tailY = s.y - (s.vy / speed) * s.len;

    const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
    grad.addColorStop(0, `rgba(190,160,255,0)`);
    grad.addColorStop(1, `rgba(230,210,255,${s.alpha})`);

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,230,255,${s.alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener('resize', resize);
resize();
drawFrame();

/* ══════════════════════════════════════
   FLOATING PARTICLES
══════════════════════════════════════ */
const pColors = [
  'rgba(139,92,246,',
  'rgba(99,102,241,',
  'rgba(59,130,246,',
  'rgba(167,139,250,',
  'rgba(96,165,250,',
];

for (let i = 0; i < 28; i++) {
  const sz    = (Math.random() * 2.8 + 0.8).toFixed(1);
  const c     = pColors[i % pColors.length];
  const op    = (Math.random() * 0.4 + 0.2).toFixed(2);
  const dur   = (Math.random() * 18 + 10).toFixed(1);
  const delay = (Math.random() * 7).toFixed(1);
  const dx1   = (Math.random() * 80 - 40).toFixed(0);
  const dy1   = (Math.random() * 80 - 40).toFixed(0);
  const dx2   = (Math.random() * 100 - 50).toFixed(0);
  const dy2   = (Math.random() * 100 - 50).toFixed(0);
  const name  = `pf${i}`;

  const ks = document.createElement('style');
  ks.textContent = `@keyframes ${name}{0%{transform:translate(0,0);opacity:${op}}50%{transform:translate(${dx1}px,${dy1}px);opacity:${Math.min(1, +op + 0.2).toFixed(2)}}100%{transform:translate(${dx2}px,${dy2}px);opacity:${Math.max(0, +op - 0.1).toFixed(2)}}}`;
  document.head.appendChild(ks);

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    `width:${sz}px`, `height:${sz}px`,
    'border-radius:50%',
    `left:${(Math.random()*100).toFixed(1)}vw`,
    `top:${(Math.random()*100).toFixed(1)}vh`,
    `background:${c}${op})`,
    `box-shadow:0 0 ${+sz * 2}px ${c}0.45)`,
    'z-index:2', 'pointer-events:none',
    `animation:${name} ${dur}s ease-in-out ${delay}s infinite alternate`,
  ].join(';');
  document.body.appendChild(el);
}

/* ══════════════════════════════════════
   CUSTOM CURSOR
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
  tx += (mx - tx) * 0.11;
  ty += (my - ty) * 0.11;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

document.querySelectorAll('a').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorEl.style.width  = '24px';
    cursorEl.style.height = '24px';
    cursorEl.style.background = 'rgba(167,139,250,.95)';
  });
  el.addEventListener('mouseleave', () => {
    cursorEl.style.width  = '14px';
    cursorEl.style.height = '14px';
    cursorEl.style.background = 'rgba(149,100,255,.9)';
  });
});

/* ══════════════════════════════════════
   RIPPLE
══════════════════════════════════════ */
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
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
   TYPING BIO
══════════════════════════════════════ */
const bioEl   = document.getElementById('bio');
const bioText = "Étudiant à l'École 42 · 19 ans · Dev en devenir 🚀";
let idx = 0;

function typeNext() {
  if (idx < bioText.length) {
    bioEl.textContent = bioText.slice(0, idx + 1);
    idx++;
    setTimeout(typeNext, idx === 1 ? 600 : Math.random() * 55 + 35);
  }
}

setTimeout(typeNext, 1400);
