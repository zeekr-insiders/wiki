---
title: Charging to 80% vs 100%
last_checked: 2026-11-08
seo_title: "Charge to 80% or 100%? LFP vs NMC"
description: "Should you charge your EV to 80% or 100%? Why NMC and LFP Zeekrs get different charge-limit advice, what LFP calibration is, and a simple daily and trip rule."
---

# Charging to 80% vs 100%

*Last checked: 8 November 2026.*

"Charge to 80%" is the most repeated EV rule, and it is only half right. It comes from NMC batteries. LFP batteries are usually treated differently. First check which you have: [NMC vs LFP batteries](nmc-vs-lfp.md).

!!! warning "Check the manual first"
    We could not find a Zeekr Australia statement of recommended daily charge limits for any grade. The advice below is general industry practice from other makers and third parties. Where your Zeekr owner's manual or the in-car charge settings say something different, follow them. Ask Zeekr Australia to confirm for your grade.

## The short version

| Battery | Typical daily limit | Full charge (100%) |
| :--- | :--- | :--- |
| NMC (X AWD, 7X Long Range and AWD, 009) | About 80% to 90% | Fine for trips, avoid leaving it sitting full |
| LFP (X RWD, 7X RWD) | Many makers allow 100% daily | Done regularly, often weekly, to keep the gauge accurate |

Tesla's guidance is the best-documented example: 80% to 90% for NMC and NCA cars most of the time, with 100% kept for trips, and a 100% daily limit with a full charge at least weekly for LFP cars [^1][^2]. That is Tesla's advice for Tesla cars, not Zeekr's.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-charge-limit-decision.svg"
<figcaption>A starting point, not Zeekr advice. Your owner's manual comes first.</figcaption>
</figure>

## Why NMC gets the 80% advice

- NMC voltage rises steadily as it fills, and the generic data notes that a high charge promotes thermal runaway [^4]. Sitting at a high state of charge is the harder case for the chemistry.
- Sources commonly recommend keeping NMC packs around 20% to 80% day to day for longevity [^5]. We rate this as widely repeated, not proven for any specific Zeekr pack.

## Why LFP is different

- LFP has a very flat voltage curve [^4]. The car estimates how full the pack is largely from voltage, and on a flat curve that estimate drifts.
- A full charge lets the battery management system reset its estimate. That is the "calibration" owners talk about [^2][^3].
- Some commentators argue frequent 100% charging still adds some wear, and that cycling at a lower average charge level fades less [^3]. Treat that as unsettled.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-soc-voltage-shape.svg"
<figcaption>Illustrative shape, not measured data.</figcaption>
</figure>

### LFP calibration, in practice

1. Charge to 100% and leave the car plugged in for a short while after it reaches 100% so the pack can balance. (Balancing time is a common owner tip and we found no maker source for a specific duration, so none is given.)
2. Do this regularly. Tesla's published interval for its LFP cars is at least weekly [^2].
3. If the range or percentage figure seems to jump or drift, a full charge is the first thing to try.

!!! note "Unconfirmed for Zeekr"
    An Australian retailer guide lists 100% as the typical daily limit for the 75 kWh LFP 7X RWD and tells owners to check the manual [^6]. It is not a Zeekr source.

## Rules that apply to both

- **Avoid leaving the car parked at 100% for days** where you can. Several sources say prolonged time at a full charge is the main concern [^3]. Time the charge to finish shortly before you drive.
- **Charge to what you need on DC stops.** The last part of a fast charge is slow. See [AC vs DC and the charging curve](charging-curve.md) and [charging etiquette](../guides/charging/etiquette.md).
- **Do not run it flat.** Low-state-of-charge advice is consistent across sources, but we found no Zeekr figure, so none is given.

## Related

- [NMC vs LFP batteries](nmc-vs-lfp.md)
- [Range in the real world](real-world-range.md)
- [Charging etiquette](../guides/charging/etiquette.md)

## Sources

[^1]: InsideEVs, "Tesla Recommends Charging Model 3 RWD's LFP Battery To 100%", <https://insideevs.com/news/557527/tesla-model3-lfp-charging-recommendations/>, accessed 8 November 2026 (search extract only; secondary report of Tesla guidance).
[^2]: Recurrent, "Do I need to charge my Tesla to 80% or 100%?", <https://recurrentauto.com/questions/do-i-need-to-charge-my-tesla-to-80-or-100>, accessed 8 November 2026 (search extract only; Tesla's own support page returned an error when fetched).
[^3]: Eleport, "Should I Charge My EV to 100%? Here's How It Depends on the Battery You Have", <https://eleport.com/should-i-charge-my-ev-to-100/>, accessed 8 November 2026 (search extract only; commentary, not peer reviewed).
[^4]: Battery University, "BU-205: Types of Lithium-ion", <https://batteryuniversity.com/article/bu-205-types-of-lithium-ion>, accessed 8 November 2026.
[^5]: The Driven, "Reader question: are LFP batteries better than NMC?", <https://thedriven.io/2024/11/15/reader-question-are-lfp-batteries-better-than-nmc/>, accessed 8 November 2026 (search extract only).
[^6]: Zecar, "Zeekr 7x RWD charging guide", <https://zecar.com/ev-charging-guides/zeekr/7x/rwd>, accessed 8 November 2026 (search extract only; retailer, not Zeekr).
