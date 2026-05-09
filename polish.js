// ── LUMIO POLISH & FINISHING TOUCHES ─────────────────────────────────────────

// ── 1. CONFETTI ───────────────────────────────────────────────────────────────
window.launchConfetti = function(duration = 2500) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99998;width:100%;height:100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#2c1a0e','#8b6340','#b8956a','#d4b896','#3a6b3f','#c4862a','#faf7f2'];
  const pieces = Array.from({length: 120}, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    r: 4 + Math.random() * 6,
    d: 1 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.random() * 10 - 10,
    tiltAngle: Math.random() * Math.PI,
    tiltSpeed: 0.05 + Math.random() * 0.1,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));

  const end = Date.now() + duration;
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
        ctx.restore();
      }
      ctx.fill();
      p.y += p.d + 1.5;
      p.tiltAngle += p.tiltSpeed;
      p.x += Math.sin(p.tiltAngle) * 1.5;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
};

// ── 2. STREAK CELEBRATION ────────────────────────────────────────────────────
window.celebrateStreak = function(days) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);
    background:var(--brown);color:var(--cream);border-radius:20px;padding:32px 40px;
    text-align:center;z-index:99997;box-shadow:0 24px 64px rgba(0,0,0,0.3);
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  `;
  el.innerHTML = `
    <div style="font-size:48px;margin-bottom:12px">🔥</div>
    <div style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--cream);margin-bottom:6px">${days} day streak!</div>
    <div style="font-size:14px;color:var(--brown5);font-weight:300">You're on fire. Keep it up!</div>
    <button onclick="this.parentElement.remove()" style="margin-top:20px;padding:10px 24px;border-radius:9px;border:none;background:var(--cream);color:var(--brown);font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600;cursor:pointer">Thanks Leo!</button>
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => { requestAnimationFrame(() => { el.style.transform = 'translate(-50%,-50%) scale(1)'; }); });
  launchConfetti(3000);
  if (window.haptic) haptic('success');
};

// ── 3. CARD FLIP SOUND ────────────────────────────────────────────────────────
window.playFlipSound = function() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch(e) {}
};

window.playCorrectSound = function() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.15);
    });
  } catch(e) {}
};

window.playWrongSound = function() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
};

// ── 4. SCORE COUNT-UP ANIMATION ───────────────────────────────────────────────
window.animateScore = function(el, target, suffix = '%', duration = 1200) {
  let start = 0;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};

// ── 5. EMPTY STATE HELPER ─────────────────────────────────────────────────────
window.showEmptyState = function(container, icon, title, subtitle, btnText, btnUrl) {
  container.innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:48px;margin-bottom:14px">${icon}</div>
      <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--brown);margin-bottom:6px">${title}</div>
      <div style="font-size:13px;color:var(--brown4);font-weight:300;line-height:1.6;margin-bottom:20px;max-width:280px;margin-left:auto;margin-right:auto">${subtitle}</div>
      ${btnText ? `<a href="${btnUrl}" style="display:inline-flex;align-items:center;gap:6px;padding:10px 22px;border-radius:9px;background:var(--brown);color:var(--cream);font-family:'Source Sans 3',sans-serif;font-size:13px;font-weight:600;text-decoration:none">${btnText}</a>` : ''}
    </div>`;
};

// ── 6. RECENTLY VIEWED SETS ───────────────────────────────────────────────────
window.recordView = function(setId, title, subject) {
  let recent = JSON.parse(localStorage.getItem('lumio_recent') || '[]');
  recent = recent.filter(s => s.id !== setId);
  recent.unshift({id: setId, title, subject, ts: Date.now()});
  recent = recent.slice(0, 5);
  localStorage.setItem('lumio_recent', JSON.stringify(recent));
};

window.getRecentSets = function() {
  return JSON.parse(localStorage.getItem('lumio_recent') || '[]');
};

// ── 7. ESTIMATED STUDY TIME ───────────────────────────────────────────────────
window.estimateTime = function(cardCount, mode = 'flip') {
  const secPerCard = { flip: 8, mc: 12, type: 20, mixed: 15 };
  const secs = cardCount * (secPerCard[mode] || 10);
  if (secs < 60) return 'Under 1 min';
  const mins = Math.round(secs / 60);
  return `~${mins} min`;
};

// ── 8. BACK TO TOP ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '<i class="ti ti-arrow-up" style="font-size:16px"></i>';
  btn.style.cssText = `
    position:fixed;bottom:90px;right:20px;width:40px;height:40px;border-radius:50%;
    background:var(--brown);color:var(--cream);border:none;cursor:pointer;
    box-shadow:0 4px 14px rgba(44,26,14,0.25);opacity:0;transition:all 0.3s;
    display:flex;align-items:center;justify-content:center;z-index:50;
  `;
  btn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 300 ? 'all' : 'none';
  });
});

// ── 9. COPY LINK BUTTON ───────────────────────────────────────────────────────
window.copySetLink = function() {
  navigator.clipboard.writeText(window.location.href);
  if (window.showToast) showToast('Link copied to clipboard!');
  if (window.haptic) haptic('light');
};

// ── 10. KEYBOARD NAV IN STUDY MODE ───────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  const page = window.location.pathname.split('/').pop();
  if (!page.includes('study')) return;

  if (e.key === ' ' || e.key === 'ArrowUp') {
    e.preventDefault();
    const card = document.getElementById('flashcard');
    if (card) card.click();
  }
  if (e.key === 'ArrowRight' || e.key === 'l') {
    const correctBtn = document.querySelector('.fc-btn.correct');
    if (correctBtn) correctBtn.click();
  }
  if (e.key === 'ArrowLeft' || e.key === 'h') {
    const wrongBtn = document.querySelector('.fc-btn.wrong');
    if (wrongBtn) wrongBtn.click();
  }
  if (e.key === 'ArrowDown') {
    const skipBtn = document.querySelector('.fc-btn.skip');
    if (skipBtn) skipBtn.click();
  }
});

// ── 11. LEO TYPING INDICATOR ─────────────────────────────────────────────────
window.leoTyping = function(container) {
  const id = 'leo-typing-' + Date.now();
  container.innerHTML += `
    <div class="lcp-msg leo" id="${id}" style="display:flex;gap:4px;align-items:center;padding:10px 14px">
      <span style="width:7px;height:7px;border-radius:50%;background:var(--brown4);animation:leoType 1s infinite 0s;display:inline-block"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:var(--brown4);animation:leoType 1s infinite 0.2s;display:inline-block"></span>
      <span style="width:7px;height:7px;border-radius:50%;background:var(--brown4);animation:leoType 1s infinite 0.4s;display:inline-block"></span>
    </div>`;
  container.scrollTop = container.scrollHeight;
  return id;
};

// Add Leo typing keyframe
const leoStyle = document.createElement('style');
leoStyle.textContent = '@keyframes leoType{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-4px);opacity:1}}';
document.head.appendChild(leoStyle);

// ── 12. LEO MOOD ─────────────────────────────────────────────────────────────
window.updateLeoMood = function(score) {
  const leoAv = document.querySelector('.leo-av, .lkav, .lcp-av');
  if (!leoAv) return;
  if (score >= 80) {
    leoAv.style.background = '#3a6b3f'; // green — happy
    leoAv.title = 'Leo is happy with your progress!';
  } else if (score >= 60) {
    leoAv.style.background = '#8b6340'; // normal
    leoAv.title = 'Leo is watching your session';
  } else {
    leoAv.style.background = '#a0522d'; // concerned
    leoAv.title = 'Leo thinks you might need some help';
  }
};

// ── 13. SOUNDS TOGGLE ─────────────────────────────────────────────────────────
window.soundsEnabled = () => localStorage.getItem('lumio_sounds') !== 'off';
window.toggleSounds = () => {
  const on = window.soundsEnabled();
  localStorage.setItem('lumio_sounds', on ? 'off' : 'on');
  if (window.showToast) showToast(on ? 'Sounds off' : 'Sounds on');
};

