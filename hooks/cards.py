"""Make each content card with one obvious destination a single link.

A card (.z-card) whose only "more" link is its .go label gets that destination
on its heading instead, and the heading link stretches over the whole card in
CSS (zeekr.css, section 8). The .go label stays as the visible arrow cue but
becomes a plain span, so the card is one tab stop and one link to a screen
reader, as the front door's Insider cards are. Any other link in the card keeps
working and sits above the stretched link.

Cards with no .go link, or more than one, have no single destination and are
left alone, so nothing looks clickable that is not.

Authors keep writing cards as before; this runs on the rendered page body.
"""

from __future__ import annotations

import re

_OPEN = re.compile(r'<div class="(z-card\b[^"]*)"')
_DIV = re.compile(r"<(/?)div\b")
# Authors write class and href in either order.
_GO = re.compile(r'<a\b(?=[^>]*\bclass="go")[^>]*\bhref="([^"]+)"[^>]*>(.*?)</a>', re.S)
_H3 = re.compile(r"(<h3\b[^>]*>)(.*?)(</h3>)", re.S)


def _end(content: str, start: int) -> int:
    """Index just past the </div> that closes the card opened at start."""
    depth = 0
    for m in _DIV.finditer(content, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return content.index(">", m.end()) + 1
    return -1


def _card(card: str, classes: str) -> str:
    gos = _GO.findall(card)
    heading = _H3.search(card)
    if len(gos) != 1 or not heading or "<a " in heading.group(2):
        return card
    href = gos[0][0]
    card = card.replace(f'class="{classes}"', f'class="{classes} zi-card--link"', 1)
    card = _H3.sub(
        lambda m: f'{m.group(1)}<a class="zi-card__link" href="{href}">{m.group(2)}</a>{m.group(3)}',
        card,
        count=1,
    )
    return _GO.sub(lambda m: f'<span class="go" aria-hidden="true">{m.group(2)}</span>', card)


def on_page_content(content: str, page, config, files) -> str:
    if "z-card" not in content:
        return content
    out: list[str] = []
    pos = 0
    while m := _OPEN.search(content, pos):
        end = _end(content, m.start())
        if end < 0:
            break
        out.append(content[pos : m.start()])
        out.append(_card(content[m.start() : end], m.group(1)))
        pos = end
    out.append(content[pos:])
    return "".join(out)
