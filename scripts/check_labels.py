"""Check that a page is called the same thing wherever it is named.

On the built site:

- (warning only) a page's H1 matches its nav label (case aside). Under a model section the
  H1 may carry the model's name ("Zeekr 7X prices" for "Prices"), and an
  "Overview" page's H1 is the section's own name;
- (warning only) a link card's heading (hooks/cards.py) matches its target's H1, nav label
  or the nav group the target sits in ("Charging" for Home charging);
- headings never skip a level (h1 straight to h3);
- the nav as rendered (the sidebar, which is also the phone drawer) shows
  each page under its mkdocs.yml label, with that casing.

Usage: python scripts/check_labels.py [site_dir] [mkdocs.yml]
"""

from __future__ import annotations

import html
import pathlib
import posixpath
import re
import sys

import yaml

from check_nav import _Loader

_H1 = re.compile(r"<h1\b[^>]*>(.*?)</h1>", re.S)
_HEADING = re.compile(r"<h([1-6])\b", re.S)
_ARTICLE = re.compile(r"<article\b.*?</article>", re.S)
_ACTIVE = re.compile(r'<a\b[^>]*class="?md-nav__link md-nav__link--active"?[^>]*>(.*?)</a>', re.S)
_CARD = re.compile(r'<div class="?z-card[^>]*zi-card--link[^>]*>.*?<h3><a href="?([^" >]+)"?[^>]*>(.*?)</a></h3>', re.S)


def _text(fragment: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", "", fragment)).replace("¶", "")
    return " ".join(text.replace("’", "'").split()).casefold()


def _url(path: str) -> str:
    """content path -> built page URL, as mkdocs writes it with directory URLs."""
    path = path[:-3]
    if path == "index" or path.endswith("/index"):
        path = path[: -len("index")]
    else:
        path += "/"
    return path


def _walk(nav: list, parents: tuple[str, ...], out: dict) -> None:
    for item in nav:
        if isinstance(item, str):
            # An untitled entry is a section's own index page: its label is the section's.
            out[_url(item)] = (parents[-1] if parents else "", parents[:-1])
            continue
        (label, target), = item.items()
        if isinstance(target, list):
            _walk(target, parents + (label,), out)
        elif isinstance(target, str) and target.endswith(".md"):
            out[_url(target)] = (label, parents)


def main() -> int:
    site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
    config_path = sys.argv[2] if len(sys.argv) > 2 else "mkdocs.yml"
    with open(config_path, encoding="utf-8") as fh:
        config = yaml.load(fh, Loader=_Loader)
    labels: dict[str, tuple[str, tuple[str, ...]]] = {}
    _walk(config.get("nav") or [], (), labels)

    h1s: dict[str, str] = {}
    pages: dict[str, str] = {}
    shown: dict[str, str] = {}
    for path in site.rglob("index.html"):
        rel = path.parent.relative_to(site).as_posix()
        url = "" if rel == "." else rel + "/"
        body = path.read_text(encoding="utf-8")
        active = _ACTIVE.search(body)
        if active:
            # Material repeats the label inside the link for the ToC toggle; the first run of text is it.
            shown[url] = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", active.group(1))).split())
        article = _ARTICLE.search(body)
        pages[url] = article.group(0) if article else ""
        m = _H1.search(pages[url])
        if m:
            h1s[url] = _text(m.group(1))

    problems: list[str] = []
    warnings: list[str] = []
    for url, (label, parents) in sorted(labels.items()):
        if url not in h1s or url == "":
            continue
        h1, want = h1s[url], _text(label)
        section = _text(parents[-1]) if parents else ""
        ok = h1 == want or (section and h1 == f"{section} {want}") or (want == "overview" and h1 == section)
        if not ok:
            warnings.append(f"/{url}: nav label '{label}' but H1 '{h1}'")

    for url, (label, _) in sorted(labels.items()):
        text = shown.get(url)
        if text is not None and not text.startswith(label):
            problems.append(f"/{url}: nav shows '{text}' but mkdocs.yml says '{label}'")

    for url, article in sorted(pages.items()):
        levels = [int(n) for n in _HEADING.findall(article)]
        for before, after in zip(levels, levels[1:]):
            if after > before + 1:
                problems.append(f"/{url}: heading jumps from h{before} to h{after}")
                break
        for href, title in _CARD.findall(article):
            target = posixpath.normpath(posixpath.join("/" + url, href)).lstrip("/")
            target = "" if target in (".", "") else target.rstrip("/") + "/"
            label, parents = labels.get(target, ("", ()))
            # A nav group below the top tabs ("Charging") may name a card for its first page.
            groups = {_text(p) for p in parents[-1:]} if len(parents) >= 2 else set()
            allowed = {h1s.get(target, ""), _text(label)} | groups
            if _text(title) not in allowed:
                warnings.append(f"/{url}: card '{_text(title)}' links to /{target}, called {sorted(a for a in allowed if a)}")

    # Naming agreement is editorial: warn, never block an editor.
    for line in warnings:
        print(f"warning: {line}", file=sys.stderr)
    if warnings:
        print(f"labels: {len(warnings)} naming warning(s), not blocking", file=sys.stderr)
    for line in problems:
        print(line, file=sys.stderr)
    if problems:
        print(f"labels: {len(problems)} problem(s)", file=sys.stderr)
        return 1
    print(f"labels: {len(labels)} nav pages, their cards and heading levels agree")
    return 0


if __name__ == "__main__":
    sys.exit(main())
