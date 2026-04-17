# H5.2 — Externe Vendor-Datenflüsse (Audit)

Projekt: blechziegel.de Shopify-Theme
Branch: feat/ziegel-finder-enterprise
Stand: 2026-04-17
Scope: Analyse + Empfehlungen. **Keine Theme-Änderung** in dieser Phase.

---

## 1. Ausgangslage (nach H5)

- Vendor-Leak im Theme entfernt (`snippets/cart-products.liquid`, `blocks/_cart-products.liquid`).
- PDP-JSON-LD setzt `brand = "Blechziegel.de"` manuell.
- Frontend-Rendering zeigt auf PDP + Cart kein `product.vendor`.

Offene Frage: Welche externen Datenpipelines lesen `product.vendor` = "BHE Metalle" weiterhin und verwenden den Wert als Markensignal?

---

## 2. Repo-Review (Phase 1)

| Suche | Ergebnis |
|---|---|
| Feed-Templates (`.xml`, `.csv`, `merchant*`, `google*`, `feed*`, `facebook*`) | **0 Dateien** im Theme-Repo |
| Export-Skripte im Repo | **0 relevante** (nur Playwright-Tests + SEO-Skills) |
| `.github/workflows/*.yml` | **0 Dateien** — keine automatisierte Feed-Generierung |
| `apps/` Ordner im Repo | **0 Dateien** — keine Custom-App-Extension im Code |
| `gtag/dataLayer/fbq/analytics` in `.liquid`/`.js` | nur `layout/theme.liquid` (GA4 + Consent Mode v2) und `snippets/blechziegel-ziegel-finder.liquid` (Finder-Events) |
| Custom dataLayer-Events | `ziegel_finder_step` + `ziegel_finder_result` mit Properties `mfrName, laenge, breite, product_matches` — **kein `vendor`** |
| JSON-LD `brand`/`manufacturer` auf PDP | manuell `brand = "Blechziegel.de"`, `manufacturer = "TiWi Trade GmbH"` — nicht aus `vendor` |

**Zwischenfazit Code-Review:** Theme-Code ist sauber. Externe Feeds/Pipelines werden nicht im Theme generiert.

---

## 3. Live-Audit (Playwright gegen https://blechziegel.de)

Abgefragt: Collection-Filter, PDP-dataLayer, PDP-Shopify-Pixel-Payload, Cart-dataLayer, Cart-Pixel-Payload, alle Outbound-Tracking-Requests, alle geladenen Shopify-App-Scripts.

### 3.1 Collection (Phase 2B, Search & Discovery)

```json
"collectionAudit": {
  "vendorFilterLabel": false,
  "vendorParamLinks": [],
  "sidebarPreview": ["FILTER · Farbe · Aluminium blank/Anthrazit/Ziegelrot · Länge 420 · Breite 330", "..."]
}
```

→ **Kein Vendor-Filter aktiv**. Search & Discovery ist sauber konfiguriert.

### 3.2 PDP

```json
"pdpDataLayer": {
  "vendorInDataLayer": false,
  "bheInDataLayer": false,
  "brandInDataLayer": false,
  "events": [ "consent/default", "js", "config G-YXNTMRFJGB", "gtm.dom", "gtm.load" ]
}
"pdpShopifyPixel": {
  "vendorKeyCount": 13,
  "brandKeyCount":  2,
  "brandSamples":   ["\"brand\":\"BHE Metalle\"", "\"brand\":\"BHE Metalle\""]
}
```

→ Eigenes gtag-Setup ist vendor-frei.
→ **Shopify-interne Analytics (ShopifyAnalytics / Trekkie / Monorail) pushen auf PDP `"brand":"BHE Metalle"`** — 2 Vorkommen.

### 3.3 Cart

```json
"cartDataLayer": { "vendorInDataLayer": false, "bheInDataLayer": false, "brandInDataLayer": false }
"cartShopifyPixel": { "vendorKeyCount": 1, "brandKeyCount": 0 }
```

→ Cart-Payload enthält `vendor` nur als Rohfeld, nicht als `brand`-Key — weniger gefährlich als PDP.

### 3.4 Outbound Tracking & Apps

```json
"trackingSummary": {
  "totalHits": 8,
  "byHost": { "www.googletagmanager.com": 3, "region1.google-analytics.com": 5 },
  "withVendorRef": 0
}
"externalScriptsSummary": { "count": 0, "byHost": {}, "samples": [] }
```

→ 8 Outbound-Calls an GTM/GA im Consent-Default-Zustand, **0 mit Vendor-Referenz**.
→ Keine Shopify-App-Scripts geladen (`apps.shopifycdn.com` / `shopifyapps.com` = 0).

---

## 4. Leak-Quelle (exakt lokalisiert, Phase 5)

```
window.ShopifyAnalytics.lib.track("Viewed Product", {
  "currency":"EUR",
  "variantId": 57686811836800,
  "productId": 15641069158784,
  "name":"PV-Dachziegel Frankfurter Pfanne - ...",
  "price":"7.79",
  "sku":"BEZ-0001-ALU",
  "brand":"BHE Metalle",              ← automatisches Mapping aus product.vendor
  "variant":"Aluminium blank / ohne Haken / Privatkunde",
  "category":"Ziegel",
  "nonInteraction": true
}, ...);
```

Shopify injiziert diesen Tracking-Call via `content_for_header` — **nicht durch das Theme steuerbar**. Jedes abonnierte Customer-Event-Pixel (Custom Pixel, installierte App-Pixels, Shopifys Google-Channel, Meta-Channel) empfängt "BHE Metalle" als Markenname.

Der gleiche Payload wird zusätzlich an `monorail://trekkie_storefront_viewed_product/1.1` gesendet (Shopifys interne Event-Pipeline).

---

## 5. Risikoklassifikation

| Fund | Klasse | Begründung |
|---|---|---|
| `ShopifyAnalytics.lib.track("Viewed Product", {… "brand":"BHE Metalle" …})` | **C** | Shopify-Standard-Mapping von `product.vendor` auf Event-Key `brand`; erreicht alle abonnierten Pixels |
| `monorail://trekkie_storefront_viewed_product` gleicher Payload | **C** | Gleiches Mapping, Shopify-interne Pipeline + ggf. weitergereicht |
| Cart-Pixel-JSON enthält `"vendor":"BHE Metalle"` ohne `brand`-Alias | **B** | Nur problematisch, wenn Subscriber Feld manuell als Marke interpretiert |
| Eigenes GA4 via gtag (`G-YXNTMRFJGB`) | **A** | Vendor-frei, Live-Outbound-Check: 0 Hits mit Vendor |
| Finder-Events `ziegel_finder_step/result` | **A** | `mfrName` stammt aus Finder-State, nicht aus `vendor` |
| JSON-LD auf PDP (`brand:"Blechziegel.de"`) | **A** | Manuell gesetzt, korrekt |
| Search & Discovery Vendor-Filter | **A** | nicht aktiv |
| Google Merchant Center Feed | **D** | Kein Zugang, kein Feed-Template im Repo — „Ich kann das nicht bestätigen." |
| Meta Commerce Katalog | **D** | Kein Zugang — „Ich kann das nicht bestätigen." |
| Aktive Shopify Custom Pixels | **D** | Kein Admin-Zugang — „Ich kann das nicht bestätigen." |
| Drittanbieter-Apps (Reviews, ERP, Feed-Tools) | **D** | Keine sichtbar im Storefront, App-Layer nicht einsehbar — „Ich kann das nicht bestätigen." |
| CSV-Produktexport | **A** (nicht kundenseitig) | Shopify-Standard, enthält Vendor-Spalte — kein Frontend-Risiko |

---

## 6. Konkrete Empfehlungen (minimal, **kein Theme-Fix**)

1. **Shopify Admin → Produkte → Bulk Edit → Vendor**
   Vendor-Wert aller Dachziegel-Produkte von "BHE Metalle" auf einen korrekten, kundenfähigen Wert setzen (z. B. `Blechziegel.de`). Punktuelle Admin-Änderung, keine Schemaänderung. Behebt in einem Rutsch:
   - Storefront-Pixel-Payload (`"brand":"Blechziegel.de"`)
   - Shopify-Standard-Feed für Google Merchant Center
   - Shopify-Standard-Feed für Meta Commerce
   - CSV-Export
   - alle abonnierten Custom Pixels ohne Einzelkonfiguration

2. **Google Merchant Center → Attributregeln / Supplemental Feed**
   `brand` explizit auf ein dediziertes Metafeld oder statischen Wert mappen statt auf `vendor`. Absichern gegen zukünftige Vendor-Fehlzuordnungen.

3. **Meta Commerce Manager → Data Source Mapping**
   Gleiche Prüfung wie #2 für den Meta-Katalog.

4. **Shopify Admin → Einstellungen → Customer Events**
   Alle aktiven Custom Pixels durchsehen. Für Pixels, die "Viewed Product" / "Added to Cart" abonnieren, prüfen welche Felder weitergereicht werden. Wenn `brand`/`vendor` enthalten, gezielt filtern oder Pixel-Subscription einschränken.

5. **Shopify Admin → Apps**
   Drittanbieter-Apps auflisten (Reviews, ERP-Sync, Feed-Tools, Preisvergleich) und einzeln prüfen: verwenden sie `product.vendor` als Markenname?

Empfehlung #1 ist der Single-Point-Fix mit dem größten Hebel. Sie liegt zwar außerhalb des Themes, fällt aber nicht unter „Datenmigration" im Schema-Sinn — sie ist eine Wert-Korrektur eines einzelnen Produkt-Felds.

---

## 7. Abschlussstatus

- H5.2 abgeschlossen: **Ja** (Theme-/Code-Review + Live-Storefront-Audit vollständig).
- Kritische externe Vendor-Leaks: **Ja — Klasse C** via `ShopifyAnalytics.lib.track("Viewed Product")`. Im Theme nicht behebbar.
- Nicht verifizierbare Bereiche (Klasse D):
  - Google Merchant Center Produktfeed — „Ich kann das nicht bestätigen."
  - Meta Commerce Manager Katalog — „Ich kann das nicht bestätigen."
  - Aktive Shopify Custom Pixels und deren Feld-Weitergabe — „Ich kann das nicht bestätigen."
  - Installierte Drittanbieter-Apps und deren Vendor-Nutzung — „Ich kann das nicht bestätigen."
- Nächster Schritt: Empfehlung #1 im Shopify-Admin ausführen, anschließend Re-Audit via `scripts/coll-test/h52-external-flows.mjs`. Erwartung: `brandSamples` = `["\"brand\":\"Blechziegel.de\""]` statt "BHE Metalle".

---

## 8. Geänderte/neue Dateien

- `scripts/coll-test/h52-external-flows.mjs` (Live-Audit-Skript: Collection-Filter, dataLayer, Pixel-Payload, Outbound-Tracking, Shopify-App-Scripts)
- `scripts/coll-test/h52-locate-brand.mjs` (lokalisiert `"brand":"BHE Metalle"` im HTML inkl. Script-Block-Kontext)

**Keine Theme-Dateien geändert.**
