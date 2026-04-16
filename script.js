'use strict';

/*
next() {
    current_dir=$(basename "$PWD")
    if [[ $current_dir =~ ex([0-9]+) ]]; then
        num=${match[1]}
        next_num=$(printf "%02d" $((num + 1)))
        target="../ex$next_num"
        if [[ -d "$target" ]]; then
            cd "$target" || return
            echo "➡️  Moved to $(pwd)"
        else
            echo "❌ ex$next_num does not exist."
        fi
    else
        echo "❌ Not in an ex directory (ex00, ex01, etc.)"
    fi
}

prev() {
    current_dir=$(basename "$PWD")
    if [[ $current_dir =~ ex([0-9]+) ]]; then
        num=${match[1]}
        prev_num=$(printf "%02d" $((num - 1)))
        target="../ex$prev_num"
        if [[ -d "$target" ]]; then
            cd "$target" || return
            echo "⬅️  Moved to $(pwd)"
        else
            echo "❌ ex$prev_num does not exist."
        fi
    else
        echo "❌ Not in an ex directory (ex00, ex01, etc.)"
    fi
}
*/

/*
date | value
2009-01-02 | 1
2009-01-02 | 0
2009-01-02 | 1000
2009-01-02 | 999.999
2009-01-02 | 0.001
2011-01-03 | 5
2012-01-11 | 500
2024-12-31 | 100
2009-01-01 | 1
2008-12-31 | 1
2008-01-01 | 1
2007-06-15 | 1
2009-01-02 | -1
2009-01-02 | -0.001
2009-01-02 | -999
2009-01-02 | 1001
2009-01-02 | 1000.001
2009-01-02 | 2000
2009-01-02 | 999999
2009-01-02 | 2147483647
2011-02-29 | 1
2012-02-29 | 1
2020-02-29 | 1
2100-02-29 | 1
2000-02-29 | 1
2009-04-31 | 1
2009-06-31 | 1
2009-09-31 | 1
2009-11-31 | 1
2009-02-30 | 1
2009-00-01 | 1
2009-13-01 | 1
2009-01-00 | 1
2009-01-32 | 1
2009-12-32 | 1
2001-42-42 | 1
2009-15-99 | 1
2009/01/02 | 1
2009.01.02 | 1
20090102 | 1
09-01-02 | 1
2009-1-2 | 1
2009-01-2 | 1
2009-1-02 | 1
 2009-01-02 | 1
2009-01-02  | 1
 2009-01-02  | 1
2009-01-02|1
2009-01-02 |1
2009-01-02| 1
2009-01-02|   1
   2009-01-02   |   1   
2009-01-02 | abc
2009-01-02 | 12a
2009-01-02 | a12
2009-01-02 | 1.2.3
2009-01-02 | --1
2009-01-02 | ++1
2009-01-02 | +-1
2009-01-02 | -+1
2009-01-02 | .5
2009-01-02 | 5.
2009-01-02 | .
2009-01-02 | 
2009-01-02 |
2009-01-02
2009-01-02 1
2009-01-02 = 1
 | 1
| 1
2009-01-02 | | 1
 
    
        
2009-01-02 | 1 | extra
aa-bb-cc | 1
-2009-01-02 | 1
2009--01-02 | 1
2009-01--02 | 1
2009-01-02 | +1
2009-01-02 | +999
2009-01-02 | +1000
2009-01-02 | +1001
2009-01-02 | 1e10
2009-01-02 | 1.5e2
2009-01-02 | inf
2009-01-02 | nan
2009-01-02 | NaN
2009-01-02 | +inf
2009-01-02 | -inf
2023-06-15 | 250
2015-10-20 | 0.5
2018-03-25 | 750
2021-07-04 | 999.99
abcd | 1
1234 | 1
2009 | 1
| value
date | 
 |  
2009-01-02 | 0.000001
2009-01-02 | 0.0
2009-01-02 | 0.00
2009-01-02 | 00001
2009-01-02 | 001.500
2009-01-02 | 1.0000000000000000000000
2010-05-15 | 100.5
2017-09-30 | 0.999999
2022-11-11 | 555.555
*/


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
