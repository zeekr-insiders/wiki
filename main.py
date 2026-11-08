"""
MkDocs Macros for Zeekr Model Data Processing
Provides functions to load and process YAML model data for comparison tables.
"""

import html
import re

import yaml
import os
from pathlib import Path
from typing import Dict, List, Any, Optional

_LUCIDE = Path(__file__).parent / "overrides" / ".icons" / "lucide"


def _lucide(name: str, cls: str = "zi-spec-card__icon") -> str:
    """A vendored Lucide icon (ISC, overrides/.icons/lucide) as inline SVG.

    Inline so it takes currentColor from the card; the licence comment is
    dropped from each copy because LICENSE-lucide.txt sits beside the files.
    Decorative: the card's text always names what the icon shows.
    """
    svg = (_LUCIDE / f"{name}.svg").read_text(encoding="utf-8")
    svg = svg[svg.index("<svg"):]
    svg = " ".join(svg.split())
    return svg.replace(
        f'class="lucide lucide-{name}"',
        f'class="{cls}" aria-hidden="true" focusable="false"',
        1,
    )


def define_env(env):
    """
    Define custom macros for MkDocs
    """

    @env.macro
    def youtube(video_id: str, title: str, channel: str, channel_url: str) -> str:
        """A click-to-load YouTube video (README, "Videos").

        Until the reader presses play the page shows only a local poster
        (content/assets/images/video/<id>.webp, 1280 x 720), so nothing is requested from
        YouTube and no cookie is set. zeekr.js then swaps in the
        youtube-nocookie.com player. One line of HTML, so it can sit in
        Markdown on its own line.
        """
        depth = env.page.url.strip("/").count("/") + 1 if env.page.url.strip("/") else 0
        poster = "../" * depth + f"assets/images/video/{video_id}.webp"
        watch = f"https://www.youtube.com/watch?v={video_id}"
        safe = html.escape(title, quote=True)
        return (
            f'<figure class="zi-video"><div class="zi-video__frame" data-zi-video="{video_id}" data-zi-title="{safe}">'
            f'<img src="{poster}" alt="" width="1280" height="720" loading="lazy" decoding="async">'
            f'<button type="button" class="zi-video__play" aria-label="Play video: {safe} (loads YouTube)">'
            f'<span class="zi-video__mark">{_lucide("play", "zi-video__icon")}</span></button></div>'
            f'<figcaption>Video: <a href="{channel_url}">{html.escape(channel)}</a> on YouTube. '
            f'<a href="{watch}">Watch on YouTube</a></figcaption></figure>'
        )

    @env.macro
    def card_icon(icon: str) -> str:
        """The icon at the top of a section card (home Start here, section indexes)."""
        return _lucide(icon, "zi-card-icon")

    @env.macro
    def spec_card(icon: str, label: str, value: str, detail: str = "") -> str:
        """One spec summary card for a .zi-spec-grid (see README, "Spec cards").

        icon is a file name in overrides/.icons/lucide; value never wraps, so
        "2,000 kg" stays on one line. Returns one line of HTML, so it can sit
        inside a raw HTML block without a blank line ending the block.
        """
        parts = [
            '<div class="zi-spec-card">',
            _lucide(icon),
            f'<span class="zi-spec-card__label">{label}</span>',
            f'<span class="zi-spec-card__value">{value}</span>',
        ]
        if detail:
            parts.append(f'<span class="zi-spec-card__detail">{detail}</span>')
        parts.append("</div>")
        return "".join(parts)

    @env.macro
    def glossary() -> str:
        """The Glossary page body, from data/glossary.yml (README, "Glossary").

        Terms are sorted A to Z into letter groups, each an h2 with the term's id
        as its anchor, so Material's search indexes every term (and its aliases,
        in the text under it) and lands on it. The filter, chips and copy-link
        buttons are progressive: they ship hidden and javascripts/glossary.js
        reveals them, so without JS the page is the plain list with an A to Z
        bar of anchor links. Footnote keys in definitions become the page's
        Sources, numbered in reading order.
        """
        data = yaml.safe_load((Path(__file__).parent / "data" / "glossary.yml").read_text(encoding="utf-8"))
        cats = data["categories"]
        sources = data.get("sources") or {}
        terms = sorted(data["terms"], key=lambda t: t["term"].casefold())
        ids = [t["id"] for t in terms]
        if len(ids) != len(set(ids)):
            raise ValueError("data/glossary.yml: duplicate term id")

        def letter(term: str) -> str:
            c = term[0].upper()
            return c if c.isalpha() else "#"

        def letter_id(c: str) -> str:
            return "letter-0-9" if c == "#" else f"letter-{c.lower()}"

        groups: Dict[str, List[Dict[str, Any]]] = {}
        for t in terms:
            groups.setdefault(letter(t["term"]), []).append(t)
        alphabet = ["#"] + [chr(c) for c in range(ord("A"), ord("Z") + 1)]

        esc = html.escape
        letters = "".join(
            f'<a href="#{letter_id(c)}" data-letter="{letter_id(c)}">{"0-9" if c == "#" else c}</a>' if c in groups
            else f'<span class="is-empty" aria-hidden="true">{"0-9" if c == "#" else c}</span>'
            for c in alphabet)
        chips = "".join(f'<button type="button" class="zi-chip" data-cat="{k}" aria-pressed="false">{esc(v)}</button>'
                        for k, v in cats.items())
        bar = ['<div class="zi-gloss-chips" role="group" aria-label="Filter by category" hidden>'
               '<button type="button" class="zi-chip" data-cat="" aria-pressed="true">All</button>' + chips + '</div>',
               # Only the search and the letters stick on wide screens; the chips would crowd the page.
               '<div class="zi-gloss-bar">',
               '<div class="zi-gloss-search" hidden>',
               '<label class="zi-gloss-search__label" for="zi-gloss-q">Filter the glossary</label>',
               '<div class="zi-gloss-search__field">' + _lucide("search", "zi-gloss-search__icon")
               + '<input id="zi-gloss-q" class="zi-gloss-search__input" type="search" autocomplete="off" spellcheck="false" '
               'placeholder="Try SOC, regen or LCT" aria-describedby="zi-gloss-count">'
               '<button type="button" class="zi-gloss-clear" hidden>' + _lucide("x", "zi-gloss-clear__icon")
               + '<span>Clear</span></button></div>',
               '</div>',
               '<div class="zi-gloss-az-row"><nav class="zi-gloss-az" aria-label="Jump to a letter">' + letters + '</nav>'
               '<p class="zi-gloss-count" id="zi-gloss-count" aria-live="polite" hidden></p></div>',
               '</div>',
               '<p class="zi-gloss-empty" hidden>No terms match. <button type="button" class="zi-gloss-reset">Clear the filter</button></p>',
               '<template id="zi-gloss-link-icon">' + _lucide("link", "zi-term__copy-icon") + '</template>']

        used: List[str] = []
        out = ['<div class="zi-gloss" markdown>', "", "\n".join(bar), ""]
        for c in alphabet:
            if c not in groups:
                continue
            label = "0-9" if c == "#" else c
            out += [f'<section class="zi-gloss-group" markdown>', "",
                    f'<p class="zi-gloss-letter" id="{letter_id(c)}">{label}</p>', ""]
            for t in groups[c]:
                if t["category"] not in cats:
                    raise ValueError(f"data/glossary.yml: {t['id']} has unknown category {t['category']}")
                definition = " ".join(str(t["definition"]).split())
                for key in re.findall(r"\[\^([^\]]+)\]", definition):
                    if key not in sources:
                        raise ValueError(f"data/glossary.yml: {t['id']} cites [^{key}], which is not in sources")
                    if key not in used:
                        used.append(key)
                aka = t.get("aka") or []
                meta = f'<span class="zi-term__cat">{esc(cats[t["category"]])}</span>'
                if aka:
                    meta += " Also called " + ", ".join(esc(a) for a in aka) + "."
                out += [f'<div class="zi-term" data-cat="{t["category"]}" markdown>', "",
                        f'## {t["term"]} {{ #{t["id"]} }}', "",
                        meta, '{: .zi-term__meta }', "",
                        definition, ""]
                see = t.get("see") or []
                if see:
                    links = " &middot; ".join(f'[{s["label"]}](../{s["page"]})' for s in see)
                    out += [f"See: {links}", "{: .zi-term__see }", ""]
                out += ["</div>", ""]
            out += ["</section>", ""]
        out += ["</div>", ""]
        if used:
            out += ["## Sources", ""] + [f"[^{k}]: {sources[k]}" for k in used] + [""]
        return "\n".join(out)

    @env.macro
    def load_model_data(model_slug: str, year: int) -> Dict[str, Any]:
        """
        Load model data from YAML file

        Args:
            model_slug: Model identifier (e.g., '7x', 'x', '009')
            year: Model year (e.g., 2025)

        Returns:
            Dict containing the parsed YAML data
        """
        data_path = Path(f"data/models/{model_slug}/{year}.yaml")

        if not data_path.exists():
            return {}

        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except Exception as e:
            print(f"Error loading model data from {data_path}: {e}")
            return {}

    @env.macro
    def get_model_variants(model_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Extract and return variant data from model YAML

        Args:
            model_data: Parsed model YAML data

        Returns:
            List of variant dictionaries
        """
        return model_data.get('variants', [])

    @env.macro
    def get_market_data(model_data: Dict[str, Any], market_code: str = 'AU') -> Dict[str, Any]:
        """
        Get market-specific data (pricing, warranty, etc.)

        Args:
            model_data: Parsed model YAML data
            market_code: Market code (default: 'AU' for Australia)

        Returns:
            Market-specific data dictionary
        """
        markets = model_data.get('markets', [])
        for market in markets:
            if market.get('code') == market_code:
                return market
        return {}

    @env.macro
    def get_variant_pricing(market_data: Dict[str, Any], variant_id: str, state_code: str = 'VIC') -> Dict[str, Any]:
        """
        Get pricing data for a specific variant in a specific state

        Args:
            market_data: Market data from get_market_data()
            variant_id: Variant identifier (e.g., 'rwd_75')
            state_code: State code (default: 'VIC')

        Returns:
            Pricing data for the variant in that state
        """
        pricing = market_data.get('pricing', {})
        states = pricing.get('states', [])

        for state in states:
            if state.get('code') == state_code:
                variants = state.get('variants', [])
                for variant in variants:
                    if variant.get('id') == variant_id:
                        return variant
        return {}

    @env.macro
    def format_currency(amount: Optional[float], currency: str = 'AUD') -> str:
        """
        Format currency amount with proper symbols and formatting

        Args:
            amount: Numeric amount (can be None)
            currency: Currency code (default: 'AUD')

        Returns:
            Formatted currency string
        """
        if amount is None:
            return 'N/A'

        if currency == 'AUD':
            return f"${amount:,.0f}"

        return f"{amount:,.0f} {currency}"

    @env.macro
    def format_range(range_km: Optional[int]) -> str:
        """
        Format range with proper units

        Args:
            range_km: Range in kilometres

        Returns:
            Formatted range string
        """
        if range_km is None:
            return 'N/A'
        return f"{range_km:,} km"

    @env.macro
    def format_acceleration(zero_to_100: Optional[float]) -> str:
        """
        Format 0-100km/h acceleration time

        Args:
            zero_to_100: Acceleration time in seconds

        Returns:
            Formatted acceleration string
        """
        if zero_to_100 is None:
            return 'N/A'
        return f"{zero_to_100}s"

    @env.macro
    def format_power(power_kw: Optional[int], include_hp: bool = True) -> str:
        """
        Format power output with kW and optional HP

        Args:
            power_kw: Power in kilowatts
            include_hp: Whether to include horsepower conversion

        Returns:
            Formatted power string
        """
        if power_kw is None:
            return 'N/A'

        result = f"{power_kw}kW"
        if include_hp:
            hp = int(power_kw * 1.34102)  # Convert kW to HP
            result += f" ({hp}hp)"

        return result

    @env.macro
    def format_battery(gross_kwh: Optional[int], usable_kwh: Optional[int] = None) -> str:
        """
        Format battery capacity information

        Args:
            gross_kwh: Gross battery capacity in kWh
            usable_kwh: Usable battery capacity in kWh

        Returns:
            Formatted battery string
        """
        if gross_kwh is None:
            return 'N/A'

        if usable_kwh is not None and usable_kwh != gross_kwh:
            return f"{gross_kwh}kWh ({usable_kwh}kWh usable)"

        return f"{gross_kwh}kWh"

    @env.macro
    def format_dimensions(dimensions: Dict[str, Any]) -> Dict[str, str]:
        """
        Format dimension data into readable strings

        Args:
            dimensions: Dimension data from variant

        Returns:
            Dictionary with formatted dimension strings
        """
        if not dimensions:
            return {}

        formatted = {}

        if dimensions.get('length_mm'):
            formatted['length'] = f"{dimensions['length_mm']}mm"

        if dimensions.get('width_mm'):
            formatted['width'] = f"{dimensions['width_mm']}mm"

        if dimensions.get('height_mm'):
            formatted['height'] = f"{dimensions['height_mm']}mm"

        if dimensions.get('wheelbase_mm'):
            formatted['wheelbase'] = f"{dimensions['wheelbase_mm']}mm"

        return formatted

    @env.macro
    def get_hero_image_path(variant: Dict[str, Any], mobile: bool = False) -> str:
        """
        Get the hero image path for a variant

        Args:
            variant: Variant data dictionary
            mobile: Whether to get mobile-optimized image

        Returns:
            Image path or placeholder
        """
        assets = variant.get('assets', {})

        if mobile and assets.get('hero_image_mobile'):
            return f"/images/{assets['hero_image_mobile']}"
        elif assets.get('hero_image'):
            return f"/images/{assets['hero_image']}"
        else:
            # Return placeholder path
            return "/images/placeholder-vehicle.jpg"

    @env.macro
    def create_variant_comparison_row(variants: List[Dict[str, Any]],
                                     market_data: Dict[str, Any],
                                     state_code: str = 'VIC') -> str:
        """
        Create a comparison table row for variants

        Args:
            variants: List of variant data
            market_data: Market data for pricing
            state_code: State code for pricing

        Returns:
            HTML string for comparison row
        """
        if not variants:
            return ""

        html = '<div class="zeekr-comparison-grid">\n'

        for variant in variants:
            variant_id = variant.get('id', '')
            variant_name = variant.get('name', '')

            # Get pricing data
            pricing = get_variant_pricing(market_data, variant_id, state_code)
            rrp = pricing.get('rrp')

            # Get performance data
            performance = variant.get('performance', {})
            range_km = performance.get('range', {}).get('km')
            acceleration = performance.get('zero_to_100_s')

            # Get power data
            system_output = variant.get('system_output', {})
            power_kw = system_output.get('power_kw')

            # Get battery data
            battery = variant.get('battery', {})
            gross_kwh = battery.get('gross_kwh')
            usable_kwh = battery.get('usable_kwh')

            # Get hero image
            hero_image = get_hero_image_path(variant)

            html += f'''
            <div class="zeekr-variant-card">
                <div class="variant-hero">
                    <img src="{hero_image}" alt="{variant_name}" class="variant-image">
                </div>
                <div class="variant-content">
                    <h3 class="variant-name">{variant_name}</h3>
                    <div class="variant-tagline">Premium Electric SUV</div>

                    <div class="variant-specs">
                        <div class="spec-item">
                            <span class="spec-label">Range</span>
                            <span class="spec-value">{format_range(range_km)}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">0-100km/h</span>
                            <span class="spec-value">{format_acceleration(acceleration)}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Power</span>
                            <span class="spec-value">{format_power(power_kw)}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Battery</span>
                            <span class="spec-value">{format_battery(gross_kwh, usable_kwh)}</span>
                        </div>
                    </div>

                    <div class="variant-pricing">
                        <span class="price-label">From</span>
                        <span class="price-value">{format_currency(rrp)}</span>
                    </div>
                </div>
            </div>
            '''

        html += '</div>\n'
        return html

    @env.macro
    def create_state_pricing_section(variants: List[Dict[str, Any]],
                                    market_data: Dict[str, Any],
                                    state_code: str = 'VIC') -> str:
        """
        Create state-specific pricing section with incentives

        Args:
            variants: List of variant data
            market_data: Market data for pricing
            state_code: State code for pricing

        Returns:
            HTML string for state pricing section
        """
        if not variants or not market_data:
            return "<p>Pricing information not available.</p>"

        # Get state data
        states = market_data.get('pricing', {}).get('states', [])
        state_data = None
        for state in states:
            if state.get('code') == state_code:
                state_data = state
                break

        if not state_data:
            return f"<p>Pricing information not available for {state_code}.</p>"

        state_name = state_data.get('name', state_code)

        html = f'<div class="pricing-state-section">\n'
        html += f'    <div class="pricing-grid">\n'

        # Create pricing cards for each variant
        for variant in variants:
            variant_id = variant.get('id', '')
            variant_name = variant.get('name', '')

            # Find pricing for this variant
            variant_pricing = None
            for pricing in state_data.get('variants', []):
                if pricing.get('id') == variant_id:
                    variant_pricing = pricing
                    break

            if not variant_pricing:
                continue

            html += f'''
        <div class="pricing-card zeekr-card">
            <h4>{variant_name}</h4>
            <div class="price-breakdown">
                <div class="price-item">
                    <span>RRP:</span>
                    <span>{format_currency(variant_pricing.get('rrp'))}</span>
                </div>
                <div class="price-item">
                    <span>Dealer Delivery:</span>
                    <span>{format_currency(variant_pricing.get('dealer_delivery'))}</span>
                </div>
                <div class="price-item">
                    <span>Stamp Duty:</span>
                    <span>{format_currency(variant_pricing.get('stamp_duty'))}</span>
                </div>
                <div class="price-item">
                    <span>Registration:</span>
                    <span>{format_currency(variant_pricing.get('registration'))}</span>
                </div>
                <div class="price-item">
                    <span>CTP Insurance:</span>
                    <span>{format_currency(variant_pricing.get('ctp_insurance'))}</span>
                </div>
                <div class="price-total">
                    <span>Drive-Away Estimate:</span>
                    <span class="zeekr-highlight">{format_currency(variant_pricing.get('drive_away_estimate'))}</span>
                </div>
            </div>
        </div>'''

        html += '\n    </div>\n'

        # Add incentives information
        incentives = state_data.get('incentives', {})
        if incentives:
            html += f'''
    <div class="incentives-info zeekr-card">
        <h4>{state_name} Incentives</h4>
        <ul>'''

            # EV Rebate
            ev_rebate = incentives.get('ev_rebate', {})
            if ev_rebate.get('amount'):
                html += f'''
            <li><strong>EV Rebate:</strong> {format_currency(ev_rebate.get('amount'))} for vehicles under {format_currency(ev_rebate.get('cap_price'))}</li>'''

            # Stamp duty exemption
            stamp_duty = incentives.get('stamp_duty_exemption', {})
            if stamp_duty.get('eligible'):
                html += f'''
            <li><strong>Stamp Duty Exemption:</strong> {stamp_duty.get('description', 'Available for eligible vehicles')}</li>'''

            # Registration discount
            rego_discount = incentives.get('registration_discount', {})
            if rego_discount.get('amount'):
                html += f'''
            <li><strong>Registration Discount:</strong> {format_currency(rego_discount.get('amount'))} discount on registration</li>'''

            html += '''
        </ul>
        <p><small>Incentives subject to eligibility criteria and may change. Check with your dealer for current offers.</small></p>
    </div>'''

        html += '</div>\n'
        return html