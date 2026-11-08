"""Search and share metadata for every page, worked out at build time.

For each page this sets, for overrides/main.html and the sitemap to use:

- page.meta["zi_modified"] / ["zi_created"]: the page's last and first git
  commit dates (ISO 8601). Uncommitted pages fall back to the build time.
- page.meta["zi_og_image"]: the share image. Pages under a model use that
  model's banner (assets/img/og-<model>.jpg); the rest use extra.site.og_image.
- page.meta["zi_jsonld"]: the page's structured data (schema.org JSON-LD):
  Organization and WebSite (with a search action) on the home page; a
  BreadcrumbList everywhere else; a TechArticle on content pages, with
  dateModified, the content licence, the club as publisher and each Sources
  entry as a citation;
  a DefinedTermSet on the glossary (from data/glossary.yml); and a
  VideoObject for each click-to-load video.

Section landing pages (a section's index.md) get breadcrumbs but no article:
they are menus, not articles.
"""

from __future__ import annotations

import datetime as _dt
import json
import re
import subprocess
from pathlib import Path

import yaml

_ROOT = Path(__file__).resolve().parent.parent
_NOW = _dt.datetime.now(_dt.timezone.utc).replace(microsecond=0).isoformat()
_FOOTNOTE = re.compile(r"^\[\^[^\]]+\]:\s*(.+)$", re.M)
_URL = re.compile(r"<(https?://[^>\s]+)>")
_VIDEO = re.compile(r"""youtube\(\s*"([\w-]+)"\s*,\s*"([^"]+)"\s*,\s*(["'])(.*?)\3\s*,\s*"([^"]+)"\s*\)""")
_MODELS = ("7x", "x", "009", "7gt")
# The written content's licence (LICENSE-CONTENT.md). Images are not covered, so only text items carry it.
_CONTENT_LICENCE = "https://creativecommons.org/licenses/by-nc-sa/4.0/"
_dates: dict[str, tuple[str, str]] = {}


def _git_dates(path: Path) -> tuple[str, str]:
    """(first, last) commit dates for a file, or the build time if it has none."""
    key = str(path)
    if key not in _dates:
        try:
            out = subprocess.run(
                ["git", "log", "--follow", "--format=%cI", "--", str(path)],
                cwd=_ROOT, capture_output=True, text=True, timeout=30, check=True,
            ).stdout.split()
        except (OSError, subprocess.SubprocessError):
            out = []
        _dates[key] = (out[-1], out[0]) if out else (_NOW, _NOW)
    return _dates[key]


def _citations(markdown: str) -> list[dict]:
    cites = []
    for entry in _FOOTNOTE.findall(markdown):
        url = _URL.search(entry)
        name = entry[: url.start()] if url else entry
        name = re.sub(r"\s+", " ", name).strip().rstrip(",;").strip()
        item = {"@type": "CreativeWork", "name": name}
        if url:
            item["url"] = url.group(1)
        cites.append(item)
    return cites


def _plain(text: str) -> str:
    text = re.sub(r"\[\^[^\]]+\]", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    return " ".join(re.sub(r"[*_`]", "", text).split())


def on_page_markdown(markdown, page, config, files, **kwargs):
    meta = page.meta
    created, modified = _git_dates(Path(page.file.abs_src_path))
    meta["zi_created"], meta["zi_modified"] = created, modified
    parts = page.file.src_uri.split("/")
    model = parts[1] if len(parts) > 2 and parts[0] == "models" and parts[1] in _MODELS else None
    meta["zi_og_image"] = f"assets/img/og-{model}.jpg" if model else config["extra"]["site"]["og_image"]
    meta["_zi_cites"] = _citations(markdown)
    meta["_zi_videos"] = _VIDEO.findall(page.file.content_string)
    return markdown


def _org(config) -> dict:
    site = config["extra"]["site"]
    return {
        "@type": "Organization",
        "@id": site["base_url"] + "/#organization",
        "name": config["extra"]["club"]["full_name"],
        "alternateName": config["extra"]["club"]["name"],
        "url": site["base_url"] + "/",
        "logo": config["site_url"] + "assets/img/logo-badge.png",
        "sameAs": [s["link"] for s in config["extra"].get("social", [])],
    }


def _crumbs(page, config) -> dict:
    items = [{"name": "Wiki", "item": config["site_url"]}]
    for section in reversed(page.ancestors):
        index = next((c for c in getattr(section, "children", []) or [] if getattr(c, "is_index", False)), None)
        if index is not None and index is not page:
            items.append({"name": section.title, "item": index.canonical_url})
    items.append({"name": page.meta.get("zi_name") or page.title, "item": page.canonical_url})
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i, **item} for i, item in enumerate(items, 1)
        ],
    }


def _glossary(page, config) -> dict:
    data = yaml.safe_load((_ROOT / "data" / "glossary.yml").read_text(encoding="utf-8"))
    terms = []
    for t in sorted(data["terms"], key=lambda t: t["term"].casefold()):
        term = {
            "@type": "DefinedTerm",
            "@id": f"{page.canonical_url}#{t['id']}",
            "name": t["term"],
            "description": _plain(str(t["definition"])),
            "url": f"{page.canonical_url}#{t['id']}",
            "inDefinedTermSet": page.canonical_url + "#termset",
        }
        if t.get("aka"):
            term["alternateName"] = list(t["aka"])
        terms.append(term)
    return {
        "@type": "DefinedTermSet",
        "@id": page.canonical_url + "#termset",
        "name": "Zeekr Insiders EV glossary",
        "url": page.canonical_url,
        "inLanguage": "en-AU",
        "license": _CONTENT_LICENCE,
        "hasDefinedTerm": terms,
    }


def _name(page) -> str:
    """The page's own H1, as overrides/partials/zi-name.html picks it."""
    if page.meta.get("title"):
        return str(page.meta["title"])
    first = page.toc.items[0] if page.toc and len(page.toc.items) else None
    if first is not None and first.level == 1:
        return re.sub(r"<[^>]+>", "", first.title)
    title = re.sub(r"<[^>]+>", "", page.title or "")
    if title == "Overview" and page.parent is not None:
        return page.parent.title
    return title


def on_page_context(context, page, config, nav, **kwargs):
    meta = page.meta
    meta["zi_name"] = _name(page)
    site_url = config["site_url"]
    org = _org(config)
    graph: list[dict] = []
    if page.is_homepage:
        graph.append(org)
        graph.append({
            "@type": "WebSite",
            "@id": site_url + "#website",
            "name": "Zeekr Insiders Wiki",
            "url": site_url,
            "inLanguage": "en-AU",
            "publisher": {"@id": org["@id"]},
            # Material opens its search with the query from ?q= on any page.
            "potentialAction": {
                "@type": "SearchAction",
                "target": {"@type": "EntryPoint", "urlTemplate": site_url + "?q={search_term_string}"},
                "query-input": "required name=search_term_string",
            },
        })
    else:
        graph.append(_crumbs(page, config))
        if page.file.src_uri == "glossary/index.md":
            graph.append(_glossary(page, config))
        elif not page.file.name == "index":
            article = {
                "@type": "TechArticle",
                "headline": meta.get("zi_name") or page.title,
                "url": page.canonical_url,
                "mainEntityOfPage": page.canonical_url,
                "inLanguage": "en-AU",
                "license": _CONTENT_LICENCE,
                "datePublished": meta["zi_created"],
                "dateModified": meta["zi_modified"],
                "image": site_url + meta["zi_og_image"],
                "author": {"@type": "Organization", "name": org["name"], "url": org["url"]},
                "publisher": {
                    "@type": "Organization", "name": org["name"], "url": org["url"],
                    "logo": {"@type": "ImageObject", "url": org["logo"]},
                },
            }
            if meta.get("description"):
                article["description"] = meta["description"]
            if meta["_zi_cites"]:
                article["citation"] = meta["_zi_cites"]
            graph.append(article)
    for video_id, title, _q, channel, channel_url in meta.get("_zi_videos") or []:
        graph.append({
            "@type": "VideoObject",
            "name": title,
            "description": f"{title}, by {channel} on YouTube.",
            "thumbnailUrl": f"{site_url}assets/images/video/{video_id}.webp",
            "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}",
            "contentUrl": f"https://www.youtube.com/watch?v={video_id}",
            "author": {"@type": "Person", "name": channel, "url": channel_url},
        })
    meta["zi_jsonld"] = json.dumps(
        {"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":")
    ).replace("</", "<\\/")
    return context
