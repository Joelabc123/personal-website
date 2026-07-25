---
version: alpha
name: Porsche
website: "https://www.porsche.com/usa/"
description: >-
  A luxury-automotive marketing surface that pairs a near-pure white canvas
  (#ffffff) with deep black display type and full-bleed model photography over
  cinema-style hero bands. Porsche runs a single custom face — Porsche Next —
  at weight 400 across every text role, from a 94px h1 down to a 12px caption,
  with letter-spacing held at normal across the entire scale. The brand voltage
  is restraint itself; corner radius rests at a generous 32px on every photo
  tile and card (where Ferrari sits at 0px and Bugatti at binary 0/pill), and
  the entire chrome rides a fluid clamp() typescale that breathes between
  desktop and mobile without a media-query ladder.

seo:
  title: "Porsche Design System for React — Porsche Next, 32px radius, fluid clamp scale"
  metaDescription: "Porsche's design system as a DESIGN.md file. Porsche Next at weight 400, 32px radius photo tiles, fluid clamp typescale, 18 components."
  tags:
    - "Automotive"
  highlights:
    - "Single typeface, single weight — Porsche Next at 400 carries h1 (94px) down to caption (12px) with letter-spacing held at normal"
    - "Generous 32px radius photo tiles — where Ferrari runs 0px sharp corners on every card, Porsche softens to a dominant 32px on 10 of 13 captured shapes"
    - "Fluid clamp() typescale — `--p-typescale-5xl` resolves clamp(2.28rem, 5.2vw + 1.24rem, 7.48rem), eliminating breakpoint ladders entirely"
    - "Cinema hero over white body — black 1440x900 hero band sits above an all-white model grid, photography handles the depth"
    - "Indigo Blue focus accent (#1a44ea) — the brand reserves chromatic voltage for `--p-color-focus` and `--p-color-info` only, never for CTAs"
  lastUpdated: "2026-05-13"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Porsche's marketing surface is the inverse of Ferrari's. Where Maranello stages near-black cinema with sharp 0px CTAs and a single Rosso Corsa voltage, Stuttgart runs a near-white canvas (#ffffff) holding deep black display type, softens every photo tile to a generous 32px radius, and lets the photography do the chromatic work — the cars themselves carry the color. The custom face is Porsche Next, declared in CSS as `"Porsche Next", "Arial Narrow", Arial, "Heiti SC", SimHei, sans-serif`. It runs at weight 400 across every text role captured on the page: 94.72px h1, 72.51px h2, 16px body, 12px caption. Letter-spacing stays at `normal` across the whole scale. The single chromatic accent surfaces only inside `--p-color-focus` and `--p-color-info` as Indigo Blue (#1a44ea) — never as a CTA fill.

    This page packages the system into a single DESIGN.md file using the Google Labs open spec. Inside: 18 color tokens grouped into canvas, ink, photo-overlay, and semantic accents; 9 typography tokens running through Porsche Next at weight 400 across a fluid clamp() scale (`--p-typescale-2xs` 0.75rem through `--p-typescale-5xl` clamp(2.28rem, 5.2vw + 1.24rem, 7.48rem)); 6 corner-radius values capped by a dominant 32px on photo tiles; 9 spacing tokens on the brand's fluid clamp() ladder; and 18 components covering top nav, model-photo tile, hero band, locator card, mosaic grid, and the dark-on-photo CTA pattern.

    Feed the file to Claude, Cursor, or GitHub Copilot and the agent writes React surfaces that read as Porsche — Porsche Next at 400, 32px softened photo tiles, fluid type that resizes between viewports, indigo only on focus rings — rather than a generic dark-luxury theme. Reference the `{token.refs}` directly in Tailwind config, or use the spec as an audit lens: most luxury-auto sites copy Stuttgart's white canvas but miss the radius and the held-at-400 typographic discipline that make it work.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.porsche.com/usa/"
      title: "Porsche.com — United States"
      description: "The live brand site for the U.S. market — see the white-canvas model grid, 32px radius photo tiles, and Porsche Next typography in production."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Porsche's primary brand color?"
      answer: "Porsche does not use a signature chromatic voltage the way Ferrari uses Rosso Corsa or Lamborghini uses Arancio. The system is fundamentally monochrome — black (#000000) display type and near-white (#fafbff) canvas inversions, with photography carrying every chromatic moment. The one chromatic token in the extracted palette is Indigo Blue (#1a44ea), bound to `--p-color-focus` and `--p-color-info`, used for keyboard focus rings and info notices rather than CTAs or brand marks. Stuttgart's brand voltage is the photograph of the car, not a hex code."
    - id: "typography"
      title: "What typography does Porsche use, and what should I use if Porsche Next isn't available?"
      answer: "Porsche runs Porsche Next as the single sans family across every text role — h1, h2, h3, body, caption, nav. The CSS declares it as `\"Porsche Next\", \"Arial Narrow\", Arial, \"Heiti SC\", SimHei, sans-serif`, including the CJK fallbacks for the Chinese market. Every captured weight is 400 — display weight does not promote to 500 or 700 the way it does in most luxury-auto systems. Letter-spacing is held at `normal` across the entire scale. Substitutes: Arial Narrow at weight 400 is the documented fallback; Inter at weight 400 with `tracking: 0` is the closest open-source approximation; Söhne is the closer humanist alternative for paid licenses."
    - id: "radius"
      title: "Why does Porsche use such a generous 32px corner radius?"
      answer: "The 32px radius (`--p-radius-4xl`) is the brand's softened-photography signature. Of 13 distinct radius values captured, 32px appears 10 times — on model photo tiles, locator cards, and the cinema mosaic. The radius vocabulary is intentional: 2px (xs), 4px (sm), 6px (md), 8px (lg), 12px (xl), 16px (2xl), 24px (3xl), 32px (4xl), and pill (full). Where Ferrari sits at 0px sharp corners for racing-precision and Bugatti uses a binary 0px-or-pill, Porsche softens to 32px — closer to consumer-tech radius vocabulary than luxury-auto. The framing reads as photo-tile rather than spec-sheet."
    - id: "fluid-typography"
      title: "What is Porsche's fluid clamp() typescale and why does it matter?"
      answer: "Porsche's typescale is declared entirely in CSS `clamp()` rather than fixed pixel ladders. `--p-typescale-5xl` resolves to `clamp(2.28rem, 5.2vw + 1.24rem, 7.48rem)`, `--p-typescale-4xl` to `clamp(2.03rem, 3.58vw + 1.31rem, 5.61rem)`, and so on down to `--p-typescale-xs` at fixed 0.875rem. The effect: display type resizes continuously between 320px and 1440px viewports without a single media-query break. Most marketing sites step type at sm/md/lg/xl breakpoints; Porsche's chrome interpolates, which is why a 94.72px h1 at 1440px-wide gracefully degrades to ~36px on a 375px phone without a separate mobile token."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build a React car-configurator or marketing surface?"
      answer: "Yes — the file is built to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce Porsche's restraint — Porsche Next at 400, 32px radius photo tiles, fluid clamp() typescale, white canvas with full-bleed cinema hero — rather than a generic dark-luxury template. You can also paste the tokens directly into Tailwind config (the `--p-radius-*`, `--p-typescale-*`, and `--p-color-*` custom property names map one-to-one). The 18 components cover most of what a luxury-auto marketing surface needs: top nav, hero band, model photo tile, locator card, find-your-dealer card, info notice, focus ring, and footer."
    - id: "known-gaps"
      title: "What's missing from this DESIGN.md spec?"
      answer: "Several things, documented in the Known Gaps section. The extractor captured 7 base colors on the U.S. landing page — Porsche's full configurator surface (paint pickers, interior swatches, wheel options) holds dozens of color tokens not visible on the marketing surface. Porsche Next is a licensed typeface; Arial Narrow at weight 400 is the documented fallback. The system supports light/dark via the `light-dark()` CSS function in every `--p-color-*` token, but only the light mode is captured on the marketing landing page. Animation easing tokens (`--pcom-motion-easing-base` cubic-bezier(.25,.1,.25,1)) are captured but not exercised. Form validation states beyond focus, the Porsche ID account surface, and the in-product configurator are out of scope."

colors:
  primary: "#010205"
  ink: "#000000"
  ink-soft: "#1a1a1e"
  ink-muted: "#2b2c2f"
  body-on-light: "#000000"
  body-on-dark: "#fafbff"
  on-photo: "#fafbff"
  canvas: "#ffffff"
  canvas-elevated: "#fafbff"
  canvas-soft: "#f1f1f4"
  canvas-dark: "#010205"
  hairline: "#d5d5d5"
  hairline-muted: "#9e9eff"
  focus: "#1a44ea"
  info: "#1a44ea"
  warning: "#ac5102"
  error: "#ba171f"
  success: "#197e10"

typography:
  display-5xl:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 94px
    fontWeight: 400
    lineHeight: 1.19
    letterSpacing: 0
  display-4xl:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: 0
  display-3xl:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  display-2xl:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0
  heading-xl:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: '"Porsche Next", "Arial Narrow", Arial, sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0

rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  4xl: "32px"
  full: "9999px"

spacing:
  2xs: "4px"
  xs: "8px"
  sm: "13px"
  md: "16px"
  base: "30px"
  lg: "48px"
  xl: "63px"
  2xl: "80px"
  3xl: "92px"

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    height: "82px"
    padding: "0px 30px"
  hero-band-cinema:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-photo}"
    typography: "{typography.display-5xl}"
    rounded: "{rounded.none}"
    padding: "0"
  hero-headline:
    backgroundColor: "transparent"
    textColor: "{colors.on-photo}"
    typography: "{typography.display-5xl}"
    padding: "0"
  section-headline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-4xl}"
    padding: "63px 92px 81px"
  model-photo-tile:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.4xl}"
    padding: "0"
  model-photo-tile-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-photo}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.4xl}"
    padding: "0"
  locator-card:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-photo}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.4xl}"
    padding: "30px"
  button-primary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "13px 30px"
    height: "54px"
    border: "0"
  button-secondary-on-photo:
    backgroundColor: "transparent"
    textColor: "{colors.on-photo}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "13px 30px"
    height: "54px"
    border: "1px solid {colors.on-photo}"
  button-tertiary-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "0"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "0 16px"
  cookie-banner:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.4xl}"
    padding: "30px"
  text-input:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "13px 16px"
    height: "54px"
    border: "1px solid {colors.hairline}"
  text-input-focus:
    border: "1px solid {colors.focus}"
  mosaic-tile-photo:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-xl}"
    rounded: "{rounded.4xl}"
    padding: "0"
  badge-pill:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 13px"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-sm}"
    padding: "63px 30px"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    padding: "0"
---

## Overview

Porsche's marketing surface is the inverse of Ferrari's — where Maranello stages near-black cinema with sharp 0px CTA corners and a single Rosso Corsa voltage, Stuttgart runs a near-white canvas (`{colors.canvas}` — #ffffff) holding deep black display type and softens every photo tile to a generous 32px radius. The single chromatic accent (`{colors.focus}` — #1a44ea Indigo Blue) surfaces only on keyboard focus rings and info notices, never as a CTA fill. The cars themselves carry the color.

**Held-at-400**: where most luxury-auto brands lean on weight 500 or 600 for display authority, Porsche holds every captured text role — 94.72px hero h1, 72.51px h2, 16px body, 12px caption — at weight 400 with letter-spacing pinned at `normal`. The discipline reads as engineered restraint. Display headlines do not bold; section labels do not uppercase-track; nav items do not promote weight on hover.

**Radius as restraint**: of 13 distinct corner-radius values captured, 32px (`{rounded.4xl}`) appears 10 times across model tiles, locator cards, the find-your-dealer panel, and the mosaic grid. The full radius vocabulary spans 2px through 32px plus pill — but the dominant value is the softened 32px, closer to consumer-tech surfaces than the racing-precision 0px of Ferrari or the binary 0/pill of Bugatti.

**Key Characteristics:**
- Single typeface: Porsche Next at weight 400 across every captured text role.
- White canvas (`{colors.canvas}` — #ffffff) with full-bleed cinema hero over a dark band (`{colors.canvas-dark}` — #010205).
- Dominant 32px (`{rounded.4xl}`) radius on photo tiles and cards.
- Fluid clamp() typescale — display sizes interpolate between viewports rather than stepping at breakpoints.
- Indigo Blue (`{colors.focus}` — #1a44ea) reserved for focus rings and info, never CTAs.
- Letter-spacing held at `normal` across the entire scale.
- Photography carries every chromatic moment.

## Colors

### Brand & Accent
- **Porsche Black** (`{colors.primary}` — #010205) — frequency 2. Used as bg (2). The brand's deep canvas-dark used for cinema hero band and locator card backgrounds — not pure black, slight blue tilt.
- **Pure Ink** (`{colors.ink}` — #000000) — frequency 621. Used as text (217), border (217), gradient (180), bg (7). The dominant display-text color across white-canvas sections.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff) — frequency 44 (clustered with the #fafbff near-white variant). Used as bg (6), text (19), border (19). The primary page floor under the model grid and footer.
- **Canvas Elevated** (`{colors.canvas-elevated}` — #fafbff) — frequency 44 (same cluster, near-white tilted faintly cool). Used for cookie banners and elevated panels.
- **Canvas Soft** (`{colors.canvas-soft}` — #f1f1f4) — declared in `--p-color-surface` light-dark token. Used as soft photo-tile backdrop before the photograph renders.
- **Canvas Dark** (`{colors.canvas-dark}` — #010205) — frequency 2. Used as bg (2). The cinema-band and locator-card backdrop.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #d5d5d5) — frequency 1. Used as bg (1). 1px divider on light bands and form-input border.
- **Hairline Muted** (`{colors.hairline-muted}` — #9e9eff) — frequency 12. Used as text (6), border (6). A desaturated periwinkle that surfaces on muted text and decorative dividers — closest hex Porsche has to a "secondary" voice.

### Text
- **Ink Soft** (`{colors.ink-soft}` — #1a1a1e) — frequency 2. Used as text (1), border (1). Footer link color, lower-contrast text.
- **Ink Muted** (`{colors.ink-muted}` — #2b2c2f) — frequency 4. Used as text (2), border (2). Tertiary text and disabled states.
- **Body on Dark** (`{colors.body-on-dark}` — #fafbff) — same cluster as canvas-elevated. White text on the cinema hero band.
- **On Photo** (`{colors.on-photo}` — #fafbff) — h1 text color over the dark hero photograph.

### Semantic (from CSS variables)
- **Focus** (`{colors.focus}` — #1a44ea): Indigo Blue, bound to `--p-color-focus`. The only saturated brand voltage — keyboard focus rings only.
- **Info** (`{colors.info}` — #1a44ea): Same Indigo Blue, bound to `--p-color-info`. Info notices, inline anchor cues.
- **Warning** (`{colors.warning}` — #ac5102): Deep amber, bound to `--p-color-warning`. Validation warnings.
- **Error** (`{colors.error}` — #ba171f): Deep red, bound to `--p-color-error`. Form validation errors.
- **Success** (`{colors.success}` — #197e10): Forest green, bound to `--p-color-success`. Confirmation.

## Typography

### Font Family
**Porsche Next** is the licensed single sans family across every text role. The CSS declaration is `"Porsche Next", "Arial Narrow", Arial, "Heiti SC", SimHei, sans-serif` — with Arial Narrow as the documented fallback and CJK families for Chinese-market support. No display/body family split.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-5xl}` | 94px | 400 | 1.19 | 0 | Homepage hero h1 (clamps fluidly) |
| `{typography.display-4xl}` | 72px | 400 | 1.21 | 0 | Section h2 ("Your Porsche journey starts now.") |
| `{typography.display-3xl}` | 48px | 400 | 1.2 | 0 | Sub-section headlines |
| `{typography.display-2xl}` | 36px | 400 | 1.2 | 0 | Card titles, mosaic labels |
| `{typography.heading-xl}` | 24px | 400 | 1.3 | 0 | Model tile names |
| `{typography.body-lg}` | 18px | 400 | 1.5 | 0 | Locator card body |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body, nav, button labels |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer, cookie banner |
| `{typography.caption}` | 12px | 400 | 1.625 | 0 | Photo captions, badges |

### Principles
- **Every weight is 400.** Display does not promote to 500 or 700; emphasis comes from size and case rather than weight.
- **Letter-spacing is `normal` everywhere.** No tracking on display, no uppercase tracking on CTAs or nav. The system rejects the typographic-muscle move that fintech and most luxury-auto brands use.
- **Fluid clamp() between viewports.** `--p-typescale-5xl` resolves `clamp(2.28rem, 5.2vw + 1.24rem, 7.48rem)` — a 94.72px desktop hero gracefully interpolates to ~36px mobile without a single media-query break.

### Note on Font Substitutes
Porsche Next is licensed. Documented fallback: **Arial Narrow** at weight 400. Open-source approximation: **Inter** at weight 400 with `tracking: 0`; **Söhne** for closer humanist proportions on paid licenses.

## Layout

### Spacing System
- **Base unit:** the brand uses a fluid 30px base for major rhythm — `--p-spacing-fluid-md` resolves `clamp(16px, 1.25vw + 12px, 36px)`.
- **Tokens:** `{spacing.2xs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 13px · `{spacing.md}` 16px · `{spacing.base}` 30px · `{spacing.lg}` 48px · `{spacing.xl}` 63px · `{spacing.2xl}` 80px · `{spacing.3xl}` 92px.
- **Section padding:** 63px vertical / 92px horizontal is the dominant band rhythm (captured as `81.2px 0px 62.6px` and `30px 91.76px 0px` in extracted values).

### Grid & Container
- Hero photography goes full-bleed at 1440px.
- Model grid: 2-up at desktop (Cayenne / 718, Taycan / Panamera, Macan / Cayenne stacked pairs).
- Footer: full-width centered.

### Whitespace Philosophy
Generous editorial pacing. The cinema hero owns the top viewport, then the model grid breathes with 30px tile gaps and 32px tile radius. Body sections sit on the white canvas; the locator-card injects a single dark band before the footer.

## Elevation & Depth

The system uses **photographic depth + radius-step** elevation. Drop shadows are declared (`--p-shadow-sm` `0px 3px 8px rgba(0,0,0,.16)`, `--p-shadow-md` `0px 4px 16px rgba(0,0,0,.16)`, `--p-shadow-lg` `0px 8px 40px rgba(0,0,0,.16)`) but the marketing surface relies primarily on the 32px radius cards and full-bleed photography.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#ffffff) | Body bands, footer |
| Tile | `{colors.canvas-soft}` (#f1f1f4) + 32px radius | Model photo tile backdrop |
| Cinema | `{colors.canvas-dark}` (#010205) + photograph | Hero band, locator card |
| Hairline | 1px `{colors.hairline}` (#d5d5d5) | Form input borders, dividers |
| Soft drop | `0px 3px 8px rgba(0,0,0,0.16)` | Captured shadow-sm (rare use) |
| Photographic | Full-bleed model imagery | Hero band, model tiles |

### Decorative Depth
- **Full-bleed model photography** is the brand's primary depth treatment — every model tile is a photograph at 32px radius rather than a flat fill.
- **Frosted blur** (`--p-blur-frosted: blur(32px)`): Used inside cookie banner and modal backdrops over photography.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Hero band edge-to-edge |
| `{rounded.xs}` | 2px | Compact badges |
| `{rounded.sm}` | 4px | Tight inline tags |
| `{rounded.md}` | 6px | Form selects (rare) |
| `{rounded.lg}` | 8px | Form inputs |
| `{rounded.xl}` | 12px | Compact tooltips |
| `{rounded.2xl}` | 16px | Mid-step cards |
| `{rounded.3xl}` | 24px | Larger panels |
| `{rounded.4xl}` | 32px | Dominant — every photo tile, locator card, mosaic |
| `{rounded.full}` | 9999px | CTA buttons, badge pills, avatars |

The radius vocabulary is **softened by default**. 32px (`{rounded.4xl}`) is the dominant value across photo tiles and locator cards — appearing 10 of 13 times in the captured set. Buttons are fully pill (`{rounded.full}`); inputs sit at `{rounded.lg}` (8px). The brand never uses sharp 0px corners outside the full-bleed hero band edge.

## Components

### Top Navigation
**`top-nav`** — White-canvas top nav, 82px tall, padded 0px × 30px. Layout: Porsche wordmark left, primary horizontal menu (Models / Approved Pre-owned / Configurator / Owners / Locator), search + utilities right. Nav links render in body-md (16px / 400) — never uppercase-tracked.

### Hero Bands
**`hero-band-cinema`** — Full-bleed black cinema band. Background `{colors.canvas-dark}` (#010205) holds the model photograph; display h1 in `{typography.display-5xl}` (94px / 400, fluid clamp) renders white over the photo bottom edge. Zero padding — photograph fills edge-to-edge.

**`hero-headline`** — Transparent overlay headline on the cinema photograph. Text `{colors.on-photo}` (#fafbff), typography `{typography.display-5xl}`.

**`section-headline`** — White-canvas section headline below the cinema band. Background transparent, text `{colors.ink}`, typography `{typography.display-4xl}` (72px / 400), padded 63px top, 92px sides, 81px bottom.

### Tiles & Cards
**`model-photo-tile`** — The brand's signature surface. Soft `{colors.canvas-soft}` (#f1f1f4) backdrop holds the model photograph; tile rounded at `{rounded.4xl}` (32px); typography `{typography.heading-xl}` for the model name. Zero padding — photograph fills the rounded frame.

**`model-photo-tile-dark`** — Dark variant for select model tiles (Panamera, Cayenne). Background `{colors.canvas-dark}`, text `{colors.on-photo}`, same 32px radius.

**`locator-card`** — "Find Your Porsche Center" card. Background `{colors.canvas-dark}`, text `{colors.on-photo}`, body in `{typography.body-lg}`, 30px padding, 32px radius. Holds a CTA + map glyph.

**`mosaic-tile-photo`** — Editorial mosaic-grid tile. Background `{colors.canvas-soft}`, same 32px radius, typography `{typography.heading-xl}`.

### Buttons
**`button-primary`** — White-fill pill on dark bands. Background `{colors.canvas}` (#ffffff), text `{colors.ink}`, typography `{typography.body-md}` (16px / 400 / no tracking), padding 13px × 30px, height 54px, **rounded `{rounded.full}` (pill)**. Where Ferrari's button is a sharp 0px Rosso Corsa rectangle, Porsche's is a fully pilled white slug.

**`button-secondary-on-photo`** — Transparent pill with 1px white outline over photograph. Background transparent, text `{colors.on-photo}`, 1px white border, pill radius.

**`button-tertiary-text`** — Inline text link. Background transparent, text `{colors.ink}`, body-md typography.

### Forms
**`text-input`** — Background `{colors.canvas-elevated}` (#fafbff), text `{colors.ink}`, body-md typography, rounded `{rounded.lg}` (8px), padding 13px × 16px, height 54px, 1px `{colors.hairline}` border.

**`text-input-focus`** — Focus state. 1px `{colors.focus}` (#1a44ea Indigo Blue) border — the only place chromatic voltage surfaces in the form chrome.

### Misc
**`cookie-banner`** — Soft elevated banner. Background `{colors.canvas-elevated}`, text `{colors.ink}`, body-sm typography, 30px padding, 32px radius.

**`badge-pill`** — Small caption pill. Background `{colors.canvas-soft}`, text `{colors.ink}`, caption typography (12px / 400), pill radius, 4px × 13px padding.

**`nav-link`** — Background transparent, text `{colors.ink}`, body-md typography, padded 0 × 16px horizontal.

### Footer
**`footer`** — Closing white footer. Background `{colors.canvas}`, text `{colors.ink-soft}` (#1a1a1e), body-sm typography, 63px × 30px padding. Multi-column link list.

**`footer-link`** — Background transparent, text `{colors.ink-muted}` (#2b2c2f), body-sm typography.

## Do's and Don'ts

### Do
- Hold every text role at weight 400. The brand never promotes display to 500 or 700.
- Pin letter-spacing at `normal` across the full scale, including buttons and nav.
- Round every photo tile and card to `{rounded.4xl}` (32px) — the brand signature.
- Render CTA buttons as fully-pilled `{rounded.full}` rectangles, never as sharp 0px.
- Use the fluid clamp() typescale — `--p-typescale-5xl` interpolates 94px down to 36px without media queries.
- Reserve `{colors.focus}` (#1a44ea Indigo Blue) for focus rings and info notices only.

### Don't
- Don't fill the primary CTA with `{colors.focus}` (#1a44ea). It's a focus-ring token, not a brand voltage — Indigo Blue appears on `--p-color-focus` and `--p-color-info` only, never on `button-primary`. For primary CTAs, use white-on-photo or black-on-light.
- Don't add uppercase tracking to nav links or CTAs the way Ferrari and Bugatti do. Porsche's CTA renders in body-md (16px / 400 / no tracking) — uppercase-tracked labels break the held-at-400 discipline.
- Don't use sharp 0px corners on photo tiles. The brand's tile radius is 32px (`{rounded.4xl}`); dropping to 0px reads as Ferrari, not Porsche.
- Don't promote any display token to weight 500 or 700. Emphasis comes from size and case — the 94px h1 and the 12px caption both render at 400.
- Don't paint `{colors.hairline-muted}` (#9e9eff) as a background fill. It's a 12-occurrence border + muted-text token; using it as a bg surface reads as a chip rather than a divider.
- Don't ladder type at media-query breakpoints. The clamp() typescale handles 320px-to-1440px interpolation natively; stepping at sm/md/lg/xl undoes the fluid signature.
- Don't extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand's CTA color is what appears on actual product CTAs.

## Known Gaps

- The extractor captured 7 base colors on the U.S. landing page; the configurator surface (paint pickers, interior swatches, wheel options) holds dozens of model-specific tokens not visible on the marketing landing page.
- Porsche Next is a licensed typeface; Arial Narrow at weight 400 is the documented fallback declared in the CSS font-stack.
- The full `--p-color-*` token system supports light/dark via the CSS `light-dark()` function on every color token; only light mode was captured on the U.S. landing page.
- Animation easing tokens (`--pcom-motion-easing-base` cubic-bezier(.25,.1,.25,1), `--pcom-motion-duration-moderate` .4s) are captured but not exercised on the marketing page.
- Form validation states beyond focus, the Porsche ID account surface, and the in-product configurator are out of scope.
- Drop shadow tokens (`--p-shadow-sm`, `--p-shadow-md`, `--p-shadow-lg`) are declared at root but rarely surface on the captured marketing page — radius and photography carry the depth.
