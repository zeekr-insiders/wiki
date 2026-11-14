"""Flag prose that narrates the club's research instead of stating the fact.

Pages read best when they state a fact and let the footnote carry the attribution.
This check looks for the usual tells: research narration ("we could not find"),
publisher-led attribution ("CarExpert reports"), method notes ("our arithmetic"),
admonitions about the state of the sources ("Sources differ") and pages crowded
with boxes. See AGENTS.md, "Writing style".

It reads the body of every page under content/ (skipping front matter, code,
footnote definitions and everything from the `## Sources` heading down) and the
prose fields in data/ that render on pages (checklist `text` and `hint`, glossary
`definition`). Text inside double quotation marks or backticks is skipped, since a
quoted source is allowed to say whatever it said. A line ending in
`<!-- prose: allow -->` is skipped.

Warn mode by default (prints findings, exits 0). Fail mode, for when the rewrite
is done: `--strict` or PROSE_STRICT=1.

Usage: python scripts/check_prose.py [--strict] [paths...]
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import yaml

ALLOW = "<!-- prose: allow -->"
MAX_BOXES = 3

_NEG = r"(?:could not|couldn't|cannot|can't|did not|didn't|have not|haven't|do not|don't)"
_PUBLISHERS = (
    r"(?:CarExpert|The Driven|Drive|Carsales|RACV|NRMA|EV Central|ZeCar|Zecar|The Beep|"
    r"Chasing Cars|Whirlpool|WhichCar|Wheels|CarsGuide|Carsguide|EV Council)"
)

# (category, compiled pattern). Case-insensitive unless the pattern needs capitals.
RULES: list[tuple[str, re.Pattern[str]]] = [
    ("narration", re.compile(rf"\bwe {_NEG} (?:yet )?(?:find|confirm|verify|see|read|check|locate|source|settle)\b", re.I)),
    ("narration", re.compile(r"\bwe (?:found|have found|have seen|have not seen|saw|checked|have checked|rate|have sourced|have not sourced|have not yet)\b", re.I)),
    ("narration", re.compile(r"\bno (?:source|listing|report|outlet)s? (?:we|the club)\b", re.I)),
    ("narration", re.compile(r"\b(?:not|never) (?:stated|published|listed|given|found) in (?:our|the) sources\b", re.I)),
    ("narration", re.compile(r"\b(?:in the sources we|sources we (?:found|read|checked))\b", re.I)),
    ("narration", re.compile(r"\bso none is (?:given|quoted)\b|\bso we do not (?:say|explain|quote)\b", re.I)),
    ("narration", re.compile(r"\bwe have no (?:number|figure|source)\b", re.I)),
    ("narration", re.compile(r"\bthis section will be updated\b", re.I)),
    ("narration", re.compile(r"\b(?:a|one) single (?:secondary |news )?source\b", re.I)),
    ("narration", re.compile(r"\bsources (?:differ|disagree|conflict)\b", re.I)),
    ("attribution", re.compile(r"\baccording to (?!your\b)", re.I)),
    ("attribution", re.compile(r"\b(?:as reported by|has been reported to|it was reported that|is reported as)\b", re.I)),
    ("attribution", re.compile(rf"\b{_PUBLISHERS}(?:'s review)? (?:reports|quotes|puts|gives|lists|says|describes|reported|quoted|gave|listed)\b")),
    ("method", re.compile(r"\bour arithmetic\b|\b(?:our|the club's) (?:own )?(?:reading|rating)\b", re.I)),
    ("method", re.compile(r"\btreat (?:this|that|it|them|these) as (?:one reading|not confirmed|provisional|unsettled|secondary)\b", re.I)),
    ("method", re.compile(r"\bthis is secondary\b|\bthe wiki should\b", re.I)),
    ("method", re.compile(r"\bnot yet confirmed:", re.I)),
]

BOX_TITLE = re.compile(
    r"\b(?:not yet confirmed|unconfirmed|sources differ|no figures sourced|source limits|where this comes from|"
    r"how we handle figures|about the manual we checked|check current terms)\b",
    re.I,
)
BOX_LINE = re.compile(r"^\s*(?:!!!|\?\?\?\+?)\s")
QUOTED = re.compile(r"\"[^\"\n]*\"|“[^”\n]*”|`[^`\n]*`")
FOOTNOTE_DEF = re.compile(r"^\[\^[^\]]+\]:")
SOURCES_HEADING = re.compile(r"^##\s+Sources\s*$")


def _scan_line(text: str) -> list[tuple[str, str]]:
    plain = QUOTED.sub(" ", text)
    hits = []
    for category, pattern in RULES:
        for match in pattern.finditer(plain):
            hits.append((category, match.group(0)))
    return hits


def check_markdown(path: Path) -> list[str]:
    findings: list[str] = []
    lines = path.read_text(encoding="utf-8").splitlines()
    i = 0
    if lines and lines[0] == "---":
        i = 1
        while i < len(lines) and lines[i] != "---":
            i += 1
        i += 1
    in_fence = False
    in_footnote = False
    boxes = 0
    for n in range(i, len(lines)):
        line = lines[n]
        stripped = line.strip()
        if stripped.startswith(("```", "~~~")):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if SOURCES_HEADING.match(line):
            break
        if FOOTNOTE_DEF.match(line):
            in_footnote = True
            continue
        if in_footnote:
            if line.startswith((" ", "\t")) or not stripped:
                continue
            in_footnote = False
        if ALLOW in line:
            continue
        where = f"{path}:{n + 1}"
        if BOX_LINE.match(line):
            boxes += 1
            title = BOX_TITLE.search(line)
            if title:
                findings.append(f"{where}: [box] admonition about the sources: {title.group(0)!r}")
            continue
        for category, phrase in _scan_line(line):
            findings.append(f"{where}: [{category}] {phrase!r}")
    if boxes > MAX_BOXES:
        findings.append(f"{path}: [boxes] {boxes} admonitions (aim for at most two, warn above {MAX_BOXES})")
    return findings


def _line_of(raw: str, value: str) -> int:
    probe = value.strip().splitlines()[0][:40] if value.strip() else ""
    pos = raw.find(probe) if probe else -1
    return raw.count("\n", 0, pos) + 1 if pos >= 0 else 0


def check_data(path: Path, fields: tuple[str, ...], list_key: str) -> list[str]:
    raw = path.read_text(encoding="utf-8")
    data = yaml.safe_load(raw) or {}
    entries = data.get(list_key, []) if isinstance(data, dict) else data
    findings: list[str] = []
    for entry in entries or []:
        if not isinstance(entry, dict):
            continue
        for field in fields:
            value = entry.get(field)
            if not isinstance(value, str):
                continue
            for text in value.splitlines():
                if ALLOW in text:
                    continue
                for category, phrase in _scan_line(text):
                    where = f"{path}:{_line_of(raw, text)}"
                    findings.append(f"{where}: [{category}] {entry.get('id', '?')}.{field}: {phrase!r}")
    return findings


DATA_FILES = {
    "handover-checklist.yml": (("text", "hint"), "items"),
    "glossary.yml": (("definition",), "terms"),
}


def main(argv: list[str]) -> int:
    strict = "--strict" in argv or os.environ.get("PROSE_STRICT", "") not in ("", "0")
    args = [a for a in argv if a != "--strict"]
    targets = [Path(a) for a in args] or [Path("content"), Path("data")]
    findings: list[str] = []
    for target in targets:
        if target.is_file():
            files = [target]
        else:
            files = sorted(target.rglob("*.md")) + sorted(target.glob("*.yml"))
        for f in files:
            if f.suffix == ".md":
                findings += check_markdown(f)
            elif f.name in DATA_FILES:
                fields, key = DATA_FILES[f.name]
                findings += check_data(f, fields, key)
    for line in findings:
        print(line)
    pages = len({f.split(":", 1)[0] for f in findings})
    if not findings:
        print("prose: no findings")
        return 0
    mode = "failing" if strict else "warning only"
    print(f"prose: {len(findings)} finding(s) in {pages} file(s), {mode}. See AGENTS.md, Writing style.")
    return 1 if strict else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
