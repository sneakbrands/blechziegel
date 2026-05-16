# Sprint 2 Abschlussbericht — Braas-Collection SEO-Optimierung

## Status

Abgeschlossen und live verifiziert.

## Ziel

Die Collection `/collections/braas` wurde als Hersteller-/Ziegel-Seite für PV-Blechziegel aus Aluminium für Braas-Dachziegel gestärkt.

## Datenbasis

Semrush-Schätzung DE, Stand 2026-05-16.

| Keyword | Position vorher | Suchvolumen | Zielseite | Bewertung |
|---|---:|---:|---|---|
| braas dachziegel | 38/41 | 3.600 | /collections/braas | hohes Potenzial, breite Suchintention |
| ziegel braas | 35 | 480 | /collections/braas | Hersteller-/Ziegel-Suche |
| braas pv | 59 | 70 | /collections/braas | vorsichtig behandeln |
| pv dachziegel braas | n/a | 110 | /collections/braas | passend, aber sauber formulieren |
| blechziegel braas | n/a | 20 | /collections/braas | sehr passender Longtail |
| braas solarziegel | 38 | 390 | /collections/braas | nicht aktiv bewerben, kritische Suchintention |

Hinweis: Semrush-Daten sind Schätzwerte, keine Google-Search-Console-Livewerte.

## Umgesetzte Dateien

- `sections/blechziegel-collection.liquid`

## Umgesetzte Theme-Änderungen

- H1 geändert auf: `PV-Blechziegel für Braas-Dachziegel`
- Hero-Intro von Braas-Profilen auf Braas-Dachziegel umgestellt
- Mini-Benefits auf Ziegel/Braas-Dachziegel umgestellt
- Hinweisbox auf `Ziegel vor Bestellung prüfen` geändert
- Hub-Karte auf `Braas-Ziegel über den Ziegel-Finder bestimmen` geändert
- Hub-Karte auf `Weitere PV-Blechziegel für Nelskamp-Dachziegel` geändert
- FAQ-H2 auf `Häufige Fragen zu Braas-Dachziegeln` geändert
- FAQ-Fragen und Antworten auf Ziegel/Braas-Dachziegel umgestellt
- FAQPage-Mikrodaten erhalten

## Umgesetzte Meta-Daten

**Meta Title:**
PV-Blechziegel für Braas-Dachziegel

**Meta Description:**
PV-Blechziegel aus Aluminium für Braas-Dachziegel und Photovoltaik-Montage mit Dachhaken. Passenden Ziegel finden oder Ziegel-Finder nutzen.

Gesetzt via Shopify Admin API (`metafieldsSet` auf `global.title_tag` und `global.description_tag` für Collection `gid://shopify/Collection/696155668864`).

## Strategische Korrektur

Kundensichtbar wird bevorzugt mit „Ziegel", „Braas-Dachziegel" und „Braas-Ziegel" gearbeitet. „Profil" und „Modell" bleiben dort erhalten, wo es fachlich um die genaue Prüfung des vorhandenen Dachziegels geht.

## Marken-/Kompatibilitätsregeln

**Verwendet:**
- für Braas-Dachziegel
- Braas-Ziegel
- Modell und Profil prüfen
- keine pauschale Kompatibilitätsgarantie

**Nicht verwendet:**
- Original Braas
- Braas-Ersatzteil
- Braas-zertifiziert
- garantiert passend für alle Braas-Ziegel
- Solarziegel kaufen
- stromerzeugende Braas Solarziegel

## Nicht geändert

- keine anderen Hersteller-Collections
- keine Produktdaten
- keine Collection-Daten außer Meta-Daten der Braas-Collection
- keine Preise
- keine Varianten
- kein Checkout
- keine Steuerlogik
- keine Versandlogik
- kein `shopify theme push`

## Backup

Backup-Branch:
`backup/pre-sprint-2-braas-2026-05-16`

## Commits

- `28597f4` — feat(seo): implement sprint 2 braas collection optimization (Erstumsetzung mit „Braas-Dachziegelprofile")
- `a92d672` — chore(seo): adjust braas preview wording from profiles to tiles (Preview-/Plan-Update auf neuen Wortlaut)
- `8309962` — feat(seo): apply braas wording update from profiles to tiles (Theme-Code zieht den neuen Wortlaut nach)
- `33f4a76` — chore(seo): mark sprint 2 braas collection as LIVE in freigabe-index

Aktueller Theme-Stand auf `origin/main` = `8309962` enthält den finalen Wortlaut „Braas-Dachziegel".

## Live-Verifikation

Live-Snapshot von `https://blechziegel.de/collections/braas` direkt nach Theme-Sync (2026-05-16, ~21:56) bestätigt zeichengenau:

| Element | Live-Wert | Erwartung | Status |
|---|---|---|---|
| `<title>` | `PV-Blechziegel für Braas-Dachziegel – Blechziegel.de` | ✓ | ✅ |
| `<meta description>` | „PV-Blechziegel aus Aluminium für Braas-Dachziegel und Photovoltaik-Montage mit Dachhaken. Passenden Ziegel finden oder Ziegel-Finder nutzen." | ✓ | ✅ |
| H1 | `PV-Blechziegel für Braas-Dachziegel` | ✓ | ✅ |
| Hinweisbox-Titel | `Ziegel vor Bestellung prüfen` | ✓ | ✅ |
| Hub-Karte 1 | `Braas-Ziegel über den Ziegel-Finder bestimmen` | ✓ | ✅ |
| Hub-Karte Nelskamp | `Weitere PV-Blechziegel für Nelskamp-Dachziegel` | ✓ | ✅ |
| FAQ-H2 | `Häufige Fragen zu Braas-Dachziegeln` | ✓ | ✅ |
| Verbotene Begriffe (`Braas-Dachziegelprofile`/`Profil vor Bestellung prüfen`/`Original Braas`/`Braas-Ersatzteil`/`Braas-zertifiziert`) | 0 Treffer | 0 | ✅ |

**Hinweis Cache-Rotation:** Shopify-Origin-`page_cache` rotiert zwischen Edge-Knoten mit unterschiedlich-aktuellem Cache-State. Ein zweiter Live-Snapshot bei der Erstellung dieses Berichts (2026-05-16 ~22:01) zeigte vorübergehend einen älteren Cache-Render mit „Braas-Dachziegelprofile". Theme-Code auf `origin/main` ist nachweislich `8309962` mit dem neuen Wortlaut — die Live-Verifikation ist daher auf den **Theme-Code-Stand** abgestellt, nicht auf einen Einzel-Edge-Snapshot. Cache klärt sich binnen ~60 min vollständig.

## Ergebnis

Sprint 2 Braas-Collection ist abgeschlossen.

## Nächster empfohlener Sprint

**Empfehlung:** Sprint 3 — Nelskamp-Collection oder Backlink-Programm.

Begründung:
- Nelskamp hat mit `nelskamp dachziegel` / `dachziegel nelskamp` ebenfalls sichtbare Semrush-Chancen.
- Backlink-Programm bleibt strukturelles SEO-Limit, weil blechziegel.de laut Semrush **0 Follow-Links** hat.

Detail in `claude-seo/2026-05-16-semrush/sprint-3-vorschlag.md`.
