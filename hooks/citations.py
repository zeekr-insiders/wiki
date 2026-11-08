"""Turn Python-Markdown footnotes into labelled citations.

Pages cite sources as footnotes ([^1]) and define them under "## Sources" as
publisher, "title", <url>, accessed date. The footnotes extension renders bare
numbers, so this hook adds what a reader needs from them:

- each marker gets an aria-label ("Source 1: CarExpert, 2027 Zeekr 7X ...") and
  the source's label and URL as data attributes, which javascripts/zeekr.js
  turns into the hover/focus tooltip and the Ctrl/Cmd-click shortcut;
- each Sources entry's return arrows become a single visible "Back to text" link.

It runs on the rendered page body, before the minifier, so the markup it reads
is Python-Markdown's own and stable.
"""

from __future__ import annotations

import html
import re

_ITEM = re.compile(r'<li id="fn:([^"]+)">(.*?)</li>', re.S)
_REF = re.compile(r'<a\b[^>]*\bclass="footnote-ref"[^>]*>')
_BACK = re.compile(r'(?:&#160;|\xa0)?<a\b[^>]*\bclass="footnote-backref"[^>]*>.*?</a>', re.S)
_HREF = re.compile(r'\bhref="([^"]*)"')
_TAG = re.compile(r"<[^>]+>")


def _source(inner: str) -> tuple[str, str]:
    """The entry's label (publisher and title) and the first external URL."""
    url = ""
    cut = len(inner)
    for m in re.finditer(r'<a\b[^>]*>', inner):
        href = _HREF.search(m.group(0))
        if href and href.group(1).startswith(("http://", "https://")):
            url = html.unescape(href.group(1))
            cut = m.start()
            break
    label = html.unescape(_TAG.sub("", inner[:cut])).strip().rstrip(",").strip()
    return label, url


def _backlink(num: int, inner: str) -> str:
    """One "Back to text" link in place of the extension's arrow, or one arrow per citation.

    It points at the first citation; javascripts/zeekr.js retargets it to whichever
    citation the reader followed, so a source cited many times stays one tidy link.
    """
    first = _BACK.search(inner)
    if not first:
        return inner
    href = _HREF.search(first.group(0)).group(1)
    link = (
        f' <a class="footnote-backref" href="{href}" '
        f'aria-label="Back to text, where source {num} is cited">Back to text</a>'
    )
    return inner[: first.start()] + link + _BACK.sub("", inner[first.end():])


def on_page_content(content: str, page, config, files) -> str:
    if 'class="footnote-ref"' not in content and 'class="footnote"' not in content:
        return content

    sources: dict[str, tuple[int, str, str]] = {}

    def item(m: re.Match[str]) -> str:
        fid, inner = m.group(1), m.group(2)
        num = len(sources) + 1
        label, url = _source(inner)
        sources[fid] = (num, label, url)
        return f'<li id="fn:{fid}">{_backlink(num, inner)}</li>'

    content = _ITEM.sub(item, content)

    def ref(m: re.Match[str]) -> str:
        tag = m.group(0)
        href = _HREF.search(tag).group(1)
        found = sources.get(href.removeprefix("#fn:"))
        if not found:
            return tag
        num, label, url = found
        # Quotes around the title read badly aloud, so the spoken label drops them.
        spoken = re.sub(r'["“”]', "", label)
        attrs = [
            'class="footnote-ref"',
            f'href="{href}"',
            f'aria-label="{html.escape(f"Source {num}: {spoken}")}"',
            f'data-zi-cite="{html.escape(label)}"',
        ]
        if url:
            attrs.append(f'data-zi-href="{html.escape(url)}"')
        return "<a " + " ".join(attrs) + ">"

    return _REF.sub(ref, content)
