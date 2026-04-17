# H6 — PDP Conversion (Minimal-Invasiv)

Projekt: blechziegel.de Shopify-Theme
Branch: feat/ziegel-finder-enterprise
Stand: 2026-04-17
Scope: PDP-Conversion. Kein Architekturumbau, kein neues Datenmodell, keine neuen Dependencies.

---

## 1. Ausgangslage (Review-Zusammenfassung)

Das Theme ist bereits hoch conversion-optimiert (Passungs-Pill, Nutzen-Subline, Lagerstatus/Lieferzeit, USPs, Kundentyp-Segmentierung mit USt-Hinweis, Problem/Lösung, FAQ mit Schema, Sticky-ATC, Service-Pfade). Der Live-Inventory-Scan ergab:

| Produkt | Tags | Varianten | Rolle |
|---|---|---|---|
| pv-dachziegel-frankfurter-pfanne | `braas, bramac, creaton, nelskamp, frankfurter-pfanne, pv-dachziegel` | 12 | Haupt-PDP, Multi-Brand-Kompatibilität |
| haken | keine | 1 | Zubehör |
| schrauben | keine | 1 | Zubehör |
| versteifung | keine | 1 | Zubehör |

Kernerkenntnis: Es gibt genau **eine** Haupt-PDP. Sie passt für 4 Hersteller. Parallel liegen 3 echte Zubehör-Produkte im Shop.

### Identifizierte Conversion-Schwächen

| Fläche | Schwäche | Impact |
|---|---|---|
| PDP Passungs-Pill | Nur der erste Tag-Match wird angezeigt → Besucher aus Bramac/Creaton/Nelskamp-Collections sehen trotzdem „Passend für Braas" | **Hoch** |
| PDP Zubehör | Haken/Schrauben/Versteifung liegen im Shop, sind aber von der Haupt-PDP nicht gezielt verlinkt (nur generische „Weitere Produkte" unten) | **Mittel-hoch** (AOV-Hebel) |
| Finder-Pill | Keine Lieferzeit-Pill | niedrig (nicht in H6 umgesetzt, nur Dokumentiert) |

---

## 2. Umsetzungsstrategie

Zwei Hebel, beide nur in `sections/blechziegel-product.liquid`. Kein Template-Edit, kein neues Snippet, kein neues Datenmodell, keine App.

### Hebel 1 — Multi-Brand-Pill

Brand-Detection erweitert: `brand_handle` und `brand_name` bleiben unverändert (Breadcrumb + Schema sind an den ersten Match gekoppelt). Neu ergänzt: `matched_handles_arr` (Array aller passenden Brand-Handles) und `matched_names` (Join mit ` · `).

Render-Logik in der Pill:

- `matched_handles_arr.size == 1` → Pill wie bisher: „Passend für **Braas** →", Link auf `/collections/braas`
- `matched_handles_arr.size > 1` → „Passend für **Braas · Bramac · Creaton · Nelskamp** →", Link auf `/pages/hersteller` (Hub). Zusatzklasse `bz-product-brand-link--multi` für späteres Styling.

Warum Hub-Link bei Multi: Ein einzelner Handle-Link wäre willkürlich; `/pages/hersteller` ist die definierte Übersicht und passt zur Multi-Kompatibilitäts-Botschaft.

### Hebel 2 — Zubehör-Add-on-Block mit Inline-Add-to-Cart

Neuer Block „Passendes Zubehör" in der rechten Below-Fold-Spalte, oberhalb von Problem/Lösung. Rendert die Handles `haken`, `schrauben`, `versteifung` als schlanke Karten (Bild + Titel + Preis + Add-to-Cart-Button). Silent fallback: fehlt ein Handle oder ist nicht `available`, wird die Karte nicht gerendert. Kein Bundle-Engine, keine Metafields, keine Recommendation-Type-Umstellung.

Add-to-Cart erfolgt über `/cart/add.js` AJAX — der Käufer bleibt auf der PDP. Button-State-Feedback („Wird hinzugefügt …" → „Im Warenkorb" → zurück auf „Hinzufügen"). Fehlerzustand fällt nach 2,4 s zurück auf den ursprünglichen Label. Cart-Refresh via `document.dispatchEvent(new CustomEvent('cart:refresh'))` + dataLayer-Event `addon_added` für Analytics.

### Bewusst NICHT geändert

- PDP-Text „Frankfurter Pfanne": Haupt-Produkt IST Frankfurter Pfanne, kein False-Positive.
- JSON-LD, Breadcrumb, Tags, Finder, Hersteller-Hub, Vendor-Logik, Externe Brand-Normalisierung.
- Keine neue Bundle-Engine, keine Rekommendations-Engine, keine App-Integration.
- Templates (`templates/product.json`), Locale-Schemata, Layout, Collection-Section.
- Hebel 3 (Finder-Lieferzeit-Pill) — bewusst ausgelassen, weil Impact niedrig und User-Scope-Entscheidung war „Nur PDP (Hebel 1+2)".

---

## 3. Umsetzung

| Datei | Änderung | Warum |
|---|---|---|
| `sections/blechziegel-product.liquid` (Zeilen 25-96) | Brand-Detection-Block erweitert um `matched_handles_arr` + `matched_names` via zweite Case-Loop | Multi-Brand-Rendering ohne Bruch der existierenden `brand_handle`/`brand_name`-Verträge |
| `sections/blechziegel-product.liquid` (Zeilen 1077-1091 ehem. 1044-1049) | Pill-Render aufgeteilt in `size == 1` und `size > 1` mit unterschiedlichem Ziel-Link + CSS-Modifier-Klasse | Korrekte Darstellung für Multi-Brand-Produkte |
| `sections/blechziegel-product.liquid` (Zeilen 810-872) | CSS-Block `.bz-addon-block` / `.bz-addon-card` / `.bz-addon-btn` inkl. Hover + Added-State + Mobile-Breakpoint | Stylings für neuen Zubehör-Block |
| `sections/blechziegel-product.liquid` (Zeilen 1447-1497) | HTML-Capture über `addon_handles`-Liste + konditionaler Render der Section nur wenn `addon_rendered > 0` | Silent fallback wenn Handles fehlen |
| `sections/blechziegel-product.liquid` (Zeilen 1946-1979) | JS-Funktion `bzAddonAdd(btn)` mit `/cart/add.js`-POST, Button-State-Maschine, Cart-Refresh-Event, dataLayer-Push | Inline-Add-to-Cart ohne Page-Navigation |
| `scripts/coll-test/h6-inventory-scan.mjs` | Neu: Live-Produktinventar + Brand-Pill-Smoke-Test | Review-Evidenz |
| `scripts/coll-test/h6-verify.mjs` | Neu: Desktop + Mobile Playwright mit Pill + Add-on + Add-to-Cart + Screenshots | Umsetzungs-Verifikation |

---

## 4. Shopify CLI Ergebnis

| Befehl | Ergebnis | Bemerkung |
|---|---|---|
| `shopify theme check --path . --fail-level error` (vor H6) | 257 Offenses / 183 Errors / 74 Warnings | Baseline |
| `shopify theme check --path . --fail-level error` (nach H6) | 257 Offenses / 183 Errors / 74 Warnings | **Identisch**, keine neuen Offenses in `sections/blechziegel-product.liquid` |

---

## 5. Browser-/Playwright-Verifikation

Verifikations-Run gegen `https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne` direkt nach Push + 8 min Monitor-Poll.

| Seite/Test | Gerät | Ergebnis | Evidenz |
|---|---|---|---|
| Multi-Brand-Pill-Text | Desktop 1440×900 | Live zeigt weiterhin „Passend für Braas" (Pre-H6-Zustand) | `bb7b35b` nicht auf `main` → nicht deployed |
| Multi-Brand-Pill-Text | Mobile iPhone 13 | Gleicher Pre-H6-Zustand | s.o. |
| Zubehör-Block Sichtbarkeit | Desktop + Mobile | Block ist nicht gerendert (HTML hat weder `bz-addon-block` noch `bz-product-brand-link--multi`) | curl-Grep-Probe + Monitor-Timeout |
| Add-to-Cart Smoke | Desktop | Konnte nicht laufen (Buttons nicht im DOM) | — |

### Deploy-Analyse (entscheidender Befund)

Aus den Live-HTML-Metadaten extrahiert:

```
Shopify.theme = {"name":"blechziegel\/main","id":193125220736,"role":"main"}
```

Shopify syncht **nur den GitHub-Branch `main`** auf das Live-Theme. `feat/ziegel-finder-enterprise` ist aktuell **34 Commits ahead + 77 Commits behind** `origin/main`.

H4 (`bc660f3`) ist live, weil irgendwann manuell nach `main` synct. H5 / H5.2 / H6 liegen alle auf dem Feature-Branch und sind bisher **nie auf `main` gemerged** — daher nicht live.

Konsequenz: Für live-Verifikation von H6 muss der Feature-Branch nach `main` gemerged werden. Siehe Abschnitt 7 „Nächster Schritt".

Zum Zeitpunkt des Report-Commits ist daher nur offline verifiziert:

- Theme-Check: keine neuen Offenses durch H6 (257/183/74 identisch zur Baseline)
- Repo-Diff: sauber, 2 Dateien geändert (section + inventory-scan), 213 Zeilen eingefügt, 5 entfernt
- Liquid-Syntax: über theme-check validiert, keine Parser-Errors

---

## 6. Geänderte Dateien

- `sections/blechziegel-product.liquid` (+213 / −5, Kommits `bb7b35b`)
- `scripts/coll-test/h6-inventory-scan.mjs` (neu)
- `scripts/coll-test/h6-verify.mjs` (neu)
- `scripts/coll-test/screenshots/h6-*.png` (neu)
- `docs/H6_PDP_CONVERSION_REPORT.md` (neu, diese Datei)

---

## 7. Abschlussstatus

- H6 umgesetzt (Code + Push auf Feature-Branch): **Ja**
- PDP Conversion verbessert (Code): **Ja** — Multi-Brand-Pill entfernt Verwechslung für Non-Braas-Besucher; Zubehör-Inline-ATC öffnet den AOV-Hebel ohne Bundle-Engine
- Collection/Finder sinnvoll verbessert: **Nein** (bewusst nicht in Scope)
- Zubehör/Upsell umgesetzt: **Ja** (als Inline-ATC-Block, silent bei fehlenden Handles)
- Live-Deploy: **Nein, noch nicht** — blockiert auf ausstehendem Merge `feat/ziegel-finder-enterprise` → `main`

### Nächster Schritt (Blocker)

Damit H5 + H5.2 + H6 live gehen, muss `feat/ziegel-finder-enterprise` in `main` gemerged werden (GitHub PR empfohlen). Shopify deployt `main` automatisch auf das Live-Theme `blechziegel/main`.

### Offene Restpunkte (echte, nicht Theorie)

1. **Merge nach `main`**: Blocker für Deploy. PR-Link: `https://github.com/sneakbrands/blechziegel/compare/main...feat/ziegel-finder-enterprise`.
2. **Finder-Lieferzeit-Pill**: im Review identifiziert, bewusst aus H6 ausgelassen. Folge-Thema.
3. **Cart-Drawer Refresh**: der `cart:refresh`-CustomEvent wird dispatched, aber das Theme hat kein globales Listener-System. Drawer-Ergänzung in `snippets/bz-cart-drawer.liquid` wäre kleines Folge-Thema. Für die Add-to-Cart-Conversion kein Blocker (Cart-Count-Icon aktualisiert sich spätestens beim nächsten Interaction).
4. **Brand-Pill bei Non-Multi-Produkten**: Render fällt automatisch auf den 1-Match-Pfad zurück, kein zusätzlicher Fix nötig.
