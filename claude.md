# Claude AI Guidelines - Zeekr Insiders Wiki

## Project Overview

**Zeekr Insiders Australia** - A community-driven wiki helping Australian Zeekr owners learn, discover, and master their vehicles. This is a reference companion to the community forum (separate platform).

**Philosophy:** Friendly, helpful, no-nonsense. We're fellow owners sharing knowledge, not a marketing brochure. Write like you're explaining something to a mate who just bought their first EV.

## Quick Commands

```bash
make install    # Install dependencies (uv sync)
make run        # Start dev server (localhost:8000)
make ready      # Pre-commit validation
make build      # Build static site
make deploy     # Deploy to GitHub Pages
```

## Site Architecture

### User Journey-Centric Structure

The wiki is organised around the owner journey, not arbitrary categories:

```
content/
├── index.md                    # Home - Welcome & navigation
├── getting-started/            # NEW TO EVs & ZEEKR
│   ├── index.md
│   ├── ev-basics.md            # Why EV? Charging 101
│   ├── why-zeekr.md            # Brand overview, 800V advantage
│   └── choosing-model.md       # Which Zeekr is right for you?
│
├── buying/                     # PRE-PURCHASE
│   ├── index.md
│   ├── dealers.md              # Dealer locations by state
│   ├── pricing.md              # Current pricing, what to expect
│   ├── finance.md              # Salary sacrifice, novated lease
│   └── delivery.md             # Timeline, checklist, what to check
│
├── models/                     # REFERENCE (keep deep)
│   ├── index.md
│   ├── 7x/
│   │   ├── overview.md
│   │   ├── specifications.md
│   │   ├── known-issues.md
│   │   └── tips.md
│   ├── x/
│   └── 009/
│
├── ownership/                  # POST-PURCHASE
│   ├── index.md
│   ├── first-30-days.md
│   ├── charging/
│   │   ├── home-setup.md
│   │   ├── public-networks.md
│   │   └── road-trips.md
│   ├── maintenance/
│   ├── insurance.md
│   └── accessories/
│       ├── index.md
│       ├── protection.md       # Tinting, PPF, ceramic
│       ├── recommended.md      # Community-vetted accessories
│       └── vendors.md          # Trusted installers by state
│
├── community/                  # CLUB & RESOURCES
│   ├── index.md                # About Zeekr Insiders
│   ├── events.md
│   ├── group-buys.md
│   └── forum.md                # Link to external forum
│
└── resources/                  # REFERENCE MATERIALS
    ├── index.md
    ├── by-state/               # State-specific info
    │   ├── vic.md
    │   ├── nsw.md
    │   └── ...
    ├── apps.md                 # Useful apps
    └── links.md                # External resources
```

### File Naming

- Lowercase with hyphens: `home-setup.md`, `known-issues.md`
- Directories for groupings: `charging/`, `accessories/`
- Year folders only for model specs: `models/7x/2025/`

## Content Standards

### Voice & Tone

**DO:**
- Write conversationally: "You'll want to..." not "Users should..."
- Be direct and practical: "Here's what actually matters"
- Share real experiences: "Most owners find that..."
- Acknowledge uncertainty: "This may vary" or "Check with your dealer"

**DON'T:**
- Marketing speak: "Experience the future of mobility"
- Jargon without explanation
- Overpromise or hype features
- Assume everyone knows EV terminology

**Examples:**

| Instead of... | Write... |
|---------------|----------|
| "The revolutionary 800V architecture delivers unprecedented charging speeds" | "The 800V system means you actually get fast charging speeds - 10-80% in about 15 minutes on a good charger" |
| "Zeekr owners enjoy premium features" | "You get heated seats, a big screen, and a decent sound system as standard" |
| "Visit an authorised dealer" | "Pop into your local Zeekr dealer" |

### Australian Localisation

**Spelling:**
- colour, centre, organised, realise, authorised, licence, metre, tyre

**Automotive Terms:**
- boot (not trunk), bonnet (not hood), windscreen (not windshield)
- number plate (not license plate), indicator (not blinker)
- petrol (when comparing to ICE), rego (registration)

**Currency & Pricing:**
- Always AUD: "$63,900" or "$63,900 AUD"
- Include "+ ORC" or "drive-away" context
- Reference RRP vs actual pricing where relevant

### Markdown Formatting

**CRITICAL: List Spacing**

MkDocs requires a blank line before lists. This is a common source of rendering bugs.

```markdown
### Heading

- Item one
- Item two

NOT:

### Heading
- Item one (BROKEN - renders inline)
- Item two
```

**General Rules:**

- One blank line after headings before content
- One blank line before and after lists
- One blank line before and after code blocks
- One blank line before and after admonitions
- Use `- ` for unordered lists (not `* ` or `→`)

**Admonitions:**

```markdown
!!! tip "Quick Tip"
    Helpful information here.

!!! warning "Watch Out"
    Important caution.

!!! info "Good to Know"
    Additional context.
```

### MkDocs Variables

Use variables for dynamic content:

```markdown
{{ extra.club.full_name }}      # "Zeekr Insiders Australia"
{{ extra.club.name }}           # "Zeekr Insiders"
{{ extra.club.abbreviation }}   # "ZI"
{{ extra.club.location }}       # "Australia"
```

### Internal Links

Use relative paths with `.md` extension:

```markdown
[See charging guide](../ownership/charging/home-setup.md)
[7X specifications](../models/7x/specifications.md)
```

For index files in directories:

```markdown
[Ownership section](../ownership/index.md)
```

### CSS Classes

Available custom classes in `stylesheets/zeekr.css`:

```html
<div class="hero-container hero-bg-7x">
    <div class="hero-content">
        <div class="hero-title">Title</div>
        <div class="hero-subtitle">Subtitle</div>
    </div>
</div>

<div class="card-grid">
    <div class="z-card">Card content</div>
    <div class="z-card featured">Featured card</div>
</div>

<div class="stats-row">
    <div class="stat-box">
        <img src="PATH/assets/icons/icon-range.svg" class="zi-icon zi-icon--xl" alt="">
        <span class="val">615km</span>
        <span class="lbl">Range</span>
    </div>
</div>
```

### Custom SVG Icon System

**Location:** `content/assets/icons/`

**Available Icons:**
| Icon | File | Use For |
|------|------|---------|
| Voltage | `icon-voltage.svg` | 800V architecture |
| Charging | `icon-charging-speed.svg` | Charge times, DC charging |
| Acceleration | `icon-acceleration.svg` | 0-100 km/h stats |
| Price | `icon-price.svg` | Pricing, costs |
| Battery | `icon-battery.svg` | Battery capacity |
| Range | `icon-range.svg` | WLTP range |
| Power | `icon-power.svg` | kW, motors |
| Torque | `icon-torque.svg` | Nm torque |
| Wheelbase | `icon-wheelbase.svg` | Dimensions |
| Bootspace | `icon-bootspace.svg` | Boot/frunk capacity |
| Ground Clearance | `icon-ground-clearance.svg` | Clearance |
| Kerb Weight | `icon-kerb-weight.svg` | Weight, towing |
| Seating | `icon-seating.svg` | Seat configs |
| Air Suspension | `icon-air-suspension.svg` | Suspension |
| AWD/RWD | `icon-awd.svg`, `icon-rwd.svg` | Drivetrain |

**Usage in Markdown:**
```html
<!-- In stat boxes (model pages) -->
<div class="stat-box">
    <img src="../../../assets/icons/icon-voltage.svg" class="zi-icon zi-icon--xl" alt="">
    <span class="val">800V</span>
    <span class="lbl">Architecture</span>
</div>

<!-- Inline with headings -->
### <img src="../assets/icons/icon-wheelbase.svg" class="zi-icon" alt=""> Zeekr 7X
```

**Path Calculation (CRITICAL):**
Count directory levels from your markdown file to `content/`:
- `content/index.md` → `assets/icons/...`
- `content/models/index.md` → `../assets/icons/...`
- `content/models/7x/overview.md` → `../../assets/icons/...` ✗ WRONG!
- `content/models/7x/overview.md` → `../../../assets/icons/...` ✓ CORRECT

MkDocs renders pages with trailing slash (e.g., `/models/7x/overview/`), adding an extra level. **Always add one more `../` than you'd expect.**

**Theme Awareness:**
A CSS filter in `zeekr.css` draws icons in the page's ink colour (Carbon on light, Arctic White on dark), never orange, to match the front door. Draw new SVGs in black with `stroke="currentColor"`; no need to colour them.

## Key Files

| File | Purpose |
|------|---------|
| `mkdocs.yml` | Site config, navigation, variables |
| `content/stylesheets/zeekr.css` | The whole theme: the front door's tokens, icon colouring, the On this page panel |
| `overrides/` | Masthead, footer, header, ToC and 404 templates matching the front door; `.icons/zi/` holds its glyphs |
| `docs/image-brief.md` | Images and icons still to make, with prompts |
| `content/assets/icons/` | Custom SVG icons (18 icons) |
| `pyproject.toml` | Python dependencies (uv) |
| `Makefile` | Build commands |
| `main.py` | Custom macros for MkDocs |

## Development Workflow

1. **Edit content** in `content/` directory
2. **Preview locally**: `make run` → http://localhost:8000/
3. **Check for issues**: Watch terminal for warnings
4. **Validate**: `make ready` before committing
5. **Deploy**: `make deploy` pushes to GitHub Pages

## Common Tasks

### Adding a New Page

1. Create `.md` file in appropriate directory
2. Add to `nav:` section in `mkdocs.yml`
3. Ensure blank lines before lists/code blocks
4. Test with `make run`

### Updating Model Information

- Specs go in `models/[model]/specifications.md`
- Pricing in `models/[model]/pricing.md` or `buying/pricing.md`
- Issues in `models/[model]/known-issues.md`

### Adding State-Specific Info

- Use `resources/by-state/[state].md`
- Include: incentives, dealers, charging, service centres

## AI Assistant Notes

When working on this project:

1. **Always use Australian English** - Check spelling
2. **Maintain friendly tone** - We're mates, not salespeople
3. **Blank lines matter** - Lists break without them
4. **Use variables** - `{{ extra.club.name }}` not hardcoded names
5. **Test changes** - `make run` catches most issues
6. **Relative links with .md** - Avoid bare directory links
7. **Keep it practical** - Real advice > marketing fluff
8. **No emojis** - Use custom SVG icons from `assets/icons/` instead
9. **Icon paths need extra `../`** - MkDocs adds a directory level when rendering
