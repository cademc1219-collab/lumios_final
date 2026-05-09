// ── LUMIO KEYBOARD SHORTCUTS ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const shortcuts = {
    'g h': () => window.location.href = 'dashboard.html',
    'g e': () => window.location.href = 'explore.html',
    'g c': () => window.location.href = 'create.html',
    'g l': () => window.location.href = 'leaderboard.html',
    'g p': () => window.location.href = 'profile.html',
    'g s': () => window.location.href = 'settings.html',
    '?':   () => showShortcutsModal(),
  };

  let keyBuffer = '';
  let bufferTimer = null;

  document.addEventListener('keydown', e => {
    // Skip if user is typing in an input
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const key = e.key.toLowerCase();
    keyBuffer += (keyBuffer ? ' ' : '') + key;

    clearTimeout(bufferTimer);
    bufferTimer = setTimeout(() => { keyBuffer = ''; }, 600);

    if (shortcuts[keyBuffer]) {
      e.preventDefault();
      shortcuts[keyBuffer]();
      keyBuffer = '';
    }
  });

  function showShortcutsModal() {
    const existing = document.getElementById('shortcutsModal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'shortcutsModal';
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(44,26,14,0.5);z-index:9999;
      display:flex;align-items:center;justify-content:center;padding:24px;
      backdrop-filter:blur(4px);
    `;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:28px;max-width:400px;width:100%;box-shadow:0 24px 64px rgba(44,26,14,0.2)">
        <div style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#2c1a0e;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">
          Keyboard shortcuts
          <span style="font-size:12px;color:#b8956a;font-weight:300;font-family:'Source Sans 3',sans-serif">Press ? to close</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            ['G then H', 'Go to Dashboard'],
            ['G then E', 'Go to Explore'],
            ['G then C', 'Go to Create'],
            ['G then L', 'Go to Leaderboard'],
            ['G then P', 'Go to Profile'],
            ['G then S', 'Go to Settings'],
            ['⌘K', 'Open search'],
            ['?', 'Show shortcuts'],
            ['Esc', 'Close modals'],
          ].map(([k, v]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:#faf7f2">
              <span style="font-size:13px;color:#5c3d1e">${v}</span>
              <kbd style="font-size:11px;padding:3px 8px;border-radius:5px;background:#f4ede0;color:#8b6340;border:1px solid rgba(92,61,30,0.2);font-family:monospace">${k}</kbd>
            </div>
          `).join('')}
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  // Show hint on first visit
  if (!localStorage.getItem('lumio_shortcuts_seen')) {
    setTimeout(() => {
      if (window.showToast) showToast('Press ? to see keyboard shortcuts');
      localStorage.setItem('lumio_shortcuts_seen', '1');
    }, 3000);
  }
});
