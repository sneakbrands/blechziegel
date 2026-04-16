# Masterplan — Hersteller als tragende Shop-Struktur

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Antwort auf:** [`STRATEGIE_HERSTELLER_HUB_PROMPT.md`](./STRATEGIE_HERSTELLER_HUB_PROMPT.md)
**Methode:** Live-Probe via Playwright + Shopify-Admin-API (Smart-Collections, Produkt-Datenmodell) + Code-Read

---

## 1. Geprüfte Seiten / Bereiche

| Bereich | Quelle |
|---|---|
| `/pages/hersteller` (Hub-Page) | Live (Desktop+Mobile) + [`snippets/blechziegel-hersteller.liquid`](../snippets/blechziegel-hersteller.liquid) |
| `/collections/{braas,bramac,creaton,nelskamp,pv-dachziegel}` | Live + COLL-1-Verify |
| Navigation (`menu.json` → live `main-menu`) | Code + Live |
| Smart-Collections (Shopify Admin API) | REST: `/smart_collections.json` |
| Produkt-Datenmodell (Vendor/Type/Tags/Metafields) | REST: `/products.json` |

## 2. Methodik

- **Live verifiziert:** Hub-Page Desktop+Mobile-Screenshots, DOM-Probe (H1, H2, sectionsCount, links), Smart-Collection-Rules via Shopify-API, Produkt-Tag-Liste
- **Aus Code/Shop-Struktur abgeleitet:** Hub-Snippet-Inhalt, Menu.json
- **Nicht sicher verifizierbar:** Suchvolumen-/Conversion-Daten pro Hersteller, Google-Indexierung der neuen Schema-Markup-Änderungen — **„Ich kann das nicht bestätigen."**

---

## 3. Aktuelle Struktur (Ist)

### 3.1 Hub-Page `/pages/hersteller` — **bereits Hub**

Live verifiziert: Custom-Snippet [`blechziegel-hersteller.liquid`](../snippets/blechziegel-hersteller.liquid) rendert:
- H1 „PV-Dachziegel nach Hersteller. Finde dein Modell in 3 Klicks."
- Brand-Cards (Braas · Bramac · Creaton · Nelskamp)
- 6 Trust/Service-USP-Cards (u. a. „10 Hersteller, die wir abdecken", „Passgenau zum Originalprofil", „Sonderanfertigung nach Foto")
- 13 `<section>` insgesamt, 25 Collection-Links
- Title: „PV-Dachziegel nach Hersteller – Blechziegel.de"
- **Kein Breadcrumb** (Hub liegt logisch nahe Root, aber Breadcrumb-Konsistenz fehlt)

**Befund:** Schon ein echter Hub, kein Stub. Kein Neubau nötig — nur Konsolidierung + Anschluss.

### 3.2 Hersteller-Collections (`/collections/braas` etc.)

- **Smart-Collections** mit Regel `tag = "<handle>"` (4× Hersteller + 1× pv-dachziegel + 1× frankfurter-pfanne)
- Brand-spezifische H1 + Hero (NAV-1/COLL-1-Polish)
- BreadcrumbList: `Startseite > Hersteller > Braas` ✓ konsistent

### 3.3 Haupt-Collection `/collections/pv-dachziegel`

- Smart-Collection mit Regel `tag = "pv-dachziegel"`
- Aktuell **selbe einzelne Produkt** wie alle Hersteller-Collections (1 Produkt im Sortiment)
- BreadcrumbList: `Startseite > Produkte > PV Dachziegel` — Position 2 + 3 zeigen auf gleiche URL (semantisch schwach)
- Keine Hub-Funktion, keine Brand-Differenzierung — schlanke flache Liste

### 3.4 Navigation

```
Top-Level (NAV-1):
  Ziegel finden ▼   → Finder + 4 Hersteller-Collections + Alle Hersteller
  Produkte ▼        → PV Dachziegel + Alle Produkte
  Anfrage ▼         → Ziegel-Anfrage + Projekt-Anfrage
  Für Profis ▼      → Gewerbe + Solar-Installateure + Händler + Projekt-Anfrage
  Ratgeber          → /pages/ratgeber
```

**Befund:** „Ziegel finden" und „Produkte" sind zwei Top-Level-Pfade in dasselbe Sortiment — semantischer Overlap.

### 3.5 Datenmodell (Live aus Shopify-API)

Beispiel-Produkt `pv-dachziegel-frankfurter-pfanne`:
- `vendor`: **„BHE Metalle"** (interner Lieferant — leakt nach außen!)
- `product_type`: „Ziegel"
- `tags`: `braas, bramac, creaton, frankfurter-pfanne, nelskamp, pv-dachziegel`
- `custom.passende_hersteller`: Format „Profil (Hersteller)" für Finder-Logik

**Drei konkurrierende Hersteller-Zuordnungs-Quellen:**
1. **Tag-Feld** — Smart-Collections-Basis, mehrere Hersteller pro Produkt möglich ✓
2. **Metafield `custom.passende_hersteller`** — Finder-Logik, kombiniert Profil + Hersteller
3. **Vendor-Feld** — aktuell „BHE Metalle" (Lieferantenname, nicht Marke)

---

## 4. Hauptprobleme

### P1 — strukturell

1. **Vendor-Leak „BHE Metalle"** — interner Lieferantenname statt Marke. SEO + UX-Risiko (z. B. Schema.org `manufacturer`/`brand`-Felder, JSON-LD-Konsistenz, Cart-Page-Brand-Anzeige).
2. **`pv-dachziegel`-Breadcrumb-Selbstverweis** (Pos 2 + 3 = gleiche URL).
3. **Semantische Konkurrenz Menü** — „Ziegel finden" + „Produkte" laufen ins gleiche Sortiment.
4. **PDP hat keinen Breadcrumb** — bei Hersteller-Strategie zwingend nötig (`Startseite > Hersteller > Braas > Frankfurter Pfanne`).

### P2 — Konsistenz

5. **Hub-Page hat kein Breadcrumb** (`Startseite > Hersteller`).
6. **„Hersteller" als Top-Level fehlt** in der Hauptnavigation — liegt nur als Submenu-Item unter „Ziegel finden". Bei Hersteller-Strategie als tragende Achse fehlplatziert.
7. **Drei-Quellen-Datenmodell** für Hersteller-Zuordnung — Tag/Metafield/Vendor ohne führende Wahrheit.

### P3 — Polish

8. **„25+ Jahre"-Claim** auf der Hub-Page (in einer USP-Card sichtbar) — wurde an anderer Stelle schon als unverifiziert markiert.
9. **„Frankfurter Pfanne"-Smart-Collection** existiert ohne dazugehörige Profil-Hub-Logik (latenter Pfad für Profil-zentrierten Einstieg).

---

## 5. Empfohlene Soll-Architektur

### 5.1 Rollen-Definition (klare Empfehlung)

| Element | Soll-Rolle |
|---|---|
| `/pages/hersteller` | **Hub** — kanonische Hersteller-Übersicht. Breadcrumb-Position 2 für alle Hersteller-Collections + PDPs. |
| `/collections/{brand}` | **Brand-Landing** — kaufnahe SEO-/Conversion-Seite je Hersteller |
| `/collections/pv-dachziegel` | **Sammel-Liste „Alle Produkte"** — flacher Index, sekundär. Wird ggf. später technisch mit `/collections/all` zusammengelegt. |
| `/pages/ziegel-finder` | **Problem-Löser-Tool** (UX, kein SEO-Hub) |
| `Ziegel finden` (Menü) | bleibt — UX-Sprache für unsichere Endnutzer |
| `Produkte` (Menü) | umbenennen oder degradieren — siehe 5.4 |

### 5.2 Konkrete Empfehlung pro Schlüsselfrage

**1. Hersteller als tragende Struktur sinnvoll?**
**Ja.** Suchintention im Markt ist marken-zentriert („Braas Frankfurter Pfanne"), Sortiment ist hersteller-erweiterbar, Finder + Hub sind bereits hersteller-orientiert gebaut. Architektur ist 80 % schon da.

**2. Rolle `pv-dachziegel`?**
**Sekundäre flache Übersicht** — bleibt als Backup-Liste „Alle Produkte". Nicht entfernen (existierende SEO-URL + Smart-Collection-Tag), aber Breadcrumb-Pfad kürzen auf 2 Ebenen: `Startseite > PV Dachziegel`. Im Menü unter „Alle Produkte" sekundär.

**3. Menüpunkt „Produkte"?**
**Umbenennen + degradieren.** Empfehlung: aus „Produkte" wird ein leichter sekundärer Pfad. Top-Level-Slot frei für „Hersteller" als eigenes Top-Level — siehe 5.4.

**4. `/pages/hersteller` als eigentlicher Hub?**
**Ja.** Bereits Hub im Code. Muss nur konsequent verlinkt werden + Breadcrumb-Top-Knoten für alle Hersteller-Collections + PDPs werden.

**5. Breadcrumb-Logik?**
- Hub: `Startseite > Hersteller`
- Hersteller-Collections: `Startseite > Hersteller > Braas` ✓ schon korrekt
- PDP (Brand-Tagged): `Startseite > Hersteller > Braas > Frankfurter Pfanne`
- pv-dachziegel: `Startseite > PV Dachziegel` (kein „Produkte"-Selbstverweis mehr)

**6. Wichtigste Datenmodell-Änderung?**
**Tag bleibt führende Quelle für Hersteller-Zuordnung.** Begründung: erlaubt Mehrfach-Zuordnung pro Produkt (1 Produkt → mehrere Marken-Tags), Smart-Collections funktionieren bereits darauf, Finder kombiniert mit Metafield.

**Vendor-Feld umwidmen** auf eigene Marke „blechziegel.de" oder „Blechziegel.de" (= Anbieter), **nicht** den internen Lieferanten „BHE Metalle". Vendor leakt sonst über Schema.org `brand` ins SERP.

Metafield `custom.passende_hersteller` bleibt für Finder-Profil-Hersteller-Mapping. Keine Konsolidierung nötig — die drei Felder haben jetzt unterschiedliche Rollen:
- Tag = Brand-Zugehörigkeit (für Listing/Nav)
- Metafield = Profil-Hersteller-Kombi (für Finder)
- Vendor = Anbieter-Identität (für Schema/Cart)

**7. Reicht ein Folgefix?**
**Nein.** 5–7 strukturelle Eingriffe greifen ineinander (Vendor-Umwidmung, Menü-Umbau, Breadcrumb-Konsistenz, PDP-Breadcrumb, Hub-Breadcrumb, ggf. pv-dachziegel-Pfad-Klärung). Eigene Phase rechtfertigt sich.

### 5.3 Soll-Menü (nach Phase H1)

```
Top-Level:
  Ziegel finden ▼   → Finder als Hauptlink + Sub: Finder · Wie messen · Wie identifizieren
  Hersteller ▼      → Hub als Hauptlink + Sub: Braas · Bramac · Creaton · Nelskamp · Alle Hersteller
  Anfrage ▼         → Ziegel-Anfrage · Projekt-Anfrage  (unverändert)
  Für Profis ▼      → Gewerbe · Solar · Händler · Projekt-Anfrage  (unverändert)
  Ratgeber          → /pages/ratgeber
  (entfernt: „Produkte" als Top-Level — wird in „Hersteller > Alle Hersteller" + Footer-Link „Alle Produkte" aufgefangen)
```

### 5.4 Soll-Breadcrumb-Logik (vereinheitlicht)

| Seite | Breadcrumb |
|---|---|
| Hub `/pages/hersteller` | Startseite > Hersteller |
| `/collections/braas` etc. | Startseite > Hersteller > Braas |
| `/collections/pv-dachziegel` | Startseite > PV Dachziegel |
| `/collections/all` | Startseite > Alle Produkte |
| PDP (mit Tags) | Startseite > Hersteller > Braas > Frankfurter Pfanne |
| `/pages/ziegel-finder` | Startseite > Ziegel finden |
| `/pages/ziegel-anfrage` | Startseite > Anfrage > Ziegel-Anfrage |
| `/pages/projekt-anfrage` | Startseite > Anfrage > Projekt-Anfrage |

---

## 6. Shopify-/Datenmodell-Folgen

### Pflicht

1. **Vendor-Feld umwidmen** auf „Blechziegel.de" für alle aktiven Produkte. **Ich kann das nicht bestätigen**, ob das in PDP/Cart-Anzeigen oder Drittanwendungen Auswirkungen hat — vorher prüfen.
2. **Hersteller-Tag-Disziplin** dokumentieren: Pro Produkt nur die Hersteller taggen, deren Profile real abgedeckt sind. Aktueller Stand (1 Produkt mit allen 4 Brand-Tags) ist OK, weil das Produkt tatsächlich auf alle 4 Marken passt.
3. **Smart-Collection-Audit:** prüfen, ob `frankfurter-pfanne`-Collection (existiert lt. API!) sinnvoll genutzt wird oder gelöscht werden sollte. **Ich kann das nicht bestätigen** ohne Klärung der Profil-Hub-Strategie.

### Mittel

4. **Menu.json updaten** für neue Top-Level-Struktur (entferne „Produkte", nimm „Hersteller" rein) → via `set-menu.js`.
5. **PDP-Breadcrumb-Snippet** bauen (oder im PDP-Section ergänzen). Brand-Detection über Tags.
6. **Hub-Page-Breadcrumb** ergänzen.
7. **pv-dachziegel-Breadcrumb** kürzen auf 2 Ebenen.

### Optional

8. **Profil-Hub** (z. B. `/pages/profile`) für Cross-Brand-Profile wie „Frankfurter Pfanne" — Mehrwert wenn Sortiment mehrere Profile pro Marke führt.
9. **Hersteller-spezifische Landing-Pages mit eigener Marken-Story** (z. B. `/pages/braas`) — höherer SEO-Hebel, aber Verdoppelung mit `/collections/braas`.

---

## 7. Menü-/Breadcrumb-Folgen (konsolidiert)

- Menu.json muss ein neues Top-Level „Hersteller" bekommen (vor „Anfrage")
- Bestehendes „Produkte" entfernen oder degradieren
- Hub-Page bekommt Breadcrumb
- Alle Collection-Templates: Breadcrumb-Logik schon da, nur pv-dachziegel-Pfad korrigieren
- PDP-Section bekommt Breadcrumb-Block (neue Komponente)

---

## 8. Priorisierte Umsetzungsphasen

### Phase H1 — Strukturentscheidung + Menü (klein, 1 Commit)

- Soll-Menü via `menu.json` + `set-menu.js`: „Hersteller" als Top-Level rein, „Produkte" raus oder degradieren
- Theme-Side: Top-Level-Polish (Orange-Dot-Akzent ggf. von „Ziegel finden" auf „Hersteller" verschieben — strategisch?)
- Snapshot-Doc aktualisieren

**Commit:** `refactor(nav): elevate hersteller to top-level menu`

### Phase H2 — Hub-Page-Anschluss (klein, 1 Commit)

- Breadcrumb auf `/pages/hersteller` ergänzen (im `blechziegel-hersteller.liquid`-Snippet)
- Internal-Links polieren
- Kleinere Trust-Claims (z. B. „25+ Jahre") konsistent zur sonst etablierten Linie schalten

**Commit:** `refine(hersteller-hub): add breadcrumb and align trust claims`

### Phase H3 — pv-dachziegel-Pfad-Korrektur (klein, 1 Commit)

- Breadcrumb auf `pv-dachziegel` von 3 auf 2 Ebenen kürzen (Selbstverweis raus)
- BreadcrumbList-JSON-LD entsprechend anpassen
- Optional: Hero-Text leicht entschärfen (mehr „Übersicht aller Produkte" als „PV Dachziegel" Marken-Pendant)

**Commit:** `fix(coll): shorten pv-dachziegel breadcrumb to 2 levels`

### Phase H4 — PDP-Breadcrumb (mittel, 1 Commit)

- Im PDP-Section neuen Breadcrumb-Block: `Startseite > Hersteller > <ersterTag> > <Produktname>`
- Tag-basierte Brand-Detection (erster Hersteller-Tag aus dem Liste-Filter `braas|bramac|creaton|nelskamp|...`)
- BreadcrumbList-JSON-LD ergänzen
- Mobile + Desktop testen via Playwright

**Commit:** `feat(pdp): add breadcrumb above product details`

### Phase H5 — Datenmodell-Hygiene (mittel-groß, 1 Commit + Admin-Skript)

- Vendor-Feld auf „Blechziegel.de" setzen für alle Produkte (via `/products/{id}.json` PUT)
- `frankfurter-pfanne`-Smart-Collection prüfen: behalten + ausbauen ODER deaktivieren
- Hersteller-Tag-Konsistenz-Audit
- Doku in `docs/HERSTELLER_DATENMODELL.md` festhalten

**Commit:** `data(products): align vendor field with brand identity; document model`

### Phase H6 — optional: Profil-Hub (groß, eigene Phase)

Nur falls Sortiment >1 Profil pro Marke wächst. Neue Landing `/pages/profile` mit Profil-Cards.

---

## 9. Fazit / klare Empfehlung

**Hersteller als tragende Shop-Struktur ist sinnvoll und 80 % bereits gebaut.**

Was fehlt, ist **strukturelle Konsequenz** in 4 Punkten:
1. Menü-Top-Level „Hersteller" (statt nur Submenu-Item)
2. Hub-Anschluss per Breadcrumb
3. pv-dachziegel-Pfad-Korrektur
4. PDP-Breadcrumb

Plus **Datenmodell-Hygiene** (Vendor-Umwidmung) als wichtigstes Backend-Reinemachen.

**Empfehlung:**
- **Phase H1 + H2 + H3** als einzelne kleine Commits unmittelbar umsetzbar — niedrige Risiken, hoher Konsistenz-Effekt
- **Phase H4** danach (mittel)
- **Phase H5** mit kurzer Vorprüfung (Vendor-Effekt auf Schema/Cart) — wichtigste **strukturelle** Sache, weil sonst „BHE Metalle" über Schema in SERPs leakt
- **Phase H6** erst mit Sortimentswachstum

**Antwort auf „Reicht ein kleiner Folgefix?":** **Nein** — eigene Strukturphase mit 4–5 sinnvoll geschnittenen Commits ist klar besser als 10 Mikro-Polishes.

**Nicht verifizierbar:**
- Effekt einer Vendor-Umwidmung auf bestehende Cart-/PDP-Anzeigen → Vorprüfung im Theme nötig → **„Ich kann das nicht bestätigen"**
- SEO-Index-Auswirkung des Menü-Umbaus auf bestehende Rankings → **„Ich kann das nicht bestätigen"**
- Ob „Frankfurter Pfanne"-Smart-Collection Traffic hat → bräuchte GA-Daten → **„Ich kann das nicht bestätigen"**
