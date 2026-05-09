// ── LUMIO SITE-WIDE SEARCH ───────────────────────────────────────────────────

const SEARCH_DATA = [
  // Sets
  {type:'set',title:'Cell Division: Mitosis & Meiosis',desc:'48 cards · Biology · Intermediate',url:'setdetail.html',icon:'ti-dna'},
  {type:'set',title:'Human Body Systems Overview',desc:'66 cards · Biology · Intermediate',url:'setdetail.html',icon:'ti-heart-rate-monitor'},
  {type:'set',title:'Photosynthesis — Complete Guide',desc:'28 cards · Science · Beginner',url:'setdetail.html',icon:'ti-leaf'},
  {type:'set',title:'World Capitals — All 195 Countries',desc:'195 cards · Geography · All levels',url:'setdetail.html',icon:'ti-world'},
  {type:'set',title:'SAT Vocabulary High Frequency',desc:'150 cards · English · Advanced',url:'setdetail.html',icon:'ti-writing'},
  {type:'set',title:'WW2 Key Events Timeline',desc:'60 cards · History · Intermediate',url:'setdetail.html',icon:'ti-history'},
  {type:'set',title:'Spanish 101 — Core Vocabulary',desc:'200 cards · Languages · Beginner',url:'setdetail.html',icon:'ti-language'},
  {type:'set',title:'Calculus Fundamentals',desc:'55 cards · Math · Advanced',url:'setdetail.html',icon:'ti-math'},
  {type:'set',title:'Periodic Table — First 40 Elements',desc:'40 cards · Science · Intermediate',url:'setdetail.html',icon:'ti-atom'},
  {type:'set',title:'Genetics Fundamentals',desc:'40 cards · Biology · Intermediate',url:'setdetail.html',icon:'ti-dna-2'},
  // Pages
  {type:'page',title:'Dashboard',desc:'Your study stats and progress',url:'dashboard.html',icon:'ti-layout-dashboard'},
  {type:'page',title:'Explore',desc:'Browse the set marketplace',url:'explore.html',icon:'ti-compass'},
  {type:'page',title:'Leaderboard',desc:'Weekly and all-time rankings',url:'leaderboard.html',icon:'ti-trophy'},
  {type:'page',title:'Create a set',desc:'Build a new flashcard set',url:'create.html',icon:'ti-plus'},
  {type:'page',title:'Study mode',desc:'Start a study session',url:'study.html',icon:'ti-cards'},
  {type:'page',title:'My profile',desc:'Your creator profile',url:'profile.html',icon:'ti-user'},
  {type:'page',title:'Settings',desc:'Account and preferences',url:'settings.html',icon:'ti-settings'},
  {type:'page',title:'Leo\'s profile',desc:'Lumio\'s AI study coach',url:'leo.html',icon:'ti-brain'},
  {type:'page',title:'Kids mode',desc:'Simplified learning for young students',url:'kids.html',icon:'ti-mood-smile'},
  // Creators
  {type:'creator',title:'sarah_reads',desc:'Verified creator · 12 sets · 98k plays',url:'profile.html',icon:'ti-user-circle'},
  {type:'creator',title:'nova_prep',desc:'Verified creator · 22 sets · Top rated',url:'profile.html',icon:'ti-user-circle'},
  {type:'creator',title:'jade_prep',desc:'Verified creator · 6 sets',url:'profile.html',icon:'ti-user-circle'},
  {type:'creator',title:'Leo',desc:'Official AI creator · 2,840 sets',url:'leo.html',icon:'ti-brain'},
];

const TYPE_COLORS = {
  set: '#3a6b3f',
  page: '#5c3d1e',
  creator: '#8b6340',
};
const TYPE_LABELS = { set:'Set', page:'Page', creator:'Creator' };

function initSearch() {
  // Inject search overlay into page
  const overlay = document.createElement('div');
  overlay.id = 'searchOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(44,26,14,0.5);z-index:9999;
    display:none;align-items:flex-start;justify-content:center;padding-top:80px;
    backdrop-filter:blur(4px);
  `;
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;width:100%;max-width:580px;box-shadow:0 24px 64px rgba(44,26,14,0.2);overflow:hidden;margin:0 16px">
      <div style="display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1.5px solid rgba(92,61,30,0.15)">
        <i class="ti ti-search" style="font-size:18px;color:#b8956a;flex-shrink:0"></i>
        <input id="searchInput" placeholder="Search sets, pages, creators..." style="flex:1;border:none;outline:none;font-family:'Source Sans 3',sans-serif;font-size:15px;color:#2c1a0e;background:transparent" oninput="runSearch(this.value)" onkeydown="handleSearchKey(event)">
        <kbd style="font-size:11px;padding:3px 7px;border-radius:5px;background:#f4ede0;color:#8b6340;border:1px solid rgba(92,61,30,0.2);font-family:monospace">ESC</kbd>
      </div>
      <div id="searchResults" style="max-height:400px;overflow-y:auto;padding:8px 0"></div>
      <div id="searchEmpty" style="display:none;padding:32px;text-align:center;color:#b8956a;font-size:13px;font-weight:300">No results found</div>
      <div id="searchHint" style="padding:12px 18px;border-top:1.5px solid rgba(92,61,30,0.1);display:flex;gap:16px">
        <span style="font-size:11px;color:#b8956a"><kbd style="padding:2px 6px;border-radius:4px;background:#f4ede0;border:1px solid rgba(92,61,30,0.2);font-family:monospace">↑↓</kbd> navigate</span>
        <span style="font-size:11px;color:#b8956a"><kbd style="padding:2px 6px;border-radius:4px;background:#f4ede0;border:1px solid rgba(92,61,30,0.2);font-family:monospace">↵</kbd> open</span>
        <span style="font-size:11px;color:#b8956a"><kbd style="padding:2px 6px;border-radius:4px;background:#f4ede0;border:1px solid rgba(92,61,30,0.2);font-family:monospace">ESC</kbd> close</span>
      </div>
    </div>`;

  overlay.addEventListener('click', e => { if(e.target === overlay) closeSearch(); });
  document.body.appendChild(overlay);

  // Show default results on open
  showDefaultResults();

  // Keyboard shortcut Cmd+K / Ctrl+K
  document.addEventListener('keydown', e => {
    if((e.metaKey || e.ctrlKey) && e.key === 'k'){
      e.preventDefault();
      openSearch();
    }
    if(e.key === 'Escape') closeSearch();
  });

  // Add search button to topbar if it exists
  const topbar = document.querySelector('.topbar');
  if(topbar && !document.getElementById('searchTrigger')){
    const btn = document.createElement('button');
    btn.id = 'searchTrigger';
    btn.onclick = openSearch;
    btn.style.cssText = `
      display:flex;align-items:center;gap:8px;padding:7px 14px;
      border:1.5px solid rgba(92,61,30,0.28);border-radius:8px;
      background:#f4ede0;cursor:pointer;font-family:'Source Sans 3',sans-serif;
      font-size:13px;color:#8b6340;font-weight:400;transition:all 0.2s;
      margin-left:auto;margin-right:10px;
    `;
    btn.innerHTML = `<i class="ti ti-search" style="font-size:15px"></i> Search <kbd style="font-size:10px;padding:2px 5px;border-radius:4px;background:rgba(92,61,30,0.1);font-family:monospace;margin-left:4px">⌘K</kbd>`;
    btn.addEventListener('mouseover', () => btn.style.background = '#ede0cc');
    btn.addEventListener('mouseout', () => btn.style.background = '#f4ede0');
    const tbRight = topbar.querySelector('.topbar-right') || topbar;
    tbRight.insertBefore(btn, tbRight.firstChild);
  }
}

let selectedIdx = -1;

function openSearch(){
  const overlay = document.getElementById('searchOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => document.getElementById('searchInput').focus(), 50);
  selectedIdx = -1;
  showDefaultResults();
  if(window.haptic) haptic('light');
}

function closeSearch(){
  const overlay = document.getElementById('searchOverlay');
  overlay.style.display = 'none';
  document.getElementById('searchInput').value = '';
  selectedIdx = -1;
}

function showDefaultResults(){
  const results = document.getElementById('searchResults');
  const hint = document.getElementById('searchHint');
  const empty = document.getElementById('searchEmpty');
  hint.style.display = 'flex';
  empty.style.display = 'none';
  results.innerHTML = `
    <div style="padding:8px 18px 6px;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#b8956a">Quick links</div>
    ${['Dashboard','Explore','Create a set','Leaderboard','Settings'].map((name,i) => {
      const item = SEARCH_DATA.find(d => d.title === name);
      if(!item) return '';
      return renderResult(item, i);
    }).join('')}`;
}

function runSearch(query){
  const results = document.getElementById('searchResults');
  const empty = document.getElementById('searchEmpty');
  const hint = document.getElementById('searchHint');
  selectedIdx = -1;

  if(!query.trim()){ showDefaultResults(); return; }

  const q = query.toLowerCase();
  const matches = SEARCH_DATA.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.type.toLowerCase().includes(q)
  ).slice(0, 8);

  if(matches.length === 0){
    results.innerHTML = '';
    empty.style.display = 'block';
    hint.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  hint.style.display = 'flex';

  // Group by type
  const groups = {};
  matches.forEach(m => { if(!groups[m.type]) groups[m.type] = []; groups[m.type].push(m); });

  let html = '';
  let idx = 0;
  Object.entries(groups).forEach(([type, items]) => {
    html += `<div style="padding:8px 18px 4px;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#b8956a">${TYPE_LABELS[type]}s</div>`;
    items.forEach(item => { html += renderResult(item, idx++); });
  });
  results.innerHTML = html;
}

function renderResult(item, idx){
  return `<div class="search-result" data-url="${item.url}" data-idx="${idx}"
    style="display:flex;align-items:center;gap:12px;padding:10px 18px;cursor:pointer;transition:background 0.15s"
    onmouseover="selectResult(${idx})"
    onclick="goToResult('${item.url}')">
    <div style="width:34px;height:34px;border-radius:8px;background:#f4ede0;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid rgba(92,61,30,0.15)">
      <i class="ti ${item.icon}" style="font-size:16px;color:#8b6340"></i>
    </div>
    <div style="flex:1;min-width:0">
      <div style="font-size:13px;font-weight:500;color:#2c1a0e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.title}</div>
      <div style="font-size:11px;color:#b8956a;font-weight:300;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.desc}</div>
    </div>
    <span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:100px;background:${TYPE_COLORS[item.type]}22;color:${TYPE_COLORS[item.type]};flex-shrink:0">${TYPE_LABELS[item.type]}</span>
  </div>`;
}

function selectResult(idx){
  document.querySelectorAll('.search-result').forEach(el => {
    el.style.background = el.dataset.idx == idx ? '#f4ede0' : '';
  });
  selectedIdx = idx;
}

function handleSearchKey(e){
  const results = document.querySelectorAll('.search-result');
  if(e.key === 'ArrowDown'){
    e.preventDefault();
    selectedIdx = Math.min(selectedIdx + 1, results.length - 1);
    selectResult(selectedIdx);
    results[selectedIdx]?.scrollIntoView({block:'nearest'});
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    selectedIdx = Math.max(selectedIdx - 1, 0);
    selectResult(selectedIdx);
    results[selectedIdx]?.scrollIntoView({block:'nearest'});
  } else if(e.key === 'Enter'){
    const selected = document.querySelector(`.search-result[data-idx="${selectedIdx}"]`);
    if(selected) goToResult(selected.dataset.url);
    else if(results.length > 0) goToResult(results[0].dataset.url);
  }
}

function goToResult(url){
  closeSearch();
  if(window.haptic) haptic('light');
  setTimeout(() => window.location.href = url, 100);
}

document.addEventListener('DOMContentLoaded', initSearch);
