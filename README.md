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
git clone https://github.com/thushan/zeekr.git
cd zeekr

# Install dependencies using uv
uv sync

# Serve the site locally
uv run mkdocs serve
```

### Installation with pip

```bash
# Clone the repository
git clone https://github.com/thushan/zeekr.git
cd zeekr

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

### How to Contribute

1. **For Club Members**: Contact the committee or use our content management system
2. **For Developers**: See our [detailed contributor guide](structure.md)
3. **For Quick Updates**: Submit an issue on GitHub

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

The wiki is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

### Manual Deployment

```bash
# Deploy to GitHub Pages
uv run mkdocs gh-deploy
```

## Links

- **Live Site**: [https://thushan.github.io/zeekr/](https://thushan.github.io/zeekr/)
- **Repository**: [https://github.com/thushan/zeekr](https://github.com/thushan/zeekr)
- **Issues**: [https://github.com/thushan/zeekr/issues](https://github.com/thushan/zeekr/issues)
- **ZEV Club**: https://zev.club

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

## Acknowledgments

- ZEV committee and members
- All contributors who share their Zeekr experiences
- The MkDocs and Material theme communities
- Zeekr Australia for ongoing support

---

*Built with ❤️ by the ZEV community*

*Last updated: September 2024*