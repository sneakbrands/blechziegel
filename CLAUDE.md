# Projektregeln

## 🔴 ZWINGEND: Arbeit immer auf Branch `main`

**Dieses Theme-Repo wird ausschließlich über den `main`-Branch live deployed.** GitHub `main` → Shopify Auto-Sync. Feature-Branches werden NICHT auf Shopify gesynct und sind deshalb für Deployments verboten.

- **Vor JEDER Änderung:** `git branch --show-current` prüfen — Ergebnis muss `main` sein.
- Wenn der aktuelle Branch nicht `main` ist: **NICHT blind wechseln** — erst Benutzer fragen, ob die unveröffentlichte Arbeit auf dem Feature-Branch nach `main` gemergt oder verworfen werden soll. Es können 40+ lokale Commits offen sein.
- **Jeder Commit geht auf `main`** — keine Feature-Branches, keine PRs, keine `git push origin feature/…`.
- **Push-Befehl immer exakt:** `git push origin main`. Niemals `--force` auf `main`.

## Session-Start (Pflicht bei jedem Projektstart)
- **Branch prüfen:** `git branch --show-current` — wenn nicht `main`: STOP, Benutzer fragen wie der aktuelle Branch-Stand zu behandeln ist.
- **Shopify CLI prüfen:** `"$APPDATA/npm/shopify" theme list --store blechziegel-de.myshopify.com` — muss Theme `#193125220736` zeigen.
- **Shopify API prüfen:** `node scripts/shopify-api-check.mjs` — alle Checks müssen grün sein.
- **GitHub prüfen:** `git remote -v` muss `https://github.com/sneakbrands/blechziegel.git` zeigen, `git fetch origin main` muss funktionieren.
- **Playwright prüfen:** `cd scripts/coll-test && npx playwright --version` muss eine Version zeigen; Chromium muss installiert sein (`npx playwright install --dry-run chromium` — kein "Install location: missing").
- **Stock-Monitor prüfen:** `gh run list --workflow=stock-monitor.yml --limit 1` — der letzte Run muss `completed success` sein (läuft alle 4h automatisch, siehe `scripts/stock-monitor/README.md`). *Hinweis: `gh` CLI ist aktuell nicht installiert — alternativ im GitHub-Webinterface prüfen.*
- Wenn eine Verbindung fehlt oder Branch nicht `main`: **zuerst fixen**, bevor gearbeitet wird.

## Arbeitsweise
- Erst analysieren, dann ändern.
- Vor jeder größeren Änderung kurz den betroffenen Scope benennen.
- Kleine, nachvollziehbare Commits bevorzugen.
- Keine Live-Publishing-Aktionen ohne ausdrückliche Anweisung.
- Keine Secrets, Tokens oder .env-Inhalte ausgeben.
- Keine Änderungen außerhalb des Projektordners — **Ausnahme:** `C:\Claude\Agent\Blechziegel\LStockagent` (Stock-Agent-Ordner) ist freigegeben, Änderungen dort sind ohne weitere Rückfrage erlaubt. Dieser Ordner wird **niemals** in git eingecheckt (kein `git add`, kein Commit, kein Push).

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

## Corporate Identity — verbindlich fuer ALLE Marketing-Aktionen

**Vollständige Spec:** `C:\Claude\Agent\Blechziegel\BZcrawler\data\site-knowledge\CI-SPEC.md`

Jeder Marketing-Output (Instagram-Carousel, Reel-Cover, E-Mail-Template, Landing-Page, Blog-Hero, Ad-Creative, Flyer, Lead-Magnet-PDF) übernimmt die CI von blechziegel.de **ohne eigene Farbsetzung**:

- **Farben:** Schwarz `#000` · Weiss `#FFF` · Hover `#333` · Border `#DFDFDF` · Muted `rgba(0,0,0,0.6)`. **Keine weiteren Farben ohne expliziten User-OK** (Produktfotos behalten ihre RAL-Farben).
- **Fonts:** `Inter` für alles. `Montserrat` nur für Navigation/Logo-Elemente.
- **Typografie-Signatur:** H1/H2 mit `letter-spacing: 0.25em` und `line-height: 1` (display-tight). Body 14 px / line-height 1.6.
- **Border-Radius:** Primary-Buttons **14 px** (CI-Signatur!), Cards ~13 px, Form-Inputs 4-6 px.
- **Primary-Button:** `#000` background, `#FFF` text, hover `#333`. Inter. 14 px radius.
- **Anrede:** Du. Immer Du. Nie Sie.
- **CTAs:** Aktion + Nutzen + Qualifier. Verboten: „Mehr erfahren", „Hier klicken", „Absenden".
- **Shadows:** sparsam — nur Drawer/Modal `0 4px 20px rgba(0,0,0,0.15)`. Cards haben Border, keinen Schatten.
- **Logo:** nur schwarz auf hell oder weiss auf dunkel. Keine farbigen Varianten.

Bei visuellen Assets gilt: **minimalistisch — die Farbe kommt aus den Produktfotos (Aluminium · Anthrazit RAL 7016 · Ziegelrot RAL 8004), nicht aus dem Template.**

## Deployment-Routen (verbindlich — bei jeder Änderung anwenden)

**Vollständige Matrix:** `C:\Claude\Agent\Blechziegel\BZcrawler\data\DEPLOYMENT-ROUTES.md`

Kurz:

| Art der Änderung | Route | Beispiele |
|---|---|---|
| **Theme-Code** (Liquid, CSS, JS, Templates, Sections, Snippets, Assets) | **Git → GitHub → Auto-Sync** | Schema-Snippets, Pillar-Seiten-Templates, Free-Tool-Sections, llms.txt, robots.txt |
| **Shop-Daten** (Pages, Blog-Artikel, Produkte, Metafields, Menüs, Redirects, Metaobjects, Discounts, Script-Tags) | **Shopify Admin API** (`c:/Users/Administrator/blechziegel-admin-tools/.env` Token, 69 Write-Scopes verfügbar) | Blog-Artikel publishen, Produktbeschreibungen ergänzen, FAQ-Metaobjekte anlegen, 301-Redirects |
| **Externe Kanäle** (GMC, Meta Commerce, GSC, Ads, Social, ESP, Wikipedia, DNS) | **User handelt selbst** — Claude liefert Schritt-für-Schritt-Anleitung mit konkreten Werten | Brand-Normalisierung BHE → blechziegel.de im GMC-Feed, Sitemap an GSC submitten, Social Posts |
| **Inhalte die beides brauchen** | **Erst Git (Template), dann API (Daten)** | Neuer Blog-Kategorie: Template push → Blog per API anlegen → Artikel per API publishen |

### Verbindungs-Checks (Session-Start Pflicht)

```bash
cd c:/Users/Administrator/blechziegel-theme
git remote -v && git status                               # Git
"$APPDATA/npm/shopify.cmd" theme list --store blechziegel-de.myshopify.com   # Shopify CLI
node scripts/shopify-api-check.mjs                        # Shopify API
```

### Aktive externe Kanäle

**Einzig aktiv: Instagram.** Alle anderen externen Kanäle (LinkedIn, TikTok, X, YouTube, Klaviyo/ESP, GSC, GMC, Meta Commerce, Google Ads, Trusted Shops, Bing Webmaster) sind **zurückgestellt** — nicht in Content-Pakete einbauen, keine Links empfehlen, keine Accounts als vorhanden annehmen.

Instagram-Zugriffsmodi (siehe `C:\Claude\Agent\Blechziegel\BZcrawler\data\DEPLOYMENT-ROUTES.md`):
- **Mit Graph-API-Token:** Claude plant/publisht Posts+Reels direkt, liest Insights
- **Ohne Token:** Claude liefert Content-Pakete (Caption + Hashtags + Bild-Brief + Reel-Script), User publisht manuell

### Was Claude NICHT direkt kann (User-Handlung nötig)

- **`gh` CLI** ist nicht installiert → PR/Issue/Release-Management, Workflow-Logs nur über GitHub-Webinterface oder nach Install
- **Keine Tokens für:** Google Merchant Center, Meta Commerce, Google Ads, GSC, Klaviyo, Trusted Shops, LinkedIn/TikTok/X, YouTube, Wikipedia, DNS
- Wenn externe Aktion nötig: Claude produziert eine **präzise Copy/Paste-Anleitung**, gibt aber nicht vor, sie selbst ausgeführt zu haben

### Nach jeder deploy-relevanten Aktion

- **Git-Weg:** alle Links (Blob je Datei, Raw, Commit-SHAs, Compare gegen main) in die Antwort
- **API-Weg:** Endpoint, Response-ID, Status, Live-URL-Check
- **Externer Weg:** User-Checkliste mit konkreten Werten + Screenshot-Anforderung zurück

## Tests
- Nach relevanten Änderungen passende Prüfungen ausführen.
- Bevorzugt lokal: Theme-Check, vorhandene Linter, Playwright nur gezielt.

## Git (verbindlich, keine Ausnahmen)

### Branch
- **Immer `main`.** Jeder Commit, jeder Push. Niemals Feature-Branches als Deployment-Zielen.
- `git branch --show-current` muss vor jeder Git-Aktion `main` zeigen. Wenn nicht → stoppen, Benutzer fragen.

### Commit
- **Vor jedem Commit:** `git status` + `git diff` prüfen.
- **`git add` nur mit expliziten Dateinamen** — kein `-A`, kein `.`. Vermeidet ungewollte Commits (Test-Scripts, Screenshots, Secrets).
- Ausgeschlossen vom Commit: `.env*`, `node_modules/`, `backups/`, Stock-Agent-Ordner `C:\Claude\Agent\Blechziegel\...`.
- Commit-Nachrichten: präzise, deutsch/englisch egal aber aussagekräftig.

### Push
- **Immer `git push origin main`** — keine anderen Targets.
- **Niemals `--force`** auf `main`.
- **Niemals Hooks umgehen** (`--no-verify`, `--no-gpg-sign`). Wenn ein Hook fehlschlägt: Ursache fixen, neuen Commit machen.

### Nach jedem Commit + Push
Immer automatisch die vollständigen GitHub-Links senden:
- Blob-URL jeder geänderten Datei
- Raw-URL des Hauptreports (für ChatGPT-Import)
- Commit-URLs (alle SHAs)
- Compare-URL gegen main
Nichts weglassen.

### Pre-Action-Check (Script, wenn unsicher)
```bash
cd c:/Users/Administrator/blechziegel-theme
[ "$(git branch --show-current)" = "main" ] && echo "OK auf main" || echo "FEHLER — nicht auf main"
```

## Datenquellen — KEIN Plenty
- Dieses Projekt arbeitet **NICHT mit Plenty/plentymarkets**. Ausschließlich **Shopify** als E-Commerce-System.
- Tracking-/Auftragsdaten kommen aus **Shopify Fulfillments** (nicht aus Plenty).
- In Code, Docs und Agent-Konfigurationen niemals Plenty als Datenquelle vorschlagen oder referenzieren.
- Plenty-Integrationen existieren nur in anderen Projekten (z. B. `invoice-organizer`) und gehören dort hin, nicht hierher.

## Antwortstil im Projekt
- Knapp, direkt, umsetzungsorientiert.
- Risiken vor destruktiven Aktionen nennen.

## BZcrawler (externer Content-Agent)

Content-Pipeline YouTube → FAQ/Blog/Social/Shorts fuer blechziegel.de liegt unter `C:\Claude\Agent\Blechziegel\BZcrawler\` (ausserhalb des Theme-Repos).

- **Vollstaendige SOP:** siehe `C:\Claude\Agent\Blechziegel\BZcrawler\CLAUDE.md` — bei Arbeit an Content/Videos dort nachlesen, nicht hier
- **Standard-Run bei neuen Videos:** immer v2-Prompts (Marketing-Skills-enhanced), niemals v1 ohne expliziten User-Wunsch
  ```bash
  cd C:\Claude\Agent\Blechziegel\BZcrawler
  node src/crawl.mjs
  node src/generate.mjs --v2
  node src/preview-v2.mjs
  ```
- **Brand-Rules identisch zum Theme-Repo** — blechziegel.de extern, BHE Metalle nur als Hersteller-Referenz, keine erfundenen Claims/Zahlen
- **Marketing-Skills-Quelle:** `coreyhaines31/marketingskills` (MIT, geklont nach `~/.claude/plugins/marketplaces/marketingskills/`); Methodik-Distillate in `src/generate.mjs` inlined
- **v1 Baseline NIEMALS ueberschreiben** — `output/` eingefroren fuer Vergleich, Live-Outputs liegen in `output/v2/`

## Externe Brand-Normalisierung (verbindlich)
- Interner `product.vendor`-Wert bleibt unverändert (darf z. B. "BHE Metalle" bleiben) — keine blinde Löschung/Migration.
- Jedes **extern sichtbare** Brand-/Marken-Mapping (Google Merchant Center, Meta Commerce, Feed-Templates, Export-Mappings, strukturierte Brand-Felder in externen Integrationen, App-Brand-Zuordnungen) muss extern auf `blechziegel.de` gesetzt werden, falls dort aktuell `BHE Metalle` erscheint.
- Bewertung: `vendor = BHE Metalle` intern erlaubt, `brand = BHE Metalle` extern nicht erlaubt, `brand = blechziegel.de` extern gewünscht.
- Bei nicht prüfbaren Bereichen: „Ich kann das nicht bestätigen." + konkrete Handlungsempfehlung „Brand-Mapping extern auf `blechziegel.de` umstellen."
- In Reports immer einen Abschnitt **Brand-Normalisierung BHE Metalle → blechziegel.de** mit Tabelle (Quelle | Aktueller Wert | Zielwert | Änderung möglich | Status) sowie die Abschluss-Fragen (extern gefunden? umgestellt? warum nicht?).
