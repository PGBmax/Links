'use strict';

/* ══════════════════════════════════════
   WARM EMBERS — subtle floating particles
══════════════════════════════════════ */
const emberColors = [
  'rgba(240,168,48,',
  'rgba(255,140,0,',
  'rgba(255,200,100,',
  'rgba(200,120,20,',
  'rgba(255,180,60,',
];

for (let i = 0; i < 14; i++) {
  const sz    = (Math.random() * 2 + 0.4).toFixed(1);
  const c     = emberColors[i % emberColors.length];
  const op    = (Math.random() * 0.2 + 0.05).toFixed(2);
  const dur   = (Math.random() * 25 + 15).toFixed(1);
  const delay = (Math.random() * 10).toFixed(1);
  const dx1   = (Math.random() * 50 - 25).toFixed(0);
  const dy1   = (Math.random() * 50 - 25).toFixed(0);
  const dx2   = (Math.random() * 60 - 30).toFixed(0);
  const dy2   = (Math.random() * 60 - 30).toFixed(0);
  const name  = `ember${i}`;

  const ks = document.createElement('style');
  ks.textContent = `@keyframes ${name}{
    0%{transform:translate(0,0);opacity:${op}}
    50%{transform:translate(${dx1}px,${dy1}px);opacity:${Math.min(1, +op + 0.1).toFixed(2)}}
    100%{transform:translate(${dx2}px,${dy2}px);opacity:${Math.max(0, +op - 0.03).toFixed(2)}}
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
    `box-shadow:0 0 ${+sz * 2}px ${c}0.15)`,
    'z-index:1', 'pointer-events:none',
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
   TYPING BIO
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
    setTimeout(() => bioEl.classList.remove('typing'), 800);
  }
}

setTimeout(typeNext, 1000);

/* ═══════════════  CUB3D WASM OVERLAY  ═══════════════ */
let cub3dLoaded = false;

function openCub3D() {
  const overlay = document.getElementById('cub3d-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  if (!cub3dLoaded) {
    const loading = document.getElementById('cub3d-loading');
    loading.style.display = 'flex';

    window.Module = {
      canvas: document.getElementById('canvas'),
      noExitRuntime: true,
      onRuntimeInitialized: function() {
        cub3dLoaded = true;
      },
      onAbort: function(what) {
        var el = document.getElementById('cub3d-loading');
        if (el) el.innerHTML = '<span style="color:#ff6060;font-size:1rem">Abort: ' + what + '</span>';
      },
      print: function(text) { console.log('[cub3D]', text); },
      printErr: function(text) {
        console.warn('[cub3D]', text);
        var el = document.getElementById('cub3d-loading');
        if (el && el.style.display !== 'none' && /error|abort|exception/i.test(text)) {
          el.innerHTML = '<span style="color:#ff6060;font-size:1rem">' + text + '</span>';
        }
      }
    };

    const script = document.createElement('script');
    script.src = 'cub3d.js';
    script.async = true;
    script.onerror = function() {
      loading.innerHTML = '<span style="color:var(--flare)">Erreur de chargement du module WASM</span>';
    };
    document.body.appendChild(script);
  }
}

function closeCub3D() {
  document.getElementById('cub3d-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('cub3d-overlay').style.display === 'flex') {
    closeCub3D();
  }
});
