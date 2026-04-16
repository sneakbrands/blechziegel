# CLAUDE CODE — STRATEGIE-HERSTELLER-HUB
# Fokus: Hersteller als tragende Shop-/Collection-Struktur
# Ziel: saubere Strukturphase statt vieler Mikro-Fixes

Arbeite im bestehenden Branch:

`feat/ziegel-finder-enterprise`

Prüfe zusätzlich live auf:

`https://blechziegel.de`

## Kontext
COLL-1 ist abgeschlossen und live verifiziert.

Aktueller Stand:
- Meta-Descriptions für Collections sind da
- CollectionPage + BreadcrumbList sind da
- sichtbare Breadcrumbs sind da
- Hersteller-Collections funktionieren technisch und visuell sauber

Strategischer Befund:
**Wenn der Shop künftig stärker auf Hersteller aufgebaut werden soll, reicht kein weiterer Mikro-Fix.**
Es braucht eine eigene Strukturphase.

Der Live-/Strategiebericht hat gezeigt:
- Hersteller-Collections passen bereits gut zur Logik `Startseite > Hersteller > Braas`
- `pv-dachziegel` ist semantisch der schwächere Sonderfall
- Menü, Collection-Achse, Datenmodell und Hub-Logik greifen zusammen

Diese Phase ist deshalb **kein kleiner Bugfix**, sondern eine **saubere Strukturentscheidung**.

---

# WICHTIG — PLAYWRIGHT / CHROME / SCREENSHOTS NUTZEN
Wenn Browser-Tools / Playwright / Chrome verfügbar sind, **nutze diese aktiv**.

Das bedeutet:
- relevante Hersteller-/Collection-/Hub-Seiten live öffnen
- Desktop + Mobile Screenshots erstellen
- Navigation, Breadcrumbs, Hub-Logik und Collection-Pfade live prüfen
- nicht nur Code lesen
- nicht nur HTML parsen

## Live verifiziert vs. Code abgeleitet
Wenn etwas im Browser / per Screenshot geprüft wurde:
- als **live verifiziert** kennzeichnen

Wenn etwas nur aus Code oder Shopify-Struktur abgeleitet wurde:
- als **aus Code/Shop-Struktur abgeleitet** kennzeichnen

Wenn etwas nicht sicher verifizierbar ist:
- **„Ich kann das nicht bestätigen.“**

---

# ZIEL DER PHASE

Der Shop soll künftig auf einer klareren Hersteller-Achse aufbauen.

Das heißt:
- Hersteller wird zur tragenden Struktur für Orientierung und Produktfindung
- Finder bleibt als Problemlöser-Einstieg erhalten
- `pv-dachziegel` wird sauber eingeordnet
- Menü, Collection-Logik, Breadcrumbs und Datenmodell werden konsistent gedacht

---

# HARTE REGELN

## 1) Erst analysieren, dann umbauen
Diese Phase startet mit:
- Strukturprüfung
- Soll-Architektur
- Folgenabschätzung
- priorisiertem Umsetzungsplan

Nicht blind direkt 10 Dateien umbauen.

## 2) Strategie vor Mikro-Polish
Nicht in Details verlieren wie:
- einzelne Microcopy
- kleine CSS-Polishes
- isolierte Einzel-Breadcrumb-Fixes

Erst die Strukturfrage lösen.

## 3) Hersteller-Achse klar definieren
Es muss am Ende klar sein:
- was ist Hub?
- was ist Collection?
- was ist Einstieg?
- was ist sekundärer Pfad?

## 4) Shopify-Struktur mitdenken
Nicht nur Theme-Code ansehen.
Mitdenken:
- Menüs
- Collections
- Smart-Collections / Regeln
- Metafields
- Vendor / Tags / Datenmodell
- mögliche Hub-Seiten

## 5) Keine Vermutungen als Fakten
Wenn etwas in Shopify-Daten oder Live-Struktur nicht sicher verifizierbar ist:
**„Ich kann das nicht bestätigen.“**

---

# AUFGABE

Erarbeite eine belastbare Zielarchitektur für **Hersteller als Basis** und liefere danach:

1. Ist-Analyse
2. Strukturprobleme
3. Soll-Architektur
4. nötige Shopify-/Shop-Änderungen
5. Theme-/Breadcrumb-/Menü-Folgen
6. priorisierte Umsetzungsphasen

Noch **nicht direkt alles umbauen**.
Erst die Struktur sauber festziehen.

---

# TEIL A — IST-ANALYSE

## 1) Aktuelle Struktur erfassen
Prüfe und dokumentiere:
- `/pages/hersteller`
- `/collections/pv-dachziegel`
- Hersteller-Collections (`braas`, `bramac`, `creaton`, `nelskamp`)
- Navigation (`Ziegel finden`, `Produkte`, `Anfrage`, `Für Profis`, `Ratgeber`)
- Breadcrumb-Logik auf Collections
- relevante PDP-Einstiege soweit nötig

## 2) Aktuelle semantische Rollen klären
Für jede Ebene beantworten:
- ist das Hub-Seite?
- ist das Produktliste?
- ist das Finder-/Orientierungspfad?
- ist das SEO-Landing?
- ist das nur historisch gewachsen?

Besonders klären:
- Was ist `pv-dachziegel` künftig?
- Was ist `/pages/hersteller` künftig?
- Was ist der Unterschied zwischen `Ziegel finden` und `Produkte`?

---

# TEIL B — STRUKTURPROBLEME BENENNEN

Beantworte klar:

1. Wo konkurrieren aktuell mehrere ähnliche Einstiege miteinander?
2. Wo ist `pv-dachziegel` semantisch zu schwach oder redundant?
3. Ist `/pages/hersteller` schon echter Hub oder nur Zwischenstation?
4. Welche Collection-/Breadcrumb-Logik passt nicht zur Hersteller-Strategie?
5. Welche Menüeinträge müssten sich mittelfristig ändern?

---

# TEIL C — SOLL-ARCHITEKTUR ENTWERFEN

Leite eine klare Sollstruktur ab.

## Zielrichtung
Hersteller soll die tragende Struktur werden, aber:
- Finder bleibt der Problemlöser
- direkter Kaufpfad bleibt erhalten
- Anfragepfade bleiben klar

## Erwartete Zieldefinitionen
Mindestens sauber beantworten:

### 1. Hersteller-Hub
Was soll `/pages/hersteller` künftig sein?
Zum Beispiel:
- zentrale Übersicht aller Marken
- Brand-Cards
- Direktlink zu Hersteller-Collections
- evtl. kurze Hersteller-Introtexte

### 2. Hersteller-Collections
Was sollen `/collections/braas`, `/collections/bramac`, ... künftig sein?
Zum Beispiel:
- eigentliche kaufnahe Brand-Listings
- SEO- und Conversion-Landing pro Hersteller

### 3. Haupt-Collection `pv-dachziegel`
Welche Rolle soll sie künftig haben?
Zum Beispiel eine von drei Richtungen:
- echte Haupt-Collection „Alle Produkte"
- sekundäre flache Übersicht
- oder perspektivisch entbehrlich / umdeutbar

Du sollst hier **klar empfehlen**, nicht nur Optionen auflisten.

### 4. Menü-Logik
Wie soll das Top-Level dazu langfristig passen?
Insbesondere:
- `Ziegel finden`
- `Produkte`
- `Hersteller`
- ggf. `Alle Produkte`

### 5. Breadcrumb-Logik
Welche Breadcrumb-Struktur soll daraus folgen?
Für:
- Hersteller-Hub
- Hersteller-Collections
- Haupt-Collection
- perspektivisch PDPs

---

# TEIL D — SHOPIFY-/DATENMODELL-FOLGEN

Prüfe und beschreibe die nötigen Folgeänderungen in Shopify / Datenmodell.

## Besonders wichtig
- Vendor
- Tags
- Smart-Collections
- Metafields wie `custom.passende_hersteller`
- Menüpflege
- Hub-/Page-Struktur
- interne Links

## Ziel
Empfehle eine **führende Datenquelle** für Hersteller-Zuordnung.

Nicht nur sagen „müsste man prüfen“ — gib eine klare Empfehlung.

---

# TEIL E — PRIORISIERTER UMSETZUNGSPLAN

Erstelle daraus einen realistischen Phasenplan.

Zum Beispiel in dieser Richtung:

## Phase H1
Architektur / Hub / Menü / Breadcrumb-Entscheidung

## Phase H2
Hub-Seite `/pages/hersteller` ausbauen

## Phase H3
Collection- und PDP-Pfade anpassen

## Phase H4
Datenmodell konsolidieren

Du musst nicht genau diese Labels nutzen, aber der Plan soll:
- logisch
- priorisiert
- umsetzbar
sein.

---

# DIESE FRAGEN MUSST DU AUSDRÜCKLICH BEANTWORTEN

1. Ist Hersteller als tragende Shop-Struktur sinnvoll?
2. Welche Rolle soll `pv-dachziegel` künftig haben?
3. Soll `Produkte` im Menü bleiben, umbenannt werden oder sekundär werden?
4. Soll `/pages/hersteller` der eigentliche Hub werden?
5. Welche Breadcrumb-Logik folgt daraus?
6. Welche Shopify-/Datenmodell-Änderung ist die wichtigste?
7. Reicht ein kleiner Folgefix oder braucht es eine echte Strukturphase?

---

# ERWARTETES ERGEBNISFORMAT

## 1. Geprüfte Seiten / Bereiche
## 2. Methodik
- live verifiziert
- Screenshots verwendet
- aus Code/Shop-Struktur abgeleitet
- nicht sicher verifizierbar

## 3. Aktuelle Struktur
## 4. Hauptprobleme
## 5. Empfohlene Soll-Architektur
## 6. Shopify-/Datenmodell-Folgen
## 7. Menü-/Breadcrumb-Folgen
## 8. Priorisierte Umsetzungsphasen
## 9. Fazit / klare Empfehlung

---

# ZIEL
Am Ende soll nicht nur klar sein,
**dass Hersteller wichtig sind**,
sondern **wie die gesamte Shop-Struktur künftig sauber darum gebaut wird**.

Führe jetzt diese Strukturphase als Audit + Zielarchitektur aus und liefere einen ehrlichen, priorisierten Masterplan.