"""Check every citation in the built site resolves, both ways.

For each page: every superscript points at a Sources entry that exists, every
entry is cited at least once, each marker carries an aria-label, the entries
sit inside the collapsed Sources panel (hooks/citations.py) whose label counts
them, no footnote return arrow is left, no plain "[1]" citation text is
left over from before the footnote conversion, and no entry cites the club's
private research (club-docs, the internal fact sheet): readers can't open it,
so cite the public sources it relies on instead.

Usage: python scripts/check_citations.py [site_dir]   (default: site)
"""

from __future__ import annotations

import pathlib
import re
import sys
from html.parser import HTMLParser

_LEFTOVER = re.compile(r"\[\d+\]")
# The club's internal research is private. A government "fact sheet" is fine;
# the club's own one is not.
_PRIVATE = re.compile(
    r"club-docs|wiki sourced fact sheet|club's fact sheet"
    r"|zeekr insiders,?\s+(?:[\"\u201c][^\"\u201d]*[\"\u201d]\s+)?fact sheet",
    re.I,
)


class _Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.refs: list[tuple[str, str | None]] = []  # (href, aria-label)
        self.entries: list[str] = []
        self.backrefs = 0
        self.leftovers: list[str] = []
        self._skip = 0  # inside <code>, <pre>, <script> or <style>
        self.panels = 0
        self._panel = 0  # <details> depth inside the Sources panel
        self.outside: list[str] = []  # entries not in the panel
        self._count = 0  # <span> depth inside the panel's count
        self.count = ""
        self._entry: str | None = None  # the Sources entry being read
        self.texts: dict[str, str] = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag in ("code", "pre", "script", "style"):
            self._skip += 1
        cls = (a.get("class") or "").split()
        if tag == "details" and ("zi-sources" in cls or self._panel):
            self.panels += not self._panel
            self._panel += 1
        if tag == "span" and (self._count or "zi-sources__count" in cls):
            self._count += 1
        if tag == "a" and "footnote-ref" in cls:
            self.refs.append((a.get("href", ""), a.get("aria-label")))
        if tag == "a" and "footnote-backref" in cls:
            self.backrefs += 1
        if tag == "li" and a.get("id", "").startswith("fn:"):
            self.entries.append(a["id"])
            self._entry = a["id"]
            self.texts[a["id"]] = ""
            if not self._panel:
                self.outside.append(a["id"])

    def handle_endtag(self, tag):
        if tag in ("code", "pre", "script", "style") and self._skip:
            self._skip -= 1
        if tag == "details" and self._panel:
            self._panel -= 1
        if tag == "span" and self._count:
            self._count -= 1
        if tag == "li":
            self._entry = None

    def handle_data(self, data):
        if self._count:
            self.count += data
        if self._entry:
            self.texts[self._entry] += data
        if not self._skip:
            self.leftovers.extend(_LEFTOVER.findall(data))


def check(site: pathlib.Path) -> list[str]:
    problems: list[str] = []
    pages = cited = 0
    for path in sorted(site.rglob("*.html")):
        rel = path.relative_to(site)
        p = _Page()
        p.feed(path.read_text(encoding="utf-8"))
        if p.leftovers:
            problems.append(f"{rel}: plain-text citations left over: {sorted(set(p.leftovers))}")
        if not (p.refs or p.entries):
            continue
        pages += 1
        cited += len(p.refs)
        if p.panels != 1:
            problems.append(f"{rel}: has citations but {p.panels} Sources panels, not one")
        if p.outside:
            problems.append(f"{rel}: Sources entries outside the panel: {p.outside}")
        if p.count.replace("\u00b7", "").strip() != str(len(p.entries)):
            problems.append(f"{rel}: panel says {p.count.strip() or 'nothing'} but lists {len(p.entries)} sources")
        if p.backrefs:
            problems.append(f"{rel}: {p.backrefs} footnote return link(s) left in the Sources list")
        targets = {href.removeprefix("#") for href, _ in p.refs}
        for href, label in p.refs:
            if href.removeprefix("#") not in p.entries:
                problems.append(f"{rel}: citation {href} has no Sources entry")
            if not label or not label.startswith("Source "):
                problems.append(f"{rel}: citation {href} has no meaningful aria-label")
        for entry in p.entries:
            if entry not in targets:
                problems.append(f"{rel}: Sources entry {entry} is never cited")
            if _PRIVATE.search(p.texts.get(entry, "")):
                problems.append(f"{rel}: Sources entry {entry} cites the club's private research; cite its public sources")
    print(f"citations: {cited} across {pages} pages checked")
    return problems


def main() -> int:
    site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    if not site.is_dir():
        print(f"citations: {site} does not exist, build the site first", file=sys.stderr)
        return 2
    problems = check(site)
    for line in problems:
        print(line, file=sys.stderr)
    if problems:
        print(f"citations: {len(problems)} problem(s)", file=sys.stderr)
        return 1
    print("citations: all resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
