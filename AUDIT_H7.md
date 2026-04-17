# H7 Enterprise Audit — blechziegel.de

**Datum:** 17.04.2026
**Branch:** `feat/ziegel-finder-enterprise`
**Theme:** blechziegel/main (#193125220736) — Horizon v3.5.0
**Auditor:** Claude Opus 4.6 (Automated E2E via Playwright + Shopify CLI)

---

## 1. CLI Ergebnis

| Check | Ergebnis |
|-------|----------|
| Theme Check | 344 Dateien geprüft |
| Errors | 183 (181x MatchingTranslations, 2x UniqueStaticBlockId) |
| Warnings | 74 (VariableName, RemoteAsset, UndefinedObject) |
| Neue Probleme | Nein — alle Errors sind fehlende Übersetzungskeys in Fremdsprachen (bg, cs, da, etc.) |

Die 181 `MatchingTranslations`-Errors betreffen nicht-deutsche Locales und sind unkritisch (Shop nur auf Deutsch). Die 2 `UniqueStaticBlockId`-Errors sollten mittelfristig behoben werden.

---

## 2. Playwright Ergebnis

| Test | Desktop | Mobile |
|------|---------|--------|
| Startseite laden | OK | OK |
| Hersteller H1 | OK | OK |
| Hersteller-Links | OK (21 Links) | OK (21 Links) |
| Collection Braas H1 | OK | OK |
| Collection Braas Produkte | OK (1) | OK (1) |
| Collection Braas Hero | OK | OK |
| Collection Bramac H1 | OK | OK |
| Collection Bramac Produkte | OK (1) | OK (1) |
| Collection Bramac Hero | OK | OK |
| PDP Multi-Brand-Pill | OK ("Passend fuer Braas · Bramac · Creaton · Nelskamp") | OK |
| PDP Brand-Links (klickbar) | WARN (0 Links) | WARN (0 Links) |
| PDP Titel | OK | OK |
| PDP Preis | OK (7,79 EUR / Streichpreis 10,99 EUR) | OK |
| PDP Add-to-Cart | OK | OK |
| PDP Zubehoer-Block | WARN (nicht per Selektor gefunden) | WARN |
| PDP Vendor "BHE Metalle" | OK (nicht sichtbar) | OK |
| Add-to-Cart AJAX | OK (0 -> 1 Item) | FAIL (Timeout — Cookie-Banner blockiert) |
| Cart Items | OK (1 Item) | OK |
| Cart Vendor-Check | OK (kein "BHE Metalle") | OK |
| Cart Total | OK (7,79 EUR) | OK |
| Finder Seite | OK (/pages/ziegel-finder) | OK |
| Finder CTA | OK | OK |

**Gesamt: 46 Tests — 41 OK, 4 WARN, 1 FAIL**

---

## 3. Seitenbewertung

| Seite | Problem | Impact | Empfehlung |
|-------|---------|--------|------------|
| PDP | Multi-Brand-Pill zeigt Hersteller, aber Links sind nicht klickbar (0 `<a>`-Tags) | Mittel | Brand-Namen als Links zu /collections/{brand} implementieren |
| PDP | Zubehoer-Block nicht per Standard-Selektoren findbar | Niedrig | Pruefen ob Block live gerendert wird oder nur bei bestimmten Produkten |
| Mobile PDP | Cookie-Banner blockiert Add-to-Cart Button — ATC-Klick schlaegt fehl | HOCH — Conversion-Blocker | Cookie-Banner z-index/Position pruefen (FIX ANGEWENDET) |
| Mobile allgemein | Cookie-Banner dominiert den gesamten Viewport auf allen Seiten | Hoch | Banner verkleinern (FIX ANGEWENDET) |
| Cart | Ueberschrift "Cart" statt "Warenkorb" | Niedrig | Locale-Key pruefen |
| Cart | "You may also like" statt deutscher Text | Niedrig | Uebersetzung anpassen |
| Cart | Zubehoer-Empfehlungen zeigen "Ausverkauft" (Haken, Versteifung) | Mittel | Ausverkaufte Produkte aus Empfehlungen filtern |
| Collection Braas | Nur 1 Produkt sichtbar | Info | Sicherstellen, dass alle passenden Produkte getaggt sind |

---

## 4. Kritische Probleme

### 1. Cookie-Banner blockiert Mobile ATC (Conversion-Blocker) — BEHOBEN

Der Cookie-Consent-Banner nahm auf Mobile (iPhone 13) den gesamten sichtbaren Bereich ein. Der Add-to-Cart-Button war nicht klickbar, bis der Banner geschlossen wurde.

**Fix angewendet:** `snippets/bz-cookie-banner.liquid` — Mobile-Styles auf Compact-Modus umgestellt:
- Body-Text ausgeblendet (Datenschutzlink ueber "Einstellungen verwalten" erreichbar)
- Max-Hoehe auf 40vh begrenzt
- Kompaktere Buttons und Abstaende

**Ergebnis nach Fix:**
| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Banner-Hoehe Mobile | ~100% Viewport | 34.8% (231px/664px) |
| Body-Text | Sichtbar (dominiert) | Ausgeblendet |
| Content sichtbar | Nein | Ja — Produktbild, Breadcrumb, Titel |
| Mobile ATC | FAIL (Timeout) | OK (0 -> 1 Items) |

### 2. Brand-Links in Multi-Brand-Pill nicht klickbar — OFFEN

Die Pill zeigt korrekt "Passend fuer Braas · Bramac · Creaton · Nelskamp", aber keiner der Namen ist als Link implementiert. Der User kann nicht von der PDP zur Hersteller-Collection navigieren.

---

## 5. Quick Wins (Top 5)

| # | Massnahme | Impact | Aufwand |
|---|----------|--------|---------|
| 1 | Cookie-Banner auf Mobile verkleinern | Sehr hoch — Mobile Conversion | ERLEDIGT |
| 2 | Brand-Namen in Pill verlinken — `<a href="/collections/braas">Braas</a>` | Mittel — interne Verlinkung + UX | Gering (Liquid-Edit) |
| 3 | Cart-Texte auf Deutsch — "Cart" -> "Warenkorb", "You may also like" -> "Das koennte dir auch gefallen" | Niedrig — Konsistenz | Minimal (Locale-Key) |
| 4 | Ausverkaufte Produkte aus Cart-Empfehlungen entfernen | Mittel — Trust | Gering (Liquid-Filter) |
| 5 | Zubehoer-Block Sichtbarkeit pruefen — verifizieren ob Block bei Frankfurter Pfanne live rendert | Mittel — Cross-Sell-Revenue | Gering (QA) |

---

## 6. Screenshots

| Datei | Inhalt |
|-------|--------|
| h7-desktop-home.png | Startseite Desktop |
| h7-mobile-home.png | Startseite Mobile (Cookie-Banner dominant — VOR Fix) |
| h7-desktop-hersteller.png | Hersteller-Hub Desktop |
| h7-mobile-hersteller.png | Hersteller-Hub Mobile |
| h7-desktop-coll-braas.png | Collection Braas Desktop |
| h7-mobile-coll-braas.png | Collection Braas Mobile |
| h7-desktop-coll-bramac.png | Collection Bramac Desktop |
| h7-mobile-coll-bramac.png | Collection Bramac Mobile |
| h7-desktop-pdp-top.png | PDP Desktop (oben) |
| h7-mobile-pdp-top.png | PDP Mobile (Cookie-Banner blockiert — VOR Fix) |
| h7-desktop-cart.png | Cart Desktop mit Produkt |
| h7-mobile-cart.png | Cart Mobile |
| h7-desktop-finder.png | Ziegel-Finder Desktop |
| h7-mobile-finder.png | Finder Mobile |
| h7-mobile-pdp-cookie-fix.png | PDP Mobile NACH Fix (Banner compact, Content sichtbar) |
| h7-mobile-home-cookie-fix.png | Home Mobile NACH Fix (Content sichtbar) |
| h7-results.json | Maschinen-lesbares Ergebnis (46 Tests) |

---

## 7. Abschluss

| Frage | Antwort |
|-------|---------|
| Conversion-ready? | Bedingt Ja — Mobile Cookie-Banner ist behoben, Brand-Links offen |
| Groesster Conversion-Killer | Cookie-Banner auf Mobile (BEHOBEN) |
| Groesster Hebel | Brand-Links in Pill verlinken + Cart-Texte eindeutschen |

### Brand-Normalisierung BHE Metalle -> blechziegel.de

| Quelle | Aktueller Wert | Zielwert | Aenderung moeglich | Status |
|--------|---------------|----------|---------------------|--------|
| PDP Body (sichtbar) | nicht sichtbar | — | — | OK |
| Cart (sichtbar) | nicht sichtbar | — | — | OK |
| Externe Feeds | Ich kann das nicht bestaetigen. | blechziegel.de | Brand-Mapping extern pruefen | Offen |

---

## Commit

- **SHA:** cb305f7
- **Branch:** feat/ziegel-finder-enterprise
- **Aenderung:** `snippets/bz-cookie-banner.liquid` — Mobile Compact Cookie Banner
- **Verifikation:** Playwright bestaetigtt: Banner 34.8% Viewport, ATC OK, Content sichtbar
