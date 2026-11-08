# CLAUDE.md

See [AGENTS.md](AGENTS.md). It is the canonical guide for this repo: the sources rule, build and checks, layout, style, colour, accessibility, diagrams and AI use.

Claude-specific notes:

- The maintainer usually has `make run` serving on port 8000. Don't start, stop or restart it.
- Run `make ready` and `mkdocs build --strict` inside the memory-capped slice the user's global instructions describe.
- For diagrams, use the `diagram-design` skill with the `zeekr-insiders` profile.
- Keep screenshots and logs in `.verify/` or `.playwright-mcp/` (both ignored), never in `content/`.
- This repo is public. Never commit anything from `../data/`, member details, or local paths.
