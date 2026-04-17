# Enterprise UX + SEO Audit · Startseite blechziegel.de

**Branch:** `feat/ziegel-finder-enterprise`
**Master-Referenz:** `/pages/gewerbe`
**Analysierte Datei:** `sections/blechziegel-home.liquid`
**Datum:** 2026-04-15

---

## 1. Ist-Analyse — aktuelle Startseitenstruktur

Tatsächliche Block-Reihenfolge (verifiziert via grep):

| # | Block | Rolle | H-Level |
|---|---|---|---|
| 1 | **Hero** (Z. 509) | Brand + Haupt-CTA „Passenden Blechziegel finden" → /pages/ziegel-finder | H1 |
| 2 | **Finder-Teaser** (Z. 574) | 3-Step-Einstieg → /pages/ziegel-finder | H2 |
| 3 | **Dachtypen-Filter** (Z. 623) | „Nach Dachtyp filtern" | H2 |
| 4 | **USP-Block** „Warum Blechziegel.de" (Z. 672) | Marken-USP | H2 |
| 5 | **Bestseller** (Z. 690) | Produkt-Liste | H2 |
| 6 | **Problem/Lösung bz-pvl** (Z. 708) | Argumentation | H2 |
| 7 | **Social Proof / Kundenstimmen** (Z. 743) | 4,9/Trusted · 500+ · 15+ Dachziegeltypen + 4 Reviews | H2 |
| 8 | **How-it-works 4 Steps** (Z. 762) | Montage-Ablauf | H2 |
| 9 | **Service** (Z. 775) | Beratung/Support | H2 |
| 10 | **FAQ** (Z. 817) | Frage-Block | H2 |
| 11 | **CTA-Banner** (Z. 855) | Abschluss-CTA | H2 |

### Stärken

- Hero-CTA sauber auf den Finder verlinkt (Commit `8b1435c`)
- Finder-Teaser direkt unter Hero (Commit `ceabaa9`) — der entscheidende Enterprise-Schritt ist bereits gemacht
- Produkt-Content (Bestseller) inhaltlich vorhanden
- Saubere semantische H1/H2-Struktur, keine doppelten H1

### Schwächen

1. **Nach dem neuen Finder-Teaser folgt noch der alte „Nach Dachtyp filtern"-Block** — zweiter Filter-Einstieg direkt nach dem Finder-Teaser. Verwässerung: der User hat gerade einen Finder-CTA gesehen, muss sich jetzt zwischen „Finder" und „Dachtyp-Kacheln" entscheiden.
2. **Trust-Claim „Trusted Shops 4,9/5 · 500+ Projekte · 15+ Dachziegeltypen"** — diese drei Zahlen stehen auf der Home, während wir sie von der Produktseite bewusst entfernt haben. „500+ Projekte" und „15+ Dachziegeltypen" sind nicht belegt und widersprechen dem Metafield-only-Finder, der aktuell 4 Hersteller/7 Profile zeigt.
3. **Fake-Review-Namen „Thomas K.", „Markus W.", „Andreas M.", „Stefan B."** — anonymisierte Testimonials, die als echte Kundenstimmen präsentiert werden. Hoch-Risiko für Vertrauen, UWG, und Trusted-Shops-Review-Consistency.
4. **„Meistgekaufte PV-Dachziegel"-Bestseller-Block** bei nur 1 aktiven Produkt — führt faktisch eine leere oder triviale Liste aus.
5. **Dachtypen-Filter** versucht den Nutzer via Dachziegel-Profil zum Produkt zu führen — macht genau das, was der Finder besser macht. Redundanz.
6. **Keine Trennung B2B vs. Privatkunde** — das Hero adressiert „Dachdecker, PV-Installateure und Privatkunden" in einem Satz. `/pages/gewerbe` adressiert gezielt Dachdecker; diese Segmentierung fehlt auf der Home.

---

## 2. Vergleich mit `/pages/gewerbe`

### Was dort besser ist

- **Zielgruppen-Fokus**: klar B2B, keine Vermischung mit Privatkunden
- **Fact-Tiles im Hero** (Mengenstaffel · Versand ab 100 € · Lieferzeit · Lebensdauer) — harte, prüfbare Zahlen statt Marketing-Claims
- **Feature-Splits mit Orange-Bulletpoints** — klare Argumente-Architektur
- **8-Item FAQ kaufnah** + Navy-CTA mit NAP — direkter Handlungspfad
- **Konsistentes hp-* Designsystem** (Navy `#0a2240`, Orange `#ffa500`, Montserrat)
- Keine anonymisierten Testimonials — Testimonial-Kacheln mit Rollen-/Region-Kontext

### Übertragbar auf Home

- **Fact-Tiles-Muster** im Hero statt Trust-Items
- **Saubere CTA-Hierarchie**: 1 primärer + 1 sekundärer, keine konkurrierenden Tertiär-Pfade
- **Strukturelle Sections** mit klarer Aufgabe (nicht kategoriegetrieben, sondern entscheidungsgetrieben)
- **Navy-CTA mit NAP als verlässlicher Abschluss**

### Nicht übertragbar

- Gewerbe ist eine Zielgruppen-Landingpage, Home muss breiter bleiben (Privat + B2B). Ein 1:1 Copy würde Privatkunden verlieren.
- Mengenstaffel 25/50/100 gehört nicht ins Hero der Home.

---

## 3. UX-Audit

| Kriterium | Bewertung | Begründung |
|---|---|---|
| Erster Schritt nach Hero optimal? | Teilweise | Finder-Teaser ist richtig. Aber Dachtypen-Filter direkt danach ist doppelter Einstieg |
| Versteht Nutzer sofort, wie er zum Produkt kommt? | Ja, durch Finder-Teaser | Klar führend |
| Zu kategorie-/kaufschwer? | Bestseller bei 1 Produkt = schwach | |
| Unnötige Reibung? | Ja | Dachtypen-Filter + Finder-Teaser = 2 konkurrierende Einstiege |
| Zu viel Vorwissen verlangt? | Nein | |
| Informationsreihenfolge ideal? | Nein | Problem/Lösung kommt erst auf Position 6 — sollte früher für Privatkunden-Nutzen |

---

## 4. SEO-Audit

| Kriterium | Bewertung |
|---|---|
| H1-Hierarchie | OK — 1× H1, sauber |
| H2-Sequenz | OK — konsistent |
| Thin Content | „Bestseller"-Block zeigt bei 1 aktiven Produkt wenig Content-Wert |
| Suchintentionen (Blechziegel / PV Dachziegel / Frankfurter Pfanne) | Im Hero + im Finder-Teaser + FAQ gut vertreten |
| Interne Verlinkung | Finder-Teaser ist gut, aber keine direkten Links zu Hersteller-Seiten (`/pages/hersteller`, `/pages/ratgeber`) |
| Keyword-Stuffing | Keine Überladung |
| Strukturierte Daten auf Home | **Keine Organization-/WebSite-Schema JSON-LD gefunden** (geprüft per grep) |

---

## 5. Conversion-Audit

| Hebel | Zustand |
|---|---|
| Haupt-Conversion-Pfad | Hero-CTA → Finder (sauber seit letztem Fix) |
| Primärer CTA der stärkste? | Ja (Finder) |
| Konkurrierende CTAs im Hero | Nur 2 (Finder + Beratung) — akzeptabel |
| Beratung ausreichend integriert? | Nur im Hero sekundär + „Service"-Sektion tief unten. Finder-Teaser hat Beratungs-Link (gut) |
| Schneller Entscheidungs-Einstieg? | Ja durch Finder-Teaser |
| Trust-Claims belastbar? | **Nein** — „500+ Projekte" + „15+ Dachziegeltypen" nicht belegt; Trusted-Shops 4,9 aus Markenseite möglich aber nicht auf Produkt-Ebene spiegelbar; Reviews anonymisiert → UWG-Risiko |

---

## 6. Antworten auf die 10 strategischen Fragen

**1. Ist der aktuelle erste Block nach dem Hero der richtige?**
Ja, der Finder-Teaser. Er ist seit Commit `ceabaa9` direkt unter dem Hero.

**2. Sollte der Ziegel Finder direkt unter den Hero?**
Ist bereits erledigt. Der aktuelle Teaser-Block (kompakte 3-Step-Version, nicht der Full-Finder) ist die richtige Lösung. Kein Full-Finder auf Home notwendig.

**3. Sollte „Nach Dachtyp filtern" später kommen oder umgebaut werden?**
Ja. Zwei Optionen:
- **A (empfohlen, P1)**: Block entfernen — der Finder deckt den gleichen Zweck besser ab, strukturierter, metafield-basiert.
- **B (P2)**: Umbenennen zu „Beliebte Dachziegel-Profile" und als SEO-gerichtete Link-Liste zu Hersteller-Sammelseiten positionieren (Braas, Bramac, Creaton, Nelskamp → `/collections/xyz`). Kein Filter mehr, sondern Hub-Links.

**4. Ist die Hero-CTA-Strategie optimal?**
Ja, seit Fix auf `/pages/ziegel-finder`. Sekundärer CTA „Beratung anfordern" → `/pages/contact` sollte auf `/pages/ziegel-anfrage` umgelenkt werden (stärkerer Conversion-Pfad: Foto+Maße statt leerem Kontakt-Formular).

**5. Die 3 größten UX-Probleme aktuell**

1. Redundanz Finder-Teaser ↔ Dachtypen-Filter (direkt nebeneinander, zwei Einstiege, ein Ziel)
2. Bestseller bei 1 Produkt wirkt leer/unprofessionell
3. Problem/Lösung erst auf Position 6 — der Kern-Verkaufsgrund („kein Ziegelbruch") kommt zu spät

**6. Die 3 größten SEO-Hebel**

1. Organization- + WebSite-JSON-LD auf Home ergänzen (fehlt komplett)
2. Interne Links aus Home zu `/pages/hersteller`, `/pages/ratgeber`, `/pages/gewerbe`, `/pages/solar-installateure` systematisch platzieren
3. Dachtypen-Block zu einer Hub-Linkliste zu den Hersteller-Collections umbauen — bessere SEO-Relevanz-Signale

**7. Die 3 größten Conversion-Hebel**

1. Fake-/unbelegte Trust-Claims (500+, 15+, anonyme Reviews) entfernen oder belegen — UWG-Risiko + Glaubwürdigkeits-Boost
2. Sekundärer Hero-CTA von `/pages/contact` auf `/pages/ziegel-anfrage` umstellen
3. Problem/Lösung (Zeile 708, „Ziegelbruch bei PV-Montagen") direkt nach dem Finder-Teaser auf Position 3 vorziehen — emotionaler Kauf-Anker vor dem Produkt-Content

**8. Welche Claims / Trust-Elemente sollten geprüft oder entschärft werden?**

- **„500+ Projekte abgeschlossen"** — nicht belegbar aus Shop-Daten
- **„15+ Dachziegeltypen"** — widerspricht dem aktuellen Produkt-/Metafield-Stand (aktuell 7 Profile via `passende_hersteller`)
- **Trusted-Shops 4,9** — nur zeigen, wenn aktives Trusted-Shops-Konto mit live-Widget vorhanden; sonst entfernen
- **4 anonymisierte Reviews** — entweder durch echte (mit Quellen-Beleg) ersetzen oder entfernen. Aktueller Stand ist UWG-angreifbar

**9. Welche Blöcke sollten in der Reihenfolge verändert werden?**
Siehe Punkt 7 (Soll-Architektur).

**10. Welche Teile von `/pages/gewerbe` sollten als Muster übernommen werden?**

- Fact-Tiles statt Trust-Text-Line im Hero (harte Zahlen: Cutoff 13 Uhr · Versand ab 55 € · 25+ Jahre · DHL Tracking)
- Orange-Bullet-Argumente im Problem/Lösung-Block (ruhiger, weniger Kacheln)
- Navy-Final-CTA mit NAP — ersetzt den aktuellen bz-cta-banner

---

## 7. Empfohlene neue Block-Reihenfolge

| # | Block | Rolle | Warum hier |
|---|---|---|---|
| 1 | **Hero** mit Fact-Tiles (Gewerbe-Muster) | Marken-Setzung + Finder-CTA + Beratungs-CTA → `/pages/ziegel-anfrage` | Schnelle Entscheidung, harte Zahlen statt weiche Claims |
| 2 | **Finder-Teaser** (bestehend) | Haupt-Conversion-Einstieg | Bereits optimal positioniert |
| 3 | **Problem/Lösung „Kein Ziegelbruch"** (vorgezogen aus Pos. 6) | Kern-Verkaufsgrund frühzeitig | Emotionaler Anker nach dem Entscheidungsangebot |
| 4 | **USP-Block „Warum Blechziegel.de"** | Marken-Stärken | Unterstützt das gerade gesehene Problem/Lösung |
| 5 | **Hersteller-Hub** (ersetzt Dachtypen-Filter) | Deep-Links zu `/pages/hersteller`, Collections, Ratgeber | SEO-Boost + sekundärer Einstieg für Nutzer, die Hersteller bereits kennen |
| 6 | **Social Proof — überarbeitet** | Trust mit belegbaren Zahlen (Trusted Shops via Live-Widget) + entweder echte Reviews oder weg | Trust-Aufbau nach Argumentation |
| 7 | **Bestseller / Produkt-Grid** | Produkt-Pfad | Macht Sinn, sobald mehr Produkte im Shop sind; aktuell zurückhaltender |
| 8 | **How-it-works 4 Steps** | Montage-Demo | Senkt Kaufbarriere |
| 9 | **Service / Beratung** | B2B-Pfad | |
| 10 | **FAQ** | Long-tail SEO + letzter Einwand | |
| 11 | **Final-CTA** (Gewerbe-Muster: Navy mit NAP) | Finaler Conversion-Push | Ersetzt den aktuellen bz-cta-banner |

---

## 8. Priorisierte Empfehlungen

### P1 — Größter Hebel

| # | Problem | Empfehlung | Nutzen | Risiko/Aufwand |
|---|---|---|---|---|
| P1.1 | Fake-Trust-Claims (500+, 15+, anonyme Reviews) | Unbelegte Zahlen entfernen. Reviews entweder durch echte mit Quelle oder komplett weg. | Glaubwürdigkeit ↑, UWG-Risiko ↓ | Gering / 30 min |
| P1.2 | Sekundärer Hero-CTA „Beratung anfordern" → `/pages/contact` | Umlenken auf `/pages/ziegel-anfrage` | Conversion ↑ (Foto+Maße-Funnel) | Gering / 5 min |
| P1.3 | Dachtypen-Filter als redundanter Einstieg | **Option A**: entfernen. **Option B**: umbauen zu Hersteller-Hub mit Links | UX-Klarheit, SEO-Boost | Mittel / 1–2 h |
| P1.4 | Organization + WebSite JSON-LD fehlen | Ergänzen im Home-`<script type="application/ld+json">` | SEO Rich-Result-Fähigkeit | Gering / 20 min |

### P2 — Wichtig nach P1

| # | Problem | Empfehlung |
|---|---|---|
| P2.1 | Problem/Lösung auf Pos. 6 | Auf Position 3 vorziehen (nach Finder-Teaser) |
| P2.2 | Hero-Trust-Zeile ohne harte Zahlen | Fact-Tiles-Muster aus Gewerbe übernehmen (Cutoff, Versand-Schwelle, Lebensdauer, DHL) |
| P2.3 | Final-Banner generisch | Durch Navy-CTA mit NAP (Gewerbe-Muster) ersetzen |

### P3 — Feinschliff

| # | Problem | Empfehlung |
|---|---|---|
| P3.1 | Bestseller bei 1 Produkt | Auf „Unsere PV-Dachziegel" umbenennen, bis mehr Produkte gepflegt sind |
| P3.2 | Stilistische Varianz zwischen Home (`.bz-*`) und anderen Pages (`.hp-*`) | Auf langfristige Konvergenz zu einem CSS-System planen — nicht akut |
| P3.3 | FAQ ohne Schema | FAQPage JSON-LD ergänzen |

---

## 9. Optionaler Umsetzungsplan

**Betroffene Dateien (alle Änderungen auf Home):**

- `sections/blechziegel-home.liquid` — einziger Edit-Scope

**Phase A — P1 Quick-Wins (1 Commit, risikoarm)**

1. Unbelegte Zahlen entfernen (Z. 748–750, 4,9 ggf. behalten nur wenn Trusted-Shops-Live-Integration bestätigt)
2. Anonyme Reviews entfernen oder durch 2 verifizierte ersetzen
3. Sekundäres Hero-CTA-Default `/pages/contact` → `/pages/ziegel-anfrage`
4. Organization + WebSite JSON-LD direkt vor `{% schema %}` ergänzen

**Phase B — P1/P2 Strukturelle Änderung (1 Commit)**

5. Dachtypen-Block (Z. 623–670) entfernen oder umbauen zu Hersteller-Hub (6 Cards → Braas, Bramac, Creaton, Nelskamp, `/pages/hersteller`, `/pages/ratgeber`)
6. Problem/Lösung (`bz-pvl`, Z. 708) nach vorne ziehen (zwischen Finder-Teaser und USP-Block)

**Phase C — P2 Premium-Anheben (1 Commit)**

7. Hero-Trust-Zeile auf Fact-Tiles umbauen (Gewerbe-Muster)
8. Final-CTA-Banner durch Navy-NAP-Section ersetzen

**Phase D — P3 (separater Branch)**

9. FAQPage-Schema ergänzen
10. Konvergenz bz-* / hp-* (langfristig)

---

## 10. „Ich kann das nicht bestätigen"

- **Trusted-Shops 4,9/5** — ob ein aktives Trusted-Shops-Abo mit Live-Widget-Integration besteht oder der Score manuell gepflegt ist, habe ich nicht geprüft. Vor P1.1-Umsetzung im Admin verifizieren.
- **500+ Projekte** — keine Quelle im Repo gefunden. Möglicherweise dokumentiert im CRM/Analytics, aber nicht öffentlich belegbar aus dem Shop-Code.
- **„15+ Dachziegeltypen"** — aktueller `custom.passende_hersteller`-Stand: 7 Einträge auf einem Produkt. 15+ ist aktuell nicht belegbar.
