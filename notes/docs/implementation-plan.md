# Implementation Plan — Personal Website (Joel Bakirel)

> Companion to [requirements.md](./requirements.md). Multi-stage plan for building the site with
> Next.js 16.2.10 (App Router), React 19, Tailwind v4, `next-intl`, and Framer Motion.
> Each phase is independently verifiable. Complete phases in order; do not start a phase before the previous one builds.

## Conventions

- **Locale routing** lives under `app/[locale]/`.
- **Sections** are self-contained components composed by the single landing page.
- **All user-facing text** comes from `messages/{de,en}.json` — never hard-code copy in components.
- Keep components small and typed; prefer Server Components, mark Client Components with `"use client"` only where interactivity (scroll, animation, form, toggle) requires it.

### Target folder structure

```text
app/
  [locale]/
    layout.tsx            # <html lang>, fonts, NextIntlClientProvider, Preloader, Header, Footer, BackToTop
    page.tsx              # composes the landing sections
    impressum/page.tsx
    datenschutz/page.tsx
  globals.css            # Tailwind + design tokens (@theme)
i18n/
  routing.ts             # next-intl routing (locales, defaultLocale, prefix)
  request.ts             # next-intl request config (load messages)
messages/
  de.json
  en.json
proxy.ts                 # next-intl proxy (locale detection + root redirect, no cookie; Next.js 16 renamed Middleware -> Proxy)
components/
  Header.tsx
  Nav.tsx
  LanguageToggle.tsx
  MobileMenu.tsx
  ScrollProgress.tsx     # left line + per-section progress + current year (desktop)
  BackToTop.tsx          # floating animated bottom-left button
  Preloader.tsx          # splash + fly-up on every load
  Reveal.tsx             # Framer Motion scroll-reveal wrapper
  Footer.tsx
  ContactForm.tsx
sections/
  Hero.tsx
  About.tsx
  Journey.tsx
  Contact.tsx
lib/
  siteConfig.ts          # name, domain, email, social + repo links, nav config
  dates.ts               # locale-aware date formatting
  cv.ts                  # structured CV data (experience, education, projects, languages)
public/
  Lebenslauf.pdf         # copied from notes/
  ...placeholder graphics
```

---

## Phase 0 — Project setup & cleanup

**Goal:** clean baseline with tokens, fonts, dependencies, and folder scaffold.

Tasks:
1. Remove `create-next-app` boilerplate from `app/page.tsx` and demo assets.
2. In `app/globals.css`: remove dark-mode block; add design tokens under `@theme` (`--color-primary #222222`, `--color-secondary #7B7B7B`, `--color-tertiary #F8F8F8`, `--color-white #FFFFFF`); set base background/foreground to monochrome.
3. In root metadata: title/description for "Joel Bakirel", domain `JoelBakirel.de`.
4. Install dependencies: `next-intl`, `framer-motion`.
5. Create the folder structure above (empty stubs where needed).
6. Add `lib/siteConfig.ts` with name, email `jb@joelbakirel.de`, GitHub `Joelabc123`, LinkedIn URL, repo URL, nav item ids.
7. Copy `notes/Lebenslauf.pdf` → `public/Lebenslauf.pdf`.

**Verify:** `npm run lint` and `npm run build` pass on the cleaned skeleton.

---

## Phase 1 — i18n foundation (next-intl)

**Goal:** working `/de` (default) and `/en` routing with no cookies.

Tasks:
1. `i18n/routing.ts`: locales `['de','en']`, `defaultLocale: 'de'`, always-prefix.
2. `i18n/request.ts`: load the correct `messages/{locale}.json`.
3. `proxy.ts` (Next.js 16's renamed `middleware.ts`, exporting a `proxy` function): next-intl proxy; root `/` redirects using `Accept-Language`; **disable the locale cookie** (`localeCookie: false`); matcher excludes `_next` and static files.
4. Move app tree under `app/[locale]/`; `layout.tsx` sets `<html lang={locale}>` and wraps children in `NextIntlClientProvider`.
5. `generateStaticParams` for `de` and `en`.
6. Seed `messages/de.json` + `messages/en.json` with namespaces: `nav`, `hero`, `about`, `journey`, `contact`, `footer`, `legal`.
7. Emit `alternates.languages` (hreflang) in metadata.
8. `lib/dates.ts`: locale-aware month/year formatting.

**Verify:** visiting `/` redirects by browser language; `/de` and `/en` render; no cookie is set (dev tools → Application → Cookies is empty).

---

## Phase 2 — Layout, Header & Scroll Progress

**Goal:** sticky header with nav, toggle, mobile menu, and the left per-section progress line.

Tasks:
1. `components/Header.tsx` (client): sticky; background transparent → filled on scroll; "JB" logo scrolls to top.
2. `components/Nav.tsx`: three items (Über mich / Mein Werdegang / Kontakt) → smooth-scroll with header offset; shareable hash anchors; scroll-spy active highlight (IntersectionObserver).
3. `components/LanguageToggle.tsx`: switches current path between `/de` and `/en`.
4. `components/MobileMenu.tsx`: burger menu for small screens.
5. `components/ScrollProgress.tsx`: left vertical line; per-section fill with color change; label shows current year (`new Date().getFullYear()`) and scrolls with content; **desktop only** (hidden on mobile).
6. Wire Header + ScrollProgress into `app/[locale]/layout.tsx`.

**Verify:** header sticks and changes on scroll; nav scrolls smoothly with correct offset; active item highlights; toggle swaps locale keeping the section; progress line fills per section on desktop and is hidden on mobile.

---

## Phase 3 — Hero section

**Goal:** full-height typographic hero.

Tasks:
1. `sections/Hero.tsx`: `100vh`; large "Hallo"/"Hello"; subtitle "Hallo - Ich bin Joel"; abstract graphic placeholder on the right; animated "Scroll down" arrow. No stats, no vertical role text.
2. Add `hero` copy to message files.

**Verify:** hero fills the viewport; greeting/subtitle localized; scroll-down arrow visible and animated.

---

## Phase 4 — About section

**Goal:** two-column about block.

Tasks:
1. `sections/About.tsx`: heading "Über mich"/"About Me"; placeholder body text; one stat card (fitting placeholder value); skills/tech-stack list; abstract placeholder graphic; two columns on desktop → one on mobile. No icon-bullets, no project cards.
2. Add `about` copy + skills list to message files.

**Verify:** responsive two→one column; localized; stat card and skills render.

---

## Phase 5 — Journey (CV) section

**Goal:** structured CV with separate blocks and PDF link.

Tasks:
1. `lib/cv.ts`: typed data for **Berufserfahrung**, **Ausbildung** (including **TU München M.Sc. from 10/2026** as a normal entry), **Projekte**, **Sprachkenntnisse** (content per requirements §5.3).
2. `sections/Journey.tsx`: heading "Mein Werdegang"/"My Journey"; separate blocks; newest first; no tags; placeholder images for companies/projects; localized dates; project links ("Zum Projekt") as placeholders.
3. PDF button "Lebenslauf als PDF" → opens `/Lebenslauf.pdf` in a new tab (`target="_blank" rel="noopener"`). Remove any "Book A Call" element.
4. Add `journey` copy to message files (labels; names/tech stay untranslated).

**Verify:** all blocks render newest-first; dates localized per locale; PDF opens in a new tab; TU München entry present.

---

## Phase 6 — Contact & Footer

**Goal:** mailto contact form and complete footer.

Tasks:
1. `components/ContactForm.tsx` (client): fields Name, E-Mail, Betreff, Nachricht; HTML5 validation; on submit build and open a `mailto:jb@joelbakirel.de` link with subject/body from fields. Isolate the submit handler so it can later become a Server Action.
2. `sections/Contact.tsx`: form + visible direct email address.
3. `components/Footer.tsx`: GitHub / LinkedIn / Email icons; "This website is open source" with GitHub icon → repo; `© <year> Joel Bakirel`; Impressum + Datenschutz links.
4. `components/BackToTop.tsx`: floating animated icon fixed bottom-left; scrolls to top.
5. Add `contact` + `footer` copy to message files.

**Verify:** submitting opens the mail client with prefilled subject/body; all footer links point to the correct URLs; back-to-top appears and works.

---

## Phase 7 — Legal pages

**Goal:** bilingual placeholder legal pages.

Tasks:
1. `app/[locale]/impressum/page.tsx` and `app/[locale]/datenschutz/page.tsx`.
2. Placeholder content (private/non-commercial) with a visible "**content must be reviewed legally**" note; no analytics/cookie text needed.
3. Add `legal` copy to message files for both locales.

**Verify:** `/de/impressum`, `/en/impressum`, `/de/datenschutz`, `/en/datenschutz` all render localized; footer links reach them.

---

## Phase 8 — Animations (Framer Motion)

**Goal:** load and scroll motion across the site.

Tasks:
1. `components/Preloader.tsx`: splash on **every** load; text flies up from the bottom into place; then reveals the page.
2. `components/Reveal.tsx`: reusable scroll-reveal wrapper (text disappears upward / new content enters) applied to **all sections**.
3. Add hover animations to buttons and cards.
4. Tune easing/duration for an elegant, subtle-but-noticeable feel.

**Verify:** preloader plays on each reload; sections animate on scroll in both directions; hover effects on buttons/cards; motion feels smooth (no layout jank).

---

## Phase 9 — Polish & handoff

**Goal:** production-ready baseline.

Tasks:
1. Responsive pass across breakpoints (mobile burger, hidden progress line, two→one column).
2. Confirm **no cookies** are set (dev tools).
3. Confirm fonts are self-hosted via `next/font`.
4. `npm run lint` and `npm run build` clean.

**Deferred (see requirements §10):** tests, deep SEO/OG, server-side email, analytics, `prefers-reduced-motion`.

---

## Global verification checklist

- [ ] `/` redirects by browser language; `/de` and `/en` both work.
- [ ] Language toggle keeps the current section/path.
- [ ] No cookies set anywhere.
- [ ] Smooth-scroll + scroll-spy with correct header offset; shareable hash anchors.
- [ ] Per-section progress line with current year — desktop only.
- [ ] Hero 100vh; localized greeting/subtitle; animated scroll-down.
- [ ] About responsive two→one column; stat card + skills.
- [ ] Journey: separate blocks, newest first, localized dates, TU München entry, PDF opens in new tab.
- [ ] Contact form opens mailto with prefilled content; email visible.
- [ ] Footer links (GitHub, LinkedIn, Email, repo, Impressum, Datenschutz) correct; floating back-to-top works.
- [ ] Legal pages render in both locales.
- [ ] Preloader on every load; scroll + hover animations present.
- [ ] `npm run lint` and `npm run build` pass.
