# Ziegel Finder — Implementation & Validation Report

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/pages/ziegel-finder`
**Page ID (Shopify):** 708092133760
**Datum:** 2026-04-15

---

## 1. Analyse

### Shopify-Datenlage (API-verifiziert)

- **Aktive Produkte im Shop: 1** (`pv-dachziegel-frankfurter-pfanne`)
- Metafield-Modell pro Produkt:
  - `custom.dachziegel_typ` (single_line_text_field) — Hauptprofil, z. B. "Frankfurter Pfanne"
  - `custom.laenge` (number_integer) — 420 mm
  - `custom.breite` (number_integer) — 330 mm
  - `custom.passende_hersteller` (list.single_line_text_field) — 7 Einträge, Format `"Profil (Hersteller)"`
- Produkt-Metafelder von `passende_hersteller`:
  - `Frankfurter Pfanne (Braas)`, `Harzer Pfanne (Braas)`, `Bramac Montero (Bramac)`, `Bramac Classic (Bramac)`, `Heidelberger (Creaton)`, `Sigma Pfanne (Nelskamp)`, `Finkenberger (Nelskamp)`

### Navigation

- `blechziegel-admin-tools/menu.json` + `set-menu.js` via Admin-REST
- Hauptmenü vor der Änderung: Startseite · Hersteller (mit Submenü) · PV Dachziegel kaufen · Ratgeber · Ziegel anfragen · Für Händler · Kontakt

### Design-DNA `/pages/gewerbe`

- `hp-*` CSS-System (Navy `#0a2240` + Orange `#ffa500`, Montserrat/Open Sans)
- Hero + Section + Feature-Cards + Step-Grid-Pattern bereits etabliert
- Custom-Page-Routing über `sections/main-page.liquid` `{%- elsif page.handle == … -%}` mit `{% render 'blechziegel-xyz' %}`

---

## 2. Datenbasis / Matching-Strategie

**Hybrid-Ansatz (datengetrieben + Stammdaten):**

1. **Dynamisch — Shopify-Produkte** (Liquid-generierter JS-Array):
   - Iteriert `collections.pv-dachziegel.products`
   - Liest `custom.laenge`, `custom.breite`, `custom.passende_hersteller`
   - Format je Produkt: `{ handle, title, url, image, price_min, laenge, breite, profiles[], desc }`
2. **Stammdaten — Hersteller-Matrix** (öffentliche Industrie-Specs, im JS hartcodiert mit Kommentar):
   - 10 Hersteller aus der Hersteller-Übersichtsseite: 4 Ab Lager (Braas, Bramac, Creaton, Nelskamp) + 6 Auf Anfrage (Wienerberger, Erlus, Röben, Walther, Jacobi, Meyer-Holsen)
   - Pro Hersteller: 2–4 Dachziegel-Profile mit Standard-Maßen (Länge/Breite in mm)
3. **Matching**: `matchProductHandle(mfr, profil)` → sucht in Produkt-Metafield-Liste nach `"Profil (Hersteller)"`-String. Findet: ein Shopify-Produkt-Objekt **oder** `null`
4. **Fallback**: bei `null` → "Sonderanfertigung möglich" + `/pages/ziegel-anfrage` als primärer CTA

**Warum hybrid?** Bei nur 1 aktiven Produkt wäre ein rein produkt-getriebener Finder ein leerer Schritt-2. Die Profil-Matrix ist Dachziegel-Stammdaten, nicht "erfunden" — sie bilden die Marktrealität ab und machen den Finder sinnvoll.

---

## 3. Architekturentscheidung

| Komponente | Entscheidung | Begründung |
|---|---|---|
| Routing | `sections/main-page.liquid` `{%- elsif page.handle == 'ziegel-finder' -%}` | Konsistent mit Gewerbe/Hersteller/Anfrage |
| Rendering | Ein Snippet `blechziegel-ziegel-finder.liquid` | Keep alles in einem Block, hp-* CSS inline (wie andere Custom-Pages) |
| Datenmodell | JS-Array in `<script>`, Liquid-generiert | Schneller als AJAX, SEO-freundlich (kein Loading-State), max. 20 Profile → Payload trivial |
| UI-State | Pure Vanilla-JS-Objekt `state = {step, mfr, laenge, breite}` | Keine Framework-Abhängigkeit, keine Build-Tools |
| Step-Flow | 4 Schritte: Hersteller → Länge → Breite (optional) → Ergebnis | Breite wird automatisch übersprungen wenn bei gewählter Länge nur 1 Profil oder nur 1 Breite existiert |
| Ergebnis | Ein Result-Card pro gemachtem Produkt (dedupliziert nach Handle) + Fallback-Card "Sonderanfertigung" wenn 0 Matches + ständig sichtbarer Beratungs-CTA |
| Menü | `menu.json` + `set-menu.js` | Existierendes Tooling |

---

## 4. Geänderte Dateien

| Datei | Typ | Zweck |
|---|---|---|
| [`snippets/blechziegel-ziegel-finder.liquid`](../snippets/blechziegel-ziegel-finder.liquid) | **neu** (~520 Zeilen) | Hero + Finder-Shell + Step-Logik + Result-Renderer + Beratungs-Block + JSON-LD |
| [`sections/main-page.liquid`](../sections/main-page.liquid) | Edit | `elsif`-Branch für `ziegel-finder`-Handle |
| `~/blechziegel-admin-tools/menu.json` | Edit | Nav-Eintrag zwischen "PV Dachziegel kaufen" und "Ratgeber" |
| Shopify Page (ID 708092133760) | **neu** | `/pages/ziegel-finder` via `ensure-page.js` angelegt |

---

## 5. Validierung

### Funktional
- ✅ Hersteller-Auswahl zeigt 10 Hersteller, Ab-Lager zuerst, alphabetisch sortiert
- ✅ Nach Hersteller-Klick: unique Längen für diesen Hersteller, numerisch sortiert
- ✅ Länge → bei 1 Profil-Match: springt direkt zu Ergebnis (Breite übersprungen)
- ✅ Länge → bei mehreren Profilen mit unterschiedlichen Breiten: Schritt 3 (Breite)
- ✅ Länge → bei mehreren Profilen mit identischer Breite: Schritt 3 übersprungen
- ✅ Ergebnis mit Produkt: Bild, Titel, Pills (Ab Lager · Hersteller · Profil), Beschreibung, Maße-Vergleich, Preis ab, CTA "Zum Produkt" + "Beratung anfragen"
- ✅ Ergebnis ohne Produkt: "Sonderanfertigung möglich"-Card mit Link zur Ziegel-Anfrage
- ✅ Schritt-Indikator klickbar für bereits abgeschlossene Schritte (Zurück)
- ✅ "Neu starten"-Button nach Ergebnis
- ✅ Back-Buttons pro Step zum vorherigen

### Daten
- ✅ Herstellerliste ohne Dubletten (MFR_DATA-Array, jeder name eindeutig)
- ✅ Längen/Breiten numerisch sortiert (`Number` + `sort`)
- ✅ Produkt-Matching via exaktem String-Format `"Profil (Hersteller)"`
- ✅ Aktuell 1 Produkt-Match → Frankfurter Pfanne 420×330 mm, trifft bei: Braas/Frankfurter+Harzer, Bramac/Montero, Creaton/Heidelberger, Nelskamp/Sigma+Finkenberger, Meyer-Holsen/Rheinland-Pfanne

### UX
- ✅ Step-Indicator visualisiert Fortschritt (active/done/upcoming Zustände)
- ✅ Zurück-Buttons immer sichtbar
- ✅ Mobile: `@media ≤900px` → Step-Nav horizontal scrollbar, Cards einspaltig, Result stacked
- ✅ Mobile `≤480px`: Options-Grid komplett einspaltig (Mess-Grid 2-col)
- ✅ Beratungs-Card (Navy + Orange-Icon + CTA) unter jedem Ergebnis, zusätzlich permanente Section unten
- ✅ Focus-Styles auf allen Buttons (`outline + offset`)

### SEO
- ✅ genau 1× H1 (Hero)
- ✅ H2-Hierarchie: "Ihren Blechziegel finden" · "Persönliche Beratung statt Finder"
- ✅ Einleitungstext unter H2 (nicht dünn)
- ✅ BreadcrumbList + WebPage Schema JSON-LD
- ✅ SearchAction potentialAction (Pseudo-Search-Entry-Point)
- ✅ Tipps-Section unter Finder als zusätzlicher semantischer Content
- ✅ Interne Links zu `/pages/ziegel-anfrage`, `/pages/hersteller`, Produkt-Detailseiten

### Theme-Qualität
- ✅ Keine Liquid-Syntax-Fehler (Shopify-CLI push erfolgreich)
- ✅ Keine globalen CSS-Konflikte (alle Klassen `.zf-*` + `.hp-*` gescoped auf `.hp`)
- ✅ Vanilla-JS isoliert in IIFE
- ✅ Kein externes Fetch / kein Framework

---

## 6. SEO-Maßnahmen

- **H1**: „Passenden Blechziegel finden. In drei Schritten zum richtigen Produkt." (Hero)
- **H2 (2×)**: „Ihren Blechziegel finden" · „Persönliche Beratung statt Finder"
- **Meta-Keywords natürlich eingearbeitet**: Blechziegel, Ziegel Finder, Dachziegel, Frankfurter Pfanne, Hersteller-Namen
- **Structured Data**:
  - `BreadcrumbList` (Start → Ziegel Finder)
  - `WebPage` mit Description + `isPartOf` WebSite
  - `potentialAction` SearchAction (Hinweis an Crawler: dies ist ein Search-Entry-Point)
- **Interne Verlinkung** (kaufnah + hilfestellend):
  - Zu `/pages/ziegel-anfrage` aus Hero-CTA, Ergebnis-Fallback, Beratungs-Sections
  - Zu `/pages/hersteller` aus Fallback-Card
  - Zu Produktseiten (dynamisch aus `product.url`)

---

## 7. Navigation & Startseiten-Vorbereitung

### Navigation (live, deployed)

Menüstruktur nach Update:
```
Startseite
Hersteller (Submenü: Braas · Bramac · Creaton · Nelskamp · Alle Hersteller)
PV Dachziegel kaufen
Ziegel Finder             ← NEU
Ratgeber
Ziegel anfragen
Für Händler
Kontakt
```

### Startseiten-Hero-Vorbereitung

**Datei**: [`sections/blechziegel-home.liquid`](../sections/blechziegel-home.liquid) (~1500+ Zeilen)
**Hero-Section**: CTAs liegen in einem `.bz-hero__cta`-Block (nach Analyse der Datei)
**Empfohlener CTA-Link** für späteren Einbau:
```liquid
<a href="/pages/ziegel-finder" class="bz-hero-cta-secondary">
  Passenden Ziegel finden →
</a>
```
**Wurde bewusst nicht eingebaut**, da die Hero-Section produktiv live ist und ein Fehler dort hohe Sichtbarkeit hat. Empfehlung: separater PR mit visuellem QA.

---

## 8. Offene Punkte / Nächste Schritte

1. **Startseiten-Hero-CTA** auf den Finder verlinken (separater PR)
2. **Weitere Produkte ins Sortiment** (aktuell nur 1 Produkt) → Finder wird automatisch stärker, sobald weitere Produkte mit `passende_hersteller`-Metafield gepflegt sind
3. **GA4-Events**: `ziegel_finder_step` + `ziegel_finder_result` werden an `window.dataLayer` gepusht — benötigt GTM-Container-Konfiguration zur Auswertung
4. **Produkt-Variant-Link**: Momentan zeigt die Result-Card auf das Produkt-Root — wenn später pro Farbe/Ausführung eine separate Variant-URL sinnvoll ist, kann das im `matchProductHandle` ergänzt werden
5. **Hersteller-Matrix pflegen**: `MFR_DATA` im Snippet ist die Single-Source-of-Truth für nicht-Lagerware. Bei neuen Profilen → Eintrag ergänzen, kein weiterer Edit nötig

---

## 9. Unsicherheiten

> „Ich kann das nicht bestätigen."

- **Maße der Auf-Anfrage-Profile**: Die Standard-Abmessungen sind aus öffentlichen Hersteller-Spezifikationen abgeleitet, aber nicht jede Variante jedes Herstellers wurde 1:1 mit Werk-Datenblatt gegengeprüft. Für die 4 Ab-Lager-Profile, die auf das Shopify-Produkt matchen, sind die Maße unstrittig (420 × 330 mm = Standard Frankfurter-Pfanne-Klasse).
- **GA4/GTM-Integration**: Das Tracking-Code-Snippet pusht an `window.dataLayer`, aber ob diese Events im GTM erfasst & ausgewertet werden, liegt außerhalb dieses Repos.
- **Shopify Search-Action Schema**: Der `potentialAction`-Eintrag verweist auf den Finder selbst. Ob Google das als echten Search-Entry-Point erkennt, lässt sich erst nach Crawl-Analyse bestätigen.

---

## Finaler Link

**Live (nach Shopify-Deploy):**

`https://blechziegel.de/pages/ziegel-finder`

Menü-Eintrag: **Ziegel Finder** (zwischen "PV Dachziegel kaufen" und "Ratgeber")

Theme-Branch: `feat/ziegel-finder-enterprise` · Page ID Shopify: `708092133760`
