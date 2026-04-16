# Audit — `/pages/projekt-anfrage`

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/pages/projekt-anfrage`
**Stand:** 2026-04-16 (nach ANF-ARCH-1 + Cleanup)
**Referenz:** `/pages/gewerbe` (Qualitätsmaßstab B2B) · `/pages/ziegel-anfrage` (Parallel-Funnel)

---

## 1. Ist-Analyse

### Beteiligte Dateien

- [`templates/page.json`](../templates/page.json) — generisch
- [`sections/main-page.liquid:23`](../sections/main-page.liquid#L23) — routet `page.handle == 'projekt-anfrage'` auf das Snippet
- [`snippets/blechziegel-projekt-anfrage.liquid`](../snippets/blechziegel-projekt-anfrage.liquid) — **556 Zeilen** (CSS + HTML + Liquid + JS), selbstenthaltene Landing
- **Backend:** FormSubmit.co (identisch zu `ziegel-anfrage`, eigener `_subject`)
- **Shopify-Page-Entity:** angelegt (`ensure-page.js`, ID `708103831936`), Body leer — Inhalt aus Snippet

### Aktuelle Struktur

1. **Hero:** Kicker · H1 (B2B-fokussiert) · Sub · 4 Trust-Items
2. **Form-Section:** 2-Spalter (Form-Card + Side-Info), Form gegliedert in 4 nummerierte Blöcke
3. **Final-CTA-Section:** E-Mail + Gewerbe + Händler-Buttons

### Rolle im Gesamtfluss

Zielseite für **4 inbound Links** (aus ANF-ARCH-1):
- Home Final-CTA B2B-Card
- PDP Project-Note unter ATC
- PDP Service-Path „Projekt oder Sonderprofil?"
- PDP Feature-Card „Projekt-Konditionen anfragen"
- Neu (Cleanup): Home Service-Card 03 „Projektpreise für Profis"-Inline-Link

---

## 2. B2B-/Projekt-Audit

### Wirkt die Seite als echter B2B-Funnel?

**Teilweise.** Die Struktur ist klar B2B-orientiert (Firma required, Rolle-Feld, Segmented-Control Sonderprofil, Projektart-Select, Mengen-Range, Multi-Upload). Aber:

- Zwischen Hero und Formular fehlt ein **Nutzen-/Kontext-Block** („Warum Projektanfrage hier?") — das Gewerbe-Muster nutzt einen kurzen Value-Block vor dem CTA
- Es fehlt ein **„So läuft die Projektanfrage"-Block** (wie ihn `ziegel-anfrage` hat) — B2B-Nutzer wissen nicht, was nach dem Absenden passiert
- „Netto-Preise für Gewerbe" als Hero-Trust ist hart — funktioniert nur, weil PDP-Preise tatsächlich umschaltbar sind. **Ich kann das nicht bestätigen**, dass das auf Checkout-Ebene sauber greift.

### Sind die Felder ausreichend für einen guten Projektlead?

**Knapp ausreichend.** Die harten Projekt-Trigger (Projektart, Menge-Range, Sonderprofil-Flag) sind da. Aber:

- **Fehlt:** Feld für gewünschten Liefertermin/Projektstart (kritisch für B2B-Priorisierung)
- **Fehlt:** Wenn Projektart = „Sonstiges", gibt es keinen Freitext-Follow-up — Lead unpräzise
- **Fehlt:** USt.-ID / Firmensitz-Land (für echte B2B-Kalkulation, wenn Auslandskunde)
- **Schwach:** Lieferregion ist auf PLZ/Ort optional beschränkt — größere Projekte brauchen oft „Dachfläche m²"

### Welche Felder erzeugen unnötige Reibung?

- **Rolle** (optional) — gut, dass optional
- **Liefer-PLZ/Ort** (optional) — gut
- Sonst nichts offensichtlich überflüssig. Feldzahl ist vertretbar für B2B.

### Value Promise / Nutzen

- Hero-Sub: „Mengen, Sonderprofile und Rahmenverträge — individuelle Konditionen auf Basis Ihrer Projektangaben." **Gut und präzise.**
- Submit-Footer: „Rückmeldung durch einen persönlichen Ansprechpartner auf Basis Ihrer Projektangaben." **Defensiv, aber ohne zeitliche Orientierung** — B2B-Nutzer erwartet realistische Erwartung (z. B. „Meldung typischerweise innerhalb von 1–2 Werktagen nach Projektprüfung"). Ohne Zeitanker entsteht Unsicherheit.

---

## 3. UX-/Form-Audit

### Form-Blockstruktur

**Stark.** 4 nummerierte Blöcke mit orangem Label + Nummer-Badge. Sauber gegliedert, logische Reihenfolge (Projekt → Unternehmen → Details → Datenschutz).

### Submit-CTA

„Projektanfrage senden" — **solide, nicht herausragend.** Formal-neutral. Ein professionellerer Wortlaut wäre z. B. „Projektangaben senden" (weniger sales-y).

### Upload-Führung

- Multi-Upload mit Drag&Drop ✓
- Hint enthält Datei-Typen (Foto/Zeichnung/Datenblatt/PDF)
- **Schwach:** 12-MB-Gesamt-Limit wird erst bei Überschreitung gemeldet, nicht präventiv (z. B. Live-Counter „3,2 MB / 12 MB"). Für große Zeichnungs-PDFs relevant.
- Keine Liste der erlaubten Format-Extensions im sichtbaren Hint (nur im `accept`-Attr)

### Mobile

- Form-Blöcke kollabieren sauber
- Radio-Group (Sonderprofil) schaltet auf 1-Spalter
- **Schwach:** Hero-H1 bricht auf kleinen Screens in 3 Zeilen mit langem Span — könnte typografisch hakelig wirken
- Submit-Button 48 px Mindesthöhe ✓

### Fehlende Elemente

- Keine Validierungs-Zusammenfassung über dem Submit (nur oberhalb Formular)
- Kein optionaler „Dateien auch nachträglich per Mail senden"-Hinweis für Nutzer mit großen Anhängen
- Kein Progress-Indikator (nicht nötig bei Single-Page, aber Nummer-Badges allein geben keinen Fortschritt)

---

## 4. Trust-/Professionalitäts-Audit

### Was gut ist

- Defensive SLA-Sprache, keine 24-h-Zusage
- Datenschutz + AGB-Link direkt bei Checkbox
- FormSubmit-Backend ist vorhanden, Honeypot + Captcha-Deaktivierung sauber gesetzt
- JSON-LD mit `BreadcrumbList`, `WebPage`, `Organization`

### Was fehlt für Enterprise-Trust

1. **Kein Zeitanker** für Antworterwartung → Nutzer weiß nicht, ob „Morgen" oder „nächste Woche" kommt
2. **Kein `ContactPoint`-Schema** → Maschinen-lesbar nicht als Geschäftskontakt identifizierbar
3. **Kein `Service`-Schema** für die angebotene Projekt-Kalkulation
4. **FormSubmit.co als Backend** — für B2B-Anfragen (Firmendaten, evtl. projektbezogene Zeichnungen) ist ein externer Dritt-Handler ohne AV-Vertrag nicht ideal. **Ich kann das nicht bestätigen**, ob ein AV-Vertrag mit FormSubmit.co existiert.
5. **Success-Seite:** beide Funnels redirecten auf `/pages/anfrage-erfolg`. Die URL liefert HTTP 200, aber ob sie inhaltlich als Erfolgsseite aufgebaut ist — **Ich kann das nicht bestätigen**. Ohne dedizierte Erfolgsseite zeigt FormSubmit einen Standard-Thank-you (Markenbruch).

### Hero-Trust-Claims geprüft

| Claim | Bewertung |
|---|---|
| Persönlicher Ansprechpartner | weich genug, OK |
| Rahmenverträge **möglich** | defensiv formuliert ✓ |
| Netto-Preise für Gewerbe | hart — hängt an PDP-VAT-Toggle. Funktioniert nur im Checkout-Flow, hier aber als Kategorische-Aussage kommuniziert |
| Sonderprofile kalkulierbar | defensiv, OK |

---

## 5. SEO-/Struktur-Audit

- **H1:** 1× vorhanden, klar („Projekt-Anfrage für Dachdecker, PV-Installateure und Betriebe.") ✓
- **H2:** 2× (Form-Section, Final-CTA) ✓
- **H3:** 0× → Heading-Tiefe gering, besonders die 4 Form-Blöcke könnten semantische Subheadings werden
- **Meta-Description:** nicht explizit gesetzt im Snippet (erbt aus Shopify-Page, die einen leeren Body hat) → **Schwäche**
- **JSON-LD:** `BreadcrumbList`, `WebPage`, `Organization` gesetzt. **Fehlt:** `ContactPoint`, `Service`, optional `FAQPage`
- **Canonical:** korrekt auf `/pages/projekt-anfrage` gesetzt
- **Interne Verlinkung:** Side-Info-Links zu `/pages/gewerbe`, `/pages/haendler`, `/pages/ziegel-anfrage` — gut
- **Suchintention:** „Projektanfrage PV-Dachziegel", „Blechziegel Sonderprofil", „Projektpreise Dachdecker" — Seite ist **semantisch passend**, aber Content-Tiefe reicht noch nicht für Top-Rankings. Für reinen Funnel-Zweck OK.

---

## 6. Antworten auf die 10 Schlüsselfragen

1. **Echter B2B-Funnel oder umetikettiertes Formular?** Schon näher am B2B-Funnel als `ziegel-anfrage`, aber fehlt ein „So läuft's"-Block und ein Nutzen-Microsection — dadurch wirkt es immer noch mehr wie Formular-first.
2. **Felder ausreichend?** Knapp ausreichend. Liefertermin + Dachfläche wären Lead-Qualitäts-Booster.
3. **Was fehlt B2B?** Liefertermin, USt.-ID/Land, Dachfläche m², „Sonstiges"-Freitext bei Projektart=Sonstiges.
4. **Reibung?** Keine offensichtliche Überbuchung. Sonderprofil-Segmented-Control mit 3 Options könnte auf Mobile in 1 Spalte ungewöhnlich wirken.
5. **Nutzenversprechen stark genug?** Hero ja, unter dem Formular nein (kein konkreter Nutzen wie „Angebot mit Mengen- und Sonderprofil-Kalkulation innerhalb weniger Werktage").
6. **Submit-CTA?** Solide. „Projektanfrage senden" — neutral, funktioniert.
7. **Uploads erklärt?** Hint ist da, aber 12-MB-Grenze wird erst bei Fehler sichtbar. Live-Counter fehlt.
8. **Cross-Link zu ziegel-anfrage sinnvoll?** Ja, im Side-Info platziert, schwächt Haupt-Funnel nicht. Gut.
9. **3 größte Conversion-Hebel:** (a) Zeitanker für Antworterwartung, (b) „So läuft es"-Block nach Formular, (c) eigene Success-Seite statt FormSubmit-Default.
10. **3 größte Schwächen:** (a) Keine dedizierte Erfolgsseite verifiziert, (b) FormSubmit.co als B2B-Backend, (c) Fehlende Zeit-Erwartung nach Submit.

---

## 7. Priorisierte Schwächen

### P1 (Conversion-/Trust-Breaking)

1. **Eigene Success-Seite** `/pages/anfrage-erfolg` (oder separate `/pages/projekt-erfolg`) bauen. Ohne dedizierte Success-Seite zeigt FormSubmit ein generisches Markenbruch-Layout. **Höchste Priorität.**
2. **Zeit-Erwartung unter Submit** ergänzen (defensiv): z. B. „Rückmeldung typischerweise innerhalb von 1–2 Werktagen nach Projektprüfung." Keine harte Zusage, aber Orientierung.
3. **„So läuft die Projektanfrage"-Block** nach Formular (3 Steps: Anfrage → Projektprüfung/Kalkulation → Angebot & Ansprechpartner). Analog zu `ziegel-anfrage`, aber B2B-Wortlaut.

### P2 (Polish)

4. **Liefertermin-Feld** (optional, Datum oder Range-Select „Geplanter Projektstart").
5. **Dachfläche in m²** (optional, number) — für Mengenkalkulation.
6. **„Sonstiges"-Follow-up:** Wenn Projektart = „Sonstiges" → JS zeigt Freitextfeld „Bitte kurz beschreiben".
7. **Upload-Size-Live-Counter** („X von 12 MB genutzt").
8. **JSON-LD:** `ContactPoint` + `Service` ergänzen.

### P3 (Enhancement)

9. **Meta-Description** aus Liquid setzen (falls Theme erlaubt) — aktuell wird Shopify-Page-Body gelesen, der leer ist.
10. **Firmenkontext-Mini-Block** zwischen Hero und Form (2–3 Bullet-Points: „Was Sie bei einer Projektanfrage bekommen: Kalkulation auf Basis Ihrer Menge · persönlicher Ansprechpartner · verbindliches Angebot nach Projektprüfung").
11. **FormSubmit-Ablösung** durch Shopify-nativen Handler oder Custom-Endpoint (DSGVO, AV-Vertrag, eigene Marken-Success-Seite).
12. **H3-Einsatz** bei den 4 Form-Blöcken für bessere semantische Tiefe.

---

## 7. Empfohlene Soll-Struktur

1. **Hero** (unverändert, klar B2B)
2. **Nutzen-Microsection** (neu, klein): 3 kompakte Bullet-Cards — „Projektkalkulation · Persönlicher Ansprechpartner · Rahmenverträge möglich"
3. **Form-Section** (aktuelle 4 Blöcke + kleine Polish-Punkte aus P2)
4. **„So läuft die Projektanfrage"** (neu, 3-Steps-Block analog zu `ziegel-anfrage` aber B2B-Wortlaut):
   - Step 1: Projektangaben senden (Formular absenden)
   - Step 2: Projektprüfung & Kalkulation (wir prüfen Maße, Profile, Mengen)
   - Step 3: Angebot & persönlicher Ansprechpartner (verbindliche Konditionen, Lieferzeit, Rahmenvertrag-Option)
5. **Final-CTA** (unverändert)
6. **Erfolgs-Seite** `/pages/anfrage-erfolg` bzw. `/pages/projekt-erfolg` mit konsistentem Branding

---

## 8. Umsetzungsplan

### Phase PA-1: Trust & Expectation (klein–mittel, 1–2 Commits)

- Success-Seite `/pages/anfrage-erfolg` als Snippet + Page-Entity
- Zeit-Erwartung unter Submit („typischerweise 1–2 Werktage")
- „So läuft die Projektanfrage"-Block (3 Steps)
- JSON-LD `ContactPoint` + `Service`

**Commits:**
- `feat(pages): add inquiry success page`
- `feat(projekt-anfrage): add process steps and response expectation`

### Phase PA-2: Lead-Qualität (klein, 1 Commit)

- Liefertermin-Feld (optional)
- Dachfläche-Feld (optional)
- „Sonstiges"-Follow-up-Freitext via JS
- Upload-Live-Counter

**Commit:** `improve(projekt-anfrage): sharpen lead quality with project details`

### Phase PA-3: Backend (größer, später)

- FormSubmit-Ablösung durch Shopify-nativen/eigenen Handler
- AV-Vertrag / DSGVO-Review
- Marken-Success-Seite mit Follow-ups (Upsell zu gewerbe/haendler)

**Commit:** `feat(backend): replace formsubmit with native inquiry handler`

---

## Gesamturteil

**Die Seite steht grundsolide, ist aber noch kein fertiger Enterprise-Funnel.**

- **Layout/Design:** sauber, konsistent mit Home/PDP ✓
- **Form-Logik:** strukturiert, 4 Blöcke sinnvoll ✓
- **B2B-Tonalität:** defensiv + professionell ✓
- **Fehlt:** Erwartungsmanagement nach Submit, Success-Seite, „So läuft's"-Block, einige B2B-Felder für bessere Lead-Qualität
- **Schwäche:** FormSubmit.co als externes Backend für B2B-Daten

**Empfehlung:** Phase PA-1 (Success-Seite + Zeit-Erwartung + Process-Steps) ist der kleinste Wurf mit größter Wirkung. Phase PA-2 + PA-3 iterativ danach.

**Nicht verifizierbar:**
- Ob `/pages/anfrage-erfolg` inhaltlich existiert oder nur generisch ausgeliefert wird → **„Ich kann das nicht bestätigen"** ohne direkten Visual-Check.
- Ob FormSubmit.co AV-Vertrag hat → **„Ich kann das nicht bestätigen"**
- Reale Conversion-Rate der Seite → **„Ich kann das nicht bestätigen"**
- Ob „Netto-Preise für Gewerbe" als Hero-Claim vollständig durch den Checkout-Flow gedeckt ist → **„Ich kann das nicht bestätigen"**
