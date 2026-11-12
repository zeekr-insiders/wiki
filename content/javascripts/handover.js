/* The Handover checklist (the handover_checklist() macro, data/handover-checklist.yml).
 * Progressive: without this the page is a plain list of checkboxes that
 * prints. With it: ticks and the chosen model are kept in this browser's
 * localStorage (never sent anywhere), a model picker hides items for other
 * models, each phase shows a sticky progress bar with the overall count,
 * "Copy what's left" copies the unticked items as plain text grouped by
 * section, and "Start again" clears everything after a confirm. Printing opens
 * every section first. A tick that finishes a section folds it away, fires
 * zi-hc:section-done (detail: section, item, title, all) for
 * handover-celebrate.js from its heading, then opens the next unfinished one;
 * finished sections also start folded on load. "Start again" fires
 * zi-hc:reset so a running effect stops too. Runs only where the checklist is.
 */
(function () {
  var KEY = 'zi-handover:v1';

  // The picker's choices. A saved model that isn't one of them (a bare "7x"
  // or "x" from before the picker offered years, or the retired "7gt") falls
  // back to All models rather than hiding everything.
  var MODELS = ['all', '7x-my26', '7x-my27', 'x-my25', 'x-my26', '009'];

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (state && typeof state === 'object') {
        return {
          done: state.done || {},
          model: MODELS.indexOf(state.model) >= 0 ? state.model : 'all'
        };
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

    // The picker names a year ("7x-my27"); an item applies if it is tagged
    // for every model, for that year, or for the model in every year ("7x").
    function applies(item) {
      if (state.model === 'all') return true;
      var base = state.model.split('-')[0];
      return item.models.some(function (m) {
        return m === 'all' || m === state.model || m === base;
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
      // picker and unticking never start this.
      if (box.checked && !wasDone && section.classList.contains('is-done')) {
        finish(section, box.closest('.zi-hc-item'));
      }
    });

    /* Finishing a section: a beat so the tick registers, fold the section
     * away, bring its heading into view, celebrate there (zi-hc:section-done,
     * for handover-celebrate.js), then open the next unfinished section so a
     * thumb can carry straight on. The last section ends on the finale, and
     * nothing scrolls away from its card. */
    var BEAT = 250;
    var flow = null;
    var gen = 0; // bumped by a reset: every step of an older flow then stops

    function dropFlows() {
      if (flow) clearTimeout(flow.timer);
      flow = null;
      gen++;
    }

    // Fold what's finished and open what isn't, quietly: on load, and when the
    // model picker changes which items count.
    function sync() {
      sections.forEach(function (s) {
        if (!s.hidden) s.open = !s.classList.contains('is-done');
      });
    }

    function reduced() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function stickyOffset(section) {
      var phase = section.closest('.zi-hc-phase');
      var bar = phase && phase.querySelector('.zi-hc-progress');
      var top = parseFloat(getComputedStyle(root).getPropertyValue('--zi-hc-top')) || 0;
      return top + (bar && !bar.hidden ? bar.offsetHeight : 0) + 8;
    }

    // Material shows its "Back to top" button on any upward scroll, ours
    // included, and it lands on the heading we just brought into view. Hide it
    // from the start of a sequence until the reader next scrolls by hand.
    var hushed = false;
    var hushedAt = 0;
    var ours = false;

    function hush() {
      hushed = true;
      hushedAt = Date.now(); // a scroll event already queued isn't the reader's
      document.body.classList.add('zi-hc-hush');
    }

    window.addEventListener('scroll', function () {
      if (!hushed || ours || flow || Date.now() - hushedAt < 200) return;
      hushed = false;
      document.body.classList.remove('zi-hc-hush');
    }, { passive: true });

    // Scroll a section's heading to just under the sticky bars if it isn't
    // already in view, then call back once the scroll has settled.
    function reveal(section, always, then) {
      var r = section.querySelector('summary').getBoundingClientRect();
      var offset = stickyOffset(section);
      if (!always && r.top >= offset && r.bottom <= window.innerHeight) {
        then();
        return;
      }
      var calm = reduced();
      hush();
      ours = true;
      var target = Math.max(0, Math.min(window.pageYOffset + r.top - offset,
        document.documentElement.scrollHeight - window.innerHeight));
      window.scrollTo({ top: target, behavior: calm ? 'instant' : 'smooth' });
      // Its last scroll events can trail the settle by a frame or two.
      function settle() { setTimeout(function () { ours = false; }, 100); }
      if (calm) {
        settle();
        then();
        return;
      }
      var called = false;
      function once(e) {
        // A scrollend from an earlier, interrupted scroll can arrive first.
        if (called || (e && Math.abs(window.pageYOffset - target) > 2)) return;
        called = true;
        window.removeEventListener('scrollend', once);
        settle();
        then();
      }
      window.addEventListener('scrollend', once);
      setTimeout(once, 1200); // no scrollend in older Safari, or no scroll needed
    }

    function collapse(section, then) {
      var summary = section.querySelector('summary');
      var box = section.getBoundingClientRect();
      var to = summary.getBoundingClientRect().bottom - box.top +
        (parseFloat(getComputedStyle(section).borderBottomWidth) || 0);
      if (reduced() || !section.animate || box.height <= to) {
        section.open = false;
        then();
        return;
      }
      // Stop the browser scroll-anchoring against the shrink while it runs.
      root.style.overflowAnchor = 'none';
      section.style.overflow = 'hidden';
      section.style.boxSizing = 'border-box';
      var anim = section.animate([{ height: box.height + 'px' }, { height: to + 'px' }], {
        duration: 300,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)'
      });
      anim.onfinish = anim.oncancel = function () {
        section.open = false;
        section.style.overflow = '';
        section.style.boxSizing = '';
        root.style.overflowAnchor = '';
        then();
      };
    }

    function celebrate(f) {
      root.dispatchEvent(new CustomEvent('zi-hc:section-done', {
        bubbles: true,
        detail: {
          section: f.section,
          item: f.item,
          title: f.section.querySelector('.zi-hc-section__title').textContent.trim(),
          all: f.all
        }
      }));
    }

    function nextOpen(from) {
      var open = sections.filter(function (s) { return !s.hidden && !s.classList.contains('is-done'); });
      var after = open.filter(function (s) {
        return from.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING;
      });
      return after[0] || open[0] || null;
    }

    function finish(section, item) {
      if (flow) clearTimeout(flow.timer);
      var f = flow = {
        section: section,
        item: item,
        all: items.filter(applies).every(function (i) { return !!state.done[i.id]; }),
        focus: section.contains(document.activeElement),
        stage: 'beat',
        gen: gen
      };
      hush();
      f.timer = setTimeout(function () {
        f.stage = 'fold';
        collapse(section, function () {
          if (f.gen !== gen) return;
          // The focused checkbox is now folded away: hand focus to the heading.
          if (f.focus) section.querySelector('summary').focus({ preventScroll: true });
          reveal(section, false, function () {
            if (f.gen !== gen) return;
            celebrate(f);
            if (f.all || flow !== f) {
              if (flow === f) flow = null;
              return;
            }
            f.stage = 'party';
            f.timer = setTimeout(function () {
              if (flow !== f) return;
              flow = null;
              var next = nextOpen(section);
              if (!next) return;
              next.open = true;
              reveal(next, true, function () {});
              if (f.focus) next.querySelector('summary').focus({ preventScroll: true });
            }, reduced() ? 1000 : 1500);
          });
        });
      }, BEAT);
    }

    // A tap in the checklist mid-flow means the reader has taken over: in the
    // beat, nothing folds (but a still-finished section is still celebrated in
    // place); later, nothing else opens or scrolls. An untick is a click too,
    // and its change has run by the next task, so it gets no celebration.
    root.addEventListener('click', function () {
      var f = flow;
      if (!f) return;
      flow = null;
      if (f.stage !== 'beat') return;
      clearTimeout(f.timer);
      setTimeout(function () {
        if (f.gen === gen && f.section.classList.contains('is-done')) celebrate(f);
      }, 0);
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.model = chip.getAttribute('data-model');
        save(state);
        render();
        sync();
        var shown = items.filter(applies).length;
        say('Showing ' + shown + ' items for ' + chip.textContent + '.');
      });
    });

    root.querySelector('.zi-hc-reset').addEventListener('click', function () {
      if (!window.confirm('Start again? This clears every tick on this device.')) return;
      dropFlows();
      root.dispatchEvent(new CustomEvent('zi-hc:reset', { bubbles: true }));
      state.done = {};
      save(state);
      render();
      sections.forEach(function (s) { s.open = true; });
      var first = sections.filter(function (s) { return !s.hidden; })[0];
      if (first) reveal(first, true, function () {});
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
    // Coming back with saved progress: fold the finished sections so the page
    // opens on where the reader left off. No scrolling: a jump on load jars.
    sync();
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
