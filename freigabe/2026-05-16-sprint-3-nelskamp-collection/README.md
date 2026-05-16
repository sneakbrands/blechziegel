# Sprint 3 Nelskamp-Collection SEO-Optimierung — Freigabe

## Ziel

Nelskamp-Collection als SEO-/Conversion-Seite für PV-Blechziegel aus Aluminium für Nelskamp-Dachziegel stärken — analog Sprint 2 (Braas).

## Nicht-Ziel

- keine Live-Änderung in diesem Sprint
- keine Theme-Code-Änderung in diesem Sprint
- keine Produktdatenänderung
- keine Preisänderung
- keine Variantenänderung
- keine Checkout-/Steuer-/Versandänderung
- keine aktive Bewerbung von Solarziegeln

## Datenbasis

Semrush-Schätzung 2026-05-16, kein GSC-Livewert.

- `nelskamp dachziegel` Pos 46, SV 1.000
- `dachziegel nelskamp` Pos 55, SV 170
- `nelskamp ziegel` Pos 50, SV 70

## Deploy-Route (nach Freigabe)

1. Theme-Code: `git push origin main` — neuer `is_nelskamp`-Branch in `sections/blechziegel-collection.liquid`
2. Meta-Daten: Shopify Admin API `metafieldsSet` für Nelskamp-Collection-GID
3. Live-Verifikation auf https://blechziegel.de/collections/nelskamp

## Zu prüfen

- Hero/Intro verständlich?
- Marken-/Kompatibilitätsformulierung vorsichtig genug?
- Produkte bleiben sichtbar genug?
- Ziegel-Finder prominent genug?
- FAQ hilfreich?
- Mobile-Ansicht gut?

## Rückweg

Falls Freigabe-Stand nicht final: Theme-Code-Änderungen erfolgen erst nach ausdrücklicher Freigabe als separater Commit auf `main`. Reverten via `git revert <sha>` möglich, Backup-Branch `backup/pre-sprint-3-nelskamp-2026-05-16` wird vor Umsetzung angelegt.

## Nächster Schritt nach Freigabe

Erst nach ausdrücklicher Freigabe Umsetzung in Theme-Code als separater Commit + Meta-API-Write.
