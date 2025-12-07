# Quick Start - Zeekr Icons

## Step 1: Add CSS to mkdocs.yml

```yaml
extra_css:
  - stylesheets/zeekr.css
  - stylesheets/icons.css
```

## Step 2: Replace Emojis in Your Content

### Common Replacements

#### Homepage Hero Stats
**Before:**
```markdown
⚡ 800V Architecture
🔌 450 kW Max Charging
⏱️ 3.8s 0-100 km/h
💰 From $64,900
```

**After:**
```markdown
<img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V Architecture
<img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> 450 kW Max Charging
<img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 3.8s 0-100 km/h
<img src="/assets/icons/icon-price.svg" class="zi-icon" alt="Price"> From $64,900
```

#### Specification Lists
**Before:**
```markdown
- 🔋 100 kWh Battery
- 🏁 540 km Range
- ⚙️ Dual Motor AWD
- 🎯 310 kW Power
```

**After:**
```markdown
- <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> 100 kWh Battery
- <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> 540 km Range
- <img src="/assets/icons/icon-motor.svg" class="zi-icon" alt="Motor"> Dual Motor AWD
- <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> 310 kW Power
```

## Step 3: Copy & Paste Templates

### Template: Model Specifications Section
```markdown
## Key Specifications

### Powertrain
- <img src="/assets/icons/icon-motor.svg" class="zi-icon" alt="Motor"> **Motor**: Dual Motor AWD
- <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> **Power**: 310 kW (422 PS)
- <img src="/assets/icons/icon-torque.svg" class="zi-icon" alt="Torque"> **Torque**: 440 Nm
- <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> **Battery**: 100 kWh NMC
- <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> **Range**: 540 km (WLTP)

### Charging
- <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> **Architecture**: 800V
- <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> **Max DC**: 450 kW

### Performance
- <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> **0-100 km/h**: 3.8 seconds
- <img src="/assets/icons/icon-awd.svg" class="zi-icon" alt="AWD"> **Drive**: All-Wheel Drive

### Dimensions
- <img src="/assets/icons/icon-dimensions.svg" class="zi-icon" alt="Dimensions"> **L×W×H**: 4,880 × 1,970 × 1,640 mm
- <img src="/assets/icons/icon-wheelbase.svg" class="zi-icon" alt="Wheelbase"> **Wheelbase**: 3,000 mm
- <img src="/assets/icons/icon-bootspace.svg" class="zi-icon" alt="Boot"> **Boot**: 539 litres
- <img src="/assets/icons/icon-seating.svg" class="zi-icon" alt="Seating"> **Seating**: 5 seats
- <img src="/assets/icons/icon-ground-clearance.svg" class="zi-icon" alt="Clearance"> **Ground Clearance**: 200 mm
- <img src="/assets/icons/icon-kerb-weight.svg" class="zi-icon" alt="Weight"> **Kerb Weight**: 2,300 kg
```

### Template: Comparison Table
```markdown
| Specification | Zeekr 007 | Zeekr X |
|---------------|-----------|---------|
| <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> **Battery** | 100 kWh | 66 kWh |
| <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> **Range** | 540 km | 440 km |
| <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> **Power** | 310 kW | 200 kW |
| <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> **0-100** | 3.8s | 5.6s |
| <img src="/assets/icons/icon-wheelbase.svg" class="zi-icon" alt="Wheelbase"> **Wheelbase** | 3,000 mm | 2,750 mm |
| <img src="/assets/icons/icon-bootspace.svg" class="zi-icon" alt="Boot"> **Boot** | 539 L | 450 L |
```

### Template: Feature Grid
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
    <p>Adaptive ride height</p>
  </div>
  <div class="icon-grid-item">
    <img src="/assets/icons/icon-awd.svg" class="zi-icon" alt="AWD">
    <strong>All-Wheel Drive</strong>
    <p>Enhanced performance</p>
  </div>
  <div class="icon-grid-item">
    <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery">
    <strong>100 kWh Battery</strong>
    <p>Extended range capacity</p>
  </div>
</div>
```

## Icon Cheat Sheet

| What You Need | Icon File | Example Usage |
|---------------|-----------|---------------|
| Voltage/800V | `icon-voltage.svg` | <img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V |
| Charging Speed | `icon-charging-speed.svg` | <img src="/assets/icons/icon-charging-speed.svg" class="zi-icon" alt="Charging"> 450 kW |
| Acceleration | `icon-acceleration.svg` | <img src="/assets/icons/icon-acceleration.svg" class="zi-icon" alt="Acceleration"> 3.8s |
| Price | `icon-price.svg` | <img src="/assets/icons/icon-price.svg" class="zi-icon" alt="Price"> $64,900 |
| Battery | `icon-battery.svg` | <img src="/assets/icons/icon-battery.svg" class="zi-icon" alt="Battery"> 100 kWh |
| Range | `icon-range.svg` | <img src="/assets/icons/icon-range.svg" class="zi-icon" alt="Range"> 540 km |
| Motor | `icon-motor.svg` | <img src="/assets/icons/icon-motor.svg" class="zi-icon" alt="Motor"> Dual Motor |
| Power | `icon-power.svg` | <img src="/assets/icons/icon-power.svg" class="zi-icon" alt="Power"> 310 kW |
| Torque | `icon-torque.svg` | <img src="/assets/icons/icon-torque.svg" class="zi-icon" alt="Torque"> 440 Nm |
| Wheelbase | `icon-wheelbase.svg` | <img src="/assets/icons/icon-wheelbase.svg" class="zi-icon" alt="Wheelbase"> 3,000 mm |
| Boot Space | `icon-bootspace.svg` | <img src="/assets/icons/icon-bootspace.svg" class="zi-icon" alt="Boot"> 539 L |
| Dimensions | `icon-dimensions.svg` | <img src="/assets/icons/icon-dimensions.svg" class="zi-icon" alt="Dimensions"> L×W×H |
| Clearance | `icon-ground-clearance.svg` | <img src="/assets/icons/icon-ground-clearance.svg" class="zi-icon" alt="Clearance"> 200 mm |
| Weight | `icon-kerb-weight.svg` | <img src="/assets/icons/icon-kerb-weight.svg" class="zi-icon" alt="Weight"> 2,300 kg |
| Seating | `icon-seating.svg` | <img src="/assets/icons/icon-seating.svg" class="zi-icon" alt="Seating"> 5 seats |
| Air Suspension | `icon-air-suspension.svg` | <img src="/assets/icons/icon-air-suspension.svg" class="zi-icon" alt="Suspension"> Air |
| AWD | `icon-awd.svg` | <img src="/assets/icons/icon-awd.svg" class="zi-icon" alt="AWD"> AWD |
| RWD | `icon-rwd.svg` | <img src="/assets/icons/icon-rwd.svg" class="zi-icon" alt="RWD"> RWD |

## Size Modifiers

```markdown
<!-- Small (1em) -->
<img src="/assets/icons/icon-voltage.svg" class="zi-icon zi-icon--sm" alt="Voltage"> 800V

<!-- Default (1.5em) -->
<img src="/assets/icons/icon-voltage.svg" class="zi-icon" alt="Voltage"> 800V

<!-- Large (2em) -->
<img src="/assets/icons/icon-voltage.svg" class="zi-icon zi-icon--lg" alt="Voltage"> 800V

<!-- Extra Large (3em) -->
<img src="/assets/icons/icon-voltage.svg" class="zi-icon zi-icon--xl" alt="Voltage"> 800V
```

## Next Steps

1. Add `icons.css` to your `mkdocs.yml`
2. Find emojis in your content (search for: ⚡ 🔌 ⏱️ 💰 🔋 🏁 ⚙️)
3. Replace using the templates above
4. Test with `make run` to see the icons in both light and dark modes

For detailed documentation, see [USAGE.md](USAGE.md)
