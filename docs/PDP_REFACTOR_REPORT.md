# PDP Refactor Report — Frankfurter Pfanne

**Branch:** `feat/pdp-frankfurter-pfanne-ui-seo`
**Zielseite:** https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne
**Datum:** 2026-04-15
**Shopify Theme:** `blechziegel/main` (#193125220736)

---

## 1. Analyse

### Primäre PDP-Datei

- [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid) — ~1520 Zeilen
- [`templates/product.json`](../templates/product.json) rendert ausschließlich diese Section
- Kein `main-product`-Split, kein separates price/quantity-Snippet — alle Logik in einer Datei

### Fundstellen (vor Umbau)

| Thema | Ort | Zustand |
|---|---|---|
| Mengen-Buttons Markup | Z. 923–925 | `data-tier-add` mit Additions-JS |
| Mengen-JS Bug | Z. 1316–1319 | `current + add` → 1+25=26 |
| Dropdown „Bestellung als" | Z. 970–977 | iteriert `option.values` |
| Tax-Note | Z. 867 | statisch „inkl. MwSt." |
| Trusted-Shops-Rating | Z. 873–892 | „4,8 / 5 (120+ Bewertungen)" + „Käuferschutz inklusive" |
| Trust-Grid (4 Kacheln) | Z. 1030–1048 | inkl. „Lieferung 1–3 Werktage" + „30 Tage Rückgabe" |
| Reviews-Strip | Z. 1205–1228 | „Trusted Shops bewertet · 500+ Bestellungen" + 2 Fake-Reviews |
| Kein Stock-Display | — | Fehlte komplett |

### Shopify-API-Verifikation

**Produkt:** `pv-dachziegel-frankfurter-pfanne` (ID 15641069158784)

**Optionen (via Admin REST):**
| Position | Name | Werte |
|---|---|---|
| 1 | Farbe | Aluminium blank, Anthrazit, Ziegelrot |
| 2 | Ausführung | ohne Haken, mit Haken |
| 3 | **Bestellung als** | **Privatkunde, Gewerbekunde** (bereits korrekt) |

12 Varianten, 7,79 € – 21,41 €.

**Metafields:**
| Namespace.Key | Typ | Wert |
|---|---|---|
| `global.title_tag` | string | PV-Dachziegel Frankfurter Pfanne … |
| `global.description_tag` | string | PV-Blechziegel für Frankfurter Pfanne … |
| `custom.dachziegel_typ` | single_line_text_field | Frankfurter Pfanne |
| `custom.laenge` | number_integer | 420 (mm) |
| `custom.breite` | number_integer | 330 (mm) |
| `custom.passende_hersteller` | list.single_line_text_field | 10 Einträge |
| `custom.montageanleitung_mit_haken` | file_reference | PDF |
| `custom.montageanleitung_ohne_haken` | file_reference | PDF |
| `shopify.color-pattern` | list.metaobject_reference | 3 Farben |
| `shopify.shingle-tile-material` | list.metaobject_reference | 1 Material |

### Trusted-Shops-Ursprung

**Alle 3 Fundstellen hartcodiert im Theme**, keine externe Injection.
- `layout/theme.liquid` → kein Trusted-Shops-Script
- `snippets/scripts.liquid` → kein Trusted-Shops-Script
- `config/settings_*.json` → kein App-Embed festgestellt

→ **Reine Theme-Entfernung ausreichend**, kein Admin/App-Schritt nötig.

---

## 2. Geänderte Dateien

### [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid)

5 Commits, ~180 Zeilen Netto-Änderung.

**Änderungen im Detail:**
- Tier-Buttons: `data-tier-add` → `data-tier-set`, JS-Handler setzt Zielwert absolut
- Dropdown: defensive `{%- continue -%}`-Filter für „Bestellung als" (nur Privatkunde/Gewerbekunde zulässig)
- Tax-Note: Zweier-Span-Struktur mit `data-tax-private` / `data-tax-business`, serverseitiger Initial-Sichtbarkeits-Toggle via `product.selected_or_first_available_variant.option3`, Client-Update in `bzUpdateTaxNote(customerType)`
- Neue `.bz-price-usps` Flex-Liste direkt unter Tax-Note (Gratis Versand + Made in Germany)
- Neue `.bz-stock-line` mit pulsierendem grünen Dot, `[data-available]`-Attribut, `bzUpdateVariant()` synchronisiert live
- Entfernt: `.bz-trust-block` (Rating + Käuferschutz), `.bz-trust-grid` (4 Kacheln), `.bz-reviews-strip` (Trusted Shops + Fake-Reviews)
- Product-JSON-LD: `AggregateOffer` statt Single-Offer, `shippingDetails`, `hasMerchantReturnPolicy`, `additionalProperty` mit Länge/Breite aus Metafields, `isRelatedTo` mit passenden Herstellern
- Link „Versandkosten" zeigt auf `/pages/versand` (CI-Seite) statt `/policies/shipping-policy`

### [`snippets/bz-product-metafields.liquid`](../snippets/bz-product-metafields.liquid) — **neu**

159 Zeilen. Wiederverwendbarer, typ-sicherer Metafield-Renderer.

**Features:**
- `FIELDS`-Array im Snippet steuert, welche Metafields in welcher Reihenfolge mit welchem Label und welcher Einheit angezeigt werden
- Neue Metafields integrieren = einen Eintrag ergänzen, keine Theme-Edits nötig
- Typ-sichere Ausgabe für: `single_line_text_field`, `multi_line_text_field`, `number_integer`, `number_decimal`, `list.single_line_text_field`, `list.metaobject_reference`, `metaobject_reference`, `file_reference`, `rich_text_field`, `boolean`
- Leer-sicher: `nil`/`empty` → kein Row. Wenn alle Fields leer → gesamte Section nicht gerendert
- Responsive Grid, mobile-stacked ab ≤640px

Eingebunden in PDP-Tab „Technische Daten" vor der bestehenden statischen Tech-Table.

---

## 3. Validierung

| Anforderung | Soll | Ist |
|---|---|---|
| +25 setzt 25 | 25 | ✅ 25 |
| +50 setzt 50 | 50 | ✅ 50 |
| +100 setzt 100 | 100 | ✅ 100 |
| Manuelle Menge funktioniert | ja | ✅ unverändert |
| Standard +/- funktioniert | ja | ✅ unverändert |
| Dropdown „Bestellung als" | Privatkunde, Gewerbekunde | ✅ defensiv gefiltert |
| Steuerhinweis Privatkunde | `inkl. 0% Umsatzsteuer gem. § 12 Abs. 3 UStG` | ✅ Live: 1 Treffer |
| Steuerhinweis Gewerbekunde | `inkl. 19% Umsatzsteuer` | ✅ Live: 1 Treffer |
| Auf Lager grüner Indikator | sichtbar | ✅ `.bz-stock-dot` pulsiert |
| Lieferzeit 1–3 Tage unter Preis | sichtbar | ✅ `.bz-stock-delivery` |
| Gratis Versand ab 100 € unter Tax-Note | sichtbar | ✅ `.bz-price-usp` |
| Made in Germany unter Tax-Note | sichtbar | ✅ `.bz-price-usp` |
| `4,8 / 5 (120+ Bewertungen)` | entfernt | ✅ grep = 0 |
| `Käuferschutz inklusive` | entfernt | ✅ grep = 0 |
| `Trusted Shops bewertet · 500+` | entfernt | ✅ grep = 0 |
| alte „Lieferung 1–3 Werktage"-Kachel | entfernt | ✅ grep = 0 |
| `30 Tage Rückgabe` | entfernt | ✅ grep = 0 |
| Metafield-Renderer leer-sicher | ja | ✅ `continue`+section-capture |
| H1 genau 1× | ja | ✅ 1 H1 (Produkttitel) |
| Product-JSON-LD | erweitert | ✅ AggregateOffer, shipping, returns, additional properties |

**Live-Check** auf https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne:
- Alle Soll-raus-Strings = **0 Treffer**
- Alle neuen Strings **vorhanden**

---

## 4. Manuelle Restschritte

**Keine** im Shopify-Admin oder in Apps nötig. Trusted Shops war komplett im Theme hartcodiert; keine verlinkte App, kein externes Script gefunden.

**Nice-to-Verify (optional):** Im Shopify-Theme-Customizer unter `/admin/themes/current/editor` → App-Embeds-Drawer manuell prüfen, ob dort ein Trusted-Shops-Toggle aktivierbar wäre. Wurde nicht getestet, da derzeit nichts eingebunden ist.

---

## 5. Unsicherheiten

> **„Ich kann das nicht bestätigen."**

- **App-Embed-Toggle im Theme-Customizer**: Shopify-Customizer kann App-Embeds per Toggle aktivieren, die nicht als Datei im Repo erscheinen. Live-HTML-Scan hat keine Trusted-Shops-Scripts ergeben — aber ein latent verfügbares Embed konnte ich nicht prüfen.
- **Metafield-Renderer-Testdeckung**: `file_reference`, `list.single_line_text_field`, `list.metaobject_reference`, `metaobject_reference`, `number_integer`, `single_line_text_field` sind auf dem Frankfurter-Pfanne-Produkt live verifiziert. `rich_text_field`, `boolean`, `number_decimal`, `multi_line_text_field` sind im Code behandelt, aber ohne Live-Daten auf diesem Produkt verifiziert.

---

## 6. Git

**Branch:** `feat/pdp-frankfurter-pfanne-ui-seo`

**Commits (chronologisch):**
1. `1538430` — `fix(product): correct quantity shortcut behavior on PDP`
2. `9620be7` — `feat(product): simplify customer type selector and dynamic tax note`
3. `3dc6a9c` — `refactor(product): rebuild price-adjacent info block for conversion clarity`
4. `a1aa273` — `feat(product): add extensible dynamic metafield renderer`
5. `4c00894` — `improve(seo): refine PDP semantics and product content relevance`

**Remote:** gepusht auf `origin/feat/pdp-frankfurter-pfanne-ui-seo`

**Shopify Live-Theme:** `blechziegel/main` (#193125220736) — beide Dateien deployed

---

## 7. Erweiterbarkeit

### Neues Metafield auf der PDP anzeigen

Ein Eintrag in der `FIELDS`-Liste in [`snippets/bz-product-metafields.liquid`](../snippets/bz-product-metafields.liquid):

```liquid
assign FIELDS = '...,custom.neues_feld|Anzeige-Label|einheit|sortier_nr' | split: ','
```

Format: `namespace.key | Label | Einheit | Priority`

- Leere Einheit → kein Unit-Suffix
- Priority steuert die Reihenfolge (kleiner = oben)
- Leer-sicher: Metafield ohne Wert wird nicht ausgegeben