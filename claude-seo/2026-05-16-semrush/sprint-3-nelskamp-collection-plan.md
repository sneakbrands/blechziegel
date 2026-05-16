# Sprint 3 — Nelskamp-Collection SEO-Optimierung

## Ziel

Die Collection `/collections/nelskamp` soll als starke Hersteller-Seite für PV-Blechziegel aus Aluminium für Nelskamp-Dachziegel ausgebaut werden — analog zum Sprint-2-Pattern auf Braas.

## Sprachregel

**Kundensichtbar / verkaufsnah:** „Ziegel", „Nelskamp-Dachziegel", „passender Ziegel", „Nelskamp-Ziegel".
**Fachlich / prüfend / erklärend:** „Profil", „Modell", „Profil prüfen", „exaktes Modell vor Bestellung kontrollieren".

Begründung: Anlehnung an die Semrush-Suchbegriffe (`nelskamp dachziegel`, `dachziegel nelskamp`, `nelskamp ziegel`). „Profil" nur dort, wo es fachlich um die genaue Modell-/Profilprüfung geht.

## Nicht-Ziel

- Keine Bewerbung von stromerzeugenden Solarziegeln (`nelskamp solarziegel` SV 140 — nicht aktiv bewerben).
- Keine Behauptung, dass die Produkte Original-Nelskamp-Produkte sind.
- Keine Marken-/Kompatibilitätsaussagen ohne vorsichtige Formulierung.
- Keine Änderung an Produkten, Preisen, Varianten, Checkout, Steuer oder Versand.
- Keine Theme-Code-Änderung in diesem Sprint — nur Analyse + Plan + Freigabe-Preview.

## Datenbasis

Semrush-Schätzung DE, Stand 2026-05-16. Kein GSC-Livewert.

| Keyword | Position blechziegel.de | Suchvolumen | URL | Bewertung |
|---|---:|---:|---|---|
| nelskamp dachziegel | 46 | 1.000 | /collections/nelskamp | Haupt-Target, breite Hersteller-Suche |
| dachziegel nelskamp | 55 | 170 | /collections/nelskamp | Hersteller-Suche mit umgekehrter Wortstellung |
| nelskamp ziegel | 50 | 70 | /collections/nelskamp | Hersteller-/Ziegel-Suche |
| nelskamp pv | n/a | 20 | /collections/nelskamp | vorsichtig behandeln |
| nelskamp solarziegel | n/a | 140 | — | nicht aktiv bewerben, kritische Suchintention |
| nelskamp nibra | n/a | 140 | Produkt-/Profilbezug | modellspezifisch, vorsichtig |

Hinweis: Semrush ist Schätzung, kein Google-Search-Console-Livewert.

## Ist-Stand `/collections/nelskamp` (read-only, Stand 2026-05-16)

| Feld | Live-Wert |
|---|---|
| Template | `templates/collection.json` → Section `blechziegel-collection` |
| Hersteller-Logik | generischer `is_hersteller`-Zweig in `sections/blechziegel-collection.liquid` (Braas hat eigenen `is_braas`-Zweig seit Sprint 2) |
| H1 | generisch über Hersteller-Logik |
| FAQ unterhalb Grid | keine Hersteller-spezifische FAQ aktuell |
| JSON-LD | Generic Shopify Collection-Schema; keine FAQPage |
| Ziegel-Finder-Verlinkung | bereits via Compact-Finder oben auf der Collection-Seite |

## Strategische Positionierung

**Bevorzugte H1:** `PV-Blechziegel für Nelskamp-Dachziegel`

Analog Braas — Hersteller-/Ziegel-Positionierung statt Profil-/Modell-Positionierung.

## Vorsichtige Markenformulierung

**Erlaubte Formulierungen (kundensichtbar bevorzugt „Ziegel"/„Nelskamp-Dachziegel"):**
- für Nelskamp-Dachziegel
- passend für viele Nelskamp-Dachziegel
- Ziegel prüfen
- Modell und Profil vor Bestellung kontrollieren
- PV-Blechziegel für die Montage auf Ziegeldächern mit Nelskamp-Dachziegeln
- kompatible PV-Blechziegel für die Montage auf Nelskamp-Ziegeldächern

**Nicht verwenden:**
- Original Nelskamp
- Nelskamp-Ersatzteil
- von Nelskamp
- Nelskamp-zertifiziert
- garantiert passend für alle Nelskamp-Ziegel
- Solarziegel kaufen
- stromerzeugende Nelskamp Solarziegel

## Empfohlene Seitenstruktur (analog Braas)

1. Hero / Collection-Intro mit H1 `PV-Blechziegel für Nelskamp-Dachziegel`
2. Hinweisbox „Ziegel vor Bestellung prüfen"
3. Produktgrid bleibt im Fokus
4. Hub-Karten (4 Stück):
   - `/pages/ziegel-finder` — Nelskamp-Ziegel über den Ziegel-Finder bestimmen
   - `/pages/hersteller` — Alle Hersteller und Profile ansehen
   - `/pages/montageanleitung-mit-dachhaken` — Montage mit Dachhaken verstehen
   - `/collections/braas` — Weitere PV-Blechziegel für Braas-Dachziegel
5. FAQ-Block (5 Fragen, FAQPage-Mikrodaten)
6. SEO-Text knapp unter dem Grid

## Empfohlene FAQ-Fragen

1. Welche PV-Blechziegel gibt es für Nelskamp-Dachziegel?
2. Wie finde ich den passenden Nelskamp-Ziegel?
3. Wofür wird ein Aluminium-Ersatzdachziegel bei der PV-Montage eingesetzt?
4. Passt ein PV-Blechziegel für jeden Nelskamp-Dachziegel?
5. Was tun, wenn ich meinen Nelskamp-Ziegel nicht sicher erkenne?

## Meta-Vorschlag

**Meta Title:**
`PV-Blechziegel für Nelskamp-Dachziegel`

**Meta Description:**
`PV-Blechziegel aus Aluminium für Nelskamp-Dachziegel und Photovoltaik-Montage mit Dachhaken. Passenden Ziegel finden oder Ziegel-Finder nutzen.`

Setzung später via Shopify Admin API (`metafieldsSet` auf `global.title_tag` und `global.description_tag` für die Nelskamp-Collection-GID).

## Risiken

- Markenrecht / Herstellernennung (Nelskamp ist eingetragene Marke der Dachziegelwerke Nelskamp GmbH).
- Falsche Suchintention bei Solarziegel/PV-Ziegel.
- `nelskamp nibra` Suchintention zielt auf Modell „Nibra" — nicht in der H1 vorwegnehmen, in Hinweisbox/FAQ ggf. abdecken.
- Produktkompatibilität darf nicht pauschal garantiert werden.

## Umsetzungsweg (nach Freigabe)

- Theme-Code: `sections/blechziegel-collection.liquid` — neuer `is_nelskamp`-Branch analog Braas-Branch (H1, Hero-Intro, Hinweisbox, 4 Hub-Karten, 5 FAQ mit FAQPage-Microdata)
- Meta-Daten: Shopify Admin API `metafieldsSet` für Nelskamp-Collection-GID
- Deploy: Git → `origin/main` → Shopify Auto-Sync

## Prüfpunkte vor Umsetzung

- Theme-Code-Struktur in `sections/blechziegel-collection.liquid`
- Bestehende Herstellerlogik (`hersteller_blurb` + `is_hersteller`-Zweig)
- Mobile Ansicht
- Produktgrid sichtbar
- Interne Links
- Kein Checkout-/Preis-/Varianteneingriff
