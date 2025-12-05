# ZEV Wiki Asset Structure

This document outlines the complete asset organization for the ZEV (Zeekr Enthusiasts of Victoria) wiki project.

## Directory Structure

```
images/
├── models/
│   └── 7x/                    # Model slug
│       └── 2025/              # Model year
│           ├── variants/      # Variant-specific assets
│           │   ├── rwd/
│           │   │   ├── hero.jpg
│           │   │   ├── hero_mobile.jpg
│           │   │   └── gallery/
│           │   │       ├── exterior/
│           │   │       ├── interior/
│           │   │       └── lifestyle/
│           │   ├── long-range-rwd/
│           │   │   ├── hero.jpg
│           │   │   ├── hero_mobile.jpg
│           │   │   └── gallery/
│           │   │       ├── exterior/
│           │   │       ├── interior/
│           │   │       └── lifestyle/
│           │   └── performance-awd/
│           │       ├── hero.jpg
│           │       ├── hero_mobile.jpg
│           │       └── gallery/
│           │           ├── exterior/
│           │           ├── interior/
│           │           └── lifestyle/
│           ├── colours/       # Colour option images
│           │   ├── exterior/
│           │   │   ├── onyx-black.jpg
│           │   │   ├── crystal-white.jpg
│           │   │   ├── tech-grey.jpg
│           │   │   ├── forest-green.jpg
│           │   │   └── blue-silver-roof.jpg
│           │   └── interior/
│           │       ├── black-vegan-leather.jpg
│           │       ├── black-grey-vegan-leather.jpg
│           │       └── purple-white-nappa-leather.jpg
│           ├── technical/     # Technical diagrams, cutaways
│           ├── downloads/     # Brochures, spec sheets
│           │   ├── brochure_rwd.pdf
│           │   ├── brochure_long-range-rwd.pdf
│           │   ├── brochure_performance-awd.pdf
│           │   └── specifications.pdf
│           ├── hero.jpg       # Main model hero image
│           ├── social_share.jpg  # Social media sharing image
│           └── gallery/       # General model gallery
└── brands/
    └── zeekr/
        ├── logo.svg
        └── brand_assets/
```

## Asset Guidelines

### Hero Images
- **Dimensions**: 1920x1080px (desktop), 768x1024px (mobile)
- **Format**: JPG, optimized for web
- **Content**: Clean product shots with consistent lighting and backgrounds

### Gallery Images
- **Dimensions**: 1200x800px minimum
- **Format**: JPG, optimized for web
- **Categories**:
  - **Exterior**: Front, rear, side, detail shots
  - **Interior**: Dashboard, seats, cargo, technology features
  - **Lifestyle**: In-use scenarios, charging, family situations

### Colour Images
- **Dimensions**: 800x600px
- **Format**: JPG, optimized for web
- **Content**: Clean colour swatches or vehicle in colour

### Technical Assets
- **Format**: SVG preferred, high-res PNG acceptable
- **Content**: Cutaway diagrams, technical illustrations, charging diagrams

### Downloads
- **Format**: PDF
- **Content**: Official brochures, specification sheets, press kits

## File Naming Conventions

- Use lowercase letters only
- Use hyphens (-) instead of spaces or underscores
- Follow the slug patterns defined in YAML data
- Example: `onyx-black.jpg`, `hero_mobile.jpg`, `brochure_rwd.pdf`

## Path References in YAML

All asset paths in the YAML files should be relative to the `/images/` directory:

```yaml
# Correct path references
hero_image: "models/7x/2025/variants/rwd/hero.jpg"
image_path: "models/7x/2025/colours/exterior/onyx-black.jpg"
gallery_path: "models/7x/2025/variants/rwd/gallery/"
```

## Production Deployment

In production, these assets will be served through the MkDocs static file handling system. Ensure all referenced assets exist to avoid broken images in the generated wiki.

## Future Models

When adding new models (X, 009), follow the same structure:

```
images/models/x/2025/...
images/models/009/2025/...
```

This consistent structure enables easy template reuse and automated processing.