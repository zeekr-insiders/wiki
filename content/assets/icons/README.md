# Zeekr Icon System

A premium, theme-aware SVG icon system designed specifically for the Zeekr Insiders Australia wiki.

## Overview

This icon system replaces generic emojis with custom, professionally-designed SVG icons that match Zeekr's premium automotive aesthetic. All icons are:

- **Theme-aware**: Automatically adapt to light/dark modes using `currentColor`
- **Consistent**: 24x24 viewBox, 2px stroke width, rounded linecaps
- **Lightweight**: Each icon is ~200-500 bytes
- **Accessible**: Semantic alt text support
- **Scalable**: Vector graphics that look sharp at any size

## Quick Start

### 1. Add CSS to mkdocs.yml

```yaml
extra_css:
  - stylesheets/zeekr.css
  - stylesheets/icons.css
```

### 2. Use in Markdown

```markdown
<img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V Architecture
```

For detailed examples, see [QUICK-START.md](QUICK-START.md)

## Icon Inventory

### Key Stats (4 icons)
- `icon-voltage.svg` - 800V architecture
- `icon-charging-speed.svg` - Charging speed
- `icon-acceleration.svg` - 0-100 km/h performance
- `icon-price.svg` - Pricing information

### Specifications (6 icons)
- `icon-wheelbase.svg` - Wheelbase measurement
- `icon-bootspace.svg` - Boot/cargo capacity
- `icon-dimensions.svg` - L×W×H dimensions
- `icon-ground-clearance.svg` - Ground clearance
- `icon-kerb-weight.svg` - Vehicle weight
- `icon-seating.svg` - Seating capacity

### Powertrain (5 icons)
- `icon-battery.svg` - Battery capacity
- `icon-range.svg` - Driving range
- `icon-motor.svg` - Motor configuration
- `icon-torque.svg` - Torque output
- `icon-power.svg` - Power output

### Features (3 icons)
- `icon-air-suspension.svg` - Air suspension
- `icon-awd.svg` - All-wheel drive
- `icon-rwd.svg` - Rear-wheel drive

**Total: 18 icons**

## File Structure

```
content/
├── assets/
│   └── icons/
│       ├── icon-*.svg              # 18 icon files
│       ├── README.md               # This file
│       ├── USAGE.md                # Detailed usage guide
│       ├── QUICK-START.md          # Quick reference
│       └── preview.html            # Visual preview (open in browser)
└── stylesheets/
    ├── zeekr.css                   # Existing Zeekr styles
    └── icons.css                   # Icon-specific styles
```

## Visual Preview

Open `preview.html` in your browser to see all icons in both light and dark themes.

```bash
# Windows
start content/assets/icons/preview.html

# macOS
open content/assets/icons/preview.html

# Linux
xdg-open content/assets/icons/preview.html
```

## Usage Examples

### Basic Inline
```markdown
<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> 100 kWh
```

### Size Variants
```markdown
<!-- Small (1em) -->
<img src="/assets/icons/icon-power.svg" class="zi-icon zi-icon--sm" alt="Power"> 310 kW

<!-- Large (2em) -->
<img src="/assets/icons/icon-motor.svg" class="zi-icon zi-icon--lg" alt="Motor"> Dual Motor

<!-- Extra Large (3em) -->
<img src="/assets/icons/icon-awd.svg" class="zi-icon zi-icon--xl" alt="AWD"> AWD
```

### In Lists
```markdown
- <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> 540 km WLTP
- <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V system
- <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 3.8s 0-100
```

### In Tables
```markdown
| Spec | Zeekr 007 | Zeekr X |
|------|-----------|---------|
| <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> Battery | 100 kWh | 66 kWh |
| <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> Range | 540 km | 440 km |
```

## Design Principles

### Automotive-Inspired
Each icon is designed specifically for automotive specifications, not generic use. The icons reference actual automotive design elements (wheels, batteries, suspension components).

### Minimal & Clean
- Simple geometric shapes
- No unnecessary detail
- Consistent stroke weight (2px)
- Rounded corners and linecaps

### Theme Integration
Icons use `stroke="currentColor"` to inherit text colour from the theme:
- Light mode: Dark icons on light background
- Dark mode: Light icons on dark background
- No manual colour management needed

### Scalable Architecture
Icons work at multiple sizes without quality loss:
- Small (1em): Inline with text
- Default (1.5em): Lists and tables
- Large (2-3em): Feature cards
- Extra large (4em+): Hero sections

## Migration from Emojis

### Find & Replace Guide

| Old Emoji | New Icon | File |
|-----------|----------|------|
| ⚡ | Voltage | `icon-voltage.svg` |
| 🔌 | Charging | `icon-charging-speed.svg` |
| ⏱️ | Acceleration | `icon-acceleration.svg` |
| 💰 | Price | `icon-price.svg` |
| 🔋 | Battery | `icon-battery.svg` |
| 🏁 | Range | `icon-range.svg` |
| ⚙️ | Motor | `icon-motor.svg` |

### Example Conversion

**Before:**
```markdown
⚡ 800V Architecture
🔌 450 kW Charging
⏱️ 3.8s 0-100 km/h
```

**After:**
```markdown
<img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V Architecture
<img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> 450 kW Charging
<img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 3.8s 0-100 km/h
```

## CSS Classes

### Base Class
- `.zi-icon` - Base icon styling (1.5em, inline-block, currentColor)

### Size Modifiers
- `.zi-icon--sm` - Small (1em)
- `.zi-icon--lg` - Large (2em)
- `.zi-icon--xl` - Extra large (3em)

### Context Modifiers
- `.zi-icon--primary` - Uses theme primary colour
- `.zi-icon--accent` - Uses theme accent colour
- `.zi-icon--interactive` - Adds hover effects
- `.zi-icon--standalone` - Removes right margin

### Contextual Sizing
Icons automatically resize in these contexts:
- `.stat-card .zi-icon` - 2.5em
- `.hero-stat .zi-icon` - 3em
- `.spec-item .zi-icon` - 1.25em
- `td .zi-icon` - 1.25em
- `p .zi-icon` - 1.1em

## Documentation

- **README.md** (this file) - Overview and quick reference
- **QUICK-START.md** - Copy-paste templates and cheat sheet
- **USAGE.md** - Comprehensive usage guide with examples
- **preview.html** - Visual browser preview with theme toggle

## Browser Support

These SVG icons work in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

### Alt Text
Always include meaningful `alt` attributes:
```markdown
<!-- Good -->
<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery capacity">

<!-- Avoid -->
<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="icon">
```

### Screen Readers
Icons with adjacent text are read as: "Battery capacity image, 100 kWh"

### Keyboard Navigation
Icons in links are fully keyboard navigable when wrapped in `<a>` tags.

## Performance

### File Sizes
- Individual SVG: ~200-500 bytes each
- Total icon system: ~6 KB (all 18 icons)
- CSS: 2.2 KB
- **Total overhead: ~8.2 KB** (minified)

### Loading Strategy
- Icons load with content (no lazy loading needed due to small size)
- No external dependencies
- No JavaScript required
- Browser cache-friendly

## Maintenance

### Adding New Icons
1. Follow the SVG template:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
     <!-- paths here -->
   </svg>
   ```
2. Use 24x24 viewBox
3. 2px stroke weight
4. Round linecaps/joins
5. No fill (stroke only)
6. Test in both light/dark themes

### Naming Convention
- Prefix: `icon-`
- Lowercase with hyphens: `icon-new-feature.svg`
- Descriptive: `icon-charging-speed.svg` not `icon-plug.svg`

## Troubleshooting

### Icons not displaying
1. Check `icons.css` is in `mkdocs.yml` under `extra_css`
2. Verify file path is correct (absolute from site root: `/assets/icons/`)
3. Check SVG files exist in `content/assets/icons/`

### Icons wrong size
1. Use size modifier classes: `zi-icon--sm`, `zi-icon--lg`, `zi-icon--xl`
2. Icons scale with parent font-size
3. Check for conflicting CSS

### Icons wrong colour
1. Ensure SVG uses `stroke="currentColor"` (already set)
2. Check theme CSS is loading
3. Verify no custom CSS overrides with fixed colours

### Icons not adapting to dark mode
1. Confirm `currentColor` is used (already set in all icons)
2. Check Material theme is configured for dark mode
3. Test theme toggle functionality

## Future Enhancements

Potential additions:
- Safety icons (AEB, LKA, BSD)
- Connectivity icons (5G, OTA, app)
- Comfort icons (heated seats, climate)
- Charging network icons (NACS, CCS2)
- Tyre/wheel icons
- Warranty/service icons

## Credits

**Designed for**: Zeekr Insiders Australia
**Created**: December 2025
**Icon Count**: 18 custom SVG icons
**Design Style**: Automotive minimal line icons
**Theme**: Material Design compatible

## License

These icons are custom-designed for the Zeekr Insiders Australia wiki. Please maintain attribution if reusing in other Zeekr community projects.

---

For questions or icon requests, please open an issue in the repository.
