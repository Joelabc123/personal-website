# Bugfix & Changes Plan — Personal Website (Joel Bakirel)

> Companion to [implementation-plan.md](./implementation-plan.md) and [requirements.md](./requirements.md).
> Second-stage plan covering reported bugs and requested changes: CV icons, three bug fixes, and a
> full dark blue-black redesign with a vertical-bar background, subtle scroll-lightening, and reworked
> animations. Built on Next.js 16.2.10 (App Router), React 19, Tailwind v4, `next-intl`, Framer Motion.
> Phases are independently verifiable and completed in order.

## Design decisions (from requirements interview)

- **Theme:** full dark theme site-wide. Base background blue-black `#060B18`, foreground off-white
  `#E6EDF5`, muted blue-gray `#8CA0B3`, accent sky blue `#38BDF8`. Monochrome tokens fully replaced.
- **Background:** CSS gradients + inline SVG **vertical bars** (prominent), bottom-right sky glow
  (Design 1), faint top-left counter glow, slow horizontal shimmer, and a **scroll-driven subtle
  lightening** that keeps the base pattern visible. Reference: "Hintergrund Design" base + Design2 depth.
- **Motion:** blur-in scroll reveal (replays both directions), subtle background parallax + shimmer,
  dark/accent preloader. All translational motion respects `prefers-reduced-motion`.
- **Buttons:** translucent glass with accent hover glow. **Links:** accent-underline hover.
- **Legal pages:** kept simple but inherit the dark theme.

---

## Phase 1 — Bug fixes ✅

**Goal:** fix the three reported bugs.

1. **Progress bar** ([components/ScrollProgress.tsx](../../components/ScrollProgress.tsx)) — replaced the
   per-section segment stack (which never filled at the bottom) with a **single continuous bar** driven
   by the overall scroll fraction, so it reaches 100% at the very bottom. Removed the `2026` year label;
   replaced it with a small accent dot that travels along the line.
2. **CV year alignment** ([sections/Journey.tsx](../../sections/Journey.tsx)) — moved the date range into a
   **dedicated, fixed-width, right-aligned column** (`EntryCard`), so all years are flush right instead of
   sitting directly after the text. Stays right-aligned on mobile.
3. **Contact text** ([sections/Contact.tsx](../../sections/Contact.tsx)) — removed the direct-email line
   ("…schreib mir direkt eine E-Mail an…") entirely, along with the `contact.directContact` key in
   [messages/de.json](../../messages/de.json) and [messages/en.json](../../messages/en.json).

**Verify:** progress fills to 100% at the bottom, no `2026`; years flush right on desktop + mobile;
contact line gone in both locales. Lint + build pass.

---

## Phase 2 — CV icons ✅

**Goal:** real logos for orgs, fitting generic icons elsewhere.

4. Copied `notes/icons/*` → `public/icons/` (`tum.png`, `uni-mannheim.webp`, `speira.jpg`).
5. Added the `lucide-react` dependency.
6. Extended [lib/cv.ts](../../lib/cv.ts) with optional `logo` (image path) and `icon` (`LucideIcon`) fields:
   - **Speira** → `speira.jpg`, **TU München** → `tum.png`, **Universität Mannheim** → `uni-mannheim.webp`.
   - **Gymnasium** → `GraduationCap`.
   - **Projects** → `Building2`, `LineChart`, `GitBranch`, `Gamepad2`, `Dices`.
7. [sections/Journey.tsx](../../sections/Journey.tsx) `IconTile` helper renders a **64px rounded white tile**
   with a `next/image` logo (original colors) or an accent-tinted lucide icon.

**Verify:** correct logos on the right entries; generic icons render for gymnasium + projects.

---

## Phase 3 — Design system foundation ✅

**Goal:** blue token system + layered animated background.

8. [app/globals.css](../../app/globals.css) — replaced tokens with the blue system (`--color-background`
   `#060B18`, `--color-primary` `#E6EDF5`, `--color-secondary` `#8CA0B3`, `--color-tertiary` `#16233B`,
   `--color-accent` `#38BDF8`); added the `bgshimmer` keyframe (disabled under reduced motion).
9. New [components/Background.tsx](../../components/Background.tsx) — fixed layered background: base gradient,
   prominent vertical bars, finer secondary bars, shimmer band, bottom-right + top-left glows, and a
   scroll-driven lightening overlay (Framer Motion `useScroll`/`useTransform`, `useReducedMotion`-aware).
   Mounted behind content in [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx).
10. Migrated surface/border usage across components to dark glass tokens.

---

## Phase 4 — Section restyle & animations ✅

**Goal:** apply the dark blue look and rework motion.

11. [components/Reveal.tsx](../../components/Reveal.tsx) — added **blur-in** to the fade-up (kept both-direction
    replay); plain opacity fade under `prefers-reduced-motion`.
12. [sections/Hero.tsx](../../sections/Hero.tsx) — heading glow, **glowing glass monogram card** (Design 2),
    accent scroll-down arrow.
13. [sections/About.tsx](../../sections/About.tsx) — glass stat card + graphic, accent skill pills.
14. [sections/Journey.tsx](../../sections/Journey.tsx) — glass PDF button, subtle card hover, accent language pills.
15. Header/MobileMenu/ContactForm/BackToTop — dark glass surfaces, accent hover glows, dark form inputs.
16. [components/Preloader.tsx](../../components/Preloader.tsx) — dark background + accent surname.

---

## Phase 5 — Docs & verification ✅

17. This document.
18. `npm run lint` + `npm run build` pass.
19. Browser verification on `/de` and `/en`.

---

## Out of scope

- No content/copy rewrites beyond removing the direct-contact line.
- No CV data changes beyond adding icon fields.
- No new sections/routes; tests still deferred (see [requirements.md](./requirements.md) §10).
