# Sprint 1 Umsetzungsvorschau — Startseite blechziegel.de

> Stand 2026-05-16. **Noch keine Live-Aenderung.** Alle Vorschlaege in
> diesem Dokument sind PLAN — erst nach Freigabe werden Theme-Dateien
> angefasst und Shopify Admin API Writes ausgefuehrt.
>
> **Strategische Korrektur 2026-05-16:** Solarziegel-/Solardachziegel-Begriffe werden
> **nicht aktiv beworben**. Diese Suchintention meint haeufig stromerzeugende
> Dachziegel und passt nicht zu unserem Sortiment. Keine prominente sichtbare
> Abgrenzung im Hero, keine FAQ-Frage als Hauptblock, keine Meta Description
> mit negativer Abgrenzung. Stattdessen positive Positionierung auf
> „PV-Blechziegel aus Aluminium für Photovoltaik-Montage".

## 1. Datenbasis

Quellen aus `claude-seo/2026-05-16-semrush/`:

- `domain-overview-de.csv` (Semrush-Schaetzung)
- `backlinks-overview.csv` (Semrush-Schaetzung)
- `top-pages-de.csv` (Semrush-Schaetzung)
- `organic-keywords-de.csv` — **inline ueber Sprint-Briefing 2026-05-16 geliefert**
  (CSV-Export im Workspace noch ausstehend; Werte als Semrush-Schaetzung
  kennzeichnen, nicht als Google-Search-Console-Livewert)

Weitere Grundlage: `keyword-priorities.md`, `theme-url-mapping.md`,
`seo-target-pages.md`, `sprint-1-startseite-plan.md` (alle im Workspace).

## 2. Zielkeywords

Primaer (Position 24-26, „eine Stufe vor Seite 1"):

- `blech ziegel` (Pos 24, SV 70)
- `pv blechziegel` (Pos 26, SV 110)

Sekundaer (Position 56, Stretch):

- `blechziegel für photovoltaik` (Pos 56, SV 70)

Markenbegriffe (Hub-Wirkung):

- PV-Blechziegel · Blechziegel PV · PV-Dachziegel aus Aluminium ·
  Aluminium-Ersatzdachziegel für PV-Montage · Ersatzdachziegel für Photovoltaik ·
  Blechersatzziegel PV

## 3. Ist-Situation aus Semrush

| Metrik | Wert | Quelle |
|---|---|---|
| Sichtbarkeit Startseite `/` | 4 KW · 0 Traffic | `top-pages-de.csv` |
| Position `blech ziegel` | 24 (SV 70, URL `/`) | Sprint-Briefing |
| Position `pv blechziegel` | 26 (SV 110, URL `/`) | Sprint-Briefing |
| Position `blechziegel für photovoltaik` | 56 (SV 70, URL `/`) | Sprint-Briefing |
| Backlink-Status Domain | 21 Backlinks · 17 Ref Dom · **0 Follow** · AS 0 | `backlinks-overview.csv` |
| Vergleich blechziegel.com `/` | 29 KW · 117 Traffic | `top-pages-de.csv` |
| Vergleich blechziegel.com PDP Frankfurter Pfanne | 10 KW · 6 Traffic | `top-pages-de.csv` |

Interpretation: Startseite **indexiert**, **knapp vor Seite 1** auf zwei
relevanten KW — aber **0 Follow-Links** als Off-Page-Blocker. Onpage-Hebel
realistisch, Backlink-Programm muss parallel laufen.

## 4. Geplante Aenderungen

> Alle Punkte = PLAN. Keine Theme-Datei wird in diesem Schritt geaendert.

### 4.1 H1 (`sections/blechziegel-home.liquid`)

Aktueller H1 wird vor Umsetzung ausgelesen.

**Vorschlag:**

> PV-Blechziegel aus Aluminium für Photovoltaik-Montage

Begruendung: enthaelt beide Primaer-KW (`pv blechziegel`, indirekt
`blech ziegel`), umgeht „Solarziegel"-Begriff, ist ≤ 56 Zeichen.

### 4.2 Hero-Intro (`sections/blechziegel-home.liquid`)

**Vorschlag (positiv, ohne prominente Solarziegel-Abgrenzung):**

> PV-Blechziegel ersetzen den vorhandenen Dachziegel im Bereich der
> Solarmontage und schaffen eine stabile Grundlage für Dachhaken auf
> Ziegeldächern. Die Aluminium-Ersatzdachziegel sind für die Montage
> von Photovoltaikanlagen konzipiert und für viele gängige Dachziegelprofile
> erhältlich.

Begruendung: positive Produktpositionierung; Kern-KW „PV-Blechziegel",
„Aluminium-Ersatzdachziegel", „Photovoltaik-Montage", „Dachhaken",
„Ziegeldächer" sind enthalten. Keine „nicht…"-Aussage im Hero
(strategische Korrektur 2026-05-16).

### 4.3 Solarziegel-Abgrenzung — **gestrichen**

Der zuvor geplante zentrale Abgrenzungs-Block + das Snippet
`snippets/bz-pv-disclaimer.liquid` werden **nicht umgesetzt**. Grund: die
Begriffe „PV-Ziegel" / „Solarziegel" / „Solardachziegel" sollen nicht
aktiv beworben werden, weil ihre Suchintention haeufig stromerzeugende
Dachziegel meint. Eine prominente sichtbare Gegen-Abgrenzung wuerde
diese Begriffe semantisch sogar verstaerken und Nutzer mit falscher
Intention auf die Seite ziehen, die dann pogosticken.

Eine neutrale technische Erklaerung kann spaeter in einer
Ratgeber-Sub-Page (z. B. `/pages/ratgeber` oder einer Detail-Seite)
stehen, aber nicht im Startseiten-Hero oder als auffaelliger Block.

### 4.4 Interne Links

Plan: kontextuelle Text-Links auf der Startseite zu:

- **Braas-Collection** `/collections/braas` — Anker „PV-Blechziegel für Braas-Profile"
- **Nelskamp-Collection** `/collections/nelskamp` — Anker „PV-Blechziegel für Nelskamp-Profile"
- **Herstellerseite** `/pages/hersteller` — Anker „Alle unterstuetzten Hersteller im Ueberblick"
- **Ziegel-Finder** `/pages/ziegel-finder` — Anker „Ich kenne mein Profil nicht — Finder oeffnen"
- **Frankfurter Pfanne PDP** `/products/pv-dachziegel-frankfurter-pfanne` — Anker „PV-Blechziegel Frankfurter Pfanne ansehen"
- **Ratgeber** `/pages/ratgeber` — Anker „PV-Blechziegel: Material, Montage, Kompatibilitaet"

### 4.5 FAQ-Block (auf der Startseite)

Vorschlagsfragen (Frage 2 ersetzt nach strategischer Korrektur 2026-05-16):

1. Was ist ein PV-Blechziegel?
2. Warum wird bei der PV-Montage ein Aluminium-Ersatzdachziegel eingesetzt?
3. Wofür wird ein Aluminium-Ersatzdachziegel bei PV-Anlagen verwendet?
4. Welche Dachziegel-Profile gibt es?
5. Was tun, wenn ich mein Ziegelprofil nicht kenne?

Inhaltliche Leitlinien:

- Frage 2 erklaert positiv den Anwendungsfall (Dachhaken-Bereich, sichere PV-Montage,
  Ziegelbruch-Vermeidung). **Keine** Solarziegel-Abgrenzung in der Frage selbst.
- Frage 5 verlinkt aktiv auf `/pages/ziegel-finder`
- Frage 4 verlinkt auf `/pages/hersteller` + Braas/Nelskamp-Collection

### 4.6 Meta Title (Shopify Admin → Online Store Preferences)

**Vorschlag:**

> PV-Blechziegel aus Aluminium für Photovoltaik-Montage

Laenge: 56 Zeichen. Shopify haengt typischerweise nichts an (im Gegensatz
zu Page-Titles, wo „| Shop-Name" appended wird) — pruefen.

### 4.7 Meta Description (Shopify Admin → Online Store Preferences)

**Vorschlag:**

> PV-Blechziegel aus Aluminium für die sichere Montage von Photovoltaikanlagen auf Ziegeldächern. Ersatzdachziegel für Dachhaken, passend für viele Profile.

Laenge: 153 Zeichen. Positive Formulierung ohne negative Solarziegel-Abgrenzung
(strategische Korrektur 2026-05-16).

### 4.8 JSON-LD / strukturierte Daten — Pruefung

Read-only-Pruefung vor Sprint-1-Deploy:

- Organisation-Schema (Shop-Daten via `layout/theme.liquid` / `meta-tags.liquid`)
- WebSite-Schema mit SearchAction (Sitelinks-Searchbox-fragwuerdig fuer Shop, aber pruefen)
- FAQPage-JSON-LD passend zum neuen Startseiten-FAQ-Block
- BreadcrumbList auf Home nicht noetig

Validierung via Google Rich Results Test nach Umsetzung.

## 5. Konkrete Textvorschlaege (vollstaendig zur Freigabe)

| Element | Text |
|---|---|
| **H1** | PV-Blechziegel aus Aluminium für Photovoltaik-Montage |
| **Hero-Intro** | PV-Blechziegel ersetzen den vorhandenen Dachziegel im Bereich der Solarmontage und schaffen eine stabile Grundlage für Dachhaken auf Ziegeldächern. Die Aluminium-Ersatzdachziegel sind für die Montage von Photovoltaikanlagen konzipiert und für viele gängige Dachziegelprofile erhältlich. |
| **Solarziegel-Abgrenzung (separater Block)** | **entfaellt** — strategische Korrektur 2026-05-16, keine prominente Abgrenzung |
| **Meta Title** | PV-Blechziegel aus Aluminium für Photovoltaik-Montage |
| **Meta Description** | PV-Blechziegel aus Aluminium für die sichere Montage von Photovoltaikanlagen auf Ziegeldächern. Ersatzdachziegel für Dachhaken, passend für viele Profile. |

## 6. Risiken

- **Falsche Erwartung bei „PV-Ziegel" / „Solarziegel":** Nutzer landet, erwartet Strom, bounct → Pogosticking → CTR-Signal an Google
- **Marken-/Modellnennung sauber formulieren:** keine Aussage „kompatibel mit allen Bramac-Profilen", wenn nur ein Subset abgedeckt ist
- **Keine Behauptung, dass der Blechziegel Strom erzeugt** — Pflicht-Abgrenzung ist Schutz
- **Keine Conversion-Verschlechterung im Hero** — wenn Pflicht-Abgrenzung zu prominent ist, kann sie die Hauptbotschaft verwaessern; Mobile-Test wichtig
- **Off-Page-Limit:** 0 Follow-Links → Onpage allein wird nicht zu Top-10-Ranking reichen; Backlink-Programm parallel
- **Stoerkeyword `allersberger straße 185 dhl`** bestaetigt auf 3 URLs (`/pages/montageanleitung-mit-dachhaken` Pos 54, `/collections/nelskamp` Pos 75, `/pages/hersteller` Pos 87) — Quelle in Sprint 1 nur lokalisieren, in Sprint 2 reduzieren

## 7. Nicht-Ziele

- Keine Aenderung an Preisen, Varianten, Checkout-Logik, Steuerlogik, Versandlogik
- Keine Optimierung auf Solarziegel-/Solardachziegel-Suchintention
- Keine englische Lokalisierung (`/en/` bleibt noindex bis echte Uebersetzung)
- Keine Layout-Refactorings ausserhalb der Startseite
- Keine Shopify-Admin-API-Writes auf Produkte oder Collections im Rahmen von Sprint 1 (nur Page-SEO-Felder fuer Home)
- Keine Aenderung am Stoerkeyword in Sprint 1 — nur Inventarisierung

## 8. Pruefschritte mit Shopify CLI und Playwright (nach Umsetzung)

### Shopify CLI

- `shopify theme check` auf `sections/blechziegel-home.liquid` und ggf. neuem
  Snippet `snippets/bz-pv-disclaimer.liquid` — keine NEUEN Errors/Warnings
  durch unsere Edits

### Playwright

- **Desktop** (1440×900):
  - `/` rendert vollstaendig, H1 sichtbar, Hero-Intro lesbar
  - Pflicht-Abgrenzung sichtbar ohne Scroll-Aufwand
  - 6 interne Links klickbar, fuehren zu korrekten URLs
  - FAQ-Block faltbar / Accordion funktioniert
  - JSON-LD vorhanden (DOM-Check)

- **Mobile** (390×844 iPhone-14-Frame):
  - H1 nicht abgeschnitten
  - Hero-Intro lesbar ohne horizontalen Scroll
  - Pflicht-Abgrenzung sichtbar
  - FAQ-Block tap-bar
  - Bestseller-Section funktioniert, Sticky-CTA (falls vorhanden) nicht ueberlagert

### Manuelle Pruefungen

- `<title>`, `<meta name="description">`, `<link rel="canonical">` im HTML
- Genau eine `<h1>` pro Page
- JSON-LD via Google Rich Results Test (Organisation + FAQPage)
- Keine 404-Links

## 9. Freigabehinweis

- Noch **keine Live-Aenderung**.
- Erst nach Freigabe Theme-Dateien anfassen.
- Reihenfolge: Theme-PR auf `main` → Auto-Sync zu Shopify → Admin-API-Set fuer Page-SEO-Felder → Playwright-Verifikation → Fix-Mail an info@blechziegel.de.
- Stoerkeyword-Quelle in Sprint 1 nur read-only inventarisieren; Aenderung in Sprint 2.
