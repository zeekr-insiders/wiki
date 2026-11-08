"""Keep the permalink glyph out of each heading's accessible name.

The toc extension puts <a class="headerlink">¶</a> inside every heading, so a
screen reader announces "Resources pilcrow" (or "Resources Permanent link").
The link is a pointer convenience: the "On this page" panel links the same
anchors for everyone, so the glyph is hidden from assistive technology and
taken out of the tab order rather than relabelled.
"""

from __future__ import annotations

import re

_LINK = re.compile(r'<a class="headerlink" href="(#[^"]*)" title="([^"]*)">')


def on_page_content(content: str, page, config, files) -> str:
    return _LINK.sub(r'<a class="headerlink" href="\1" title="\2" aria-hidden="true" tabindex="-1">', content)
