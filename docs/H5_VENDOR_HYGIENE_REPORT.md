# H5 — Vendor-Hygiene (Theme-Fix)

Projekt: blechziegel.de Shopify-Theme
Branch: feat/ziegel-finder-enterprise
Stand: 2026-04-17
Scope: minimal, nur Theme. Keine Architekturänderung, keine Feed-/App-Anpassung.

---

## 1. Ausgangslage

### Datenlogik (verbindlich, nicht verändert)

- `product.vendor` = Shop-Produkthersteller / interner Lieferant → im Shop „BHE Metalle"
- `product.tags` = Struktur-/Breadcrumb-Achse
- `product.metafields.custom.passende_hersteller` = Kunden-Kompatibilitätslogik

`vendor` darf niemals als kundenseitige Hersteller-Anzeige oder als Struktur-Achse auftauchen.

### Vor H5 identifizierte Risiken im aktiven Theme

| Datei | Stelle | Problem |
|---|---|---|
| `snippets/cart-products.liquid:181-185` | Cart-Line-Item | `{% if item.product.vendor and block_settings.vendor %}{{ item.product.vendor }}{% endif %}` — reaktivierbarer Render-Pfad |
| `blocks/_cart-products.liquid:52-57` | Block-Schema | Theme-Editor-Checkbox `vendor`, `default: false` — würde bei Aktivierung „BHE Metalle" im Cart sichtbar machen |
| `templates/cart.json:36` | Cart-Template | `"vendor": false` — korrekte explizite Deaktivierung, aber Schalter existiert noch |

Kein aktiver Leak, aber latenter Leak-Vektor: ein Klick im Theme-Editor hätte „BHE Metalle" als Pseudo-Hersteller an jede Cart-Zeile gebracht → Verwechslung mit Dachziegel-Herstellern (Braas, Bramac, Creaton, Nelskamp …).

Korrekt bewertet, nicht verändert: PDP-JSON-LD (brand manuell auf „Blechziegel.de"), `custom.passende_hersteller`, Breadcrumb/Tags, Finder, Locale-Schemata, `.bak`-Dateien.

---

## 2. Umsetzung (Diff)

```diff
diff --git a/blocks/_cart-products.liquid b/blocks/_cart-products.liquid
@@ -49,12 +49,6 @@
       "label": "t:settings.dividers",
       "default": true
     },
-    {
-      "type": "checkbox",
-      "id": "vendor",
-      "label": "t:settings.vendor",
-      "default": false
-    },
     {
       "type": "header",
       "content": "t:content.padding"
```

```diff
diff --git a/snippets/cart-products.liquid b/snippets/cart-products.liquid
@@ -178,11 +178,6 @@
                         {{- item.product.title -}}
                       </a>
                     </p>
-                    {% if item.product.vendor and block_settings.vendor %}
-                      <p>
-                        {{ item.product.vendor }}
-                      </p>
-                    {% endif %}

                     {%- if item.item_components.size != 0 -%}
                       <ul class="cart-items__bundle list-unstyled">
```

`templates/cart.json` wurde bewusst **nicht** geändert. Der orphan-Key `"vendor": false` löst keinen Theme-Check-Error aus; Shopify ignoriert unbekannte Block-Settings. Scope bleibt minimal.

---

## 3. Validierung

### Shopify Theme-Check

| Lauf | Ergebnis |
|---|---|
| Baseline (vor H5, per `git stash`) | 344 Dateien / 257 Offenses / 183 Errors / 74 Warnings |
| Nach H5-Edits | 344 Dateien / 257 Offenses / 183 Errors / 74 Warnings |

Identische Zahlen → **keine neuen Errors/Warnungen durch H5**. Für `snippets/cart-products.liquid`, `blocks/_cart-products.liquid`, `templates/cart.json` meldet Theme-Check 0 Offenses.

### Playwright / Live-Browser-Verifikation (gegen `https://blechziegel.de`)

Getestet wurde die Live-URL (Edits sind noch uncommitted). Da Live bereits auf `vendor=false` stand, ist das visuelle Verhalten pre/post-edit identisch (kein Vendor-Render); der H5-Fix entfernt nur die Reaktivierungsmöglichkeit.

Ablauf: PDP öffnen → `POST /cart/add.js` → `/cart` laden → DOM-Analyse + Screenshot.

| Test | Gerät | `visiblyRendered` | `domVisibleHits` | Screenshot |
|---|---|---|---|---|
| Cart-Rendering | Desktop 1440×900 | false | 0 | `scripts/coll-test/screenshots/h5-cart-desktop.png` |
| Cart-Rendering | iPhone 13 (390×844) | false | 0 | `scripts/coll-test/screenshots/h5-cart-mobile.png` |

**HTML-Quelltext-Analyse**: 3 Vorkommen von „BHE Metalle" gefunden — **alle in Shopify-Web-Pixel-/Customer-Events-JSON** (`"product":{"vendor":"BHE Metalle",…}`), nicht im gerenderten DOM. Diese Payloads werden von Shopify selbst (nicht vom Theme) für Analytics-Integrationen injiziert.

---

## 4. Offene externe Risiken (nicht in H5-Scope)

| Risiko | Status |
|---|---|
| Google Merchant Center liest `product.vendor` als `brand` im Produkt-Feed | Kein Feed-Template im Theme-Repo. Ich kann das nicht bestätigen. |
| Meta Commerce Catalog verwendet `vendor` als Markenname | Externe Integration. Ich kann das nicht bestätigen. |
| Shopify Web Pixels / Customer Events geben `vendor` an GA4, Meta Pixel, Klaviyo etc. weiter | DOM-Analyse zeigt: Shopify injiziert `vendor` in Analytics-JSON. Theme steuert das nicht. Ich kann das nicht bestätigen, ob Sinks es als Markenname verwenden. |
| Shopify Search & Discovery bietet `vendor`-Filter auf Collections an | Admin-App. Ich kann das nicht bestätigen. |
| Drittanbieter-Apps (Reviews, ERP, Preisvergleich) lesen `vendor` aus | App-Layer. Ich kann das nicht bestätigen. |
| CSV-Produktexporte enthalten `vendor`-Spalte | Shopify-Standard, nicht kundenseitig. |

Empfehlung für Folge-Schritt: Merchant-Center-Feed und Meta-Commerce-Katalog auf gemappte `brand`-Quelle prüfen; ggf. explizit auf Metafeld oder statischen Wert umstellen.

---

## 5. Geänderte Dateien

- `snippets/cart-products.liquid` (−5 Zeilen)
- `blocks/_cart-products.liquid` (−6 Zeilen)

Hilfsdateien (Verifikation, außerhalb Theme-Render):
- `scripts/coll-test/h5-cart-vendor.mjs`
- `scripts/coll-test/h5-cart-vendor-locate.mjs`
- `scripts/coll-test/screenshots/h5-cart-desktop.png`
- `scripts/coll-test/screenshots/h5-cart-mobile.png`

---

## 6. Abschlussstatus

- H5-Theme-Fix abgeschlossen: **Ja**
- Latenter Vendor-Leak-Vektor im Cart entfernt: **Ja**
- Sichtbare Vendor-Leaks im aktiven Theme: **Keine**
- `templates/cart.json` angepasst: **Nein** (nicht nötig)
- Theme-Check-Regression: **Keine**
- Externe Risiken bestehen weiter (Feeds, Pixel, Apps): **Ja**, außerhalb Theme-Scope

### Nächste mögliche Schritte (nicht Teil H5)

1. Commit der zwei Theme-Änderungen, Push, Preview-Theme-Smoke-Test.
2. Merchant-Center-Feed prüfen: wird `vendor` oder ein Metafeld als `brand` gemappt?
3. Meta-Commerce-Katalog auf `brand`-Quelle prüfen.
4. Shopify-Admin → Search & Discovery: `vendor` aus Collection-Filtern ausschließen, falls aktiv.
