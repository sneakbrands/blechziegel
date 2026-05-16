# Sprint 1 — Startseite SEO-Optimierung blechziegel.de

## Ziel

Startseite von Position 24/26 Richtung Top 10 bringen fuer:
- `blech ziegel` (aktuell Pos 24, SV 70)
- `pv blechziegel` (aktuell Pos 26, SV 110)
- `blechziegel für photovoltaik` (aktuell Pos 56, SV 70)

Sekundaeres Ziel: klare Positionierung als „PV-Blechziegel / Aluminium-Ersatzdachziegel
fuer PV-Montage" — Solarziegel-Abgrenzung sichtbar.

## Nicht-Ziel

Keine Optimierung auf stromerzeugende Solarziegel oder Solardachziegel.

## Datenbasis

Stand 2026-05-16, Workspace `claude-seo/2026-05-16-semrush/`:

- `competitors.csv` (gefuellt) — Wettbewerber-Rollen definiert
- `theme-url-mapping.md` (vollstaendig) — Technische Karte aller Code-Hooks
- `seo-target-pages.md` (gefuellt) — Zielseiten-Matrix
- `keyword-priorities.md` (aktualisiert mit P1/P2/P3 + Semrush-Datenbasis + Top-Chancen)
- `domain-overview-de.csv` **gefuellt** — Organic + Ads je Domain
- `backlinks-overview.csv` **gefuellt** — Backlinks + Ref-Dom + Follow/Nofollow + AS/TS
- `top-pages-de.csv` **gefuellt** — 19 Top-Pages ueber 5 Domains
- `organic-keywords-de.csv` — **inline ueber Sprint-Briefing geliefert** (9 priorisierte KW + Stoerkeyword); CSV-Export im Workspace noch ausstehend

**Konsequenz:** Sprint 1 ist datenbasiert auf Domain/Backlink/Top-Page-Ebene.
Konkrete Keyword-Position-Empfehlungen folgen nach Keyword-Export.

## SEO-Benchmark (Semrush-Schaetzung, Stand 2026-05-16)

| Domain | Rolle | Organic KW | Organic Traffic | Follow-Links | AS |
|---|---|---:|---:|---:|---:|
| **blechziegel.de** | owner | **17** | **0** | **0** ⚠ | 0 |
| blechziegel.com | Namespace-Wettbewerber | 126 | 131 | 3 | 0 |
| ziegel-koenig.com | Ziegel-Handel / Offpage-Benchmark | 18 | 195 | **145** | **8** |
| bau.shop | Bau-Marktplatz (Kategorie-Benchmark `/Blechziegel`: 30 KW / 382 Traffic) | 2.038 | 4.914 | 17.789 | 10 |
| venturama-solar.de | PV-/Solarmontage-Spezialist | 4.418 | 17.286 | 544 | 28 |

## Strategische Schlussfolgerungen (datenbasiert)

1. **blechziegel.de organisch quasi unsichtbar:** 17 KW, 0 geschaetzter Traffic auf jeder bekannten Top-Page. Indexierung steht, aber Position+Snippet bringen keine Klicks (Semrush-Schaetzung).
2. **Welche Wettbewerber wofuer relevant sind (bestaetigt):**
   - `bau.shop/Blechziegel` (**30 KW / 382 Traffic**) = Kategorie-Benchmark: zeigt, welche Suchintention bei „Blechziegel"-Suchen aktuell bedient wird
   - `blechziegel.com/` (**29 KW / 117 Traffic**) = Namespace-Wettbewerber Home
   - `blechziegel.com/products/pv-dachziegel-frankfurter-pfanne` (**10 KW / 6 Traffic**) = direkter PDP-Benchmark fuer unsere Frankfurter-Pfanne-PDP
   - `venturama-solar.de` (4.418 KW total) = breiter PV-/Solarmontage-Markt-Benchmark
   - `ziegel-koenig.com` (145 Follow-Links / AS 8) = Backlink-Profil-Benchmark fuer Ziegel-Handel-Domain
3. **Benchmark-Seiten:** s. Tabelle in `keyword-priorities.md` (Top-Pages).
4. **Groesste Backlink-Luecke (bestaetigt):** blechziegel.de hat **0 Follow-Links bei 21 Backlinks** — strukturelles Ranking-Blockade. ziegel-koenig.com im selben Vertical erreicht 145 Follow-Links + AS 8.
5. **Groesste Content-/Keyword-Luecke:** noch nicht detailliert pro KW — wartet auf `organic-keywords-de.csv`. Pre-Hypothese: „PV-Blechziegel"-Cluster + Hersteller-/Modell-Cluster.
6. **Warum „PV-Ziegel" / „Solarziegel" nicht unkritisch:** Semantik-Konflikt — die Begriffe
   bedienen in Wirklichkeit zwei verschiedene Suchintentionen (stromerzeugende Solarziegel
   vs. Aluminium-Ersatzdachziegel). Ohne Pflicht-Abgrenzung im Snippet faellt der Traffic-Wert auf 0,
   weil Nutzer sofort wieder gehen ("Pogosticking", schlechtes Snippet-CTR-Signal an Google).

## Betroffene Seite

- URL: `/`
- Template: `templates/index.json`
- Section: `sections/blechziegel-home.liquid`
- Optional auch beruehrt: `layout/theme.liquid` (Meta-Tags + JSON-LD-Struktur), `snippets/meta-tags.liquid`

## Zielkeywords (datenbasiert)

Primaer (Position 24-26, „eine Stufe vor Seite 1"):
- `blech ziegel` (Pos 24, SV 70)
- `pv blechziegel` (Pos 26, SV 110)

Sekundaer (Position 51-60, Stretch-Goals):
- `blechziegel für photovoltaik` (Pos 56, SV 70)

Markenbegriffe (Hub-Linking, sollen Startseite mitziehen):
- PV-Blechziegel · Blechziegel PV · PV-Dachziegel aus Aluminium · Aluminium-Ersatzdachziegel für PV-Montage · Ersatzdachziegel für Photovoltaik · Blechersatzziegel PV

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
- **Bestaetigtes Off-Page-Risiko:** 0 Follow-Links bei blechziegel.de — ohne paralleles Backlink-Programm bleibt die Sprint-1-Onpage-Arbeit ohne Reichweiten-Hebel (Semrush-Schaetzung)

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
