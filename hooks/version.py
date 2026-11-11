"""Stamp the footer with the wiki's version and the commit it was built from.

The version is read from the VERSION file at the repo root. The commit is
GITHUB_SHA in CI, else `git rev-parse HEAD`, else "dev" (no git, or a
checkout with no commits). The footer reads extra.build from the config.
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent


def _sha() -> str:
    sha = os.environ.get("GITHUB_SHA", "").strip()
    if not sha:
        try:
            sha = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=_ROOT, capture_output=True, text=True, timeout=10, check=True,
            ).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            sha = ""
    return sha if len(sha) >= 7 and all(c in "0123456789abcdef" for c in sha.lower()) else ""


def on_config(config, **kwargs):
    version = (_ROOT / "VERSION").read_text(encoding="utf-8").strip()
    sha = _sha()
    config["extra"]["build"] = {
        "version": version,
        "sha": sha,
        "short": sha[:7] if sha else "dev",
    }
    return config
