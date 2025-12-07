# Zeekr Icon System - Usage Guide

## Overview
Custom SVG icon system for the Zeekr Insiders Australia wiki. All icons are theme-aware (light/dark mode) using `currentColor` and follow a consistent 24x24 design language.

## Setup

### 1. Include CSS in mkdocs.yml
Add to your `extra_css` section:
```yaml
extra_css:
  - stylesheets/zeekr.css
  - stylesheets/icons.css
```

### 2. Using Icons in Markdown

#### Basic Inline Usage
```markdown
<img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V Architecture

<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> 100 kWh Battery Pack
```

#### In Lists
```markdown
- <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> Up to 540 km WLTP range
- <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> 450 kW max charging speed
- <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 0-100 km/h in 3.8s
```

#### Size Variants
```markdown
<!-- Small -->
<img src="/assets/icons/icon-power.svg" class="zi-icon zi-icon--sm" alt="Power"> 310 kW

<!-- Default (1.5em) -->
<img src="/assets/icons/icon-torque.svg" class="zi-icon" alt="Torque"> 440 Nm

<!-- Large -->
<img src="/assets/icons/icon-motor.svg" class="zi-icon zi-icon--lg" alt="Motor"> Dual Motor AWD

<!-- Extra Large -->
<img src="/assets/icons/icon-awd.svg" class="zi-icon zi-icon--xl" alt="AWD"> All-Wheel Drive
```

#### In Tables
```markdown
| Specification | Value |
|---------------|-------|
| <img src="/assets/icons/icon-wheelbase.svg" class="zi-icon" alt="Wheelbase"> Wheelbase | 3,000 mm |
| <img src="/assets/icons/icon-bootspace.svg" class="zi-icon" alt="Boot"> Boot Space | 539 litres |
| <img src="/assets/icons/icon-seating.svg" class="zi-icon" alt="Seating"> Seating | 5 seats |
```

#### Hero Stats (Large Display)
```html
<div class="hero-stat">
  <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage">
  <h3>800V</h3>
  <p>Architecture</p>
</div>
```

#### Stat Cards
```html
<div class="stat-card">
  <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging">
  <strong>450 kW</strong>
  <span>Max Charging</span>
</div>
```

## Icon Reference

### Key Stats (Homepage)
| Icon | File | Use Case |
|------|------|----------|
| <img src="/assets/icons/icon-voltage.svg" width="24"> | `icon-voltage.svg` | 800V architecture |
| <img src="/assets/icons/icon-charging-speed.svg" width="24"> | `icon-charging-speed.svg` | Charging speed (kW) |
| <img src="/assets/icons/icon-acceleration.svg" width="24"> | `icon-acceleration.svg` | 0-100 km/h time |
| <img src="/assets/icons/icon-price.svg" width="24"> | `icon-price.svg` | Starting price / pricing |

### Specifications
| Icon | File | Use Case |
|------|------|----------|
| <img src="/assets/icons/icon-wheelbase.svg" width="24"> | `icon-wheelbase.svg` | Wheelbase measurement |
| <img src="/assets/icons/icon-bootspace.svg" width="24"> | `icon-bootspace.svg` | Boot/cargo capacity |
| <img src="/assets/icons/icon-dimensions.svg" width="24"> | `icon-dimensions.svg` | L×W×H dimensions |
| <img src="/assets/icons/icon-ground-clearance.svg" width="24"> | `icon-ground-clearance.svg` | Ground clearance |
| <img src="/assets/icons/icon-kerb-weight.svg" width="24"> | `icon-kerb-weight.svg` | Kerb weight |
| <img src="/assets/icons/icon-seating.svg" width="24"> | `icon-seating.svg` | Seating capacity |

### Powertrain & Performance
| Icon | File | Use Case |
|------|------|----------|
| <img src="/assets/icons/icon-battery.svg" width="24"> | `icon-battery.svg` | Battery capacity (kWh) |
| <img src="/assets/icons/icon-range.svg" width="24"> | `icon-range.svg` | Driving range (km) |
| <img src="/assets/icons/icon-motor.svg" width="24"> | `icon-motor.svg` | Motor type/config |
| <img src="/assets/icons/icon-torque.svg" width="24"> | `icon-torque.svg` | Torque (Nm) |
| <img src="/assets/icons/icon-power.svg" width="24"> | `icon-power.svg` | Power output (kW) |

### Features
| Icon | File | Use Case |
|------|------|----------|
| <img src="/assets/icons/icon-air-suspension.svg" width="24"> | `icon-air-suspension.svg` | Air suspension feature |
| <img src="/assets/icons/icon-awd.svg" width="24"> | `icon-awd.svg` | All-wheel drive |
| <img src="/assets/icons/icon-rwd.svg" width="24"> | `icon-rwd.svg` | Rear-wheel drive |

## Best Practices

### 1. Consistency
- Use the same icon for the same specification across all pages
- Maintain consistent sizing within sections
- Always include meaningful `alt` attributes for accessibility

### 2. Theme Compatibility
- Icons automatically adapt to light/dark themes via `currentColor`
- No need to create separate versions for different themes
- Test in both modes to ensure visibility

### 3. Performance
- SVGs are lightweight (~1-2 KB each)
- Inline small icons directly in HTML for critical above-the-fold content
- Reference files for content that can lazy-load

### 4. Accessibility
```markdown
<!-- Good: Descriptive alt text -->
<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery capacity">

<!-- Avoid: Generic alt text -->
<img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Icon">
```

### 5. Responsive Design
Icons automatically scale with text size. For mobile optimization:
```html
<!-- Desktop: Large icons in hero -->
<div class="hero-stat">
  <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage">
  <h3>800V</h3>
</div>

<!-- Mobile: Automatically smaller via CSS media queries -->
```

## Examples by Context

### Specification Sheet
```markdown
## Powertrain

- <img src="/assets/icons/icon-motor.svg" class="zi-icon" alt="Motor"> **Motor**: Dual Motor AWD
- <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> **Power**: 310 kW (422 PS)
- <img src="/assets/icons/icon-torque.svg" class="zi-icon" alt="Torque"> **Torque**: 440 Nm
- <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> **Battery**: 100 kWh NMC
- <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> **Range**: Up to 540 km (WLTP)

## Charging

- <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> **Architecture**: 800V
- <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> **Max DC**: 450 kW peak

## Dimensions

- <img src="/assets/icons/icon-dimensions.svg" class="zi-icon" alt="Dimensions"> **L×W×H**: 4,880 × 1,970 × 1,640 mm
- <img src="/assets/icons/icon-wheelbase.svg" class="zi-icon" alt="Wheelbase"> **Wheelbase**: 3,000 mm
- <img src="/assets/icons/icon-bootspace.svg" class="zi-icon" alt="Boot"> **Boot**: 539 litres
- <img src="/assets/icons/icon-ground-clearance.svg" class="zi-icon" alt="Clearance"> **Ground Clearance**: 200 mm
```

### Comparison Table
```markdown
| Feature | Zeekr 007 | Zeekr X |
|---------|-----------|---------|
| <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> Battery | 100 kWh | 66 kWh |
| <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> Range | 540 km | 440 km |
| <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> Power | 310 kW | 200 kW |
| <img src="/assets/icons/icon-awd.svg" class="zi-icon" alt="Drive"> Drive | AWD | RWD |
```

### Feature Highlights
```html
<div class="icon-grid">
  <div class="icon-grid-item">
    <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="800V">
    <strong>800V Architecture</strong>
    <p>Ultra-fast charging capability</p>
  </div>
  <div class="icon-grid-item">
    <img src="/assets/icons/icon-air-suspension.svg" class="zi-icon" alt="Suspension">
    <strong>Air Suspension</strong>
    <p>Adaptive ride height control</p>
  </div>
  <div class="icon-grid-item">
    <img src="/assets/icons/icon-awd.svg" class="zi-icon" alt="AWD">
    <strong>All-Wheel Drive</strong>
    <p>Enhanced traction and performance</p>
  </div>
</div>
```

## Colour Variants (Optional)

For emphasising key stats:
```html
<!-- Primary colour (Zeekr brand colour) -->
<img src="/assets/icons/icon-voltage.svg" class="zi-icon zi-icon--primary" alt="Voltage"> 800V

<!-- Accent colour -->
<img src="/assets/icons/icon-charging-speed.svg" class="zi-icon zi-icon--accent" alt="Charging"> 450 kW
```

## Interactive Icons

For clickable icons or hover effects:
```html
<a href="/models/007/specifications/">
  <img src="/assets/icons/icon-battery.svg" class="zi-icon zi-icon--interactive" alt="View specs">
  View Full Specifications
</a>
```

## Migration from Emojis

### Before
```markdown
- ⚡ 800V Architecture
- 🔌 450 kW Max Charging
- ⏱️ 0-100 km/h in 3.8s
- 💰 Starting from $64,900
```

### After
```markdown
- <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V Architecture
- <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> 450 kW Max Charging
- <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 0-100 km/h in 3.8s
- <img src="/assets/icons/icon-price.svg" class="zi-icon" alt="Price"> Starting from $64,900
```

## Troubleshooting

### Icons not displaying
1. Check that `icons.css` is included in `mkdocs.yml`
2. Verify file paths are correct (absolute paths from site root)
3. Ensure SVG files are present in `/content/assets/icons/`

### Icons too large/small
1. Use size modifier classes: `zi-icon--sm`, `zi-icon--lg`, `zi-icon--xl`
2. Check parent container's font-size (icons scale with text)
3. Add custom CSS for specific use cases

### Icons not changing colour in dark mode
1. Ensure SVG uses `stroke="currentColor"` (already set in all icons)
2. Check that custom CSS isn't overriding with fixed colours
3. Verify theme CSS is loading correctly

## Future Enhancements

Potential additions to the icon system:
- Safety feature icons (AEB, LKA, BSD, etc.)
- Connectivity icons (5G, OTA updates, app integration)
- Comfort feature icons (heated seats, massage, climate zones)
- Charging network icons (NACS, CCS2, destination charging)

---

**Maintained by**: Zeekr Insiders Australia
**Last Updated**: December 2025
**Icon Count**: 18 custom SVG icons
