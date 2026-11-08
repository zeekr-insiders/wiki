"""Mark the table cells that hold a sentence, so every other cell can stay on one line.

Short cells (a figure, a grade, a state) read best unwrapped, and a table too
wide for the screen scrolls inside its wrapper instead of stacking "310 kW /
440 Nm" over three lines. A cell of running text is the exception: it gets
.zi-td-long and wraps within a readable width (zeekr.css, section 9).

Length is the only test, measured on the cell's text without tags or
citation markers, so authors write tables as plain Markdown as before.
"""

from __future__ import annotations

import re

# Past this many characters a cell reads as a sentence. Row labels in the first
# column get more room, as "WLTP range (RWD / Long Range / AWD)" is still a label.
LONG = 40
LONG_LABEL = 48

_ROW = re.compile(r"<tr>(.*?)</tr>", re.S)
_TD = re.compile(r"<td(?P<attrs>[^>]*)>(?P<body>.*?)</td>", re.S)
_TAG = re.compile(r"<[^>]+>")
_CITE = re.compile(r'<sup id="fnref[^"]*"[^>]*>.*?</sup>', re.S)


def _cell(m: re.Match, limit: int) -> str:
    attrs, body = m.group("attrs"), m.group("body")
    text = _TAG.sub("", _CITE.sub("", body))
    if len(" ".join(text.split())) <= limit:
        return m.group(0)
    if 'class="' in attrs:
        attrs = attrs.replace('class="', 'class="zi-td-long ', 1)
    else:
        attrs += ' class="zi-td-long"'
    return f"<td{attrs}>{body}</td>"


def on_page_content(content: str, page, config, files) -> str:
    if "<table" not in content:
        return content
    return _ROW.sub(lambda r: "<tr>" + _row(r.group(1)) + "</tr>", content)


def _row(row: str) -> str:
    index = iter(range(10_000))
    return _TD.sub(lambda m: _cell(m, LONG_LABEL if next(index) == 0 else LONG), row)
