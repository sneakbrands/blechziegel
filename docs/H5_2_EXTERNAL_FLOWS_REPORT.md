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

## 6. Konkrete Empfehlungen (minimal, **kein Theme-Fix**, **kein internes Vendor-Edit**)

Gemäß verbindlicher Projektregel „Externe Brand-Normalisierung": `product.vendor` intern unverändert lassen (darf `BHE Metalle` bleiben). Stattdessen überall dort, wo extern sichtbares Brand-Mapping existiert, auf `blechziegel.de` umstellen.

1. **Google Merchant Center → Attributregeln / Supplemental Feed**
   `brand`-Attribut explizit auf den statischen Wert `blechziegel.de` setzen (oder auf ein dediziertes Metafeld, das diesen Wert liefert). Kein Fallback auf `vendor` mehr.

2. **Meta Commerce Manager → Data Source Mapping**
   Gleiches Mapping wie #1 für den Meta-Katalog: `brand` → `blechziegel.de`.

3. **Shopify Admin → Einstellungen → Customer Events**
   Alle aktiven Custom Pixels durchsehen. Für Pixels, die "Viewed Product" / "Added to Cart" abonnieren, prüfen welche Felder weitergereicht werden. Falls `brand`/`vendor` enthalten sind, im Pixel-Code den Wert durch `blechziegel.de` ersetzen oder das Feld beim Weiterleiten filtern.

4. **Shopify Admin → Apps (Reviews, ERP-Sync, Feed-Tools, Preisvergleich)**
   Drittanbieter-Apps auflisten und einzeln prüfen: verwenden sie `product.vendor` als Markenname? Wenn möglich, Brand-Override auf `blechziegel.de` konfigurieren.

5. **Storefront-Pixel-Payload (`ShopifyAnalytics.lib.track`)**
   Shopify befüllt `"brand"` automatisch aus `product.vendor` — das ist nicht direkt konfigurierbar, da serverseitig gerendert. Mitigation ausschließlich über Empfehlungen #3 + #4 (Custom Pixel Filter / Sink-Mapping).

Empfehlung #1 + #2 sind Single-Point-Fixes mit dem größten Hebel — beide eliminieren den Brand-Leak in genau der Pipeline, in der er kundenseitig am sichtbarsten ist (Shopping-Anzeigen, Katalog-Listings).

---

## 7. Brand-Normalisierung BHE Metalle → blechziegel.de

| Quelle | Aktueller Wert | Zielwert | Änderung möglich | Status |
|---|---|---|---|---|
| Theme-Code / PDP JSON-LD (`sections/blechziegel-product.liquid:1766`) | `Blechziegel.de` (manuell, Theme-kontrolliert) | `blechziegel.de` laut Regel | Ja, im Theme änderbar | **Nicht geändert** — laut H5-Scope war dieser Wert als korrekt bewertet und explizit vom Anfassen ausgenommen. Abweichung Groß-/Kleinschreibung notiert, bewusst nicht migriert ohne Freigabe. |
| `ShopifyAnalytics.lib.track("Viewed Product", {brand: "BHE Metalle", …})` (PDP) | `BHE Metalle` | `blechziegel.de` | Nein (Shopify-interner Server-Renderer) | Nicht direkt änderbar — nur via Custom Pixel Filter oder durch Admin-Vendor-Bulk-Edit adressierbar, letzteres laut Regel **verboten** |
| Monorail / Trekkie (`trekkie_storefront_viewed_product`) | `BHE Metalle` | `blechziegel.de` | Nein (Shopify-intern) | Gleiche Lage wie oben — nicht direkt konfigurierbar |
| Cart-Pixel-JSON (`"product":{"vendor":"BHE Metalle"}`) | `BHE Metalle` | n/a (kein `brand`-Alias aktiv) | Nein | Kein direkter Brand-Leak — bleibt Klasse B |
| Google Merchant Center Produktfeed (`brand`-Attribut) | **Ich kann das nicht bestätigen.** Kein Zugang. Vermutlich `vendor` = `BHE Metalle` als Standard. | `blechziegel.de` | Ja (Attribute Rules / Supplemental Feed), aber nur mit Admin-Zugang | **Handlung erforderlich**: Brand-Mapping extern auf `blechziegel.de` umstellen. |
| Meta Commerce Manager Katalog (`brand`) | **Ich kann das nicht bestätigen.** Kein Zugang. | `blechziegel.de` | Ja, aber nur mit Admin-Zugang | **Handlung erforderlich**: Brand-Mapping extern auf `blechziegel.de` umstellen. |
| Shopify Custom Pixels — Weitergabe von `brand`/`vendor` an GA4/Meta/Klaviyo etc. | **Ich kann das nicht bestätigen.** Kein Admin-Zugang. | `blechziegel.de` (falls Feld beibehalten wird) | Ja, im Pixel-Code (Custom Pixel Sandbox) | **Handlung erforderlich**: Brand-Mapping extern auf `blechziegel.de` umstellen. |
| Drittanbieter-Apps (Reviews, ERP, Feed-Tools) | **Ich kann das nicht bestätigen.** | `blechziegel.de` | Je nach App | **Handlung erforderlich**: Brand-Mapping extern auf `blechziegel.de` umstellen. |
| Shopify Search & Discovery (Collection-Vendor-Filter) | nicht aktiv (Live-Audit bestätigt) | n/a | — | Kein Risiko, bereits sauber konfiguriert |
| CSV-Produktexport | `vendor`-Spalte = `BHE Metalle` | intern lassen (Regel: nicht migrieren) | Nein (nicht kundenseitig) | Kein Kunden-Risiko, bleibt Klasse A |

### Abschluss-Fragen

- Wurde `BHE Metalle` irgendwo **extern als Brand** gefunden? **Ja** — nachweisbar im Shopify-Storefront-Pixel-Payload (`"brand":"BHE Metalle"` × 2 auf PDP). Vermutlich zusätzlich in Merchant-Center-Feed und Meta-Katalog, dort aber nicht direkt bestätigbar.
- Wurde auf `blechziegel.de` **umgestellt**? **Nein**.
- Warum nicht?
  1. **Theme-seitig**: H5/H5.2 ist analyse-orientiert, keine Theme-Änderung in Scope. JSON-LD-`brand` ist laut H5-Scope explizit als „nicht anfassen" markiert (Groß-/Kleinschreibung zu `blechziegel.de` bräuchte ausdrückliche Freigabe).
  2. **ShopifyAnalytics.lib.track / Monorail**: serverseitig von Shopify gerendert, nicht konfigurierbar. Einziger Weg wäre interner Vendor-Edit — laut Zusatzregel explizit verboten.
  3. **Merchant Center, Meta Commerce, Custom Pixels, Apps**: Zugang fehlt in dieser Session. **Ich kann das nicht bestätigen.** Handlungsempfehlung: Brand-Mapping extern auf `blechziegel.de` umstellen.

---

## 8. Abschlussstatus

- H5.2 abgeschlossen: **Ja** (Theme-/Code-Review + Live-Storefront-Audit vollständig).
- Kritische externe Vendor-Leaks: **Ja — Klasse C** via `ShopifyAnalytics.lib.track("Viewed Product")`. Im Theme nicht behebbar; interner Vendor-Edit laut Regel ebenfalls nicht erlaubt.
- Brand-Normalisierung auf `blechziegel.de` umgesetzt: **Nein** — alle offenen Pipelines (Merchant Center, Meta Commerce, Custom Pixels, Drittanbieter-Apps) liegen außerhalb des einsehbaren Scopes.
- Nicht verifizierbare Bereiche (Klasse D):
  - Google Merchant Center Produktfeed — „Ich kann das nicht bestätigen." → **Brand-Mapping extern auf `blechziegel.de` umstellen.**
  - Meta Commerce Manager Katalog — „Ich kann das nicht bestätigen." → **Brand-Mapping extern auf `blechziegel.de` umstellen.**
  - Aktive Shopify Custom Pixels und deren Feld-Weitergabe — „Ich kann das nicht bestätigen." → **Brand-Mapping extern auf `blechziegel.de` umstellen.**
  - Installierte Drittanbieter-Apps und deren Vendor-Nutzung — „Ich kann das nicht bestätigen." → **Brand-Mapping extern auf `blechziegel.de` umstellen.**
- Nächster Schritt: Empfehlungen #1 + #2 (Merchant Center + Meta) im jeweiligen Admin-Interface ausführen, dann Re-Audit via `scripts/coll-test/h52-external-flows.mjs`. Storefront-Pixel-Leak wird dadurch nicht beseitigt (Shopify-seitig), aber die beiden größten externen Kundensichtbarkeiten sind abgesichert.

---

## 9. Geänderte/neue Dateien

- `scripts/coll-test/h52-external-flows.mjs` (Live-Audit-Skript: Collection-Filter, dataLayer, Pixel-Payload, Outbound-Tracking, Shopify-App-Scripts)
- `scripts/coll-test/h52-locate-brand.mjs` (lokalisiert `"brand":"BHE Metalle"` im HTML inkl. Script-Block-Kontext)
- `CLAUDE.md` (Projektregel „Externe Brand-Normalisierung" dauerhaft festgehalten)

**Keine Theme-Dateien geändert.**
