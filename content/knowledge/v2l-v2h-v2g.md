---
title: V2L, V2H and V2G
last_checked: 2026-11-08
changelog: "Rewritten in plain style"
seo_title: "V2L, V2H and V2G explained"
description: "V2L, V2H and V2G explained for Australia: what each needs, which Zeekrs support vehicle-to-load, and where vehicle-to-grid stands with chargers and approvals."
---

# V2L, V2H and V2G

*Last checked: 8 November 2026.*

Three terms for using your car's battery as a power source. They sound alike and are very different in what they need.

| Term | Stands for | What it does | What it needs |
| :--- | :--- | :--- | :--- |
| **V2L** | Vehicle to load | Powers appliances directly from the car (camping gear, tools, a laptop) | An adapter or socket on the car |
| **V2H** | Vehicle to home | Powers your house, mainly as backup during an outage | A bidirectional charger and home wiring changes |
| **V2G** | Vehicle to grid | Exports energy back to the electricity network | A certified bidirectional charger, network approval, usually a program or retailer, and car-maker support |

V2G exports electricity from an EV's battery to a home, a building or the electricity network [^1]. V2H is simpler and already works in limited setups, mainly as backup power during outages [^2]. Grid export needs network operator approval and usually a place in a specific program [^2].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-v2x-three-way.svg"
<figcaption>Where the power goes and what each needs.</figcaption>
</figure>

## Which Zeekrs support V2L

- **7X:** all variants have V2L at 3.3 kW [^3].
- **X:** V2L at about 3 to 3.3 kW [^4][^5][^6]. Zeekr's X page writes it as "3.3 kWh", a unit slip for kW [^6]. Your owner's manual has the figure for your car.
- **009:** ask your dealer whether the 009 has V2L.
- **V2H and V2G:** the X is listed as not supporting V2H [^4]. For any Zeekr, ask your dealer before you plan around either.

!!! note "What 3.3 kW runs"
    3.3 kW is a limit on total draw, so add up what you plug in. How the adapter connects and any safety limits are in your owner's manual.

## Australian status of V2H and V2G, November 2026

- **Nov 2024:** Standards Australia approved a new V2G standard covering inverters and bidirectional chargers, with each product to be registered with the Clean Energy Council (CEC) [^7]. Before this, only South Australia permitted V2G chargers in homes [^7]. The updated AS/NZS 4777.1:2024 defines two V2G modes: Mode 3 (AC), which needs the car to comply with AS/NZS 4777.2, and Mode 4 (DC), which is expected to see more use [^8].
- **Jul 2025:** Ausgrid connected its first fully operational V2G system, a StarCharge Halo 7.4 kW single-phase charger at its Artarmon depot, as a test. Ausgrid said rollout depends on CEC approval, cable approvals, car-maker permission and agreements with network operators [^9].
- **Early 2026:** CEC approvals arrived. Infypower announced CEC certification for its 6.2 kW DC wallbox in January 2026 [^10], and StarCharge's Halo 7.4 kW was CEC-listed in March 2026 [^11].
- **Apr 2026:** three bidirectional chargers were CEC-approved for installation anywhere in Australia: the StarCharge Halo, the Infypower Numbat7 and the SigEnergy EV DC charging module. The main barrier is car-maker warranty: outside trials and a couple of exceptions, V2G use risks voiding the battery warranty [^12]. Check the CEC's approved list for the current set.

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-v2g-timeline.svg"
<figcaption>V2G milestones in Australia, November 2024 to November 2026.</figcaption>
</figure>

### What it means for a Zeekr owner today

1. **V2L: yes** on the 7X and the X, using the car's own adapter.
2. **V2H and V2G: ask first.** Check with your dealer that your car supports either before you buy a bidirectional charger.
3. **Warranty.** Zeekr's Australian warranty covers the high-voltage battery for 8 years or 160,000 km [^13]. Ask Zeekr Australia in writing how V2H or V2G use affects it before you connect a system.
4. **Network approvals and tariffs** are still evolving. Export usually requires a program and network approval [^2].

!!! info "Trials"
    The ARENA-funded NRMA and Amber trial has 25 households with BYD Atto 3s exporting to the grid for bill credits, with a waitlist of 5,500 people [^12].

## Related

- [kW vs kWh](kw-vs-kwh.md)
- [Plugs and cables](plugs-and-cables.md)
- [Home charging explained](home-charging.md)

## Sources

[^1]: Ausgrid, "EV Charging", <https://www.ausgrid.com.au/transforming-the-grid/innovating-for-the-future/electric-vehicles/ev-charging>, accessed 8 November 2026.
[^2]: Energy Matters, "V2G is Coming. What You Can Actually Do in 2026", 16 February 2026, <https://www.energymatters.com.au/renewable-news/v2g-is-coming-what-you-can-actually-do-in-2026/>, accessed 8 November 2026 (page read).
[^3]: The Driven, "Zeekr delivers 1,000th unit of the highly popular 7X SUV, expands dealer network", 13 December 2025, <https://thedriven.io/2025/12/13/zeekr-delivers-1000th-unit-of-the-highly-popular-7x-suv-expands-dealer-network/>, accessed 8 November 2026 (page read); also CarExpert specs <https://www.carexpert.com.au/zeekr/7x/2025/specs> (search extract).
[^4]: Zecar, "Zeekr X AWD charging guide", <https://zecar.com/ev-charging-guides/zeekr/x/2026/awd>, accessed 8 November 2026 (search extract only; retailer).
[^5]: The Driven, "Zeekr X starting price pitched under $60,000...", 16 August 2024, <https://thedriven.io/2024/08/16/zeekr-x-starting-price-pitched-under-60000-as-new-china-ev-brand-enters-australia-market>, accessed 8 November 2026 (search extract only).
[^6]: Zeekr Australia, "New Zeekr X", <https://www.zeekrlife.com/en-au/models/new-zeekr-x>, accessed 8 November 2026 (search extract only).
[^7]: pv magazine Australia, David Carroll, 11 November 2024, "Bowen gives vehicle-to-grid technology green light", <https://www.pv-magazine-australia.com/?p=10150>, accessed 8 November 2026 (page read; it does not name the standard number).
[^8]: CleanTech Controls, "AS/NZS 4777.1:2024", <https://www.cleantechcontrols.com.au/as-nzs-4777-12024/>, accessed 8 November 2026 (search extract only; installer-side summary; sources disagree on the 4777.2 edition). Standards Australia's own page was not retrieved, so not confirmed.
[^9]: The Driven, "We're ready: biggest network operator connects its first V2G charging system", 1 July 2025, <https://thedriven.io/2025/07/01/were-ready-biggest-network-operator-connects-its-first-v2g-charging-system/>, accessed 8 November 2026 (page read).
[^10]: Infypower, news item on CEC certification of its V2G/V2H DC wallbox, <https://www.infypower.com/news/81>, accessed 8 November 2026 (search extract only; manufacturer claim).
[^11]: AAP release, "StarCharge Energy Oceania Brings V2G Closer to Mainstream with CEC-Listed Halo 7.4kW", 29 March 2026, <https://www.aap.com.au/aapreleases/cision20260329ae21788>, accessed 8 November 2026 (search extract only; a company press release).
[^12]: NRMA Open Road, "From cars to cash: how EVs could power your home" (NRMA V2G trial with Amber), 9 April 2026, <https://www.mynrma.com.au/open-road/news/2026/nrma-v2g-trial-with-amber>, accessed 8 November 2026 (page read).
[^13]: Zeekr Intelligent Technology Australia, "Australian Warranty Policy", <https://www.datocms-assets.com/130529/1770683613-australian-warranty-policy.pdf>, accessed 8 November 2026 (8 years or 160,000 km high-voltage battery warranty).
