// ── LUMIO LOADING SCREEN ─────────────────────────────────────────────────────
(function() {
  // Only show on first visit or slow connections
  if (sessionStorage.getItem('lumio_loaded')) return;

  const splash = document.createElement('div');
  splash.id = 'lumio-splash';
  splash.style.cssText = `
    position:fixed;inset:0;background:#2c1a0e;z-index:99999;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    font-family:'Source Sans 3',sans-serif;
    transition:opacity 0.4s ease, transform 0.4s ease;
  `;
  splash.innerHTML = `
    <div style="text-align:center">
      <div style="font-family:'Playfair Display',serif;font-size:36px;font-weight:800;color:#faf7f2;letter-spacing:-1px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px">
        Lumio
        <span id="splash-dot" style="width:10px;height:10px;border-radius:50%;background:#d4b896;display:inline-block;animation:splashBounce 0.8s ease-in-out infinite"></span>
      </div>
      <div style="font-size:13px;color:#b8956a;font-weight:300;margin-bottom:32px">Your AI study companion</div>
      <div style="width:48px;height:48px;border-radius:50%;border:3px solid rgba(255,255,255,0.1);border-top-color:#d4b896;animation:splashSpin 0.8s linear infinite;margin:0 auto"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes splashBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes splashSpin{to{transform:rotate(360deg)}}
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&family=Source+Sans+3:wght@300&display=swap');
  `;
  document.head.appendChild(style);
  document.body.appendChild(splash);

  window.addEventListener('load', () => {
    sessionStorage.setItem('lumio_loaded', '1');
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.02)';
      setTimeout(() => splash.remove(), 400);
    }, 600);
  });
})();
