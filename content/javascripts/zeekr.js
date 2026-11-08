/* Zeekr Insiders wiki enhancements.
 * - Overflowing tables become keyboard-scrollable regions.
 * - Comparison pages get a .zi-compare hook so best-in-column styling
 *   only applies where tables are actually comparisons.
 * - The "On this page" panel's progress track and percentage follow the
 *   reader through the article, as on the front door.
 * - Citations (marked up by hooks/citations.py) show their source on hover
 *   or focus, open it directly on Ctrl/Cmd-click or middle-click, and the
 *   source's "Back to text" link returns to the citation actually followed.
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

  // Citations. Delegated listeners on the document, so there is nothing to
  // attach per marker and nothing to clean up.
  function citations() {
    if (!document.querySelector('a.footnote-ref[data-zi-cite]')) return;
    var tip = document.createElement('div');
    tip.className = 'zi-cite-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var current = null;

    function cite(target) {
      return target && target.closest ? target.closest('a.footnote-ref[data-zi-cite]') : null;
    }

    function host(url) {
      try {
        return new URL(url).hostname.replace(/^www\./, '');
      } catch (e) {
        return '';
      }
    }

    function show(link) {
      if (current === link) return;
      current = link;
      var label = document.createElement('span');
      label.textContent = link.getAttribute('data-zi-cite');
      var meta = document.createElement('small');
      var url = link.getAttribute('data-zi-href');
      meta.textContent = url ? host(url) + ' \u00b7 ' + (mac ? 'Cmd' : 'Ctrl') + '-click to open' : '';
      tip.replaceChildren(label, meta);
      tip.hidden = false;

      // Above the marker where there is room, otherwise below; kept inside the viewport.
      var r = link.getBoundingClientRect();
      var gap = 8;
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var left = Math.min(Math.max(gap, r.left + r.width / 2 - w / 2), window.innerWidth - w - gap);
      var top = r.top - h - gap;
      if (top < gap) top = r.bottom + gap;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
      window.addEventListener('scroll', hide, { passive: true, once: true });
    }

    function hide() {
      current = null;
      tip.hidden = true;
    }

    function open(e, link) {
      var url = link.getAttribute('data-zi-href');
      if (!url) return;
      e.preventDefault();
      window.open(url, '_blank', 'noopener');
    }

    document.addEventListener('mouseover', function (e) {
      var link = cite(e.target);
      if (link) show(link);
      else if (current && current !== document.activeElement) hide();
    });
    document.addEventListener('focusin', function (e) {
      var link = cite(e.target);
      if (link) show(link);
      else hide();
    });
    document.addEventListener('focusout', function (e) {
      if (cite(e.target)) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) hide();
    });

    document.addEventListener('click', function (e) {
      var link = cite(e.target);
      if (!link) return;
      if (e.ctrlKey || e.metaKey) {
        open(e, link);
        return;
      }
      hide();
      // Point the source's single "Back to text" link at this citation, not the first one.
      var entry = document.getElementById(link.getAttribute('href').slice(1));
      var back = entry && entry.querySelector('.footnote-backref');
      var sup = link.parentElement;
      if (back && sup && sup.id) back.setAttribute('href', '#' + sup.id);
    });
    document.addEventListener('auxclick', function (e) {
      var link = cite(e.target);
      if (link && e.button === 1) open(e, link);
    });
  }

  if (document.readyState !== 'loading') {
    citations();
  } else {
    document.addEventListener('DOMContentLoaded', citations);
  }
})();
