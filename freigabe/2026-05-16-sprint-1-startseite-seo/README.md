# Sprint 1 Startseite SEO-Optimierung — Freigabe

**Status:** PENDING
**Live-Ziel:** https://blechziegel.de/
**Preview:** [`preview.html`](preview.html) (lokal oeffnen)
**Plan:** `claude-seo/2026-05-16-semrush/sprint-1-umsetzungsvorschau.md`

> Hinweis Repo-Hygiene: laut CLAUDE.md gehoeren Freigabe-Previews
> eigentlich in `theme-workspace/freigabe/`. Dieser Ordner liegt auf
> expliziten User-Auftrag im Repo, damit ChatGPT/externe Tools die
> Preview ueber stabile GitHub-Raw-URLs lesen koennen — analog zu
> `claude-seo/`. Default-Regel fuer kuenftige Freigaben bleibt
> `theme-workspace/freigabe/`.

## 1. Ziel der Preview

Visualisiert die geplanten Aenderungen an der Startseite ohne Live-Eingriff:

- H1: „PV-Blechziegel aus Aluminium für Photovoltaik-Montage"
- Hero-Intro mit Pflicht-Abgrenzung
- Solarziegel-Abgrenzungs-Block
- Hub-Karten (6 interne Links zu Braas/Nelskamp/Hersteller/Finder/Frankfurter Pfanne/Ratgeber)
- FAQ mit 5 Fragen
- Meta-Title- + Meta-Description-Vorschau (SERP-Snippet)
- Datenbasis-Hinweis (Semrush-Schaetzung)

## 2. Nicht-Ziel

- Keine Optimierung auf stromerzeugende Solarziegel / Solardachziegel
- Keine Layout-Refactorings ausserhalb der Startseite
- Keine englische Lokalisierung
- Keine Preisaenderung, Variantenaenderung, Checkout-/Steuer-/Versandlogik

## 3. Datenbasis

- `claude-seo/2026-05-16-semrush/domain-overview-de.csv` (Semrush-Schaetzung)
- `claude-seo/2026-05-16-semrush/backlinks-overview.csv` (Semrush-Schaetzung) — 0 Follow-Links bestaetigt
- `claude-seo/2026-05-16-semrush/top-pages-de.csv` (Semrush-Schaetzung) — `/` mit 4 KW + 0 Traffic
- Organic-Keywords inline aus Sprint-Briefing 2026-05-16 (CSV-Export noch ausstehend):
  - `blech ziegel` Pos 24 (SV 70)
  - `pv blechziegel` Pos 26 (SV 110)
  - `blechziegel für photovoltaik` Pos 56 (SV 70)

Alle Werte sind **Semrush-Schaetzung**, nicht Google-Search-Console-Livewert.

## 4. Betroffene Live-Seite

- URL: `/`
- Template: `templates/index.json` → `sections/blechziegel-home.liquid`

## 5. Geplante spaetere Dateien (falls freigegeben)

- `sections/blechziegel-home.liquid` — H1, Hero-Intro, Hub-Karten, FAQ-Block
- ggf. `snippets/bz-pv-disclaimer.liquid` (neu) — wiederverwendbares Abgrenzungs-Snippet
- `layout/theme.liquid` / `snippets/meta-tags.liquid` — **nur falls** Meta-Title/JSON-LD-Struktur technisch dort gesetzt werden muss; Meta-Title/Description sonst ueber Shopify Admin → Online Store Preferences

Meta-Title und Meta-Description werden ueber Shopify Admin gepflegt
(`metafieldsSet` oder Shop-Settings), nicht im Theme-Code.

## 6. Was in dieser Phase NICHT geaendert wurde

- Keine Theme-Dateien (`sections/`, `snippets/`, `templates/`, `layout/`, `assets/`)
- Keine Shopify Admin API Writes
- Keine Produktdaten / Collection-Daten
- Keine Preise
- Keine Varianten
- Kein Checkout
- Keine Steuerlogik
- Keine Versandlogik

## 7. Pruefanweisung

1. Doppelklick auf `freigabe/2026-05-16-sprint-1-startseite-seo/preview.html`
2. Pruefen **Desktop** (oben in der Seite):
   - H1 + Hero-Intro lesbar, Pflicht-Abgrenzung sichtbar
   - 2 CTAs mit URL-Pillen (`/pages/ziegel-finder`, `/collections/all`)
   - Hub-Karten 3×2 (Braas, Nelskamp, Hersteller, Finder, Frankfurter Pfanne, Ratgeber)
   - FAQ-Accordion aufklappbar
   - SERP-Snippet im Google-Stil
3. Pruefen **Mobile-Frame** (unten in der Seite, 390 × 844 iPhone):
   - H1 nicht abgeschnitten
   - Hero-Intro lesbar ohne horizontalen Scroll
   - Pflicht-Abgrenzung sichtbar
   - Karten gestackt
   - FAQ tap-bar
4. Fachliche Korrektheit:
   - **„Keine stromerzeugenden Solarziegel"** muss sichtbar bleiben
   - keine Behauptung, dass der Blechziegel Strom erzeugt
   - Hersteller-/Modellnennung sauber (keine falschen Kompatibilitaets-Versprechen)
5. Verkaufsstaerke:
   - Hero-CTA bleibt prominent (Pflicht-Abgrenzung darf nicht die Hauptbotschaft verwaessern)
   - Vertrauenssignal (Trust-Facts: Material, Made in Germany, 146 Profile)

## 8. Rueckweg

- **Wenn abgelehnt:** keine Live-Aenderung, Preview ueberarbeiten und Status `PENDING` halten
- **Wenn freigegeben:**
  1. Theme-PR auf `main` mit Aenderung in `sections/blechziegel-home.liquid` + optional `snippets/bz-pv-disclaimer.liquid`
  2. Auto-Sync zu Shopify
  3. Admin-API-Set fuer Page-SEO-Felder (Title + Description)
  4. Playwright-Verifikation (Desktop + Mobile)
  5. Fix-Mail an info@blechziegel.de (laut CLAUDE.md-Pflicht)
  6. `freigabe/index.html` auf `LIVE` aktualisieren mit Commit-SHA + Live-URL

## 9. Stoerkeyword (Sprint 2)

Das in Sprint 1 nur inventarisierte Stoerkeyword `allersberger straße 185 dhl`
(bestaetigt Pos 54/75/87 auf 3 URLs) wird in einem separaten Sprint
adressiert — siehe `claude-seo/2026-05-16-semrush/keyword-priorities.md`.
