# Required Images for BaseBounty

You need to create the following images and place them in this directory (`frontend/public/`).

## Image Requirements

### 1. logo.png (512x512px)
**Purpose:** App icon shown in lists and as favicon
**Specifications:**
- Size: 512x512 pixels
- Format: PNG with transparency preferred
- Design: Simple, clean icon representing tasks/bounties
- Colors: Use primary color #10b981 (emerald green)
- Style: Modern, minimalist

**Design Ideas:**
- A checkmark with a coin/dollar sign
- A target/bullseye icon
- A hand giving/receiving items
- A bounty star badge

### 2. splash.png (1080x1920px)
**Purpose:** Vertical splash screen shown while Mini App loads
**Specifications:**
- Size: 1080x1920 pixels (9:16 aspect ratio)
- Format: PNG or JPEG
- Background: #10b981 (emerald green) as specified in manifest
- Content: BaseBounty logo and tagline

**Design Layout:**
- Center the logo
- Add "BaseBounty" text below logo
- Include tagline: "Work, earn, build reputation"
- Optional: Add loading animation element
- Keep text readable on mobile screens

### 3. embed.png (1200x630px)
**Purpose:** OG image for social sharing (Twitter, Discord, etc.)
**Specifications:**
- Size: 1200x630 pixels (1.91:1 aspect ratio)
- Format: PNG or JPEG
- Design: Horizontal orientation

**Content to Include:**
- "BaseBounty" title
- "Decentralized Micro-Tasks on Base"
- Key value props: "Post Tasks • Earn ETH • Build Reputation"
- Visual elements: icons, mockup, or illustration
- Base logo (optional)

### 4. hero.png (Recommended: 1200x600px)
**Purpose:** Hero image for landing page
**Specifications:**
- Size: ~1200x600 pixels (flexible)
- Format: PNG or JPEG
- Design: Showcase main features

**Content to Include:**
- App interface mockup
- Key features highlighted
- Vibrant, engaging design
- Clear call-to-action visual

### 5. screenshots/ (3 images, ~1170x2532px each)

Create a `screenshots/` folder and add these 3 images:

#### screenshots/1.png - Bounty List
**Shows:** Main bounties list view
**Include:**
- Multiple bounty cards visible
- Filters/search visible
- Clear UI showing categories, payments, deadlines
- Connected wallet indicator

#### screenshots/2.png - Bounty Detail
**Shows:** Single bounty detail with applications
**Include:**
- Bounty information
- List of applicants (if creator view)
- Application form (if worker view)
- Work submission section
- Action buttons

#### screenshots/3.png - User Profile
**Shows:** User profile with reputation
**Include:**
- Reputation stats (ratings, completed bounties)
- Total earned/spent
- Created and applied bounties tabs
- Rating stars prominently displayed

**Screenshot Tips:**
- Take actual screenshots of the app when it's running
- Or use design mockups from Figma/Sketch
- Ensure UI is clean, no console errors visible
- Use realistic sample data
- Show different states (active, completed bounties)

## Tools to Create Images

### Design Tools
- **Figma** (free, web-based) - Recommended
- **Canva** (free templates)
- **Adobe Photoshop** (professional)
- **GIMP** (free, open-source)
- **Sketch** (Mac only)

### Icon Resources
- [Heroicons](https://heroicons.com/) - Free icons
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Flaticon](https://www.flaticon.com/) - Large icon library

### Color Palette
Use these colors for consistency:
- Primary: #10b981 (emerald-500)
- Dark BG: #111827 (gray-900)
- Card BG: #1f2937 (gray-800)
- Text: #f3f4f6 (gray-100)
- Accent: #34d399 (emerald-400)

## Quick Start with Placeholders

If you want to test without creating images first:

1. Use free placeholder image services:
   - https://placehold.co/512x512/10b981/ffffff?text=BaseBounty
   - https://placehold.co/1080x1920/10b981/ffffff?text=BaseBounty

2. Or use simple solid color images temporarily

3. Replace with real images before production launch

## Checklist

Before deploying:
- [ ] logo.png created (512x512)
- [ ] splash.png created (1080x1920)
- [ ] embed.png created (1200x630)
- [ ] hero.png created
- [ ] screenshots/1.png created
- [ ] screenshots/2.png created
- [ ] screenshots/3.png created
- [ ] All images optimized for web (<500KB each)
- [ ] All images tested in manifest
- [ ] URLs updated in farcaster.json and index.html

## Need Help?

If you need help creating these images:
- Hire a designer on Fiverr ($5-20)
- Use AI image generators (Midjourney, DALL-E)
- Ask in Base or Farcaster communities
- Use Canva templates for quick mockups
