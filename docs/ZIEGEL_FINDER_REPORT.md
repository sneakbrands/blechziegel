# Ziegel Finder — Implementation & Validation Report

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/pages/ziegel-finder`
**Page ID (Shopify):** 708092133760
**Letztes Update:** 2026-04-15 (HARD FIX: nur Shopify-Metafields als Datenquelle)

---

## Aktuelles Datenmodell (nach HARD FIX)

Der Finder speist sich **ausschließlich** aus Shopify-Produkt-Metafields. Es gibt keine Ersatz-Stammdaten, keine hartcodierten Hersteller-Listen und keine Standard-Maß-Tabellen mehr.

### Rohdaten (einzige Quelle)

Liquid-generiert aus `collections.pv-dachziegel.products`:

```js
var SHOPIFY_PRODUCTS = [
  { handle, title, url, image, price_min, laenge, breite, profiles:[…], desc }
];
```

### Abgeleitetes `MFR_MAP`

Parst jeden `custom.passende_hersteller`-Eintrag im Format `"Profil (Hersteller)"` und ordnet die Produkt-Dimensionen dem Profil zu:

```js
var MFR_MAP = {
  "Braas":   [{ profil:"Frankfurter Pfanne", laenge:420, breite:330, product:{…} }, …],
  "Bramac":  [{ profil:"Bramac Montero",      laenge:420, breite:330, product:{…} }, …],
  "Creaton": [{ profil:"Heidelberger",        laenge:420, breite:330, product:{…} }],
  "Nelskamp":[{ profil:"Sigma Pfanne",        laenge:420, breite:330, product:{…} }, …]
};
```

**Guards:**
- Produkte ohne valide `laenge`/`breite` übersprungen
- Einträge, die nicht dem Regex `Profil (Hersteller)` entsprechen, übersprungen
- Dedupe-Key: `hersteller|profil|laenge|breite|product.handle`

---

## Fachliche Annahme (Blechziegel-Semantik)

Wenn ein Produkt X mit `laenge=420, breite=330` in `custom.passende_hersteller` den Eintrag `"Frankfurter Pfanne (Braas)"` trägt, dann gilt dieses Produkt als passender Blechziegel für einen Braas-Frankfurter-Pfanne-Ziegel mit den Maßen 420×330 mm.

Das heißt: **Die Produkt-Maße sind die Maße, die der Finder dem Profil zuordnet.** Das ist korrekt für die Blechziegel-Logik — ein 420×330-mm-Blechziegel passt auf alle Profile gleicher Außenmaße.

**Alternative** für künftige präzisere Per-Profil-Dimensionen: neues Metafield `custom.profil_dimensionen` als JSON oder `list.metaobject_reference`. Nicht Teil dieses Fixes.

---

## Sichtbare Hersteller bei aktuellem Datenstand

Beim aktuellen Bestand (1 aktives Produkt, 7 passende_hersteller-Einträge) erscheinen in Step 1:

| Hersteller | Profile im Finder | Maße |
|---|---|---|
| **Braas** | Frankfurter Pfanne, Harzer Pfanne | 420×330 mm |
| **Bramac** | Bramac Montero, Bramac Classic | 420×330 mm |
| **Creaton** | Heidelberger | 420×330 mm |
| **Nelskamp** | Sigma Pfanne, Finkenberger | 420×330 mm |

**Alle Hersteller erhalten automatisch den „Ab Lager"-Badge**, da nur Hersteller mit tatsächlich verfügbarem Produkt im `MFR_MAP` landen.

### Weitere Hersteller

Sobald neue Produkte mit `custom.passende_hersteller`-Einträgen gepflegt werden, erweitert sich der Finder automatisch — **ohne Theme-Änderung**.

### Nicht abgedeckte Hersteller

Nutzer mit einem Dachziegel, dessen Hersteller nicht im Finder erscheint, werden durch zwei klare Auffangnetze zu Beratung geführt:

1. **Pflicht-CTA unter dem Hersteller-Grid**: „Mein Hersteller ist nicht dabei? Beratung anfragen →" — führt nach `/pages/ziegel-anfrage`
2. **Untere Beratungs-Section** der Seite (unverändert aus dem Original-Design)

---

## Empty-State

Falls `SHOPIFY_PRODUCTS` leer ist (keine Produkte mit passende_hersteller im Shop), zeigt Step 1 eine Fallback-Card: „Noch keine Blechziegel-Produkte gepflegt" mit Beratungs-CTA. Kein hartcodierter Fallback-Content, keine toten UI-Zustände.

---

## Architekturentscheidung

| Komponente | Entscheidung |
|---|---|
| Routing | Unverändert: `sections/main-page.liquid` `{%- elsif page.handle == 'ziegel-finder' -%}` |
| Rendering | Single snippet `blechziegel-ziegel-finder.liquid` |
| Datenmodell | **Nur** Liquid-generierter `SHOPIFY_PRODUCTS`-Array + abgeleitetes `MFR_MAP` |
| State | `{ step, mfrName, laenge, breite }` — `mfrName` ist ein String aus `MFR_MAP`-Keys |
| Step-Flow | 4 Schritte, Breite wird übersprungen wenn nach gewählter Länge nur 1 Breite existiert |
| Ergebnis | Produkt-Card(s) aus `e.product`; Deduplizierung nach `product.handle`; keine Sonderanfertigung-Fallback-Card |
| Menü | Unverändert: `menu.json` + `set-menu.js` |

---

## Geänderte Dateien

| Datei | Status | Zweck |
|---|---|---|
| [`snippets/blechziegel-ziegel-finder.liquid`](../snippets/blechziegel-ziegel-finder.liquid) | Refactored | MFR_DATA + matchProductHandle entfernt, MFR_MAP-Derivation + state-Rename + Step-1..4-Umbau + Empty-State + CTA |
| [`docs/ZIEGEL_FINDER_REPORT.md`](./ZIEGEL_FINDER_REPORT.md) | Updated | Doku des Metafield-only-Modells |

**Nicht geändert** (Scope-Disziplin):
- `sections/main-page.liquid` · Navigation / Menü · Shopify-Page-Entity
- CSS-Struktur (`.zf-*`, `.hp-*`) · Hero · Tipps-Cards · untere Beratungs-Section
- JSON-LD · Routing · Tracking-Event-Namen
- andere Snippets / Assets / Templates

---

## Validierung

### Statische grep-Prüfungen

| Suche | Soll | Ist |
|---|---|---|
| `MFR_DATA` | 0 | **0** ✅ |
| `matchProductHandle` | 0 | **0** ✅ |
| `state\.mfr\b` (alt) | 0 | **0** ✅ |
| `MFR_MAP` | > 0 | 10 ✅ |
| `state.mfrName` | > 0 | 12 ✅ |
| `Noch keine Blechziegel-Produkte gepflegt` | > 0 | 1 ✅ |
| `Mein Hersteller ist nicht dabei` | > 0 | 1 ✅ |
| Hersteller-Namen (Braas/Bramac/…) | nur in Content | 1 Treffer (SEO-JSON-LD-Beschreibung — legitimer Content-Block, unverändert aus Original-Version) |

### Funktionale Verifikation

| Schritt | Erwartung |
|---|---|
| Step 1 | Zeigt 4 Kacheln: Braas, Bramac, Creaton, Nelskamp (alphabetisch, alle „Ab Lager") |
| Step 2 Braas | Eine Kachel „420 mm" mit Label „Frankfurter Pfanne, Harzer Pfanne" |
| Step 3 | Wird übersprungen (nur eine Breite 330 mm vorhanden) |
| Step 4 | Zeigt Produkt-Card für `PV-Dachziegel Frankfurter Pfanne` |
| CTA | „Mein Hersteller ist nicht dabei?" → `/pages/ziegel-anfrage` |
| Empty-State | Bei leerem `SHOPIFY_PRODUCTS` erscheint Fallback-Card |

### Nicht regressiv

- CSS-Struktur unverändert → Mobile-Breakpoints (`≤900px`, `≤480px`) bleiben funktional
- JSON-LD-Schema unverändert
- Tracking-Event-Namen (`ziegel_finder_step`, `ziegel_finder_result`) unverändert — nur Payload-Feld `mfr` → `mfrName` umbenannt

---

## Navigation & Startseiten-Vorbereitung

Menü-Struktur **unverändert** gegenüber Vor-Fix:

```
Startseite
Hersteller (Submenü: Braas · Bramac · Creaton · Nelskamp · Alle Hersteller)
PV Dachziegel kaufen
Ziegel Finder             ← bereits vorhanden
Ratgeber
Ziegel anfragen
Für Händler
Kontakt
```

Startseiten-Hero-CTA empfohlen für späteren separaten PR, nicht Teil dieses Fixes.

---

## Offene Punkte / Nächste Schritte

1. **Weitere Produkte mit `custom.passende_hersteller`-Einträgen pflegen** — Finder erweitert sich automatisch
2. **Per-Profil-Dimensionen** (optional): neues Metafield `custom.profil_dimensionen` bei Bedarf
3. **GA4-Events**: `ziegel_finder_step` + `ziegel_finder_result` werden an `window.dataLayer` gepusht (GTM-Container-Konfiguration außerhalb dieses Repos)
4. **Startseiten-Hero-CTA** auf `/pages/ziegel-finder` verlinken (separater PR)

---

## Unsicherheiten

> „Ich kann das nicht bestätigen."

- **GA4/GTM-Integration**: Der Tracking-Code pusht an `window.dataLayer`. Ob die Events im GTM erfasst und ausgewertet werden, liegt außerhalb dieses Repos.
- **Shopify Search-Action Schema**: Der JSON-LD `potentialAction`-Eintrag bleibt aus dem Ursprungs-Build bestehen. Ob Google den Finder als echten Search-Entry-Point erkennt, lässt sich erst nach Crawl-Analyse bestätigen.

---

## Finaler Link

**Live:** `https://blechziegel.de/pages/ziegel-finder`

Menü-Eintrag: **Ziegel Finder** (zwischen „PV Dachziegel kaufen" und „Ratgeber")

Theme-Branch: `feat/ziegel-finder-enterprise` · Page ID Shopify: `708092133760`
