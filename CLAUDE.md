# Projektregeln

## Session-Start (Pflicht bei jedem Projektstart)
- **Shopify CLI prüfen:** `"$APPDATA/npm/shopify" theme list --store blechziegel-de.myshopify.com` — muss Theme `#193125220736` zeigen.
- **Shopify API prüfen:** `node scripts/shopify-api-check.mjs` — alle Checks müssen grün sein.
- **GitHub prüfen:** `git remote -v` muss `https://github.com/sneakbrands/blechziegel.git` zeigen, `git fetch origin main` muss funktionieren.
- Wenn eine Verbindung fehlt: zuerst fixen, bevor gearbeitet wird.

## Arbeitsweise
- Erst analysieren, dann ändern.
- Vor jeder größeren Änderung kurz den betroffenen Scope benennen.
- Kleine, nachvollziehbare Commits bevorzugen.
- Keine Live-Publishing-Aktionen ohne ausdrückliche Anweisung.
- Keine Secrets, Tokens oder .env-Inhalte ausgeben.
- Keine Änderungen außerhalb des Projektordners.

## Shopify
- **Live-Theme:** `#193125220736` (blechziegel/main) — NUR dieses Theme verwenden. Alle anderen Themes ignorieren.
- **Store-Domain:** `blechziegel-de.myshopify.com`
- **Auto-Sync:** GitHub `main` → Shopify ist aktiv. Pushes auf `main` deployen automatisch.
- **Git-Push:** Immer direkt auf `main` pushen.
- **NIEMALS `shopify theme push` verwenden.** GitHub ist der Master — Theme-Änderungen gehen NUR über Git nach GitHub, Shopify synct automatisch.
- **Prüfung:** Theme-Code über CLI (`shopify theme check`) und API verifizieren. Playwright nur auf explizite Anweisung.
- Theme-Dateien konsistent halten.
- Keine produktiven Shop-Einstellungen ändern, wenn nicht explizit gefordert.
- Bei Liquid-Änderungen auf bestehende Section-/Snippet-Struktur achten.
- JSON-LD und SEO-Änderungen nur ergänzen, nicht bestehende Tracking-/Consent-Logik beschädigen.

## Tests
- Nach relevanten Änderungen passende Prüfungen ausführen.
- Bevorzugt lokal: Theme-Check, vorhandene Linter, Playwright nur gezielt.

## Git
- Immer direkt auf `main` pushen — keine Feature-Branches für Deployments.
- Vor Änderungen Status prüfen.
- Diffs vor Commit prüfen.
- Nach jedem Commit + Push immer automatisch die vollständigen GitHub-Links senden: Blob-URL jeder geänderten Datei, Raw-URL des Hauptreports (für ChatGPT-Import), Commit-URLs (alle SHAs), Compare-URL gegen main. Nichts weglassen.

## Antwortstil im Projekt
- Knapp, direkt, umsetzungsorientiert.
- Risiken vor destruktiven Aktionen nennen.

## Externe Brand-Normalisierung (verbindlich)
- Interner `product.vendor`-Wert bleibt unverändert (darf z. B. "BHE Metalle" bleiben) — keine blinde Löschung/Migration.
- Jedes **extern sichtbare** Brand-/Marken-Mapping (Google Merchant Center, Meta Commerce, Feed-Templates, Export-Mappings, strukturierte Brand-Felder in externen Integrationen, App-Brand-Zuordnungen) muss extern auf `blechziegel.de` gesetzt werden, falls dort aktuell `BHE Metalle` erscheint.
- Bewertung: `vendor = BHE Metalle` intern erlaubt, `brand = BHE Metalle` extern nicht erlaubt, `brand = blechziegel.de` extern gewünscht.
- Bei nicht prüfbaren Bereichen: „Ich kann das nicht bestätigen." + konkrete Handlungsempfehlung „Brand-Mapping extern auf `blechziegel.de` umstellen."
- In Reports immer einen Abschnitt **Brand-Normalisierung BHE Metalle → blechziegel.de** mit Tabelle (Quelle | Aktueller Wert | Zielwert | Änderung möglich | Status) sowie die Abschluss-Fragen (extern gefunden? umgestellt? warum nicht?).
