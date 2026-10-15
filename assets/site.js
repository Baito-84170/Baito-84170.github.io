/* ==========================================================================
   Baito_84170 — 交互脚本
   只做三件事：主题切换、顶栏吸顶分割线、页脚年份。没有依赖，没有构建。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'theme';

  function current() {
    return root.getAttribute('data-theme') || 'light';
  }

  // ---------------------------------------------------------------- 主题
  var btn = document.querySelector('.theme-toggle');

  function label(mode) {
    return mode === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  }

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    if (btn) {
      btn.setAttribute('aria-label', label(mode));
      btn.setAttribute('title', label(mode));
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', mode === 'dark' ? '#0c0d12' : '#fbfbfd');
    }
  }

  if (btn) {
    apply(current());
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) { /* 无痕模式忽略 */ }
      apply(next);
    });
  }

  // ---------------------------------------------------- 顶栏滚动分割线
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ------------------------------------------------------------ 年份
  var year = document.querySelector('[data-year]');
  if (year) {
    var now = new Date().getFullYear();
    year.textContent = now > 2023 ? '2023–' + now : '2023';
  }
})();
