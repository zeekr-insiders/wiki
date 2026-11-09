/* The Handover checklist (the handover_checklist() macro, data/handover-checklist.yml).
 * Progressive: without this the page is a plain list of checkboxes that
 * prints. With it: ticks and the chosen model are kept in this browser's
 * localStorage (never sent anywhere), a model picker hides items for other
 * models, each phase shows a sticky progress bar with the overall count,
 * "Copy what's left" copies the unticked items as plain text grouped by
 * section, and "Start again" clears everything after a confirm. Printing opens
 * every section first. A tick that finishes a section fires zi-hc:section-done
 * (detail: section, item, title, all) for handover-celebrate.js. Runs only where the
 * checklist is.
 */
(function () {
  var KEY = 'zi-handover:v1';

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (state && typeof state === 'object') {
        return { done: state.done || {}, model: state.model || 'all' };
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return { done: {}, model: 'all' };
  }

  function save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) { /* private mode or full: ticks last for this visit only */ }
  }

  function init() {
    var root = document.querySelector('.zi-hc');
    if (!root || root.dataset.ziReady) return;
    root.dataset.ziReady = '1';

    var state = load();
    var tools = root.querySelector('.zi-hc-tools');
    var status = root.querySelector('.zi-hc-status');
    var chips = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-models .zi-chip'));
    var phases = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-phase'));
    var sections = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-section'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-item')).map(function (el) {
      var box = el.querySelector('input[type="checkbox"]');
      return {
        el: el,
        box: box,
        id: box.getAttribute('data-id'),
        models: (el.getAttribute('data-models') || 'all').split(' '),
        text: el.querySelector('.zi-hc-text').textContent.trim()
      };
    });

    tools.hidden = false;
    phases.forEach(function (p) {
      p.querySelector('.zi-hc-progress').hidden = false;
    });

    function applies(item) {
      if (state.model === 'all') return true;
      return item.models.some(function (m) {
        return m === 'all' || m === state.model || m.indexOf(state.model + '-') === 0;
      });
    }

    function render() {
      var total = 0;
      var done = 0;
      items.forEach(function (item) {
        var on = applies(item);
        item.el.hidden = !on;
        item.box.checked = !!state.done[item.id];
        if (on) {
          total++;
          if (item.box.checked) done++;
        }
      });
      sections.forEach(function (s) {
        var shown = s.querySelectorAll('.zi-hc-item:not([hidden])');
        var ticked = s.querySelectorAll('.zi-hc-item:not([hidden]) input:checked');
        s.hidden = shown.length === 0;
        s.querySelector('.zi-hc-section__count').textContent = ticked.length + ' of ' + shown.length;
        s.classList.toggle('is-done', shown.length > 0 && ticked.length === shown.length);
      });
      phases.forEach(function (p) {
        var shown = p.querySelectorAll('.zi-hc-item:not([hidden])').length;
        var ticked = p.querySelectorAll('.zi-hc-item:not([hidden]) input:checked').length;
        var title = p.querySelector('h2').firstChild.textContent.trim();
        p.querySelector('.zi-hc-progress__phase').textContent = title + ': ' + ticked + ' of ' + shown;
        p.querySelector('.zi-hc-progress__overall').textContent = 'Overall ' + done + ' of ' + total;
        p.querySelector('.zi-hc-progress__track i').style.width = (shown ? (ticked / shown) * 100 : 0) + '%';
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-model') === state.model ? 'true' : 'false');
      });
    }

    function say(text) {
      status.textContent = text;
      setTimeout(function () {
        if (status.textContent === text) status.textContent = '';
      }, 4000);
    }

    root.addEventListener('change', function (e) {
      var box = e.target;
      if (!box.matches || !box.matches('.zi-hc-item input[type="checkbox"]')) return;
      var id = box.getAttribute('data-id');
      var section = box.closest('.zi-hc-section');
      var wasDone = section.classList.contains('is-done');
      if (box.checked) state.done[id] = 1;
      else delete state.done[id];
      save(state);
      render();
      // Only a tick that finishes a section is news. Saved progress, the model
      // picker and unticking never fire this; handover-celebrate.js listens.
      if (box.checked && !wasDone && section.classList.contains('is-done')) {
        root.dispatchEvent(new CustomEvent('zi-hc:section-done', {
          bubbles: true,
          detail: {
            section: section,
            item: box.closest('.zi-hc-item'),
            title: section.querySelector('.zi-hc-section__title').textContent.trim(),
            all: items.filter(applies).every(function (item) { return !!state.done[item.id]; })
          }
        }));
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.model = chip.getAttribute('data-model');
        save(state);
        render();
        var shown = items.filter(applies).length;
        say('Showing ' + shown + ' items for ' + chip.textContent + '.');
      });
    });

    root.querySelector('.zi-hc-reset').addEventListener('click', function () {
      if (!window.confirm('Start again? This clears every tick on this device.')) return;
      state.done = {};
      save(state);
      render();
      say('All ticks cleared.');
    });

    function leftText() {
      var lines = ['Zeekr handover: still to do', ''];
      var count = 0;
      sections.forEach(function (s) {
        var left = Array.prototype.slice.call(s.querySelectorAll('.zi-hc-item:not([hidden])')).filter(function (el) {
          return !el.querySelector('input').checked;
        });
        if (!left.length) return;
        lines.push(s.querySelector('.zi-hc-section__title').textContent.trim());
        left.forEach(function (el) {
          lines.push('- ' + el.querySelector('.zi-hc-text').textContent.trim());
          count++;
        });
        lines.push('');
      });
      return { text: lines.join('\n').trim() + '\n', count: count };
    }

    root.querySelector('.zi-hc-copy').addEventListener('click', function () {
      var left = leftText();
      if (!left.count) {
        say('Nothing left to copy: every item is ticked.');
        return;
      }
      function fallback() {
        var area = document.createElement('textarea');
        area.value = left.text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        area.remove();
        say(ok ? 'Copied ' + left.count + ' items.' : 'Copying is blocked here. Select the list and copy it by hand.');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(left.text).then(function () {
          say('Copied ' + left.count + ' items to paste into a message.');
        }, fallback);
      } else {
        fallback();
      }
    });

    // Print every section, then put back the ones the reader had closed.
    var closed = [];
    window.addEventListener('beforeprint', function () {
      closed = sections.filter(function (s) { return !s.open; });
      closed.forEach(function (s) { s.open = true; });
    });
    window.addEventListener('afterprint', function () {
      closed.forEach(function (s) { s.open = false; });
      closed = [];
    });

    // The sticky bars sit under Material's sticky header.
    function measure() {
      var header = document.querySelector('.md-header');
      var top = header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
      root.style.setProperty('--zi-hc-top', top + 'px');
    }
    measure();
    window.addEventListener('resize', measure, { passive: true });

    render();
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
