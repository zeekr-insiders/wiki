"""Shape the RSS and JSON feeds (mkdocs-rss-plugin) for the front door.

- A page's optional `changelog:` front matter (one short line, such as
  "Added MY27 towing figure") becomes its feed description, so a reader of the
  updated feed sees what changed, not just that something did. The page's own
  `description` (its meta and share text) is left alone.
- A page with neither gets its first plain paragraph, not the plugin's
  abstract, which would start with the H1 and the "Last checked" line.
- Each item's category is the page's top-level section (Buying, Models,
  Knowledge and so on), from the nav.
- When mkdocs.yml sets extra.launch_date, both feeds carry it, so a consumer can
  tell the first publish, when every page is new, from real updates: RSS as
  <zi:launchDate> in the channel, JSON Feed as a `_zeekr_insiders` extension.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

_NS = "https://wiki.zeekrinsiders.com.au/feeds"


def _section(page) -> str:
    node = page
    while node.parent is not None:
        node = node.parent
    return node.title or page.title or ""


_SKIP = ("#", "*Last checked", "!!!", "<", "{{", "{%", "|", "-", "*", ">", "[^", "=== ", "    ", "```", "--8<--")


def _first_paragraph(markdown: str) -> str:
    """The page's opening sentence or two, as plain text."""
    for line in markdown.splitlines():
        text = line.strip()
        if not text or line.startswith(_SKIP) or text.startswith(_SKIP[:4]):
            continue
        text = re.sub(r"\s*\[\^[^\]]+\]", "", text)                 # footnote markers
        text = re.sub(r"\[([^\]]+)\]\([^)]*\)(\{[^}]*\})?", r"\1", text)  # links
        text = re.sub(r"[*_`]", "", text).strip()
        if len(text) > 220:
            cut = text.rfind(". ", 0, 220)
            text = text[: cut + 1] if cut > 60 else text[:217].rstrip() + "..."
        return text
    return ""


def on_page_markdown(markdown, page, config, files, **kwargs):
    meta = page.meta
    changelog = str(meta.get("changelog") or "").strip()
    rss = meta.get("rss") if isinstance(meta.get("rss"), dict) else {}
    if changelog:
        rss.setdefault("feed_description", changelog)
    elif not meta.get("description"):
        summary = _first_paragraph(markdown)
        if summary:
            rss.setdefault("feed_description", summary)
    if rss:
        meta["rss"] = rss
    meta.setdefault("feed_section", _section(page))
    return markdown


def on_post_build(config, **kwargs):
    site = Path(config["site_dir"])
    _json_summaries(site)
    launch = (config.get("extra") or {}).get("launch_date")
    if not launch:
        return
    launch = str(launch)
    for name in ("feed_rss_created.xml", "feed_rss_updated.xml"):
        path = site / name
        if not path.exists():
            continue
        xml = path.read_text(encoding="utf-8")
        if "<zi:launchDate>" in xml:
            continue
        xml = xml.replace("<rss ", f'<rss xmlns:zi="{_NS}" ', 1)
        xml = xml.replace("<channel>", f"<channel><zi:launchDate>{launch}</zi:launchDate>", 1)
        path.write_text(xml, encoding="utf-8")
    for name in ("feed_json_created.json", "feed_json_updated.json"):
        path = site / name
        if not path.exists():
            continue
        feed = json.loads(path.read_text(encoding="utf-8"))
        feed["_zeekr_insiders"] = {"about": _NS, "launch_date": launch}
        path.write_text(json.dumps(feed, ensure_ascii=False, indent=2), encoding="utf-8")


def _json_summaries(site: Path) -> None:
    """JSON Feed items carry the description as content_html only; add it as plain summary too."""
    for name in ("feed_json_created.json", "feed_json_updated.json"):
        path = site / name
        if not path.exists():
            continue
        feed = json.loads(path.read_text(encoding="utf-8"))
        for item in feed.get("items", []):
            if "summary" not in item and item.get("content_html"):
                item["summary"] = html.unescape(re.sub(r"<[^>]+>", " ", item["content_html"])).split()
                item["summary"] = " ".join(item["summary"])
        path.write_text(json.dumps(feed, ensure_ascii=False, indent=2), encoding="utf-8")
