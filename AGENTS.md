# AGENTS.md: Zeekr Insiders wiki

Instructions for AI coding agents (and a handy summary for people). This is the canonical file; `CLAUDE.md` points here.

## What this is

The Zeekr Insiders Australia wiki: an owner-run reference for Australian Zeekr owners, built with MkDocs Material and heavily customised to match the club site (the "front door", <https://zeekrinsiders.com.au>). It publishes from `main` to <https://wiki.zeekrinsiders.com.au> through GitHub Pages (`.github/workflows/deploy.yml`). Nobody deploys by hand.

The club is independent of Zeekr Australia. We write as owners talking to owners, not as a brand.

## The sources rule (read this first)

Every researched or factual claim on a page is cited. No exceptions, and no guessing.

1. **Footnote after the fact.** Put a marker such as `[^1]` straight after the claim it supports.
2. **Sources entry, complete.** Under the page's `## Sources` heading, in citation order, one entry per marker with publisher, title, URL and accessed date:

    ```markdown
    [^1]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
    ```

3. **`last_checked` front matter.** Set `last_checked: YYYY-MM-DD` at the top of every page whose facts you checked, and update it whenever you re-check them.
4. **Label what is shaky.** If no source confirms a fact, say so in the sentence ("not confirmed", "provisional"). If sources disagree, say they disagree and show both, or send the reader to the authority (service booklet, ATO, dealer).
5. **Model years.** Always say which car a figure applies to. The original 7X is **MY25/MY26**; the updated 2027 car is **MY27**. Never let a figure float without its model year when the years differ.
6. **Never invent.** No made-up figures, quotes, URLs, dates or publishers. If you can't find a source, leave the claim out or mark it unconfirmed. Citations can't go inside a spec card grid; cite in the sentence after it.
7. **Public sources only.** Never cite the club's private research (club-docs, the internal fact sheet): readers can't open it. Cite the public sources it relies on, each as its own entry. The club's public guides on zeekrinsiders.com.au are fine.

`make citations` fails if a marker has no entry, an entry is never cited, or an entry cites club-docs or the internal fact sheet. It cannot tell whether a source actually says what the page claims; that is on you.

## Build, check, preview

Dependencies are managed with [uv](https://docs.astral.sh/uv/) (`pyproject.toml`, `uv.lock`).

| Command | What it does |
|---|---|
| `make install` | `uv sync` into `.venv/` |
| `make run` | Dev server on <http://localhost:8000>. The maintainer often has this running; don't start a second one on the same port. |
| `make build` | `mkdocs build` into `site/` |
| `make nav` | `scripts/check_nav.py`: no titled `index.md` comes first in a nav section (it would be swallowed) |
| `make citations` | `scripts/check_citations.py`: every citation reaches its Sources entry and back |
| `make labels` | `scripts/check_labels.py`: a page has the same name in its H1, the nav and the cards linking to it; headings never skip a level |
| `make ready` | The gate: clean, nav, build, citations, labels, lint, check. Must pass before a commit is pushed or a PR is opened. |

CI runs `mkdocs build --strict` plus the three check scripts on every pull request and on every push to `main`. Treat any strict-mode warning as a failure.

## Repo layout

| Path | What lives there |
|---|---|
| `content/` | The wiki pages (`docs_dir`). Nav order and labels are in `mkdocs.yml`. |
| `content/CNAME` | The custom domain for GitHub Pages. Don't remove it. |
| `content/stylesheets/zeekr.css` | The whole theme, mirroring the front door's tokens. Its header lists its sections. |
| `content/javascripts/zeekr.js` | Citation tooltips, the click-to-load video, comparison table markers. |
| `overrides/` | Material template overrides: masthead, header, footer, nav, ToC, 404. |
| `overrides/.icons/lucide/` | Vendored [Lucide](https://lucide.dev) icons, ISC licence (`LICENSE-lucide.txt`). Copy new ones from the Lucide release unchanged. |
| `overrides/.icons/zi/` | The front door's own glyphs (masthead, socials). |
| `hooks/cards.py` | Makes a `.z-card` with a single `.go` link one clickable card (one tab stop). |
| `hooks/citations.py` | Turns footnotes into labelled citations and a collapsed Sources panel. |
| `hooks/tables.py` | Lets long cells wrap; short cells stay on one line and wide tables scroll. |
| `hooks/redirects.py` | Keeps a moved page's old URL working: list it under `extra.redirects` in `mkdocs.yml` (old content path: new one). |
| `hooks/headings.py` | Keeps the permalink glyph out of heading names for screen readers. |
| `main.py` | mkdocs-macros: `spec_card`, `card_icon`, `youtube`, `glossary` and older model-data helpers. |
| `data/glossary.yml` | Every glossary term (see Glossary below). |
| `scripts/` | The check scripts behind `make nav`, `make citations` and `make labels`. |
| `templates/` | Page templates for contributors. |

### Spec cards

A model page's headline figures go in a `zi-spec-grid`, one `spec_card` per figure, no blank lines between them:

```markdown
<div class="zi-spec-grid">
{{ spec_card("luggage", "Boot", "539 / 1,978 L", "Seats up / folded") }}
{{ spec_card("caravan", "Towing", "2,000 / 750 kg", "Braked / unbraked") }}
</div>

The towing rating is for the MY25/MY26 car [^3].
```

Arguments: Lucide icon name (no `.svg`), short label, value, optional detail. Cite in the sentence after the grid.

### Glossary

The Glossary page is built from one file, `data/glossary.yml`. To add or change a term, edit that file only; the `glossary()` macro sorts the terms A to Z and renders them. Each term has:

| Field | What it holds |
|---|---|
| `id` | The term's anchor, as in `glossary/#soc`. Never change one that has shipped. |
| `term` | The name as shown, sentence case. |
| `aka` | Other names and abbreviations. The page filter and site search match them. |
| `category` | One of the keys under `categories`: Battery, Charging, Home and grid, Driving, Ownership and money, Zeekr-specific. |
| `definition` | One or two plain-English sentences. A factual specific gets a footnote such as `[^carexpert-7x]`, keyed to `sources` in the same file; the macro builds the page's Sources from the keys it uses. |
| `see` | The wiki pages that explain it: `{label, page}`, with `page` relative to `content/`. |

The build fails if two terms share an `id`, a term names an unknown category, or a definition cites a key that isn't in `sources`. Each term is its own entry in the site search. On the page, `javascripts/glossary.js` adds the filter box, category chips and copy-link buttons; without JavaScript the full list and the A to Z links still work.

### Videos

Use the `youtube` macro. It shows a local poster and loads youtube-nocookie.com only when the reader presses play:

```markdown
{{ youtube("KlVyyYCinu4", "Video title as on YouTube", "Channel name", "https://www.youtube.com/@channel") }}
```

Save the poster first as `content/assets/images/video/<video id>.webp` (1280 x 720) and credit the channel in Sources.

### Tables

Plain Markdown. Keep headers and row labels short so a table fits a phone with little scrolling. `hooks/tables.py` handles wrapping.

## Writing style

- Australian English: colour, centre, organise, licence (noun), tyre, boot, bonnet, windscreen, rego.
- No em dashes. Use a full stop, comma, colon or brackets.
- Owner to owner: friendly, direct, practical. "You'll want to" rather than "Users should".
- No hype, no marketing speak, no dealership-promo tone. Say what matters and what it costs.
- Prices in AUD, with "before on-road costs" or "drive-away" context.
- Sentence case for headings and nav labels. A page's H1 matches its nav label.
- Use the club variables (`{{ extra.club.name }}`, `{{ extra.club.contact_url }}` and so on) rather than hard-coding the club's name or links.
- Blank line before and after every list, code block and admonition, or MkDocs runs them together.
- Internal links are relative paths to the `.md` file.
- No emojis. Use the Lucide icons through the macros. Headings carry no icons.

## Colour and the orange rule

The wiki uses the front door's neutral palette: Carbon, greys and Arctic White, with ink-coloured links. **Zeekr orange (`--zeekr-orange`, `#FF5A00`) is kept for actions and position only**: primary buttons, the current tab underline, reading progress, the home hero and the "On this page" marker. Never use orange for body text, headings, emphasis, icons, card accents or "best in column" markers. On light backgrounds, orange text uses `--orange-ink-light` (`#B03C00`) for contrast. Use the tokens in `zeekr.css`, never raw hex values.

### Light and dark

The wiki starts in light for every visitor, whatever their OS prefers, as the front door does. Dark applies only when the visitor picks it with the header toggle; Material stores that choice in `localStorage` (`__palette`) and applies it before the page paints, so it persists with no flash. `mkdocs.yml` therefore lists two palettes, light first, with no `media` queries. Key every dark-mode style off `[data-md-color-scheme="slate"]` (light is `"default"`), never `@media (prefers-color-scheme: dark)`, including the style block inside an inline diagram.

## Accessibility

- Text and UI meet WCAG 2.2 AA contrast in both light and dark themes. Check both.
- Never signal with colour alone: pair it with a marker, weight or text.
- Every interactive element has a visible focus state and a tap target of at least 44px (`--tap`).
- Respect `prefers-reduced-motion`.
- Informative images have real `alt` text; decorative ones get `alt=""`.
- Links that leave the wiki say so to screen readers; links and buttons have names that make sense out of context.
- Headings go in order (h1, h2, h3) with no skipped levels; `make labels` checks this.
- Check layouts at phone width (about 375px) as well as desktop. Wide tables scroll inside their wrapper, never the page.

## Diagrams

Make diagrams with the `diagram-design` skill using the **`zeekr-insiders`** client profile. Embed them as inline SVG that takes its colours from the theme's CSS variables (so they work in light and dark), with **one** orange highlight at most, for the single thing the reader should look at. Give each diagram a text alternative (a `<title>`/`<desc>` or a caption that states what it shows). Cite any facts it shows, the same as text.

## AI use

The club uses AI tools to help with research, drafting, code and some artwork, and says so: <https://zeekrinsiders.com.au/ai>. For this repo:

- A person checks every AI-assisted fact against its source before it is published. The sources rule applies with no shortcuts.
- Pull requests fill in the **AI use disclosure** in the PR template: what was assisted, which tool, and what a human verified.
- AI-generated images or diagrams are labelled as such in their attribution.

## Images and personal data

- Only use images we have the right to use: our own photos, the Zeekr brand kit, or AI-generated artwork, and record which in the PR.
- No personal data in the repo: no member names, emails, phone numbers, number plates or VINs, unless the person has agreed to be named.
- No secrets, tokens or `.env` files. `.gitignore` keeps agent evidence folders (`.verify/`, `.playwright-mcp/`, `.review/`) out; keep screenshots and logs there.

## Checks that must pass

Before you say work is done:

1. `make ready` passes, which includes:
    - **nav**: `scripts/check_nav.py mkdocs.yml`
    - **citations**: `scripts/check_citations.py site`
    - **labels**: `scripts/check_labels.py site mkdocs.yml`
2. `mkdocs build --strict` passes with no warnings (CI runs this).
3. For visual changes, you have looked at the page yourself in light and dark, at phone and desktop widths.

## Git

- Work on a branch, not `main`. Small commits, one change each, with a plain one-line message.
- `main` publishes the live site on every push, so it only takes reviewed pull requests.
