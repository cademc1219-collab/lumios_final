// ── LUMIO DARK MODE ───────────────────────────────────────────────────────────
const DARK = {
  '--cream': '#1a1410',
  '--cream2': '#231c15',
  '--cream3': '#2e2218',
  '--brown': '#f4ede0',
  '--brown2': '#ede0cc',
  '--brown3': '#d4b896',
  '--brown4': '#b8956a',
  '--brown5': '#8b6340',
  '--border': 'rgba(244,237,224,0.1)',
  '--border2': 'rgba(244,237,224,0.18)',
  '--shadow': 'rgba(0,0,0,0.3)',
  '--green2': '#0d2010',
  '--red2': '#2a0a0a',
};

const LIGHT = {
  '--cream': '#faf7f2',
  '--cream2': '#f4ede0',
  '--cream3': '#ede0cc',
  '--brown': '#2c1a0e',
  '--brown2': '#5c3d1e',
  '--brown3': '#8b6340',
  '--brown4': '#b8956a',
  '--brown5': '#d4b896',
  '--border': 'rgba(92,61,30,0.12)',
  '--border2': 'rgba(92,61,30,0.22)',
  '--shadow': 'rgba(44,26,14,0.07)',
  '--green2': '#e8f0e9',
  '--red2': '#fbeaea',
};

function applyTheme(dark) {
  const vars = dark ? DARK : LIGHT;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Fix sidebar — always dark brown
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.style.background = dark ? '#0f0a06' : '#2c1a0e';
}

function initDarkMode() {
  const saved = localStorage.getItem('lumio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (saved === 'system' && prefersDark) || (!saved && false);
  applyTheme(isDark);

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('lumio_theme') === 'system') applyTheme(e.matches);
  });
}

window.setTheme = function(theme) {
  localStorage.setItem('lumio_theme', theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(theme === 'dark' || (theme === 'system' && prefersDark));
  if (window.showToast) showToast(theme === 'dark' ? 'Dark mode on' : theme === 'light' ? 'Light mode on' : 'Using system theme');
};

window.toggleDarkMode = function() {
  const current = document.documentElement.getAttribute('data-theme');
  window.setTheme(current === 'dark' ? 'light' : 'dark');
};

document.addEventListener('DOMContentLoaded', initDarkMode);

// Wire settings theme select
document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.querySelector('select');
  if (themeSelect && themeSelect.closest) {
    document.querySelectorAll('select').forEach(sel => {
      if (sel.innerHTML.includes('Light') && sel.innerHTML.includes('Dark')) {
        sel.addEventListener('change', function() {
          const val = this.value.toLowerCase().includes('dark') ? 'dark' :
                      this.value.toLowerCase().includes('system') ? 'system' : 'light';
          window.setTheme(val);
        });
        // Set current value
        const saved = localStorage.getItem('lumio_theme') || 'light';
        if (saved === 'dark') sel.value = sel.querySelector('option[value], option')?.value || sel.options[1]?.value;
      }
    });
  }
});
