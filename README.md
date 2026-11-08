# Zeekr Enthusiasts of Victoria (ZEV) Wiki

![Zeekr Logo](https://img.shields.io/badge/Zeekr-ZEV-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![MkDocs](https://img.shields.io/badge/MkDocs-Material-blue)
![License](https://img.shields.io/badge/License-MIT-green)

The official knowledge base for Zeekr Enthusiasts of Victoria (ZEV) - a comprehensive resource for Zeekr owners and enthusiasts in Victoria, Australia. This wiki provides detailed information about Zeekr models, ownership guides, club activities, and Australian-specific resources.

## About the Project

This MkDocs-powered wiki serves the Victoria, Australia Zeekr community with:

- **Detailed Model Information** - Specifications, pricing, and real-world reviews for all Zeekr models available in Australia
- **Comprehensive Guides** - From buying your first Zeekr to advanced ownership tips
- **Club Resources** - Events, group buys, and community information
- **Australian-Specific Content** - Service centres, charging networks, and local regulations
- **Community Contributions** - Real experiences from Victoria, Australia Zeekr owners

## Quick Start

### Prerequisites

- Python 3.8 or higher
- [uv](https://docs.astral.sh/uv/) (recommended) or pip

### Installation with uv (Recommended)

```bash
# Clone the repository
git clone https://github.com/zeekr-insiders/wiki.git
cd wiki

# Install dependencies using uv
uv sync

# Serve the site locally
uv run mkdocs serve
```

### Installation with pip

```bash
# Clone the repository
git clone https://github.com/zeekr-insiders/wiki.git
cd wiki

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -e .

# Serve the site locally
mkdocs serve
```

### Viewing the Wiki

After running `mkdocs serve`, open your browser to:
```
http://localhost:8000
```

The site will automatically reload when you make changes to the content.

## Project Structure

```
zeekr-wiki/
├── README.md                 # This file
├── structure.md             # Detailed contributor guide
├── pyproject.toml           # Project dependencies and metadata
├── mkdocs.yml              # MkDocs configuration
├── requirements.txt        # Legacy requirements file
└── content/                # All wiki content
    ├── index.md            # Homepage
    ├── models/             # Zeekr model information
    │   ├── 7x/            # Zeekr 7X specific content
    │   ├── x/             # Zeekr X specific content
    │   └── 009/           # Zeekr 009 specific content
    ├── guides/            # Ownership and technical guides
    │   ├── charging/      # Charging guides
    │   ├── ownership/     # Buying and ownership
    │   ├── maintenance/   # Service and care
    │   └── new-to-ev/     # First-time EV owner guides
    ├── club/              # ZEV Club info
    │   ├── events/        # Club events and meetups
    │   └── group-buys/    # Member group purchases
    ├── resources/         # Reference materials
    ├── comparisons/       # Model and brand comparisons
    └── stylesheets/       # Custom Zeekr branding
```

## Contributing

We welcome contributions from all ZEV members and the broader community!

### What You Can Contribute

- **Model Information** - Specifications, real-world range data, photos
- **Ownership Experiences** - Reviews, tips, lessons learned
- **Technical Guides** - Charging setups, modifications, troubleshooting
- **Local Resources** - Service centres, charging locations, road trip routes
- **Event Reports** - Club meetups, drives, and activities
- **Updates** - Pricing changes, new features, availability

### How to Propose a Change

1. Open the page on the wiki and follow **Suggest an edit** at the foot of the page (or **Contribute** in the site footer). It opens the page's Markdown source in GitHub's editor.
2. Make your change and propose it. GitHub forks the repository for you if you can't edit it directly, then opens a pull request.
3. A wiki maintainer reviews it before it goes live, and may ask questions on the pull request.

For bigger changes (a new page, a reorganised section), clone the repository and follow [Quick Start](#quick-start), then run `make ready` before opening a pull request.

### Sources

Every fact needs a source: publisher, title, URL and the date you accessed it. Cite it with a footnote marker after the fact, and add the entry under the page's `## Sources` heading in the same order and format as the others:

```markdown
The MY27 7X keeps the same prices [^1].

## Sources

[^1]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
```

The wiki shows each marker as a numbered superscript linked to its source. `make ready` fails if a marker has no entry or an entry is never cited.

### Spec cards

A model page's headline figures go in a spec card grid. Write one `spec_card` per figure inside a `zi-spec-grid` div, with no blank lines between them:

```markdown
<div class="zi-spec-grid">
{{ spec_card("luggage", "Boot", "539 / 1,978 L", "Seats up / folded") }}
{{ spec_card("caravan", "Towing", "2,000 / 750 kg", "Braked / unbraked") }}
</div>

The towing rating is for the MY25/MY26 car [^3].
```

The arguments are the icon, a short label, the value and an optional detail line. The icon is a file name (without `.svg`) in `overrides/.icons/lucide/`. Values never wrap. The grid sets its own columns from the number of cards. Cite the figures in the sentence after the grid, as citations can't go inside it.

To add an icon, copy it from the [Lucide](https://lucide.dev/icons/) release into `overrides/.icons/lucide/` unchanged.

### Videos

Embed a YouTube video with the `youtube` macro. It shows a local poster and loads YouTube (from youtube-nocookie.com) only when the reader presses play, so nothing reaches YouTube before then:

```markdown
{{ youtube("KlVyyYCinu4", "Video title as on YouTube", "Channel name", "https://www.youtube.com/@channel") }}
```

Save the poster first as `content/assets/images/video/<video id>.webp`, 1280 x 720 (YouTube's `maxresdefault.jpg` as WebP). Credit the channel in the page's Sources.

### Tables

Write tables as plain Markdown. Cells stay on one line, and a table wider than the column scrolls sideways rather than stacking its figures. `hooks/tables.py` lets a cell of running text wrap instead: over 40 characters, or 48 in the first column, where row labels run longer. In a table of three or more columns, a phrase over 22 characters outside the first column also wraps on desktop, so the table fits the column. Keep headers and row labels short so a table fits a phone with little scrolling.

### Content Guidelines

- Focus on Australian market and Victorian specifics
- Include real-world experiences and photos when possible
- Use Australian terminology and units (km, kWh, AUD)
- Verify information accuracy before submission
- Follow our [content structure guidelines](structure.md)
- Use MkDocs variables for club references (see below)

### MkDocs Variables for Club References

To maintain consistency across the wiki, always use MkDocs variables for club references instead of hardcoding the club name. The following variables are available in all content files:

#### Available Variables

```markdown
{{ extra.club.name }}          # "Zeekr Enthusiasts of Victoria"
{{ extra.club.abbreviation }}  # "ZEV"
{{ extra.club.full_name }}     # "Zeekr Enthusiasts of Victoria (ZEV)"
{{ extra.club.location }}      # "Victoria, Australia"
{{ extra.club.contact_url }}   # "https://zeekrinsiders.com.au/contact"
{{ extra.club.website }}       # "https://zeekrinsiders.com.au"
```

#### Usage Examples

**Correct:**
```markdown
Welcome to {{ extra.club.full_name }}!
Get in touch through [the contact form]({{ extra.club.contact_url }})
{{ extra.club.abbreviation }} is based in {{ extra.club.location }}
```

**Incorrect:**
```markdown
Welcome to Victoria Zeekr Club!
Contact us at [email needed]
VZC is based in Victoria, Australia
```

#### Why Use Variables?

- **Consistency**: Ensures uniform branding across all content
- **Maintainability**: Changes to club details update everywhere automatically
- **Future-proofing**: Easy to rebrand or update contact information
- **Professional**: Maintains consistent professional presentation

## Technology Stack

- **Static Site Generator**: [MkDocs](https://www.mkdocs.org/)
- **Theme**: [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- **Package Manager**: [uv](https://docs.astral.sh/uv/) with pyproject.toml
- **Deployment**: GitHub Pages
- **Content Format**: Markdown with extensions

### Key Features

- **Responsive Design** - Works perfectly on mobile and desktop
- **Dark/Light Mode** - Automatic theme switching
- **Advanced Search** - Full-text search with highlighting
- **Navigation** - Tabbed navigation with breadcrumbs
- **Code Highlighting** - Syntax highlighting for technical content
- **Custom Branding** - Zeekr-themed colours and styling

## Development

### Building for Production

```bash
# Build static site
uv run mkdocs build

# The built site will be in the site/ directory
```

### Adding Dependencies

```bash
# Add new dependency
uv add package-name

# Add development dependency
uv add --dev package-name
```

### Custom Styling

The wiki uses custom Zeekr branding in `content/stylesheets/`:
- `zeekr.css` - Zeekr brand colours and styling
- `nightowl.css` - Enhanced code highlighting

## Deployment

Merging to `main` publishes the wiki: `.github/workflows/deploy.yml` runs the strict build and the checks, then deploys to GitHub Pages at <https://wiki.zeekrinsiders.com.au>. Pull requests run the same checks without deploying. There is no manual deploy.

## Links

- **Live Site**: <https://wiki.zeekrinsiders.com.au>
- **Repository**: <https://github.com/zeekr-insiders/wiki>
- **Issues**: <https://github.com/zeekr-insiders/wiki/issues>
- **Club**: <https://zeekrinsiders.com.au>

## Support

### Getting Help

- **Technical Issues**: Create an issue on GitHub
- **Content Questions**: Contact the ZEV committee
- **General Inquiries**: Email [contact needed]

### Community

- **Club Meetings**: Monthly meetups across Melbourne
- **Online Groups**: WhatsApp and Facebook communities
- **Events**: Regular drives and technical sessions

## License

This project is licensed under the MIT Licence - see the [LICENCE](LICENCE) file for details.

The spec card icons in `overrides/.icons/lucide/` are from [Lucide](https://lucide.dev), ISC licence, copied unchanged; see `overrides/.icons/lucide/LICENSE-lucide.txt`.

## Acknowledgments

- ZEV committee and members
- All contributors who share their Zeekr experiences
- The MkDocs and Material theme communities
- Zeekr Australia for ongoing support

---

*Built with ❤️ by the ZEV community*

*Last updated: September 2024*