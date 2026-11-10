/* Zeekr Insiders wiki enhancements.
 * - Overflowing tables become keyboard-scrollable regions.
 * - Comparison pages get a .zi-compare hook so best-in-column styling
 *   only applies where tables are actually comparisons.
 * - The "On this page" panel's progress track and percentage follow the
 *   reader through the article, as on the front door.
 * - The phone drawer's menu button is reachable by keyboard, and Escape
 *   closes the drawer and hands focus back to it.
 * - Videos load YouTube only when the reader presses play.
 * - Citations (marked up by hooks/citations.py) show their source on hover
 *   or focus and open it directly on Ctrl/Cmd-click or middle-click. Following
 *   one, or landing on a #fn: link, opens the collapsed Sources panel first.
 * - The home page's handover card fires a confetti burst (celebrate.js) when
 *   its hover trace completes a full loop.
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
      follow();
    }

    // The list scrolls inside the panel on long pages; keep the row Material
    // marks active in view, nudging only when it has left the visible part.
    var list = toc.querySelector(':scope > .md-nav__list');
    function follow() {
      if (!list || list.scrollHeight <= list.clientHeight) return;
      var active = list.querySelectorAll('.md-nav__link--active');
      var row = active[active.length - 1];
      if (!row) return;
      var l = list.getBoundingClientRect();
      var r = row.getBoundingClientRect();
      if (r.top < l.top || r.bottom > l.bottom) {
        list.scrollTop += r.top - l.top - (l.height - r.height) / 2;
      }
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

  // The drawer. Material's menu "button" is a <label> for a hidden checkbox,
  // which the keyboard cannot reach (and a label may not take a button role),
  // so a real button replaces it, with aria-expanded. Escape closes an open
  // drawer and returns focus to the button, as the overlay click already does.
  function drawer() {
    var toggle = document.getElementById('__drawer');
    var label = document.querySelector('.md-header label[for="__drawer"]');
    if (!toggle || !label) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = label.className + ' zi-drawer-button';
    button.setAttribute('aria-label', 'Wiki menu');
    button.innerHTML = label.innerHTML;
    var hidden = button.querySelector('.zi-sr-only');
    if (hidden) hidden.remove();
    label.parentNode.insertBefore(button, label);
    label.hidden = true;

    function sync() {
      button.setAttribute('aria-expanded', toggle.checked ? 'true' : 'false');
    }
    function set(open) {
      toggle.checked = open;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
    }

    sync();
    toggle.addEventListener('change', sync);
    button.addEventListener('click', function (e) {
      set(!toggle.checked);
      // From the keyboard (no pointer), move focus into the drawer it opened.
      if (toggle.checked && e.detail === 0) {
        var first = document.querySelector('.md-sidebar--primary .zi-drawer-club a');
        if (first) first.focus();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.checked) {
        set(false);
        button.focus();
      }
    });
  }

  if (document.readyState !== 'loading') {
    drawer();
  } else {
    document.addEventListener('DOMContentLoaded', drawer);
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
      place();
      window.addEventListener('scroll', place, { passive: true });
    }

    // Below the marker's line, so it never covers the words being read;
    // above only when there is no room below. Kept inside the viewport.
    // Scrolling (including focus scrolling a marker into view) follows the
    // marker rather than hiding the tip.
    function place() {
      if (!current) return;
      var r = current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return hide();
      var gap = 8;
      var w = tip.offsetWidth;
      var h = tip.offsetHeight;
      var left = Math.min(Math.max(gap, r.left + r.width / 2 - w / 2), window.innerWidth - w - gap);
      // The superscript sits high in its line; clear the whole line box.
      var line = parseFloat(getComputedStyle(current.closest('p, li, td, th, dd') || current).lineHeight) || r.height;
      var top = r.top + line;
      if (top + h > window.innerHeight - gap) top = r.top - h - gap;
      top = Math.max(gap, top);
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }

    function hide() {
      current = null;
      tip.hidden = true;
      window.removeEventListener('scroll', place);
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
      // Open the panel before the browser follows the link, so it can scroll
      // to the entry and :target can highlight it.
      openSources(link.getAttribute('href').slice(1));
    });
    document.addEventListener('auxclick', function (e) {
      var link = cite(e.target);
      if (link && e.button === 1) open(e, link);
    });
  }

  // The Sources panel (hooks/citations.py) is a closed <details>. Opens it
  // when the given id is inside it; returns that element, or null.
  function openSources(id) {
    var el = id ? document.getElementById(id) : null;
    var panel = el && el.closest('details.zi-sources');
    if (!panel) return null;
    panel.open = true;
    return el;
  }

  // A #fn: link from elsewhere, or a hash change on the page, lands on an
  // entry the browser could not scroll to while the panel was shut.
  function revealHash() {
    var el = openSources(decodeURIComponent(location.hash.slice(1)));
    if (el) el.scrollIntoView({ block: 'center' });
  }
  window.addEventListener('hashchange', revealHash);

  if (document.readyState !== 'loading') {
    revealHash();
  } else {
    document.addEventListener('DOMContentLoaded', revealHash);
  }

  // Click-to-load videos (the youtube macro in main.py): the poster is local,
  // so YouTube hears nothing until the reader presses play.
  document.addEventListener('click', function (e) {
    var play = e.target.closest ? e.target.closest('.zi-video__play') : null;
    if (!play) return;
    var frame = play.closest('.zi-video__frame');
    var id = frame && frame.getAttribute('data-zi-video');
    if (!id || !/^[\w-]{11}$/.test(id)) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    iframe.title = frame.getAttribute('data-zi-title') || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
    iframe.focus();
  });

  if (document.readyState !== 'loading') {
    citations();
  } else {
    document.addEventListener('DOMContentLoaded', citations);
  }
  // The handover card's trace (zeekr.css) is a transition on --zi-trace. It
  // only ends at 360deg when the reader stayed for the whole loop; leaving
  // early ends it at 0deg, so that is the no-confetti case. One transition per
  // hover means one burst per hover. Delegated on document, so it keeps
  // working if Material's instant navigation swaps the page body.
  document.addEventListener('transitionend', function (e) {
    if (e.propertyName !== '--zi-trace' || e.pseudoElement !== '::before') return;
    var card = e.target;
    if (!card.classList || !card.classList.contains('zi-card--celebrate')) return;
    if (getComputedStyle(card, '::before').getPropertyValue('--zi-trace').trim() !== '360deg') return;
    if (window.ZICelebrate) window.ZICelebrate.burst(card, { kinds: ['confetti', 'sparks'] });
  });
})();
