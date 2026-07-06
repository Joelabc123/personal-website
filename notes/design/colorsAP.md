---
version: alpha
name: "Audemars Piguet"
website: "https://www.audemarspiguet.com"
description: >-
  A Swiss haute-horlogerie maison founded in 1875 whose marketing site pairs
  Helvetica Neue Web at ultra-thin weight 100 with Times Now italic at weight 250
  — two voices in counterpoint, one mechanical and precise, one editorial and
  unhurried. The canvas is a near-white warm off-white (merged from pure white and
  a light beige of roughly 96% brightness), carrying full-bleed cinematic
  photography of watch movements, enamel dials, and the Vallée de Joux landscape.
  A declared deep forest green (wired as --color-brand-color) and a muted sage
  (wired as --color-brand-green) are held so deeply in reserve that neither
  appears in the captured marketing render — the visual identity reads as a
  strict two-tone of white and black with photography doing every other
  chromatic job.

seo:
  title: "Audemars Piguet Design System for React — dual-typeface, near-white canvas, 14 components"
  metaDescription: "Audemars Piguet's design system as a DESIGN.md file. Helvetica Neue Web weight 100 paired with Times Now italic weight 250, near-white canvas, 17 color tokens, 14 components. For React, Next.js, and AI tools."
  highlights:
    - "Dual-typeface counterpoint — Helvetica Neue Web in ultra-thin weight 100 for sans display, Times Now in weight 250 italic for serif editorial; no other weights above 500"
    - "Near-white warm canvas — the page floor merges pure white and light beige into a single off-white floor; the system never uses a blue-white or neutral gray canvas"
    - "Declared brand green absent from marketing render — --color-brand-color (deep forest) and --color-brand-green are in CSS but produce zero rendered occurrences; photography carries all color"
    - "Uppercase all-caps sans at 56px weight 100 — the system's loudest typographic moment uses negative letter-spacing (-0.56px) at ultra-thin weight, not heavyweight"
    - "Full-bleed photography between typographic bands — every editorial section transitions through a cinematic photograph before the next text zone"
  tags:
    - "E-commerce & Retail"
  lastUpdated: "2026-05-19"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Audemars Piguet's marketing site runs a dual-typeface system that is nearly unique in the luxury-goods sector: Helvetica Neue Web in ultra-thin weight 100 handles every headline and interface label, while Times Now italic in weight 250 holds every editorial subheading and pull-quote. The two voices do not compete — the sans is uppercase, tracked, mechanical; the serif is lowercase, italic, unhurried. The hero h1 reads "The Infinite Craft of the Établisseurs" in white Helvetica Neue Web at 56px / 100 / uppercase; on the next editorial beat the same text might appear in Times Now at 60px / 250 / italic over a photograph of a workshop scene. The tension between those two surfaces is the brand's typographic signature. Where Cartier commits to all-caps sans throughout and Ferrari commits to a single FerrariSans, AP splits the page between machine and manuscript.

    This DESIGN.md file packages the system into 17 color tokens — primarily white, off-white, pure black, and mid-grays, plus a declared-but-invisible brand green wired as --color-brand-color; 14 typography tokens covering Helvetica Neue Web at weights 100 through 500 and Times Now italic at 250; 5 corner-radius values from the extracted CSS variables (none to 56px pill); 8 spacing tokens on an approximate 8px base; and 14 component definitions covering the hero heading, section headings, navigation, body copy, CTA buttons, and card surfaces. The absence of a rendered brand accent color is documented and intentional.

    Feed this file to Claude or Cursor and it will reproduce AP's counterpoint system: ultra-thin sans uppercase display, lightweight italic serif editorial, off-white warm canvas, zero decorative chrome. The most consequential discipline to preserve is the typeface split — when in doubt, use the sans for anything interface-level and the serif for anything editorial. Breaking that rule collapses the tension the system depends on.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.audemarspiguet.com"
      title: "Audemars Piguet — official site"
      description: "Audemars Piguet's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Audemars Piguet's primary brand color?"
      answer: "Audemars Piguet's extracted CSS declares a deep forest green (#02291f) wired as --color-brand-color and a muted sage (#456148) wired as --color-brand-green, but neither produces a rendered occurrence on the captured marketing surface. The page read as strictly two-tone: near-white (#ffffff / #f6f5f3 merged) and pure black (#000000), with full-bleed photography providing all chromatic expression. This is the same discipline Patagonia uses — a declared brand color that lives inside the product and campaign context but cedes the marketing surface entirely to imagery. The practical implication: if you are building an AP-inspired React surface, reach for the photography container before reaching for the brand green."
    - id: "typefaces"
      title: "What typefaces does Audemars Piguet use, and what are the open-source substitutes?"
      answer: "The system runs two proprietary or licensed families. Helvetica Neue Web handles all sans surfaces: ultra-thin weight 100 for hero and section display, weight 300 for body and label copy, weight 500 for button labels and strong captions. Times Now is the serif editorial voice: weight 250 italic at 60–93px for the biggest editorial moments, with smaller italic instances at 28–52px for sub-headers and pull-quotes. Open-source substitutes: for Helvetica Neue Web at weight 100–300, Neue Haas Grotesk or Inter at weights 200–300 are the closest matches. For Times Now italic at weight 250, Georgia italic or Playfair Display italic read comparably for body editorial use, though Playfair is slightly more expressive."
    - id: "canvas-color"
      title: "Why does Audemars Piguet use an off-white rather than pure white canvas?"
      answer: "The captured extraction merges two near-identical values — pure white (#ffffff) and a warm light beige (#f6f5f3, wired as --color-light-beige and --color-palette-beige96) — into a single canvas token. The beige fraction reads as a parchment warmth that softens the contrast between the canvas and the full-bleed cinematic photographs. On a pure white floor, product photography with warm amber or warm-neutral backgrounds would clash with the canvas edge; the beige undertone absorbs that transition. The same move appears at Aesop, which uses a warm sand canvas to set its photographic materials off without a visible seam."
    - id: "typography-weights"
      title: "Why does Audemars Piguet use such light font weights — 100 and 250 — for its largest display text?"
      answer: "The ultra-thin weight is the brand's authority signal: where most luxury-adjacent brands use weight 700 at large sizes to command attention, AP holds display at weight 100 and trusts the photography and the watch mechanism to do the visual labor. The 56px / weight 100 uppercase Helvetica Neue Web headline at negative letter-spacing (-0.56px) reads as precision engineering, not as a shout. Times Now at weight 250 italic extends the same logic into the serif editorial voice — barely there, yet legible. The discipline is consistent: the maximum weight on the page is 500, used only for small button labels and micro-captions."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build a luxury-watch product page in React?"
      answer: "Yes — the file is designed to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce AP's specific moves: Helvetica Neue Web weight 100 display uppercase, Times Now italic editorial subheads, off-white warm canvas, zero decorative chrome beyond the photography containers. The 14 component definitions cover the hero heading, section h2, editorial pull-quote, nav, body copy, CTA, and card surface. The one caveat: both Helvetica Neue Web and Times Now are licensed typefaces not available on Google Fonts. Reference the typography substitution note in the Typography section for open-source alternatives."

mockups:
  - "marketing-hero"
  - "media-grid"

colors:
  ink: "#000000"
  ink-soft: "#1b1b1b"
  ink-muted: "#8b8c8c"
  ink-faint: "#757575"
  canvas: "#ffffff"
  surface-1: "#f6f5f3"
  surface-2: "#e7e4df"
  hairline: "#bfbfbf"
  hairline-mid: "#8b8c8c"
  mid-gray: "#656565"
  mid-gray-2: "#818181"
  brand-forest: "#02291f"
  brand-green: "#456148"
  brand-teal: "#2b4f4f"
  accent-mint: "#45de93"
  gold-warm: "#c9b586"
  error: "#b02828"

typography:
  display-xl:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 93px
    fontWeight: 100
    lineHeight: 77.19px
    letterSpacing: 0
  display-lg:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 56px
    fontWeight: 100
    lineHeight: 56px
    letterSpacing: "-0.56px"
  display-serif-xl:
    fontFamily: "\"Times Now\", serif"
    fontSize: 60px
    fontWeight: 250
    lineHeight: 49.8px
    letterSpacing: "-1.2px"
  display-serif-lg:
    fontFamily: "\"Times Now\", serif"
    fontSize: 36px
    fontWeight: 250
    lineHeight: 48px
    letterSpacing: 0
  heading-lg:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 56px
    fontWeight: 100
    lineHeight: 64px
    letterSpacing: 0
  heading-md:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 40px
    fontWeight: 200
    lineHeight: 48px
    letterSpacing: 0
  heading-sm:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 30px
    fontWeight: 100
    lineHeight: 40px
    letterSpacing: 0
  body-lg:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 17px
    fontWeight: 300
    lineHeight: 22.95px
    letterSpacing: "0.26px"
  body-md:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 24px
    letterSpacing: "0.21px"
  body-sm:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 14px
    fontWeight: 300
    lineHeight: 20px
    letterSpacing: "0.21px"
  label-md:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: "0.21px"
  label-sm:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: "1.8px"
  button-md:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: "0.21px"
  nav-link:
    fontFamily: "\"Helvetica Neue Web\", sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20.86px
    letterSpacing: "0.21px"

rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "56px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "16px"
  md: "24px"
  base: "32px"
  lg: "64px"
  xl: "80px"
  2xl: "120px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    height: "48px"
    border: "0"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    height: "48px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.none}"
    padding: "16px 32px"
    height: "48px"
    borderColor: "{colors.ink}"
  top-nav:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "64px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.nav-link}"
    padding: "8px 8px"
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.display-lg}"
    padding: "0"
  hero-serif:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.display-serif-xl}"
    padding: "0"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "0"
  editorial-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-serif-lg}"
    padding: "0"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.body-lg}"
    padding: "0"
  body-paragraph-on-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "0"
  label-overline:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.label-sm}"
    padding: "0"
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "24px"
  text-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: "8px 0"
    height: "44px"
    borderColor: "{colors.ink}"
---

## Overview

Audemars Piguet's marketing site refuses the conventions of luxury-goods typography. **Counterpoint system:** where Cartier commits to all-caps proprietary sans at a single weight and Ferrari commits to FerrariSans, AP divides the page between two voices — Helvetica Neue Web in ultra-thin weight 100 for every interface headline, and Times Now in weight 250 italic for every editorial subhead and pull-quote. The sans is uppercase, tracked slightly negative at -0.56px, mechanically precise; the serif is lowercase, oblique, unhurried. The counterpoint reads as the two faces of Swiss watchmaking: the movement's technical geometry on one side, the horological tradition on the other. Unlike Rolex, which leans entirely on a gold-and-green brand palette to signal status, AP holds all color in reserve and trusts the tension between typefaces and photography to carry the weight.

The system is architecturally monochrome. The brand's declared green tokens (deep forest `{colors.brand-forest}` at --color-brand-color, muted sage `{colors.brand-green}` at --color-brand-green) produce zero rendered occurrences in the captured marketing surface. The page reads as white-on-black and black-on-white — near-white warm canvas `{colors.canvas}` / `{colors.surface-1}` alternating with full-bleed cinematic photography. The brand color exists but the marketing surface never uses it.

**Key Characteristics:**
- Dual-typeface counterpoint: Helvetica Neue Web (mechanical, sans, uppercase) vs. Times Now (editorial, serif, italic) — the contrast is the system's identity.
- Ultra-thin display: weight 100 at 56px for the sans headline tier is the loudest typographic moment; maximum weight across the page is 500.
- Near-white warm canvas: `{colors.surface-1}` (#f6f5f3) and `{colors.canvas}` (#ffffff) merge into a single warm off-white floor; the beige undertone softens photography edges.
- Declared brand green absent from marketing surface — all chromatic expression deferred entirely to photography.
- Negative letter-spacing at display sizes (-0.56px at 56px) gives the thin uppercase sans a precision-machined feel rather than a fashionable-thin feel.
- Full-bleed photography alternates with tight editorial text zones; no decorative elements, no ornamental chrome.
- Uppercase letter-spacing labels in weight 500 at 1.8px spacing mark section categories and product families.

## Colors

### Canvas

- **Canvas** (`{colors.canvas}` — #ffffff): frequency 1425 merged — the dominant surface across the page. Used as text color (714), border/hairline (710), and occasionally as background fill (1). The white-on-dark photography sections invert this to text-on-canvas. Also merged with a warm beige variant (#f6f5f3) into the same perceptual token.
- **Surface-1** (`{colors.surface-1}` — #f6f5f3): the warm light beige, wired as --color-light-beige and --color-palette-beige96. The off-white floor tone that runs beneath editorial text zones and product cards. Not pure white; the warmth absorbs the transition from photography to text bands.
- **Surface-2** (`{colors.surface-2}` — #e7e4df): a slightly deeper warm tone wired as --color-palette-beige89 and --color-reference-contrast-neutral6. Used sparingly for divider bands and subtle surface lifts.

### Ink

- **Ink** (`{colors.ink}` — #000000): frequency 39. Pure black — used as text (15), border (15), and background fill (9). The dominant text on white bands and the fill for primary CTA buttons.
- **Ink-Soft** (`{colors.ink-soft}` — #1b1b1b): wired as --color-palette-grey11. Very near-black structural tone.
- **Ink-Muted** (`{colors.ink-muted}` — #8b8c8c): frequency 4 — used as text (2) and border (2). Mid-gray for captions and secondary navigation labels. Wired as --color-gunsmoke and --color-reference-normal-neutral3.
- **Ink-Faint** (`{colors.ink-faint}` — #757575): wired as --color-boulder / --color-grey-3-ui. A slightly lighter caption gray.

### Hairlines

- **Hairline** (`{colors.hairline}` — #bfbfbf): wired as --color-palette-grey75. The light gray divider tone between sections.
- **Mid-Gray** (`{colors.mid-gray}` — #656565): wired as --color-grey-5-ui.
- **Mid-Gray-2** (`{colors.mid-gray-2}` — #818181): wired as --color-grey-2-ui.

### Brand (declared, absent from marketing surface)

- **Brand-Forest** (`{colors.brand-forest}` — #02291f): wired as --color-brand-color. A very dark, almost black forest green. Total rendered occurrences on the captured page: 0. Reserved for product or campaign contexts not exposed on the marketing homepage.
- **Brand-Green** (`{colors.brand-green}` — #456148): wired as --color-brand-green. A muted sage green. Total rendered occurrences: 0. The same absence-of-brand-color discipline documented in Patagonia's system.
- **Brand-Teal** (`{colors.brand-teal}` — #2b4f4f): wired as --color-reference-normal-accent and --color-palette-green24. A dark teal, also invisible on the marketing surface. Declared as the accent token in the CSS custom-property schema.
- **Accent-Mint** (`{colors.accent-mint}` — #45de93): wired as --color-palette-green57. A bright mint declared in the palette but not visible on marketing surfaces.
- **Gold-Warm** (`{colors.gold-warm}` — #c9b586): wired as --color-white-gold. A warm champagne gold, likely used on product pages for gold-case watch references.
- **Error** (`{colors.error}` — #b02828): wired as --color-palette-red42 / --color-reference-normal-error. Reserved for form validation states.

## Typography

### Font Families

The system runs two voices. **Helvetica Neue Web** handles every interface surface — display, heading, body, button, label, and navigation. It runs at weights 100 (ultra-thin display), 300 (body and labels), and 500 (button labels and strong captions); there is no 400 weight used on the captured page and no 700. **Times Now** is the serif editorial voice — appearing at weight 250 italic at 60–93px for the largest editorial moments and at intermediate italic instances for pull-quotes and section titles. The two families do not share a register.

### Hierarchy

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | Helvetica Neue Web | 93px | 100 | 77.19px | 0 | Maximum editorial moment |
| `{typography.display-lg}` | Helvetica Neue Web | 56px | 100 | 56px | -0.56px | Hero h1, section h2 |
| `{typography.display-serif-xl}` | Times Now | 60px | 250 | 49.8px | -1.2px | Italic editorial headline, photo caption |
| `{typography.display-serif-lg}` | Times Now | 36px | 250 | 48px | 0 | Section editorial sub-heading |
| `{typography.heading-lg}` | Helvetica Neue Web | 56px | 100 | 64px | 0 | Alternate section heading |
| `{typography.heading-md}` | Helvetica Neue Web | 40px | 200 | 48px | 0 | Mid-tier heading |
| `{typography.heading-sm}` | Helvetica Neue Web | 30px | 100 | 40px | 0 | Smaller section head |
| `{typography.body-lg}` | Helvetica Neue Web | 17px | 300 | 22.95px | 0.26px | Hero body paragraph |
| `{typography.body-md}` | Helvetica Neue Web | 16px | 300 | 24px | 0.21px | Default running text |
| `{typography.body-sm}` | Helvetica Neue Web | 14px | 300 | 20px | 0.21px | Secondary body, links |
| `{typography.label-md}` | Helvetica Neue Web | 14px | 500 | 24px | 0.21px | h4 / strong labels |
| `{typography.label-sm}` | Helvetica Neue Web | 12px | 500 | 16px | 1.8px | Uppercase overline categories |
| `{typography.button-md}` | Helvetica Neue Web | 14px | 500 | 18px | 0.21px | Button label |
| `{typography.nav-link}` | Helvetica Neue Web | 14px | 500 | 20.86px | 0.21px | Top-nav links |

### Principles

Display weight tops out at 100 for the sans family — the opposite of conventional luxury-goods hierarchy where weight = authority. The system trusts typeface contrast and photography over typographic force. The Times Now tier tops out at weight 250 italic, maintaining the same restraint. Uppercase letter-spacing labels (`{typography.label-sm}`) at 12px / 500 / 1.8px spacing are the only instance where tracking is used for emphasis rather than for display-size compensation.

### Font Substitutes

Helvetica Neue Web is licensed. At weight 100–300, Neue Haas Grotesk Display (Google Fonts: Neue Haas Grotesk) or Inter at weights 200–300 with reduced letter-spacing is the closest open-source match. Times Now at weight 250 italic is best approximated by Playfair Display italic (weight 300) or DM Serif Display italic. Neither substitute is exact at large display sizes, but both preserve the voice split.

## Layout

### Spacing System

- **Base unit:** 8px with 16px as the dominant padding module (47 occurrences).
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 16px · `{spacing.md}` 24px · `{spacing.base}` 32px · `{spacing.lg}` 64px · `{spacing.xl}` 80px · `{spacing.2xl}` 120px.
- **Section padding (vertical):** the CSS exposes explicit spacing tokens up to 256px (`--spacing-4xl`); the marketing surface uses approximately 100px vertical on major section transitions.
- **Photography containers:** full-bleed with 0px padding; text zones beneath sit at ~92.5px horizontal padding.

### Grid & Container

- **Max content width:** text zones sit inside an approximately 412px column in the captured desktop render, centered on the 1440px viewport — a deliberately narrow single-column editorial layout for the text portions.
- **Photography:** full-bleed with no container constraint.
- **Two-column split panels:** appear below the fold where a product photograph sits beside an editorial text block, typically in a 60/40 or 50/50 split.

### Rhythm

The page alternates between full-bleed photography and tight typographic editorial zones — there is no mid-density state. Text zones are narrow and generous with vertical spacing; photography containers are edge-to-edge. The rhythm is magazine-paced: a long breath of image, then a short focused text beat.

## Elevation

The system has essentially **no shadow tier**. The CSS declares `--shadow-primary` (0 5px 15px 0 rgba(0,0,0,0.06)) and `--shadow-secondary` (0 2px 4px 0 rgba(0,0,0,0.19)) as tokens, but neither appears on the captured marketing surface. Depth comes entirely from surface-color layering — `{colors.surface-1}` cards against the `{colors.canvas}` floor — and from the physical depth of full-bleed photography above text zones. There is no elevation hierarchy in the component set.

## Shapes

The radius scale is **sharp-dominant plus pill**:

- `{rounded.none}` 0px — the dominant treatment for CTAs, section dividers, and all editorial surfaces. The CSS declares `--radius-none: 0px`.
- `{rounded.xs}` 4px — `--radius-2xs`; the smallest soft option, used for micro-chips.
- `{rounded.sm}` 8px — `--radius-xs`; form inputs and small UI surfaces.
- `{rounded.md}` 12px — `--radius-sm`; the step just below card rounding.
- `{rounded.lg}` 16px — `--radius-md`; the default card radius.
- `{rounded.xl}` 24px — `--radius-lg`; larger surface tiles.
- `{rounded.pill}` 56px — `--radius-2xl`; pill-style promotional containers.

The dominant treatment on CTAs and typography containers is 0px — sharp and without ornament. The soft radius tiers exist primarily for product surface cards and photography wrappers. Unlike Ferrari, which uses 0px exclusively on CTAs, AP offers a full ladder but defaults to sharp on the interface layer.

## Components

**`button-primary`** — Pure black `{colors.ink}` fill, white `{colors.canvas}` text, `{rounded.none}` 0px radius, 16×32px padding, 48px height. The CTA reads as a precise mechanical stamp — no radius, no shadow, no decoration.

**`button-primary-hover`** — Near-black `{colors.ink-soft}` fill on hover, same dimensions. The press-state is a lightness shift, not a color shift.

**`button-secondary`** — Transparent fill with a 1px ink border, ink text. Same sharp 0px radius. Used for secondary actions alongside hero CTAs.

**`top-nav`** — Transparent background over the hero photograph, white `{colors.canvas}` text, 64px height. Houses the AP logo (center or flush left), category navigation links, and right-aligned actions.

**`nav-link`** — Transparent, white text at `{typography.nav-link}` (14px / 500), 8px padding. The nav links at 14px / 500 are the same size as the button label — the system makes no visual distinction between navigation and action at the label level.

**`hero-heading`** — White text, Helvetica Neue Web at `{typography.display-lg}` (56px / 100 / uppercase / -0.56px), transparent background. The mechanical voice at its loudest.

**`hero-serif`** — White text, Times Now italic at `{typography.display-serif-xl}` (60px / 250), transparent background. The editorial voice at its loudest — these two headings alternate across section transitions.

**`section-heading`** — Ink text, same `{typography.display-lg}` token, for white-canvas sections below the fold.

**`editorial-heading`** — Ink serif italic at `{typography.display-serif-lg}` (36px / 250). The smaller editorial serif moment.

**`body-paragraph`** — White Helvetica Neue Web at `{typography.body-lg}` (17px / 300 / 0.26px tracking), for photography overlay text zones.

**`body-paragraph-on-light`** — Ink text, `{typography.body-md}` (16px / 300), for white-canvas editorial sections.

**`label-overline`** — White uppercase `{typography.label-sm}` (12px / 500 / 1.8px tracking). Used to mark product categories ("ROYAL OAK CONCEPT", "CODE 11.59") above section headings.

**`card`** — Off-white `{colors.surface-1}` fill, ink text, `{rounded.none}` 0px radius, 24px internal padding. Holds product specification breakdowns and editorial summaries.

**`text-input`** — Transparent background, ink text, 0px radius, 1px bottom ink border only (no surrounding border). The underline-only input form on the newsletter section.

## Do's and Don'ts

**Do** use Helvetica Neue Web weight 100 (ultra-thin) for all headline text, not weight 300 or 400. The ultra-thin is the brand's typographic identity marker — switching to a medium-weight sans turns the display into a generic SaaS headline.

**Do** use Times Now italic (weight 250) exclusively for editorial subheadings and pull-quotes — never for interface labels. The voice split is the system. Mixing the italic serif into navigation or button labels collapses the counterpoint.

**Do** let full-bleed photography provide all chromatic expression. The declared brand green (`{colors.brand-forest}`) is invisible on the marketing surface by design; adding a green UI accent on an AP-inspired interface would read as a misuse of the system's discipline.

**Do** use `{rounded.none}` 0px on all CTAs and section containers. The sharp edge is the mechanical identity of the system.

**Don't** use `{colors.gold-warm}` (#c9b586, --color-white-gold) as a general accent or hover fill. It is reserved for gold-case product page contexts where the watch case material is being referenced. Using it in nav or body chrome reads as gilding — the opposite of AP's discipline.

**Don't** render display headlines at weight 300 or above in Helvetica Neue Web. The system's authority resides in the ultra-thin weight 100 — a move that inverts the category default where luxury brands reach for weight 700 to command attention. Weight 300 at 56px is merely thin; weight 100 at 56px reads as a precision instrument. The difference is audible.

**Don't** use `{colors.accent-mint}` (#45de93) or `{colors.brand-teal}` (#2b4f4f) in marketing chrome. These are declared in the CSS custom-property schema but are absent from the rendered surface; they belong to product or sub-brand contexts.

**Don't** use `{typography.label-sm}` (12px / 500 / 1.8px uppercase spacing) for body text or button labels — it is a category overline only. Using it at paragraph size produces the over-tracked "luxury fashion" parody look the system carefully avoids at large text sizes.

## Known Gaps

- **Brand green in context:** the declared `{colors.brand-forest}` (#02291f, --color-brand-color) and `{colors.brand-green}` (#456148, --color-brand-green) do not appear on the captured homepage; they likely appear on collection pages, About pages, or campaign microsites not captured here.
- **Dark mode:** the page shows only a light-canvas system with white-text overlays on photography. No explicit dark-mode tokens are declared.
- **Hover and focus states:** captured only for `{component.button-primary-hover}`; the full matrix (focus rings, input active, hover backgrounds) was not visible on the captured surface.
- **Product configurator surfaces:** the watch configurator (strap / case / dial selection) carries a richer token set that is not represented here.
- **Animation and parallax:** the hero photography sections animate on scroll (parallax depth), but this spec captures end-state values only. Easing curves and parallax depth are not documented.
- **Localization typefaces:** the CSS declares fallback families for Chinese (Noto Sans SC), Japanese (Noto Sans JP), Korean (Noto Sans KR), Russian (MyriadPro / Cormorant Garamond), and Arabic (Tajawal) — none are represented in these tokens.
- **Times Now usage at 93px:** the CSS token `--font-secondary-display-xl` specifies 9.3rem/0.83 at weight 250 italic — this is the maximum display-serif moment but was not verified as rendered in the captured page.
