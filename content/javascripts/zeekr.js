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

    // Keyboard-scrollable tables (only when they actually overflow)
    var tables = document.querySelectorAll('.md-typeset table:not([class])');
    tables.forEach(function (table) {
      if (table.scrollWidth > table.clientWidth) {
        table.setAttribute('tabindex', '0');
        table.setAttribute('role', 'region');
        table.setAttribute('aria-label', 'Data table, scrolls horizontally');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }
})();
