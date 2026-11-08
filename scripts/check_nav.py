"""Fail when a nav section would swallow one of its own pages.

With Material's navigation.indexes feature, a section whose first child is an
index.md page takes that page as the section itself: the page disappears from
the list and the section heading opens it. That is right for an untitled
landing page ("- buying/index.md") and wrong for a titled one
("- Victoria: resources/vic/index.md"), which is a real entry that vanished
from the By State list. So a titled index.md must never come first.

Usage: python scripts/check_nav.py [mkdocs.yml]
"""

from __future__ import annotations

import sys

import yaml


class _Loader(yaml.SafeLoader):
    """Reads mkdocs.yml without importing the Python objects its tags name."""


_Loader.add_multi_constructor("tag:yaml.org,2002:python/", lambda loader, suffix, node: None)


def _is_index(path: object) -> bool:
    return isinstance(path, str) and (path == "index.md" or path.endswith("/index.md"))


def check(nav: list, trail: str = "nav") -> list[str]:
    problems: list[str] = []
    # The top level is not a section, so "Home: index.md" coming first is fine there.
    if nav and trail != "nav":
        first = nav[0]
        if isinstance(first, dict):
            (title, target), = first.items()
            if _is_index(target):
                problems.append(
                    f"{trail}: '{title}: {target}' is a titled index.md listed first, so "
                    "navigation.indexes turns it into the section and it drops out of the list. "
                    "Put an untitled landing page first."
                )
    for item in nav:
        if isinstance(item, dict):
            for title, target in item.items():
                if isinstance(target, list):
                    problems.extend(check(target, f"{trail} > {title}"))
    return problems


def main() -> int:
    path = sys.argv[1] if len(sys.argv) > 1 else "mkdocs.yml"
    with open(path, encoding="utf-8") as fh:
        config = yaml.load(fh, Loader=_Loader)
    if "navigation.indexes" not in (config.get("theme", {}).get("features") or []):
        print("nav: navigation.indexes is off, nothing to check")
        return 0
    problems = check(config.get("nav") or [])
    for line in problems:
        print(line, file=sys.stderr)
    if problems:
        return 1
    print("nav: no section swallows a titled page")
    return 0


if __name__ == "__main__":
    sys.exit(main())
