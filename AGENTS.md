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
| `data/au-states.geojson` | Simplified state outlines for the checklist's "Use my location" button, inlined into the page. |
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

The Handover checklist (`content/buying/handover-checklist.md`) is built from `data/handover-checklist.yml` by the `handover_checklist()` macro; `javascripts/handover.js` adds the toolbar (Model and State selects, the location pin, Essentials or Everything), progress bars, saved ticks, and "Copy what's left" and "Start again" at the end. Edit items in the data file:

- `id` is the key a reader's tick is saved under in their browser. Never rename or reuse one: to retire an item, delete it; to change what it asks, add a new id.
- `models` is `all`, a model in every year (`7x`, `x`), a model year (`7x-my26`, which covers MY25/MY26, `7x-my27`, `x-my25`, `x-my26`), `009` or `7gt`. The Model select offers years, grouped by car with the newest year first, every model its own group: Any model; Zeekr 7X (7X MY27, 7X MY25/26); Zeekr X (X MY26, X MY25); Zeekr 009 (009); Zeekr 7GT (7GT). The 7GT has no items of its own until there are sourced facts for it, so choosing it shows the all-models items. Each year option names its car because a closed select shows only the chosen text: choosing `7x-my27` shows items tagged `all`, `7x` and `7x-my27`. The years differ a lot, so give each year its own item for screens, seats, wheels, keys, servicing and the like rather than one hedged item. A saved model the select no longer offers (an old bare `7x` or `x`) falls back to Any model. The build fails on an unknown tag.
- `states` (optional) lists `ACT`, `NSW`, `NT`, `QLD`, `SA`, `TAS`, `VIC`, `WA` in any order; leave it out for every state. The macro sorts them A to Z on the item, as the State select is. The build fails on an unknown state.
- `express: true` marks an essential: the must-dos a first-time reader shouldn't skip (insurance, payment, licence, the paperwork, the damage walk-around, keys, a charging check, the "we owe you" list, rights, roadside, recalls and the like). Keep Essentials to roughly 25 to 35 items across all phases. The toolbar's Show control (two native radios drawn as a segmented control, one selected style) switches between Essentials (only `express` items) and Everything; each option carries a live count for the current model and state, "Essentials (26)", "Everything (124)", so switching needs no status message. The model and state filters apply on top. A first visit opens on Essentials; the saved view keeps its first values, `view: express` (Essentials) or `full` (Everything), so older saves still load, and a reader with ticks saved before the views existed gets Everything. Ticks are shared across views, and progress, counts, folding, the finale and "Copy what's left" follow the current view. Sections with no Essentials hide in Essentials. Without JavaScript everything shows.
- `cite` lists keys from `sources`, which the macro turns into the page's footnotes and Sources.
- `link` (one) or `links` (a list) sends the reader somewhere: `{label, page}` (relative to `content/`, or an `#anchor`), `{label, club, path}` (a link in `extra.club` such as `forum_url`, with an optional path under it), `{label, url}` (an outside site) or `{label, tel}` (digits a phone dials). An app adds its store listings to its link as `ios` (App Store) and `android` (Google Play) URLs, plus `app` when its name differs from the label (`{label: "My NRMA charging", url: ..., app: "My NRMA", ios: ..., android: ...}`); with no `url` the name shows as plain text (`{label: "ZEEKR app", app: "ZEEKR", ios: ..., android: ...}`). It renders as the name followed by small round Apple and Android icons (Simple Icons marks, CC0, inline SVG in `main.py`; 32px targets), each named for screen readers, "ZEEKR on the App Store". Store URLs stay clean, with no UTM tags: the stores drop or mangle them. Use the Australian App Store storefront (`apps.apple.com/au/...`) and check each listing is the official one (the network links it, or the developer matches). `handover.js` shows only the reader's store: iOS and iPadOS (including an iPad reporting as a Mac with touch) get the Apple icon only, Android the Android icon only, anything else both; it reads `navigator.userAgentData.platform` where offered, else the user agent, and hides the other icon with `hidden` so screen readers skip it too. Without JavaScript both show; in print they read as "ZEEKR on the App Store" and the address. The macro adds `utm_source=zeekrinsiders&utm_medium=wiki&utm_campaign=handover-checklist` to every `club` and `url` link, after any query the URL already has, so never type UTM tags into the data file. Wiki pages, `tel:` links and the footnote URLs in `sources` stay clean: sources are citations. Link the apps and sites an item names; the links render as blue link chips on their own row under the hint (`--link-chip-*` tokens in `zeekr.css`, light and dark; text is 7:1 on the chip in light, 9:1 in dark), with an external-link icon and "(opens another site)" for screen readers on `url` and `club` links, a phone icon on `tel` links and no icon on wiki links. In print they are plain text with the address after them. Blue is kept for these chips.
- Phrase a gap as an action ("Ask the dealer", "Confirm what your order includes"), never as an excuse about what the sources lack.

Each item shows its model, year and state tags on their own line under the text (outlined; state tags dashed), so the text starts flush and "Copy what's left" copies the text alone. Tags the current filters already satisfy hide: with a model chosen, the model tags; with a state chosen, the state tags; with "Any" they show as usual. Print and no-JavaScript show every tag. Without JavaScript the toolbar and the end actions stay hidden and every item shows, tagged.

The toolbar is Model, State with a map-pin button beside it (labelled "Use my location"), then Show (Essentials or Everything): two lines on a phone, one on desktop. On a first visit it shows in full. Once the reader has chosen something or ticked an item it folds to a one-line summary, "7X MY27 · VIC · Essentials (26)", with a Change button (`aria-expanded`; opening moves focus to Model, folding keeps it on the button); later visits open folded. On a first visit, choosing something shows the summary with a Done button, and a first tick folds the bar only if it has scrolled out of view, so the page never jolts. The saved `set` flag records that the reader has set it up. State (Any state plus the eight) starts on a guess from the browser's time zone and is not saved until the reader picks; Canberra shares Sydney's zone, so the ACT guesses NSW. Help under State, not a status line, says "Guessed from your time zone", "Location blocked. Pick your state." (focus stays on State) or that it was set from your location, and clears once the reader picks. The pin shows busy while it waits and a dashed edge if location is blocked. It asks the browser for a position and matches it to a state on the page with a point-in-polygon test against `data/au-states.geojson`, which the macro inlines into the page. Those outlines are hand-simplified (borders to within a few kilometres, coasts boxed out to sea, the ACT listed first so it wins over NSW); fix a misplaced town there.

"Copy what's left" and "Start again" sit after the last phase, above the feedback panel. The copy starts with a line naming what it was made for ("For: 7X MY27 · VIC · Essentials (26)"). Each phase's sticky progress bar leads with the overall count, then the phase's.

Ticks, the view, the model, the chosen state and whether the toolbar is set (`done`, `view`, `model`, `region`, `set`) live only in the reader's `localStorage` (`zi-handover:v1`); the page makes no network calls and the position never leaves the device.

A finished section shows a light green tint and edge (`--hue-green-ink`, light and dark values in `zeekr.css`) and "Done" with a check icon beside its count, so colour is never the only signal. Green is kept for this one job.

After the last phase, a "How was the checklist?" panel asks for feedback in the forum's Forum, Website & Wiki Feedback forum (`forums/forum-feedback/` under `extra.club.forum_url`, with the checklist's UTM tags) through a "Share your thoughts" link chip. It is separate from the theme's "Suggest an edit".

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
