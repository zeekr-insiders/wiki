---
title: AC vs DC and the charging curve
last_checked: 2026-11-08
changelog: "Rewritten in plain style"
seo_title: "AC vs DC charging and the charging curve"
description: "AC vs DC charging explained: where the conversion happens, why fast-charge times are quoted 10 to 80%, why you rarely see the peak kW, and what 800V means."
---

# AC vs DC and the charging curve

*Last checked: 8 November 2026.*

## AC and DC

Mains power is AC. A battery stores DC. Something has to convert it, and where that happens is the difference between the two charging types.

- **AC charging** (home, work, destination chargers): AC goes into the car and the car's **onboard charger** converts it to DC. The onboard charger sets the limit: 7X all grades 22 kW [^1]; X RWD 11 kW, X AWD 22 kW; 009 FWD 11 kW [^2][^3].
- **DC fast charging** (public highway and town chargers): the converter is in the charger, so DC goes to the battery, bypassing the onboard charger. Public DC chargers run from 25 to 350 kW [^4].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-ac-vs-dc-path.svg"
--8<-- "content/assets/diagrams/knowledge/kn-ac-vs-dc-path-mobile.svg"
<figcaption>AC is converted inside the car. DC is converted in the charger.</figcaption>
</figure>

## The charging curve

A charging curve plots power (kW) against state of charge (SOC, the battery percentage). It is not flat. Power ramps up, holds near a peak, then tapers as the battery fills.

Why it tapers: the battery management system (BMS) reduces current as the pack fills to limit cell voltage and heat [^5]. Where the taper starts varies by car and chemistry, and newer high-power cars taper later [^5]. The exact curve is a property of your car.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-charging-curve.svg"
<figcaption>Illustrative shape, not measured data. Zeekr times are cited in the text.</figcaption>
</figure>

## Why times are quoted 10% to 80%

- The 10% to 80% window is where charging power is highest, and the slow tail above 80% is skipped. Charging from 80% to 100% takes disproportionately long, and some networks limit power above about 80% so drivers move on [^5].
- A 10 to 80% charge on the 7X takes about 10 to 16 minutes, depending on grade, battery temperature and charger [^6][^7][^8]. The 009 FWD takes about 30 minutes [^3].

## Why you rarely see the peak

1. **The charger caps you.** The 7X is rated up to 420 to 450 kW DC, but public DC chargers run from 25 to 350 kW [^4][^6][^7]. Many sites are lower. Check the charger's rating before you go.
2. **The curve.** The peak is held only briefly [^5].
3. **Shared power.** Some sites split output between plugs. See [charging etiquette](../guides/charging/etiquette.md) and [public charging](../guides/charging/public-networks.md).
4. **Battery condition.** Heat is a known limiter [^5].

!!! tip "Practical rule"
    For road trips, charge to what gets you to the next stop, usually about 80%, and leave. See the [road trips guide](../guides/charging/road-trips.md).

## 800V in brief

The 7X uses an 800V electrical architecture [^6][^7]. For the same power, a higher voltage means lower current: at 420 kW, 800 V is about 525 A, where a 400 V system would need about 1,050 A (calculated from P = V x I). Lower current means less heat in cables and parts, which is why 800V cars can sustain higher charging power. The 7GT is reported to use 800V too [^9].

## Related

- [kW vs kWh](kw-vs-kwh.md)
- [Plugs and cables](plugs-and-cables.md)
- [Public charging](../guides/charging/public-networks.md)

## Sources

[^1]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026.
[^2]: CarExpert, "2026 Zeekr X price and specs updated: EV gets massive price cuts", <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 8 November 2026 (X RWD 11 kW AC and up to 230 kW DC; X AWD 22 kW AC and up to 150 kW DC).
[^3]: CarExpert, "2026 Zeekr 009: Luxury EV people mover gets more affordable", <https://www.carexpert.com.au/car-news/2026-zeekr-009-luxury-ev-people-mover-gets-more-affordable>, accessed 8 November 2026 (009 FWD 11 kW AC, 150 kW DC, 10 to 80% in about 30 minutes).
[^4]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026.
[^5]: Peugeot New Zealand, "How does the recharging curve of an electric vehicle work?", <https://peugeot.co.nz/brand/peugeot-magazine/recharging-curve.html>, accessed 8 November 2026 (search extract only; the page returned an access error). Supporting search extracts from The Globe and Mail and Recharged covering the same mechanism are consistent but mostly blog content. Exact thresholds vary by source: UNCONFIRMED.
[^6]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
[^7]: Zeekr Australia, "Zeekr 7X", <https://www.zeekrlife.com/en-au/models/zeekr-7x>, accessed 8 November 2026.
[^8]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026 ("10 to 80% charge in under 16 minutes").
[^9]: EV Central, "Is this Zeekr's next big thing in Australia? 7GT shooting brake confirmed with up to 670km range and 500kW flagship", <https://evcentral.com.au/is-this-zeekrs-next-big-thing-in-australia-7gt-shooting-brake-confirmed-with-up-to-670km-range-and-500kw-flagship/>, accessed 8 November 2026.
