# Zeekr Insiders wiki

The source of <https://wiki.zeekrinsiders.com.au>, an owner-run guide to buying and living with a Zeekr in Australia: models and prices, charging, servicing, running costs and EV explainers, with a source for every fact.

The wiki belongs to [Zeekr Insiders](https://zeekrinsiders.com.au), an owner-run club that is independent of Zeekr Australia. It is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) and publishes from `main` through GitHub Pages.

## Quick start

You need Python 3.11 or later and [uv](https://docs.astral.sh/uv/).

```bash
git clone https://github.com/zeekr-insiders/wiki.git
cd wiki
uv sync
make run
```

Then open <http://localhost:8000>. The page reloads as you edit files under `content/`.

## Making a change

Use **Suggest an edit** at the foot of any wiki page, or clone the repository and run `make ready` before opening a pull request. [CONTRIBUTING.md](CONTRIBUTING.md) covers the process and the sources rule. [AGENTS.md](AGENTS.md) is the full reference for how pages are written and checked.

## Layout

| Path | What lives there |
|---|---|
| `content/` | The pages, the theme's CSS and JavaScript, and images |
| `data/` | The glossary terms and the Handover checklist items |
| `overrides/` | Material template overrides and the vendored icons |
| `hooks/`, `main.py` | Build-time hooks and the page macros |
| `scripts/` | The checks behind `make ready` |
| `mkdocs.yml` | Site settings and navigation |

## Licence

- **Code** (theme, hooks, scripts, JavaScript and CSS): MIT. See [LICENSE](LICENSE).
- **Written content** (the page text and the text data): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- **Images and media are not covered by either.** Zeekr brand imagery is © Zeekr, used with credit. Member photos are © their owners, used with permission. Club artwork, including the AI-assisted banners and the diagrams, is © Zeekr Insiders, all rights reserved unless stated. Lucide icons are ISC licensed. Embedded videos are © their creators.
