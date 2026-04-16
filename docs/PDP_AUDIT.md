# PDP Audit — `/products/pv-dachziegel-frankfurter-pfanne`

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/products/pv-dachziegel-frankfurter-pfanne`
**Stand:** 2026-04-16
**Referenz-Qualitätsmaßstab:** [`sections/blechziegel-home.liquid`](../sections/blechziegel-home.liquid) (nach Phase 1–3 + Polish)

---

## 1. Ist-Analyse

### Beteiligte Dateien

- [`templates/product.json`](../templates/product.json) → routet auf `blechziegel-product` + `product-recommendations`
- [`sections/blechziegel-product.liquid`](../sections/blechziegel-product.liquid) — **1708 Zeilen, selbstenthaltene PDP** (CSS + HTML + Liquid + JS)
- [`snippets/bz-product-metafields.liquid`](../snippets/bz-product-metafields.liquid) — rendert Produkt-Specs dynamisch aus Metafields
- Backup-Files (`.bak`, `.bak3`, `.bak4`) im Repo — nicht im Scope

### Hauptprobleme auf einen Blick

- **PDP vom `cf_*`-System der Home-Section abgekoppelt** — alles hardcoded statt zentral gepflegt
- **Schema hat `"settings": []`** (L1701) — keine Admin-Kontrolle über Commerce-Fakten
- **Staffelpreise statisch** (7,49/7,19/6,89 €) mit TODO-Kommentar (L1001–1002)
- Rating „4,9 / 5" hardcoded (L940) — keine Datenquelle
- „Made in Germany" als Hero-Badge (L927) — widerspricht der nach Phase-3-Polish etablierten „gelasert"-Formulierung
- „Lieferzeit 1–3 Werktage" + „DHL" dreifach hardcoded (Hero, Tech-Table, JSON-LD)

**Funktional OK:** Variantenlogik, Umsatzsteuer-Toggle, Stock-Status, Sticky-ATC mobile, JSON-LD-Gerüst

---

## 2. UX-Audit

### A. Produktverständnis & Klarheit

- **H1 sauber:** `{{ product.title }}` (L931) ✓
- **Subline effektiv:** „Kein Ziegelbruch. Kein Bohren. Einfach den Tonziegel entnehmen, Blechziegel einsetzen – fertig." (L934–935) ✓
- **Farb-Swatches** (3 Varianten, L1048–1068) ✓
- **„Mit/Ohne Haken"**-Dropdown mit Label-Erklärung (L1082–1085) ✓
- **„Bestellung als" (Privat/Gewerbe)** (L1075) — ⚠️ visuell zu schwach für B2B-Nutzer, blendet sich unter andere Optionen
- **Mobile:** Grid collapsed bei 900px ✓

### B. Friction im Kaufpfad

- Buy-Button prominent (L1107–1110) ✓
- ATC-Text „In den Warenkorb" ✓
- Quantity +/− native (L1104–1106)
- Tier-Buttons +25/+50/+100 **setzen Menge** (nicht aufaddieren) — L1438–1449, UX korrekt
- Sticky-Mobile-ATC (L1368–1390), erscheint wenn Haupt-ATC out-of-view (L1606–1613) ✓
- Keine Chat-Walls, keine Zwangsanmeldung ✓

---

## 3. Conversion-Audit

### Preis & Umsatzsteuer — **korrekt implementiert**

```liquid
<span data-tax-private{% if variant.option3 == 'Gewerbekunde' %} hidden{% endif %}>inkl. 0% Umsatzsteuer gem. § 12 Abs. 3 UStG</span>
<span data-tax-business{% if variant.option3 != 'Gewerbekunde' %} hidden{% endif %}>inkl. 19% Umsatzsteuer</span>
```
(L957–960, Toggle-Logik in `bzUpdateTaxNote()` L1494–1503) ✓

### Stock & Lieferzeit

- Stock-Indicator mit grünem Dot (L971–980) ✓
- Variant-aware Update (L1530–1537) ✓
- Lieferzeit „1–3 Werktage" **hardcoded** (L979, L1201, JSON-LD L1681)
- **Gap:** Versandkostenfrei-Schwelle fehlt auf PDP komplett — Home zeigt sie, PDP nicht. Geld liegt am Warenkorb auf dem Tisch.

### Trust-Elemente

- Rating „4,9 / 5" (L940) — **hardcoded, nicht an Shopify-Reviews/Metafield gekoppelt**
- Mini-USPs unter Preis (L1120–1135): „Kein Ziegelbruch · Passgenau · Schnelle Montage · **25+ Jahre Lebensdauer**" — die 25+-Zahl wurde auf der Home bewusst entschärft, steht auf der PDP weiter drin (Inkonsistenz)
- Beratungs-Link (L1113) ✓
- Feature-Cards (L1305+): Projektpreise + Downloads — B2B-stark ✓

### B2B-Logik

- „Bestellung als" wirkt korrekt auf Tax-Note (L1528) ✓
- **Staffelpreise statisch** (L1004–1034) mit TODO-Kommentar — nicht rechtlich bindend („Richtwerte"), aber unflexibel
- Projektpreis-CTA → `/pages/contact` (L1319) — **veralteter Pfad**, Home nutzt `/pages/ziegel-anfrage`

---

## 4. SEO-Audit

- **H1:** Einmal vorhanden, korrekt (L931) ✓
- **H2:** „Gebaut für den Einsatz auf der Baustelle" (L1243) ✓
- **H3/H4:** Tabs, FAQ, Feature-Cards (L1164–1258) — gute semantische Tiefe ✓
- **Meta-Description:** Über `product.description` (nicht im Section-Scope — Ich kann das nicht bestätigen, wie sie gesetzt ist)
- **Description-Tabs** (L1157–1185): Zielgruppen, Einsatz, Materialvorteile, Farben ✓
- **FAQPage-Schema:** L1218–1225 ✓
- **Product-JSON-LD:** L1619–1694
  - `AggregateOffer` mit lowPrice/highPrice, `hasMerchantReturnPolicy` (14 Tage, gratis), `shippingDetails` (handlingTime 0–1, transitTime 1–3, 0,00 EUR) ✓
  - Metafield-Integration für `dachziegel_typ`, `laenge`, `breite`, `passende_hersteller`, Material (L1622–1626) ✓
  - Return/Transit-Zeiten dupliziert in JSON-LD, ebenfalls hardcoded

---

## 5. Daten-/Metafield-Audit

### Hardcoded vs. Dynamisch

| Element | Aktuell | Soll |
|---|---|---|
| Stock-Label | „Auf Lager" (L927) | `cf_stock_label` |
| Lead-Time | „Lieferzeit 1–3 Werktage" (L979) | `cf_lead_time` |
| Carrier | „DHL" (L1201, L1681) | `cf_carrier` |
| Origin (Hero-Badge) | „Made in Germany" (L927) | `cf_origin` („In Deutschland gelasert") |
| Free-Versand-Schwelle | nicht sichtbar | `cf_free_threshold` (konditional) |
| Staffelpreise | statische Werte (L1013/1017/1021) | `custom.tier_pricing` JSON-Metafield |
| Return-Days | „14" in JSON-LD (L1688) | `cf_return_days` |
| Rating | „4,9 / 5" (L940) | Shopify-Review-App oder Metafield |
| „25+ Jahre Lebensdauer" | hardcoded in Mini-USP (L1120+) | entschärfen wie auf Home |

### Aktiv genutzte Metafields ✓

- `custom.dachziegel_typ`, `custom.laenge`, `custom.breite`, `custom.passende_hersteller`
- `shopify.shingle-tile-material`
- `custom.montageanleitung_mit_haken` / `_ohne_haken` (PDF-Links, L1321–1322)
- Rendering-Pipeline über [`snippets/bz-product-metafields.liquid`](../snippets/bz-product-metafields.liquid) — erweiterbar ✓

### `cf_*`-Lücke

Home nutzt `section.settings.cf_*`. PDP-Schema ist leer (L1701: `"settings": []`). Jede Änderung an Logistik/Herkunft erfordert Code-Edit statt Admin-Klick — **doppelter Wartungsaufwand + Inkonsistenzrisiko**.

---

## 6. Priorisierte Schwächen

### P1 — jetzt angehen

1. **„Made in Germany" als Hero-Badge** (L927) — widerspricht Home-Phase-3-Entscheidung. Sofort auf `cf_origin` umstellen.
2. **„25+ Jahre Lebensdauer"** (L1120+ Mini-USPs) — auf Home entschärft, auf PDP weiter hart. Ich kann das nicht bestätigen.
3. **`cf_*`-Settings ins PDP-Schema** — `cf_stock_label`, `cf_lead_time`, `cf_cutoff_hour`, `cf_carrier`, `cf_origin`, `cf_free_threshold`. Hardcoded Werte an L927, L979, L1201, L1681 ersetzen.
4. **`/pages/contact` → `/pages/ziegel-anfrage`** (L1319) — Konsistenz mit Home.
5. **Versandkostenfrei-Schwelle anzeigen** — wenn `cf_free_threshold` gesetzt, unter Lieferzeit/Stock rendern. Sonst unterschlagen.
6. **FAQ-Shipping-Text** (falls hardcoded im FAQ-Block auf PDP) — aus `cf_*` zusammensetzen wie auf Home.

### P2 — Feinschliff

7. **Rating dynamisieren** — Shopify-Reviews oder Metafield `custom.rating` + `custom.rating_count`; Fallback: Rating-Block ausblenden statt statisch anzeigen.
8. **„Bestellung als" prominenter** — Segmented Control (Privat / Gewerbe) statt Dropdown, ganz oben im Selection-Stack.
9. **Low-Stock-Signal** — neues Metafield `custom.low_stock_threshold`, JS zeigt „Nur noch X Stück verfügbar" wenn `variant.inventory_quantity < threshold`.
10. **Tote CSS/Artefakte** im Product-Section screenen (analog Home-Cleanup).

### P3 — später, mit Produkt-Ausbau

11. **Staffelpreis-Metafield** `custom.tier_pricing` (JSON-List) + Liquid-Loop + Tier-Buttons aus Daten.
12. **Sticky-Gallery mobile** (L37: `top: 90px`) auf Mobile verifizieren / CSS-Variable aus Header-Höhe.
13. **Organization/Seller-Context** in JSON-LD (Shop-Daten, Local-Business falls relevant).

---

## 7. Empfohlene Soll-Struktur

1. **Top-Leiste:** Origin-Badge (`cf_origin`) · Stock (`cf_stock_label`)
2. **Above-Fold 2-Spalter:**
   - **Links:** Gallery + Thumbnails
   - **Rechts:**
     - H1 (Produkttitel)
     - Subline (Produkt-Nutzen)
     - Rating (nur wenn Daten vorhanden)
     - Preis + Compare-at
     - VAT-Note (toggles Privat/Gewerbe)
     - Stock-Dot + Lieferzeit (`cf_*`) + Versandschwelle (`cf_free_threshold`, konditional)
     - Mini-USPs (entschärft, ohne „25+ Jahre")
     - Divider
3. **Selection & Purchase:**
   - **Kundentyp-Segmented-Control** (Privat / Gewerbe) — prominent
   - Staffelpreise (metafield-driven)
   - Farbe (Swatches)
   - Mit/Ohne Haken
   - Quantity + ATC
   - Beratungs-Link → `/pages/ziegel-anfrage`
4. **Trust Below-Fold:**
   - Feature-Cards (Projektpreise, Downloads) — mit korrektem Anfrage-Pfad
   - Reviews-Strip (dynamisch aus Metafields/App, sonst weglassen)
5. **Content-Tiefe:**
   - Tabs: Beschreibung / Tech-Daten (Metafield-Tabelle) / FAQ
6. **Related Products** (bereits via `product-recommendations`) ✓

---

## 8. Umsetzungsplan (3 Phasen)

### Phase PDP-1: `cf_*` + Copy-Konsistenz (klein, 1 Commit)

- PDP-Schema um `cf_*`-Settings erweitern (analog Home)
- Hero-Badge L927 auf `cf_origin`/`cf_stock_label` umstellen
- „Made in Germany" und „25+ Jahre Lebensdauer" im Body entfernen/entschärfen
- Lieferzeit/Carrier/Return-Days an allen drei Stellen (Hero, Tech-Table, JSON-LD) auf `cf_*` umstellen
- `/pages/contact` → `/pages/ziegel-anfrage`
- Versandkostenfrei-Schwelle konditional anzeigen
- FAQ-Versandantwort aus `cf_*` zusammensetzen

**Commit:** `refine(pdp): adopt central commerce facts and align copy with home`

### Phase PDP-2: Trust & UX (mittel)

- Rating: dynamisch aus Metafield oder ausblenden
- „Bestellung als" als prominentes Segmented Control
- Low-Stock-Threshold-Metafield + JS-Signal
- Tote CSS-Regeln raus

**Commit:** `improve(pdp): strengthen trust signals and customer-type selection`

### Phase PDP-3: Staffelpreise dynamisch (größer)

- Metafield `custom.tier_pricing` (JSON) definieren
- Liquid-Loop für Tier-Tabelle
- Tier-Buttons aus Daten generieren
- Admin-Doku für Pflege

**Commit:** `feat(pdp): metafield-driven tier pricing`

---

## Gesamturteil

**Ja — die PDP liegt deutlich hinter der Homepage.**

- **Design/Layout:** visuell poliert, gut strukturiert ✓
- **Funktional:** Varianten, VAT-Toggle, Stock-Logik korrekt ✓
- **Conversion-Pfad:** reibungsarm ✓
- **Wartbarkeit:** **schlecht** — alles hardcoded, PDP ignoriert das `cf_*`-System, das auf der Home als Standard etabliert wurde
- **Copy-Konsistenz:** **gebrochen** — „Made in Germany" und „25+ Jahre" stehen hier weiter, nachdem sie auf der Home bewusst entschärft wurden

**Empfehlung:** Phase PDP-1 (reiner Copy+`cf_*`-Sync) ist ein **kleiner, hochwirksamer Commit** und sollte direkt als Nächstes kommen. Phase PDP-2/3 danach getaktet.

**Nicht verifizierbar:** Tatsächliche Rating-Quelle, FAQ-Shipping-Text-Position, Meta-Description-Content, Mobile-Sticky-Gallery-Verhalten auf echten Geräten — **„Ich kann das nicht bestätigen."**
