# ZEV Wiki Content Templates

This directory contains comprehensive content templates for the {{ extra.club.full_name }} (ZEV) wiki to ensure consistency across all contributor content.

## Available Templates

### Vehicle Information Templates

#### 1. `model-overview.md`
**Purpose:** Create comprehensive overview pages for Zeekr models
**Use for:** New model introduction pages, model landing pages
**Key sections:** Hero section, variants, features, Australian availability, member reviews
**Example usage:** `/content/models/7x/overview.md`

#### 2. `model-specifications.md`
**Purpose:** Detailed technical specifications for specific model years
**Use for:** Complete technical reference pages
**Key sections:** Powertrain, battery, charging, dimensions, technology, safety
**Example usage:** `/content/models/7x/2024/specifications.md`

#### 3. `model-pricing.md`
**Purpose:** Comprehensive pricing information with Australian focus
**Use for:** Current pricing pages, finance information
**Key sections:** Pricing tiers, options, incentives, total cost of ownership
**Example usage:** `/content/models/7x/2024/pricing.md`

#### 4. `comparison.md`
**Purpose:** Detailed comparisons between models, competitors, or options
**Use for:** Model comparisons, competitive analysis, feature comparisons
**Key sections:** Specification tables, cost analysis, member experiences, recommendations
**Example usage:** `/content/comparisons/zeekr-vs-competitors.md`

### Guide & Tutorial Templates

#### 5. `guide-template.md`
**Purpose:** Step-by-step guides and how-to content
**Use for:** Technical guides, ownership guides, tutorials
**Key sections:** Prerequisites, step-by-step instructions, troubleshooting, Australian considerations
**Example usage:** `/content/guides/charging/home-setup.md`

### Club Content Templates

#### 6. `event-report.md`
**Purpose:** Document club events and activities
**Use for:** Meeting reports, drive reports, event summaries
**Key sections:** Event details, attendee info, highlights, photos, feedback
**Example usage:** `/content/club/events/melbourne-drive-2024-03.md`

#### 7. `group-buy.md`
**Purpose:** Group purchase opportunities for members
**Use for:** Accessory group buys, service deals, bulk purchases
**Key sections:** Product info, pricing, terms, registration process
**Example usage:** `/content/club/group-buys/dash-cam-2024-q2.md`

### Reference Templates

#### 8. `resource-page.md`
**Purpose:** Reference information and directory pages
**Use for:** Service directories, charging networks, useful links
**Key sections:** Listings by state, member reviews, contact information
**Example usage:** `/content/resources/service-centers-vic.md`

## How to Use These Templates

### Step 1: Choose the Right Template
Select the template that best matches your content type:
- **New model information:** Use `model-overview.md`
- **Technical specs:** Use `model-specifications.md`
- **Pricing details:** Use `model-pricing.md`
- **How-to content:** Use `guide-template.md`
- **Event documentation:** Use `event-report.md`
- **Group purchases:** Use `group-buy.md`
- **Reference information:** Use `resource-page.md`
- **Comparisons:** Use `comparison.md`

### Step 2: Copy the Template
```bash
cp templates/[template-name].md content/[your-path]/[your-filename].md
```

### Step 3: Customise the Content
1. **Read the comment block** at the top for specific instructions
2. **Replace all `[PLACEHOLDER]` text** with actual content
3. **Remove the comment block** when ready to publish
4. **Follow the placeholder guidance** for each section
5. **Update the contributor information** at the bottom

### Step 4: Review and Publish
- Ensure all placeholders are replaced
- Verify links work correctly
- Check Australian English spelling
- Test any code or instructions
- Add your name to contributors

## Template Guidelines

### Content Standards
- **Australian English:** Use "colour" not "color", "realise" not "realize"
- **Currency:** Always use AUD, include GST status
- **Measurements:** Use metric (km, kW, litres) with imperial in brackets if needed
- **Compliance:** Reference Australian standards (ADR, ACMA, etc.)
- **Privacy:** Use first names only unless permission given

### Formatting Standards
- **Headings:** Use sentence case for headings
- **Zeekr CSS Classes:** Available classes documented in each template
- **Code blocks:** Use appropriate language highlighting
- **Tables:** Use the `zeekr-spec-table` class for specification tables
- **Admonitions:** Use `!!! info`, `!!! warning`, `!!! tip` appropriately

### Zeekr-Specific CSS Classes
These custom CSS classes are available for enhanced styling:

- `.zeekr-hero` - Prominent call-out sections with gradient background
- `.zeekr-card` - Bordered content blocks with hover effects
- `.zeekr-spec-table` - Specification tables with Zeekr styling
- `.zeekr-highlight` - Highlighting important text with brand colours
- `.zeekr-glow` - Animated elements (use sparingly)

### MkDocs Variables
Use these variables for consistency:
- `{{ extra.club.name }}` - "Zeekr Enthusiasts of Victoria"
- `{{ extra.club.abbreviation }}` - "ZEV"
- `{{ extra.club.full_name }}` - "Zeekr Enthusiasts of Victoria (ZEV)"
- `{{ extra.club.location }}` - "Victoria, Australia"
- `{{ extra.club.contact_email }}` - Contact email
- `{{ extra.club.website }}` - Club website

## Best Practices

### Before You Start
- [ ] Check if similar content already exists
- [ ] Verify you have current and accurate information
- [ ] Gather all necessary images and resources
- [ ] Check with committee if creating controversial content

### While Writing
- [ ] Follow the template structure
- [ ] Include member experiences where relevant
- [ ] Cross-reference related content
- [ ] Fact-check all technical information
- [ ] Include update dates and version information

### Before Publishing
- [ ] Remove the template comment block
- [ ] Replace all placeholder text
- [ ] Check all links work
- [ ] Verify images display correctly
- [ ] Test on mobile devices
- [ ] Add your name to contributors

### After Publishing
- [ ] Share with relevant members for feedback
- [ ] Schedule regular reviews for updates
- [ ] Monitor for accuracy and relevance
- [ ] Update when new information becomes available

## Getting Help

### Template Questions
If you need help with templates:
1. Check the specific template's comment block for guidance
2. Look at existing content using that template
3. Ask in the club Discord/forum
4. Contact {{ extra.club.contact_email }}

### Technical Support
For technical wiki issues:
- **GitHub Issues:** Report bugs or suggest improvements
- **Committee Contact:** {{ extra.club.contact_email }}
- **Member Forum:** Ask the community

### Content Review
Before publishing significant content:
- **Committee Review:** For policy or controversial topics
- **Technical Review:** For complex technical guides
- **Legal Review:** For legal or compliance information

## Template Maintenance

### Regular Updates
Templates are reviewed and updated:
- **Quarterly:** For new features or improvements
- **As needed:** When regulations or standards change
- **Community feedback:** Based on member suggestions

### Version History
- **v1.0** (2024-09): Initial template set created
- Future updates will be documented here

### Contributing to Templates
To suggest template improvements:
1. Create a GitHub issue describing the improvement
2. Submit a pull request with proposed changes
3. Email suggestions to {{ extra.club.contact_email }}

---

**Template Maintainer:** [Wiki Committee]
**Last Updated:** [Current Date]
**Next Review:** [Quarterly Review Date]

*These templates are designed to maintain consistency and quality across all {{ extra.club.full_name }} wiki content. Following these guidelines ensures a professional and useful resource for all members.*