# Keyword-Priorities blechziegel.de

## Datenquelle
- Semrush (Datenbank `de`, optional `at`/`ch`)
- Schaetzwerte -- **nicht** Google-Search-Console-Livewerte

## Datenstand
- _Stand der Exporte:_ 2026-05-16 — Domain-Overview, Backlinks und Top-Pages **importiert**
- _Letzter Import:_ Domain Overview DE + Backlink Overview + Top Pages DE (alle Semrush-Schaetzung)
- _Weiterhin offen:_ `organic-keywords-de.csv` (keine Keyword-Rankings importiert)

## Datenvalidierung (Stand 2026-05-16)
| Datei | Status | Bemerkung |
|---|---|---|
| `domain-overview-de.csv` | **gefuellt** | 5 Domains, Organic + Ads, AS-Spalte leer |
| `backlinks-overview.csv` | **gefuellt** | 5 Domains, Backlinks/RefDom/Follow/AS/TS |
| `top-pages-de.csv` | **gefuellt** | 19 Pages ueber 5 Domains |
| `organic-keywords-de.csv` | Platzhalter | keine Keywords/Rankings importiert |
| `competitors.csv` | gefuellt | Wettbewerberliste + Rollen + Notizen |
| `keyword-priorities.md` | aktualisiert | P1/P2/P3 + Semrush-Datenbasis |
| `theme-url-mapping.md` | vollstaendig | Code-Inventar, technisch belegt |
| `seo-target-pages.md` | gefuellt | Zielseiten-Matrix mit Pflichten |

**Belastbar fuer Sprint 1:** Produktdefinition, Wettbewerber-Rollen, Theme-Mapping, Zielseiten-Matrix, **Domain-Sichtbarkeit, Top-Pages, Backlink-Profil**.
**Nicht bestaetigbar:** konkrete Keyword-Rankings + Suchvolumen + Position-Drift (organic-keywords-de.csv noch leer).

## Bestaetigte Semrush-Datenbasis, Stand 2026-05-16

### Domain Overview DE (Semrush-Schaetzung)
| Domain | Organic KW | Organic Traffic | Organic Cost | Ads KW | Ads Traffic | Ads Cost |
|---|---:|---:|---:|---:|---:|---:|
| **blechziegel.de** | **17** | **0** | 0 | 1 | 12 | 10 |
| blechziegel.com | 126 | 131 | 115 | 0 | 0 | 0 |
| ziegel-koenig.com | 18 | 195 | 253 | 11 | 58 | 21 |
| bau.shop | 2.038 | 4.914 | 4.028 | 7 | 27 | 35 |
| venturama-solar.de | 4.418 | 17.286 | 14.903 | 21 | 361 | 306 |

Authority Score (Domain-Overview-Spalte) ist im Export leer; AS-Werte siehe Backlink-Overview.

### Backlink Overview (Semrush-Schaetzung)
| Domain | Backlinks | Ref Dom | **Follow** | Nofollow | AS | TS |
|---|---:|---:|---:|---:|---:|---:|
| **blechziegel.de** | 21 | 17 | **0** ⚠ | 21 | 0 | 0 |
| blechziegel.com | 28 | 19 | 3 | 25 | 0 | 0 |
| ziegel-koenig.com | 195 | 98 | **145** | 50 | 8 | 8 |
| bau.shop | 17.987 | 1.456 | **17.789** | 192 | 10 | 10 |
| venturama-solar.de | 6.122 | 285 | 544 | 5.611 | 28 | 28 |

### Top Pages (Semrush-Schaetzung)

Markierte Benchmarks fett.

| Domain | URL | KW | Traffic | Page-Typ |
|---|---|---:|---:|---|
| blechziegel.de | **`/collections/braas`** | 6 | 0 | collection |
| blechziegel.de | **`/`** | 4 | 0 | home |
| blechziegel.de | **`/collections/nelskamp`** | 4 | 0 | collection |
| blechziegel.de | `/pages/hersteller` | 2 | 0 | page |
| blechziegel.de | `/pages/montageanleitung-mit-dachhaken` | 1 | 0 | page |
| blechziegel.com | **`/`** | 29 | 117 | home |
| blechziegel.com | **`/products/pv-dachziegel-frankfurter-pfanne`** | 10 | 6 | product |
| blechziegel.com | `/products/pv-dachziegel-biberschwanz-360-180` | 6 | 4 | product |
| blechziegel.com | `/products/pv-dachziegel-erlus-e58-s` | 2 | 2 | product |
| blechziegel.com | `/collections/pv-dachziegel-braas` | 28 | 1 | collection |
| ziegel-koenig.com | `shop.ziegel-koenig.com/` | 2 | 129 | shop-home |
| ziegel-koenig.com | `/` | 7 | 63 | home |
| ziegel-koenig.com | `shop.ziegel-koenig.com/products/zk-biberschwanz` | 4 | 3 | product |
| bau.shop | **`/Blechziegel`** | 30 | 382 | category |
| bau.shop | `/Stahltueren` | 68 | 863 | category |
| bau.shop | `/` | 15 | 380 | home |
| venturama-solar.de | `/` | 60 | 4.520 | home |
| venturama-solar.de | `/pv-montageschienen/` | 75 | 953 | category |
| venturama-solar.de | **`/produkt/blechziegel-passend-fuer-frankfurter-pfanne-metalldachplatten-pv/`** | 1 | 0 | product |

## Bewertung der Lage (datenbasiert)

1. **blechziegel.de ist organisch quasi unsichtbar:** 17 Keywords, geschaetzte **0 Traffic** auf jeder bekannten Top-Page. Die Domain ist indexiert, rankt aber nirgends sichtbar genug fuer Klicks (Semrush-Schaetzung).
2. **blechziegel.com (Namespace-Wettbewerber)** hat 126 KW + 131 Traffic — **etwa 7× mehr organische Sichtbarkeit** als wir, obwohl dieselbe Produktnische. Insbesondere die PDP `/products/pv-dachziegel-frankfurter-pfanne` (10 KW, 6 Traffic) ist direkter Vergleich fuer unsere eigene Frankfurter-Pfanne-Seite.
3. **bau.shop ist Marktplatz-Benchmark:** `/Blechziegel` rankt mit 30 KW + 382 Traffic. Die Kategorie-Seite definiert, welche Suchintention bei „Blechziegel"-Suchen aktuell bedient wird.
4. **venturama-solar.de** ist breiter PV-/Montage-Spezialist mit massiver Sichtbarkeit (4.418 KW, 17.286 Traffic) — relevant als **Markt-Benchmark** und Quelle fuer thematisch passende Backlinks, weniger als 1:1-Konkurrenz im engen Blechziegel-Cluster.
5. **ziegel-koenig.com** ist als **Backlink-Benchmark** wichtig: 145 Follow-Links + AS 8 — zeigt, dass Ziegel-Handel-Domains realistisch ein Follow-Link-Profil aufbauen koennen.
6. **0 Follow-Links bei blechziegel.de ist BESTAETIGT** (siehe Backlink Overview). Das ist das groesste Off-Page-Risiko und blockiert Ranking-Aufbau strukturell.
7. **PV-Ziegel/Solarziegel-Cluster:** ohne `organic-keywords-de.csv` keine konkrete Position-Aussage moeglich — Verwechslungsrisiko bleibt aber strategisch zu adressieren ueber Pflicht-Abgrenzung.

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

## Wettbewerber-Gaps (datenbasiert)

| Domain | Rolle (bestaetigt) | Sichtbarkeit (Semrush) | Was wir lernen koennen |
|---|---|---|---|
| **bau.shop** `/Blechziegel` | Marktplatz-Kategorie-Benchmark | 30 KW · 382 Traffic | wie eine Blechziegel-Kategorie-Page gerankt aussieht |
| **blechziegel.com** `/` | Namespace-/Produkt-Wettbewerber | 29 KW · 117 Traffic | direkter 1:1-Vergleich Home-Positionierung |
| **blechziegel.com** `/products/pv-dachziegel-frankfurter-pfanne` | direkter PDP-Wettbewerber | 10 KW · 6 Traffic | unsere Frankfurter-Pfanne-PDP muss mind. gleichwertig werden |
| **venturama-solar.de** `/produkt/blechziegel-passend-fuer-frankfurter-pfanne-metalldachplatten-pv/` | breiter PV-/Solarhandel | 1 KW · 0 Traffic (Long-URL, Keyword „blechziegel frankfurter pfanne") | Bestaetigt, dass die PDP-Suchintention auf Wettbewerber-Seiten existiert |
| **ziegel-koenig.com** | Offpage-Benchmark | 145 Follow-Links · AS 8 | realistisches Backlink-Niveau fuer Ziegel-Handel-Domain |

Detaillierte Keyword-Gap-Analyse (Position-Overlap pro KW) folgt nach Import von `organic-keywords-de.csv`.

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

> Priorisierung basiert nun auf bestaetigten Semrush-Daten fuer Domain-Overview,
> Backlinks und Top-Pages (Stand 2026-05-16). Keyword-Rankings (`organic-keywords-de.csv`)
> sind weiterhin offen; konkrete Position-Verbesserungen werden nach diesem Import
> nachpriorisiert.

### P1 — Sofortmassnahmen (jetzt datenbestaetigt)

1. **Startseite fuer Kernpositionierung staerken**
   - Zielkeywords: PV-Blechziegel · Blechziegel PV · PV-Dachziegel aus Aluminium · Aluminium-Ersatzdachziegel fuer PV-Montage
   - Hebel: H1, Hero-Intro, Meta Title, Meta Description, Trust-Block, JSON-LD
   - Datei: `sections/blechziegel-home.liquid` (Plan in `sprint-1-startseite-plan.md`)
   - Datenbestaetigung: Top-Pages-Export zeigt `/` mit nur 4 KW + 0 Traffic — Hebel vorhanden, Sichtbarkeit muss massiv wachsen

2. **Backlink-Basis aufbauen — bestaetigtes P1-Risiko**
   - **0 Follow-Links bei blechziegel.de — BESTAETIGT** (`backlinks-overview.csv`, 21 backlinks, 17 ref dom, 0 follow, AS=0).
   - Strukturelles Ranking-Blocker: ohne Follow-Links wird die Domain bei jedem ernsthaft umkaempften KW von Mitbewerbern ueberholt.
   - Ziel Sprint 1-3: erste **10–20 thematisch passende Follow-Links** ueber:
     - Hersteller-/Partnerseiten (Braas, Nelskamp, Creaton, Bramac, Erlus, BHE Metalle)
     - PV-Fachbetriebe + Solarteure (regionales Verzeichnis)
     - Dachdecker-Innungen + regionale Handwerksverzeichnisse
     - Ratgeber-Blogs + Fachforen (PV-Magazin, Solarserver, photovoltaikforum.com)
     - Regionale Unternehmensprofile (Nuernberg + Mittelfranken)
   - Benchmark: ziegel-koenig.com (145 Follow-Links, AS=8) zeigt realistisches Niveau fuer Ziegel-Handel-Domain.

3. **Interne Linkstruktur staerken**
   - Hub-Verlinkung in beide Richtungen, kontextuell:
     - Startseite ⇄ Ziegel-Finder
     - Startseite ⇄ Braas-Collection (`/collections/braas`) — 6 KW lt. Top-Pages
     - Startseite ⇄ Nelskamp-Collection (`/collections/nelskamp`) — 4 KW lt. Top-Pages
     - Startseite ⇄ Herstellerseite (`/pages/hersteller`) — 2 KW lt. Top-Pages
     - Startseite ⇄ Frankfurter-Pfanne-PDP (`/products/pv-dachziegel-frankfurter-pfanne`) — Wettbewerber blechziegel.com rankt hier auf 10 KW + 6 Traffic
     - Startseite ⇄ Ratgeber (`/pages/ratgeber`) + Montageanleitungen (`/pages/montageanleitung-mit-dachhaken` 1 KW, `.../ohne-dachhaken`)
   - Hebel: kontextuelle Text-Links in Hero/USPs/FAQ-Bloecken, keine Footer-Spam-Liste

4. **Klare Abgrenzung zu Solarziegeln**
   - Pflichtformulierung auf Startseite + auf allen Seiten, die einen Solarziegel-Verwechslungs-Begriff nennen:
     > „Unsere PV-Blechziegel sind keine stromerzeugenden Solarziegel,
     > sondern Aluminium-Ersatzdachziegel fuer die sichere Montage von
     > Photovoltaikanlagen auf Ziegeldaechern."
   - Hebel: 1 Snippet (z. B. `snippets/bz-pv-disclaimer.liquid`) einmal anlegen, an mehreren Stellen einbinden.

5. **Top-Pages-Luecke schliessen — bestaetigt datenbasiert**
   - blechziegel.de hat 5 sichtbare Top-Pages, ALLE mit geschaetztem Traffic = 0 (`top-pages-de.csv`).
   - Heisst: Indexierung steht, aber Position + Snippet bringen keine Klicks.
   - Sprint-1-Action: Title/Description/H1 + interne Linkpower fuer die 5 Pages (`/collections/braas`, `/`, `/collections/nelskamp`, `/pages/hersteller`, `/pages/montageanleitung-mit-dachhaken`) ueber Admin API setzen.
   - Stoerkeyword „allersberger straße 185 dhl": **offen** — `organic-keywords-de.csv` ist Platzhalter („Ich kann das nicht bestaetigen, weil `organic-keywords-de.csv` noch leer ist."). Pruefen, sobald KW-Export kommt.

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

- **Konkrete Keyword-Rankings** (`organic-keywords-de.csv` Platzhalter) — bis Import: „Ich kann das nicht bestaetigen, weil `organic-keywords-de.csv` noch leer ist."
- **Position-Drift / Previous Position** je KW — abhaengig vom Keyword-Export
- **Authority Score je Domain im Domain-Overview** — Spalte ist im aktuellen Export leer (nur Backlink-Overview liefert AS-Werte)
- **Konkrete Wettbewerber-Backlink-Quellen** (Ref-Domains-Detail) — folgt nach detaillierter Backlinks-Analyse
- **GSC- + GA4-Daten** (echte Click/Impression/Traffic-Werte) — nicht verbunden, Semrush ist nur Schaetzung
