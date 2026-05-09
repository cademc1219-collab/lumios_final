// ── LUMIO PAGE TRANSITIONS & ANIMATIONS ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── PAGE ENTRANCE ──────────────────────────────────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(8px)';
  document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    });
  });

  // ── LINK TRANSITIONS ───────────────────────────────────────────────────────
  document.querySelectorAll('a[href], button[onclick*="location"]').forEach(el => {
    el.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto')) return;
      if (this.getAttribute('target') === '_blank') return;
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(-6px)';
      setTimeout(() => window.location.href = href, 280);
    });
  });

  // ── CARD HOVER ANIMATIONS ──────────────────────────────────────────────────
  document.querySelectorAll('.set-item, .mode-card, .kids-set-card, .classroom-card, .set-card-m, .kset').forEach(card => {
    card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 8px 24px rgba(44,26,14,0.12)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });

  // ── BUTTON PRESS ANIMATIONS ────────────────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-study, .btn-ghost, .btn-out, .pkey, .fc-btn, .post-btn, .leo-k-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── STAT COUNTER ANIMATION ─────────────────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.textContent.replace(/[0-9.]/g, '').replace(/^\d/, '');
    const prefix = el.textContent.match(/^[^0-9]*/)?.[0] || '';
    if (isNaN(target) || target === 0) return;
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Animate counters when they come into view
  const counterEls = document.querySelectorAll('.sc-val, .stat-s-val, .ps-val, .sd-stat-val, .se-stat-val, .rating-big');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => observer.observe(el));
  }

  // ── FADE IN ON SCROLL ──────────────────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.cbox, .stat-card, .set-item, .classroom-card, .assignment-item, .review-item, .flag-item, .activity-item');
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 40);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    fadeEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ── PROGRESS BAR ANIMATIONS ────────────────────────────────────────────────
  document.querySelectorAll('.progress-bar-inner, .kc-fill, .kr-fill, .cc-fill, .prog-fill, .rb-f, .vc-bar-fill, .credits-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    bar.style.transition = 'width 0s';
    setTimeout(() => {
      bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = targetWidth;
    }, 300);
  });

  // ── BOTTOM NAV ACTIVE STATE ────────────────────────────────────────────────
  document.querySelectorAll('.bottom-nav .bn-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.bottom-nav .bn-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ── FLASHCARD FLIP SOUND FEEL ──────────────────────────────────────────────
  const flashcard = document.getElementById('flashcard');
  if (flashcard) {
    flashcard.addEventListener('click', () => {
      flashcard.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }

  // ── TOAST NOTIFICATION SYSTEM ─────────────────────────────────────────────
  window.showToast = function(message, type = 'success') {
    const existing = document.querySelector('.lumio-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'lumio-toast';
    const colors = { success: '#3a6b3f', error: '#c0392b', info: '#5c3d1e' };
    toast.style.cssText = `
      position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-80px);
      background:${colors[type]||colors.success};color:#faf7f2;
      padding:12px 20px;border-radius:10px;font-family:'Source Sans 3',sans-serif;
      font-size:14px;font-weight:500;z-index:9999;
      box-shadow:0 6px 20px rgba(0,0,0,0.2);
      transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      white-space:nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-80px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  // ── RIPPLE EFFECT ON BUTTONS ───────────────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-study, .pkey, .mc-opt').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        background:rgba(255,255,255,0.2);border-radius:50%;
        transform:scale(0);animation:ripple 0.5s linear;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

});

// Ripple keyframe
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
document.head.appendChild(style);

// ── HAPTIC FEEDBACK ──────────────────────────────────────────────────────────
function haptic(type = 'light') {
  if (!navigator.vibrate) return;
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [50, 30, 50],
    warning: [30, 20, 30],
    double: [10, 40, 10],
  };
  navigator.vibrate(patterns[type] || patterns.light);
}

document.addEventListener('DOMContentLoaded', () => {

  // Bottom nav taps — light
  document.querySelectorAll('.bottom-nav .bn-item, .bottom-nav .bn-create').forEach(btn => {
    btn.addEventListener('click', () => haptic('light'));
  });

  // Primary buttons — medium
  document.querySelectorAll('.btn-primary, .btn-study, .btn-out, .btn-ghost, .post-btn, .login-btn, .start-btn, .big-study').forEach(btn => {
    btn.addEventListener('click', () => haptic('medium'));
  });

  // PIN keypad — light tap feel
  document.querySelectorAll('.pkey').forEach(btn => {
    btn.addEventListener('click', () => haptic('light'));
  });

  // Flashcard flip — medium
  const flashcard = document.getElementById('flashcard');
  if (flashcard) flashcard.addEventListener('click', () => haptic('medium'));

  // Multiple choice correct — success, wrong — error
  document.addEventListener('click', e => {
    const opt = e.target.closest('.mc-opt');
    if (!opt) return;
    setTimeout(() => {
      if (opt.classList.contains('correct')) haptic('success');
      else if (opt.classList.contains('wrong')) haptic('error');
    }, 100);
  });

  // Mark correct in flashcard — success
  document.querySelectorAll('.fc-btn.correct').forEach(btn => {
    btn.addEventListener('click', () => haptic('success'));
  });

  // Mark wrong in flashcard — error
  document.querySelectorAll('.fc-btn.wrong').forEach(btn => {
    btn.addEventListener('click', () => haptic('error'));
  });

  // Toggle switches — light
  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => haptic('light'));
  });

  // Kids set cards — light
  document.querySelectorAll('.kset, .kids-set-card').forEach(card => {
    card.addEventListener('click', () => haptic('light'));
  });

  // Nav items in sidebar — light
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => haptic('light'));
  });

  // Approve/reject buttons — success/error
  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', () => haptic('success'));
  });
  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', () => haptic('error'));
  });

  // Leo buttons — double tap feel
  document.querySelectorAll('.leo-k-btn, .lkbtn, .leo-kids-btn, .lna-btn').forEach(btn => {
    btn.addEventListener('click', () => haptic('double'));
  });

  // Session end — strong success
  document.querySelectorAll('.se-circle, [onclick*="restartStudy"], [onclick*="endSession"]').forEach(el => {
    el.addEventListener('click', () => haptic('success'));
  });

});

// ── AGE VERIFICATION GATE ────────────────────────────────────────────────────
window.checkAgeGate = function(redirectUrl) {
  const stored = localStorage.getItem('lumio_age_verified');
  const session = sessionStorage.getItem('lumio_age_verified');
  const verified = (session === 'true') || (stored && Date.now() < parseInt(stored));
  if(!verified){
    sessionStorage.setItem('ageVerifyRedirect', redirectUrl || window.location.href);
    window.location.href = 'ageverify.html';
    return false;
  }
  return true;
};

// Age badge on set cards — clicking 18+ sets triggers gate
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-age="18+"], .age-18').forEach(el => {
    el.addEventListener('click', function(e) {
      if(!window.checkAgeGate(this.dataset.url || window.location.href)){
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
});
