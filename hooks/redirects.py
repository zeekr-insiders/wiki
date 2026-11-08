"""Keep moved pages' old URLs working, with no plugin dependency.

mkdocs.yml lists them under extra.redirects as old page -> new page, both as
content paths. After each build this writes a small page at the old URL that
sends the reader on (keeping any #anchor, so old deep links still land), with a
canonical link and a plain link for anyone without JavaScript.
"""

from __future__ import annotations

import html
import posixpath
from pathlib import Path


def _url(path: str) -> str:
    """content path -> the directory URL mkdocs builds it at."""
    path = path[: -len(".md")]
    if path == "index" or path.endswith("/index"):
        return path[: -len("index")]
    return path + "/"


def on_post_build(config, **kwargs):
    redirects = (config.get("extra") or {}).get("redirects") or {}
    site = Path(config["site_dir"])
    base = config.get("site_url") or "/"
    for old, new in redirects.items():
        old_url, new_url = _url(old), _url(new)
        target = posixpath.relpath(new_url or ".", old_url or ".") + "/"
        canonical = html.escape(base.rstrip("/") + "/" + new_url)
        rel = html.escape(target)
        page = (
            "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">"
            f"<title>Moved</title><link rel=\"canonical\" href=\"{canonical}\">"
            f"<meta name=\"robots\" content=\"noindex\">"
            f"<meta http-equiv=\"refresh\" content=\"0; url={rel}\">"
            f"<script>location.replace({target!r} + location.hash)</script>"
            f"</head><body><p>This page has moved to <a href=\"{rel}\">{rel}</a>.</p></body></html>\n"
        )
        out = site / old_url / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page, encoding="utf-8")
