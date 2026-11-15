---
title: AC vs DC and the charging curve
last_checked: 2026-11-15
changelog: "Added a charging table for every Zeekr sold here and named which models are 800V and which are 400V"
seo_title: "AC vs DC charging and the charging curve"
description: "AC vs DC charging explained: where the conversion happens, why fast-charge times are quoted 10 to 80%, why you rarely see the peak kW, and what 800V means."
---

# AC vs DC and the charging curve

*Last checked: 15 November 2026.*

## AC and DC

Mains power is AC. A battery stores DC. Something has to convert it, and where that happens is the difference between the two charging types.

- **AC charging** (home, work, destination chargers): AC goes into the car and the car's **onboard charger** converts it to DC. The onboard charger sets the limit: 22 kW on every 7X [^1]; 11 kW on the X RWD and 22 kW on the X AWD (MY26) [^2]; 11 kW on the 009 [^3].
- **DC fast charging** (public highway and town chargers): the converter is in the charger, so DC goes to the battery, bypassing the onboard charger. Public DC chargers run from 25 to 350 kW [^4].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-ac-vs-dc-path.svg"
--8<-- "content/assets/diagrams/knowledge/kn-ac-vs-dc-path-mobile.svg"
<figcaption>AC is converted inside the car. DC is converted in the charger.</figcaption>
</figure>

## Zeekr charging at a glance

Every Zeekr sold in Australia so far, by grade and model year. The 10% to 80% times are Zeekr's own claims on a fast enough charger.

| Model and grade | Battery | Chemistry | System | Max AC | Peak DC | 10% to 80% DC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| X RWD (MY25) | 66 kWh | NMC | 400V | 7.2 kW | 150 kW | Under 30 min |
| X AWD (MY25) | 66 kWh | NMC | 400V | 11 kW | 150 kW | Under 30 min |
| X RWD (MY26) | 61 kWh | LFP | 400V | 11 kW | 230 kW | About 18 min |
| X AWD (MY26) | 66 kWh | NMC | 400V | 22 kW | 150 kW | - |
| 7X RWD (MY25/MY26) | 75 kWh | LFP | 800V | 22 kW | 450 kW | 13 min |
| 7X Long Range RWD (MY25/MY26) | 100 kWh | NMC | 800V | 22 kW | 420 kW | 16 min |
| 7X Performance AWD (MY25/MY26) | 100 kWh | NMC | 800V | 22 kW | 420 kW | 16 min |
| 7X RWD (MY27) | 75 kWh | LFP | 800V | 22 kW | 450 kW | 11 min |
| 7X Long Range RWD (MY27) | 100 kWh | NMC | 800V | 22 kW | 420 kW | 15 min |
| 7X Performance AWD (MY27) | 100 kWh | NMC | 800V | 22 kW | 420 kW | 15 min |
| 009 FWD | 116 kWh | NMC | 400V | 11 kW | 150 kW | 30 min |
| 009 AWD | 116 kWh | NMC | 400V | 11 kW | 150 kW | 30 min |

Sources: X MY25 [^5][^6][^7]; X MY26 [^2][^6][^8]; 7X MY25/MY26 [^9][^10][^11]; 7X MY27 [^1][^12]; 009 [^3][^13]. Zeekr calls the NMC packs NCM; it's the same chemistry, see [NMC vs LFP batteries](nmc-vs-lfp.md).

Peak DC only happens on a charger that can supply it. On a 50 kW charger, every Zeekr charges at 50 kW or less. See [why you rarely see the peak](#why-you-rarely-see-the-peak).

## The charging curve

A charging curve plots power (kW) against state of charge (SOC, the battery percentage). It is not flat. Power ramps up, holds near a peak, then tapers as the battery fills.

Why it tapers: the battery management system (BMS) slows charging as the battery fills, especially from 80% to 100%, to look after the cells [^14]. It also throttles power when the cells are too hot or too cold, however fast the charger is [^14]. The exact curve is a property of your car.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-charging-curve.svg"
<figcaption>Illustrative shape, not measured data. Zeekr times are cited in the text.</figcaption>
</figure>

## Why times are quoted 10% to 80%

- The 10% to 80% window is where charging power is highest, and the slow tail above 80% is skipped. Going from 80% to 100% typically takes about as long as 10% to 80% did [^14].
- A 10% to 80% charge on the 7X takes 11 to 16 minutes, depending on grade and model year [^1][^10][^11]. The 009 takes about 30 minutes [^3].

## Why you rarely see the peak

1. **The charger caps you.** The 7X is rated up to 420 to 450 kW DC, but public DC chargers run from 25 to 350 kW [^4][^1]. Many sites are lower. Check the charger's rating before you go.
2. **The curve.** Some cars hit their peak only for a short burst, then throttle back [^14].
3. **Shared power.** Some sites split output between plugs. See [charging etiquette](../guides/charging/etiquette.md) and [public charging](../guides/charging/public-networks.md).
4. **Battery temperature.** A battery that is too hot or too cold charges slower [^14].

!!! tip "Practical rule"
    For road trips, charge to what gets you to the next stop, usually about 80%, and leave. See the [road trips guide](../guides/charging/road-trips.md).

## 800V in brief

The **7X** is the only 800V Zeekr on sale here, on every grade and model year [^9][^12]. The **X** (MY25 and MY26) and the **009** (FWD and AWD) are 400V [^7][^8][^3].

For the same power, a higher voltage means lower current: at 420 kW, 800 V is about 525 A, where a 400 V system would need about 1,050 A (calculated from P = V x I). Lower current means less heat in cables and parts, which is why 800V cars can sustain higher charging power.

## Related

- [kW vs kWh](kw-vs-kwh.md)
- [Plugs and cables](plugs-and-cables.md)
- [Public charging](../guides/charging/public-networks.md)

## Sources

[^1]: Zeekr Australia, "Zeekr 7X", <https://www.zeekrlife.com/en-au/models/zeekr-7x>, accessed 15 November 2026.
[^2]: Zeekr Australia, "The New Zeekr X", <https://www.zeekrlife.com/en-au/models/new-zeekr-x>, accessed 15 November 2026.
[^3]: Zeekr, "ZEEKR 009: Redefine the Luxury MPV" (brochure), <https://www.zeekrlife.com/published/assets/604b6b6b551e8479c7e8d141520e5e861aa590dfd4846429ddb48c6a4b8a66a7/ZEEKR-009-Brochure.pdf>, accessed 15 November 2026.
[^4]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026.
[^5]: Zeekr Australia, "Zeekr X: Luxury Urban Cross SUV" (brochure), <https://www.datocms-assets.com/130529/1750309574-zeekr-x-brochure_au-version.pdf>, accessed 15 November 2026.
[^6]: CarExpert, "2026 Zeekr X price and specs: Updated EV gets massive price cuts", 10 April 2026, <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 15 November 2026.
[^7]: Zeekr, "ZEEKR X: Technical Specifications" (media information, June 2023), <https://www.electricmotornews.com/wp-content/uploads/2023/09/ZEEKR-X-Technical-Data.pdf>, accessed 15 November 2026.
[^8]: electrive, "Revised Zeekr X cuts fast charging time to 18 minutes", 5 May 2026, <https://www.electrive.com/2026/05/05/revised-zeekr-x-cuts-fast-charging-time-to-18-minutes/>, accessed 15 November 2026.
[^9]: Zeekr Australia, "ZEEKR 7X: Indulge Every Journey" (brochure), <https://www.datocms-assets.com/130529/1755670382-au-7x-brochure-200825-web.pdf>, accessed 15 November 2026.
[^10]: Zeekr Australia, "Zeekr 7X: The Future Has Arrived", 7 August 2025, <https://www.zeekrlife.com/en-au/posts/zeekr-7x-future-has-arrived>, accessed 15 November 2026.
[^11]: GoAuto, "Zeekr 7X undercuts Model Y, IM6 in Oz", 7 August 2025, <https://www.goauto.com.au/new-models/zeekr/7x/zeekr-7x-undercuts-model-y-im6-in-oz/2025-08-07/97079.html>, accessed 15 November 2026.
[^12]: CarExpert, "2027 Zeekr 7X update: more power, same price", 1 November 2026, <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 15 November 2026.
[^13]: Zeekr Australia, "Zeekr 009", <https://www.zeekrlife.com/en-au/models/009>, accessed 15 November 2026.
[^14]: WhichCar, "The fastest-charging electric cars in Australia", <https://www.whichcar.com.au/car-advice/fastest-charging-electric-vehicles>, accessed 15 November 2026.
