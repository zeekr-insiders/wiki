"""Check the built site's search metadata.

Every indexable page (not the 404 or a redirect stub, which carry noindex):

- has lang="en-AU" on <html>, one <h1>, and a canonical link on site_url;
- has a <title> in the "Page | Zeekr Insiders" form that no other page shares;
- has a meta description of 140 to 160 characters that no other page shares
  (front matter `description`; see AGENTS.md, "Search and sharing");
- has structured data that parses as JSON-LD: a BreadcrumbList on every page
  but the home page, which has Organization and WebSite; an article carries a
  headline, dateModified and publisher.

And the site has robots.txt pointing at sitemap.xml, which lists every
indexable page.

Usage: python scripts/check_seo.py [site_dir] [site_url]
"""

from __future__ import annotations

import json
import pathlib
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

SUFFIX = " | Zeekr Insiders"
DESC_MIN, DESC_MAX = 140, 160


class _Head(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ""
        self._in_title = False
        self.description = None
        self.canonical = None
        self.noindex = False
        self.h1 = 0
        self.jsonld: list[str] = []
        self._in_ld = False
        self._body = False  # SVG diagrams in the body have <title>s of their own

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "body":
            self._body = True
        elif tag == "title" and not self._body:
            self._in_title = True
        elif tag == "meta" and a.get("name") == "description":
            self.description = a.get("content") or ""
        elif tag == "meta" and a.get("name") == "robots" and "noindex" in (a.get("content") or ""):
            self.noindex = True
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif tag == "h1":
            self.h1 += 1
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self.jsonld.append("")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script":
            self._in_ld = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_ld:
            self.jsonld[-1] += data


def _types(node) -> list[str]:
    graph = node.get("@graph", [node])
    return [g.get("@type") for g in graph]


def check(site: pathlib.Path, site_url: str) -> tuple[list[str], int]:
    problems: list[str] = []
    titles: dict[str, str] = {}
    descs: dict[str, str] = {}
    indexable: set[str] = set()
    for path in sorted(site.rglob("index.html")):
        rel = path.relative_to(site).as_posix()
        p = _Head()
        p.feed(path.read_text(encoding="utf-8"))
        if p.noindex:
            continue
        url = site_url + rel[: -len("index.html")]
        indexable.add(url)
        if p.lang != "en-AU":
            problems.append(f"{rel}: <html lang> is {p.lang!r}, not en-AU")
        if p.h1 != 1:
            problems.append(f"{rel}: {p.h1} <h1> elements, not one")
        if p.canonical != url:
            problems.append(f"{rel}: canonical is {p.canonical!r}, expected {url}")
        title = " ".join(p.title.split())
        if not title.endswith(SUFFIX) or len(title) <= len(SUFFIX):
            problems.append(f"{rel}: title {title!r} is not 'Page{SUFFIX}'")
        elif title in titles:
            problems.append(f"{rel}: title {title!r} duplicates {titles[title]}")
        titles.setdefault(title, rel)
        desc = (p.description or "").strip()
        if not desc:
            problems.append(f"{rel}: no meta description (front matter `description`)")
        else:
            if not DESC_MIN <= len(desc) <= DESC_MAX:
                problems.append(f"{rel}: description is {len(desc)} characters, not {DESC_MIN} to {DESC_MAX}")
            if desc in descs:
                problems.append(f"{rel}: description duplicates {descs[desc]}")
            descs.setdefault(desc, rel)
        found: list[str] = []
        for raw in p.jsonld:
            try:
                node = json.loads(raw)
            except json.JSONDecodeError as exc:
                problems.append(f"{rel}: JSON-LD does not parse: {exc}")
                continue
            if node.get("@context") != "https://schema.org":
                problems.append(f"{rel}: JSON-LD has no schema.org @context")
            for g in node.get("@graph", [node]):
                found.append(g.get("@type"))
                if g.get("@type") in ("TechArticle", "Article"):
                    for key in ("headline", "dateModified", "publisher", "url"):
                        if not g.get(key):
                            problems.append(f"{rel}: {g['@type']} has no {key}")
                if g.get("@type") == "BreadcrumbList":
                    items = g.get("itemListElement") or []
                    if not items or any(not i.get("item") or not i.get("name") for i in items):
                        problems.append(f"{rel}: BreadcrumbList has an item with no name or URL")
        if rel == "index.html":
            for need in ("Organization", "WebSite"):
                if need not in found:
                    problems.append(f"{rel}: home page has no {need} structured data")
        elif "BreadcrumbList" not in found:
            problems.append(f"{rel}: no BreadcrumbList structured data")

    robots = site / "robots.txt"
    if not robots.exists() or f"Sitemap: {site_url}sitemap.xml" not in robots.read_text(encoding="utf-8"):
        problems.append("robots.txt is missing or does not name the sitemap")
    sitemap = site / "sitemap.xml"
    if not sitemap.exists():
        problems.append("sitemap.xml is missing")
    else:
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        listed = {u.findtext("s:loc", namespaces=ns) for u in ET.parse(sitemap).getroot().findall("s:url", ns)}
        for url in sorted(indexable - listed):
            problems.append(f"sitemap.xml does not list {url}")
    return problems, len(indexable)


def main() -> int:
    site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    site_url = sys.argv[2] if len(sys.argv) > 2 else "https://wiki.zeekrinsiders.com.au/"
    if not site.is_dir():
        print(f"seo: {site} does not exist, build the site first", file=sys.stderr)
        return 2
    problems, pages = check(site, site_url)
    for line in problems:
        print(line, file=sys.stderr)
    if problems:
        print(f"seo: {len(problems)} problem(s) across {pages} pages", file=sys.stderr)
        return 1
    print(f"seo: {pages} pages have a unique title and description, a canonical, en-AU and valid structured data")
    return 0


if __name__ == "__main__":
    sys.exit(main())
