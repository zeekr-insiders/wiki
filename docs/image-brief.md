# Wiki image and icon brief

Every image and icon the wiki needs to match the front door (zeekrinsiders.com.au), with a ready-to-paste ChatGPT
prompt for each one that should be generated. This file sits outside `content/`, so it is never published.

## House rules for every generated image

- **Tone**: the front door's photography is cool, quiet and a little cinematic: blue hour or overcast light, deep
  charcoal shadows, open Australian roads and landscapes, with orange only as a small accent (tail-light trails, a
  sunset edge, a charger's status light). Never a saturated orange wash: the wiki keeps orange for buttons and the
  current tab.
- **Palette**: Carbon `#1A1A1A`, Arctic White `#F2F2F2`, Zeekr Orange `#FF5A00` as a sparing accent, the secondary hues
  Silver Gray `#9DA2A5` (the wiki's own colour), Mushroom `#B9A6A0`, Dusk Plum `#6F204A` and Dawn Gold `#E6B237`. No
  blues or greens as design colours (sky and bush in a photo are fine).
- **Australian settings**: left-hand traffic, Australian road markings (white edge lines, yellow only in work zones),
  Australian plants (eucalypts, banksia, saltbush, spinifex), real-looking Australian places without naming them.
- **No text in images**, no number plates with readable characters, no logos of any kind, no invented badges or
  wordmarks. If a car appears, keep it generic or distant: the wiki uses Zeekr's own renders for anything that must
  look like a Zeekr (see "From the brand kit, not generated").
- **Reference**: the Zeekr brand kit at `/projects/zeekr-insiders/assets/zeekr-brand/` (read only), especially
  `Zeekr Brand Lifestyle 100/` for framing and light, and `Brand VI Guid/` for the colour range. Attach two or three
  Lifestyle photos to the ChatGPT chat as style references.
- **Light and dark**: the wiki has both themes, but heroes and banners always sit on a dark panel with light text, so
  every photograph should be dark enough under the text area to hold Arctic White type at 4.5:1 (keep the left third
  or lower third quiet and dark). The page adds no gradient over photos unless noted.
- **Delivery**: export as WebP (quality 80, sRGB, metadata stripped; `make import-photos` in web-home does this) unless
  a different format is given. Keep the master PNG out of the repo.

Prompt prefix to paste before each prompt below:

> Photographic, natural, editorial. Cool blue-hour or overcast light, deep charcoal shadows, restrained colour, a small
> touch of warm orange light only where noted. Australian setting. No text, no logos, no readable number plates, no
> people's faces in focus. Shot on a full-frame camera, 35mm, gentle film grain.

## 1. Home hero background

- **Path**: `content/assets/images/hero/home-hero.webp` (plus `home-hero-mobile.webp`)
- **Size**: 2400 x 1200 (2:1) for desktop; 1200 x 1500 (4:5) for phones
- **Used**: behind the home page hero ("Master your Zeekr."). Needs a two-line CSS hook (a `background-image` on
  `.hero--landing`) and no content change; the hero panel is currently a plain dark panel.
- **Prompt**: "A two-lane Australian country road at blue hour curving away through tall eucalypts towards low hills,
  wet bitumen with white edge lines, a single electric SUV far in the distance with its tail lights leaving a thin warm
  orange light trail. The left 45 percent of the frame is calm dark road verge and shadow for headline text. Wide
  horizontal composition, 2:1." For the phone version: "same scene, vertical 4:5, road rising through the upper
  half, the lower 55 percent quiet and dark for text."
- **Alt text**: decorative (`alt=""`); the hero heading carries the meaning.
- **Light and dark**: identical in both themes (the hero is always dark). Check the headline area stays under about
  15 percent luminance.

## 2. Section banners

One per top-level section, shown at the top of each section's index page. Size 1600 x 600 (8:3), WebP. Same CSS
hook as the hero would show them; each needs a one-line markup addition to its index page when the image lands.

| Section | Path | Prompt (after the prefix) | Alt text |
|---|---|---|---|
| Getting started | `content/assets/images/sections/getting-started.webp` | "A quiet suburban Australian driveway at dusk, a wall-mounted home EV charger glowing with a small warm orange status light, a cable coiled neatly, brick and render house, frangipani tree. Right half holds the subject, left half dark wall for text." | "A home EV charger on a garage wall at dusk" |
| Buying | `content/assets/images/sections/buying.webp` | "Overhead view of a set of keys, a folded paper checklist with no readable writing, and a phone on a dark concrete showroom floor, soft overcast window light, muted greys with one small warm orange highlight on a key fob edge." | "Car keys and a checklist on a showroom floor" |
| Models | `content/assets/images/sections/models.webp` | Not generated. Use a wide Lifestyle shot from the brand kit (`Zeekr Brand Lifestyle 100/`), cropped to 8:3. | Describe the car and setting in the chosen photo, e.g. "A Zeekr 7X on a coastal road at dusk" |
| Ownership | `content/assets/images/sections/ownership.webp` | "An empty Australian motorway service centre at blue hour with a row of DC fast chargers under a flat canopy, wet ground reflecting their white and small orange status lights, eucalypts beyond, no branding visible on the chargers." | "Fast chargers at a highway stop at dusk" |
| Community | `content/assets/images/sections/community.webp` | "A loose convoy of four generic modern SUVs, seen from far behind and above, on an empty Great Ocean Road style coastal road at golden-to-blue hour, sea cliffs and grey-green coastal scrub, tail lights making short orange trails." | "A convoy of cars on a coastal road at dusk" |
| Resources | `content/assets/images/sections/resources.webp` | "A minimal flat-lay on dark charcoal paper: a paper map of Australia with no legible text, a pencil, a brass compass and a Type 2 charging connector, cool overhead light, one warm orange accent from the connector's ring." | "A map of Australia with a charging connector and compass" |

Light and dark: banners sit in a dark panel in both themes, so the left text area must stay dark in every one.

## 3. Model pages (7X, X, 009)

- **Paths**: `content/assets/images/models/zeekr-7x-hero.webp`, `zeekr-x-hero.webp`, `zeekr-009-hero.webp`
- **Size**: 2400 x 1000 (12:5), WebP
- **Used**: behind the hero on each model's Overview page (`.hero-container hero-bg-7x` and so on; the classes are
  already there, so only the CSS hook is needed).
- **Not generated**: a generated "Zeekr" would be a fake car. Use the brand kit: `Zeekr Brand Lifestyle 100/` or the
  model folders in `Products logo/` and `Layout/`, cropped so the car sits in the right half.
- **Alt text**: decorative (`alt=""`), the hero heading names the model.
- **Lineup cards**: the home and Models page cards use 2:1 crops of the same banners
  (`content/assets/images/models/<model>-card*.{avif,webp}`); the earlier Zeekr front-45 renders are retired.

## 4. Share (Open Graph) images

- **Default**: `content/assets/img/og-default.png`, 1200 x 630, PNG. Currently a copy of the front door's share image so
  links look the same everywhere. A wiki-specific version is optional.
- **Wiki version, if wanted**: `content/assets/img/og-wiki.png`, 1200 x 630, PNG. Compose it by hand, not by
  generation, because it carries the badge: the Zeekr Insiders badge (`content/assets/img/logo-badge.png`) on the
  left over black `#000000`, a 2px Zeekr Orange rule along the bottom, and the right two thirds filled with the home
  hero photograph (section 1). Then set `extra.site.og_image` in `mkdocs.yml` to the new path.
- **Alt text** (`og:image:alt`): "Zeekr Insiders wiki".
- **Light and dark**: not applicable; share cards are always the dark version.

## 5. Illustrations

The wiki has no stock or placeholder art in its pages today. The one placeholder is in `main.py`
(`get_hero_image_path` falls back to `/images/placeholder-vehicle.jpg`, which does not exist); it is only reached by
template macros the published pages do not call. If those macros are used later, replace the fallback with a section
banner rather than a vehicle placeholder.

- **404 page**: `content/assets/images/illustrations/not-found.webp`, 1200 x 800 (3:2), WebP.
  Prompt: "An empty, dead-straight outback road at dusk running to a flat horizon, red dirt verges with spinifex, a
  single road sign seen from behind so its face is not visible, a faint warm orange glow on the horizon, deep blue-grey
  sky. Calm, slightly wry, no vehicles." Alt text: decorative (`alt=""`). Shown beside the 404 copy at desktop
  widths only; needs a one-line addition to `overrides/404.html`.

## 6. Icons

Use the existing sets first; nothing here should be generated as a bitmap.

- **Chrome** (masthead, footer, theme toggle, search, menu, back to top): the front door's own sprite, already copied
  to `overrides/.icons/zi/` from web-home `src/lib/components/IconSprite.svelte`.
- **Content**: the vendored Lucide set in `overrides/.icons/lucide/` (ISC), used through the `card_icon` and
  `spec_card` macros. The old hand-drawn set in `content/assets/icons/` has been removed.
- **Gaps worth filling**: look for a Lucide icon first. Otherwise draw one as SVG on the same grid (stroke 1.5, round
  caps and joins, `currentColor`, no fills) and save it to `overrides/.icons/zi/`, never into the vendored Lucide set:

| Icon | Used for | Reference prompt (for a sketch only; redraw as SVG) |
|---|---|---|
| `icon-solar` | "Charging from solar" sections | "Minimal single-weight line icon of a rooftop solar panel with a small sun above, 24px grid, round line caps, no fill, black on white." |
| `icon-v2l` | V2L adapter tips | "Minimal single-weight line icon of a power plug leaving a car side outlet, 24px grid, round caps, no fill." |
| `icon-state` | Resources by state | "Minimal single-weight line outline of the Australian mainland and Tasmania, simplified, 24px grid, no fill." |
| `icon-warranty` | Warranty and service | "Minimal single-weight line icon of a shield with a small spanner across it, 24px grid, round caps, no fill." |

Light and dark: line icons are recoloured by CSS to the page's ink colour in both themes, so draw them in black only.
