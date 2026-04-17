# Collections Audit — `/collections/*`

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Methode:** Playwright (Chromium) gegen Live-Site mit Cache-Buster · DOM-/SEO-Probe · Code-Review
**Test-Skript:** [`scripts/coll-test/coll.mjs`](../scripts/coll-test/coll.mjs)
**Screenshots:** [`scripts/coll-test/screenshots/`](../scripts/coll-test/screenshots/)

---

## 1. Geprüfte Seiten

5 Live-Collections, je Desktop (1440×900) + Mobile (iPhone 13):

| Handle | Rolle |
|---|---|
| `pv-dachziegel` | Haupt-Collection — primärer Kaufpfad |
| `braas` | Hersteller-Collection |
| `bramac` | Hersteller-Collection |
| `creaton` | Hersteller-Collection |
| `nelskamp` | Hersteller-Collection |

Alle nutzen denselben Template-Renderer [`sections/blechziegel-collection.liquid`](../sections/blechziegel-collection.liquid) (1467 Zeilen) via [`templates/collection.json`](../templates/collection.json).

---

## 2. Methodik

- **Live verifiziert:** Title/Meta/H1/JSON-LD via DOM-Probe, Above-the-fold + Listing-Screenshots Desktop + Mobile
- **Aus Code abgeleitet:** Hersteller-Erkennung-Logik, Intro-Variation, JSON-LD-Konstruktion
- **Nicht sicher verifizierbar:** Echte Filter-Interaktion, Mobile-Touch-Performance — **„Ich kann das nicht bestätigen."**

---

## 3. SEO-Audit (live verifiziert via DOM-Probe)

| Probe | pv-dachziegel | braas | bramac | creaton | nelskamp |
|---|---|---|---|---|---|
| `<title>` | „PV Dachziegel – Blechziegel.de" ✓ | „Braas – Blechziegel.de" | „Bramac – …" | „Creaton – …" | „Nelskamp – …" |
| `<meta name="description">` | **vorhanden** ✓ | **null** ❌ | **null** ❌ | **null** ❌ | **null** ❌ |
| `<h1>` | „PV Dachziegel" ✓ | „PV-Dachziegel für Braas" ✓ | „… für Bramac" ✓ | „… für Creaton" ✓ | „… für Nelskamp" ✓ |
| H2-Anzahl | 7 | 7 | 7 | 7 | 7 |
| H3-Anzahl | 1 | 1 | 1 | 1 | 1 |
| JSON-LD `CollectionPage` | **fehlt** ❌ | vorhanden ✓ | vorhanden ✓ | vorhanden ✓ | vorhanden ✓ |
| Breadcrumb-Markup | **fehlt** ❌ | fehlt ❌ | fehlt ❌ | fehlt ❌ | fehlt ❌ |
| Pagination | n/a (1 Produkt) | n/a | n/a | n/a | n/a |

**SEO-Hauptbefunde:**

1. **Meta-Description fehlt für ALLE 4 Hersteller-Collections.** Im Code ([blechziegel-collection.liquid:996+](../sections/blechziegel-collection.liquid#L996)) gibt es brand-spezifische `hersteller_blurb`-Texte für die Body-Section, aber sie werden NICHT in den `<head>`-Meta-Description-Tag gepusht. Shopify fällt auf Default zurück, der hier leer ist.
2. **`pv-dachziegel` hat kein `CollectionPage`-JSON-LD** (nur `Organization`). Der Template-Code gibt `CollectionPage` nur im `is_hersteller`-Branch aus ([Z. 1373–1391](../sections/blechziegel-collection.liquid#L1373-L1391)). Inkonsistenz: Haupt-Collection ohne Schema, Hersteller mit Schema.
3. **Keine BreadcrumbList** — weder im sichtbaren Markup noch als JSON-LD. SEO-Verlust + UX-Reibung.

---

## 4. Listing-/UX-Audit (live verifiziert via Screenshots)

### `pv-dachziegel` (Desktop + Mobile)

**Above-the-fold:**
- Badge „1 Produkte verfügbar" (orange, dezent)
- H1 „PV Dachziegel"
- 4 Trust-Pills: „Für alle gängigen Dachtypen · Lieferzeit 1–3 Werktage · Gratis Versand ab 100 € · Made in Germany"
- Mini-Wizard „Welcher Dachtyp liegt auf Ihrem Dach?" mit „Alle anzeigen"-Link
- Beratungs-CTA-Bar darüber

**Listing:**
- Filter-Sidebar (Farbe, Länge, Breite)
- Product-Card mit Bild, Tags, Title, Preis, 3 Trust-Dots
- SEO-Texte unter dem Listing („PV-Dachziegel aus Aluminium – für alle gängigen Dachziegeltypen")

**Bewertung:** **Visuell + UX nahezu fertig.** Wirkt nicht wie rohes Listing.

### `braas` / `bramac` / `creaton` / `nelskamp` (Desktop + Mobile)

**Above-the-fold:**
- Badge „1 Produkt verfügbar"
- H1 brand-spezifisch („PV-Dachziegel für Braas")
- 4 Trust-Pills, leicht angepasst pro Brand („passgenau · kein Dachhaken · schnelle Montage · Made in Germany")
- Beratungs-CTA-Bar mit „Beratung anfordern"

**Listing:**
- Filter-Sidebar identisch
- Product-Card identisch (zeigt das eine Produkt „PV-Dachziegel Frankfurter Pfanne" mit Tag „Passend für Braas/Bramac/etc.")

**Bewertung:** **Brand-spezifische Hero-Logik wirkt sauber.** Aber: alle 4 Hersteller-Collections zeigen aktuell **dasselbe einzelne Produkt** — das ist die reale Datenlage, kein Bug. Trotzdem braucht es bei wachsendem Sortiment robuste Differenzierung.

---

## 5. Filter-/Navigations-Audit

**Vorhanden (live verifiziert):**
- Farbe (Aluminium blank · Anthrazit · Ziegelrot)
- Länge
- Breite
- Sort-Dropdown („Sortieren: Beliebtheit")

**Beobachtung:** Bei aktuell 1 Produkt sind Filter visuell präsent aber **funktional ohne Mehrwert**. Nicht entfernen — das wäre falsche Optimierung für die Übergangsphase. Aber: `Empty-State` bei restriktivem Filter nicht getestet — **„Ich kann das nicht bestätigen."**

**Mobile:** Filter-Sidebar kollabiert (auf Screenshots nicht direkt sichtbar). Im Code wird ein Off-Canvas-Filter rendern — **„Ich kann das nicht bestätigen"** ohne Touch-Test.

---

## 6. Mobile-Audit (live verifiziert via iPhone-13-Emulation)

**pv-dachziegel mobile:**
- Header sauber, Trust-Strip 2 Items
- Badge + H1 + Intro-Text + 4 Trust-Pills (1-spaltig)
- Mini-Wizard „Schritt 1 — Welcher Dachtyp" mit „Alle anzeigen"-Link
- Above-the-fold dicht aber lesbar

**braas mobile (Listing):**
- Product-Card schön: großes Bild, Tag „Frankfurter Pfanne", Title, Tag „Passend für Braas", Kurz-Description, Preis „ab €7,79", inkl. MwSt.-Hinweis, 3 Trust-Pills („Passgenau · Made in Germany · 1–3 Werktage")
- Sehr produktiv, nicht mühsam

**Bewertung:** **Mobile ist wirklich gut**, nicht nur OK. Card-Anatomie premium.

---

## 7. Conversion-/Funnel-Audit

**Was gut ist:**
- Brand-Collection führt direkt zum Hersteller-relevanten Produkt
- „Beratung anfordern"-CTA sichtbar im Above-the-fold
- Mini-Wizard auf pv-dachziegel ist ein zweiter Conversion-Hebel

**Was fehlt:**
- Kein expliziter Cross-Link zum **Ziegel-Finder** im Collection-Header (Finder ist dafür gebaut, unsicheren Nutzern zu helfen — der „Welcher Dachtyp"-Wizard auf der Haupt-Collection ist aber inhaltlich überlappend → mögliche Konkurrenz oder Redundanz)
- Kein expliziter Hinweis auf **Projekt-Anfrage** wenn jemand auf Mengen hinweist (z. B. „Mehr als 50 Stück? Projekt-Anfrage" als kleiner Banner)
- „Beratung anfordern"-CTA-Ziel verifizieren — sollte auf `/pages/ziegel-anfrage` zeigen (Foto-Funnel passt zur Unsicherheits-Logik)

---

## 8. Konsistenz zu Navigation / Finder / Anfrage

- Navigation „Ziegel finden" → 4 Hersteller-Collections sind genau diese 4 — ✓ konsistent
- „Beratung anfordern" → vermutlich `/pages/ziegel-anfrage` (Foto-Funnel) — passt, nicht verifiziert
- Tags „Passend für Braas" matchen Hersteller-Logik aus dem Finder-Snippet
- Brand-Intro-Texte konsistent mit Funnel-Tonalität

**Keine harten Brüche entdeckt.**

---

## 9. Antworten auf die 9 Schlüsselfragen

1. **SEO-/Conversion-stark oder zu roh?** **Schon stark, nicht roh.** Visuell + UX premium-niveau, aber SEO-Lücken (Meta + JSON-LD-Inkonsistenz + Breadcrumb).
2. **3 größte SEO-Hebel:** (a) Meta-Description für Hersteller-Collections aus `hersteller_blurb` befüllen, (b) `CollectionPage`-JSON-LD auch für `pv-dachziegel` ausgeben, (c) BreadcrumbList als JSON-LD + sichtbares Markup ergänzen.
3. **3 größte UX-Hebel:** (a) Cross-Link zum Finder im Collection-Header, (b) Projekt-Anfrage-Hinweis bei Mengen-Intent, (c) Empty-State bei aktiver Filter-Restriktion testen + härten.
4. **3 größte Bugs/Reibungspunkte:** (a) JSON-LD-Inkonsistenz pv-dachziegel vs. hersteller, (b) Meta-Description-Lücke, (c) Breadcrumb fehlt komplett. Keine harten Bugs sichtbar.
5. **Hersteller-Collections stark genug?** Ja optisch, **mit der Einschränkung** dass alle aktuell dasselbe einzelne Produkt zeigen (reale Datenlage). Der brand-spezifische Hero macht das beste daraus.
6. **`pv-dachziegel` überzeugend?** Ja, sogar stärker als die Hersteller-Pages dank Mini-Wizard + ausführlichem SEO-Bottom-Text.
7. **Übergänge zu Finder / Anfrage?** Anfrage ja (CTA-Bar). Finder fehlt als expliziter Cross-Link in der Collection — Schwäche, weil der Finder die zentrale „Ich weiß nicht"-Lösung ist.
8. **Mobile ausreichend?** **Ja, wirklich gut.** Card-Anatomie + Trust-Pills + Header lesbar, kein „nur okay".
9. **P1/P2/P3:** siehe unten.

---

## 10. Priorisierte Schwächen

### P1 — SEO-Defekte mit messbarem Impact

1. **Meta-Description für Hersteller-Collections** aus `hersteller_blurb` (oder erstem `<p>` des Body-Intros) als `<meta name="description">` in den `<head>` rendern. **Verlustpotenzial: hoch** (Google-Snippet bleibt aktuell leer/auto-generiert).
2. **`CollectionPage`-JSON-LD auch für `pv-dachziegel`** ausgeben (Code aus is_hersteller-Branch nach außen ziehen, brand-spezifische Felder konditional setzen).
3. **BreadcrumbList** im Collection-Header rendern (sichtbar + JSON-LD `BreadcrumbList`).

### P2 — Conversion-Polish

4. **Finder-Cross-Link** im Collection-Header (kleiner Text-Link „Unsicher? → Ziegel-Finder").
5. **Projekt-Anfrage-Hinweis** als dezenter Banner unter dem Listing („Größere Mengen oder Sonderprofil? → Projekt-Anfrage").
6. **„Beratung anfordern"-CTA-Ziel** verifizieren — zeigt es auf `/pages/ziegel-anfrage`? Code-Probe nötig.
7. **Mini-Wizard auf `pv-dachziegel` vs. Finder** klären — sind das zwei Tools mit überlappender Funktion oder ergänzen sie sich? Konsistenz-Entscheidung treffen.

### P3 — Robustheit für Wachstum

8. **Filter-Empty-State** testen + Copy härten (z. B. „Mit dieser Auswahl keine Produkte. Filter zurücksetzen oder Ziegel-Finder nutzen.")
9. **Pagination** beim Wachstum auf >12 Produkte vorbereiten (aktuell n/a)
10. **Hersteller-Collections-Differenzierung** beim Wachstum: brand-spezifische Inhalte ausbauen, sonst Duplicate-Content-Risiko

---

## 11. Empfohlene Soll-Struktur

Pro Collection-Page:

1. **Breadcrumb** (Startseite → Produkte → Collection)
2. **Hero** (Badge + brand-spezifischer H1 + Intro)
3. **Trust-Pills** (passgenau · Lieferzeit · Versand · Made in Germany)
4. **Funnel-Bridge** (klein, einzeilig: „Unsicher? → Ziegel-Finder | Größere Menge? → Projekt-Anfrage")
5. **Filter + Listing** (unverändert, gut)
6. **SEO-Bottom-Text** (vorhanden auf pv-dachziegel, sollte auf hersteller via `hersteller_blurb` erweiterbar werden)
7. **JSON-LD: BreadcrumbList + CollectionPage + Organization**

---

## 12. Umsetzungsplan

### Phase COLL-1 — SEO-Quick-Wins (klein, 1 Commit)

- Meta-Description-Fallback in `<head>` für Hersteller-Collections aus `hersteller_blurb`
- `CollectionPage`-JSON-LD auch für `pv-dachziegel` ausgeben
- `BreadcrumbList` JSON-LD + sichtbares Breadcrumb-Markup

**Commit:** `seo(collection): add meta description, breadcrumb and unify collectionpage schema`

### Phase COLL-2 — Funnel-Bridge (klein, 1 Commit)

- Finder-Cross-Link im Collection-Header
- Projekt-Anfrage-Hinweis-Banner unter Listing
- Beratungs-CTA-Ziel verifizieren + ggf. korrigieren

**Commit:** `improve(collection): cross-link finder and projekt-anfrage from listing`

### Phase COLL-3 — später, mit Sortimentswachstum

- Filter-Empty-State
- Pagination-Polish
- Hersteller-Differenzierung (Profil-Listen pro Brand, Hilfsmaterial)

---

## Gesamturteil

**Collection-Seiten sind nicht roh — sie sind bereits enterprise-niveau.** Card-Anatomie, brand-spezifische Heros, Trust-Pills, Mini-Wizard auf pv-dachziegel, sauberes Mobile-Rendering: alles solide.

**Die größte Lücke ist SEO** — drei messbare Defekte (Meta-Description, JSON-LD-Inkonsistenz, fehlende Breadcrumbs) mit kleinem Aufwand und hohem Impact.

**Der zweitgrößte Hebel ist die Funnel-Bridge** — Finder + Projekt-Anfrage sind im aktuellen Collection-Layout nicht erkennbar, obwohl beide für genau die Use Cases dort gebaut wurden.

**Empfehlung:** Phase COLL-1 als klar nächster Schritt. Phase COLL-2 danach. COLL-3 erst mit Sortiment.

**Nicht verifizierbar:**
- Echte Filter-Interaktion (Empty-State, Mobile-Off-Canvas) → **„Ich kann das nicht bestätigen"** ohne Touch-Test
- Beratungs-CTA-Ziel im Live-Click → Code-Probe nötig
- Reale Conversion-Differenz Hersteller vs. Haupt-Collection → **„Ich kann das nicht bestätigen"**
