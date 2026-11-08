---
title: Plugs and cables
last_checked: 2026-11-08
seo_title: "Type 2, CCS2 and EV cables in Australia"
description: "EV plugs and cables in Australia: Type 2 and CCS2, tethered vs untethered chargers, and portable charger safety, including why Zeekr says no extension leads."
---

# Plugs and cables

*Last checked: 8 November 2026.*

Two plugs cover almost everything you will meet on a Zeekr in Australia: **Type 2** for AC and **CCS2** for DC. Which charger, cable and plug to carry is mostly a Type 2 question.

## Type 2 and CCS2

- **Type 2** is the European-standard AC plug and the most common in Australia. It supports single-phase and three-phase charging [^1].
- **CCS2** is a Type 2 socket with two extra large pins below it for DC. Most new EVs use a Type 2 plug for AC, leaving the lower pins unused, and a CCS2 plug on a DC charger fills the whole socket [^1].
- CCS2 is becoming the standard DC plug [^2]. Older CHAdeMO DC chargers exist but are mostly for older Japanese-built cars [^3]. Zeekr's Australian cars use the Type 2 and CCS2 pair, and the first-1,000 7X launch offer came with a Type 2 cable and a mini portable cable [^4].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-type2-ccs2.svg"
<figcaption>Schematic, not to scale.</figcaption>
</figure>

## Tethered and untethered

- **Tethered**: the cable is permanently attached to the charger. A tethered cable is always provided with public DC chargers [^1].
- **Untethered**: the charger has a socket and you bring your own Type 2 cable. Level 2 AC units can be either [^1]. Many public AC posts are untethered [^5], so carry a cable.

| | Tethered | Untethered |
| :--- | :--- | :--- |
| Where | All public DC; some AC | Many AC posts and home wallboxes |
| Cable | Built in | You carry a Type 2 cable |
| Pros | Nothing to carry | Suits any plug type; cable is yours to keep |
| Cons | Cable length and condition are the operator's | Cable lives in the boot |

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-tethered-untethered.svg"
<figcaption>Public DC is always tethered. For untethered AC posts, bring your own Type 2 cable.</figcaption>
</figure>

## The portable charger

A portable (mode 2) charger plugs into a normal household socket and charges the car slowly. RACV lists these at about 1.4 to 2.8 kW, about 10 to 12 km of range per hour, which suits plug-in hybrids better than a large battery car [^1]. A standard 10 A socket gives about 2.3 kW (230 V times 10 A, our arithmetic). Some chargers have a 15 A plug for a dedicated 15 A outlet; a 15 A plug does not fit a standard 10 A socket. Zeekr's first-1,000 7X offer included a mini portable (10 amp) cable [^4].

### Safety rules

!!! danger "No extension leads, no adapters"
    Zeekr's 7X owner manual lists as a safety rule: "Not use any adapters, extension cables, or multiple ports of any kind." [^6] Plug the portable charger straight into a suitable wall socket. If the socket is too far away or not suitable, have a licensed electrician install a dedicated outlet or a wallbox.

- Do not use damaged cables or ports, and do not bundle the cable while it charges [^6].
- Keep the cable out of direct sunlight; overheating protection can reduce or stop charging [^6].
- The cable between car and charger must be shorter than 30 metres [^6].
- Use a socket in good condition on a circuit with a safety switch (RCD). A Queensland Government electrical safety booklet advises heavy-duty leads outdoors and an RCD [^7]. Queensland Fire and Emergency Services advises using only extension leads and sockets intended for charging EVs [^7]. Those regulator notes sit alongside Zeekr's stricter instruction: for a Zeekr, follow the manual and do not use extension leads.
- For regular use, a dedicated circuit or wallbox is the safe answer. See [Home charging explained](home-charging.md).

!!! warning "Source limits"
    The Zeekr manual we read is the Netherlands edition of the 7X manual on an unofficial mirror; the Australian booklet was not available. Check your own booklet. The Queensland regulator wording is from a search extract; the page returned empty when fetched [^7].

<figure class="zi-diagram">
--8<-- "content/assets/diagrams/knowledge/kn-portable-safe-chain.svg"
<figcaption>Plug the portable charger straight into a suitable wall socket.</figcaption>
</figure>

## Related

- [Home charging explained](home-charging.md)
- [AC vs DC and the charging curve](charging-curve.md)
- [Home charging guide](../guides/charging/home-setup.md)

## Sources

[^1]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026 (page read).
[^2]: NSW Government, Transport for NSW, "Charging an electric vehicle", <https://www.transport.nsw.gov.au/projects/current-projects/electric-vehicles/charging-an-electric-vehicle>, accessed 8 November 2026 (search extract only).
[^3]: RACV, "Guide to electric vehicle charging, plug types and cables", 5 February 2025, <https://www.racv.com.au/royalauto/transport/electric-vehicles/electric-car-charging-plug-types>, accessed 8 November 2026; NRMA, "EV plug types", <https://www.mynrma.com.au/open-road/advice-and-how-to/ev-plug-types>, accessed 8 November 2026 (search extract only). The seven-pin description is RACV's.
[^4]: CarExpert, "2026 Zeekr 7X price and specs", <https://www.carexpert.com.au/car-news/2026-zeekr-7x-price-and-specs>, accessed 8 November 2026.
[^5]: NRMA, "EV plug types", <https://www.mynrma.com.au/open-road/advice-and-how-to/ev-plug-types>, accessed 8 November 2026 (search extract only; RAA and Zecar plug-type guides say the same in search extracts, none read in full).
[^6]: Zeekr 7X Manual (unofficial mirror, Netherlands edition), "Charge the car", <https://zeekr-manual.pages.dev/sections/charging/T10211230>, accessed 8 November 2026 (a manufacturer instruction; the Australian booklet was not seen).
[^7]: Queensland Fire and Emergency Services, "Electric vehicle fire safety", <https://www.fire.qld.gov.au/safety-education/battery-and-charging-safety/electric-vehicle-fire-safety>, accessed 8 November 2026 (search extract only); EESS Information Bulletin 20-013 (covers EVSE standards and does not mention extension leads), <https://www.eess.gov.au/wp-content/uploads/2020/10/20-013-Information-Bulletin-Electric-Vehicle-Supply-Equipment-v1.0.pdf>, accessed 8 November 2026. The QFES wording is not confirmed.
