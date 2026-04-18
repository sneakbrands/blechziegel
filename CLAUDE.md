# Projektregeln

## 🔴 ZWINGEND: nur Theme-Code im Repo

Dieses Repository ist **ausschliesslich Shopify-Theme-Code**. Audits, Preview-HTMLs, Dev-Scripts, Build-Tools, Dokumentation gehoeren NICHT ins Repo — sie leben unter `C:\Claude\Agent\Blechziegel\theme-workspace\`.

### Erlaubt im Repo (main)

Nur die Shopify-Theme-Standard-Struktur:

- `assets/` — Theme-Assets (CSS, JS, SVG, Bilder)
- `blocks/` — Horizon-Theme-Blocks
- `config/` — `settings_schema.json`, `settings_data.json`
- `layout/` — `theme.liquid` + Varianten
- `locales/` — `de.*.json`, `en.*.json`
- `sections/` — Section-Liquid
- `snippets/` — Snippet-Liquid
- `templates/` — Template-JSON/Liquid

Plus Repo-Infrastruktur:

- `.github/` — GitHub-Actions-Workflows (Stock-Monitor etc.)
- `.gitignore`
- `CLAUDE.md` (diese Datei)
- `.claude/agents/` — Custom-Sub-Agent-Konfigurationen (projektspezifisch)
- `scripts/shopify-api-check.mjs` + `.ps1` — Session-Start-Pflicht-Check (API-Diagnose)
- `scripts/stock-monitor/` — laeuft in GitHub-Actions-Workflow
- `scripts/bestellstatus/` (falls tracked) — Bestellstatus-Feature (gehoert zu Theme-Feature)
- `scripts/README.md`

### Verboten im Repo

- Audit-/Strategie-Dokumente (`AUDIT_*.{html,md,pdf}`, `docs/` mit Audit-Reports) → `theme-workspace/audits/`
- Preview-HTMLs (`*_PREVIEW.html`, ad-hoc Mock-ups) → `theme-workspace/previews/`
- Export-Dateien (`CHATGPT_EXPORT*.md`) → `theme-workspace/exports/`
- Build-Tools (`build_*.{py,sh}`, PDF-Generatoren) → `theme-workspace/build-tools/`
- Playwright-/Test-Scripts ad hoc (`scripts/coll-test/`, `scripts/nav-test/`) → `theme-workspace/scripts-archive/`
- SEO-Audits separater Bereich (`claude-seo/`) → `theme-workspace/claude-seo/`
- Einmalige Utility-Scripts (`scripts/notify_done.py`, `scripts/shopify-cli-test.sh`, diverse `bz_*.py`) → `theme-workspace/scripts-archive/`

### Faustregel

> **"Wird das Shopify beim Sync ausliefern?" — wenn nein, gehoert es nicht ins Repo.**

Shopify synct nur `assets/`, `blocks/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`. Alles andere ist Dev-Artefakt.

### Workflow fuer Theme-Workspace

```
C:\Claude\Agent\Blechziegel\
  blechziegel-theme\       <- Git-Repo, nur Theme-Code (main-only)
  theme-workspace\         <- Dev-Artefakte, NICHT in Git
    audits\
    previews\
    exports\
    build-tools\
    docs\                  <- alte docs/ ausm Repo (Audits/Strategien)
    claude-seo\
    scripts-archive\
  BZcrawler\               <- Content-Agent
  LStockagent\             <- Stock-Monitor-Agent
  backups\                 <- Repo-Backups vor Aenderungen
```

Bei Bedarf an neuen Artefakten (neue Audits, Previews, Experiments): **direkt unter `theme-workspace/` ablegen, nicht im Repo**.

## 🔴 ZWINGEND: Freigabe-Workflow vor jedem Publish

**Keine Marketing-/Content-/Seiten-Änderung geht live, bevor der User sie auf einer lokalen Freigabe-Seite abgenommen hat.**

### Regel

Bevor ich Folgendes publishe, baue ich zuerst eine offline-Freigabe-Seite auf diesem Server:

- Shopify-Pages (z. B. `/pages/ig`, `/pages/gewerbe`, `/pages/ratgeber`)
- Blog-Artikel (Text + Hero-Bild)
- Instagram-Posts / Reels / Stories (Caption + Visuals + Hashtags)
- E-Mail-Templates / Newsletter
- Landing-Pages / Ads-Creatives
- Neue Sections / Templates mit sichtbarer Kunden-Wirkung
- Produktbeschreibungen / Metafield-Texte mit Kunden-Wirkung

**Nicht freigabepflichtig** (direkt live, weil reversibel + unsichtbar): Bug-Fixes, interne Script-Änderungen, Build-Tool-Updates, Git-Housekeeping, CLAUDE.md-Änderungen.

### Fester Ort

```
C:\Claude\Agent\Blechziegel\theme-workspace\freigabe\
  index.html                 <- Landing mit Liste aller offenen Freigaben
  <YYYY-MM-DD>-<slug>\       <- Ein Ordner pro Freigabe-Stück
    preview.html             <- Self-contained HTML, 1:1 wie es live aussieht
    README.md                <- Was ändert sich, wo geht es live, Deploy-Route
    assets\                  <- Bilder/Screenshots der Freigabe
```

### Ablauf

1. Ich produziere die finale Version (Text + Bilder + Section + Template).
2. Ich rendere sie in `freigabe/<YYYY-MM-DD>-<slug>/preview.html` — self-contained, ohne Shopify-Abhängigkeit, so wie sie live aussehen wird (Inter + Montserrat via Google Fonts, alle Farben, alle Assets lokal eingebettet/verlinkt).
3. Ich update `freigabe/index.html` mit einem neuen Eintrag (Datum, Titel, Deploy-Route, Status `PENDING`).
4. Ich melde dem User: „Freigabe liegt unter `theme-workspace/freigabe/<slug>/preview.html` — öffne lokal zum Review."
5. User sagt: freigeben → ich deploye über die normale Route (Git → main bei Theme-Code, Admin API bei Pages/Blog).
6. Nach Deploy: `freigabe/index.html` auf Status `LIVE` mit Live-URL und Commit-SHA.
7. User sagt: ablehnen / Änderung → ich überarbeite in-place, Status bleibt `PENDING`, alte Version wird überschrieben (keine Versions-Spagetti).

### Was die Preview enthalten muss

- **CI-konform**: Inter + Montserrat via Google Fonts eingebunden, alle Farben exakt (#000/#FFF/#333), keine Tailwind-Default-Styles
- **Responsiv testbar**: Desktop-Render plus Mobile-Frame-Darstellung (390 × 844 iframe oder scaled preview)
- **Deploy-Kontext im README.md**: „Wird live unter https://blechziegel.de/<path>" + „Deploy-Befehl: `git push origin main`" oder „Deploy-Befehl: `node scripts/publish-page.mjs ig` (Admin API)"
- **Rückweg dokumentiert**: wie wird das wieder offline genommen, wenn der Freigabe-Stand doch nicht final war

### Faustregel

> **„Gehst du live, ohne dass der User das vorher offline gesehen hat? — Dann fehlt eine Freigabe-Seite."**

## 🔴 ZWINGEND: Arbeit immer auf Branch `main`

**Dieses Theme-Repo wird ausschließlich über den `main`-Branch live deployed.** GitHub `main` → Shopify Auto-Sync. Feature-Branches werden NICHT auf Shopify gesynct und sind deshalb für Deployments verboten.

- **Vor JEDER Änderung:** `git branch --show-current` prüfen — Ergebnis muss `main` sein.
- Wenn der aktuelle Branch nicht `main` ist: **NICHT blind wechseln** — erst Benutzer fragen, ob die unveröffentlichte Arbeit auf dem Feature-Branch nach `main` gemergt oder verworfen werden soll. Es können 40+ lokale Commits offen sein.
- **Jeder Commit geht auf `main`** — keine Feature-Branches, keine PRs, keine `git push origin feature/…`.
- **Push-Befehl immer exakt:** `git push origin main`. Niemals `--force` auf `main`.

## Session-Start (Pflicht bei jedem Projektstart)
- **Branch prüfen:** `git branch --show-current` — wenn nicht `main`: STOP, Benutzer fragen wie der aktuelle Branch-Stand zu behandeln ist.
- **Shopify CLI prüfen:** `"$APPDATA/npm/shopify" theme list --store blechziegel-de.myshopify.com` — muss Theme `#193277395328` (role `[live]`) zeigen.
- **Shopify API prüfen:** `node scripts/shopify-api-check.mjs` — alle Checks müssen grün sein.
- **GitHub prüfen:** `git remote -v` muss `https://github.com/sneakbrands/blechziegel.git` zeigen, `git fetch origin main` muss funktionieren.
- **Playwright prüfen:** `cd scripts/coll-test && npx playwright --version` muss eine Version zeigen; Chromium muss installiert sein (`npx playwright install --dry-run chromium` — kein "Install location: missing").
- **Stock-Monitor prüfen:** Lokaler Windows-Scheduled-Task `Blechziegel Stock Monitor Bot` (läuft jede Minute, State muss `Ready` sein — wird vom SessionStart-Hook automatisch geprüft, siehe `scripts/session-start-check.ps1`). GitHub-Actions-Workflow `stock-monitor.yml` ist seit April 2026 auf manual-only gestellt (keine Secrets im Repo); lokaler Task ist der Produktiv-Runner.
- Wenn eine Verbindung fehlt oder Branch nicht `main`: **zuerst fixen**, bevor gearbeitet wird.

## Arbeitsweise
- Erst analysieren, dann ändern.
- Vor jeder größeren Änderung kurz den betroffenen Scope benennen.
- Kleine, nachvollziehbare Commits bevorzugen.
- Keine Live-Publishing-Aktionen ohne ausdrückliche Anweisung.
- Keine Secrets, Tokens oder .env-Inhalte ausgeben.
- Keine Änderungen außerhalb des Projektordners — **Ausnahme:** `C:\Claude\Agent\Blechziegel\LStockagent` (Stock-Agent-Ordner) ist freigegeben, Änderungen dort sind ohne weitere Rückfrage erlaubt. Dieser Ordner wird **niemals** in git eingecheckt (kein `git add`, kein Commit, kein Push).

## Shopify
- **Live-Theme:** `#193277395328` (blechziegel/main, role=main, seit 2026-04-18). Das vorherige Theme `#193125220736` (gleicher Name, aber jetzt `unpublished`) nicht mehr ansprechen — dort landen Pushes ins Nichts.
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
**Strukturierte CI-Daten:** `C:\Users\Administrator\MCP-Wordpress\CI-Daten\blechziegel\`

### 📁 CI-Daten — bei JEDER Design-/Marketing-Aufgabe zuerst laden

Pfad: `C:\Users\Administrator\MCP-Wordpress\CI-Daten\blechziegel\`

| Datei | Inhalt | Pflicht bei |
|---|---|---|
| `farben.yaml` | Farbpalette + Neutrals + Produkt-RAL-Farben | immer |
| `typografie.yaml` | Inter/Montserrat, H1-H5-Body-Button-Styles, CI-Signaturen | immer |
| `firma.yaml` | Firmendaten (ergänzend zu unten) | bei Legal/Impressum/Footer/Lieferschein/Rechnung |
| `ci-profil.md` | Marke, Branche, Positionierung, No-Gos | bei neuen Templates/Seiten |
| `tonality.md` | Ansprache (Du-Form), Stil, Wort-Vermeidungen | bei Text-UI |
| `layout-regeln.md` | Container, Raster, Abstände, Section-Typen | bei Layouts |
| `komponenten.md` | Buttons, Karten, Formulare, Trust, FAQ, Header/Footer | bei Komponenten |
| `bildsprache.md` | Bildtyp, Motive, Stil, No-Gos | bei Hero/Image-Sections |
| `rechtliches.md` | Impressum, Datenschutz-Anforderungen | bei Footer/Legal |
| `assets/logo/blechziegel-de-logo-header-transparent.png` | **offizielles Logo** (1867×380, transparent) | siehe unten |

### 🏷️ Logo — verbindlich

- **Offizielles Logo:** `blechziegel-de-logo-header-transparent.png` (1867×380 px, transparenter Hintergrund).
- **Lokaler Archiv-Pfad:** `C:\Users\Administrator\MCP-Wordpress\CI-Daten\blechziegel\assets\logo\blechziegel-de-logo-header-transparent.png`
- **Öffentliche CDN-URL (Shopify Files):** `https://cdn.shopify.com/s/files/1/0986/5986/0864/files/blechziegel-de-logo-header-transparent.png`
- **Shopify-Settings-Referenz:** `{{ settings.logo }}` (in Theme-Liquid) / `shopify://shop_images/blechziegel-de-logo-header-transparent.png`
- **Verwendung:** bei **jedem** Marketing-/Kunden-sichtbaren Dokument (Lieferschein, Rechnung, E-Mail-Header, Flyer, Landing-Page-Hero, Ad-Creative, Lead-Magnet-PDF, Freigabe-Previews). Kein neues Text-Wordmark mehr selbst rendern, wenn das offizielle Logo verfügbar ist — das PNG ist die Einzige Quelle.
- **Farb-Varianten:** nur schwarz auf hell oder weiss auf dunkel. Keine farbigen Varianten. Aktuelle PNG-Version ist schwarz auf transparent (also für helle Hintergründe). Für dunkle Hintergründe → User fragen, weiße Variante noch nicht hinterlegt.
- **In Liquid-Templates einbinden:** direkt die CDN-URL verwenden, nicht das Text-Wordmark, sobald ein Bild sinnvoll ist. Für Packing-Slips/Mails/Emails-Templates (kein `asset_url`-Kontext): absolute CDN-URL. Für Theme-Code: `{{ settings.logo | image_url: width: 500 }}`.

### 🎨 Pflicht: `frontend-designer`-Skill bei jeder UI-/Design-Aufgabe

Für **jede** UI-, Design- oder Styling-Aufgabe in diesem Projekt wird der Skill **`frontend-designer`** aufgerufen, **bevor** Code geschrieben wird. Nicht ad-hoc CSS schreiben — immer den Skill als Fundament nutzen, damit die CI-Signaturen (Inter/Montserrat, 0.25em H1-Letter-Spacing, 14 px Primary-Radius, Schwarz/Weiß) konsistent durchgezogen werden.

**Trigger (automatisch Skill laden):** UI, UX, design, layout, styling, farben, typografie, spacing, animation, hover, card, button, hero, section, template, section design, polish, redesign, component, landing-page, Page-Template, PDP-Anpassung, Collection-Layout, Footer, Header, Nav, Cart-Style, Form-CRO-Design, Link-in-Bio, Modal, Drawer, Banner, Swatch, Filter-UI, Checkout-Copy, Thank-You-Page, Ratgeber-Template, Blog-Layout.

**Kontext, den der Skill jedes Mal lädt:**
- `C:\Users\Administrator\MCP-Wordpress\CI-Daten\blechziegel\` — Farben + Typografie + Logo + Tonality (Pflicht-Lookup vor jedem Design)
- `C:\Claude\Agent\Blechziegel\BZcrawler\data\site-knowledge\CI-SPEC.md` — erweiterte Spec mit Site-spezifischen Tokens
- Horizon-Theme-CSS-Custom-Properties (z.B. `--style-border-radius-buttons-primary`, `--bz-nav-head`, `--font-h1--family`) — immer zuerst nutzen, Hard-Coded-Werte nur als Fallback
- Existierende Section-Struktur in `sections/` — kein Neu-Design eines Pattern, das schon existiert

**Verboten ohne expliziten User-OK:**
- Neue Farben außerhalb der CI-Palette (#000 / #FFF / #333 / #DFDFDF / rgba(0,0,0,0.6))
- Gradients, Neon, Drop-Shadows außerhalb der dokumentierten Hover-Effekte
- Fonts außerhalb Inter + Montserrat
- Emoji-Inflation / Icon-Stil-Mix
- CTAs à la „Mehr erfahren", „Hier klicken", „Absenden"
- `!important` auf CSS-Regeln, sofern nicht spezifisch begründet

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
