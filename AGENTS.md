# AGENTS.md: Zeekr Insiders wiki

Reference for AI agents and people. `CLAUDE.md` points here.

## What this is

The Zeekr Insiders Australia wiki: an owner-run reference for Australian Zeekr owners, built with MkDocs Material and heavily customised to match the club site (the "front door", <https://zeekrinsiders.com.au>). It publishes from `main` to <https://wiki.zeekrinsiders.com.au> through GitHub Pages (`.github/workflows/deploy.yml`), behind Cloudflare. Nobody deploys by hand, and only the owner pushes to `main`; agents never push.

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
7. **Public sources only.** Never cite the club's private research notes (such as its internal fact sheet): readers can't open it. Cite the public sources it relies on, each as its own entry. The club's public guides on zeekrinsiders.com.au are fine.

`make citations` fails if a marker has no entry, an entry is never cited, or an entry cites the club's private research or internal fact sheet. It cannot tell whether a source actually says what the page claims; that is on you.

## Feeds

The build publishes four feeds for feed readers and the main club site (which reads the updated RSS feed):

| Feed | URL |
|---|---|
| New pages, RSS | <https://wiki.zeekrinsiders.com.au/feed_rss_created.xml> |
| Updated pages, RSS | <https://wiki.zeekrinsiders.com.au/feed_rss_updated.xml> |
| New pages, JSON Feed | <https://wiki.zeekrinsiders.com.au/feed_json_created.json> |
| Updated pages, JSON Feed | <https://wiki.zeekrinsiders.com.au/feed_json_updated.json> |

They come from mkdocs-rss-plugin, with `hooks/feeds.py` on top. Each item has the page title, URL, created or updated date (from git, so CI checks out the full history), its top-level section as the category, and a description:

1. the page's `changelog` front matter, when set;
2. otherwise its `description` front matter;
3. otherwise its first plain paragraph.

**`changelog`.** When you change a page meaningfully, add one short line saying what changed, so the updated feed says more than "updated". Replace it on the next meaningful change; leave it alone for typo fixes.

```yaml
---
last_checked: 2026-11-08
changelog: "Added MY27 towing figure"
---
```

**`launch_date`.** At the first public publish every page is new, so `extra.launch_date` in `mkdocs.yml` records that date (`YYYY-MM-DD`, `null` until set). When set, the RSS feeds carry it as `<zi:launchDate>` in the channel and the JSON feeds as `_zeekr_insiders.launch_date`, so a consumer can treat items dated on or before it as the launch, not as updates.

## Search and sharing

Each page's front matter carries what search engines and share cards show:

```yaml
---
last_checked: 2026-11-08
seo_title: "Zeekr 7X specs: range, charging, towing"
description: "Zeekr 7X specifications for Australia: battery, power, WLTP range, DC and AC charging, towing, boot space, equipment and warranty for MY25/MY26 and MY27."
---
```

- **`seo_title`** (optional) is the `<title>` and share title, before " | Zeekr Insiders". Put the words people search for first. Without it, the title is the page's H1. Keep the whole title under about 60 characters.
- **`description`** (required) is the meta and share description: 140 to 160 characters, written for someone deciding whether to click, and unique to the page.
- `make seo` (`scripts/check_seo.py`, part of `make ready` and CI) fails on a missing or duplicate description (a length outside 140 to 160 only warns), a duplicate title, a missing canonical, a `lang` other than `en-AU`, more than one H1, or structured data that does not parse.

`hooks/seo.py` adds the rest at build time: git dates for the sitemap's `lastmod` and the article dates, the share image (a model page shares its model's banner from `assets/img/og-<model>.jpg`, the rest share the default card), and JSON-LD: Organization and WebSite on the home page, a BreadcrumbList everywhere else, a TechArticle with the page's Sources as citations on content pages, a DefinedTermSet on the glossary and a VideoObject per video. Don't add FAQPage markup unless a page really is questions and answers.

`content/robots.txt` allows everything and names the sitemap. The 404 page and redirect stubs carry `noindex`. For Google Search Console's HTML-tag check, put the token in `extra.google_site_verification` in `mkdocs.yml`.

**`models`.** Optional front matter listing the models a page is about, from `7x`, `x`, `009`, `7gt`, `8x`, `9x` (quote them, e.g. `models: ["7x"]`); leave general pages untagged. The keys match the club site and forum, analytics sends them with `content_viewed`, and `make models` fails on unknown keys.

## Build, check, preview

Dependencies are managed with [uv](https://docs.astral.sh/uv/) (`pyproject.toml`, `uv.lock`).

| Command | What it does |
|---|---|
| `make install` | `uv sync` into `.venv/` |
| `make run` | Dev server on <http://localhost:8000> (MkDocs' default). If one is already running, use it rather than starting another on the same port. |
| `make build` | `mkdocs build --strict` (as CI does) into `site/` |
| `make nav` | `scripts/check_nav.py`: no titled `index.md` comes first in a nav section (it would be swallowed) |
| `make citations` | `scripts/check_citations.py`: every citation reaches its Sources entry and back |
| `make labels` | `scripts/check_labels.py`: headings never skip a level (blocks); a page's name differing between its H1, the nav and the cards linking to it only warns |
| `make seo` | `scripts/check_seo.py`: titles, descriptions, canonicals, `lang` and structured data (see Search and sharing) |
| `make ready` | The gate: clean, nav, one strict build, citations, labels, seo. `make lint` and `make check` (markdownlint, htmlproofer) are optional extras that fail if the tool is missing. |

CI runs `mkdocs build --strict` plus the check scripts on every pull request and push to `main`. Treat any strict-mode warning as a failure.

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
| `VERSION` / `hooks/version.py` | The wiki version (edit `VERSION`, one line) and the footer stamp `v1.0.0 (Build abc1234)`: the short commit comes from `GITHUB_SHA` in CI, else `git rev-parse HEAD`, else `dev`. |
| `hooks/headings.py` | Keeps the permalink glyph out of heading names for screen readers. |
| `main.py` | mkdocs-macros: `spec_card`, `card_icon`, `youtube`, `glossary` and `handover_checklist`. |
| `data/glossary.yml` | Every glossary term (see Glossary below). |
| `data/handover-checklist.yml` | The Handover checklist's items, sections and sources (see Handover checklist below). |
| `scripts/` | The check scripts behind `make ready`. |

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

### Handover checklist

The Handover checklist (`content/buying/handover-checklist.md`) is built from `data/handover-checklist.yml` by the `handover_checklist()` macro; `javascripts/handover.js` adds the model picker, progress bars, saved ticks, "Copy what's left" and "Start again". Edit items in the data file:

- `id` is the key a reader's tick is saved under in their browser. Never rename or reuse one; add a new id instead.
- `models` is `all`, `7x`, `7x-my27`, `x` or `009`. Choosing 7X in the picker also shows `7x-my27` items.
- `cite` lists keys from `sources`, which the macro turns into the page's footnotes and Sources.
- Where no source says what comes with the car, say "Confirm what your order includes".

Ticks live only in the reader's `localStorage` (`zi-handover:v1`); the page makes no network calls.

Finishing a section with a tick folds it away, plays a short effect themed to it from its heading, then opens the next unfinished section and scrolls it into view; finished sections also start folded when a reader comes back. Ticking everything ends on a finale (`javascripts/handover-celebrate.js`, `stylesheets/handover-celebrate.css`). The effects are keyed by section `id`, so a new or renamed section needs its entry in `effects` there; an unknown id falls back to the stars. Reduced motion gets a static check badge, print gets nothing.

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
- Never the word "convoy" (a separate product); say "drive" or "group drive".
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

- Licences: code is MIT (`LICENSE`), written content is CC BY-NC-SA 4.0 and images belong to their owners (`LICENSE-CONTENT.md`). Record each new image's source and licence in the PR.
- Only use images we have the right to use: our own photos, the Zeekr brand kit, or AI-generated artwork, and record which in the PR.
- No personal data in the repo: no member names, emails, phone numbers, number plates or VINs, unless the person has agreed to be named.
- No secrets, tokens or `.env` files. `.gitignore` keeps agent evidence folders (`.verify/`, `.playwright-mcp/`, `.review/`) out; keep screenshots and logs there, never in `content/`.
- This repository is public. Commit nothing from the club's private notes, no member details, and no local file paths or machine-specific setup.

## Before you say work is done

1. `make ready` passes. Failures: nav, strict build, citations, seo (missing or duplicate title or description, canonical, `lang`, H1, structured data), labels (skipped heading levels). Warnings only: page name differing between H1, nav and cards (labels) and a description outside 140 to 160 characters (seo).
2. For visual changes, look at the page yourself in light and dark, at phone and desktop widths.

Work on a branch with small one-line commits. `main` publishes the live site, so it only takes reviewed changes.
