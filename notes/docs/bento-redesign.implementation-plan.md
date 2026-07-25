# Implementierungsplan: Bento-Relaunch

**Grundlage:** `bento-redesign.requirements.md`  
**Technik:** Next.js 16.2 App Router, React 19, TypeScript, Tailwind CSS 4, `next-intl` 4  
**Planstatus:** Entscheidungs- und umsetzungsfertig

## 1. Zielarchitektur

### 1.1 Route-basierte Vollbild-Modals

Die Detailansichten werden nach der in Next.js 16 dokumentierten Kombination aus Parallel Routes und Intercepting Routes umgesetzt. Der Locale-Layout-Root rendert `children` und einen parallelen `modal`-Slot.

```text
app/[locale]/
├── layout.tsx
├── page.tsx
├── cv/page.tsx
├── projects/page.tsx
├── projects/[slug]/page.tsx
├── travel/page.tsx
├── travel/[year]/[country]/[trip]/page.tsx
├── contact/page.tsx
└── @modal/
    ├── default.tsx
    ├── page.tsx
    ├── [...catchAll]/page.tsx
    ├── (.)cv/page.tsx
    ├── (.)projects/page.tsx
    ├── (.)projects/[slug]/page.tsx
    ├── (.)travel/page.tsx
    ├── (.)travel/[year]/[country]/[trip]/page.tsx
    └── (.)contact/page.tsx
```

- `default.tsx`, die Nullseite und der Catch-all geben `null` zurück, damit der Modal-Slot bei Hard Navigation und beim Verlassen zuverlässig geleert wird.
- Normale Seiten und abgefangene Modal-Routen importieren dieselben Server-Component-Inhalte; nur `StandaloneShell` beziehungsweise `ModalShell` unterscheiden sich.
- `ModalShell` ist eine kleine Client Component auf Basis von `<dialog>`. Sie öffnet modal, schließt über Escape, Backdrop oder Button, ruft `router.back()` auf und stellt den auslösenden Fokus wieder her.
- Bei fehlender sinnvoller Browserhistorie verlinkt die Standalone-Variante zurück auf `/{locale}`.
- Alle Next-16-`params` werden als Promise typisiert und `await`et.
- Dynamische Projekt- und Reiserouten implementieren `generateStaticParams`; unbekannte Slugs liefern 404.

### 1.2 Datenfluss

```text
cv.ts ───────────────► CV-Bento ─────► CV-Detail ─────► PDF/Print
projects.ts ─────────► Code-Bento ────► Übersicht ─────► Projektdetail
private Fotos + Meta ─► prepare script ► Manifest ──────► Reiseübersicht/Lightbox
messages/*.json ─────► lokalisierte UI-Texte aller Bereiche
ContactForm ─────────► /api/contact ──► reCAPTCHA + SMTP
```

Client Components werden nur für Dialogsteuerung, Theme/Locale-Controls, Marquee, Code-Loop, Lightbox und Formularzustand verwendet. Inhaltsseiten, Metadaten und Galerie-Manifestzugriff bleiben serverseitig.

## 2. Öffentliche Typen und Datenverträge

Die bestehenden CV-Typen werden serialisierbar und lokalisierbar gemacht. React-Komponententypen gehören nicht in die Inhaltsdaten.

```ts
type Locale = "de" | "en";
type LocalizedText = Readonly<Record<Locale, string>>;
type YearMonth = `${number}-${number}`;

type CvEntry = {
  id: string;
  category: "experience" | "education";
  organization: string;
  role: LocalizedText;
  from: YearMonth;
  to: YearMonth | null;
  location?: LocalizedText;
  bullets?: Readonly<Record<Locale, readonly string[]>>;
  logo: { src: string; alt: string; scale?: number };
};

type ProjectStatus = "published" | "coming-soon";
type ProjectMedia =
  | { type: "image" | "gif"; src: string; alt: LocalizedText }
  | { type: "video"; src: string; poster?: string; alt: LocalizedText }
  | { type: "placeholder"; variant: string; alt: LocalizedText };

type Project = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  status: ProjectStatus;
  featured: boolean;
  media: readonly ProjectMedia[];
  links: readonly {
    kind: "repository" | "demo" | "documentation";
    href: string;
  }[];
};

type GalleryMeta = {
  country: LocalizedText;
  place: LocalizedText;
  date?: YearMonth;
  cover?: string;
  order?: number;
  collapsed?: boolean | "auto";
  layout?: Readonly<Record<string, "wide" | "tall" | "square">>;
};

type GalleryImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt: LocalizedText;
  layout: "wide" | "tall" | "square";
};

type GalleryTrip = {
  year: number;
  countrySlug: string;
  tripSlug: string;
  meta: GalleryMeta;
  cover: GalleryImage;
  images: readonly GalleryImage[];
  collapsed: boolean;
};
```

`lib/cv.ts` bleibt CV-Quelle. Projektdaten werden aus dem CV-Modul in ein eigenes `lib/projects.ts` überführt, damit CV und Projekte nicht gegenseitig UI-Struktur erzwingen. UI-Begriffe bleiben in den Translation-Dateien.

## 3. Umsetzung in Arbeitspaketen

### Paket 0: Ausgangszustand sichern

1. Dirty Worktree dokumentieren und ausschließlich aufgabenbezogene Dateien verändern.
2. Änderungen in `components/Footer.tsx`, `lib/cv.ts` sowie neue/gelöschte Notes und Assets nicht zurücksetzen.
3. Baseline mit `npm run lint` und `npm run build` festhalten.
4. Die vier exakt benötigten Logo-Dateien aus Git wiederherstellen; keine anderen gelöschten Dateien pauschal restaurieren.

**Fertig, wenn:** Die vorhandenen Nutzeränderungen bestehen fort, alle vier Logo-Pfade funktionieren und der Baseline-Build bleibt reproduzierbar.

### Paket 1: Designfundament, Theme und Layout-Shell

1. Tokens aus `porsche.design.md` als CSS Custom Properties in Light und Dark abbilden: Farben, Radien, Spacing, Schatten, Motion und fluide Typografie.
2. Porsche Next lokal über `next/font/local` vorbereiten. Solange keine WOFF2-Datei vorhanden ist, den Arial-Narrow-Fallback verwenden; keine proprietäre Fontdatei herunterladen.
3. Theme initial aus gespeicherter Wahl, sonst Systempräferenz, sonst Light bestimmen. Ein frühes Inline-Script verhindert Theme-Flackern; Speicherung erfolgt in `localStorage`.
4. Header, Partikelhintergrund, Custom Cursor, Preloader und Back-to-top aus dem Locale-Layout entfernen.
5. Kompakten `UtilityDock` für Sprache und Theme sowie einen reduzierten Footer bauen.
6. Rechtstexte in die neue Shell übernehmen, ohne ihren Wortlaut zu ändern.

**Fertig, wenn:** Light/Dark wechseln ohne Cookie und sichtbares Flackern, die Porsche-Tokens bestimmen die gesamte Oberfläche, und alle alten globalen Effekte sind aus dem Rendering entfernt.

### Paket 2: Modal-Routing und gemeinsame Detail-Shells

1. Den `@modal`-Slot in `app/[locale]/layout.tsx` aufnehmen.
2. Null-Fallbacks und Catch-all gemäß Route-Baum anlegen.
3. `ModalShell` und `StandaloneShell` mit identischer Inhaltsbreite und Cinema-Design erstellen.
4. Platzhalterseiten für CV, Projekte, Reisen und Kontakt zunächst mit realen Routen verbinden.
5. Fokus, Escape, Backdrop, Scroll-Lock, Back/Forward und Reload-Verhalten implementieren.
6. Locale-Wechsel auf aktueller Route testen; Slugs bleiben sprachneutral.

**Fertig, wenn:** Jede Karte aus der Homepage ein URL-synchrones Vollbild-Modal öffnet und derselbe Link nach Reload als eigenständige Seite funktioniert.

### Paket 3: Kompakte Bento-Homepage

1. Semantisches 12×6-CSS-Grid gemäß Requirements umsetzen; Kartenpositionen über benannte Grid Areas statt fragile Einzelklassen definieren.
2. Tablet auf zwei Spalten und Mobil auf die festgelegte einspaltige Reihenfolge umstellen.
3. Vorstellungstexte und Standort DE/EN ergänzen.
4. Separate Foto-Bento mit lokalem neutralem Platzhalter anlegen.
5. CV-, Projekt-, Reise-, Kontakt-, GitHub- und LinkedIn-Bentos als echte Links beziehungsweise Controls implementieren.
6. Plattformfarben nur innerhalb der Social-Hover-/Fokuszustände zulassen.
7. Bei 1280 × 800 die Grid-Höhe an den Viewport anpassen; unterhalb einer sicheren Mindesthöhe auf normalen Seitenscroll wechseln.

**Fertig, wenn:** Alle acht Bentos auf Desktop im ersten Viewport liegen, Intro oben rechts steht und Mobile ohne horizontalen Overflow als normale Liste funktioniert.

### Paket 4: CV-Daten, Marquee, Detailansicht und PDF

1. `lib/cv.ts` um stabile IDs und DE/EN-Texte erweitern; vorhandene Nutzerkorrekturen beibehalten.
2. Datumsformatierung so korrigieren, dass zukünftige offene Einträge „ab/from“ statt „Heute/Present“ ausgeben.
3. Einen rAF-basierten, lückenlosen Logo-Marquee bauen. Geschwindigkeit wird per Delta-Time berechnet und bei Hover/Fokus weich von 20 auf 8 px/s interpoliert.
4. Statischen Reduced-Motion-Zustand und zweistufige Touch-Interaktion ergänzen.
5. Hovervorschau aus der CV-Oberfläche beziehungsweise PDF-Optik ableiten; keine fremde Referenzfotografie übernehmen.
6. CV-Detail als Kombination aus Timeline und Bento-Gruppen für Erfahrung, Ausbildung und Sprachen bauen.
7. Eine druckoptimierte CV-Ansicht erstellen und daraus die deutsche `public/Lebenslauf.pdf` neu erzeugen. PDF und Webansicht gegen `lib/cv.ts` abgleichen.

**Fertig, wenn:** Alle Logos laufen ohne Sprung, Hover verlangsamt statt stoppt, Touch benötigt Vorschau plus Öffnen, und Web/PDF zeigen dieselben aktuellen Fakten.

### Paket 5: Projekte und Code-Animation

1. Die vier bestehenden Projekte in `lib/projects.ts` migrieren und vollständig übersetzen.
2. Finanzverwaltungsplattform als `coming-soon` ohne Link und Detailroute ergänzen.
3. Stabile Slugs, Featured-Flag und Medien-Union einführen; keine Technologie-Tags ergänzen.
4. Neutrale lokale Platzhaltervarianten für fehlende Medien erstellen.
5. Projektübersicht als asymmetrisches Bento-Raster und Detailansichten mit Metadaten-/Beschreibungskarten sowie Medienbereich umsetzen.
6. TSX-Code-Loop als kleine Zustandsmaschine `typing → holding → deleting → waiting` umsetzen.
7. Animation über Intersection Observer pausieren, wenn die Karte nicht sichtbar ist; Reduced Motion zeigt den fertigen Code.
8. Externe Links nur bei vorhandener URL rendern und immer sicher in neuem Tab öffnen.

**Fertig, wenn:** Übersicht und vier Projektdetails direkt verlinkbar sind, Coming-soon nicht ins Leere führt und der Code-Loop exakt die festgelegten Phasen respektiert.

### Paket 6: Private Galerie-Pipeline

1. `content/gallery/<year>/<country>/<trip>` mit README und Beispiel-Metadaten dokumentieren.
2. `.gitignore` so ergänzen, dass Originalbilder, `public/generated/gallery` und das generierte Manifest ausgeschlossen sind, `_meta.json` aber versionierbar bleibt.
3. `sharp` als direkte Dependency deklarieren und `scripts/prepare-gallery.mjs` erstellen.
4. Der Scanner validiert Jahr/Slugs/Metadaten, erkennt doppelte IDs, sortiert natürlich und akzeptiert JPEG, PNG, WebP und AVIF.
5. Bilder per Auto-Orientierung normalisieren, Metadaten/EXIF entfernen, auf maximal 2400 px begrenzen und als WebP mit Inhalts-Hash ausgeben.
6. Manifest mit Dimensionen, Alttext-Grundlage, Layoutrolle und öffentlicher URL erzeugen.
7. `gallery:prepare` vor `dev` und `build` ausführen. Ein komplett fehlender Medienordner erzeugt ein leeres Manifest; teilweise kaputte Reisen brechen mit konkreter Fehlermeldung ab.
8. Reiseübersicht nach Jahr gruppieren. Bis sechs Bilder werden direkt gezeigt; ab sieben erscheint eine zusammengefasste Ortskarte. `_meta.json` kann dies überschreiben.
9. Reise-Detailroute und Lightbox mit `object-contain`, Pfeilen, Swipe und Escape implementieren.
10. Deployment-README um den separaten Foto-Sync vor dem Build ergänzen.

**Fertig, wenn:** Ein neuer korrekt strukturierter Ordner nach `gallery:prepare` ohne Codeänderung erscheint, keine Fotos von Git erfasst werden und ungültige Inhalte den Build verständlich stoppen.

### Paket 7: Kontakt, Socials und Footer

1. Bestehendes `ContactForm` visuell auf Light/Dark-Porsche-Tokens umstellen.
2. API-Payload, `/api/contact`, reCAPTCHA-Score, SMTP und beide E-Mails unverändert lassen.
3. reCAPTCHA-Script nur mit der Kontaktansicht mounten.
4. Formularstatus über `aria-live` ausgeben und Fokus nach Erfolg beziehungsweise Fehler sinnvoll setzen.
5. Kontakt-Bento und E-Mail-Funktion auf `/contact` vereinheitlichen.
6. GitHub und LinkedIn als reine Icon-Karten mit Screenreader-Label und Plattform-Hoverfarbe umsetzen.
7. Footer auf Copyright, Open-Source-Link und beide Rechtstexte reduzieren.

**Fertig, wenn:** Erfolgreicher und fehlerhafter Versand gleich funktionieren wie zuvor, das Script nicht auf der unberührten Homepage lädt und alle Footer-/Socialziele korrekt sind.

### Paket 8: Metadaten, Performance und Aufräumen

1. Gemeinsamen Metadata-Helper für lokalisierte Titel, Beschreibung, Canonical und `hreflang` erstellen.
2. Open-Graph-Bilder für Homepage, CV, Projekte und Reisen ergänzen.
3. Sitemap, Robots-Metadaten sowie `Person`- und `CreativeWork`-JSON-LD aus den kanonischen Daten erzeugen.
4. `next/image` mit korrekten `sizes`, stabilen Dimensionen und Priorität nur für sichtbare Above-the-fold-Medien verwenden.
5. Animationen bei unsichtbarem Tab beziehungsweise unsichtbarer Karte pausieren.
6. Nicht mehr importierte alte Sections und Effekt-Komponenten erst nach Referenzsuche entfernen; Nutzeränderungen nicht überschreiben.
7. Bundle und Client-Component-Grenzen prüfen; Inhaltsseiten bleiben serverseitig.

**Fertig, wenn:** Keine unnötigen Altkomponenten im Bundle liegen, Bilder keinen Layout Shift erzeugen und alle indexierbaren Routen korrekte Metadaten besitzen.

## 4. Testplan

### 4.1 Unit- und Komponententests

- Datumsformatierung: Vergangenheit, laufend, zukünftiger Start und Locale
- Projektlookup: gültiger Slug, Coming-soon und unbekannter Slug
- Galeriescanner: leeres Verzeichnis, Sortierung, sechs/sieben Bilder, Override, Cover, doppelte Slugs, ungültiges Format und fehlende Datei
- Code-Animation: alle Zustandsübergänge, Sichtbarkeitspause und Reduced Motion
- CV-Marquee: Basisspeed, verlangsamter Hover/Fokus, Touchvorschau und Reduced Motion
- Formular: Pflichtfelder, Sending, Success, Error und lokalisierte Live-Region
- Kontakt-API: ungültiges JSON/Payload/E-Mail, reCAPTCHA-Fehler, SMTP-Fehler und erfolgreiche Bestätigung mit gemockten externen Diensten

### 4.2 Playwright-End-to-End

- Chromium Desktop und Android-Viewport
- WebKit Desktop und iPhone-Viewport
- Homepage in DE/EN und Light/Dark
- Öffnen/Schließen aller Vollbild-Modals
- Browser Back/Forward sowie Reload einer direkten Detail-URL
- Locale-Wechsel bei geöffnetem CV, Projekt, Reise und Kontakt
- Projektnavigation Übersicht → Detail
- Reiseübersicht → Reise → Lightbox inklusive Tastatur und Swipe
- CV: Hover/Fokus sowie erster und zweiter Touch
- Kontakt: gemockter Erfolg und Fehler
- Footerlinks zu Impressum/Datenschutz
- kein horizontaler Overflow bei 375 px

### 4.3 Visuelle Regression

Referenzscreenshots werden für folgende Kombinationen gespeichert:

- Homepage: 1280 × 800, 1440 × 900, iPhone und Android
- CV, Projekte, Projektdetail, Reisen, Reiseansicht und Kontakt
- jeweils Light/Dark, soweit die Ansicht beide Modi unterstützt
- CV-Hover, Social-Hover und Projekt-Code-Endzustand

### 4.4 Pflichtchecks

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Ein Arbeitspaket gilt erst als abgeschlossen, wenn seine relevanten Tests und der Produktionsbuild erfolgreich sind.

## 5. Abnahme- und Rolloutreihenfolge

1. Designfundament und statisches Homepage-Raster visuell abnehmen.
2. Modal-Routing inklusive Deep Links abnehmen.
3. CV und Projekte mit Platzhaltern vollständig abnehmen.
4. Galerie-Pipeline zunächst mit lokalen Testbildern verifizieren; Testbilder nicht committen.
5. Kontakt in einer Staging-Umgebung mit reCAPTCHA-/SMTP-Konfiguration testen.
6. Echte lizenzierte Fontdatei, persönliches Foto, Projektmedien und private Reisefotos einspielen, sobald verfügbar.
7. PDF neu erzeugen, SEO-Ausgaben prüfen und finalen Browser-/Performance-Test durchführen.
8. Bestehendes Deployment ersetzen; kein Datenbank- oder URL-Migrationsschritt ist erforderlich.

## 6. Risiken und Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
| --- | --- |
| Modal bleibt nach Navigation sichtbar | `default.tsx`, Nullseite und Catch-all im parallelen Slot verpflichtend |
| Direkter Link verhält sich anders als Homepage-Klick | gemeinsame Inhaltskomponenten, getrennte Shells, E2E für Soft/Hard Navigation |
| Fotos fehlen in CI/Deployment | dokumentierter privater Medien-Sync vor `gallery:prepare` und Build |
| private Originale gelangen in Git | explizite Ignore-Regeln plus Test mit `git check-ignore` |
| Porsche-Next-Datei fehlt | definierter Arial-Narrow-Fallback; kein Download aus nicht autorisierter Quelle |
| PDF und Website driften auseinander | PDF ausschließlich aus der druckoptimierten kanonischen CV-Ansicht neu erzeugen |
| Animationen belasten Mobilgeräte | Sichtbarkeitspause, Delta-Time, Reduced Motion und statische Fallbacks |
| bestehende Nutzeränderungen gehen verloren | kein Reset; gezielte Patches und Wiederherstellung nur der vier Logo-Pfade |

