---
title: Range in the real world
description: Why your Zeekr's range differs from the WLTP number, and what speed, cold, wind, rain, roof loads and towing do to it, using sourced figures.
last_checked: 2026-11-08
---

# Range in the real world

*Last checked: 8 November 2026.*

The range on the brochure is a lab figure. It is good for comparing cars and not a promise for your commute. Here is how far apart they usually sit, and why.

## WLTP vs real driving

**WLTP** is a standard laboratory test cycle that lets you compare cars on the same basis. Zeekr's published Australian figures are WLTP: for example 405 km (X RWD), 627 km (7X Long Range MY27) and 604 km (009 FWD) [^1][^2][^3].

Australia's older official range figure, ADR 81/02, gives lower numbers than WLTP for many cars. One report says a new ADR 81/03 revision will let makers use WLTP figures for vehicles built from 1 December 2026 [^4]. That is a single-source claim and we have not confirmed it against the rule itself.

Independent Australian testing by the AAA's Real World Testing Program, run over one fixed mixed circuit, found BEV range 5% to 14% below the makers' claims across five cars [^5]:

| Car | Claimed range | Shortfall |
| :--- | :--- | :--- |
| Smart #3 Premium | 455 km | 23 km (about 5%) |
| Tesla Model Y Long Range | 533 km | 43 km (about 8%) |
| Kia EV6 Air | 528 km | 44 km (about 8%) |
| BYD Atto 3 Extended Range | 420 km (WLTP) | 51 km (12%) |
| Tesla Model 3 RWD | 513 km | 72 km (about 14%) |

The percentages marked "about" are our arithmetic from NRMA's published kilometre shortfalls [^5]. No Zeekr was in that test, so do not assume your car lands in this band.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-range-claim-vs-real.svg"
<figcaption>AAA Real World Testing Program results as reported by NRMA, cited above. No Zeekr was tested.</figcaption>
</figure>

## What eats your range

The figures below come from different tests on different cars. Read them as the direction and rough size of each effect, not a rule for your Zeekr.

### Speed

Drag rises sharply with speed. In one test of a Skoda Enyaq iV, going from 96 km/h to 112 km/h cost about 48 km of estimated range, from an estimate of 372 km [^6]. That is roughly 13% (our arithmetic). An NRMA owner review of a Hyundai Ioniq 5 also reports efficiency dropping above 100 km/h, with a bit over 400 km on the highway [^7].

### Cold

With the cabin heater off, EV driving range was about 12% lower at 20 °F (about minus 7 °C) than at 75 °F (about 24 °C). With the heater on, the AAA's 2019 testing put the drop at 41%, and about two-thirds of the extra energy went to heating the cabin [^8]. Preheating while plugged in and using seat heaters instead of the cabin heater are the suggested workarounds [^8]. The US figures are older and not Australian, so use them as an indication only.

### Heat

We did not find a sourced figure for how hot weather and air conditioning change range, so none is given.

### Wind and rain

!!! note "No figures sourced"
    We found no reliable Australian source quantifying the effect of headwinds or wet roads on range. Drag rises with the relative air speed over the car and wet roads add rolling resistance, so a headwind or heavy rain will cost you something, but we have no number to give. This section will be updated if a source turns up.

### Roof loads

A ski rack cost about 19% of range in the Enyaq test [^6]. The same test gives no separate figures for a roof box or bike rack. The US Department of Energy's advice is to remove an external cargo container, such as a roof box, when you are not using it [^9].

### Towing

- A towed camper trailer cut a Hyundai Ioniq 5's range by about a third, to about 290 km, with speed held to 90 to 100 km/h [^7].
- Towing a caravan gave less than half the original range in the Enyaq test [^6].
- The 7X is reported as approved for 2 tonne towing [^10]. Rated towing capacity says nothing about how far you will get, so plan charging stops with the heavy-load numbers above in mind.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-range-factors.svg"
<figcaption>Different tests on different cars, cited above. Read them as rough size, not a rule for your Zeekr.</figcaption>
</figure>

## Planning rules that work

- Plan on less than the WLTP number. A 5% to 14% haircut is what independent Australian testing found [^5], and highway speed, winter and towing take more.
- Keep a buffer at the next charger. See the [road trips guide](../guides/charging/road-trips.md).
- Preheat the car while it is plugged in [^8].

## Related

- [kW vs kWh](kw-vs-kwh.md)
- [AC vs DC and the charging curve](charging-curve.md)
- [Road trips guide](../guides/charging/road-trips.md)

## Sources

[^1]: CarExpert, "2026 Zeekr X price and specs updated: EV gets massive price cuts", <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 8 November 2026.
[^2]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
[^3]: CarExpert, "2026 Zeekr 009: Luxury EV people mover gets more affordable", <https://www.carexpert.com.au/car-news/2026-zeekr-009-luxury-ev-people-mover-gets-more-affordable>, accessed 8 November 2026.
[^4]: CarExpert, "EV range claims from BYD, Tesla, others scrutinised in new real-world testing", <https://carexpert.com.au/car-news/ev-range-claims-from-byd-tesla-others-scrutinised-in-new-real-world-testing>, accessed 8 November 2026 (search extract only; the ADR 81/03 point is attributed to BYD, not confirmed).
[^5]: NRMA Open Road, Bridie Schmidt, "First electric car real-world range tests", 6 August 2025, <https://www.mynrma.com.au/open-road/news/2025/first-electric-car-real-world-range-tests>, accessed 8 November 2026 (page read in full; reports AAA Real World Testing Program results).
[^6]: ArenaEV, "See how much range a bike rack, a roof box and towing a caravan costs you", 10 February 2022, <https://www.arenaev.com/see_how_much_range_the_skoda_enyaq_has_towing_a_caravan_among_other_things-news-39.php>, accessed 8 November 2026. One car (Skoda Enyaq iV 77 kWh), a trade publication test; not Australian.
[^7]: NRMA Open Road, "2023 Hyundai Ioniq 5 Techniq owner review", <https://www.mynrma.com.au/open-road/car-reviews/hyundai/2023-hyundai-ioniq-5-techniq-owner-review>, accessed 8 November 2026. Owner experience, one car.
[^8]: US Department of Energy, fueleconomy.gov, "Fuel Economy in Cold Weather", <https://fueleconomy.gov/Feg/coldweather.shtml>, accessed 8 November 2026 (cites the 2019 AAA "Electric Vehicle Range Testing", US).
[^9]: US Department of Energy, fueleconomy.gov, "Driving More Efficiently", <https://www.fueleconomy.gov/feg/driveHabits.jsp>, accessed 8 November 2026.
[^10]: The Driven, "Zeekr 7X electric SUV approved in Australia offers 2 tonne towing", 29 August 2025, <https://thedriven.io/2025/08/29/zeekr-7x-electric-suv-approved-in-australia-offers-2-tonne-towing/>, accessed 8 November 2026 (search extract of headline only).
