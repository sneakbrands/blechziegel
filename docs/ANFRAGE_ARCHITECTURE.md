# Anfrage-Architektur — 2-Seiten-Split

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Status:** Planungsdokument (kein Code-Umbau in dieser Phase)

---

## 1. Ist-Analyse

### Technische Struktur

- [`templates/page.json`](../templates/page.json) — generisch, routet alle Pages auf `sections/main-page.liquid`
- [`sections/main-page.liquid:21`](../sections/main-page.liquid#L21) — wenn `page.handle == 'ziegel-anfrage'` → Snippet
- [`snippets/blechziegel-anfrage.liquid`](../snippets/blechziegel-anfrage.liquid) — **554 Zeilen** (CSS + HTML + Liquid + JS)
- **Formular-Backend:** FormSubmit.co (extern, mit Datei-Upload, E-Mail an `web@blechziegel.de`)
- **Shopify-Page-Entity:** existiert bereits mit Handle `ziegel-anfrage`

### Aktueller Seitenzweck (laut Audit)

Single-Page mit H1 „Ihr Ziegel, unsere Fertigung. Foto schicken, Angebot erhalten." — bündelt heute:
- Foto-Prüfung / unsichere Nutzer
- Sonderprofile
- Projekt-/Großmengen-Anfragen
- B2B + Privat gemischt

Der Content-Schwerpunkt („Foto schicken, Angebot erhalten") passt klar zum **einfachen Funnel**, nicht zum Projekt-Funnel.

### Zufluss (alle inbound Links im Repo)

| # | Herkunft | Datei:Zeile | Semantischer Intent |
|---|---|---|---|
| 1 | Home Hero Sek.-CTA „Beratung anfordern" | [blechziegel-home.liquid:635](../sections/blechziegel-home.liquid#L635) | **Foto/Unsicher** |
| 2 | Home Finder-Teaser Help-Link | [blechziegel-home.liquid:706](../sections/blechziegel-home.liquid#L706) | **Foto/Unsicher** |
| 3 | Home Final-CTA Card „Beratung · B2B & Sonderfälle" | [blechziegel-home.liquid:971](../sections/blechziegel-home.liquid#L971) | **Projekt/B2B** |
| 4 | PDP Project-Note „Projekt-Konditionen anfragen" | [blechziegel-product.liquid:1037](../sections/blechziegel-product.liquid#L1037) | **Projekt/B2B** |
| 5 | PDP Service-Path „Variante unsicher?" | [blechziegel-product.liquid:1136](../sections/blechziegel-product.liquid#L1136) | **Foto/Unsicher** |
| 6 | PDP Service-Path „Projekt oder Sonderprofil?" | [blechziegel-product.liquid:1140](../sections/blechziegel-product.liquid#L1140) | **Projekt/B2B** |
| 7 | PDP Feature-Card „Projektpreise für Profis" | [blechziegel-product.liquid:1342](../sections/blechziegel-product.liquid#L1342) | **Projekt/B2B** |
| 8 | Finder Empty-State + „Mein Hersteller nicht dabei?" | [blechziegel-ziegel-finder.liquid:233](../snippets/blechziegel-ziegel-finder.liquid#L233) | **Foto/Unsicher** |

**Ergebnis:** Ungefähre 4:4-Verteilung zwischen Foto-Intent und Projekt-Intent. Belegt den Bedarf der Trennung.

---

## 2. Use-Case-Trennung

### Gehört in **Ziegel-Anfrage** (einfacher Funnel)

- Foto-Upload (Drag & Drop, Vorschau)
- Länge / Breite in cm
- Optional: Hersteller/Profil-Vermutung
- Name / E-Mail / optional Telefon
- Kurze Nachricht (optional)
- Trust: „wir identifizieren das Profil"
- Erwartung: schnelle Rückmeldung mit passendem Produkt oder Sonderanfertigung-Hinweis

### Gehört in **Projekt-Anfrage** (B2B-Funnel)

- Firma / Ansprechpartner / Rolle
- Telefon (prominent, nicht optional)
- Bedarfsmenge (explizit, Ranges)
- Projektart / Einsatz (PV-Montage, Dachsanierung, Neubau …)
- Sonderprofil ja/nein (Radio)
- Mengen-/Rahmenvertrag-Bezug
- Optionaler Upload: Foto, Zeichnung, Datenblatt, PDF
- Trust: „persönlicher Ansprechpartner, Rahmenvertrags-Option, Netto-Preise"
- Erwartung: Angebot auf Basis Projekt-/Mengenangaben

### Heute vermischt, muss getrennt werden

- Privatadressen vs. Firmenanschrift
- Datenschutz-Scope (FormSubmit für B2C ok, B2B erwartet klarere DSGVO-Sprache)
- SLA-Wording (B2C-Formulierung vs. B2B-Vertragston)

---

## 3. Empfehlung zur Routing-Strategie

### Vorschlag: **`/pages/ziegel-anfrage` bleibt, `/pages/projekt-anfrage` kommt neu hinzu**

**Begründung:**

1. **SEO-Kontinuität** — `/pages/ziegel-anfrage` hat bestehende Page-Entity + potenzielle Indexierung. „ziegel anfrage" ist der generische, traffic-stärkere Suchbegriff für unsichere Endnutzer. Nicht umbenennen.
2. **Copy-Match** — aktueller Seiteninhalt („Foto schicken, Angebot erhalten") entspricht bereits dem einfachen Funnel. Inhaltlicher Kern bleibt erhalten, wird nur entschlackt.
3. **Kleinerer Migrationsscope** — von 8 inbound Links müssen nur **4** auf die neue URL umgelenkt werden (siehe Link-Plan unten). Die anderen 4 (Home-Hero, Finder-Help, PDP „Variante unsicher") bleiben exakt korrekt auf der bestehenden Seite.
4. **Neue URL für neuen Intent** — `/pages/projekt-anfrage` ist semantisch klar, erlaubt eigene H1/Meta/Schema und blockiert keine Suchanfragen der Bestandsseite.

### Verworfen: Bestandsseite zur Projekt-Seite umbauen

Würde alle 4 bestehenden Foto/Unsicher-Links obsolet machen und mehr Link-Updates nötig. SEO-Risiko höher.

### URLs & Handles

| Seite | Handle | URL | Snippet |
|---|---|---|---|
| Ziegel-Anfrage (schmal) | `ziegel-anfrage` | `/pages/ziegel-anfrage` | existierendes Snippet, reduziert |
| Projekt-Anfrage (B2B) | `projekt-anfrage` | `/pages/projekt-anfrage` | neues Snippet `blechziegel-projekt-anfrage.liquid` |

---

## 4. Soll-Struktur beider Seiten

### Seite A — `ziegel-anfrage` (einfacher Foto-Funnel)

**Ziel:** Niedrigschwellige Foto-/Maß-Anfrage für unsichere Endnutzer.

**Feldlogik (Block-Abfolge):**

1. **Block 1 — Ihr Ziegel** _(Trigger zuerst)_
   - Foto (Drag & Drop, required)
   - Länge cm (required)
   - Breite cm (required)
   - Hersteller/Profil-Vermutung (optional, Textfeld)
2. **Block 2 — Kontakt**
   - Vorname + Nachname (required)
   - E-Mail (required)
   - Telefon (optional)
3. **Block 3 — Freitext**
   - Nachricht (optional)
4. **Block 4 — Datenschutz + Submit**

**Weggelassen:** Straße / PLZ / Ort → erst bei Angebotsannahme nötig, nicht für Anfrage.

**Copy/CTA-Ton:**
- H1: „Ihren Ziegel per Foto prüfen lassen"
- Sub: „Foto und Maße senden — wir identifizieren das passende Profil und melden uns mit Angebot und Lieferzeit."
- Submit: „Anfrage absenden"
- SLA-Wording: **„in der Regel innerhalb 24 Stunden (Werktage)"** statt harte Garantie. **Ich kann das nicht bestätigen**, dass jede Anfrage binnen 24 h beantwortet wird — defensiv formulieren.

**Trust-/Erwartungslogik:**
- Mini-USPs: „kostenfrei & unverbindlich · Prüfung per Foto · Antwort in der Regel 24 h"
- Side-Info: „So messen Sie richtig" + „Foto-Tipp (Ober- und Unterseite)"
- **Kein** Großmengen-Hinweis auf dieser Seite — gehört auf Projekt-Seite
- Side-Info-Card: „Projektanfrage oder > 100 Stück? → hier entlang" _(Link auf Projekt-Seite)_

---

### Seite B — `projekt-anfrage` (B2B-Funnel, neu)

**Ziel:** Professionelle Anfrage für Dachdecker, PV-Installateure, Großmengen, Sonderprofile, Rahmenverträge.

**Feldlogik (Block-Abfolge):**

1. **Block 1 — Projekt / Menge** _(Trigger zuerst)_
   - Projektart / Einsatz (Select oder Radio: PV-Montage · Dachsanierung · Neubau · Sonstiges)
   - Bedarfsmenge (Range-Select: 25–100 · 100–500 · 500–2.000 · 2.000+)
   - Sonderprofil nötig? (Radio: ja / nein / unklar)
2. **Block 2 — Unternehmen**
   - Firma (required)
   - Rolle/Funktion (Text, optional)
   - Ansprechpartner Vor-/Nachname (required)
   - E-Mail (required)
   - Telefon (required — B2B-Norm)
3. **Block 3 — Details**
   - Lieferadresse grob (PLZ + Ort, optional genaue Anschrift)
   - Nachricht/Projektbeschreibung (optional)
   - Optionaler Upload: Foto · Zeichnung · Datenblatt · PDF (mehrfach, optional)
4. **Block 4 — Datenschutz (B2B-Wortlaut) + Submit**

**Copy/CTA-Ton:**
- H1: „Projekt-Anfrage für Dachdecker, PV-Installateure und Betriebe"
- Sub: „Mengen, Sonderprofile, Rahmenverträge — individuelle Konditionen auf Basis Ihrer Projektangaben."
- Submit: „Projektanfrage senden"
- SLA-Wording: „Rückmeldung durch einen persönlichen Ansprechpartner auf Basis Ihrer Projektangaben." **Keine** 24-h-Zusage, weil Projekte häufig Rücksprache/Kalkulation erfordern. **Ich kann das nicht bestätigen**, wie schnell Projektanfragen realistisch beantwortet werden — lieber offen formulieren.

**Trust-/Erwartungslogik:**
- Mini-USPs: „Persönlicher Ansprechpartner · Rahmenverträge möglich · Netto-Preise für Gewerbe"
- Side-Info: Verweis auf `/pages/gewerbe` + `/pages/haendler` für weitere B2B-Kontext
- Optional: Referenz-Liste oder Zertifikate (nur wenn verifizierbar; sonst weglassen)
- Side-Info-Card: „Nur unsicher welches Produkt? → Ziegel-Anfrage" _(Link auf einfache Seite)_

---

## 5. Link-/CTA-Migrationsplan

### Bleibt auf `/pages/ziegel-anfrage`

| # | Datei:Zeile | CTA-Text |
|---|---|---|
| 1 | [blechziegel-home.liquid:635](../sections/blechziegel-home.liquid#L635) | Hero Sek. „Beratung anfordern" |
| 2 | [blechziegel-home.liquid:706](../sections/blechziegel-home.liquid#L706) | Finder-Teaser Help |
| 5 | [blechziegel-product.liquid:1136](../sections/blechziegel-product.liquid#L1136) | PDP Service-Path „Variante unsicher?" |
| 8 | [blechziegel-ziegel-finder.liquid:233](../snippets/blechziegel-ziegel-finder.liquid#L233) | Finder Empty-State / „Hersteller nicht dabei?" |

### Wechselt auf `/pages/projekt-anfrage`

| # | Datei:Zeile | CTA-Text |
|---|---|---|
| 3 | [blechziegel-home.liquid:971](../sections/blechziegel-home.liquid#L971) | Home Final-CTA „Beratung · B2B & Sonderfälle" |
| 4 | [blechziegel-product.liquid:1037](../sections/blechziegel-product.liquid#L1037) | PDP Project-Note „Projekt-Konditionen anfragen" |
| 6 | [blechziegel-product.liquid:1140](../sections/blechziegel-product.liquid#L1140) | PDP Service-Path „Projekt oder Sonderprofil?" |
| 7 | [blechziegel-product.liquid:1342](../sections/blechziegel-product.liquid#L1342) | PDP Feature-Card „Projekt-Konditionen anfragen" |

Zusätzlich: Side-Info-Cards auf beiden Seiten cross-linken (Bewegung zwischen den zwei Funnels möglich, ohne Rückweg über Navigation).

---

## 6. Antworten auf die 10 Schlüsselfragen

1. **Was gehört in Ziegel-Anfrage?** Foto, Länge, Breite, optional Hersteller, Kontakt (Name/Email/optional Tel), kurze Nachricht. Keine Adresse, keine Firma, keine Mengen-Range.
2. **Was gehört in Projekt-Anfrage?** Projektart, Bedarfsmenge, Sonderprofil-Flag, Firma, Rolle, Telefon (required), optional Uploads, PLZ/Ort grob, Projektbeschreibung.
3. **Bleibt ziegel-anfrage als einfache Seite?** Ja — empfohlen. Neue `projekt-anfrage` ergänzt.
4. **Oder wird ziegel-anfrage zur Projektseite?** Nicht empfohlen — SEO-Schaden, mehr Link-Updates.
5. **Welche Variante besser?** Variante mit Bestehend behalten (siehe Abschnitt 3).
6. **Welche internen Links müssen angepasst werden?** Vier Links auf `projekt-anfrage` umlenken (siehe Tabelle oben).
7. **Welche Felder müssen auf welcher Seite raus?** Ziegel-Anfrage: Straße/PLZ/Ort raus. Projekt-Anfrage: Foto-Pflicht raus (wird optional).
8. **Welche Felder neu rein?** Ziegel-Anfrage: Telefon (optional), Hersteller-Vermutung (optional). Projekt-Anfrage: alle B2B-Felder neu (Firma, Rolle, Projektart, Mengen-Range, Sonderprofil-Flag, mehrfacher Upload).
9. **Welche Copy/Claims/Erwartungen unterschiedlich?** Ziegel-Anfrage: „in der Regel 24 h". Projekt-Anfrage: „persönlicher Ansprechpartner auf Basis Projektangaben" (keine 24-h-Zusage).
10. **Größtes Risiko?** SEO-Verhalten der neuen URL (Index-Ramp-up dauert). Mitigation: Interne Verlinkung stark setzen, ggf. Canonicals sauber. **Ich kann das nicht bestätigen**, wie schnell Google die neue URL aufnimmt.

---

## 7. Priorisierung

### P1 — jetzt zuerst

- Neue Page-Entity `projekt-anfrage` in Shopify anlegen (Admin-Tool `ensure-page.js`)
- Neues Snippet `snippets/blechziegel-projekt-anfrage.liquid` (Ableger aus `blechziegel-anfrage.liquid`, B2B-Feldlogik)
- Routing in `sections/main-page.liquid` ergänzen (`page.handle == 'projekt-anfrage'`)
- 4 inbound Links im Theme-Code umbiegen
- Bestandsseite `ziegel-anfrage` schlanker machen (Adresse raus, Feldreihenfolge drehen, SLA entschärfen)

### P2 — danach

- Side-Info-Cross-Links zwischen beiden Seiten
- JSON-LD je Seite: `ContactPoint` / `Service` spezifisch
- Success-Seiten `/pages/anfrage-erfolg` und `/pages/projekt-erfolg` mit defensivem Wording
- FAQ-Section mit `FAQPage`-Schema (zuerst auf Projekt-Anfrage)

### P3 — später

- A/B-Test Feld-Reihenfolge auf Projekt-Seite (optional)
- Upsell-Logik basierend auf Kundentyp (nur falls Daten aus Anfrage einfließen)
- WhatsApp-/Calendly-Integration für Projekt-Anfrage (Mobile B2B-Pfad)

---

## 8. Umsetzungsplan (Phasen)

### Phase ANF-ARCH-1: Split (1 Commit-Block, mittel)

- Shopify-Page `projekt-anfrage` anlegen
- Snippet `blechziegel-projekt-anfrage.liquid` erstellen (basiert auf bestehendem, umgebaute Feldlogik)
- `main-page.liquid` um Routing erweitern
- Bestandssnippet `blechziegel-anfrage.liquid` entschlacken + Feldreihenfolge + SLA-Wording
- Inbound Links im Theme umbiegen (Home + PDP)

**Commit(s):**
- `feat(pages): add projekt-anfrage b2b funnel`
- `refine(anfrage): simplify ziegel-anfrage to photo funnel`
- `refactor(links): route b2b ctas to projekt-anfrage`

### Phase ANF-ARCH-2: Polish + Success (klein/mittel)

- Cross-Link Side-Info-Cards beidseitig
- Success-Seiten anlegen
- JSON-LD erweitern

### Phase ANF-ARCH-3: FAQ + Trust (optional)

- FAQPage-Schema unten auf Projekt-Anfrage
- Referenz-Block (nur mit verifizierten Inhalten)

---

## Nicht verifizierbar

- Reaktions-SLA „24 Stunden" als harte Garantie → **„Ich kann das nicht bestätigen."**
- Reale Anfragenvolumen-Verteilung (Foto vs. Projekt) → **„Ich kann das nicht bestätigen."** (Aussage basiert auf Link-Intent-Zählung, nicht auf tatsächlichen Einreichungen.)
- FormSubmit.co DSGVO-Eignung für B2B-Daten → **„Ich kann das nicht bestätigen."** (Im B2B-Flow ggf. eigener Handler / Shopify-Contact-Form / Admin-API-Endpoint sauberer.)
- SEO-Verhalten der neuen URL → **„Ich kann das nicht bestätigen."**
