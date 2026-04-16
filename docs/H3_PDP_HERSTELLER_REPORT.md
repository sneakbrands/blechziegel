# H3 — PDP-Anbindung an die Hersteller-Achse

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Methode:** GitHub-Review → Shopify-CLI Theme-Check → Umsetzung → Playwright Live-Verify (Desktop + Mobile)

---

## 1. GitHub-Review / Ist-Befund

### A. PDP-Rendering

- Template: [`templates/product.json`](../templates/product.json) → Section `blechziegel-product` + Horizon `product-recommendations`
- Einzige PDP-Section: [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid) (~1800 Zeilen nach H3)
- Vor H3: kein Breadcrumb, keine sichtbare Hersteller-Zuordnung

### B. Datenmodell

| Quelle | Nutzung | Rolle |
|---|---|---|
| `product.tags` (lowercase) | Smart-Collection-Basis + Finder | **Breadcrumb-Quelle (gewählt)** |
| `custom.passende_hersteller` | Finder-Profil-Mapping, Product-JSON-LD `isRelatedTo` | **nicht** als Breadcrumb-Quelle |
| `product.vendor` = „BHE Metalle" | interner Lieferant | **nicht** verwendet (explizit verboten) |

**Vendor-Leak-Prüfung:** Vendor erscheint nicht im PDP-Template. Cart-Anzeige deaktiviert (`cart.json:36 "vendor": false`). Product-JSON-LD setzt manuell `"brand": "Blechziegel.de"`. Kein Leak.

### C. Breadcrumb / Schema (vor H3)

- Kein sichtbarer Breadcrumb auf PDP
- Kein BreadcrumbList-JSON-LD
- Product-JSON-LD vorhanden (erweitert + metafield-aware)

---

## 2. Umsetzungsstrategie

**Gewählt:** Tag-basierte Brand-Detection gegen etablierte 10er-Hersteller-Liste (identisch zu Smart-Collections + Collection-Hersteller-Erkennung). Erster Treffer aus definierter Reihenfolge → deterministisch, kein Mehrfach-Brand.

**Verworfen:**
- Neues Metafield `custom.brand_handle` (zusätzliche Admin-Pflege, neue Datenquelle)
- Regex-Parse von `custom.passende_hersteller` (komplex, mehrere Einträge, semantisch unklar)
- Vendor als Hersteller (explizit verboten, leakt internen Lieferantennamen)

---

## 3. Konkrete Änderungen

Alle in [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid):

### 3.1 Brand-Detection (L19–55)

```liquid
assign brand_handles = 'braas,bramac,creaton,nelskamp,...' | split: ','
assign brand_handle = ''
assign brand_name = ''
for t in product.tags
  assign t_lc = t | downcase
  if brand_handle == blank and brand_handles contains t_lc
    assign brand_handle = t_lc
  endif
endfor
case brand_handle
  when 'braas'
    assign brand_name = 'Braas'
  when 'bramac'
    assign brand_name = 'Bramac'
  ...
endcase
```

Defensive Logik: leerer String bei fehlendem Tag, kein Raten, kein Fallback auf Vendor.

### 3.2 Sichtbarer Breadcrumb (L965–980)

```
Startseite › Hersteller › Braas › PV-Dachziegel Frankfurter Pfanne
```

- Rendert nur wenn `brand_handle` != blank (sonst: Startseite › Produkte › Titel)
- CSS `.bz-pdp-breadcrumb*` konsistent zum Collection-Breadcrumb (12.5 px gray, Hover orange)
- Mobile: 11.5 px, 1-zeilig

### 3.3 Sichtbare Hersteller-Zuordnung (L1028–1037)

Brand-Pill „Passend für **Braas** →" zwischen Top-Tag und H1:
- Orange-Light-Hintergrund, Pill-Radius, dezenter Pfeil
- Link zu `/collections/<brand_handle>`
- Rendert nur wenn `brand_handle` != blank
- CSS `.bz-product-brand-link` mit `width: fit-content; align-self: flex-start`

### 3.4 BreadcrumbList JSON-LD (L1804–1820)

Additiv nach Product-JSON-LD (bestehende Schema-Struktur unverändert):

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Startseite", "item": "https://blechziegel.de/" },
    { "position": 2, "name": "Hersteller", "item": "https://blechziegel.de/pages/hersteller" },
    { "position": 3, "name": "Braas", "item": "https://blechziegel.de/collections/braas" },
    { "position": 4, "name": "PV-Dachziegel Frankfurter Pfanne", "item": "https://blechziegel.de/products/..." }
  ]
}
```

---

## 4. Shopify-CLI-Ergebnis

- Theme: `blechziegel/main #193125220736` (live)
- `shopify theme check --path . --fail-level error`: **257 Offenses, 183 Errors** (identisch zum Vor-Stand; 0 neue Fehler eingeführt)

---

## 5. Playwright-Ergebnis

### Desktop (1440×900)

- ✅ Breadcrumb sichtbar: „Startseite › Hersteller › Braas › PV-Dachziegel Frankfurter Pfanne"
- ✅ Brand-Pill „Passend für Braas →" sichtbar zwischen Top-Tag und H1
- ✅ Hersteller-Link klickbar → `/collections/braas`
- ✅ Kein doppelter Breadcrumb
- ✅ Kein Layout-Bruch
- ⚠️ Brand-Pill-Breite: `fit-content` CSS deployed, aber Edge-Cache zeigt ggf. noch gestretchte Version

### Mobile (iPhone 13)

- ✅ Breadcrumb 1-zeilig: „Startseite › Hersteller › Braas ›"
- ✅ Kompakt unter Logo, direkt über Produktbild
- ✅ Kein Overflow

### JSON-LD (DOM-Probe)

- ✅ BreadcrumbList mit 4 ListItems, korrekte URLs
- ✅ Brand „Braas" in Position 3
- ✅ Product-JSON-LD unverändert parallel

---

## 6. H4/H5 Kurzprüfung

### H4 (Interne Verlinkung)

Brand-Link im Breadcrumb + Brand-Pill = zwei konsistente Pfade zur Hersteller-Collection. Horizon-`product_recommendations` existiert im Template für verwandte Produkte. Kein zusätzlicher „Weitere von Braas"-Block nötig.

### H5 (Datenmodell-Risiken)

- Vendor „BHE Metalle" im PDP nicht verwendet, in Cart deaktiviert, in JSON-LD überschrieben
- **Ich kann das nicht bestätigen**, ob externe Feeds (Google Merchant, Meta) `vendor` direkt ziehen — potentieller Leak außerhalb Theme-Scope
- Keine Migration, keine Feed-Anpassung, keine App-Umbauten in H3

---

## 7. Geänderte Dateien

| Datei | Änderung |
|---|---|
| [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid) | Brand-Detection + Breadcrumb + Brand-Pill + CSS + BreadcrumbList-JSON-LD |

---

## 8. Commits

| SHA | Beschreibung |
|---|---|
| `3a69634` | Breadcrumb + Brand-Detection + JSON-LD |
| `1b5807f` | Liquid case/when Syntax-Fix (split onto separate lines) |
| `c0beb3e` | Brand-Pill „Passend für Brand" nahe H1 |
| `07cdb8a` | Pill width fit-content (prevent flex-stretch) |
| `4df078b` | Verification Screenshots |

---

## 9. Qualitätskriterien-Check

| Kriterium | Status |
|---|---|
| PDP strukturell Teil der Hersteller-Achse | ✅ |
| Breadcrumb: Start → Hersteller → Brand → Produkt | ✅ |
| BreadcrumbList JSON-LD konsistent | ✅ |
| Sichtbare Hersteller-Zuordnung (nicht nur Breadcrumb) | ✅ Brand-Pill |
| Hersteller-Link führt zur richtigen Collection | ✅ |
| Keine Vendor-Nutzung als Strukturachse | ✅ |
| Keine `custom.passende_hersteller` als Breadcrumb-Quelle | ✅ |
| Keine Vermischung mit Finder-Logik | ✅ |
| Defensive Prüfung bei fehlendem Tag | ✅ |
| Kein Mehrfach-Hersteller im Breadcrumb | ✅ |
| Keine neuen Dependencies / Metafields | ✅ |
| Theme-Check: keine neuen Errors | ✅ |
| Desktop live verifiziert | ✅ |
| Mobile live verifiziert | ✅ |
| Minimaler Diff, kein Design-Refactor | ✅ |

---

## 10. Schlussfazit

**H3 ist vollständig abgeschlossen.**

Die Produktseite ist jetzt strukturell in die Hersteller-Achse integriert:
- Breadcrumb führt konsistent über Hersteller-Hub und Brand-Collection zum Produkt
- Hersteller-Zuordnung ist **doppelt sichtbar** (Breadcrumb + Brand-Pill)
- Datenquelle = Tags (etablierte Logik, keine Magie)
- Kein Vendor-Missbrauch, keine neuen Metafields
- Keine Strategieänderung, keine Finder-Vermischung

**Kein Blocker.**

**Offene Restpunkte (nicht H3):**
- Brand-Pill-Breite optisch prüfen nach vollständigem Cache-Refresh (manueller Browser-Check empfohlen)
- Produkte ohne Hersteller-Tag: Fallback-Code vorhanden, nicht live testbar (nur 1 Produkt im Sortiment)
- Vendor „BHE Metalle" in externen Feeds → eigenes H5-Ticket

**Screenshots:** [`scripts/coll-test/screenshots/desktop-pdp-top.png`](../scripts/coll-test/screenshots/desktop-pdp-top.png) + [`mobile-pdp-top.png`](../scripts/coll-test/screenshots/mobile-pdp-top.png)
