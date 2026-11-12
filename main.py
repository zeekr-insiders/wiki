"""mkdocs-macros for the wiki: card icons, spec cards, click-to-load videos, the
glossary and the Handover checklist (AGENTS.md describes each)."""

import html
import json
import re

from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml

_LUCIDE = Path(__file__).parent / "overrides" / ".icons" / "lucide"


def _lucide(name: str, cls: str = "zi-spec-card__icon") -> str:
    """A vendored Lucide icon (ISC, overrides/.icons/lucide) as inline SVG.

    Inline so it takes currentColor from the card; the licence comment is
    dropped from each copy because LICENSE-lucide.txt sits beside the files.
    Decorative: the card's text always names what the icon shows.
    """
    svg = (_LUCIDE / f"{name}.svg").read_text(encoding="utf-8")
    svg = svg[svg.index("<svg"):]
    svg = " ".join(svg.split())
    return svg.replace(
        f'class="lucide lucide-{name}"',
        f'class="{cls}" aria-hidden="true" focusable="false"',
        1,
    )


def define_env(env):
    """
    Define custom macros for MkDocs
    """

    @env.macro
    def youtube(video_id: str, title: str, channel: str, channel_url: str) -> str:
        """A click-to-load YouTube video (README, "Videos").

        Until the reader presses play the page shows only a local poster
        (content/assets/images/video/<id>.webp, 1280 x 720), so nothing is requested from
        YouTube and no cookie is set. zeekr.js then swaps in the
        youtube-nocookie.com player. One line of HTML, so it can sit in
        Markdown on its own line.
        """
        depth = env.page.url.strip("/").count("/") + 1 if env.page.url.strip("/") else 0
        poster = "../" * depth + f"assets/images/video/{video_id}.webp"
        watch = f"https://www.youtube.com/watch?v={video_id}"
        safe = html.escape(title, quote=True)
        return (
            f'<figure class="zi-video"><div class="zi-video__frame" data-zi-video="{video_id}" data-zi-title="{safe}">'
            f'<img src="{poster}" alt="" width="1280" height="720" loading="lazy" decoding="async">'
            f'<button type="button" class="zi-video__play" aria-label="Play video: {safe} (loads YouTube)">'
            f'<span class="zi-video__mark">{_lucide("play", "zi-video__icon")}</span></button></div>'
            f'<figcaption>Video: <a href="{channel_url}">{html.escape(channel)}</a> on YouTube. '
            f'<a href="{watch}">Watch on YouTube</a></figcaption></figure>'
        )

    @env.macro
    def card_icon(icon: str) -> str:
        """The icon at the top of a section card (home Start here, section indexes)."""
        return _lucide(icon, "zi-card-icon")

    @env.macro
    def spec_card(icon: str, label: str, value: str, detail: str = "") -> str:
        """One spec summary card for a .zi-spec-grid (see README, "Spec cards").

        icon is a file name in overrides/.icons/lucide; value never wraps, so
        "2,000 kg" stays on one line. Returns one line of HTML, so it can sit
        inside a raw HTML block without a blank line ending the block.
        """
        parts = [
            '<div class="zi-spec-card">',
            _lucide(icon),
            f'<span class="zi-spec-card__label">{label}</span>',
            f'<span class="zi-spec-card__value">{value}</span>',
        ]
        if detail:
            parts.append(f'<span class="zi-spec-card__detail">{detail}</span>')
        parts.append("</div>")
        return "".join(parts)

    @env.macro
    def glossary() -> str:
        """The Glossary page body, from data/glossary.yml (README, "Glossary").

        Terms are sorted A to Z into letter groups, each an h2 with the term's id
        as its anchor, so Material's search indexes every term (and its aliases,
        in the text under it) and lands on it. The filter, chips and copy-link
        buttons are progressive: they ship hidden and javascripts/glossary.js
        reveals them, so without JS the page is the plain list with an A to Z
        bar of anchor links. Footnote keys in definitions become the page's
        Sources, numbered in reading order.
        """
        data = yaml.safe_load((Path(__file__).parent / "data" / "glossary.yml").read_text(encoding="utf-8"))
        cats = data["categories"]
        sources = data.get("sources") or {}
        terms = sorted(data["terms"], key=lambda t: t["term"].casefold())
        ids = [t["id"] for t in terms]
        if len(ids) != len(set(ids)):
            raise ValueError("data/glossary.yml: duplicate term id")

        def letter(term: str) -> str:
            c = term[0].upper()
            return c if c.isalpha() else "#"

        def letter_id(c: str) -> str:
            return "letter-0-9" if c == "#" else f"letter-{c.lower()}"

        groups: Dict[str, List[Dict[str, Any]]] = {}
        for t in terms:
            groups.setdefault(letter(t["term"]), []).append(t)
        alphabet = ["#"] + [chr(c) for c in range(ord("A"), ord("Z") + 1)]

        esc = html.escape
        letters = "".join(
            f'<a href="#{letter_id(c)}" data-letter="{letter_id(c)}">{"0-9" if c == "#" else c}</a>' if c in groups
            else f'<span class="is-empty" aria-hidden="true">{"0-9" if c == "#" else c}</span>'
            for c in alphabet)
        chips = "".join(f'<button type="button" class="zi-chip" data-cat="{k}" aria-pressed="false">{esc(v)}</button>'
                        for k, v in cats.items())
        bar = ['<div class="zi-gloss-chips" role="group" aria-label="Filter by category" hidden>'
               '<button type="button" class="zi-chip" data-cat="" aria-pressed="true">All</button>' + chips + '</div>',
               # Only the search and the letters stick on wide screens; the chips would crowd the page.
               '<div class="zi-gloss-bar">',
               '<div class="zi-gloss-search" hidden>',
               '<label class="zi-gloss-search__label" for="zi-gloss-q">Filter the glossary</label>',
               '<div class="zi-gloss-search__field">' + _lucide("search", "zi-gloss-search__icon")
               + '<input id="zi-gloss-q" class="zi-gloss-search__input" type="search" autocomplete="off" spellcheck="false" '
               'placeholder="Try SOC, regen or LCT" aria-describedby="zi-gloss-count">'
               '<button type="button" class="zi-gloss-clear" hidden>' + _lucide("x", "zi-gloss-clear__icon")
               + '<span>Clear</span></button></div>',
               '</div>',
               '<div class="zi-gloss-az-row"><nav class="zi-gloss-az" aria-label="Jump to a letter">' + letters + '</nav>'
               '<p class="zi-gloss-count" id="zi-gloss-count" aria-live="polite" hidden></p></div>',
               '</div>',
               '<p class="zi-gloss-empty" hidden>No terms match. <button type="button" class="zi-gloss-reset">Clear the filter</button></p>',
               '<template id="zi-gloss-link-icon">' + _lucide("link", "zi-term__copy-icon") + '</template>']

        used: List[str] = []
        out = ['<div class="zi-gloss" markdown>', "", "\n".join(bar), ""]
        for c in alphabet:
            if c not in groups:
                continue
            label = "0-9" if c == "#" else c
            out += [f'<section class="zi-gloss-group" markdown>', "",
                    f'<p class="zi-gloss-letter" id="{letter_id(c)}">{label}</p>', ""]
            for t in groups[c]:
                if t["category"] not in cats:
                    raise ValueError(f"data/glossary.yml: {t['id']} has unknown category {t['category']}")
                definition = " ".join(str(t["definition"]).split())
                for key in re.findall(r"\[\^([^\]]+)\]", definition):
                    if key not in sources:
                        raise ValueError(f"data/glossary.yml: {t['id']} cites [^{key}], which is not in sources")
                    if key not in used:
                        used.append(key)
                aka = t.get("aka") or []
                meta = f'<span class="zi-term__cat">{esc(cats[t["category"]])}</span>'
                if aka:
                    meta += " Also called " + ", ".join(esc(a) for a in aka) + "."
                names = "|".join([t["term"]] + [str(a) for a in aka])
                out += [f'<div class="zi-term" data-cat="{t["category"]}" data-names="{esc(names.lower(), quote=True)}" markdown>', "",
                        f'## {t["term"]} {{ #{t["id"]} }}', "",
                        meta, '{: .zi-term__meta }', "",
                        definition, ""]
                see = t.get("see") or []
                if see:
                    links = " &middot; ".join(f'[{s["label"]}](../{s["page"]})' for s in see)
                    out += [f"See: {links}", "{: .zi-term__see }", ""]
                out += ["</div>", ""]
            out += ["</section>", ""]
        out += ["</div>", ""]
        if used:
            out += ["## Sources", ""] + [f"[^{k}]: {sources[k]}" for k in used] + [""]
        return "\n".join(out)

    @env.macro
    def handover_checklist(lead: Optional[List[str]] = None) -> str:
        """The Handover checklist, from data/handover-checklist.yml (AGENTS.md, "Handover checklist").

        Each phase is an h2 with a progress bar, each section a collapsible
        <details>, each item a real checkbox with its hint, link and footnotes.
        javascripts/handover.js adds the model picker, progress, saved ticks,
        "Copy what's left" and "Start again"; without it the page is a plain,
        printable list. The page's Sources are built from the keys items cite,
        in reading order, after any `lead` keys the page's own text cites first.
        """
        data = yaml.safe_load((Path(__file__).parent / "data" / "handover-checklist.yml").read_text(encoding="utf-8"))
        sources = data["sources"]
        esc = html.escape
        ids = [i["id"] for i in data["items"]]
        if len(ids) != len(set(ids)):
            raise ValueError("data/handover-checklist.yml: duplicate item id")
        # A bare model tag ("7x") covers every year of it; a year tag narrows it.
        tags = {"7x": "7X", "7x-my26": "7X MY25/26", "7x-my27": "7X MY27",
                "x": "X", "x-my25": "X MY25", "x-my26": "X MY26", "009": "009"}
        # The picker offers years, not bare models: the cars differ too much between years.
        models = [("all", "All models"), ("7x-my26", "7X MY25/26"), ("7x-my27", "7X MY27"),
                  ("x-my25", "X MY25"), ("x-my26", "X MY26"), ("009", "009")]
        states = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]
        club = env.variables["extra"]["club"]
        used: List[str] = list(lead or [])

        def link(l: Dict[str, str]) -> str:
            # `club` names a link in extra.club (forum_url, contact_url), so club links live in mkdocs.yml only.
            if l.get("club"):
                return f"[{l['label']}]({club[l['club']]})"
            page = l["page"]
            target = page if page.startswith("#") else "../" + page
            return f"[{l['label']}]({target})"

        out = ['<div class="zi-hc" markdown>', "",
               '<div class="zi-hc-tools" hidden>'
               '<div class="zi-hc-models" role="group" aria-labelledby="zi-hc-models-label">'
               '<span class="zi-hc-tools__label" id="zi-hc-models-label">Show items for</span>'
               + "".join(f'<button type="button" class="zi-chip" data-model="{k}" aria-pressed="{str(k == "all").lower()}">{v}</button>'
                         for k, v in models)
               + '</div>'
               '<div class="zi-hc-states" role="group" aria-labelledby="zi-hc-states-label">'
               '<span class="zi-hc-tools__label" id="zi-hc-states-label">Your state</span>'
               '<button type="button" class="zi-chip" data-state="all" aria-pressed="true">All states</button>'
               + "".join(f'<button type="button" class="zi-chip" data-state="{s}" aria-pressed="false">{s}</button>'
                         for s in states)
               + '<button type="button" class="zi-hc-button zi-hc-locate" hidden>'
               + _lucide("map-pin", "zi-hc-locate__icon") + '<span>Use my location</span></button>'
               '<p class="zi-hc-state-note" aria-live="polite"></p>'
               '</div>'
               '<div class="zi-hc-actions">'
               '<button type="button" class="zi-hc-button zi-hc-copy">Copy what\'s left</button>'
               '<button type="button" class="zi-hc-button zi-hc-reset">Start again</button>'
               '</div>'
               '<p class="zi-hc-status" role="status" aria-live="polite"></p>'
               '</div>', ""]
        for phase in data["phases"]:
            out += [f'<section class="zi-hc-phase" data-phase="{phase["id"]}" markdown>', "",
                    f'## {phase["title"]} {{ #{phase["id"]} }}', "",
                    '<div class="zi-hc-progress" hidden aria-hidden="true">'
                    '<div class="zi-hc-progress__text"><span class="zi-hc-progress__phase"></span>'
                    '<span class="zi-hc-progress__overall"></span></div>'
                    '<div class="zi-hc-progress__track"><i></i></div></div>', ""]
            for section in [s for s in data["sections"] if s["phase"] == phase["id"]]:
                out += [f'<details class="zi-hc-section" id="{section["id"]}" open markdown>',
                        f'<summary class="zi-hc-section__summary"><span class="zi-hc-section__title">{esc(section["title"])}</span>'
                        '<span class="zi-hc-section__count"></span></summary>', ""]
                for item in [i for i in data["items"] if i["section"] == section["id"]]:
                    item_models = [m.lower() for m in item.get("models") or ["all"]]
                    for m in item_models:
                        if m != "all" and m not in tags:
                            raise ValueError(f"data/handover-checklist.yml: {item['id']} has unknown model {m}")
                    tag = "".join(f'<span class="zi-hc-tag">{tags[m]}</span>' for m in item_models if m in tags)
                    # No `states` means every state. Tagged items keep their tags without JS, so a
                    # printed or script-free list still says where each one applies.
                    item_states = [s.upper() for s in item.get("states") or []]
                    for s in item_states:
                        if s not in states:
                            raise ValueError(f"data/handover-checklist.yml: {item['id']} has unknown state {s}")
                    tag += "".join(f'<span class="zi-hc-tag zi-hc-tag--state">{s}</span>' for s in item_states)
                    hint = esc(str(item.get("hint") or "")).strip()
                    for key in item.get("cite") or []:
                        if key not in sources:
                            raise ValueError(f"data/handover-checklist.yml: {item['id']} cites unknown source {key}")
                        if key not in used:
                            used.append(key)
                    cites = "".join(f"[^{k}]" for k in item.get("cite") or [])
                    extra = (" " + link(item["link"]) + ".") if item.get("link") else ""
                    out += [f'<div class="zi-hc-item" data-models="{" ".join(item_models)}" '
                            f'data-states="{" ".join(item_states)}" markdown>',
                            f'<label class="zi-hc-check"><input type="checkbox" name="{item["id"]}" data-id="{item["id"]}">'
                            f'<span class="zi-hc-text">{tag}{esc(item["text"])}</span></label>']
                    if hint or cites or extra:
                        out.append(f'<p class="zi-hc-hint" markdown="span">{hint}{cites}{extra}</p>')
                    out += ["</div>", ""]
                out += ["</details>", ""]
            out += ["</section>", ""]
        out += ["</div>", ""]
        # The state outlines ride inside the page so "Use my location" needs no request:
        # the position is matched here, in the browser, and never leaves the device.
        geo = json.loads((Path(__file__).parent / "data" / "au-states.geojson").read_text(encoding="utf-8"))
        geo.pop("_comment", None)
        out += ['<script type="application/json" id="zi-hc-geo">'
                + json.dumps(geo, separators=(",", ":")).replace("</", "<\\/") + "</script>", ""]
        if used:
            out += ["## Sources", ""] + [f"[^{k}]: {sources[k]}" for k in used] + [""]
        return "\n".join(out)
