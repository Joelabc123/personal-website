# Anforderungen: Bento-Relaunch der persönlichen Website

**Status:** Verbindliche Planungsgrundlage  
**Stand:** 23. Juli 2026  
**Quellen:** Nutzerbriefing und Antworten 1–120, `porsche.design.md`, Referenzbilder unter `notes/screenshots`, bestehende Website

## 1. Zielbild und Umfang

Die Website wird vollständig in ein kompaktes, zeitlos-elegantes Bento-Portfolio umgebaut. Zielgruppen sind Recruiter und das private Umfeld. Der Auftritt soll professionell und persönlich wirken; die inhaltliche Priorität lautet:

1. Lebenslauf
2. Projekte
3. Reisen
4. Persönliche Inhalte

Die bestehende technische Basis mit Next.js, Deutsch/Englisch und dem funktionierenden Kontaktversand bleibt erhalten. Bestehende Inhalte dürfen auf Konsistenz, Aktualität und Übersetzung korrigiert werden. Das bisherige visuelle System, der Header, Partikelhintergrund, Custom Cursor, Preloader, Glow-Effekte und die aktuelle lange Startseite werden nicht übernommen.

Nicht Bestandteil der ersten Umsetzung sind ein CMS, ein Upload-Backend, Analytics, neue berufliche Inhalte, echte Projektmedien oder ein künstlich erzeugtes Porträt.

## 2. Informationsarchitektur und Navigation

### 2.1 Routen

Alle Inhaltsrouten verwenden englische Segmente und behalten den vorhandenen Locale-Präfix:

| Inhalt | Route |
| --- | --- |
| Homepage | `/{locale}` |
| Lebenslauf | `/{locale}/cv` |
| Projektübersicht | `/{locale}/projects` |
| Projektdetail | `/{locale}/projects/{slug}` |
| Reisen | `/{locale}/travel` |
| Reise/Ort | `/{locale}/travel/{year}/{country}/{trip}` |
| Kontakt | `/{locale}/contact` |
| Impressum | `/{locale}/impressum` |
| Datenschutz | `/{locale}/datenschutz` |

### 2.2 Vollbildansichten

- CV, Projekte, Reisen und Kontakt öffnen bei Navigation von der Homepage als route-basierte Vollbild-Modals über dem Bento-Raster.
- Die URL ändert sich beim Öffnen und ist teilbar.
- Browser-Zurück schließt das Modal; Browser-Vorwärts öffnet es erneut.
- Ein Direktaufruf oder Reload derselben URL zeigt denselben Inhalt als eigenständige Vollbildseite.
- Projekt- und Reisedetails sind ebenfalls direkt verlinkbar.
- Alle Vollbildansichten besitzen eine eindeutige Schließen-Steuerung, sperren den Hintergrundscroll und stellen den Fokus beim Schließen wieder her.

### 2.3 Globale Navigation

- Es gibt keinen Header und kein klassisches Hauptmenü.
- Die Bento-Karten sind die Hauptnavigation.
- Ein kompakter Utility-Bereich stellt Sprach- und Theme-Umschalter bereit, ohne als Header aufzutreten.
- Der Footer bleibt klein und enthält Copyright, Open-Source-Link, Impressum und Datenschutz.
- Impressum und Datenschutz behalten ihre Inhalte und Routen; nur das Design wird angepasst.

## 3. Visuelles System

### 3.1 Farben und Oberflächen

Die Tokens aus `porsche.design.md` sind verbindlich:

- Light Canvas: `#ffffff`
- erhöhte Light-Fläche: `#fafbff`
- weiche Kartenfläche: `#f1f1f4`
- Dark Canvas: `#010205`
- dunkle Sekundärflächen: `#1a1a1e` und `#2b2c2f`
- Light-Text: `#000000`
- Dark-Text: `#fafbff`
- Hairline: `#d5d5d5`
- Fokus und Information: `#1a44ea`
- semantische Farben: Warning `#ac5102`, Error `#ba171f`, Success `#197e10`

Light ist der initiale Standard. Ein Theme-Umschalter erlaubt Dark Mode und speichert die Wahl lokal ohne Cookie. Vollbild-Detailansichten dürfen unabhängig vom globalen Theme gezielt dunkle Cinema-Flächen verwenden.

Plattformfarben sind eine begrenzte Ausnahme: Sie dürfen ausschließlich den Hover-/Fokuszustand der jeweiligen Social-Karte prägen.

### 3.2 Typografie und Formen

- Porsche Next wird über `next/font/local` selbst gehostet, sobald die lizenzierten WOFF2-Dateien bereitgestellt wurden.
- Bis dahin gilt der dokumentierte Fallback-Stack `"Arial Narrow", Arial, sans-serif`.
- Schriftgewicht ist grundsätzlich 400; Letter-Spacing bleibt normal.
- Größen skalieren fluid mit `clamp()`.
- Große Bento- und Medienkarten verwenden abhängig von Größe 24 oder 32 px Radius; 32 px bleibt der dominante Wert.
- Pills bleiben vollständig gerundet, Formularfelder verwenden 8 px Radius.
- Schatten werden sparsam verwendet; Tiefe entsteht primär durch Fotos, Kontrast und Kartenradien.

### 3.3 Bewegung

- Animationen sind ruhig, zweckgebunden und dürfen die Lesbarkeit nicht beeinträchtigen.
- `prefers-reduced-motion` deaktiviert Endlosschleifen, Tippanimationen und große Übergänge zugunsten statischer Endzustände.
- Hoverzustände erhalten gleichwertige Fokuszustände.
- Touch-Geräte bekommen explizite Vorschau- und Öffnungszustände, die nicht von Hover abhängen.

## 4. Homepage

### 4.1 Desktop-Raster

Ab 1200 px verwendet die Homepage ein kompaktes 12-Spalten-/6-Zeilen-Raster:

| Bento | Position |
| --- | --- |
| CV | Spalten 1–6, Zeilen 1–3 |
| Vorstellung | Spalten 7–12, Zeilen 1–2 |
| Projekte | Spalten 1–3, Zeilen 4–6 |
| Reisen | Spalten 4–6, Zeilen 4–6 |
| persönliche Fotokarte | Spalten 7–8, Zeilen 3–6 |
| GitHub | Spalten 9–10, Zeilen 3–4 |
| LinkedIn | Spalten 11–12, Zeilen 3–4 |
| Kontakt/E-Mail | Spalten 9–12, Zeilen 5–6 |

Das Raster füllt bei 1280 × 800 den ersten Viewport ohne internen Scroll und ohne den Footer hineinzuzwingen. Bei geringerer Höhe darf die Seite vertikal scrollen, statt Karten unlesbar zu komprimieren.

### 4.2 Tablet und Mobil

- Tablet: zweispaltiges, vertikal scrollbares Raster.
- Mobil: normale einspaltige Kartenfolge.
- Mobile Reihenfolge: Vorstellung, CV, Projekte, Reisen, Fotokarte, Kontakt, GitHub, LinkedIn.
- Es darf bei 375 px Breite keinen horizontalen Overflow geben.

### 4.3 Vorstellungs- und Fotokarte

Die Vorstellungsbox liegt auf Desktop oben rechts und ist nicht klickbar.

- DE: „Hallo, ich bin Joel Bakirel — M.Sc. Information Systems @ TUM“
- EN: „Hi, I’m Joel Bakirel — M.Sc. Information Systems @ TUM“
- Ergänzung: „Köln, Deutschland“ beziehungsweise „Cologne, Germany“
- Kein „Incoming“ und kein Verfügbarkeitsstatus
- Kein Porträt innerhalb der Vorstellungsbox

Die separate persönliche Fotokarte verwendet zunächst einen neutralen, klar austauschbaren Platzhalter. Sobald ein echtes Bild geliefert wird, muss es ohne Layoutänderung ersetzbar sein.

## 5. Lebenslauf

### 5.1 Daten und Inhalt

- `lib/cv.ts` bleibt die kanonische Quelle für Berufserfahrung, Ausbildung und Sprachen.
- Projekte werden nicht mehr innerhalb der CV-Ansicht ausgegeben.
- Sprachkenntnisse bleiben Bestandteil des CV.
- Die vier vorhandenen Organisationslogos für Speira, TUM, Universität Mannheim und Georg-Büchner-Gymnasium werden gezielt aus Git wiederhergestellt.
- Ein zukünftiger Eintrag mit Start im Oktober 2026 wird im CV als „ab Oktober 2026“ beziehungsweise „from October 2026“ dargestellt, nicht als „Heute/Present“.
- Die Intro-Zeile bleibt auf ausdrücklichen Wunsch „M.Sc. Information Systems @ TUM“.
- Die verlinkte PDF wird an die kanonischen Daten, die aktuelle E-Mail-Adresse und die korrigierten Datumsangaben angeglichen.

### 5.2 CV-Bento

- Alle vier Logos laufen farbig, lückenlos und endlos von rechts nach links.
- Basistempo: ungefähr 20 px pro Sekunde.
- Bei Hover oder Fokus verlangsamt sich die Bewegung weich auf ungefähr 8 px pro Sekunde; sie stoppt nicht.
- Der Track wird so dupliziert, dass zu keinem Zeitpunkt eine sichtbare Lücke entsteht.
- Bei reduzierter Bewegung erscheint eine statische, umbrechende Logoreihe.
- Hover/Fokus verwandelt die Karte in eine vollflächige, dunkler überlagerte Vorschau der aktualisierten CV-Darstellung.
- Beschriftung: „Lebenslauf“ auf Deutsch und „CV“ auf Englisch, mit Richtungspfeil.
- Touch: Der erste Tap aktiviert die Vorschau; ein zweiter Tap oder der dann sichtbare CTA öffnet die CV-Route.

### 5.3 CV-Detail

- Die Detailansicht kombiniert Timeline und Bento-Karten.
- Berufserfahrung und Ausbildung sind getrennte Gruppen.
- Logos, Rollen, Orte, Zeiträume und vorhandene Bulletpoints werden angezeigt.
- Sprachen erscheinen als eigene kompakte Bento-Gruppe.
- Ein PDF-CTA öffnet beziehungsweise lädt die aktualisierte PDF.

## 6. Projekte

### 6.1 Projektbestand

Die Übersicht enthält:

1. Immobilienverwaltungsplattform
2. Rot-Schwarz-Baum Lern- und Übungsmodul
3. Quizduell
4. Online-Brettspiel
5. Finanzverwaltungsplattform mit Status „Coming soon“

Die vier bestehenden Projekte verwenden ihre vorhandenen Beschreibungen und Links. Es werden keine Technologien, Rollen, Zeiträume oder Links erfunden. Alle Beschreibungen werden vollständig auf Deutsch und Englisch gepflegt.

### 6.2 Übersicht und Details

- Die Projektübersicht folgt dem asymmetrischen Bento-Muster der Referenz.
- Das wichtigste bestehende Projekt erhält die große Featured-Karte; Standard ist die Immobilienverwaltungsplattform.
- Jedes veröffentlichte Projekt besitzt eine eigene Vollbildansicht mit stabilem englischem Slug.
- „Coming soon“ besitzt in Version 1 keine leere Detailseite und keinen funktionslosen CTA.
- Öffentliche Links öffnen in einem neuen Tab.
- Fehlt ein Link, wird kein Link-Element gerendert.
- Das Medienmodell unterstützt Bilder, Videos, GIFs und spätere Demo-Links.
- Bis echte Medien geliefert werden, werden lokale, neutrale und eindeutig austauschbare Mockup-Platzhalter verwendet.

### 6.3 Code-Animation

Das Homepage-Bento zeigt einen kurzen TypeScript-/React-Code-Gag, der CV, Projekte und Reisen zu einem Bento-Portfolio zusammensetzt.

- Schreiben: ungefähr 35 ms pro Zeichen
- Haltephase nach vollständigem Code: ungefähr 2800 ms
- Löschen: ungefähr 20 ms pro Zeichen
- Pause vor Neustart: ungefähr 600 ms
- Die Animation läuft nur, solange die Karte sichtbar ist.
- Bei reduzierter Bewegung wird der vollständige Code statisch dargestellt.

## 7. Reisen und Galerie

### 7.1 Autorenstruktur und Datenschutz

Reisefotos dürfen nicht in das öffentliche Git-Repository gelangen. Die lokale Autorenstruktur lautet:

```text
content/gallery/
└── <year>/
    └── <country-slug>/
        └── <place-or-trip-slug>/
            ├── _meta.json
            ├── 01-cover.jpg
            └── 02-example.jpg
```

- Bilddateien und generierte Derivate werden per `.gitignore` ausgeschlossen.
- `_meta.json`, Dokumentation und leere Strukturhalter dürfen versioniert werden.
- Mehrere Reisen an denselben Ort im selben Jahr erhalten eindeutige Slug-Suffixe, etwa `new-york-spring`; der sichtbare Name bleibt über Metadaten „New York“.
- Originale müssen außerhalb von Git gesichert und vor lokalem Produktionsbuild beziehungsweise Deployment bereitgestellt werden.
- Neue Reisen erscheinen erst nach erneutem Build und Deployment.
- Es gibt kein CMS und keinen Upload zur Laufzeit.
- Auf der Website ausgelieferte Derivate sind naturgemäß öffentlich abrufbar; nur Originale und Repository-Historie bleiben privat.

### 7.2 Metadaten und Sortierung

`_meta.json` unterstützt:

- lokalisierte Namen für Land und Ort
- Reisedatum
- optionales Cover
- optionale Reihenfolge
- `collapsed: true | false | "auto"`
- optionale Layoutüberschreibungen einzelner Bilder

Defaults:

- Jahre absteigend
- Reisen innerhalb eines Jahres nach Reisedatum absteigend, danach alphabetisch
- Bilder nach numerischem Dateipräfix, danach Dateiname
- erstes Bild als Cover
- mehr als sechs Bilder: zusammengefasste Ortskarte wie im China-Beispiel
- bis einschließlich sechs Bilder: direkte Bento-Vorschau
- `collapsed` überschreibt die Automatik pro Reise

### 7.3 Bildverarbeitung und Darstellung

- Unterstützte Eingaben in Version 1: JPEG, PNG, WebP und AVIF.
- HEIC/HEIF wird mit verständlicher Konvertierungsanweisung abgelehnt.
- Eine Build-Vorbereitung rotiert anhand der Bildorientierung, entfernt EXIF/GPS, begrenzt die lange Kante ohne Upscaling auf 2400 px und erzeugt optimierte WebP-Derivate.
- Ein Manifest enthält URL, Breite, Höhe, Seitenverhältnis, Jahr, Land, Ort und stabile ID.
- Bento-Größen werden deterministisch aus Orientierung und Position abgeleitet; Metadaten dürfen sie überschreiben.
- Karten dürfen mit `object-cover` beschneiden.
- Fotos bleiben farbig.
- Die Lightbox zeigt das vollständige Seitenverhältnis und unterstützt Pfeile, Escape, Buttons und Swipe.
- Es gibt keine sichtbaren Captions.
- Lokalisierte Standard-Alttexte werden aus Ort, Land, Jahr und Bildindex erzeugt; manuelle Alttexte bleiben optional.
- Einzelne Lightbox-Bilder benötigen in Version 1 keine eigene URL; Reiseansichten sind direkt verlinkbar.

### 7.4 Fehler- und Leerzustände

- Fehlt der gesamte private Medienordner, bleibt der Build erfolgreich und zeigt einen neutralen Reise-Platzhalter.
- Existieren Metadaten ohne Bilder, doppelte Slugs, ungültige Cover oder nicht unterstützte Dateien, schlägt die Vorbereitung mit einer verständlichen Fehlermeldung fehl.
- Eine Reise mit genau einem Bild bleibt als gültige Einzelkarte sichtbar.

## 8. Kontakt und Social Media

### 8.1 Kontakt

- Die Kontakt-Bento ist ein visueller Einstieg und öffnet die route-basierte Vollbildansicht; das vollständige Formular liegt nicht dauerhaft im kompakten Homepage-Raster.
- Felder bleiben: Name, E-Mail, Betreff und Nachricht.
- `/api/contact`, reCAPTCHA v3, SMTP/Nodemailer, Betreiberbenachrichtigung und Besucherbestätigung bleiben funktional unverändert.
- Zieladresse ist `jb@joelbakirel.de`.
- Das reCAPTCHA-Script wird erst geladen, wenn die Kontaktansicht geöffnet wird.
- Lade-, Erfolgs- und Fehlerzustände sind deutlich, lokalisiert und über eine Live-Region angekündigt.

### 8.2 Social-Karten

- Eigene Icon-Bentos: GitHub und LinkedIn.
- Die Kontakt/E-Mail-Bento erfüllt zugleich die E-Mail-Funktion und öffnet das Kontaktformular.
- Es gibt kein separates Repository-Bento.
- GitHub und LinkedIn öffnen in einem neuen Tab.
- Sichtbarer Inhalt ist jeweils nur das Icon; zugänglicher Name und Ziel bleiben im Markup vorhanden.
- LinkedIn verwendet im Hover-/Fokuszustand LinkedIn-Blau.
- GitHub verwendet themeabhängig Schwarz beziehungsweise Weiß.
- Kontakt/E-Mail verwendet den neutralen Grundstil mit Indigo-Fokus.

## 9. Internationalisierung, SEO und Recht

- Deutsch und Englisch bleiben vollständig gleichwertig.
- Sprachwechsel erhält die aktuelle Route und geöffnete Vollbildansicht.
- UI-Texte liegen in den vorhandenen `messages/de.json` und `messages/en.json`.
- Inhaltsdaten mit längeren Texten sind typisiert zweisprachig.
- Jede Route erhält lokalisierten Titel, Beschreibung, Canonical URL und `hreflang`-Alternativen.
- Open-Graph-Vorschauen entstehen mindestens für Homepage, CV, Projekte und Reisen.
- Sitemap und Robots-Metadaten werden ergänzt.
- Strukturierte Daten verwenden `Person` für Joel Bakirel und `CreativeWork` für veröffentlichte Projekte.
- Es werden kein Analytics, kein Tracking und keine zusätzlichen Cookies ergänzt.
- reCAPTCHA bleibt die gewünschte Ausnahme und wird weiterhin in der Datenschutzerklärung berücksichtigt.
- Rechtstexte werden nicht fachlich oder juristisch verändert.

## 10. Qualität und Abnahme

### 10.1 Mindeststandard

Eine formale WCAG-Zertifizierung ist nicht gefordert. Dennoch sind semantische Bedienelemente, sichtbare Fokuszustände, Modal-Fokusmanagement, Escape, ausreichender Kontrast, Screenreader-Namen und Reduced-Motion-Fallbacks verbindlicher technischer Mindeststandard.

### 10.2 Zielbrowser

- aktuelle Chrome-Versionen
- aktuelle Safari-Versionen
- iPhone Safari
- Android Chrome

### 10.3 Automatisierte Abnahme

- Lint und TypeScript ohne Fehler
- Unit-/Komponententests für Datenlogik, Animationzustände, Galerievalidierung und Formularzustände
- Browsertests für Modal-Routing, Zurück/Vorwärts, Deep Links, Locale-Wechsel, Theme, CV-Touchzustand, Projektansichten, Galerie-Lightbox und Kontakt
- visuelle Screenshots für Homepage und Vollbildansichten in Light/Dark auf Desktop und Mobil
- erfolgreicher Next.js-Produktionsbuild

## 11. Benötigte Assets und festgelegte Fallbacks

| Asset | Aktueller Zustand | Verhalten bis zur Lieferung |
| --- | --- | --- |
| Porsche-Next-WOFF2 | fehlt | Arial-Narrow-Fallback |
| persönliches Foto | fehlt | neutraler lokaler Platzhalter |
| Projektbilder/-videos | fehlen | neutrale Mockup-Platzhalter |
| Reisefotos | fehlen | leere/platzhaltende Reise-Bento |
| vier CV-Logos | in Git vorhanden, lokal gelöscht | gezielt wiederherstellen |
| CV-PDF | vorhanden, inhaltlich veraltet | aus aktualisierter CV-Ansicht neu erzeugen und ersetzen |

