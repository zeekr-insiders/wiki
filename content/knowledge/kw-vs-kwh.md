---
title: kW vs kWh
description: The difference between kilowatts and kilowatt-hours, with the two sums every EV owner needs for charge time and running cost.
last_checked: 2026-11-08
---

# kW vs kWh

*Last checked: 8 November 2026.*

Two units, two different jobs. Mixing them up is the most common EV confusion.

- **kWh (kilowatt-hour)** is an amount of energy. It is how big the battery is, and what you buy from the grid.
- **kW (kilowatt)** is a rate of power. It is how fast energy moves: charger speed, motor output.

!!! tip "The tank and the tap"
    The battery is the tank, measured in kWh. The charger is the tap, measured in kW. A bigger tap fills the same tank faster. It does not make the tank bigger.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-tank-and-tap.svg"
<figcaption>The battery is the tank, in kWh. The charger is the tap, in kW.</figcaption>
</figure>

## Where you see each

| Where | Unit | Example |
| :--- | :--- | :--- |
| Battery size | kWh | 61 kWh (X RWD), 75 kWh (7X RWD), 100 kWh (7X Long Range, AWD), 116 kWh (009 FWD) [^1][^2][^3] |
| Charger speed | kW | 7 kW home wallbox, 22 kW three-phase AC, up to 420 or 450 kW DC on the 7X [^2][^4] |
| Motor output | kW | 335 kW or 500 kW (MY27 7X) [^2] |
| Efficiency | kWh per 100 km | What the trip computer shows |
| Your power bill | kWh | Priced per kWh by your retailer |

The 7X also has vehicle-to-load output rated in kW (3.3 kW), covered in [V2L, V2H and V2G](v2l-v2h-v2g.md) [^5].

## The two sums

**Charge time** = energy needed (kWh) divided by power (kW). A flat battery to full on a 7 kW charger for a 75 kWh pack is 75 / 7, about 10.7 hours, before charging losses. Real sessions run a little longer because some energy is lost as heat and the charge slows near full; we have not sourced a loss figure, so allow some margin. The full table is in [Home charging explained](home-charging.md).

**Running cost** = energy used (kWh) times your price per kWh. For example, adding 60 kWh at 15c/kWh costs $9. That rate is an example, not a quote; read your own bill.

**Range added** = power (kW) divided by consumption (kWh per 100 km), times 100, per hour. RACV gives the ballpark of what that looks like: 7 kW single-phase adds about 35 to 40 km of range per hour, and up to 22 kW three-phase about 50 to 130 km per hour [^6].

!!! note "Do not confuse kW with kWh in specs"
    You will see "kWh" mistakenly used for power in the wild. For example, Zeekr Australia's own X page describes its V2L as "3.3 kWh", which is almost certainly a typo for kW [^7].

## Related

- [Home charging explained](home-charging.md)
- [AC vs DC and the charging curve](charging-curve.md)
- [Range in the real world](real-world-range.md)

## Sources

[^1]: CarExpert, "2026 Zeekr X price and specs updated: EV gets massive price cuts", <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 8 November 2026.
[^2]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
[^3]: CarExpert, "2026 Zeekr 009: Luxury EV people mover gets more affordable", <https://www.carexpert.com.au/car-news/2026-zeekr-009-luxury-ev-people-mover-gets-more-affordable>, accessed 8 November 2026.
[^4]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026; Zeekr Insiders, "Wiki sourced fact sheet" (club-docs research, 8 November 2026), section 4.4, citing Zeekr Australia, "Zeekr 7X", <https://www.zeekrlife.com/en-au/models/zeekr-7x>, accessed 8 November 2026. Peak DC is 450 kW (RWD) and 420 kW (Long Range and AWD); Zeekr's own page and the press differ slightly.
[^5]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026 ("vehicle-to-load (V2L) capability with 3.3 kW output").
[^6]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026.
[^7]: Zeekr Australia, "New Zeekr X", <https://www.zeekrlife.com/en-au/models/new-zeekr-x>, accessed 8 November 2026 (search extract only; the page was not read directly, so treat the wording as not confirmed).
