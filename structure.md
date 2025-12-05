# {{ extra.club.full_name }} Wiki - Content Structure Guide

This comprehensive guide explains the content structure, contribution guidelines, and standards for the {{ extra.club.full_name }} Wiki. Whether you're a club member adding your first experience or a technical contributor, this guide will help you create consistent, high-quality content.

## Table of Contents

1. [MkDocs Variables for Club References](#mkdocs-variables-for-club-references)
2. [Content Structure Overview](#content-structure-overview)
3. [Contribution Guidelines](#contribution-guidelines)
4. [Markdown Standards](#markdown-standards)
5. [Australian-Specific Requirements](#australian-specific-requirements)
6. [Content Templates](#content-templates)
7. [Adding New Car Models](#adding-new-car-models)
8. [Maintenance Procedures](#maintenance-procedures)
9. [Style Guide](#style-guide)

## MkDocs Variables for Club References

**IMPORTANT**: Always use MkDocs variables for club references to maintain consistency and enable easy updates across the entire wiki.

### Available Variables

All content files have access to the following club variables defined in `mkdocs.yml`:

```markdown
{{ extra.club.name }}          # "Zeekr Enthusiasts of Victoria"
{{ extra.club.abbreviation }}  # "ZEV"
{{ extra.club.full_name }}     # "Zeekr Enthusiasts of Victoria (ZEV)"
{{ extra.club.location }}      # "Victoria, Australia"
{{ extra.club.contact_email }} # "info@zev.club"
{{ extra.club.website }}       # "https://zev.club"
```

### Usage Guidelines

#### ✅ Correct Usage

```markdown
# Welcome to {{ extra.club.full_name }}
The {{ extra.club.abbreviation }} community is based in {{ extra.club.location }}.
Contact us at {{ extra.club.contact_email }} for more information.
Visit our website: {{ extra.club.website }}
```

#### ❌ Incorrect Usage

```markdown
# Welcome to Victoria Zeekr Club
The VZC community is based in Victoria, Australia.
Contact us at [email needed] for more information.
Visit our website: [website needed]
```

### When to Use Each Variable

- **`{{ extra.club.full_name }}`**: Use for headers, formal introductions, and first mentions
- **`{{ extra.club.abbreviation }}`**: Use for subsequent references in the same content
- **`{{ extra.club.name }}`**: Use when the full name is too long for the context
- **`{{ extra.club.location }}`**: Use for geographic references
- **`{{ extra.club.contact_email }}`**: Use for contact information
- **`{{ extra.club.website }}`**: Use for website links

### Benefits of Using Variables

1. **Consistency**: Uniform branding across all content
2. **Maintainability**: Single point of change for club information
3. **Professional Presentation**: No placeholder text or inconsistent naming
4. **Future-Proofing**: Easy to rebrand or update contact details
5. **Error Prevention**: Eliminates typos in club name and contact info

### Variable Configuration

Variables are defined in `mkdocs.yml` under the `extra:` section:

```yaml
extra:
  club:
    name: "Zeekr Enthusiasts of Victoria"
    abbreviation: "ZEV"
    full_name: "Zeekr Enthusiasts of Victoria (ZEV)"
    location: "Victoria, Australia"
    contact_email: "info@zev.club"
    website: "https://zev.club"
```

### Content Review Checklist

Before submitting content, ensure:

- [ ] No hardcoded club names (search for "Victoria Zeekr Club", "VZC", etc.)
- [ ] Contact information uses `{{ extra.club.contact_email }}`
- [ ] Geographic references use `{{ extra.club.location }}`
- [ ] Website links use `{{ extra.club.website }}`
- [ ] Club references use appropriate variables

## Content Structure Overview

The wiki is organised into six main sections, each serving a specific purpose for our {{ extra.club.location }} Zeekr community:

### 1. Models (`content/models/`)

Information about Zeekr vehicles available in Australia.

```
models/
├── index.md                     # Models overview page
├── 7x/                         # Zeekr 7X information
│   ├── overview.md             # Model overview
│   ├── 2024/                   # 2024 model year
│   │   ├── specifications.md   # Technical specs
│   │   ├── pricing.md          # Australian pricing
│   │   └── service-schedule.md # Maintenance schedule
│   └── 2025/                   # 2025 model year
│       └── overview.md         # New model updates
├── x/                          # Zeekr X information
│   └── overview.md
└── 009/                        # Zeekr 009 information
    └── overview.md
```

**Purpose**: Provide comprehensive technical and practical information about each Zeekr model sold in Australia.

**Content Focus**:
- Australian specifications and features
- Local pricing in AUD
- Real-world performance data from {{ extra.club.location }} owners
- Service schedules and warranty information
- Photos from Australian deliveries and events

### 2. Guides (`content/guides/`)

Practical guides for Zeekr ownership in Australia.

```
guides/
├── index.md                    # Guides overview
├── charging/                   # EV charging guides
│   ├── home-setup.md          # Home charging installation
│   ├── public-networks.md     # Public charging in Australia
│   └── road-trips.md          # Long-distance travel
├── ownership/                  # Ownership guides
│   ├── buying-process.md      # Purchasing a Zeekr
│   ├── delivery-checklist.md  # What to check on delivery
│   └── first-30-days.md       # New owner guide
├── maintenance/               # Service and care
│   └── overview.md
└── new-to-ev/                 # First-time EV guides
    └── overview.md
```

**Purpose**: Help members navigate the practical aspects of Zeekr ownership in the Australian context.

**Content Focus**:
- Step-by-step processes
- Australian regulations and requirements
- Cost breakdowns in AUD
- Local supplier recommendations
- Member experiences and tips

### 3. Club (`content/club/`)

{{ extra.club.full_name }} specific information and activities.

```
club/
├── index.md                   # Club overview
├── events/                    # Club events
│   ├── index.md              # Events overview
│   └── [event-specific files]
├── group-buys/               # Member group purchases
│   ├── index.md              # Group buys overview
│   └── [group-buy files]
└── meet-the-committee.md     # Committee information
```

**Purpose**: Foster community engagement and provide club-specific information.

**Content Focus**:
- Event announcements and reports
- Group purchasing opportunities
- Committee contact information
- Membership benefits and activities

### 4. Resources (`content/resources/`)

Reference materials and useful information for {{ extra.club.location }} Zeekr owners.

```
resources/
├── index.md                           # Resources overview
├── service-centres-vic.md             # Victorian service locations
├── charging-networks-australia.md     # Charging network info
└── useful-links.md                    # External resources
```

**Purpose**: Provide quick access to essential reference information.

**Content Focus**:
- Service centre locations and contact details
- Charging network coverage and costs
- Government resources and rebates
- Useful apps and tools

### 5. Comparisons (`content/comparisons/`)

Help potential buyers make informed decisions.

```
comparisons/
├── index.md                      # Comparisons overview
├── zeekr-vs-competitors.md       # Zeekr vs other brands
└── model-comparison-table.md     # Zeekr model comparisons
```

**Purpose**: Assist with vehicle selection and purchasing decisions.

**Content Focus**:
- Side-by-side feature comparisons
- Value propositions
- Use case recommendations
- Real-world owner feedback

### 6. Stylesheets (`content/stylesheets/`)

Custom styling for the Zeekr brand.

```
stylesheets/
├── zeekr.css                     # Zeekr brand colours and styling
└── nightowl.css                  # Enhanced code highlighting
```

**Purpose**: Maintain consistent Zeekr branding throughout the wiki.

## Contribution Guidelines

### Who Can Contribute

- **{{ extra.club.full_name }} Members**: Full editing access through club systems
- **Zeekr Owners**: Experiences, reviews, and practical information
- **Technical Contributors**: Code improvements, new features, bug fixes
- **Community Members**: Corrections, suggestions, and feedback

### Content Standards

#### Accuracy Requirements

- **Verify Information**: All technical specifications and pricing must be current and accurate
- **Source Citations**: Include sources for technical data and pricing information
- **Real-World Data**: Preference for actual owner experiences over manufacturer claims
- **Regular Updates**: Information should be reviewed and updated regularly

#### Australian Focus

- **Local Relevance**: All content must be relevant to the Australian market
- **{{ extra.club.location }} Emphasis**: Special focus on {{ extra.club.location }} conditions, regulations, and resources
- **Currency**: All prices in Australian Dollars (AUD)
- **Units**: Use metric system (km, kWh, kg, etc.)
- **Terminology**: Use Australian English spelling and terminology

#### Community Standards

- **Respectful Tone**: Professional and welcoming language
- **Inclusive Content**: Accessible to both experienced and new EV owners
- **Member Privacy**: Respect member privacy and obtain consent for personal stories
- **Constructive Feedback**: Focus on helpful, actionable information

### Submission Process

#### For Club Members

1. **Internal System**: Use the club's content management system
2. **Committee Review**: Content reviewed by club committee before publishing
3. **Member Verification**: Identity verification through club membership

#### For External Contributors

1. **GitHub Issues**: Submit suggestions and corrections via GitHub issues
2. **Pull Requests**: Technical contributors can submit pull requests
3. **Email Submissions**: Send content to club committee for review

#### For Technical Changes

1. **Fork Repository**: Create a fork of the main repository
2. **Create Branch**: Use descriptive branch names (`feature/new-model-guide`)
3. **Test Locally**: Ensure changes work correctly with `mkdocs serve`
4. **Submit PR**: Submit pull request with clear description of changes

## Markdown Standards

### File Naming Conventions

- **Use kebab-case**: `charging-networks-australia.md` not `Charging Networks Australia.md`
- **Descriptive Names**: File names should clearly indicate content
- **No Spaces**: Use hyphens instead of spaces
- **Lowercase**: All file names in lowercase

### Heading Structure

```markdown
# Page Title (H1) - Only one per page

## Main Sections (H2)

### Subsections (H3)

#### Details (H4)

##### Minor Details (H5) - Use sparingly

###### Avoid H6 - Restructure content instead
```

### Content Organisation

#### Required Page Elements

Every content page should include:

```markdown
# Page Title

Brief introduction paragraph explaining the page's purpose.

## Overview Section

Key information and navigation help.

## Main Content Sections

Organised logically for the topic.

## Additional Resources

Links to related pages and external resources.

---

*Last updated: [Date]*
*Contributors: [List of contributors]*
```

#### Link Standards

- **Internal Links**: Use relative paths (`../models/7x/overview.md`)
- **External Links**: Open in new tab when appropriate
- **Link Text**: Descriptive text, not "click here"
- **Broken Links**: Regular checks for broken internal and external links

#### Image Guidelines

- **File Formats**: Use WebP, JPEG, or PNG
- **Sizes**: Optimise for web (max 1920px width for full-width images)
- **Alt Text**: Always include descriptive alt text
- **Captions**: Use captions for context when helpful
- **Copyright**: Only use images with appropriate permissions

```markdown
![Zeekr 7X charging at home](../images/7x-home-charging.webp "Zeekr 7X plugged into home charger")
*Zeekr 7X charging at home using a Type 2 cable*
```

### Code and Technical Content

#### Code Blocks

```markdown
# For configuration files
```yaml
# mkdocs.yml example
site_name: Zeekr Wiki
```

# For commands
```bash
uv run mkdocs serve
```

# For inline code
Use `mkdocs serve` to run locally.
```

#### Technical Specifications

Use consistent formatting for specifications:

```markdown
## Specifications

| Feature | Value |
|---------|-------|
| Range (WLTP) | 530 km |
| Battery | 100 kWh |
| Charging (DC) | 150 kW |
| Power | 200 kW |
```

### Information Boxes

Use MkDocs Material admonitions for important information:

```markdown
!!! info "Australian Specific"
    This information applies specifically to Australian market vehicles.

!!! warning "Important"
    Always verify current pricing with authorised dealers.

!!! tip "Member Tip"
    Real-world range is typically 85-90% of WLTP rating.

!!! note "Committee Note"
    This information was verified by club members in March 2024.
```

## Australian-Specific Requirements

### Legal and Regulatory

- **ADR Compliance**: Note Australian Design Rule compliance where relevant
- **Warranty Terms**: Include Australian Consumer Law protections
- **Import Information**: Note if vehicles are parallel imports vs official imports
- **Registration**: Include state-specific registration requirements

### Market Context

- **Availability**: Clearly state availability in Australian market
- **Dealer Network**: Reference authorised dealers and service centres
- **Support**: Local support availability and limitations
- **Pricing**: Include on-road costs, stamp duty, and registration fees

### Environmental Context

- **Climate Considerations**: Note performance in Australian climate conditions
- **Geographic Factors**: Consider vast distances and charging infrastructure
- **Seasonal Variations**: Summer/winter performance differences
- **Regional Differences**: Urban vs rural, different states

### Financial Information

```markdown
## Pricing (as of [Date])

| Variant | Drive-away Price (VIC) |
|---------|------------------------|
| Base Model | $89,990 AUD |
| Premium | $99,990 AUD |

*Prices include GST, stamp duty, and registration in Victoria*
*Government rebates may apply - check current eligibility*
```

## Content Templates

### Model Overview Template

```markdown
# [Model Name] Overview

Brief introduction to the model and its position in the Zeekr lineup.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Available in Australia

| Variant | Availability | Price Range |
|---------|--------------|-------------|
| [Variant] | [Status] | [Price] AUD |

## Specifications Summary

### Performance
- **Range**: [WLTP range] km
- **Power**: [Power] kW
- **0-100 km/h**: [Time] seconds

### Charging
- **DC Fast**: [Speed] kW
- **AC Charging**: [Speed] kW
- **Charging Port**: [Type]

### Dimensions
- **Length**: [Length] mm
- **Width**: [Width] mm
- **Height**: [Height] mm
- **Boot Space**: [Space] L

## Real-World Experience

### Member Reviews

> "Quote from member review"
>
> *- Member Name, Location, Date*

### Common Questions

**Q: [Question]**
A: [Answer based on member experience]

## Related Information

- [Link to detailed specifications](specifications.md)
- [Link to pricing information](pricing.md)
- [Link to service schedule](service-schedule.md)
- [Link to buying guide](../../guides/ownership/buying-process.md)

---

*Last updated: [Date]*
*Contributors: [List]*
```

### Guide Template

```markdown
# [Guide Title]

Brief description of what this guide covers and who it's for.

## Before You Start

Prerequisites, requirements, or things to consider before following this guide.

## Step-by-Step Instructions

### Step 1: [Step Title]

Detailed instructions for the first step.

!!! tip "Member Tip"
    Helpful advice from community members.

### Step 2: [Step Title]

Continue with subsequent steps.

## Cost Breakdown

| Item | Cost (AUD) | Notes |
|------|------------|-------|
| [Item] | $[Cost] | [Notes] |

**Total Estimated Cost**: $[Total] AUD

## Common Issues and Solutions

### Issue: [Problem Description]

**Solution**: [Solution steps]

**Member Experience**: [Real-world example]

## Additional Resources

- [Internal link to related guide](../other-guide.md)
- [External link](https://example.com) - Official resource
- [Club resource] - Available to members

## Member Experiences

### [Member Name] - [Location]

"[Experience description and tips]"

*Shared: [Date]*

---

*Last updated: [Date]*
*Contributors: [List]*
*Verified by: [Club Committee Member]*
```

### Event Report Template

```markdown
# [Event Name] - [Date]

## Event Details

- **Date**: [Date]
- **Location**: [Location]
- **Attendees**: [Number] members
- **Organiser**: [Name]

## Event Highlights

Brief overview of the event's main activities and outcomes.

### Activities

- Activity 1
- Activity 2
- Activity 3

### Key Learnings

- Learning point 1
- Learning point 2

## Photo Gallery

![Event photo 1](../images/events/[event]/photo1.jpg "Photo description")
*Caption for photo 1*

![Event photo 2](../images/events/[event]/photo2.jpg "Photo description")
*Caption for photo 2*

## Member Feedback

> "Quote from member feedback"
>
> *- Member Name*

## Next Events

Information about upcoming related events.

---

*Event report compiled by: [Name]*
*Photos courtesy of: [Photographer names]*
```

## Adding New Car Models

When Zeekr releases a new model or variant, follow this process to add comprehensive coverage:

### Step 1: Create Directory Structure

```bash
# Create new model directory
mkdir content/models/[model-name]
cd content/models/[model-name]

# Create year-specific directories if needed
mkdir 2024 2025  # or relevant years

# Create required files
touch overview.md
touch 2024/specifications.md
touch 2024/pricing.md
touch 2024/service-schedule.md
```

### Step 2: Update Navigation

Edit `mkdocs.yml` to add the new model to the navigation:

```yaml
nav:
  - Models:
      - models/index.md
      - [New Model Name]:
          - Overview: models/[model-name]/overview.md
          - 2024 Model:
              - Specifications: models/[model-name]/2024/specifications.md
              - Pricing: models/[model-name]/2024/pricing.md
              - Service Schedule: models/[model-name]/2024/service-schedule.md
```

### Step 3: Create Content

Use the model overview template and ensure all required information is included:

- Technical specifications verified for Australian market
- Pricing in AUD including all costs
- Real-world testing data from club members
- Comparison with existing models
- Availability timeline in Australia

### Step 4: Update Related Pages

- Add to model comparison tables
- Update guides that reference "all models"
- Add to buying process guide
- Update index pages

### Step 5: Verification Process

1. **Technical Review**: Committee member with technical expertise
2. **Market Verification**: Confirm pricing and availability with dealers
3. **Member Testing**: Real-world validation from club members
4. **Content Review**: Check consistency with existing content

## Maintenance Procedures

### Regular Content Reviews

#### Monthly Tasks

- **Price Updates**: Verify current pricing with dealers
- **Availability Updates**: Check model availability and wait times
- **Link Checking**: Test all internal and external links
- **Event Updates**: Add new events and update past event status

#### Quarterly Tasks

- **Specification Review**: Verify technical specifications remain current
- **Service Centre Updates**: Check service centre locations and contact details
- **Charging Network Updates**: Update charging network information
- **Government Rebate Updates**: Verify current rebate programs

#### Annual Tasks

- **Complete Content Audit**: Review all content for accuracy and relevance
- **Style Guide Updates**: Update style guide based on lessons learned
- **Template Reviews**: Update templates based on user feedback
- **Archive Old Content**: Archive outdated information appropriately

### Content Lifecycle

#### New Content

1. **Creation**: Use appropriate templates
2. **Review**: Club committee review for accuracy
3. **Publishing**: Add to site navigation and cross-link
4. **Promotion**: Announce to club members

#### Updates

1. **Change Detection**: Monitor for relevant changes
2. **Verification**: Confirm changes with reliable sources
3. **Update Implementation**: Make necessary changes
4. **Review**: Ensure updates don't break consistency

#### Archival

1. **Obsolescence Detection**: Identify outdated content
2. **Historical Value Assessment**: Determine if content has historical value
3. **Archival Process**: Move to archive section with clear dating
4. **Redirect Management**: Ensure no broken links remain

### Quality Assurance

#### Pre-Publication Checklist

- [ ] Content follows style guide
- [ ] All links work correctly
- [ ] Images have appropriate alt text
- [ ] Australian spelling and terminology used
- [ ] Prices in AUD with current date
- [ ] Technical information verified
- [ ] Member privacy respected
- [ ] Appropriate admonitions used

#### Post-Publication Review

- [ ] Content displays correctly on mobile and desktop
- [ ] Navigation works properly
- [ ] Search functionality includes new content
- [ ] Related content is properly cross-linked
- [ ] Member feedback incorporated

## Style Guide

### Language and Tone

#### Voice and Tone

- **Professional but Friendly**: Informative content with a welcoming community feel
- **Inclusive**: Accessible to both EV newcomers and experienced owners
- **Practical**: Focus on actionable information and real-world applications
- **Community-Focused**: Emphasise shared experiences and member contributions

#### Writing Style

- **Clear and Concise**: Avoid jargon unless necessary, explain technical terms
- **Active Voice**: Use active voice where possible
- **Second Person**: Address readers directly ("you should", "your vehicle")
- **Present Tense**: Use present tense for current information

#### Australian English

- **Spelling**: Use Australian English spelling (colour, centre, realise)
- **Terminology**: Use Australian terms (boot not trunk, bonnet not hood)
- **Currency**: Always specify AUD for prices
- **Units**: Use metric system exclusively

### Technical Content

#### Specifications Format

```markdown
## Technical Specifications

### Battery and Range
- **Battery Capacity**: 100 kWh
- **WLTP Range**: 530 km
- **Real-world Range**: 450-480 km (member average)

### Performance
- **Maximum Power**: 200 kW (268 hp)
- **Maximum Torque**: 440 Nm
- **0-100 km/h**: 5.8 seconds
- **Top Speed**: 180 km/h

### Charging
- **DC Fast Charging**: 150 kW maximum
- **AC Charging**: 11 kW maximum
- **Charging Port**: Type 2 (AC) / CCS2 (DC)
- **10-80% Charging Time**: 35 minutes (150kW DC)
```

#### Pricing Format

```markdown
## Pricing (Current as of [Month Year])

### Drive-Away Pricing (Victoria)

| Variant | RRP | Government Rebate | Drive-Away Price |
|---------|-----|-------------------|------------------|
| Standard | $89,990 | $3,000 | $86,990 |
| Premium | $99,990 | $3,000 | $96,990 |

*Prices include GST, stamp duty, registration, and dealer delivery*
*Government rebates subject to eligibility and availability*
*Pricing may vary by state - check with local dealers*
```

### Image Standards

#### Photo Requirements

- **Resolution**: Minimum 1200px width for full-width images
- **Format**: WebP preferred, JPEG acceptable, PNG for graphics
- **Compression**: Optimise for web without significant quality loss
- **Composition**: Clear, well-lit photos showing relevant details

#### Image Organisation

```
content/images/
├── models/
│   ├── 7x/
│   │   ├── exterior/
│   │   ├── interior/
│   │   └── charging/
│   └── x/
├── events/
│   ├── 2024-03-meetup/
│   └── 2024-04-drive/
├── guides/
│   ├── charging/
│   └── ownership/
└── club/
    ├── committee/
    └── activities/
```

#### Alt Text Guidelines

- **Descriptive**: Describe what's actually in the image
- **Context**: Include relevant context for understanding
- **Keywords**: Include relevant keywords naturally
- **Length**: Keep to 125 characters or less when possible

```markdown
![Zeekr 7X exterior showing front three-quarter view in white](images/models/7x/exterior/7x-white-front-quarter.webp "Zeekr 7X in Storm White colour option")
```

### Cross-Reference Standards

#### Internal Linking

- **Relative Paths**: Use relative paths for internal links
- **Descriptive Text**: Link text should describe the destination
- **Context**: Provide context for why the link is relevant
- **Maintenance**: Regular checking for broken internal links

```markdown
For detailed charging information, see our [Home Charging Setup Guide](../guides/charging/home-setup.md).

Compare specifications across all models in our [Model Comparison Table](../comparisons/model-comparison-table.md).
```

#### External Linking

- **Relevance**: Only link to relevant, high-quality external resources
- **Authority**: Prefer official sources and well-established organisations
- **Maintenance**: Regular checking for broken external links
- **Attribution**: Note when external links provide source information

```markdown
Check current government rebates on the [Victorian Government website](https://www.solar.vic.gov.au/zero-emissions-vehicle-rebate).

For official specifications, refer to [Zeekr Australia](https://www.zeekr.com.au/).
```

---

## Getting Help

### For Content Contributors

- **Club Committee**: Contact via club communication channels
- **GitHub Issues**: For technical problems or suggestions
- **Style Questions**: Refer to this guide or ask committee

### For Technical Contributors

- **Development Setup**: See main [README.md](README.md)
- **MkDocs Documentation**: [Official MkDocs guide](https://www.mkdocs.org/)
- **Material Theme**: [Material for MkDocs documentation](https://squidfunk.github.io/mkdocs-material/)

### Community Support

- **Club Meetings**: Regular opportunities for face-to-face help
- **Online Groups**: WhatsApp and Facebook for quick questions
- **Email Support**: {{ extra.club.contact_email }}

---

*This guide is maintained by the {{ extra.club.full_name }} committee and community contributors.*
*Last major revision: September 2024*
*Next scheduled review: December 2024*