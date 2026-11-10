/* PostHog for the wiki, matching the club site's privacy posture (web-home/docs/analytics.md): cookieless, no
 * autocapture, no session recording, no person profiles, Do Not Track and Global Privacy Control respected. The SDK
 * comes through the club site's first-party proxy. Config arrives as data- attributes from mkdocs.yml extra.analytics. */
(function () {
  var tag = document.currentScript;
  if (!tag || !tag.dataset.key) return;

  // Dev visits (mkdocs serve) are not visitors. ?zi-analytics-test lets a test run opt back in.
  var h = location.hostname;
  var local = h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '' || /\.local$/.test(h);
  if (local && location.search.indexOf('zi-analytics-test') === -1) return;

  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;

  var host = tag.dataset.apiHost.replace(/\/$/, '');
  var queue = [];
  var ph = null;

  function track(event, props) {
    if (ph) ph.capture(event, props); else if (queue.length < 30) queue.push([event, props]);
  }

  // Query strings and fragments can carry personal details; only the path leaves the wiki.
  function stripUrl(v) {
    return typeof v === 'string' ? v.split('#')[0].split('?')[0] : v;
  }

  function init() {
    var p = window.posthog;
    if (!p || !p.init) return;
    p.init(tag.dataset.key, {
      api_host: host,
      ui_host: tag.dataset.uiHost,
      cookieless_mode: 'always',
      persistence: 'memory',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      person_profiles: 'identified_only',
      respect_dnt: true,
      before_send: function (e) {
        if (e && e.properties) {
          ['$current_url', '$referrer', '$initial_referrer', '$initial_current_url'].forEach(function (k) {
            if (k in e.properties) e.properties[k] = stripUrl(e.properties[k]);
          });
        }
        return e;
      }
    });
    p.register({ site: 'wiki' });
    ph = p;
    queue.forEach(function (q) { ph.capture(q[0], q[1]); });
    queue = [];
  }

  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = host + '/static/array.js';
    s.onload = init;
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') load(); else addEventListener('load', load, { once: true });

  // Links leaving the wiki. Only the destination without its query or fragment is sent, never link text typed by anyone.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !/^https?:$/.test(a.protocol) || a.hostname === location.hostname) return;
    var bare = a.hostname.replace(/^www\./, '');
    var source = bare === 'zeekrinsiders.com.au' ? 'website' : bare === 'forums.zeekrinsiders.com.au' ? 'forum' : 'other';
    track('outbound_click', {
      source: source,
      label: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      href: a.origin + a.pathname
    });
  }, true);

  // Section title only: no checklist state or answers.
  document.addEventListener('zi-hc:section-done', function (e) {
    var d = e.detail || {};
    if (d.title) track('checklist_section_done', { section: String(d.title) });
  });
})();
