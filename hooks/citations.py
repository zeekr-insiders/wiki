"""Turn Python-Markdown footnotes into labelled citations.

Pages cite sources as footnotes ([^1]) and define them under "## Sources" as
publisher, "title", <url>, accessed date. The footnotes extension renders bare
numbers, so this hook adds what a reader needs from them:

- each marker gets an aria-label ("Source 1: CarExpert, 2027 Zeekr 7X ...") and
  the source's label and URL as data attributes, which javascripts/zeekr.js
  turns into the hover/focus tooltip and the Ctrl/Cmd-click shortcut;
- the footnotes extension's return arrows go: readers rarely used them, and the
  browser's Back does the same job;
- the "## Sources" section becomes a collapsed <details> panel labelled with
  its count ("Sources · 6") and a one-line note that stays visible when shut,
  and it leaves the "On this page" list. zeekr.js opens it when a citation is
  followed or the page loads on a #fn: link.

It runs on the rendered page body, before the minifier, so the markup it reads
is Python-Markdown's own and stable.
"""

from __future__ import annotations

import html
import pathlib
import re

# The panel's toggle draws Lucide's chevron-down (ISC, vendored with its licence).
_CHEVRON_SVG = pathlib.Path(__file__).parent.parent / "overrides" / ".icons" / "lucide" / "chevron-down.svg"

_ITEM = re.compile(r'<li id="fn:([^"]+)">(.*?)</li>', re.S)
_REF = re.compile(r'<a\b[^>]*\bclass="footnote-ref"[^>]*>')
_BACK = re.compile(r'(?:&#160;|\xa0)?<a\b[^>]*\bclass="footnote-backref"[^>]*>.*?</a>', re.S)
_SOURCES = re.compile(r'<h2 id="sources">.*?</h2>', re.S)
_HREF = re.compile(r'\bhref="([^"]*)"')
_TAG = re.compile(r"<[^>]+>")
_GAP = re.compile(r'[ \t\n]+(<sup id="fnref)')


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


def _drop_toc(items, anchor: str) -> None:
    """Remove the heading with this id from the page's ToC, at any depth."""
    for item in list(items):
        if item.id == anchor:
            items.remove(item)
        else:
            _drop_toc(item.children, anchor)


def _chevron() -> str:
    svg = _CHEVRON_SVG.read_text(encoding="utf-8")
    svg = " ".join(svg[svg.index("<svg"):].split())
    return svg.replace('class="lucide lucide-chevron-down"', 'class="zi-sources__chevron" focusable="false"', 1)


def _panel(content: str, count: int) -> str:
    """Fold the Sources heading and everything after it into a closed panel.

    Sources is always the last section (scripts/check_citations.py holds pages
    to that), so the panel runs to the end of the page body.
    """
    m = _SOURCES.search(content)
    if not m:
        return content
    summary = (
        # The dot is decoration; a screen reader hears "Sources 6".
        '<summary class="zi-sources__summary"><span class="zi-sources__label">Sources '
        f'<span class="zi-sources__count"><span aria-hidden="true">&middot; </span>{count}</span></span>'
        '<span class="zi-sources__note">Everything on this page is sourced from the links below.</span>'
        # A visible Show/Hide and chevron for sighted readers; the summary's
        # own expanded state is what assistive technology announces.
        '<span class="zi-sources__toggle" aria-hidden="true">'
        '<span class="zi-sources__show">Show</span><span class="zi-sources__hide">Hide</span>'
        f"{_chevron()}</span>"
        "</summary>"
    )
    body = content[m.end():].strip()
    # The wrapper carries the divider and the space that set the panel apart from the article.
    return (
        content[: m.start()]
        + f'<div class="zi-sources-wrap"><details class="zi-sources" id="sources">{summary}\n{body}\n</details></div>'
    )


def on_page_content(content: str, page, config, files) -> str:
    if 'class="footnote-ref"' not in content and 'class="footnote"' not in content:
        return content

    sources: dict[str, tuple[int, str, str]] = {}

    def item(m: re.Match[str]) -> str:
        fid, inner = m.group(1), m.group(2)
        num = len(sources) + 1
        label, url = _source(inner)
        sources[fid] = (num, label, url)
        return f'<li id="fn:{fid}">{_BACK.sub("", inner)}</li>'

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

    content = _REF.sub(ref, content)
    # Pages write "text [1]" with a space, which would let a superscript wrap
    # onto a line of its own. A superscript hugs the word it cites.
    content = _GAP.sub(r"\1", content)
    if sources and page.toc:
        _drop_toc(page.toc.items, "sources")
    return _panel(content, len(sources))
