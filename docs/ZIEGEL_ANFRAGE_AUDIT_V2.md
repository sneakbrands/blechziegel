# Audit — `/pages/ziegel-anfrage` (Vergleich gegen aktualisierte `projekt-anfrage`)

**Branch:** `feat/ziegel-finder-enterprise`
**Zielseite:** `/pages/ziegel-anfrage`
**Referenz:** `/pages/projekt-anfrage` (nach PA-1 + PA-2)
**Stand:** 2026-04-16

---

## 1. Ist-Analyse

### Beteiligte Dateien

- [`templates/page.json`](../templates/page.json) → generisch
- [`sections/main-page.liquid:21`](../sections/main-page.liquid#L21) → routet auf Snippet
- [`snippets/blechziegel-anfrage.liquid`](../snippets/blechziegel-anfrage.liquid) — ~590 Zeilen, selbstenthalten
- **Backend:** FormSubmit.co mit `_cc`-Sync zum Absender (seit Mini-Test)
- **Success-Redirect:** `/pages/anfrage-erfolg` (gemeinsam mit `projekt-anfrage`)

### Aktueller Seiten-Stand (nach ANF-ARCH-1 + Cleanup)

- Hero: Kicker · H1 „Ihren Ziegel per Foto prüfen lassen" · Sub · 4 Trust-Items (u. a. „In der Regel Antwort in 24 Std. (Werktage)" · „In Deutschland gelasert")
- Form-Section (2-Spalter), Feldreihenfolge **trigger-first**:
  - Foto (required) → Länge/Breite → Hersteller-optional → Name → E-Mail → Telefon-optional → Nachricht → Datenschutz
- „So läuft die Anfrage — 3 Steps" ✓ (L420+)
- Final-CTA (Navy) mit Mail + Hersteller-Übersicht + Ratgeber
- Side-Info: Mess-Tipp · Foto-Tipp · Cross-Link zur Projekt-Anfrage · Direkt-Mail
- Defensive SLA-Sprache flächendeckend („in der Regel … Werktage")

### Rolle im Gesamtfluss

Zielseite für 4 inbound Links:
- Home Hero Sek.-CTA „Beratung anfordern"
- Home Finder-Teaser Help-Link
- PDP Service-Path „Variante unsicher?"
- Finder Empty-State / „Hersteller nicht dabei?"

**Rolle:** schnellster + einfachster Anfragepfad für unsichere Einzelnutzer.

---

## 2. UX-/Funnel-Audit

### Stärken

- H1 + Sub direkt auf Foto-Prüfung fokussiert
- Trigger-first Feldreihenfolge (Foto zuerst, Adresse raus)
- Telefon als optionales Feld (statt B2B-required)
- Hersteller-Feld optional — Nutzer kann beitragen, muss aber nicht
- 3-Step-Prozess-Block sichtbar unter Formular
- Cross-Link zur Projekt-Anfrage sauber im Side-Info platziert (stärkt Funnel statt zu konkurrieren)
- Mobile: 2-Spalter kollabiert sauber auf 1-Spalter

### Restschwächen

- **Keine explizite Antwort-Erwartung direkt unter dem Submit-Button.** Die bestehende Fußnote „Kein Spam. Rückmeldung an Ihre E-Mail — in der Regel innerhalb von 24 Stunden (Werktage)." erfüllt den Zweck zwar — aber knapp. Im Vergleich zur `projekt-anfrage` (bewusst zweiteilig mit fettem „1–2 Werktagen") wirkt es unauffälliger.
- **Upload-Live-Counter fehlt.** Single-File 8 MB ist zwar unkritisch, aber der Nutzer bekommt keine visuelle Progress-Rückmeldung beim Drop (die Preview mit Thumb + Größe kommt erst nach Auswahl).
- Validierungs-Feedback erscheint `oben` im Status-Block — bei Fehler am unteren Submit muss gescrollt werden.

---

## 3. Upload-/Form-Audit

### Upload

- Drag & Drop ✓
- Preview mit Thumb, Name, Größe ✓
- Remove-Button ✓
- 8-MB-Grenze, Fehler-Feedback vorhanden ✓
- `accept="image/*,.heic,.heif"` ✓
- **Fehlt:** expliziter Format-Text im Drop-Bereich (steht nur als Hint darunter, nicht im Titel selbst)
- **Fehlt:** HEIC-Rotation / Auto-Kompression für iPhone-Nutzer (wäre idiotensicherer, aber komplex und klar Scope-Creep)

### Formular

- 8 Felder sichtbar (6 required: Vor/Nachname, E-Mail, Länge, Breite, Foto, Datenschutz; 2 optional: Hersteller, Telefon, Nachricht)
- Labels klar und deutsch
- Datenschutz-Checkbox mit Link auf AGB + Datenschutzerklärung
- **Schwäche:** Datenschutz-Text ist 1 Satz lang — auf Mobile mehrere Zeilen, relativ textig

---

## 4. Trust-/Erwartungs-Audit

### Was gut ist

- Defensive 24-h-Sprache flächendeckend („in der Regel … Werktage")
- 3-Step-Prozess macht Erwartung explizit
- Shared Success-Seite mit 1–2-Werktage-Anker
- Kein Fake-Rating, keine unbelegten Bewertungsclaims
- FormSubmit `_cc` gibt Absender potenziell eine Kopie (Realtest nötig)

### Was fehlt gegenüber `projekt-anfrage`

- **JSON-LD:** nur `BreadcrumbList`, `WebPage`, `Organization` (ohne ContactPoint). `projekt-anfrage` hat zusätzlich `ContactPoint` + `Service`. Für den einfachen Funnel ist `Service` übertrieben, aber ein **`ContactPoint`** (customer support statt sales) würde Konsistenz schaffen und ist defensiv korrekt.
- **Submit-Footer-Emphasis:** projekt-anfrage hebt „1–2 Werktage" fett hervor. ziegel-anfrage erwähnt es nur im Fließtext unter dem Button.

---

## 5. Vergleich zu `projekt-anfrage`

| Kriterium | ziegel-anfrage | projekt-anfrage |
|---|---|---|
| Feldreihenfolge trigger-first | ✓ | ✓ |
| Defensive SLA-Sprache | ✓ | ✓ |
| 3-Step-Prozess-Block | ✓ | ✓ |
| Success-Seite | gemeinsam ✓ | gemeinsam ✓ |
| Cross-Link zum anderen Funnel | ✓ | ✓ |
| FormSubmit `_cc` | ✓ | ✓ |
| Upload Drag&Drop | ✓ Single | ✓ Multi |
| Upload Live-Counter | — | ✓ |
| Upload Format-Liste explizit | Hint darunter | im Hint selbst explizit |
| JSON-LD `ContactPoint` | — | ✓ |
| JSON-LD `Service` | — (passt nicht) | ✓ |
| Submit-Zeitanker fett | — | ✓ |
| Segmented-Controls / Zusatzfelder | minimal (passt) | umfangreich (B2B) |

**Fazit:** ziegel-anfrage hinkt **nicht substanziell** hinterher. Funktional + UX-seitig ist sie auf gleichem Reifegrad. Die Unterschiede sind **Feinschliff-Polish**, kein großer Gap.

---

## 6. Antworten auf die 8 Schlüsselfragen

1. **Starker Funnel oder nur gutes Formular?** Schon ein **starker einfacher Funnel**, nicht nur ein Formular. Hero-Klarheit + trigger-first + Process-Block tragen.
2. **3 größte Reibungspunkte?** (a) Validierungs-Feedback oben (Scroll-Distanz), (b) Datenschutz-Text auf Mobile lang, (c) Upload-Format-Hinweis unter Drop-Titel statt im Titel.
3. **3 größte Conversion-Hebel?** (a) Zeitanker unter Submit fett hervorheben wie bei projekt-anfrage, (b) Upload-Live-Feedback (auch bei Single-File: beim Drop „X MB — OK ✓"), (c) JSON-LD `ContactPoint` für Maschinen-Konsistenz.
4. **Hinkt sichtbar hinterher?** Nein. Nur kleine Polish-Lücken, keine strukturellen.
5. **Fehlt Prozess-/Trust-/Upload-Polish?** Prozess ist da. Trust größtenteils da. Upload hat **kleinen** Polish-Spielraum.
6. **Upload stark genug für unsichere Privatnutzer?** Ja für Desktop, weitgehend ja für Mobile. HEIC-Rotation wäre nice-to-have, aber Scope-Creep.
7. **Sollte ziegel-anfrage ebenfalls Komfort-Upgrade wie projekt-anfrage bekommen?** **Nein im Umfang** (keine neuen Felder, kein Mengenfeld — passt nicht zur einfachen Rolle). **Ja im Mikropolish** (siehe P2).
8. **Was ist P1, was P2?** Keine echten P1. Reiner P2-Polish-Commit reicht.

---

## 7. Priorisierte Schwächen

### P1 — _keine_ echten P1

Die Seite erfüllt ihre Rolle stabil. Keine Funnel-brechenden Lücken.

### P2 — Mikropolish (kleiner Commit, ~15–20 Zeilen)

1. **JSON-LD:** `Organization.contactPoint` mit `contactType: "customer support"` ergänzen (nicht `sales` wie bei projekt-anfrage).
2. **Submit-Footer:** „1 Werktag" oder „24 Stunden (Werktage)" fett hervorheben, 2-zeilig wie bei projekt-anfrage, mit kleiner visueller Trennung.
3. **Upload-Titel-Enhancement:** Dateitypen in den Drop-Titel integrieren: „Foto ablegen (JPG · PNG · HEIC) oder **auswählen**" statt separat im Hint.
4. **Upload-Feedback nach Drop:** In der bestehenden Preview einen dezenten Status-Indikator (✓-Icon grün) zeigen.
5. **Validierungs-Feedback vor Submit:** einen kleinen inline-Hinweis **oberhalb des Submit-Buttons** zusätzlich zum bestehenden oberen Status-Block, damit Fehler-Feedback nicht übersehen wird.

### P3 — Optional / später

- HEIC-Auto-Rotate client-seitig (komplex)
- Success-Seiten-Variante `/pages/ziegel-erfolg` (unnötig — shared Page funktioniert)
- FormSubmit.co-Ablösung (systemübergreifend, siehe PA-3-Backlog)

---

## 8. Empfohlene Soll-Struktur

Keine strukturelle Änderung. Reihenfolge bleibt:

1. Hero (unverändert)
2. Form-Section (Feldreihenfolge + Side-Info unverändert) — **kleine Polish-Punkte aus P2 einbauen**
3. So läuft die Anfrage (unverändert)
4. Final-CTA (unverändert)

---

## 9. Umsetzungsplan

### Phase ZA-1: Mikropolish (einziger nötiger Schritt, 1 Commit)

- Submit-Footer zweizeilig mit fett-Hervorhebung
- Upload-Titel mit Format-Typen
- Preview-Status ✓-Icon
- Inline-Validierungs-Reminder direkt über Submit
- JSON-LD `ContactPoint` (customer support)

**Commit:** `refine(ziegel-anfrage): mirror submit clarity and upload polish from projekt-anfrage`

**Scope:** klein, kein neuer Feldsatz, keine neue Section, kein Backend-Umbau.

---

## Gesamturteil

**`/pages/ziegel-anfrage` ist bereits auf gutem Reifegrad.** Die ANF-ARCH-1-Vereinfachung + der Cleanup haben die Seite deutlich gestärkt. Gegen `projekt-anfrage` fehlen nur fünf Mikropolish-Punkte, die **alle zusammen einen einzigen kleinen Commit** ausmachen — keine neue Phase nötig.

**Die Versuchung wäre, hier Komfort-Features der projekt-anfrage 1:1 zu übernehmen (Menge-Select, Dachfläche, Live-Upload-Meter).** Das wäre ein Fehler: die Stärke dieser Seite **ist** ihre Einfachheit. Jedes zusätzliche Feld verwässert den schnellen Funnel.

**Nicht verifizierbar:**
- Reale Conversion-Rate vs. projekt-anfrage → **„Ich kann das nicht bestätigen."**
- FormSubmit-`_cc`-Zustellung im aktiven Tarif → **„Ich kann das nicht bestätigen."** (Mini-Test noch offen)
- Mobile-Rendering auf echten Endgeräten → **„Ich kann das nicht bestätigen."**
