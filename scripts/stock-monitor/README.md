# Stock-Monitor blechziegel.de

Alle 4 Stunden prüft ein GitHub-Actions-Workflow den Lagerbestand aller aktiven Produktvarianten. Fällt eine Variante unter die Schwelle (default **20 Stück**), wird per E-Mail und Telegram alarmiert.

## Wie es läuft

| Wann | Wo | Was |
|---|---|---|
| Alle 4 h (cron `0 */4 * * *` UTC) | GitHub Actions | Workflow `.github/workflows/stock-monitor.yml` führt `node index.mjs` aus |
| On-Demand | Lokal oder Actions-Tab | `node index.mjs` oder `gh workflow run stock-monitor.yml` |
| Alerts | Telegram-Bot + SMTP-E-Mail | nur bei Varianten < STOCK_THRESHOLD |

## Einmaliges Setup

### 1. Telegram-Bot anlegen

1. In Telegram `@BotFather` schreiben → `/newbot` → Namen + Username vergeben.
2. Den von BotFather gelieferten **Token** notieren (`TELEGRAM_BOT_TOKEN`).
3. Bot im eigenen Chat starten (einmal `/start` schicken oder eine beliebige Nachricht).
4. In einem Browser `https://api.telegram.org/bot<TOKEN>/getUpdates` öffnen → in der JSON-Antwort die `chat.id` auslesen (`TELEGRAM_CHAT_ID`, typisch eine 9–10-stellige Zahl, ggf. negativ bei Gruppen).

### 2. E-Mail-Versand (SMTP)

Du brauchst Zugang zu einem SMTP-Server (eigener Hoster, eigener Mailprovider o.Ä.). Benötigte Werte:

- `ALERT_SMTP_HOST` — z. B. `mail.deinhoster.de`
- `ALERT_SMTP_PORT` — typisch `587` (STARTTLS) oder `465` (SSL/TLS)
- `ALERT_SMTP_USER` — Login-Benutzer (oft die Absenderadresse)
- `ALERT_SMTP_PASS` — Passwort / App-Passwort
- `ALERT_SMTP_SECURE` — `true` bei Port 465, `false` bei 587
- `ALERT_EMAIL_FROM` — Absender, z. B. `alerts@blechziegel.de`
- `ALERT_EMAIL_TO` — Empfänger, z. B. `m.heller@branofilter.de`

### 3. GitHub-Repo-Secrets eintragen

Im Repo auf GitHub:
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Alle folgenden Keys anlegen:

| Secret | Beispielwert |
|---|---|
| `SHOP_DOMAIN` | `blechziegel-de.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | `shpat_…` (wie in `blechziegel-admin-tools/.env`) |
| `STOCK_THRESHOLD` | `20` |
| `ALERT_EMAIL_FROM` | `alerts@blechziegel.de` |
| `ALERT_EMAIL_TO` | `m.heller@branofilter.de` |
| `ALERT_SMTP_HOST` | `mail.deinhoster.de` |
| `ALERT_SMTP_PORT` | `587` |
| `ALERT_SMTP_USER` | `alerts@blechziegel.de` |
| `ALERT_SMTP_PASS` | `…` |
| `ALERT_SMTP_SECURE` | `false` |
| `TELEGRAM_BOT_TOKEN` | `123456:ABC…` |
| `TELEGRAM_CHAT_ID` | `987654321` (oder `-12345…` für Gruppen) |
| `STOCK_REALERT_HOURS` _(optional)_ | `24` (Default) — Dedupe-Fenster pro Variante |
| `STOCK_ALERT_START_HOUR` _(optional)_ | `8` (Default) — Beginn Alert-Fenster (Stunde inklusive) |
| `STOCK_ALERT_END_HOUR` _(optional)_ | `17` (Default) — Ende Alert-Fenster (Stunde inklusive) |
| `STOCK_ALERT_TZ` _(optional)_ | `Europe/Berlin` (Default) — Zeitzone für Fenster |

### 4. Lokale Entwicklung

Für lokale Tests dieselben Werte zusätzlich in `c:/Users/Administrator/blechziegel-admin-tools/.env` eintragen (die Datei wird von `index.mjs` automatisch ausgelesen, wenn keine `process.env`-Vars vorhanden sind). Der Shopify-Token ist dort bereits vorhanden.

## Tests & Betrieb

```bash
cd c:/Users/Administrator/blechziegel-theme/scripts/stock-monitor

# Dry-Run: listet betroffene Varianten in STDOUT, sendet nichts
node index.mjs --dry-run

# Test-Alert: sendet einen Dummy-Alert an beide Kanäle (kein Shopify-Call)
node index.mjs --test

# Echter Run
node index.mjs
```

Auf GitHub:

```bash
# Manueller Run
gh workflow run stock-monitor.yml

# Letzte Runs ansehen
gh run list --workflow=stock-monitor.yml --limit 10

# Logs des letzten Runs
gh run view --log
```

## Exit-Codes

- `0` — OK (auch wenn Alerts gesendet wurden — der Workflow soll nicht „failed" werden, nur weil Bestand niedrig ist)
- `1` — Konfigurations- oder Netzwerkfehler (ungültiger Token, SMTP nicht erreichbar, beide Kanäle fehlgeschlagen, …)

## Was wird geprüft

- Nur Produkte mit `status === 'active'`
- Nur Varianten mit `inventory_management === 'shopify'` (ungetrackte Varianten werden übersprungen, weil dort `inventory_quantity` nicht aussagekräftig ist)
- `inventory_quantity < STOCK_THRESHOLD` (Summe über alle Locations)

## Alert-Fenster & Dedupe

- **Tageszeit-Fenster:** Benachrichtigungen gehen nur zwischen `STOCK_ALERT_START_HOUR` und `STOCK_ALERT_END_HOUR` raus (Default **8-17 Uhr `Europe/Berlin`**, Mo-So). Außerhalb: Script detektiert und loggt die Lage, sendet aber nichts und aktualisiert den State nicht. So werden Alerts, die über Nacht entstehen, am nächsten Morgen sauber gebündelt geschickt.
- **Dedupe pro Variante:** Eine Variante wird pro `STOCK_REALERT_HOURS` (Default **24h**) maximal einmal gemeldet. Erstmeldung als 🆕, Wiederholung nach dem Dedupe-Fenster als 🔁 (Erinnerung — Bestand wurde nicht korrigiert). Steigt eine Variante wieder auf ≥ Schwelle, wird sie automatisch aus dem State entfernt und bei erneuter Unterschreitung wieder als 🆕 gemeldet.
- **State-File:** `scripts/stock-monitor/state.json` (per `.gitignore` ausgeschlossen). Lokal persistiert via Task-Scheduler-Disk, auf GitHub Actions via `actions/cache`.

## Nicht-Ziele (bewusst)

- Keine Auto-Reorder-Logik — nur Alerts.
- Keine Hersteller-Benachrichtigung.
- Keine Verkaufsgeschwindigkeits-Prognose — es gibt nur eine feste globale Schwelle. Pro-Produkt-Schwellen können später ergänzt werden (z. B. via Metafeld `stock.threshold`).
