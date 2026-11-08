---
title: NMC vs LFP batteries
description: What the two common EV battery chemistries are, how they differ, and which Zeekr grades in Australia use which.
last_checked: 2026-11-08
---

# NMC vs LFP batteries

*Last checked: 8 November 2026.*

Nearly every EV battery sold in Australia is a lithium-ion pack, and most use one of two cathode chemistries: **NMC** (nickel manganese cobalt) or **LFP** (lithium iron phosphate). Zeekr uses both, so it is worth knowing which one you own. It changes how you should charge, see [Charging to 80% vs 100%](charging-80-vs-100.md).

!!! tip "Quick answer"
    NMC packs the most energy into the least weight. LFP is tougher, tolerates more charge cycles and handles full charges better. Zeekr fits LFP to its entry grades and NMC to its bigger-battery and performance grades.

## The two chemistries

| | NMC | LFP |
| :--- | :--- | :--- |
| Full name | Lithium nickel manganese cobalt oxide | Lithium iron phosphate |
| Specific energy (energy per kg of cell) | 150 to 220 Wh/kg [^1] | 90 to 120 Wh/kg [^1] |
| Nominal cell voltage | 3.6 to 3.7 V [^1] | 3.2 to 3.3 V [^1] |
| Cycle life (depends on depth of discharge and temperature) | 1,000 to 2,000 cycles [^1] | 2,000 and higher [^1] |
| Thermal runaway onset | about 210 °C, and a high charge promotes it [^1] | about 270 °C, "very safe" even fully charged [^1] |
| Voltage curve | Slopes as the battery fills | Very flat [^1] |

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-nmc-lfp-compare.svg"
<figcaption>NMC vs LFP at a glance, from the Battery University figures cited above.</figcaption>
</figure>

!!! note "Cell figures are a guide"
    These are generic cell-level figures from Battery University. A finished pack's range, weight and lifespan depend on the maker's design, cooling and software, so do not compare two cars on chemistry alone. Another retail-sourced figure of "4,000 to 10,000 cycles" for LFP circulates online; we did not use it because it comes from a stationary-storage vendor, not a battery maker.

## What it means for owners

- **Weight and range.** Higher specific energy lets NMC give more range for the same pack weight [^1]. LFP needs a bigger, heavier pack for the same energy.
- **Charging habits.** The two chemistries get different advice on daily charge limits. See [Charging to 80% vs 100%](charging-80-vs-100.md).
- **State of charge accuracy.** LFP's flat voltage curve [^1] makes it harder for the car to judge how full the pack is from voltage alone. That is why LFP cars like an occasional full charge.
- **Safety.** Both are designed with protections. LFP has the higher thermal runaway onset temperature in the generic data [^1].

## Which Zeekr uses which

| Model and grade | Battery | Chemistry | Source status |
| :--- | :--- | :--- | :--- |
| X RWD (MY26) | 61 kWh | LFP | Confirmed [^2] |
| X AWD (MY26) | 66 kWh | NMC | Confirmed [^2] |
| 7X RWD | 75 kWh | LFP | Confirmed [^3] |
| 7X Long Range RWD | 100 kWh | NMC | Confirmed [^3] |
| 7X Performance AWD | 100 kWh | NMC | Confirmed [^3] |
| 009 FWD | 116 kWh | NMC | Confirmed [^4] |
| 009 AWD | Not stated in the sources we found | Not stated | Unconfirmed |

!!! warning "Check your own car"
    The 2027 7X (MY27) batteries are reported as unchanged from MY25/MY26 [^3]. Zeekr Australia's own pages carry few battery specifics, so the table rests on motoring press. Some press uses "NCM" (nickel cobalt manganese) for the same family as NMC. If you are unsure, check the compliance and battery plates or ask your dealer.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-zeekr-chemistry-map.svg"
<figcaption>Chemistry and pack size by grade, from the table above. The 009 AWD is not stated in our sources.</figcaption>
</figure>

## Related

- [Charging to 80% vs 100%](charging-80-vs-100.md)
- [kW vs kWh](kw-vs-kwh.md)
- [Glossary](../glossary/index.md)

## Sources

[^1]: Battery University, "BU-205: Types of Lithium-ion", <https://batteryuniversity.com/article/bu-205-types-of-lithium-ion>, accessed 8 November 2026 (page read in full).
[^2]: CarExpert, "2026 Zeekr X price and specs updated: EV gets massive price cuts", <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 8 November 2026.
[^3]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026; EV Central, "Key Tesla Model Y rival gets more power, same price for 2027" (1 November 2026), <https://evcentral.com.au/key-tesla-model-y-rival-gets-more-power-same-price-for-2027-zeekr-7x-upgraded-with-500kw-flagship-and-up-to-627km-range/>, accessed 8 November 2026.
[^4]: CarExpert, "2026 Zeekr 009: Luxury EV people mover gets more affordable", <https://www.carexpert.com.au/car-news/2026-zeekr-009-luxury-ev-people-mover-gets-more-affordable>, accessed 8 November 2026.
