# COLL-1 Live-Verifikation + Strategie-Check „Hersteller als Basis"

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Methode:** Playwright (Chromium) gegen Live-Site mit Cache-Buster · DOM/Head/JSON-LD-Probe · Cropped Screenshots · `curl`-Cross-Check
**Test-Skripte:** [`scripts/coll-test/coll.mjs`](../scripts/coll-test/coll.mjs) + [`scripts/coll-test/verify.mjs`](../scripts/coll-test/verify.mjs)

---

## 1. Geprüfte Seiten

5 Live-Collections — `pv-dachziegel`, `braas`, `bramac`, `creaton`, `nelskamp` — je Desktop (1440×900) + Mobile (iPhone 13).

## 2. Methodik

- **Live verifiziert:** DOM-Probe (title, meta-count, JSON-LD-Types, BreadcrumbList-Items, sichtbare Breadcrumb-Bbox), Cropped-Screenshot, `curl`-Header-Check
- **Aus Code abgeleitet:** Liquid-Logik in `layout/theme.liquid` + `sections/blechziegel-collection.liquid`
- **Nicht sicher verifizierbar:** CDN-Edge-Caching auf allen globalen Knoten, Google-Indexierungs-Auswirkung — **„Ich kann das nicht bestätigen"**

---

## 3. COLL-1-Verifikation

### 3.1 Meta-Description

| Collection | meta name=description | og:description | Quelle |
|---|---|---|---|
| pv-dachziegel | 1 ✓ | 1 ✓ (nach Fix) | Shopify (admin) |
| braas | 1 ✓ | 1 ✓ (nach Fix) | Liquid-Fallback |
| bramac | 1 ✓ | 1 ✓ (nach Fix) | Liquid-Fallback |
| creaton | 1 ✓ | 1 ✓ (nach Fix) | Liquid-Fallback |
| nelskamp | 1 ✓ | 1 ✓ (nach Fix) | Liquid-Fallback |

**Befund vor Fix:** Auf Hersteller-Collections wurden **2 og:descriptions** ausgegeben (Shopify-Default + unser Fallback). **Live verifiziert via curl** — Shopify emittiert immer eine og:description (mit Shop-Fallback wenn keine collection.description gepflegt ist). Unser Fallback hat zusätzlich eine emittiert → Duplikat.

**Fix in Commit `cdaef01`:** Im `layout/theme.liquid`-Fallback nur noch `<meta name="description">` ausgeben, og:description komplett Shopify überlassen. **Live verifiziert nach Fix:** je 1× pro Tag.

### 3.2 CollectionPage-JSON-LD

Alle 5 Collections haben jetzt `CollectionPage` im `@graph`. Live-Probe:

| Collection | name | description (kurz) | about (Brand) |
|---|---|---|---|
| pv-dachziegel | „PV Dachziegel" | Admin-Description | — (kein Brand) |
| braas | „PV-Dachziegel Braas" | Brand-Fallback | „Braas" ✓ |
| bramac | „PV-Dachziegel Bramac" | Brand-Fallback | „Bramac" ✓ |
| creaton | „PV-Dachziegel Creaton" | Brand-Fallback | „Creaton" ✓ |
| nelskamp | „PV-Dachziegel Nelskamp" | Brand-Fallback | „Nelskamp" ✓ |

**Keine doppelten Schema-Blöcke** — der alte separate JSON-LD-Block im `is_hersteller`-Branch wurde durch den vereinheitlichten `@graph` ersetzt.

### 3.3 BreadcrumbList-JSON-LD

Live-Probe — alle 5 mit korrekten URLs:

```
pv-dachziegel:
  1 Startseite     → /
  2 Produkte       → /collections/pv-dachziegel
  3 PV Dachziegel  → /collections/pv-dachziegel    ← Selbstverweis Position 2 + 3

braas:
  1 Startseite  → /
  2 Hersteller  → /pages/hersteller
  3 Braas       → /collections/braas
```

**Befund:** Auf `pv-dachziegel` zeigen **Position 2 (Produkte) und Position 3 (PV Dachziegel) auf dieselbe URL** — semantisch unschön. Schema-Validatoren akzeptieren das, aber es ist ein Schwachpunkt: „Produkte" als Oberkategorie sollte eine eigene Hub-Seite sein, nicht auf die Detail-Collection zeigen.

### 3.4 Sichtbares Breadcrumb (Live-Bbox-Probe + Crop-Shot)

| Collection | top | height | width | text |
|---|---|---|---|---|
| pv-dachziegel | 120 px | 34 px | 1200 px | „Startseite ›Produkte ›PV Dachziegel" |
| braas | 120 px | 34 px | 1200 px | „Startseite ›Hersteller ›Braas" |
| (alle anderen) | 120 px | 34 px | 1200 px | analog |

Konsistent positioniert direkt unter dem Header, vor dem dunklen Hero. Cropped Screenshot [`desktop-braas-crop-top.png`](../scripts/coll-test/screenshots/desktop-braas-crop-top.png) bestätigt visuelle Ruhe (12.5 px gray-text, Pfeil-Separator, aktueller Eintrag bold).

---

## 4. Desktop-/Mobile-Bewertung

- **Desktop 1440×900:** Breadcrumb sichtbar, Hero unverändert, kein Layout-Bruch
- **Mobile iPhone 13:** Breadcrumb 1-zeilig kompakt direkt unter Logo, gut lesbar
- **Keine sichtbaren Regressions** in Trust-Pills, Filter, Listing-Cards
- **Mobile Logo „MADE IN GERMANY"-Subtext** sichtbar — bereits im vorigen Cleanup als konsistent markiert

---

## 5. Strategie-Check „Hersteller als Basis"

### 5.1 Aktuelle Breadcrumb-Logik vs. Hersteller-Strategie

| Pfad | Aktuell | Bei Hersteller-zentrierter Strategie |
|---|---|---|
| Hersteller-Collection | Startseite > Hersteller > Braas | bleibt sinnvoll ✓ |
| Haupt-Collection (pv-dachziegel) | Startseite > Produkte > PV Dachziegel | semantisch fragwürdig (siehe 3.3) |
| PDP (z. B. Frankfurter Pfanne, Braas-Tag) | nicht im Audit-Scope | sollte führen zu: Startseite > Hersteller > Braas > Produkt |

**Befund:** Die Breadcrumb-Logik **passt für Hersteller-Collections schon perfekt** zur Strategie. Für `pv-dachziegel` ist sie schwach, weil „Produkte" nicht als eigene Hub-Seite existiert.

### 5.2 Konkurrenzpfade

Aktuell drei semantisch ähnliche Einstiege:

| Pfad | Charakter | Bei Hersteller-Strategie |
|---|---|---|
| Menü „Produkte" → /collections/pv-dachziegel | flacher Katalog | sekundär oder entfernen |
| Menü „Ziegel finden" → 4 Hersteller + Finder | herstellerorientiert | **primär** — passt schon ✓ |
| Menü „Hersteller" (in Submenü) → /pages/hersteller | Übersicht aller Marken | wird zentraler Hub-Knoten |

**Befund:** „Ziegel finden" ist die intuitivere Top-Level-Bezeichnung. Wenn Hersteller wirklich Basis wird, könnte man:
- „Ziegel finden" beibehalten (UX-Sprache für Endnutzer)
- „Produkte" entfernen oder als „Alle Produkte" sekundär behalten
- /pages/hersteller als kanonischer Hub-Knoten ausbauen (mit Hersteller-Karten, jeweils Direkt-Link zur Collection)

### 5.3 Struktur-Risiken

- **`pv-dachziegel`** als Sammlung wird redundant: alle Produkte sind auch über Hersteller-Collections erreichbar. Aktuell zeigen ohnehin alle Hersteller-Collections dasselbe einzelne Produkt — Redundanz heute = nicht spürbar.
- Bei Sortimentswachstum (mehr Profile pro Hersteller): pv-dachziegel würde zur „flachen Mega-Liste" während Hersteller-Collections dann brand-gefiltert sind. Die Frage: behalten wir die flache Liste als Default-Index?
- Shopify-Vendor-Feld vs. Tag-Feld vs. dedizierte Collections: aktuell wird Hersteller-Zuordnung über das Metafield `custom.passende_hersteller` (Format „Profil (Hersteller)") gepflegt + parallel über Smart-Collections per Tag. Wenn Hersteller wirklich Basis wird, lohnt sich Konsolidierung auf eine Quelle.

---

## 6. Nötige Shopify-/Shop-Änderungen (für Hersteller-Strategie)

**Keine sofortige Umsetzung — nur Folgenabschätzung.**

### Pflicht (P1 wenn Strategie wirklich gefahren wird)

1. **`/pages/hersteller`** zu echtem Hub-Page ausbauen (Brand-Cards mit Logo + Profile + Direkt-Link zur Collection). Aktuell unklar, ob das schon Hub-Charakter hat — **Ich kann das nicht bestätigen** ohne separate Page-Audit.
2. **Breadcrumb auf `pv-dachziegel`** klären: entweder eigene Hub-Seite „Produkte" einführen ODER pv-dachziegel-Breadcrumb auf nur 2 Ebenen kürzen (Startseite > PV Dachziegel).
3. **Menü-Top-Level „Produkte"** — Existenz prüfen: ist sie noch der richtige Eintrag, wenn alles über Hersteller läuft? Eventuell streichen oder umbenennen zu „Alle Produkte" sekundär.

### Mittel (P2)

4. **PDP-Breadcrumb** ergänzen: `Startseite > Hersteller > Braas > Frankfurter Pfanne` (heute fehlt Breadcrumb auf PDP).
5. **Datenmodell-Klärung:** Vendor vs. Tag vs. Metafield für Hersteller — eine Quelle als Wahrheit definieren (vermutlich `custom.passende_hersteller`-Metafield erweitern oder Vendor-Feld konsequent setzen).
6. **Hersteller-Collections-Differenzierung** ausbauen, sobald mehr Produkte: brand-spezifische Profil-Listen, brand-spezifischer SEO-Bottom-Text.

### Optional (P3)

7. **Hersteller-Pages mit Inhalt:** pro Hersteller eine eigene Landing mit Geschichte, Profil-Übersicht, Kompatibilitätstabelle (statt nur Collection-Listing).
8. **URL-Konsolidierung:** `/collections/braas` (technisch Shopify-Collection) vs. `/pages/braas` (Content-Hub) — entweder eines wählen oder klar trennen.
9. **Internal-Linking-Boost** zwischen Hersteller-Hub, Hersteller-Collections, PDPs.

---

## 7. Restprobleme nach COLL-1

### P1
- **Gelöst nach Fix `cdaef01`:** Doppelte og:description auf Hersteller-Collections.

### P2
- **Schwacher Selbstverweis im pv-dachziegel-BreadcrumbList:** Position 2 und 3 zeigen auf dieselbe URL. Sollte mit Hersteller-Strategie-Phase mitgelöst werden (entweder echte Hub-Seite oder kürzerer Breadcrumb).
- **PDP hat kein Breadcrumb** (siehe COLL-2-Vorschlag).

### P3
- Cache-Lag bei Edge zwischen Theme-Push und vollständiger Live-Verfügbarkeit auf allen Knoten — **„Ich kann das nicht bestätigen"** für globale Coverage.

---

## 8. Antworten auf die 7 Schlüsselfragen

1. **COLL-1 live korrekt?** Ja — Meta, Schema, Breadcrumb funktionieren. Ein kleiner Bug (doppelte og:description) wurde im Verify-Lauf entdeckt + sofort gefixt.
2. **Doppelte/konkurrierende Meta-Descriptions?** **Nein nach Fix.** Vor Fix: 2× og:description auf Hersteller-Collections; jetzt jeweils 1×.
3. **CollectionPage vereinheitlicht?** Ja, alle 5 Collections haben einheitlichen `@graph` mit `CollectionPage` (+ konditionalem `about: Brand`).
4. **Sichtbares Breadcrumb gut?** Ja Desktop + Mobile — 12.5 px gray, Pfeil-Separator, aktueller Eintrag bold, kein Layout-Bruch.
5. **Passt Breadcrumb zu Hersteller-Strategie?** **Für Hersteller-Collections: ja.** Für `pv-dachziegel`: schwach (Selbstverweis Pos 2+3 auf gleiche URL). Wenn Hersteller-Strategie umgesetzt wird, muss pv-dachziegel-Pfad geklärt werden.
6. **Shopify-Folgeänderungen?** Siehe Abschnitt 6 — drei Pflicht-Punkte (echter Hersteller-Hub, pv-dachziegel-Pfad-Klärung, Menü-„Produkte"-Frage), drei Mittel-Punkte (PDP-Breadcrumb, Datenmodell-Klärung, Brand-Differenzierung), drei Optionale.
7. **Reicht ein kleiner Fix oder eigene Strukturphase?** **COLL-1 als Bugfix-Verifikation: passt** (nach `cdaef01`). **Hersteller-Strategie: braucht eigene Phase** („COLL-2-Hersteller" oder „STRATEGIE-Hersteller-Hub"), weil Datenmodell + Hub-Page + Menü-Konsolidierung ineinander greifen.

---

## 9. Fazit

**COLL-1 passt — mit kleinem Fix nachgeschoben.** Drei Quick-Wins (Meta, Breadcrumb, Schema-Vereinheitlichung) sind live und korrekt. Der einzige Live-Bug (doppelte og:description) wurde in derselben Verify-Runde entdeckt und gefixt.

**Strategie „Hersteller als Basis":** Die heutige Architektur ist **kompatibel, aber nicht ausgereizt**. Hersteller-Collections funktionieren bereits sauber mit Hersteller > Brand-Pfad. Die echte Strukturphase wäre:
- echter Hersteller-Hub auf `/pages/hersteller`
- klarer Pfad für die Haupt-Collection (Hub-Seite oder kürzerer Breadcrumb)
- Datenmodell-Konsolidierung (Vendor vs. Tag vs. Metafield)

**Empfehlung:**
- ✅ COLL-1 = abgeschlossen
- ⏭ Wenn Hersteller wirklich tragende Achse werden soll → eigene Phase **STRATEGIE-Hersteller-Hub** planen (3–5 strukturelle Eingriffe statt vieler Mikro-Polish-Fixes)
- 🚫 Kein blinder Folge-Bugfix nötig

**Repo:** https://github.com/sneakbrands/blechziegel/commits/feat/ziegel-finder-enterprise
