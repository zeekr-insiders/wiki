/* The Handover checklist (the handover_checklist() macro, data/handover-checklist.yml).
 * Progressive: without this the page is a plain list of checkboxes that
 * prints. With it: ticks and choices are kept in this browser's localStorage
 * (never sent anywhere). A Model select hides items for other models and
 * years, a State select (first guessed from the time zone, or set by "Use my
 * location" against outlines inlined in the page) hides items for other
 * states, and Show switches between Essentials and Everything. Once set, the
 * toolbar folds to a one-line summary with Change and Restart. Each phase shows a
 * sticky progress bar led by the overall count. After the last phase, "Copy
 * what's left" copies the unticked items as plain text grouped by section, and
 * "Start again" (or Restart up top) clears every tick after a confirm. Printing opens
 * every section first. A tick that finishes a section folds it away, fires
 * zi-hc:section-done (detail: section, item, title, all) for
 * handover-celebrate.js from its heading, then opens the next unfinished one;
 * finished sections also start folded on load. "Start again" fires
 * zi-hc:reset so a running effect stops too. Runs only where the checklist is.
 */
(function () {
  var KEY = 'zi-handover:v1';

  // The picker's choices. A saved model that isn't one of them (a bare "7x"
  // or "x" from before the picker offered years) falls back to Any model
  // rather than hiding everything.
  var MODELS = ['all', '7x-my26', '7x-my27', 'x-my25', 'x-my26', '009', '7gt'];

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (state && typeof state === 'object') {
        return {
          done: state.done || {},
          model: MODELS.indexOf(state.model) >= 0 ? state.model : 'all',
          region: REGIONS.indexOf(state.region) >= 0 ? state.region : null,
          // First visit: Essentials (`express`). A reader who ticked items before the
          // views existed was using the full list, so they keep Everything (`full`).
          view: state.view === 'express' || state.view === 'full' ? state.view
            : (Object.keys(state.done || {}).length ? 'full' : 'express'),
          // The reader has chosen something or ticked an item: the toolbar folds.
          set: !!state.set || Object.keys(state.done || {}).length > 0 || (state.model && state.model !== 'all')
        };
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return { done: {}, model: 'all', region: null, view: 'express', set: false };
  }

  var REGIONS = ['all', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

  // A first guess at the reader's state from the time zone their device is
  // set to, so nothing is asked of them. Canberra shares Sydney's zone, so the
  // ACT can't be told apart and guesses NSW; Broken Hill keeps South
  // Australian time but is in NSW.
  var ZONES = {
    Sydney: 'NSW', ACT: 'NSW', Canberra: 'NSW', NSW: 'NSW', Broken_Hill: 'NSW', Yancowinna: 'NSW', Lord_Howe: 'NSW', LHI: 'NSW',
    Melbourne: 'VIC', Victoria: 'VIC',
    Brisbane: 'QLD', Lindeman: 'QLD', Queensland: 'QLD',
    Adelaide: 'SA', South: 'SA',
    Perth: 'WA', West: 'WA', Eucla: 'WA',
    Hobart: 'TAS', Tasmania: 'TAS', Currie: 'TAS',
    Darwin: 'NT', North: 'NT'
  };

  function guessRegion() {
    try {
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var m = /^Australia\/(.+)$/.exec(zone);
      return (m && ZONES[m[1]]) || null;
    } catch (e) { return null; }
  }

  // Ray casting over the bundled outlines (data/au-states.geojson, inlined
  // by the macro). The ACT comes first in the file so it wins over NSW.
  function inside(lon, lat, ring) {
    var c = false;
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  // Which app store the reader's device uses, from what the browser already
  // knows: Client Hints where offered, else the user agent. iPadOS asks for
  // the desktop site and reports as a Mac, but a Mac has no touch points.
  // Anything else (desktop, unknown) gets null, and both stores show.
  function storePlatform() {
    var hint = (navigator.userAgentData && navigator.userAgentData.platform) || '';
    var ua = navigator.userAgent || '';
    if (/android/i.test(hint) || /Android/.test(ua)) return 'android';
    if (/^i(OS|PadOS)$/i.test(hint) || /iPhone|iPad|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    return null;
  }

  function regionAt(geo, lon, lat) {
    var hit = null;
    (geo.features || []).some(function (f) {
      if (inside(lon, lat, f.geometry.coordinates[0])) hit = f.properties.state;
      return !!hit;
    });
    return hit;
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
    // The actions and their messages sit after the checklist, outside .zi-hc.
    var end = document.querySelector('.zi-hc-end');
    var status = end.querySelector('.zi-hc-status');
    var modelSelect = root.querySelector('#zi-hc-model');
    var viewRadios = Array.prototype.slice.call(root.querySelectorAll('input[name="zi-hc-view"]'));
    var stateSelect = root.querySelector('#zi-hc-state');
    var stateHelp = root.querySelector('#zi-hc-state-help');
    var locate = root.querySelector('.zi-hc-locate');
    var bar = root.querySelector('.zi-hc-bar');
    var summary = root.querySelector('.zi-hc-summary');
    var summaryText = root.querySelector('.zi-hc-summary__text');
    var change = root.querySelector('.zi-hc-change');
    // state.region is only what the reader chose; a time-zone guess is shown
    // but not saved, so it can never stick as if they had picked it.
    var guessed = state.region ? null : guessRegion();
    var region = state.region || guessed || 'all';
    var phases = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-phase'));
    var sections = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-section'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.zi-hc-item')).map(function (el) {
      var box = el.querySelector('input[type="checkbox"]');
      return {
        el: el,
        box: box,
        id: box.getAttribute('data-id'),
        models: (el.getAttribute('data-models') || 'all').split(' '),
        states: (el.getAttribute('data-states') || '').split(' ').filter(Boolean),
        express: el.hasAttribute('data-express'),
        tagRow: el.querySelector('.zi-hc-tags'),
        text: el.querySelector('.zi-hc-text').textContent.trim()
      };
    });

    tools.hidden = false;
    end.hidden = false;
    phases.forEach(function (p) {
      p.querySelector('.zi-hc-progress').hidden = false;
    });

    // The picker names a year ("7x-my27"); an item applies if it is tagged
    // for every model, for that year, or for the model in every year ("7x").
    function applies(item) {
      if (state.view === 'express' && !item.express) return false;
      return fits(item);
    }

    // Model and state only: what the Essentials and Everything counts are of.
    function fits(item) {
      if (region !== 'all' && item.states.length && item.states.indexOf(region) < 0) return false;
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
        // Tags only where they narrow further: a chosen model already satisfies
        // every model tag on a shown item, and a chosen state every state tag.
        if (item.tagRow) {
          var left = 0;
          Array.prototype.forEach.call(item.tagRow.children, function (t) {
            var isState = t.classList.contains('zi-hc-tag--state');
            t.hidden = isState ? region !== 'all' : state.model !== 'all';
            if (!t.hidden) left++;
          });
          item.tagRow.hidden = !left;
        }
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
      modelSelect.value = state.model;
      viewRadios.forEach(function (r) { r.checked = r.value === state.view; });
      stateSelect.value = region;
      var fitting = items.filter(fits);
      viewCounts.express = fitting.filter(function (i) { return i.express; }).length;
      viewCounts.full = fitting.length;
      Array.prototype.forEach.call(root.querySelectorAll('.zi-hc-view__count'), function (c) {
        // A no-break space: an ordinary one would collapse at the edge of the flex label.
        c.textContent = '\u00a0(' + viewCounts[c.getAttribute('data-view')] + ')';
      });
      summaryText.textContent = choices();
    }

    var viewCounts = { express: 0, full: 0 };

    // The reader's choices in words: "7X MY27 · VIC · Essentials (26)".
    function choices() {
      var model = state.model === 'all' ? 'Any model' : modelSelect.options[modelSelect.selectedIndex].text;
      var place = region === 'all' ? 'Any state' : region;
      var view = state.view === 'express' ? 'Essentials' : 'Everything';
      return model + ' \u00b7 ' + place + ' \u00b7 ' + view + ' (' + viewCounts[state.view] + ')';
    }

    // Messages clear after a few seconds unless they matter longer (`keep`).
    function say(text, keep) {
      status.textContent = text;
      if (keep) return;
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
    // Model or State select changes which items count.
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

    // Essentials (`express`) or Everything (`full`). Ticks are shared:
    // switching only changes which items count, so progress, folding, the
    // finale and "Copy what's left" all follow the view. The counts on the
    // two options say what changed, so there is no status message.
    viewRadios.forEach(function (r) {
      r.addEventListener('change', function () {
        if (!r.checked) return;
        state.view = r.value;
        save(state);
        render();
        sync();
      });
    });

    modelSelect.addEventListener('change', function () {
      state.model = modelSelect.value;
      save(state);
      render();
      sync();
    });

    // Help under State: the guess, a location result or why it failed. It
    // clears once the reader picks.
    function help(text) {
      stateHelp.textContent = text || '';
    }

    function setRegion(r, note) {
      region = r;
      state.region = r;
      guessed = null;
      help(note);
      save(state);
      render();
      sync();
    }

    stateSelect.addEventListener('change', function () {
      setRegion(stateSelect.value);
    });

    if (guessed) help('Guessed from your time zone');

    // "Use my location": the browser asks first, and the answer is matched to
    // a state right here against the outlines in the page. Nothing is sent.
    // The pin says busy while it waits and stays marked if location is blocked.
    var geoEl = document.getElementById('zi-hc-geo');
    var geo = null;
    try { geo = geoEl ? JSON.parse(geoEl.textContent) : null; } catch (e) { geo = null; }
    if (geo && navigator.geolocation) {
      locate.hidden = false;
      var busy = false;
      var setBusy = function (on) {
        busy = on;
        locate.setAttribute('aria-busy', on ? 'true' : 'false');
        locate.classList.toggle('is-busy', on);
      };
      locate.addEventListener('click', function () {
        if (busy) return;
        setBusy(true);
        locate.classList.remove('is-denied');
        help('Finding your location (it stays on this device)');
        navigator.geolocation.getCurrentPosition(function (pos) {
          setBusy(false);
          var hit = regionAt(geo, pos.coords.longitude, pos.coords.latitude);
          if (hit) {
            setRegion(hit, 'Set from your location');
          } else {
            help('That location is not in an Australian state. Pick your state.');
            stateSelect.focus();
          }
        }, function () {
          setBusy(false);
          locate.classList.add('is-denied');
          locate.title = 'Use my location (unavailable or blocked)';
          help('Location blocked. Pick your state.');
          stateSelect.focus();
        }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
      });
    }

    // Store icons: show only the reader's store. `hidden` takes the other out
    // of the accessibility tree too.
    var store = storePlatform();
    if (store) {
      Array.prototype.forEach.call(root.querySelectorAll('.zi-hc-store[data-store]'), function (a) {
        a.hidden = a.getAttribute('data-store') !== store;
      });
    }

    // "Start again" at the end and "Restart" on the toolbar's summary line.
    function restart() {
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
    }
    end.querySelector('.zi-hc-reset').addEventListener('click', restart);
    root.querySelector('.zi-hc-restart').addEventListener('click', restart);

    function leftText() {
      // Say what the list was made for, so a copy pasted to the dealer makes sense on its own.
      var lines = ['Zeekr handover: still to do', 'For: ' + choices(), ''];
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

    end.querySelector('.zi-hc-copy').addEventListener('click', function () {
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

    /* The toolbar folds to one line ("7X MY27 · VIC · Essentials (26)" and a
     * Change button) once the reader has set it up: on later visits, and on
     * a first visit after their first tick if the bar has scrolled out of
     * view (folding it in view would jolt the page). Choosing something on a
     * first visit shows the summary with a Done button, so they can fold it
     * themselves. */
    function fold(closed, focus) {
      bar.hidden = closed;
      summary.hidden = false;
      change.setAttribute('aria-expanded', closed ? 'false' : 'true');
      change.textContent = closed ? 'Change' : 'Done';
      if (focus && !closed) modelSelect.focus();
    }

    function chose() {
      if (state.set) return;
      state.set = true;
      save(state);
      if (summary.hidden) fold(false);
    }

    change.addEventListener('click', function () {
      fold(!bar.hidden, true);
    });

    [modelSelect, stateSelect].concat(viewRadios).forEach(function (el) {
      el.addEventListener('change', chose);
    });
    locate.addEventListener('click', chose);

    root.addEventListener('change', function (e) {
      if (!e.target.matches || !e.target.matches('.zi-hc-item input[type="checkbox"]') || state.set) return;
      chose();
      if (tools.getBoundingClientRect().bottom < 0) fold(true);
    });

    render();
    if (state.set) fold(true);
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
