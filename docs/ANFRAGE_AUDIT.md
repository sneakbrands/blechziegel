# Audit — `/pages/ziegel-anfrage`

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/pages/ziegel-anfrage`
**Stand:** 2026-04-16
**Referenz:** Homepage nach Phase 1–3 + Polish · PDP nach PDP-1…3 + Cleanup

---

## 1. Ist-Analyse

### Beteiligte Dateien

- [`templates/page.json`](../templates/page.json) — generisch, routet über `main-page` Section
- [`sections/main-page.liquid`](../sections/main-page.liquid) — routet `page.handle == 'ziegel-anfrage'` auf das Snippet
- [`snippets/blechziegel-anfrage.liquid`](../snippets/blechziegel-anfrage.liquid) — **554 Zeilen, selbstenthaltene Anfrage-Seite** (CSS + HTML + Liquid + JS)
- Backend: **FormSubmit.co** (externe Weiterleitung an `web@blechziegel.de`, mit Datei-Upload)

### Aktuelle Struktur

1. Hero: Kicker · H1 · USP-Leiste (24 h · Sonderanfertigungen · kostenfrei · „Made in Germany")
2. Form-Section: 2-Spalter (Formular links, Side-Info rechts)
3. „So läuft es" (3 Steps)
4. Final-CTA mit E-Mail + Sekundär-Navigation

### Rolle im Gesamtfluss

Wird aktuell von Home (Hero-Sek.-CTA, Final-CTA), PDP (Service-Paths, Feature-Card) und Finder (Fallback „Mein Hersteller ist nicht dabei") angesprochen. **Einziger Lead-Endpunkt** für unsichere Nutzer + Projekte/Sonderprofile.

---

## 2. UX-Audit

### Feldabfolge — **kontraintuativ**

Aktuell: Vorname → Nachname → Straße → PLZ → Ort → E-Mail → **Länge → Breite → Foto** → Nachricht → Datenschutz.

Der Nutzer wird **zuerst** nach Privatadresse gefragt, bevor er den Anfrage-Kern (Foto + Maße) angegangen hat. Das ist die falsche Reihenfolge und erhöht Abbruchquote.

### Fehlende Felder

- **Telefon** — B2B-Standard für Rückfragen vor Angebot
- **Firma/Betriebsstätte** — Dachdecker geben keine Privatadressen an
- **Bedarfsmenge (ungefähr)** — aktuell nur implizit in Textarea
- **Kundentyp** — keine Segmentierung (Dachdecker / PV / Handel / Privat)

### Upload-UX

- **Positiv:** Drag & Drop, Vorschau, 8-MB-Limit, Remove-Button
- **Negativ:** Hinweis „Ober- und Unterseite hilft" steht nur in Side-Info, nicht im Drop-Bereich selbst
- **Negativ:** keine aktive HEIC-Validierung für ältere Browser

### Mobile

- Hero sauber
- Form-Card-Padding 18 px **knapp** auf kleinen Screens
- 3-Spalten-PLZ-/Ort-Grid kollabiert nicht sauber auf Mobile
- Datenschutz-Checkbox-Text lang und schwer lesbar auf 360 px

### Validierung

- `#hp-form-status` erscheint oben im Formular — bei Fehler unten am Submit muss der Nutzer scrollen, um den Hinweis zu sehen

---

## 3. Conversion-Audit

### Value Promise

- H1: „Ihr Ziegel, unsere Fertigung. Foto schicken, Angebot erhalten." — **klar und stark**
- Sub: „…melden innerhalb 24 Stunden mit Angebot und Lieferzeit." — **klare Erwartung**
- USP-Leiste oben: kurz, vier harte Punkte

### Risiken

- **24-Stunden-Versprechen** steht **3×** auf der Seite (USP, Step 2, Fußnote). Kein „in der Regel"-Escape. **Ich kann das nicht bestätigen**, dass jede Anfrage innerhalb 24 h beantwortet wird. Ein nicht eingehaltenes Versprechen zerstört Vertrauen härter als ein defensiv formuliertes.
- **„Sonderanfertigung"** ist vage — kein Hinweis auf Mindestmenge, Leadtime-Range, Aufpreis-Indikation
- **Kein Next-Step-Hinweis** nach Absenden — es fehlt eine Success-Seite („Angebot unterwegs, zwischenzeitlich hier entlang…")

### 3 größte Conversion-Hebel

1. **Feldabfolge umdrehen** (Foto+Maße vor Kontakt vor Adresse) — Trigger-first statt Barrier-first
2. **Kundentyp-Segmentierung** — Dachdecker/PV/Handel/Privat als Radio; bessere Bearbeitung + segment-spezifische Follow-ups
3. **Defensiver SLA-Wortlaut** — „in der Regel innerhalb 24 h (Werktage)" statt harter Garantie

### 3 größte Reibungspunkte

1. Adresse direkt nach Name (psychologische Barriere)
2. Fehlendes Telefon-Feld (B2B-Brecher)
3. Datenschutz-Block zu lang auf Mobile

---

## 4. B2B-/Projekt-Audit

### Antworten auf die Schlüsselfragen

**1) Ist klar, dass die Seite für Foto-Prüfung + Sonderprofile + Projekte da ist?**
Teilweise. Foto-Prüfung ist klar kommuniziert. „Sonderanfertigungen" steht in der USP-Leiste und in Step 2. **Projekt-/Großmengen-Pfad fehlt explizit** — aktuell kein eigener Hinweis, keine alternative Telefon-Route für >500 Stück.

**2) Kontaktformular oder Anfrage-Funnel?**
**Noch näher am Kontaktformular.** Single-Step, keine Segmentierung, kein Progress-Indikator, keine Kundentyp-basierte Konditionalisierung.

**3) Welche Felder fehlen / sind unnötig?**
- Fehlen: Telefon, Firma, Kundentyp, Bedarfsmenge
- Unnötig als Pflichtfelder: Straße/PLZ/Ort vor dem Foto-Schritt (später oder als optional)

**4) Ist die Upload-Logik klar?**
Drag & Drop ist stark. Drop-Zone-Hints fehlen („Ober- + Unterseite"). HEIC-Validierung nicht robust.

**5) Mobile?**
Grundstruktur responsive, Form-Card-Padding knapp, Datenschutz-Checkbox lang. Solide Basis, kein Mobile-First.

**8) Service-Funnel oder Content-Seite?**
Aktuell zwischen beiden. **Sollte klar Richtung Service-Funnel** kippen — mehr wie eine geführte Anfrage, weniger wie eine generische Page.

### Fehlender Großmengen-Pfad

Für Anfragen >500 Stück oder komplexe Projekte gibt es keinen alternativen Direkt-Kontakt (Telefon, Kalender-Link). Side-Info würde sich anbieten.

---

## 5. SEO-/Struktur-Audit

- **H1:** 1× vorhanden, gut ✓
- **H2:** 3× in sinnvoller Hierarchie (Formular · Prozess · Final-CTA) ✓
- **Schema.org:** `BreadcrumbList`, `WebPage`, `Organization` vorhanden (Z.555–571). **Fehlen:** `ContactPoint`, `Service`, `FAQPage`
- **Indexability:** public, canonical sauber gesetzt
- **Interne Verlinkung:** Final-CTA linkt auf `/pages/hersteller` + `/pages/ratgeber`. **Fehlen:** konditionale Upsell-Links zu `/pages/gewerbe` und `/pages/haendler` je nach Kundentyp
- **Suchintention:** Seite zielt implizit auf „ziegel anfrage", „sonderanfertigung dachziegel", „blechziegel passender finden". Kein FAQ-Schema, obwohl „So läuft es" + potenzielle FAQs prädestiniert sind

---

## 6. Priorisierte Schwächen

### P1 (Conversion-breaking)

1. **Feldabfolge:** Foto + Maße zuerst, dann Kontakt, dann Adresse.
2. **Kundentyp-Radio hinzufügen** (Dachdecker / PV-Installateur / Baustoffhandel / Privat / Sonstiges). Segmentiert Bearbeitung und schaltet konditionale Zusatzfelder frei.
3. **Telefon-Feld** (optional, aber prominent) nach E-Mail.
4. **24-h-Ansprache entschärfen** auf „in der Regel innerhalb 24 h (Werktage)". **Ich kann das nicht bestätigen**, dass ein harter SLA einhaltbar ist.

### P2 (Friction)

5. **Bedarfsmenge** als eigenes optionales Feld („ungefähr, z. B. 50 · 200 · 500+").
6. **Firma/Betriebsstätte** konditional bei Kundentyp = Dachdecker/PV/Handel.
7. **Datenschutz-Checkbox kürzen** — Label zweizeilig, Links verlinkt.
8. **Upload-Drop-Zone** erhält Hint-Text „Ober- und Unterseite hilft bei der Identifikation".
9. **Großmengen-/Sonderprofil-Box** in Side-Info mit alternativer Route (Telefon oder direkter E-Mail-Subject-Prefill).
10. **Validierungs-Feedback** zusätzlich direkt über dem Submit-Button anzeigen.

### P3 (Enhancement)

11. **Success-Seite** `/pages/anfrage-erfolg` mit defensivem SLA-Wortlaut, Upsell basierend auf Kundentyp und Email-Preview.
12. **FAQ-Section** unten auf der Seite mit `FAQPage`-Schema (Mengen-Range, Lieferzeiten-Range, Hersteller-Abdeckung, Mindestmenge).
13. **JSON-LD erweitern:** `ContactPoint` mit `contactType: "customer support"` und `Service` mit Bezug auf Sonderanfertigung.
14. **Konditionale Upsell-Links** im Final-CTA (Dachdecker → gewerbe, Handel → haendler, Privat → ratgeber).

---

## 7. Empfohlene Soll-Struktur

1. **Hero** (unverändert)
2. **Form-Section — neu strukturiert als Funnel-Abschnitte:**
   - **Block 1: Ihr Ziegel** (Foto + Länge + Breite + optionaler Hersteller-Hint) — _Trigger zuerst_
   - **Block 2: Kontext** (Kundentyp-Radio + Bedarfsmenge optional + Nachricht)
   - **Block 3: Kontakt** (Vorname + Nachname + E-Mail + Telefon)
   - **Block 4: Lieferadresse** (Firma konditional + Straße + PLZ + Ort)
   - **Block 5: Datenschutz + Submit**
   - Side-Info: Mess-Tipp, Foto-Tipp, Großmengen-Alternative
3. **So läuft es** (3 Steps, Wording defensiv „in der Regel")
4. **FAQ** (neu, kurz, mit FAQPage-Schema)
5. **Final-CTA** (Upsell-Links konditional nach Kundentyp)

---

## 8. Umsetzungsplan

### Phase ANFRAGE-1: Quick Wins (klein, 1 Commit)

- Feldabfolge umstellen (Foto + Maße zuerst)
- Telefon-Feld hinzufügen
- Bedarfsmenge-Feld hinzufügen (optional)
- 24-h-Wording auf „in der Regel …" entschärfen
- Drop-Zone-Hint für Foto
- Datenschutz-Checkbox-Label kürzen
- Validierungs-Feedback auch direkt vor Submit

**Commit:** `refine(anfrage): reorder fields for trigger-first flow and soften sla wording`

### Phase ANFRAGE-2: Segmentierung (mittel)

- Kundentyp-Radio/Segmented Control
- Firma konditional via JS
- Side-Info: Großmengen-Alternative (Direkt-Kontakt)
- Konditionale Upsell-Links im Final-CTA
- JSON-LD `ContactPoint` + `Service`

**Commit:** `feat(anfrage): customer-type segmentation and conditional flows`

### Phase ANFRAGE-3: Success + FAQ (mittel)

- Success-Seite `/pages/anfrage-erfolg` (FormSubmit `_next` redirect)
- FAQ-Section mit FAQPage-Schema
- Optional: Mehrstufiger Funnel später

**Commit:** `feat(anfrage): add success page and faq with schema`

---

## Gesamturteil

**Die Seite ist solide gebaut, liegt aber hinter der Home + PDP zurück** — sie ist heute näher an einem Kontaktformular als an einem professionellen Anfrage-Funnel.

- **Design/Layout:** gut, konsistent mit `hp-*`-System ✓
- **Upload:** stark ✓
- **Feldlogik:** suboptimal (Reihenfolge, B2B-Felder fehlen) ✗
- **Segmentierung:** nicht vorhanden ✗
- **SLA-Wording:** zu hart für nicht-verifizierbare Zusage ✗
- **Großmengen-/Projektpfad:** unterrepräsentiert für eine Seite, die aus PDP-/Home-CTA genau dafür beworben wird ✗

**Empfehlung:** Phase ANFRAGE-1 (Quick Wins) als nächsten kleinen Commit. Phase 2 + 3 iterativ danach.

**Nicht verifizierbar:**
- SLA „24 Stunden" als harte Garantie → **„Ich kann das nicht bestätigen."**
- Datenfluss FormSubmit.co / DSGVO-Konformität des externen Handlers → **„Ich kann das nicht bestätigen."**
- Tatsächliche Conversion-Rate der aktuellen Seite → **„Ich kann das nicht bestätigen."**
