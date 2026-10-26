// assets/app.js — 目录高亮、阅读进度、移动端抽屉、Mermaid 初始化
(function () {
  // ---------- Mermaid ----------
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: "'Outfit', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      flowchart: { curve: 'basis', htmlLabels: true, useMaxWidth: true },
      themeVariables: {
        primaryColor: '#e9f0ed',
        primaryTextColor: '#16211f',
        primaryBorderColor: '#0f766e',
        lineColor: '#7d938e',
        secondaryColor: '#fdf0dd',
        tertiaryColor: '#f7f5ef',
        fontSize: '13px'
      }
    });

    // Mermaid 默认把 SVG 等比缩小以适配容器，手机上字号会小到不可读。
    // 这里恢复 SVG 的原始尺寸，由 CSS 控制：桌面端 max-width:100% 自适应，
    // 移动端 max-width:none + 容器横向滚动，保证字号不缩水。
    function normalizeMermaidSvg() {
      var nodes = document.querySelectorAll('pre.mermaid svg, svg[id^="mermaid-"]');
      Array.prototype.forEach.call(nodes, function (svg) {
        var vb = svg.getAttribute('viewBox');
        if (!vb) return;
        var parts = vb.split(/\s+/).map(Number);
        if (parts.length !== 4 || !parts[2] || !parts[3]) return;
        svg.style.removeProperty('max-width');
        svg.style.removeProperty('width');
        svg.style.removeProperty('height');
        svg.setAttribute('width', parts[2]);
        svg.setAttribute('height', parts[3]);
      });
    }
    window.addEventListener('load', function () {
      normalizeMermaidSvg();
      setTimeout(normalizeMermaidSvg, 600);
    });
  }

  // ---------- 阅读进度 ----------
  var bar = document.getElementById('progress');
  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---------- 目录高亮（Scroll Spy） ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible[en.target.id] = en.intersectionRatio;
        else delete visible[en.target.id];
      });
      var best = null;
      var bestRatio = -1;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestRatio) { bestRatio = visible[id]; best = id; }
      });
      if (best) setActive(best);
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.05, 0.15, 0.3, 0.5, 1] });
    sections.forEach(function (s) { io.observe(s); });
  }

  // 点击目录后立即高亮，并收起移动端抽屉
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('scrim');
  var menuBtn = document.getElementById('menuBtn');

  function closeMenu() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      setActive(a.getAttribute('href').slice(1));
      closeMenu();
    });
  });

  // ---------- 移动端抽屉 ----------
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      if (scrim) scrim.classList.toggle('show', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (scrim) scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();
