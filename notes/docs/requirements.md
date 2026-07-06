# Requirements — Personal Website (Joel Bakirel)

> Status: Draft for implementation. Language of the site: German (default) + English.
> This document defines **what** to build. The **how/when** is in [implementation-plan.md](./implementation-plan.md).

## 1. Overview

A personal portfolio / digital business-card website for **Joel Bakirel** (domain: `JoelBakirel.de`).
Single-page landing experience with anchored sections plus two standalone legal pages.
Minimalist, editorial, typography-centric design in a monochrome palette. Fully responsive and dynamic.

- **Audience:** general (recruiters, companies, visitors).
- **Purpose:** portfolio **and** CV/business card.
- **Reference designs:** `notes/design/Page design #1.png` (landing), `notes/design/Page design scrolldown #2.png` (about), `notes/design/Page deisgn scrolldown #3.png` (journey). Follow closely; deviations allowed. **No face photo** anywhere.

## 2. Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js `16.2.10`, App Router |
| UI | React `19.2.4` |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), `@theme inline` tokens in `globals.css` |
| Fonts | Geist / Geist Mono via `next/font` (self-hosted → DSGVO-friendly, no runtime Google CDN) |
| i18n | `next-intl` |
| Animation | `framer-motion` |
| Linting | ESLint 9 + `eslint-config-next` |

- No dark mode (remove boilerplate dark-mode CSS).
- **No cookies** anywhere.

## 3. Design Tokens

| Token | Value | Usage |
| --- | --- | --- |
| Primary | `#222222` | Text, headings, primary UI |
| Secondary | `#7B7B7B` | Muted text, captions, inactive states |
| Tertiary | `#F8F8F8` | Section backgrounds, cards |
| White | `#FFFFFF` | Base background |

- Typography-centric layout, large elegant sans-serif greeting, generous whitespace, high contrast, monochrome.

## 4. Global Layout & Navigation

### 4.1 Header
- Sticky; background transitions transparent → filled on scroll.
- Top-left logo = initials **"JB"**; clicking scrolls to top.
- Left nav items (exactly three): **Über mich**, **Mein Werdegang**, **Kontakt** (localized).
- Smooth-scroll to sections with an offset so the sticky header never covers content.
- Scroll-spy: active section highlighted in the nav.
- Section anchors are shareable via URL hash (e.g. `#ueber-mich`).
- Right side: **DE/EN language toggle** (toggle style, not dropdown).
- Mobile: burger menu.

### 4.2 Left vertical line + scroll progress
- Vertical line on the left edge (as in reference #1).
- **Per-section** scroll progress indicator rendered on the line, with color change as it fills.
- Progress label shows the **current year** (dynamic) and scrolls with the content.
- **Desktop only** (hidden on mobile).

### 4.3 Footer
- Social icons: **GitHub**, **LinkedIn**, **Email**.
  - GitHub: `https://github.com/Joelabc123`
  - LinkedIn: `https://www.linkedin.com/in/joel-bakirel-93bb13292/`
  - Email: `jb@joelbakirel.de`
- "This website is open source" line with a GitHub icon linking to the repo: `https://github.com/Joelabc123/personal-website`.
- Copyright: `© <current year> Joel Bakirel`.
- Links to **Impressum** and **Datenschutz**.
- A floating, animated **back-to-top** icon fixed at the **bottom-left** (no separate footer button).

## 5. Sections (single page)

### 5.1 Hero
- Full viewport height (`100vh`).
- Large greeting: **"Hallo"** (DE) / **"Hello"** (EN).
- Subtitle: **"Hallo - Ich bin Joel"** (localized).
- Right side: **abstract graphic placeholder** (no photo).
- Animated **"Scroll down"** arrow.
- No stat numbers, no vertical role text.

### 5.2 About ("Über mich" / "About Me")
- Placeholder body text (real copy later).
- One **stat card** with a fitting value (placeholder, e.g. "English C1" / "3+ years").
- **Skills / tech-stack list**.
- Two-column layout on desktop → single column on mobile.
- Abstract placeholder instead of portrait images.
- **No** bullet-point-with-icons list; **no** project cards in this section.

### 5.3 Journey ("Mein Werdegang" / "My Journey")
- **Separate blocks** (not a single merged timeline), newest first, **no tags**.
- Placeholder images shown for companies/projects (as in reference #3).
- Localized date formatting (e.g. "Okt 2026" vs "Oct 2026").
- PDF button **"Lebenslauf als PDF"** opens `public/Lebenslauf.pdf` in a **new tab**.
- The existing `notes/Lebenslauf.pdf` is copied into `public/`.
- The "Book A Call" element from the reference is removed.

**Content — Berufserfahrung**
- **Speira GmbH** — 03/2025 – Present — *Werkstudent IT Governance | Teilzeit | Grevenbroich*
  - Aktive Mitwirkung bei der Umsetzung von Digitalisierungsinitiativen
  - Koordination und Verwaltung externer IT-Dienstleister
  - Eigenständige Abwicklung von IT-Beschaffungsprozessen und Bestellungen über SAP Logon und Coupa
  - Kollaborative Mitarbeit mit dem IT-PMO Team zur Realisierung von IT-Projekten

**Content — Ausbildung**
- **Technische Universität München** — ab 10/2026 — *M.Sc.* (added; shown as a normal entry)
- **Universität Mannheim** — 09/2021 – Present — *B.Sc. Wirtschaftsinformatik*
  - Aktueller Durchschnitt: 2,4
  - Bachelorarbeit: Entwicklung eines interaktiven Lern- und Übungsmoduls zum Thema Rot-Schwarz-Bäume für die E-Learning-Plattform der Universität Mannheim
- **Georg-Büchner-Gymnasium** — 09/2013 – 06/2021 — *Abitur | Köln-Weiden*
  - Durchschnitt: 2,5

**Content — Projekte**
- Immobilienverwaltungsplattform — vollautomatisierte Immobilienverwaltung von Bewerberauswahl bis Vertragsabwicklung, mit individuellem Dashboard für Finanzkontrolle und Aufgabenplanung. *(link: "Zum Projekt")*
- Finanzverwaltungsplattform — datengesteuertes Portfoliomanagement unter Berücksichtigung moderner Finanztheorien.
- Rot-Schwarz-Baum Lern- und Übungsmodul — für die E-Learning-Plattform der Universität Mannheim: Grapheneditor, automatische Fehlererkennung/-behebung, interaktive Tutorials, Algorithmen-Simulator.
- Quizduell — Projektarbeit Client-Server-Architektur über TCP-Sockets in Java. *(link: "Zum Projekt")*
- Online-Brettspiel — kollaborativ in Java entwickelt. *(link: "Zum Projekt")*

**Content — Sprachkenntnisse**
- Deutsch — Muttersprache
- Englisch — C1 (TOEFL iBT 110/120)

### 5.4 Contact ("Kontakt")
- Form fields: **Name**, **E-Mail**, **Betreff**, **Nachricht**.
- Submission via **`mailto:` to `jb@joelbakirel.de`** (build a mailto link from the field values on submit).
- HTML5 validation only (no validation library, no spam protection, no privacy checkbox, no inline success/error UI).
- Visible direct email address also displayed.
- Architecture note: keep the submit handler isolated so it can later be swapped for a Server Action (self-hosted email) without restructuring the form.

## 6. Legal Pages
- Standalone localized routes: **`/impressum`** and **`/datenschutz`** (bilingual, DE + EN).
- Placeholder content with a clear "**must be reviewed legally**" note.
- Site is operated **privately / non-commercially**.
- No analytics, no tracking, no cookie banner.

## 7. Internationalization (i18n)
- Library: **`next-intl`**.
- **Prefix routing**: `/de` (default) and `/en`.
- Root `/` redirects based on the browser `Accept-Language` header.
- **No locale cookie** — configure next-intl with `localeCookie: false`; locale is derived purely from the URL prefix (+ Accept-Language on the root redirect).
- Language toggle switches between `/de` and `/en` for the current path.
- `<html lang>` set per locale; **hreflang** alternates emitted for SEO.
- Dates localized per locale.
- **Not translated:** proper names and tech-stack terms.
- All copy (including legal pages) available in both languages via `messages/de.json` and `messages/en.json`.

## 8. Animations (Framer Motion)
- **Preloader / splash on every page load**; text elegantly flies up from the bottom into place.
- **Scroll animations for all sections**: text disappears upward as the previous content leaves and new content arrives.
- Hover animations on buttons and cards.
- Overall feel: elegant, subtle but noticeable (a middle ground).

## 9. Non-Functional Requirements
- Fully responsive (mobile → desktop) and dynamic.
- Clean, maintainable, well-structured code (clear component/section/lib separation).
- **No cookies** set by the site (verifiable in browser dev tools).
- Self-hosted fonts (DSGVO).
- Passes `npm run lint` and `npm run build`.

## 10. Out of Scope (for now)
- Automated tests (Vitest/Playwright) — later.
- Deep SEO / OpenGraph images — later.
- Server-side email sending / Server Action for the contact form — later (self-hosting).
- Analytics / tracking.
- `prefers-reduced-motion` handling — not required per current decision; easy to add later.
