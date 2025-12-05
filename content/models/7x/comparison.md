# Zeekr 7X Model Comparison

Compare all available Zeekr 7X variants side-by-side to find the perfect electric SUV for your needs.

{% set model_data = load_model_data('7x', 2025) %}
{% set variants = get_model_variants(model_data) %}
{% set market_data = get_market_data(model_data, 'AU') %}
{% set warranty = market_data.warranty %}

## Variant Overview

{{ create_variant_comparison_row(variants, market_data, 'VIC') }}

## Detailed Specifications

### Dimensions

All Zeekr 7X variants share the same spacious dimensions, providing excellent interior room and cargo capacity.

<div class="zeekr-dimensions-section">
    <div class="dimensions-visual">
        <div class="vehicle-silhouette">
            <svg viewBox="0 0 400 200" class="dimension-diagram">
                <!-- Vehicle silhouette outline -->
                <path d="M50 150 L80 150 L85 140 L100 125 L120 120 L140 115 L180 115 L220 115 L260 115 L280 120 L300 125 L315 140 L320 150 L350 150 L360 160 L340 160 L330 170 L320 170 L315 160 L85 160 L80 170 L70 170 L60 160 L40 160 Z"
                      fill="var(--zeekr-electric-blue)"
                      fill-opacity="0.2"
                      stroke="var(--zeekr-electric-blue)"
                      stroke-width="2"/>

                <!-- Dimension lines and labels -->
                <!-- Length -->
                <line x1="50" y1="180" x2="350" y2="180" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="50" y1="175" x2="50" y2="185" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="350" y1="175" x2="350" y2="185" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <text x="200" y="195" text-anchor="middle" class="dimension-label">4787mm Length</text>

                <!-- Width -->
                <line x1="30" y1="120" x2="30" y2="170" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="25" y1="120" x2="35" y2="120" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="25" y1="170" x2="35" y2="170" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <text x="15" y="150" text-anchor="middle" class="dimension-label" transform="rotate(-90, 15, 150)">1930mm Width</text>

                <!-- Height -->
                <line x1="370" y1="115" x2="370" y2="160" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="365" y1="115" x2="375" y2="115" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <line x1="365" y1="160" x2="375" y2="160" stroke="var(--zeekr-accent-cyan)" stroke-width="1"/>
                <text x="385" y="140" text-anchor="start" class="dimension-label">1650mm Height</text>

                <!-- Wheelbase -->
                <line x1="85" y1="190" x2="315" y2="190" stroke="var(--zeekr-warning)" stroke-width="2"/>
                <line x1="85" y1="185" x2="85" y2="195" stroke="var(--zeekr-warning)" stroke-width="2"/>
                <line x1="315" y1="185" x2="315" y2="195" stroke="var(--zeekr-warning)" stroke-width="2"/>
                <text x="200" y="210" text-anchor="middle" class="wheelbase-label">2900mm Wheelbase</text>
            </svg>
        </div>
    </div>

    <div class="dimensions-specs">
        <div class="dimension-grid">
            {% set sample_dimensions = variants[0].dimensions %}
            <div class="dimension-item">
                <span class="dimension-label">Length</span>
                <span class="dimension-value">{{ sample_dimensions.length_mm }}mm</span>
            </div>
            <div class="dimension-item">
                <span class="dimension-label">Width</span>
                <span class="dimension-value">{{ sample_dimensions.width_mm }}mm</span>
            </div>
            <div class="dimension-item">
                <span class="dimension-label">Height</span>
                <span class="dimension-value">{{ sample_dimensions.height_mm }}mm</span>
            </div>
            <div class="dimension-item">
                <span class="dimension-label">Wheelbase</span>
                <span class="dimension-value">{{ sample_dimensions.wheelbase_mm }}mm</span>
            </div>
        </div>
    </div>
</div>

### Performance Comparison

<div class="performance-comparison zeekr-spec-table">
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Specification</th>
                {% for variant in variants %}
                <th>{{ variant.name }}</th>
                {% endfor %}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="spec-category">Drivetrain</td>
                {% for variant in variants %}
                <td>{{ variant.drivetrain.layout }}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">System Power</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ format_power(variant.system_output.power_kw) }}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">System Torque</td>
                {% for variant in variants %}
                <td>{{ variant.system_output.torque_nm }}Nm</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">0-100km/h</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ format_acceleration(variant.performance.zero_to_100_s) }}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Top Speed</td>
                {% for variant in variants %}
                <td>{{ variant.performance.top_speed_kph }}km/h</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">WLTP Range</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ format_range(variant.performance.range.km) }}</td>
                {% endfor %}
            </tr>
        </tbody>
    </table>
</div>

### Battery & Charging

<div class="battery-comparison zeekr-spec-table">
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Specification</th>
                {% for variant in variants %}
                <th>{{ variant.name }}</th>
                {% endfor %}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="spec-category">Battery Capacity</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ format_battery(variant.battery.gross_kwh, variant.battery.usable_kwh) }}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Battery Chemistry</td>
                {% for variant in variants %}
                <td>{{ variant.battery.chemistry }}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">DC Fast Charging</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ variant.charging.dc.max_kw }}kW peak</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">10-80% Charge Time</td>
                {% for variant in variants %}
                <td>{{ variant.charging.dc.time_10_80_min }} minutes</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">AC Charging</td>
                {% for variant in variants %}
                <td>{{ variant.charging.ac.max_kw }}kW ({{ variant.charging.ac.connector }})</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Vehicle-to-Load</td>
                {% for variant in variants %}
                <td>{{ variant.charging.bidirectional.v2l_kw }}kW</td>
                {% endfor %}
            </tr>
        </tbody>
    </table>
</div>

### Technology & Features

<div class="technology-comparison zeekr-spec-table">
    <table class="comparison-table">
        <thead>
            <tr>
                <th>Feature Category</th>
                {% for variant in variants %}
                <th>{{ variant.name }}</th>
                {% endfor %}
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="spec-category">Infotainment System</td>
                {% for variant in variants %}
                <td>{{ variant.infotainment.os }} ({{ variant.infotainment.soc }})</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Display Cluster</td>
                {% for variant in variants %}
                <td>{{ variant.infotainment.displays.cluster_in }}" digital</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Centre Display</td>
                {% for variant in variants %}
                <td class="zeekr-highlight">{{ variant.infotainment.displays.centre_in }}" 3.5K touchscreen</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Head-Up Display</td>
                {% for variant in variants %}
                <td>{% if variant.infotainment.displays.hud_in %}{{ variant.infotainment.displays.hud_in }}" AR-HUD{% else %}Not available{% endif %}</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">Audio System</td>
                {% for variant in variants %}
                <td>{{ variant.infotainment.audio.system }} ({{ variant.infotainment.audio.speakers }} speakers, {{ variant.infotainment.audio.power_watts }}W)</td>
                {% endfor %}
            </tr>
            <tr>
                <td class="spec-category">ADAS Level</td>
                {% for variant in variants %}
                <td>{{ variant.adas_safety.level }}</td>
                {% endfor %}
            </tr>
        </tbody>
    </table>
</div>

## Warranty Information

<div class="warranty-section">
    <div class="warranty-grid">
        <div class="warranty-card zeekr-card">
            <h3>Basic Vehicle Warranty</h3>
            <div class="warranty-term">{{ warranty.vehicle }}</div>
            <p>Comprehensive coverage for all vehicle components and systems</p>
        </div>
        <div class="warranty-card zeekr-card">
            <h3>Battery Warranty</h3>
            <div class="warranty-term">{{ warranty.battery }}</div>
            <p>High-voltage battery coverage including capacity retention guarantee</p>
        </div>
        {% if warranty.roadside %}
        <div class="warranty-card zeekr-card">
            <h3>Roadside Assistance</h3>
            <div class="warranty-term">{{ warranty.roadside }}</div>
            <p>24/7 roadside assistance across Australia</p>
        </div>
        {% endif %}
    </div>
</div>

## State-by-State Pricing

Select your state to see accurate drive-away pricing including local incentives and charges:

=== "Victoria"

    {{ create_state_pricing_section(variants, market_data, 'VIC') }}

=== "New South Wales"

    {{ create_state_pricing_section(variants, market_data, 'NSW') }}

=== "Queensland"

    {{ create_state_pricing_section(variants, market_data, 'QLD') }}

=== "Western Australia"

    {{ create_state_pricing_section(variants, market_data, 'WA') }}

=== "South Australia"

    {{ create_state_pricing_section(variants, market_data, 'SA') }}

=== "Tasmania"

    {{ create_state_pricing_section(variants, market_data, 'TAS') }}

=== "Australian Capital Territory"

    {{ create_state_pricing_section(variants, market_data, 'ACT') }}

=== "Northern Territory"

    {{ create_state_pricing_section(variants, market_data, 'NT') }}

!!! info "Next Steps"
    Ready to experience the Zeekr 7X? Visit our [service centres](../../resources/service-centers-vic.md) to find your nearest Zeekr partner or [book a test drive](https://www.zeekr.com.au/test-drive).

---

*Pricing information is current as of {{ market_data.pricing.updated }}. Drive-away prices are estimates and may vary by dealer. State incentives are subject to eligibility criteria and may change without notice.*