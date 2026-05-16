# Keyword-Priorities blechziegel.de

## Datenquelle
- Semrush (Datenbank `de`, optional `at`/`ch`)
- Schaetzwerte -- **nicht** Google-Search-Console-Livewerte

## Datenstand
- _Stand der Exporte:_ 2026-05-16, qualitative Strategiegrundlage; **numerische Semrush-Werte noch nicht importiert**
- _Letzter Import:_ keine numerischen Daten

## Datenvalidierung (Stand 2026-05-16)
| Datei | Status | Bemerkung |
|---|---|---|
| `domain-overview-de.csv` | Platzhalter | nur Domain-Liste, keine Werte |
| `backlinks-overview.csv` | Platzhalter | keine Backlink-Zahlen vorhanden |
| `top-pages-de.csv` | Platzhalter | keine URLs/Traffic-Werte |
| `organic-keywords-de.csv` | Platzhalter | keine Keywords/Rankings |
| `competitors.csv` | gefuellt | Wettbewerberliste + Rollen + Notizen |
| `keyword-priorities.md` | qualitativ gefuellt | Pflicht-Abgrenzung + Zielseiten-Mapping |
| `theme-url-mapping.md` | vollstaendig | Code-Inventar, technisch belegt |
| `seo-target-pages.md` | gefuellt | Zielseiten-Matrix mit Pflichten |

**Belastbar fuer Sprint 1:** Produktdefinition, Wettbewerber-Rollen, Theme-Mapping, Zielseiten-Matrix.
**Nicht bestaetigbar:** Keyword-Rankings, Suchvolumen, Traffic-Werte, Backlink-Zahlen, Authority Scores.

## Zusammenfassung (qualitativ, ohne Semrush-Zahlen)

Strategischer Stand 2026-05-16:

- Eigene Domain `blechziegel.de`: organische Sichtbarkeit, Backlink-Profil und Top-Pages aktuell **nicht via Semrush belegbar** (Daten fehlen) — „Ich kann das nicht bestaetigen, weil die Datenquelle noch leer ist."
- Wettbewerberlandschaft qualitativ klar (`competitors.csv`): vier verschiedene Hebel — Namespace-Wettbewerber (`blechziegel.com`), Ziegel-Handel (`ziegel-koenig.com`), Bau-Marktplatz (`bau.shop`), PV-/Solarmontage-Spezialist (`venturama-solar.de`).
- Theme-Inventar (`theme-url-mapping.md`) zeigt, welche Templates/Snippets fuer welchen Page-Typ verantwortlich sind -- Umsetzung muss zentral in den `blechziegel-*`-Snippets ansetzen.
- Begriffsrisiko: das Keyword-Cluster „PV-Ziegel / Solarziegel / Solardachziegel" hat hohes Verwechslungsrisiko; Pflicht-Abgrenzung steht.

## Top-Chancen
_(Position 11-30, ausreichend Volumen, akzeptable Keyword Difficulty, gute Produktrelevanz)_

| Keyword | Position | Suchvolumen | URL aktuell | Empfehlung |
|---|---|---|---|---|

## Keywords mit Solarziegel-Verwechslungsrisiko
Begriffe, die zwar Volumen liefern aber falsche Suchintention transportieren koennen
(Nutzer erwartet stromerzeugende Solarziegel statt Aluminium-Ersatzdachziegel):

- PV Ziegel
- PV-Dachziegel
- Solarziegel
- Solardachziegel
- Dachziegel mit Solar
- Solar Dachpfannen
- Photovoltaik Ziegel
- Solar Dachziegel kaufen

Pflicht-Abgrenzung auf Zielseite:
> „Unsere PV-Blechziegel sind keine stromerzeugenden Solarziegel, sondern
> Aluminium-Ersatzdachziegel fuer die sichere Montage von Photovoltaikanlagen
> auf Ziegeldaechern."

## Zielseiten-Mapping
| Keyword-Cluster | Empfohlene Zielseite (Template/URL) | Status |
|---|---|---|
| PV-Blechziegel allgemein | Startseite `/` | offen |
| Hersteller-Profile (Braas, Bramac, Creaton, Nelskamp, Wienerberger) | `/collections/<hersteller>` | offen |
| Modell-Suchintention | `/products/<modell>` | offen |
| Profil-Identifikation | `/pages/ziegel-finder` | offen |
| Montage / Anleitung | `/pages/montageanleitung-mit-dachhaken` + `/ohne-dachhaken` | offen |
| Ratgeber / Edukation | `/pages/ratgeber` + Blog | offen |

## Wettbewerber-Gaps
_(Keyword-Gap-Analyse Semrush gegen folgende Domains — auszufuellen nach Export)_

- blechziegel.com
- ziegel-koenig.com
- bau.shop
- venturama-solar.de

| Gap-Keyword | Wettbewerber rankt | blechziegel.de aktuell | Empfehlung |
|---|---|---|---|

## Backlink-Potenziale
_(nach Backlinks-Export ausfuellen — verweisende Domains der Wettbewerber, die als Linkquelle in Frage kommen)_

Sinnvolle Quellen:
- PV-Fachbetriebe / Solarteure
- Dachdecker-Innungen / regionale Handwerksverzeichnisse
- Hersteller-Partnerseiten (Braas/Nelskamp/Creaton)
- Fachforen (Solar, Photovoltaik, Dachsanierung)
- Montage-/Ratgeber-Blogs
- Online-Magazine (PV-Magazin, Solarserver, Energie-Fachverlage)

## Umsetzungsprioritaeten

> Diese Priorisierung basiert auf der qualitativen Strategiegrundlage
> (Produktdefinition, Wettbewerberrollen, Theme-Mapping, Zielseiten-Matrix)
> und nicht auf konkreten Semrush-Zahlen — diese sind aktuell **nicht importiert**.
> Nach Daten-Import wird die Reihenfolge ggf. neu sortiert nach Position-naehe-Seite-1,
> Volumen und Keyword Difficulty.

### P1 — Sofortmassnahmen

1. **Startseite fuer Kernpositionierung staerken**
   - Zielkeywords: PV-Blechziegel · Blechziegel PV · PV-Dachziegel aus Aluminium · Aluminium-Ersatzdachziegel fuer PV-Montage
   - Hebel: H1, Hero-Intro, Meta Title, Meta Description, Trust-Block, JSON-LD
   - Datei: `sections/blechziegel-home.liquid` (Plan in `sprint-1-startseite-plan.md`)

2. **Klare Abgrenzung zu Solarziegeln**
   - Pflichtformulierung auf Startseite + auf allen Seiten, die einen Solarziegel-Verwechslungs-Begriff nennen:
     > „Unsere PV-Blechziegel sind keine stromerzeugenden Solarziegel,
     > sondern Aluminium-Ersatzdachziegel fuer die sichere Montage von
     > Photovoltaikanlagen auf Ziegeldaechern."
   - Hebel: 1 Snippet (z.B. `snippets/bz-pv-disclaimer.liquid`) einmal anlegen, an mehreren Stellen einbinden

3. **Interne Verlinkung staerken**
   - Hub-Verlinkung in beide Richtungen:
     - Startseite ⇄ Ziegel-Finder
     - Startseite ⇄ Braas-Collection (`/collections/braas`)
     - Startseite ⇄ Nelskamp-Collection (`/collections/nelskamp`)
     - Startseite ⇄ Frankfurter-Pfanne-PDP (`/products/pv-dachziegel-frankfurter-pfanne`)
     - Startseite ⇄ Ratgeber (`/pages/ratgeber`)
     - Startseite ⇄ Montageanleitungen (`/pages/montageanleitung-mit-dachhaken`, `.../ohne-dachhaken`)
   - Hebel: kontextuelle Text-Links in Hero/USPs/FAQ-Bloecken, keine Footer-Spam-Liste

4. **Stoerkeyword „allersberger straße 185 dhl"**
   - Status: **zu pruefen** — nicht in den aktuellen Daten bestaetigt
     („Ich kann das nicht bestaetigen, weil `organic-keywords-de.csv` noch leer ist.")
   - Nach Daten-Import: pruefen, ob der Begriff auf blechziegel.de rankt; falls ja, technische Ursache pruefen (Footer, Impressum, alt-Text, JSON-LD, Versandseite, Shop-Pay/DHL-Snippet)

5. **Backlink-Basis aufbauen**
   - Risiko-Annahme „0 Follow-Links bei blechziegel.de": **zu pruefen** — `backlinks-overview.csv` enthaelt aktuell keine Werte
     („Ich kann das nicht bestaetigen, weil `backlinks-overview.csv` noch leer ist.")
   - Vorbereitung trotzdem moeglich: Liste passender Backlink-Quellen (siehe `Backlink-Potenziale`)

### P2 — Seiten-/Content-Ausbau

1. **Herstellerseiten staerken** (Collection-Hero-Section + JSON-LD)
   - `/collections/braas`
   - `/collections/nelskamp`
   - `/collections/creaton`
   - `/collections/wienerberger` (Handle ist ggf. noch zu pruefen — Hersteller existiert in `competitors`/`finder-data` nicht zwingend als Collection)
   - `/collections/bramac`
   - Hebel: H1 mit Hersteller + „Aluminium-Ersatzdachziegel", Intro mit Profil-Liste, FAQ pro Hersteller, interne Links zu Top-Modellen, Canonical-Sanity

2. **Ratgeber-Content aufbauen**
   - Long-Tail-Cluster (Pages oder Blog-Artikel):
     - „Dachziegel mit PV-Halterung"
     - „Ersatzdachziegel fuer Photovoltaik"
     - „PV-Montage auf Ziegeldach"
     - „Dachhaken ohne Ziegelbruch"
     - „Blechersatzziegel PV"
     - „Metalldachplatte PV"
   - Hebel: `/pages/ratgeber` als Hub + 4-6 thematische Sub-Pages oder Blog-Artikel

3. **Ziegel-Finder als SEO-/Conversion-Hub staerken**
   - Datei: `snippets/blechziegel-ziegel-finder.liquid` + `templates/page.ziegel-finder.json` (Page-Body schon in Phase Anfang Mai auf Accordion umgestellt)
   - Hebel: sichtbarer Erklaerungstext, FAQ-Block (bereits da), interne Links zu allen Hersteller-Profilen, interne Verlinkung zu Top-Modellen, Canonical, Indexierbarkeit

### P3 — Offpage / Backlink / Autoritaet

1. **Linkaufbau** ueber:
   - PV-Fachbetriebe (Solar-Installateur-Verzeichnisse)
   - Solarteure (Branchenportale)
   - Dachdecker / Dachdeckerinnungen
   - Hersteller-/Partnerseiten (Braas, Nelskamp, Creaton Partnernetzwerk)
   - Fachforen (PV-Forum, Photovoltaik-Forum, Solar-Forum)
   - Montage-/Ratgeber-Blogs (PV-Magazin, Solarserver, etc.)
   - Regionale Unternehmensprofile (Nuernberg, Mittelfranken, Bayern)

2. **Wettbewerber-Backlinks detailliert analysieren** -- nach Backlinks-Export der vier Wettbewerber Linkquellen-Liste ableiten

3. **GSC / GA4 als echte Datenquelle ergaenzen** -- Semrush ist nur Schaetzung; reale CTR-/Click-/Impression-Daten kommen aus GSC, reale Traffic-Daten aus GA4 -- Anbindung als naechster Vorbereitungsschritt

## Offene Daten / nicht bestaetigbar
- Aktuelle Semrush-Werte (Organic Traffic, AS, Keyword-Volumen, CPC) — **noch nicht exportiert**, bis Import: „Ich kann das nicht bestaetigen."
- Konkrete Wettbewerber-Overlap-Werte — abhaengig von Semrush-Bulk-Export
- Backlink-Anzahl + verweisende Domains — abhaengig von Semrush-Backlinks-Analytics
