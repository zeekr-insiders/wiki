"""Check every citation in the built site resolves, both ways.

For each page: every superscript points at a Sources entry that exists, every
entry is cited at least once, every "Back to text" link lands on a marker that
exists, every entry has a way back to its own markers, each marker carries an
aria-label, and no plain "[1]" citation text is left over from before the
footnote conversion.

Usage: python scripts/check_citations.py [site_dir]   (default: site)
"""

from __future__ import annotations

import pathlib
import re
import sys
from html.parser import HTMLParser

_LEFTOVER = re.compile(r"\[\d+\]")


class _Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.refs: list[tuple[str, str | None]] = []  # (href, aria-label)
        self.entries: list[str] = []
        self.backrefs: list[str] = []
        self.markers: list[str] = []
        self.leftovers: list[str] = []
        self._skip = 0  # inside <code>, <pre>, <script> or <style>
        self._h2 = False
        self.sources_heading = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag in ("code", "pre", "script", "style"):
            self._skip += 1
        if tag == "h2":
            self._h2 = True
        cls = (a.get("class") or "").split()
        if tag == "a" and "footnote-ref" in cls:
            self.refs.append((a.get("href", ""), a.get("aria-label")))
        if tag == "a" and "footnote-backref" in cls:
            self.backrefs.append(a.get("href", ""))
        if tag == "li" and a.get("id", "").startswith("fn:"):
            self.entries.append(a["id"])
        if tag == "sup" and a.get("id", "").startswith("fnref"):
            self.markers.append(a["id"])

    def handle_endtag(self, tag):
        if tag in ("code", "pre", "script", "style") and self._skip:
            self._skip -= 1
        if tag == "h2":
            self._h2 = False

    def handle_data(self, data):
        if self._h2 and data.strip() == "Sources":
            self.sources_heading = True
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
        if not p.sources_heading:
            problems.append(f"{rel}: has citations but no 'Sources' heading")
        targets = {href.removeprefix("#") for href, _ in p.refs}
        for href, label in p.refs:
            if href.removeprefix("#") not in p.entries:
                problems.append(f"{rel}: citation {href} has no Sources entry")
            if not label or not label.startswith("Source "):
                problems.append(f"{rel}: citation {href} has no meaningful aria-label")
        for entry in p.entries:
            if entry not in targets:
                problems.append(f"{rel}: Sources entry {entry} is never cited")
        backs = {href.removeprefix("#") for href in p.backrefs}
        for href in p.backrefs:
            if href.removeprefix("#") not in p.ids:
                problems.append(f"{rel}: back link {href} points nowhere")
        # One back link per entry, retargeted in the browser, so each entry needs a link
        # that lands on one of its own markers.
        for entry in p.entries:
            own = {m for m in p.markers if m.endswith(":" + entry.removeprefix("fn:"))}
            if not own & backs:
                problems.append(f"{rel}: Sources entry {entry} has no back link to its citations")
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
