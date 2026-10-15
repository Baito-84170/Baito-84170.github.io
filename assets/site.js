/* ==========================================================================
   Baito_84170 — 交互脚本
   主题切换、顶栏分割线、滚动入场、页脚年份。无依赖、无构建。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'theme';

  // 告诉 CSS「JS 可用」——滚动入场的初始隐藏态只在 .js 下生效，
  // 这样脚本挂了也不会留下不可见的内容
  root.classList.add('js');

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
      meta.setAttribute('content', mode === 'dark' ? '#08090e' : '#fbfbfe');
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

  // ------------------------------------------------------------ 入场
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var showAll = function () {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
    };
    if (!('IntersectionObserver' in window)) {
      showAll();
    } else {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('is-in');
            io.unobserve(entries[i].target);
          }
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
      // 兜底：3 秒后仍未入场的直接显示，避免任何情况下内容缺失
      window.setTimeout(showAll, 3000);
    }
  }

  // ------------------------------------------------------------ 年份
  var year = document.querySelector('[data-year]');
  if (year) {
    var now = new Date().getFullYear();
    year.textContent = now > 2023 ? '2023–' + now : '2023';
  }
})();
