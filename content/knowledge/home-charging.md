---
title: Home charging explained
last_checked: 2026-11-15
changelog: "Added a short section on free midday power and cheap overnight EV plans"
seo_title: "Home EV charging: single vs three-phase"
description: "Home EV charging explained: what single-phase and three-phase supply can run, real charge times for each Zeekr battery, install costs and network approval."
---

# Home charging explained

*Last checked: 15 November 2026.*

This page explains the electrical side: what your house can supply and what that means for charge times. For product choices, installers and tariffs, see the [home charging guide](../guides/charging/home-setup.md).

!!! warning "Always ask a licensed electrician"
    Whether your home can take a given charger depends on your mains cable, switchboard and local network rules. Only a licensed electrician can assess that, and Ausgrid, for one, requires all work inside your property to be done by a licensed electrical contractor [^1].

## Single-phase and three-phase

- **Single-phase** is the common home supply, and many homes have nothing else. A 7 kW wallbox is the usual single-phase top end, adding roughly 35 to 40 km of range per hour [^2].
- **Three-phase** gives up to 22 kW on AC, adding about 50 to 130 km of range per hour [^2].

The kW figures follow from the current rating. A 32 A single-phase circuit at a nominal 230 V is about 7.4 kW; a 32 A three-phase circuit is about 22 kW; a 16 A three-phase circuit is about 11 kW (calculated from nominal supply voltages of 230 V single-phase and 400 V three-phase).

A car only charges as fast as the slower of the car and the wallbox. See which grade takes what in the [home charging guide](../guides/charging/home-setup.md): the 7X takes up to 22 kW AC on all grades [^3], the X RWD and 009 FWD are listed at 11 kW and the X AWD at 22 kW [^4][^5].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-home-supply.svg"
--8<-- "content/assets/diagrams/knowledge/kn-home-supply-mobile.svg"
<figcaption>Your supply type sets the ceiling for a home charger.</figcaption>
</figure>

## Real charge times

Hours from empty to full, ideal case, at the wallbox's rated power (energy divided by power, before charging losses). The car's own AC limit caps the speed, shown as "limited".

| Pack (grade) | 10 A portable | 7 kW | 11 kW | 22 kW |
| :--- | :--- | :--- | :--- | :--- |
| 61 kWh (X RWD) | 26.5 h | 8.7 h | 5.5 h | limited to 11 kW |
| 66 kWh (X AWD) | 28.7 h | 9.4 h | 6.0 h | 3.0 h |
| 75 kWh (7X RWD) | 32.6 h | 10.7 h | 6.8 h | 3.4 h |
| 100 kWh (7X Long Range, AWD) | 43.5 h | 14.3 h | 9.1 h | 4.5 h |
| 116 kWh (009 FWD/AWD) | 50.4 h | 16.6 h | 10.5 h | limited to 11 kW |

Pack sizes: [^3][^4][^5]. The portable column uses 2.3 kW (calculated: 230 V x 10 A), as in the [home charging guide](../guides/charging/home-setup.md); portable chargers run at about 1.4 to 2.8 kW [^2]. In daily life you rarely charge from empty: a typical 20% to 80% top-up takes 60% of those hours. Real sessions run longer, because of charging losses.

!!! tip "Overnight is usually enough"
    Ten hours on a 7 kW wallbox adds about 70 kWh, before losses. For most daily driving that covers it.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-home-charge-times.svg"
<figcaption>Ideal hours from empty to full, before charging losses, calculated as in the table above.</figcaption>
</figure>

## What it costs

Quotes vary widely, so get at least two.

- An installed single-phase 7 kW wallbox typically costs about $1,000 to $3,500 in mid-2026, depending on the job [^6][^7][^8].
- The main cost driver is distance from the switchboard and whether the board needs work. Older homes built before the mid-2000s often need board work before a 32 A circuit can be added [^7].
- Zeekr offers:
    - The **MY25 7X launch offer** for preorders of the original Zeekr 7X, included a wall-charger for free (excludes installation) [^9].
    - The **MY27 7X launch offer** for orders from 1 November to 31 December 2026 includes a 7 kW wallbox, supply only; installation by a licensed electrician is at your cost [^9].

## Free and cheap power

- Households with a smart meter in NSW, south-east Queensland and South Australia can opt in to 3 free hours of power in the middle of every day [^10]; Victoria has its own version from 11am to 2pm [^11].
- If the car is away all day, EV plans with a cheap window from 12am to 6am are the usual alternative [^12].

[Free and cheap home charging](home-charging-free-power.md) covers each option state by state, and how to schedule your Zeekr to charge in the cheap hours.

## Network approval, at a high level

Your electricity network (the distributor, or DNSP: Ausgrid, Endeavour, Energex, Ergon and so on) has rules for how big a charger you can connect. They differ by network and they are changing. In general:

- Your electrician checks your supply and tells you whether the network must be notified or must approve the work. Ausgrid, for example, requires approval where the electrician identifies a need to upgrade the supply, and may ask to be notified before installation so it can assess grid impact [^1].
- Most home chargers now need the network to be notified [^13]. Ask your electrician which charger size triggers notification or pre-approval where you live.
- Queensland (Energex and Ergon) has had extra rules for single-phase chargers, including network devices or limits. Energex's 2024 material allows a dedicated 22 kW three-phase charger switched across all phases without those device options [^14]. The limit on single-phase 32 A chargers without a network device is reported to have been withdrawn from 1 October 2026 [^15]. Check the current Queensland Electricity Connection Manual (QECM) with your electrician before relying on it.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-home-approval-flow.svg"
<figcaption>The usual order of steps. Rules differ by network, so your electrician leads.</figcaption>
</figure>

## Related

- [Home charging guide](../guides/charging/home-setup.md)
- [Free and cheap home charging](home-charging-free-power.md)
- [kW vs kWh](kw-vs-kwh.md)
- [Plugs and cables](plugs-and-cables.md)

## Sources

[^1]: Ausgrid, "EV Charging", <https://www.ausgrid.com.au/transforming-the-grid/innovating-for-the-future/electric-vehicles/ev-charging>, accessed 8 November 2026 (page read; it gives no kW or phase limits).
[^2]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026.
[^3]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026 ("All variants of the 7X have an on-board 22 kW AC charging"); and CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
[^4]: CarExpert, "2026 Zeekr X price and specs updated: EV gets massive price cuts", <https://www.carexpert.com.au/car-news/2026-zeekr-x-price-and-specs-updated-ev-gets-massive-price-cuts-1>, accessed 8 November 2026.
[^5]: CarExpert, "2026 Zeekr 009: Luxury EV people mover gets more affordable", <https://www.carexpert.com.au/car-news/2026-zeekr-009-luxury-ev-people-mover-gets-more-affordable>, accessed 8 November 2026. The 009 AWD AC rate is not stated in sources we found.
[^6]: EVSE Australia, "Cost to Install an EV Charger at Home", <https://evse.com.au/knowledge-hub/ev-charger-installation-cost>, accessed 8 November 2026 (search extract; retailer).
[^7]: Solar X Energy, "EV Charger Installation Cost in Australia: 2026 Guide", <https://solarxenergy.com.au/ev-charger-installation-cost/>, accessed 8 November 2026 (search extract; installer).
[^8]: e-Green Electrical, "How much does it cost to install an EV charger", <https://e-greenelectrical.com.au/how-much-does-it-cost-to-install-an-ev-charger/>, accessed 8 November 2026 (search extract; installer).
[^9]: ZeCar, "Zeekr 7X MY27 launch offer", <https://zecar.com/offers-and-deals/zeekr-7x-my27-launch-offer-2026>, accessed 8 November 2026.
[^10]: energy.gov.au, "Solar Sharer Offer", <https://www.energy.gov.au/rebates/solar-sharer-offer>, accessed 15 November 2026.
[^11]: Premier of Victoria, "Best Midday Power Offer In The Country", 28 May 2026, <https://www.premier.vic.gov.au/best-midday-power-offer-country>, accessed 15 November 2026.
[^12]: AGL, "EV Electricity plan: off peak charging 12AM to 6AM" (Night Saver EV), <https://www.agl.com.au/residential/energy/compare-plans/night-saver-ev-plan>, accessed 15 November 2026; and OVO Energy, "The EV Plan", <https://pages.ovoenergy.com.au/the-ev-plan>, accessed 15 November 2026.
[^13]: Energy Matters, "Do You Need to Tell Your Network Before Installing a Home EV Charger? (Yes, Probably)", 21 September 2026, <https://www.energymatters.com.au/renewable-news/ev-charger-network-approval-australia/>, accessed 8 November 2026 (page read; thresholds not verified by the author).
[^14]: Energex, "EV Charging and QECM V4 2024", <https://www.energex.com.au/__data/assets/pdf_file/0003/1171884/EV-Charging-and-QECM-V4-2024.pdf>, accessed 8 November 2026 (search extract only; the PDF returned an access error when fetched).
[^15]: Zecar, "Queensland EV charger 20A limit network device removed", 9 October 2026, <https://zecar.com/reviews/queensland-ev-charger-20a-limit-network-device-removed>, accessed 8 November 2026 (page read; secondary report citing QECM clause 8.14.4(b); not confirmed against the manual).
