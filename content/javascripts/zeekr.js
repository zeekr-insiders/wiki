/* Zeekr Insiders wiki enhancements.
 * - Overflowing tables become keyboard-scrollable regions.
 * - Comparison pages get a .zi-compare hook so best-in-column styling
 *   only applies where tables are actually comparisons.
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
})();
