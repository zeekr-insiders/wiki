# Claude AI Guidelines - ZEV Wiki

## Project Overview
Zeekr Enthusiasts of Victoria (ZEV) Wiki - MkDocs Material documentation site for Australian Zeekr car owners.

## Quick Commands
```bash
make install    # Install dependencies (uv sync)
make run        # Start dev server
make ready      # Pre-commit validation
make build      # Build static site
```

## Folder Structure Patterns

### Content Organization
```
content/
├── models/[model-name]/
│   ├── overview.md              # Model introduction
│   └── [year]/                  # Year-specific content
│       ├── specifications.md
│       ├── pricing.md
│       └── service-schedule.md
├── guides/[category]/
│   ├── overview.md             # Category overview
│   └── [specific-guide].md
├── club/[section]/
├── resources/
└── comparisons/
```

### File Naming Convention
- Use lowercase with hyphens: `service-schedule.md`
- Year folders: `2025/`, `2026/`
- Model names: `7x/`, `x/`, `009/`

## Content Standards

### Australian Localisation
- **Spelling**: colour, centre, organised, realise, authorised
- **Automotive**: tyres, windscreen, boot, bonnet, number plate
- **Currency**: $AUD, drive-away pricing
- **Location**: Victoria, Australia focus

### MkDocs Variables
Always use variables for club references:
```markdown
{{ extra.club.full_name }}      # "Zeekr Enthusiasts of Victoria (ZEV)"
{{ extra.club.name }}           # "Zeekr Enthusiasts of Victoria"
{{ extra.club.abbreviation }}   # "ZEV"
{{ extra.club.location }}       # "Victoria, Australia"
```

### Markdown Formatting
- Use proper bullet lists: `- item` not `→ item`
- Blank lines between sections
- Consistent heading structure (# ## ###)
- Australian English throughout

### CSS Classes
Use Zeekr-specific classes when appropriate:
```markdown
<div class="zeekr-hero">Hero content</div>
<div class="zeekr-card">Card content</div>
<span class="zeekr-highlight">Highlighted text</span>
```

## Navigation Structure
Models updated to 2025/2026 (not 2024). Follow existing pattern in mkdocs.yml.

## Templates
Reference `/templates/` directory for consistent content creation:
- `model-overview.md`
- `model-specifications.md`
- `guide-template.md`
- `event-report.md`

## Key Files
- `mkdocs.yml` - Site configuration with ZEV variables
- `pyproject.toml` - uv project dependencies
- `content/stylesheets/zeekr.css` - Custom Zeekr branding
- `structure.md` - Detailed contributor guidelines
- `Makefile` - Build and development commands

## Development Workflow
1. Content changes: Edit in `content/`
2. Test: `make run` (serves on localhost:8000)
3. Validate: `make ready` before commits
4. Deploy: `make deploy` (GitHub Pages)

## Notes for AI
- Maintain Australian English consistently
- Use MkDocs variables for all club references
- Follow established folder patterns
- Reference templates for new content
- Test changes with `make run` before finalising