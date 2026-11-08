/* Glossary page (the glossary() macro in main.py, data/glossary.yml).
 * Progressive: the page ships as the full A to Z list with letter links, and
 * this script reveals the filter, the category chips and a copy-link button on
 * each term. Typing filters on the term, its aliases and its definition,
 * marking the matches. A #term URL scrolls to the term and highlights it,
 * clearing any filter that would hide it. Runs only where the glossary is.
 */
(function () {
  function init() {
    var root = document.querySelector('.zi-gloss');
    if (!root || root.dataset.ziReady) return;
    root.dataset.ziReady = '1';

    var input = root.querySelector('.zi-gloss-search__input');
    var clear = root.querySelector('.zi-gloss-clear');
    var chips = Array.prototype.slice.call(root.querySelectorAll('.zi-chip'));
    var count = root.querySelector('.zi-gloss-count');
    var empty = root.querySelector('.zi-gloss-empty');
    var groups = Array.prototype.slice.call(root.querySelectorAll('.zi-gloss-group'));
    var letters = Array.prototype.slice.call(root.querySelectorAll('.zi-gloss-az a'));
    var icon = document.getElementById('zi-gloss-link-icon');
    var category = '';

    root.querySelector('.zi-gloss-search').hidden = false;
    root.querySelector('.zi-gloss-chips').hidden = false;
    count.hidden = false;

    // Each term: a copy-link button in its heading, the searchable text
    // (without footnote numbers or button labels) and the original markup
    // to restore before marking matches again.
    var terms = Array.prototype.slice.call(root.querySelectorAll('.zi-term')).map(function (el) {
      var heading = el.querySelector('h2');
      var name = heading.firstChild ? heading.textContent.replace('¶', '').trim() : '';
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'zi-term__copy';
      button.setAttribute('aria-label', 'Copy link to ' + name);
      button.title = 'Copy link';
      if (icon) button.appendChild(icon.content.cloneNode(true));
      var permalink = heading.querySelector('.headerlink');
      heading.insertBefore(button, permalink);
      var plain = el.cloneNode(true);
      Array.prototype.forEach.call(plain.querySelectorAll('sup, .headerlink, .zi-term__copy, .zi-term__see'), function (n) {
        n.remove();
      });
      return {
        el: el,
        id: heading.id,
        name: name,
        cat: el.getAttribute('data-cat') || '',
        text: plain.textContent.replace(/\s+/g, ' ').toLowerCase(),
        html: el.innerHTML
      };
    });
    var total = terms.length;

    function mark(el, q) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          return node.parentNode.closest('sup, .headerlink, .zi-term__copy, .zi-term__see, mark')
            ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var text = node.nodeValue;
        var lower = text.toLowerCase();
        var at = lower.indexOf(q);
        if (at === -1) return;
        var frag = document.createDocumentFragment();
        var from = 0;
        while (at !== -1) {
          frag.appendChild(document.createTextNode(text.slice(from, at)));
          var m = document.createElement('mark');
          m.textContent = text.slice(at, at + q.length);
          frag.appendChild(m);
          from = at + q.length;
          at = lower.indexOf(q, from);
        }
        frag.appendChild(document.createTextNode(text.slice(from)));
        node.parentNode.replaceChild(frag, node);
      });
    }

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      terms.forEach(function (t) {
        var hit = (!category || t.cat === category) && (!q || t.text.indexOf(q) !== -1);
        if (t.marked) {
          t.el.innerHTML = t.html;
          t.marked = false;
        }
        t.el.hidden = !hit;
        if (hit) {
          shown++;
          if (q) {
            mark(t.el, q);
            t.marked = true;
          }
        }
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector('.zi-term:not([hidden])');
      });
      letters.forEach(function (a) {
        var group = document.getElementById(a.getAttribute('data-letter'));
        var off = !group || group.closest('.zi-gloss-group').hidden;
        a.classList.toggle('is-empty', off);
        if (off) {
          a.setAttribute('aria-disabled', 'true');
          a.setAttribute('tabindex', '-1');
        } else {
          a.removeAttribute('aria-disabled');
          a.removeAttribute('tabindex');
        }
      });
      clear.hidden = !input.value;
      empty.hidden = shown !== 0;
      var filtered = q || category;
      count.textContent = filtered
        ? (shown === 1 ? '1 term' : shown + ' terms') + ' of ' + total + ' shown'
        : total + ' terms';
    }

    function reset() {
      input.value = '';
      category = '';
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-cat') === '' ? 'true' : 'false');
      });
      apply();
    }

    input.addEventListener('input', apply);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && input.value) {
        e.preventDefault();
        input.value = '';
        apply();
      }
    });
    clear.addEventListener('click', function () {
      input.value = '';
      apply();
      input.focus();
    });
    root.querySelector('.zi-gloss-reset').addEventListener('click', function () {
      reset();
      input.focus();
    });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        category = chip.getAttribute('data-cat') || '';
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        apply();
      });
    });
    root.querySelector('.zi-gloss-az').addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && a.getAttribute('aria-disabled') === 'true') e.preventDefault();
    });

    // Copy a term's link. Delegated, because marking matches rebuilds a term's markup.
    var status = document.createElement('p');
    status.className = 'zi-gloss-status';
    status.setAttribute('role', 'status');
    root.appendChild(status);
    root.addEventListener('click', function (e) {
      var button = e.target.closest('.zi-term__copy');
      if (!button) return;
      var id = button.closest('h2').id;
      var url = location.origin + location.pathname + '#' + id;
      function done() {
        button.classList.add('is-copied');
        button.title = 'Link copied';
        status.textContent = 'Link copied';
        setTimeout(function () {
          button.classList.remove('is-copied');
          button.title = 'Copy link';
          status.textContent = '';
        }, 1800);
      }
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else {
        done();
      }
    });

    // Land on a #term: show it even if a filter hid it, then highlight it.
    function target() {
      var id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      var el = document.getElementById(id);
      var term = el && el.closest('.zi-term');
      if (!term) return;
      if (term.hidden) reset();
      terms.forEach(function (t) {
        t.el.classList.remove('is-target');
      });
      term.classList.add('is-target');
      el.scrollIntoView({ block: 'start' });
    }

    // The sticky bar sits under Material's sticky header, and anchors land
    // below both. Their heights depend on the window, so measure them.
    var bar = root.querySelector('.zi-gloss-bar');
    function measure() {
      var header = document.querySelector('.md-header');
      var sticky = getComputedStyle(bar).position === 'sticky';
      var top = header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
      root.style.setProperty('--zi-gloss-top', top + 'px');
      root.style.setProperty('--zi-gloss-bar-h', (sticky ? bar.offsetHeight : 0) + 'px');
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });

    apply();
    window.addEventListener('hashchange', target);
    target();
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
