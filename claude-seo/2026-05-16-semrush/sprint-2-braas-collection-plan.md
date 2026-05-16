# Sprint 2 — Braas-Collection SEO-Optimierung

## Ziel

Die Collection `/collections/braas` soll als starke Hersteller-/Profil-Seite für PV-Blechziegel aus Aluminium für Braas-Dachziegelprofile ausgebaut werden.

## Nicht-Ziel

- Keine Bewerbung von stromerzeugenden Solarziegeln.
- Keine Behauptung, dass die Produkte Original-Braas-Produkte sind.
- Keine Marken-/Kompatibilitätsaussagen ohne vorsichtige Formulierung.
- Keine Änderung an Produkten, Preisen, Varianten, Checkout, Steuer oder Versand.

## Datenbasis

Semrush-Schätzung DE, Stand 2026-05-16.

| Keyword | Position blechziegel.de | Suchvolumen | URL | Bewertung |
|---|---:|---:|---|---|
| braas dachziegel | 38/41 | 3.600 | /collections/braas | großes Potenzial, breite Suchintention |
| ziegel braas | 35 | 480 | /collections/braas | Hersteller-/Profil-Suche |
| braas solarziegel | 38 | 390 | /collections/braas | nicht aktiv bewerben, Suchintention kritisch |
| braas | 45 | 4.400 | /collections/braas | extrem breit, niedrige Kaufabsicht |
| braas pv | 59 | 70 | /collections/braas | vorsichtig behandeln |
| blechziegel braas | n/a oder prüfen | 20 | /collections/braas | sehr passend, kleiner Longtail |
| pv dachziegel braas | n/a oder prüfen | 110 | /collections/braas | passend, aber Begriff PV-Dachziegel sauber erklären |
| braas frankfurter pfanne | n/a oder prüfen | 3.600 | Produkt-/Profilbezug | starkes Modellpotenzial |

Zusätzliche Metriken (CPC / Competition, Semrush DE):

- `braas dachziegel` CPC 0,39 · Comp 0,95
- `ziegel braas` CPC 0,49 · Comp 0,94
- `braas solarziegel` CPC 1,11 · Comp 0,85
- `braas pv` CPC 2,20 · Comp 0,38
- `blechziegel braas` CPC 0 · Comp 0,67
- `pv dachziegel braas` CPC 1,06 · Comp 1,00
- `braas frankfurter pfanne` CPC 0,32 · Comp 1,00

Hinweis: Semrush ist Schätzung, kein Google-Search-Console-Livewert.

## Ist-Stand `/collections/braas` (read-only, Stand 2026-05-16)

| Feld | Live-Wert |
|---|---|
| Live-Title | `Braas – Blechziegel.de` |
| Live-Meta-Description | „PV-Dachziegel passgenau für Braas-Profile (Frankfurter Pfanne, Harzer Pfanne) — Aluminium-Ersatzziegel für die sichere PV-Montage. Made in Germany." (in Sprint 1 via Admin-API gesetzt) |
| Live-H1 | „PV-Dachziegel für Braas" |
| Template | `templates/collection.json` → Section `blechziegel-collection` |
| Hersteller-Logik | `hersteller_blurb` (Z. 1121 ff in `sections/blechziegel-collection.liquid`); fuer `braas` derzeit: „Braas zählt zu den größten Dachziegelherstellern Deutschlands. Frankfurter Pfanne und Harzer Pfanne sind seit Jahrzehnten Standard auf Millionen Dächern." |
| FAQ unterhalb Grid | keine Hersteller-spezifische FAQ aktuell |
| JSON-LD | Generic Shopify Collection-Schema; keine FAQPage |
| Ziegel-Finder-Verlinkung | bereits via Compact-Finder oben auf der Collection-Seite |

## Strategische Positionierung

Empfohlene Hauptpositionierung:

PV-Blechziegel aus Aluminium für Braas-Dachziegelprofile

Alternative H1-Vorschläge:

1. PV-Blechziegel für Braas-Dachziegelprofile
2. PV-Blechziegel aus Aluminium für Braas-Profile
3. Aluminium-Ersatzdachziegel für Braas-Profile und PV-Montage

**Bevorzugte H1:** PV-Blechziegel für Braas-Dachziegelprofile

## Vorsichtige Markenformulierung

**Erlaubte Formulierungen:**
- für Braas-Dachziegelprofile
- passend für viele Braas-Profile
- Profil prüfen
- kompatible PV-Blechziegel für die Montage auf Braas-Ziegeldächern
- für die Photovoltaik-Montage auf Braas-Dachziegelprofilen

**Nicht verwenden:**
- Original Braas
- Braas-Ersatzteil
- von Braas
- Braas-zertifiziert
- garantiert passend für alle Braas-Ziegel
- Solarziegel kaufen
- stromerzeugende Braas Solarziegel

## Empfohlene Seitenstruktur

1. Hero / Collection-Intro
2. Produktgrid bleibt im Fokus
3. Kurzer Profil-Hinweis (Hinweisbox „Profil vor Bestellung prüfen")
4. Interne Links (Hub-Karten — bewusst KEIN Frankfurter-Pfanne-Produkt-Link, weil die Braas-Collection als Hersteller-/Profilseite wirken soll und nicht zu frueh auf ein einzelnes Modell lenken darf):
   - `/pages/ziegel-finder`
   - `/pages/hersteller`
   - `/collections/nelskamp`
   - `/pages/montageanleitung-mit-dachhaken`
5. FAQ-Block (5 Fragen, siehe unten)
6. SEO-Text unterhalb des Produktgrids, nicht zu lang

## Empfohlene FAQ-Fragen

1. Welche PV-Blechziegel gibt es für Braas-Dachziegelprofile?
2. Wie finde ich das passende Braas-Profil?
3. Wofür wird ein Aluminium-Ersatzdachziegel bei der PV-Montage eingesetzt?
4. Passt ein PV-Blechziegel für jedes Braas-Modell?
5. Was tun, wenn ich mein Braas-Profil nicht sicher erkenne?

## Risiken

- Markenrecht / Herstellernennung (Braas ist eingetragene Marke der Monier-/BMI-Gruppe)
- Falsche Suchintention bei Solarziegel/PV-Ziegel
- Zu viel SEO-Text oberhalb der Produkte kann Conversion schwächen
- Produktkompatibilität darf nicht pauschal garantiert werden
- Nutzer sollen schnell zum passenden Profil oder zum Ziegel-Finder kommen

## Prüfpunkte vor Umsetzung

- Theme-Code-Struktur in `sections/blechziegel-collection.liquid`
- Collection-H1 derzeit „PV-Dachziegel für Braas" — Änderung in Liquid-Logik (`is_braas`-Branch oder generische Hersteller-H1-Logik)
- Bestehende Herstellerlogik (`hersteller_blurb` + Hersteller-spezifische Snippets)
- Mobile Ansicht
- Produktgrid sichtbar
- Interne Links
- Kein Checkout-/Preis-/Varianteneingriff
