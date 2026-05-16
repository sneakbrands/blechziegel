# Keyword-Priorities blechziegel.de

## Datenquelle
- Semrush (Datenbank `de`, optional `at`/`ch`)
- Schaetzwerte -- **nicht** Google-Search-Console-Livewerte

## Datenstand
- _Stand der Exporte:_ 2026-05-16 — Domain-Overview, Backlinks, Top-Pages **importiert**; Organic-Keywords-Auszug **inline ueber Sprint-Briefing geliefert** (CSV-Import folgt)
- _Letzter Import:_ Domain Overview DE + Backlink Overview + Top Pages DE (Semrush-Schaetzung) + Organic-Keywords-Auszug 2026-05-16 (Sprint-Briefing)

## Datenvalidierung (Stand 2026-05-16)
| Datei | Status | Bemerkung |
|---|---|---|
| `domain-overview-de.csv` | **gefuellt** | 5 Domains, Organic + Ads, AS-Spalte leer |
| `backlinks-overview.csv` | **gefuellt** | 5 Domains, Backlinks/RefDom/Follow/AS/TS |
| `top-pages-de.csv` | **gefuellt** | 19 Pages ueber 5 Domains |
| `organic-keywords-de.csv` | **inline geliefert** (Sprint-Briefing) | 9 priorisierte KW + Stoerkeyword; CSV-Export im Workspace noch ausstehend |
| `competitors.csv` | gefuellt | Wettbewerberliste + Rollen + Notizen |
| `keyword-priorities.md` | aktualisiert | P1/P2/P3 + Semrush-Datenbasis + Top-Chancen |
| `theme-url-mapping.md` | vollstaendig | Code-Inventar, technisch belegt |
| `seo-target-pages.md` | gefuellt | Zielseiten-Matrix mit Pflichten |

**Belastbar fuer Sprint 1:** Produktdefinition, Wettbewerber-Rollen, Theme-Mapping, Zielseiten-Matrix, Domain-Sichtbarkeit, Top-Pages, Backlink-Profil, **priorisierte Keyword-Positionen blechziegel.de**.

**Weiterhin offene Datenluecken:**
- **GSC + GA4** fehlen — keine echten CTR/Click/Impression-Werte
- **Keyword-Gap gegen Wettbewerber** ist noch nicht als separate Datei importiert (Semrush-Bulk-Keyword-Gap)
- **Referring-Domain-Detail** fehlt weiterhin (welche Domains genau verlinken)
- Semrush bleibt **Schaetzung**, kein Google-Livewert

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

## Top-Chancen (Semrush-Schaetzung, Stand 2026-05-16)

Quelle: Sprint-Briefing 2026-05-16 (inline aus `organic-keywords-de.csv`-Export).
Priorisiert nach: Naehe Seite 1 → Produktrelevanz → Suchvolumen → Solarziegel-Verwechslungsrisiko → vorhandene Zielseite.

| Keyword | Position | Suchvolumen | URL aktuell | Verwechslungsrisiko | Empfehlung |
|---|---:|---:|---|---|---|
| blech ziegel | 24 | 70 | `/` | niedrig | Startseite staerken, Title/H1/Intro praezisieren |
| pv blechziegel | 26 | 110 | `/` | niedrig | Startseite als Hauptzielseite fuer PV-Blechziegel aufbauen |
| ziegel braas | 35 | 480 | `/collections/braas` | niedrig | Braas-Collection ausbauen |
| braas dachziegel | 38/41 | 3.600 | `/collections/braas` | mittel (gemischte Suchintention Tonziegel↔Blechziegel) | Braas-Seite staerken mit klarer Abgrenzung „Aluminium-Ersatzdachziegel" |
| braas solarziegel | 38 | 390 | `/collections/braas` | **hoch** | nur mit Pflicht-Abgrenzung nutzen, sonst Bounce-Risiko |
| nelskamp dachziegel | 46 | 1.000 | `/collections/nelskamp` | mittel | Nelskamp-Collection ausbauen |
| blechziegel für photovoltaik | 56 | 70 | `/` | niedrig | Startseite + Ratgeber intern staerken |
| braas pv | 59 | 70 | `/collections/braas` | **hoch** (kann „Braas-Solarziegel" implizieren) | nur mit Pflicht-Abgrenzung nutzen |
| dachziegel hersteller | 63 | 260 | `/pages/hersteller` | niedrig | Herstellerseite als Hub staerken, alle 5 Marken sichtbar verlinken |

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

## Stoerkeyword `allersberger straße 185 dhl` — BESTAETIGT

Datenbestaetigung (Sprint-Briefing 2026-05-16):

| Position | URL | Bewertung |
|---:|---|---|
| 54 | `/pages/montageanleitung-mit-dachhaken` | unpassende KW-URL-Zuordnung |
| 75 | `/collections/nelskamp` | unpassende KW-URL-Zuordnung |
| 87 | `/pages/hersteller` | unpassende KW-URL-Zuordnung |

→ Der Begriff ist offensichtlich die Geschaeftsadresse des Shops kombiniert mit „DHL" und rankt auf drei verschiedenen URLs. Das ist klassisches **Stoerkeyword-Signal**: irgendwo im Theme oder in einer wiederverwendeten Snippet-Komponente liegt Text, der „Allersberger Straße 185" plus „DHL" enthaelt und auf mehreren Seiten ausgeliefert wird.

### Technische Pruefempfehlung (noch keine Theme-Aenderung)

Zu pruefen — read-only:

- `sections/footer.liquid` — Adressblock + DHL-Versand-Hinweis
- `snippets/bz-impressum-content.liquid` + `snippets/blechziegel-impressum.liquid` — Adressfeld
- `snippets/blechziegel-versand.liquid` + `snippets/bz-versand-content.liquid` — DHL-Versand-Hinweis
- `sections/contact-blechziegel.liquid` — Kontakt-Section
- JSON-LD / strukturierte Daten in `sections/blechziegel-product.liquid` + `layout/theme.liquid`
- Alt-Texte fuer DHL-Logos/Icons in `sections/footer.liquid`
- Automatisch generierte Snippets (`bz-product-card`, `bz-cart-drawer` — DHL-Versandzeit-Hinweise)
- Wiederverwendete Textbausteine (z. B. „Versand ab Allersberger Straße 185 mit DHL")
- Tracking-/Versand-Integrationen (Shopify-Shipping-Snippets, DHL-Express-Block)

Ergebnis-Ziel: Stelle finden, an der die Wortgruppe steht. Falls unbeabsichtigt ueberall ausgespielt: in Sprint 2 reduzieren auf Impressum/Versand-Seite.

---

### P1 — Sofortmassnahmen (datenbestaetigt nach Organic-Keyword-Import)

1. **Startseite auf Position-24/26-Chance optimieren** (groesster Hebel)
   - Zielkeywords: `blech ziegel` (Pos 24, SV 70) · `pv blechziegel` (Pos 26, SV 110) · `blechziegel für photovoltaik` (Pos 56, SV 70)
   - Hebel: H1, Hero-Intro, Meta Title, Meta Description, Trust-Block, JSON-LD
   - Datei: `sections/blechziegel-home.liquid` (Plan in `sprint-1-startseite-plan.md` + Umsetzungsvorschau in `sprint-1-umsetzungsvorschau.md`)
   - Datenbestaetigung: Top-Pages-Export zeigt `/` mit 4 KW + 0 Traffic; Position 24/26 ist „eine Sichtbarkeits-Stufe von Seite 1 entfernt"

2. **Braas-Collection — P1/P2-Grenzfall mit hoher Hebelwirkung**
   - Zielkeywords: `ziegel braas` (Pos 35, SV 480) · `braas dachziegel` (Pos 38/41, **SV 3.600**) · `braas solarziegel` (Pos 38, SV 390) · `braas pv` (Pos 59, SV 70)
   - Hebel: H1 + Intro + FAQ mit Pflicht-Abgrenzung; interne Linkpower von `/` und `/pages/hersteller`
   - **Verwechslungsrisiko hoch:** `braas solarziegel` + `braas pv` bedeuten in Wirklichkeit oft „stromerzeugende Solarziegel" — ohne Pflicht-Abgrenzung kommt Pogosticking
   - Datei: `sections/blechziegel-collection.liquid` (Hero-Block) + Admin-Description fuer Collection `braas`

3. **Nelskamp-Collection — P2**
   - Zielkeyword: `nelskamp dachziegel` (Pos 46, SV 1.000)
   - Plus indirekt: `nelskamp ziegel` / `dachziegel nelskamp` (Sprint-Briefing nennt sie als Cluster, konkrete Position noch zu pruefen sobald vollstaendiger Export vorliegt)
   - Hebel: H1 + Intro + FAQ + Pflicht-Abgrenzung; Linkpower von `/` und `/pages/hersteller`

4. **Herstellerseite `/pages/hersteller` als Hub fuer `dachziegel hersteller` (Pos 63, SV 260)**
   - Hebel: H1 enthaelt „PV-Dachziegel nach Hersteller" + Pflicht-Abgrenzung; sichtbare Marken-Liste mit Klick auf jede Hersteller-Collection
   - Datei: `templates/page.hersteller.json` + `snippets/blechziegel-hersteller.liquid`

5. **Stoerkeyword `allersberger straße 185 dhl` als technisches SEO-Ticket**
   - Status: **bestaetigt** (Pos 54/75/87 auf 3 unpassenden URLs)
   - Maßnahme Sprint 2 (nicht Sprint 1): Quelle im Theme identifizieren, dann ggf. zentralisieren oder Sprache anpassen
   - Maßnahme Sprint 1: nur Inventarisierung (welche Datei enthaelt die Wortgruppe), keine Aenderung

6. **Backlink-Basis aufbauen — bestaetigtes P1-Risiko**
   - **0 Follow-Links bei blechziegel.de — BESTAETIGT** (`backlinks-overview.csv`, 21 backlinks, 17 ref dom, 0 follow, AS=0).
   - Strukturelles Ranking-Blocker: Onpage-Optimierung allein bringt nicht Pos 24 → Top 10. Parallel Follow-Link-Aufbau.
   - Ziel Sprint 1–3: erste **10–20 thematisch passende Follow-Links** ueber:
     - Hersteller-/Partnerseiten (Braas, Nelskamp, Creaton, Bramac, Erlus, BHE Metalle)
     - PV-Fachbetriebe + Solarteure (regionales Verzeichnis)
     - Dachdecker-Innungen + regionale Handwerksverzeichnisse
     - Ratgeber-Blogs + Fachforen (PV-Magazin, Solarserver, photovoltaikforum.com)
     - Regionale Unternehmensprofile (Nuernberg + Mittelfranken)
   - Benchmark: ziegel-koenig.com (145 Follow-Links, AS=8).

7. **Pflicht-Abgrenzung zu Solarziegeln (operativer P1-Block)**
   - Schon im Vor-Sprint gelistet; nach Organic-Import jetzt **akut**, weil `braas solarziegel` (SV 390) und `braas pv` aktiv ranken und Pogosticking-Risiko produzieren.
   - Hebel: 1 Snippet `snippets/bz-pv-disclaimer.liquid` anlegen, einbinden in Startseite + Braas-Collection + Nelskamp-Collection + Hersteller-Hub.

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
