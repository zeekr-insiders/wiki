"""Fail when a page's `models:` front matter names a model key we do not track.

The keys are shared with the club website and forum so Zeekr Australia can compare
traffic per model across all three. A page with no `models:` is fine (general page).

Usage: python scripts/check_models.py [content_dir]
"""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

MODEL_KEYS = {"7x", "x", "009", "7gt", "8x", "9x"}


def front_matter(text: str) -> dict:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---", 4)
    if end == -1:
        return {}
    data = yaml.safe_load(text[4:end])
    return data if isinstance(data, dict) else {}


def check(root: Path) -> list[str]:
    problems: list[str] = []
    for path in sorted(root.rglob("*.md")):
        meta = front_matter(path.read_text(encoding="utf-8"))
        if "models" not in meta:
            continue
        models = meta["models"]
        if not isinstance(models, list) or not all(isinstance(m, str) for m in models):
            problems.append(f"{path}: models must be a list of strings (quote keys like '009'), got {models!r}")
            continue
        bad = [m for m in models if m not in MODEL_KEYS]
        if bad:
            problems.append(f"{path}: models has unknown key(s) {bad}; allowed: {sorted(MODEL_KEYS)}")
    return problems


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "content")
    problems = check(root)
    for p in problems:
        print(f"ERROR {p}", file=sys.stderr)
    if problems:
        return 1
    print("Model tags OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
