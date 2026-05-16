# Sprint 1 — Startseite SEO-Optimierung blechziegel.de

## Ziel

Startseite klar auf PV-Blechziegel / Aluminium-Ersatzdachziegel für PV-Montage positionieren.

## Nicht-Ziel

Keine Optimierung auf stromerzeugende Solarziegel oder Solardachziegel.

## Datenbasis

Stand 2026-05-16, Workspace `claude-seo/2026-05-16-semrush/`:

- `competitors.csv` (gefuellt) — Wettbewerber-Rollen definiert
- `theme-url-mapping.md` (vollstaendig) — Technische Karte aller Code-Hooks
- `seo-target-pages.md` (gefuellt) — Zielseiten-Matrix
- `keyword-priorities.md` (qualitativ gefuellt + P1/P2/P3) — Strategiegrundlage
- `domain-overview-de.csv`, `backlinks-overview.csv`, `top-pages-de.csv`,
  `organic-keywords-de.csv` — **leer / Platzhalter**, Semrush-Zahlen noch nicht importiert

**Konsequenz:** Sprint 1 priorisiert auf strategischer Ebene (Positionierung +
Pflicht-Abgrenzung + Hub-Verlinkung). Eine zweite Priorisierungs-Runde nach
Semrush-Daten-Import ist eingeplant.

## SEO-Benchmark (qualitativ, ohne Semrush-Zahlen)

| Domain | Rolle | Was wir vergleichen wollen | Aktuell bestaetigbar |
|---|---|---|---|
| blechziegel.de | owner | -- | nein (Daten fehlen) |
| blechziegel.com | Namespace-Wettbewerber | Produktnaehe, Marken-Konflikt-Risiko | nein |
| ziegel-koenig.com | Ziegel-Handel | Marken-/Produktpositionierung, Backlink-Profil | nein |
| bau.shop | Bau-Marktplatz | Kategorie-Benchmark (Blechziegel-Kategorie) | nein |
| venturama-solar.de | PV-/Solarmontage | Markt-/Montage-Benchmark, breiter Solar-Kontext | nein |

> Numerische Werte (organische Keywords, Traffic, Cost, Ads, Backlinks, Authority Score)
> sind aktuell **nicht bestaetigbar** — alle CSVs sind Platzhalter.
> „Ich kann das nicht bestaetigen, weil die Datenquellen noch leer sind."

## Strategische Schlussfolgerungen (qualitativ)

1. **Warum blechziegel.de organisch wahrscheinlich schwaecher ist:** kann **nicht bestaetigt** werden ohne Semrush-Werte. Hypothesen-frei.
2. **Welche Wettbewerber wofuer relevant sind:**
   - `bau.shop/Blechziegel` als direkter Kategorie-Benchmark (Sortimentsbreite + Filter + Listings)
   - `blechziegel.com` als thematischer Namespace-Wettbewerber (Marken-Konflikt-Risiko)
   - `venturama-solar.de` als breiter PV-/Solarmontage-Markt-Benchmark
   - `ziegel-koenig.com` als Backlinkprofil-/Produkt-Positionierungs-Benchmark
3. **Benchmark-Seiten:** zu identifizieren nach Top-Pages-Export
4. **Groesste Content-/Keyword-Luecke:** zu identifizieren nach Organic-Keywords-Export +
   Keyword-Gap-Analyse — Pre-Hypothese laut Agent-Spec: „PV-Blechziegel"-Cluster + Hersteller-/Modell-Cluster
5. **Groesste Backlink-Luecke:** zu identifizieren nach Backlinks-Export
6. **Warum „PV-Ziegel" / „Solarziegel" nicht unkritisch:** Semantik-Konflikt — die Begriffe
   bedienen in Wirklichkeit zwei verschiedene Suchintentionen (stromerzeugende Solarziegel
   vs. Aluminium-Ersatzdachziegel). Ohne Pflicht-Abgrenzung im Snippet faellt der Traffic-Wert auf 0,
   weil Nutzer sofort wieder gehen ("Pogosticking", schlechtes Snippet-CTR-Signal an Google).

## Betroffene Seite

- URL: `/`
- Template: `templates/index.json`
- Section: `sections/blechziegel-home.liquid`
- Optional auch beruehrt: `layout/theme.liquid` (Meta-Tags + JSON-LD-Struktur), `snippets/meta-tags.liquid`

## Zielkeywords

- PV-Blechziegel
- Blechziegel PV
- PV-Dachziegel aus Aluminium
- Aluminium-Ersatzdachziegel für PV-Montage
- Ersatzdachziegel für Photovoltaik
- Blechersatzziegel PV

## Pflicht-Abgrenzung

> „Unsere PV-Blechziegel sind keine stromerzeugenden Solarziegel, sondern
> Aluminium-Ersatzdachziegel für die sichere Montage von Photovoltaikanlagen
> auf Ziegeldächern."

## Empfohlene Änderungen (Plan, **noch nicht umsetzen**)

1. **H1 pruefen / ggf. schaerfen**
   - aktuelles H1-Pattern aus `sections/blechziegel-home.liquid` ablesen (read-only)
   - Zielmuster: „PV-Blechziegel aus Aluminium — Ersatzdachziegel fuer die sichere PV-Montage"
   - Kriterien: enthaelt Kernkeyword, vermeidet „Solarziegel"-Verwechslung, ≤ 60 Zeichen

2. **Hero-Intro praezisieren**
   - 2-3 Saetze, die Produkt + Anwendung + Abgrenzung in den ersten 280 Zeichen klar machen
   - Pflicht-Abgrenzung als zweiter Satz oder als kurzer Sub-Block direkt unter Hero

3. **FAQ-Block ergaenzen** (auf der Startseite, nicht nur in den Page-Snippets)
   - „Was ist ein PV-Blechziegel?"
   - „Ist ein PV-Blechziegel das gleiche wie ein Solarziegel?"
   - „Welche Profile sind passend?"
   - „Was unterscheidet einen Blechziegel von einem stromerzeugenden Solarziegel?"
   - FAQ-JSON-LD pruefen (FAQPage-Schema)

4. **Interne Links zu Herstellerseiten und Ziegel-Finder staerken**
   - Hub-Layout: Hero-CTA „Profil identifizieren" → `/pages/ziegel-finder`
   - Sub-Block „Top-Hersteller": Karten zu `/collections/braas`, `/collections/nelskamp`, `/collections/creaton`, `/collections/bramac`
   - Bestseller-Section (bereits vorhanden) auf passende Produkte pruefen

5. **Link zur Frankfurter Pfanne als wichtiges Produkt pruefen**
   - Frankfurter Pfanne hat hoechsten Lagerbestand (1.359 Stk., Stand 2026-05-13) und ist das bekannteste Profil
   - Eigener Karten-Block „Beliebtester Blechziegel: Frankfurter Pfanne" → `/products/pv-dachziegel-frankfurter-pfanne`

6. **Meta Title und Meta Description pruefen**
   - Pflege via Shopify Admin (`global.title_tag`/`description_tag` auf Page-/Shop-Settings)
   - Vorschlag Title: „PV-Blechziegel aus Aluminium fuer Photovoltaik-Montage | blechziegel.de" (~64 chars)
   - Vorschlag Description: „Aluminium-Ersatzdachziegel fuer die sichere Montage von Photovoltaikanlagen auf Ziegeldaechern. 146 Profile, made in Germany. Kein stromerzeugender Solarziegel." (~163 chars — ggf. um 5-8 Zeichen kuerzen)

7. **JSON-LD / strukturierte Daten pruefen**
   - Organisation-Schema (Shop-Daten), WebSite-Schema mit SearchAction (Sitelinks-Searchbox)
   - FAQ-JSON-LD bei FAQ-Block
   - BreadcrumbList ist auf PDPs schon da — Startseite braucht keine Breadcrumbs

8. **Mobile Darstellung beachten**
   - Hero-Headline darf auf 360-px-Breite nicht abreissen
   - Pflicht-Abgrenzung muss sichtbar bleiben (nicht in Accordion versteckt)
   - Sticky-Add-to-Cart ist auf Home nicht relevant

## Risiken

- **Falsche Erwartung bei „PV-Ziegel":** Nutzer landet, erwartet Strom, bounct → CTR-Signal an Google
- **Marken-/Modellnennung sauber formulieren:** keine Aussage „kompatibel mit allen Bramac-Profilen" wenn nur ein Subset abgedeckt ist
- **Keine Behauptung, dass der Blechziegel Strom erzeugt** — Pflicht-Abgrenzung ist Schutz
- **Keine Conversion-Verschlechterung im Hero** — wenn die Pflicht-Abgrenzung zu prominent ist, kann das die Hauptbotschaft verwaessern; Test in Mobile-Frame

## Pruefpunkte nach spaeterer Umsetzung

- Shopify Theme Check (keine NEUEN Errors/Warnings durch die Aenderungen)
- Playwright Desktop (Hero-Render, FAQ-Klappverhalten, interne Link-Klicks)
- Playwright Mobile (360 px, 390 px, 414 px Viewport)
- H1 sichtbar (genau eine `<h1>` pro Page, enthaelt Zielkeyword)
- Meta Title vorhanden (< 60 Zeichen, eindeutig)
- Meta Description vorhanden (120-160 Zeichen, Pflicht-Abgrenzung)
- Canonical vorhanden (`<link rel="canonical" href="https://blechziegel.de/">`)
- Interne Links sichtbar (Ziegel-Finder, Hersteller, Frankfurter Pfanne)
- Keine Layout-Brueche (Hero, FAQ, Bestseller-Section, Footer)
- Keine Aenderung an Preis, Varianten, Checkout, Steuer, Versand
- JSON-LD valid via Google Rich Results Test (Organisation, WebSite, FAQPage)

## Abhaengigkeiten

- **Semrush-Daten-Import** (Domain-Overview + Top-Pages + Organic-Keywords)
  fuer die zweite Priorisierungs-Runde, damit die Sprint-1-Massnahmen
  datenbasiert validiert werden (z. B. ob das Frankfurter-Pfanne-Card aktuelle
  Sichtbarkeit unterstuetzt oder nur Annahme ist)
- **GSC- + GA4-Zugriff** fuer reale CTR/Click/Impression-Werte als Erfolgsmessung
  nach Sprint 1

## Aufgaben-Liste (Sprint-1-Tickets — alle Status `PLAN`, keine Umsetzung)

| # | Task | Datei/Quelle | Owner | Status |
|---|---|---|---|---|
| 1.1 | H1 ablesen + neuer Vorschlag | `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.2 | Hero-Intro praezisieren | `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.3 | Pflicht-Abgrenzungs-Snippet anlegen + einbinden | neu `snippets/bz-pv-disclaimer.liquid` | Claude | PLAN |
| 1.4 | FAQ-Block auf Startseite + FAQPage-JSON-LD | `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.5 | Hub-Links zu Ziegel-Finder + 4 Herstellern | `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.6 | Karten-Block „Frankfurter Pfanne" | `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.7 | Meta Title (Shopify Admin) | Shop-Settings / Online Store Preferences | User/Claude | PLAN |
| 1.8 | Meta Description (Shopify Admin) | Shop-Settings / Online Store Preferences | User/Claude | PLAN |
| 1.9 | JSON-LD Organisation + WebSite + FAQPage pruefen | `layout/theme.liquid` + `sections/blechziegel-home.liquid` | Claude | PLAN |
| 1.10 | Playwright-Snapshots Desktop + Mobile vor Live | extern | Claude | PLAN |

## Out of Scope

- Preise, Varianten, Checkout-Logik, Steuerlogik, Versandlogik
- Theme-Layout-Refactoring
- Englische Lokalisierung (`/en/` ist noindex bis echte Uebersetzung)
- Live-Shopify-Admin-API-Writes auf Produkte/Collections im Rahmen von Sprint 1
- Neue Produkte oder Produktbilder
