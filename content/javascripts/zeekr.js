/* Zeekr Insiders wiki enhancements.
 * - Overflowing tables become keyboard-scrollable regions.
 * - Comparison pages get a .zi-compare hook so best-in-column styling
 *   only applies where tables are actually comparisons.
 * - The "On this page" panel's progress track and percentage follow the
 *   reader through the article, as on the front door.
 */
(function () {
  function enhance() {
    // Comparison page hook
    if (window.location.pathname.indexOf('/comparisons/') !== -1) {
      var article = document.querySelector('.md-content');
      if (article) {
        article.classList.add('zi-compare');
      }
    }

    // Keyboard-scrollable tables. Material wraps each table in a
    // .md-typeset__scrollwrap at runtime; make the wrapper focusable
    // when it actually overflows.
    var wraps = document.querySelectorAll('.md-typeset__scrollwrap');
    wraps.forEach(function (wrap) {
      if (wrap.scrollWidth > wrap.clientWidth) {
        wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('role', 'region');
        wrap.setAttribute('aria-label', 'Data table, scrolls horizontally');
      }
    });
  }

  // Material's table wrapping happens after DOMContentLoaded, so run late
  // and once more on load (fonts can change overflow).
  window.addEventListener('load', enhance);
  if (document.readyState !== 'loading') {
    setTimeout(enhance, 0);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(enhance, 0);
    });
  }

  // Reading progress for the ToC panel (partials/toc.html). One passive
  // scroll listener, at most one update a frame. The panel only shows on wide
  // screens, but the work is cheap enough not to gate on that.
  function progress() {
    // Material also renders the ToC inside the phone drawer; the panel is the right-hand sidebar's copy.
    var toc = document.querySelector('.md-sidebar--secondary .zi-toc');
    var article = document.querySelector('.md-content__inner');
    if (!toc || !article) return;
    var bar = toc.querySelector('.zi-toc__track i');
    var pct = toc.querySelector('.zi-toc__pct');
    var top = toc.querySelector('.zi-toc__top');
    var frame = 0;

    function update() {
      frame = 0;
      var rect = article.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (pct) pct.textContent = Math.round(p * 100) + '%';
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    // Back to top lands on the page title and moves focus there too, so
    // keyboard users are not left in the sidebar.
    if (top) {
      top.addEventListener('click', function (e) {
        var heading = article.querySelector('h1');
        e.preventDefault();
        window.scrollTo({ top: 0 });
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      });
    }

    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
  }

  if (document.readyState !== 'loading') {
    progress();
  } else {
    document.addEventListener('DOMContentLoaded', progress);
  }
})();
