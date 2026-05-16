# Sprint 1 Abschlussbericht — Startseite SEO-Optimierung

## Status

Abgeschlossen und live geprüft durch Nutzer.

## Ziel

Startseite stärker auf PV-Blechziegel / Aluminium-Ersatzdachziegel für Photovoltaik-Montage ausrichten.

## Datenbasis

Semrush-Schätzung, Stand 2026-05-16:

- `blech ziegel` Position 24, SV 70
- `pv blechziegel` Position 26, SV 110
- `blechziegel für photovoltaik` Position 56, SV 70
- blechziegel.de: 0 Follow-Links laut Backlink-Overview

Hinweis:
Semrush-Daten sind Schätzwerte, keine Google-Search-Console-Livewerte.

## Umgesetzte Dateien

- `templates/index.json`
- `sections/blechziegel-home.liquid`

## Umgesetzte Änderungen

- H1 geändert auf: `PV-Blechziegel aus Aluminium für Photovoltaik-Montage`
- Hero-Subline positiv auf Aluminium-Ersatzdachziegel / PV-Montage formuliert
- CTA primär auf `Ziegelprofil finden`
- CTA sekundär auf `Alle PV-Blechziegel ansehen`
- FAQ 1–5 SEO-/Nutzerfragen aktualisiert
- FAQ-H2 auf `Häufige Fragen zu PV-Blechziegeln`
- Interne Links in FAQ-Antworten ergänzt:
  - `/products/pv-dachziegel-frankfurter-pfanne`
  - `/collections/braas`
  - `/collections/nelskamp`
  - `/pages/hersteller`
  - `/pages/ziegel-finder`
- Hero-Content-Position nachjustiert, ohne Bannerhöhe zu ändern

## Strategische Korrektur

Solarziegel-/Solardachziegel-Begriffe werden nicht aktiv beworben, weil diese Suchintention häufig ein anderes Produkt meint. Die Startseite positioniert blechziegel.de positiv als Anbieter von PV-Blechziegeln aus Aluminium für die Photovoltaik-Montage.

## Nicht geändert

- keine Preise
- keine Varianten
- kein Checkout
- keine Steuerlogik
- keine Versandlogik
- keine Produktdaten
- keine Collection-Daten
- kein `shopify theme push`
- keine Shopify Admin API Writes

## Backup

Backup-Branch:

`backup/pre-sprint-1-homepage-seo-2026-05-16`

Stand:

`222b793f587f82fcbba3f696ef065a78fede0c26`

## Finaler Sichtprüfungsstand

Nutzerfeedback:

`jetzt ist es perfekt`

## Noch offen

Meta Title und Meta Description wurden noch nicht gesetzt. Sie sollen separat freigegeben und dann über Shopify Admin oder einen separaten kontrollierten Admin-API-Schritt gepflegt werden.
