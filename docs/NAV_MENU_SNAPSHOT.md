# Navigation — Menu Snapshot nach NAV-1

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Quelle:** `~/blechziegel-admin-tools/menu.json` (extern zum Theme-Repo, via `set-menu.js` nach Shopify `main-menu` synct)

---

## Live-Struktur

```
Hauptmenü
├─ Ziegel finden                         → /pages/ziegel-finder
│  ├─ Ziegel-Finder starten              → /pages/ziegel-finder
│  ├─ Braas                              → /collections/braas
│  ├─ Bramac                             → /collections/bramac
│  ├─ Creaton                            → /collections/creaton
│  ├─ Nelskamp                           → /collections/nelskamp
│  └─ Alle Hersteller                    → /pages/hersteller
├─ Produkte                              → /collections/pv-dachziegel
│  ├─ PV Dachziegel                      → /collections/pv-dachziegel
│  └─ Alle Produkte                      → /collections/all
├─ Anfrage                               → /pages/ziegel-anfrage
│  ├─ Ziegel-Anfrage — Foto & Maße prüfen → /pages/ziegel-anfrage
│  └─ Projekt-Anfrage — B2B, Mengen, Sonderprofile → /pages/projekt-anfrage
├─ Für Profis                            → /pages/gewerbe
│  ├─ Gewerbe                            → /pages/gewerbe
│  ├─ Solar-Installateure                → /pages/solar-installateure
│  ├─ Für Händler                        → /pages/haendler
│  └─ Projekt-Anfrage                    → /pages/projekt-anfrage
└─ Ratgeber                              → /pages/ratgeber
```

**Top-Level = 5 Einträge.** Alle Parent-Links navigieren auf die Flaggschiff-Seite der Kategorie — Submenu ergänzt um weitere Einstiege.

## Entfernt

- „Startseite" (Logo-Klick ersetzt den Eintrag)
- „Kontakt" (Footer-Pfad, nicht mehr im Top-Level; kollidierte mit Anfrage-Funnel)
- „Alle Hersteller"-Redundanz auf Top-Level (jetzt nur im Finder-Submenu)

## Priorisierungs-Logik (Funnel-Alignment)

| Nutzer-Intent | Menü-Pfad |
|---|---|
| „Welcher Ziegel passt?" | Ziegel finden → Finder |
| „Hersteller suchen" | Ziegel finden → Braas/Bramac/Creaton/Nelskamp |
| „Direkt kaufen" | Produkte → PV Dachziegel |
| „Unsicher, Foto prüfen lassen" | Anfrage → Ziegel-Anfrage |
| „Projekt, Menge, Sonderprofil" | Anfrage → Projekt-Anfrage **oder** Für Profis → Projekt-Anfrage |
| „Dachdecker / PV-Betrieb" | Für Profis → Gewerbe |
| „Solarbetrieb" | Für Profis → Solar-Installateure |
| „Baustoffhandel" | Für Profis → Für Händler |
| „Info / Beratung lesen" | Ratgeber |

## Mobile-Verhalten

Drawer nutzt dieselbe Struktur. Accordion expandiert Submenus — B2B + beide Anfrage-Pfade sind **eine Tap-Ebene tief**, nicht versteckt. Parent-Links sind direkt klickbar (navigieren auf Flaggschiff-Seite).

**Mobile-Reihenfolge entspricht Desktop-Reihenfolge.** Theme-Architektur erzwingt dieselbe Ordnung für beide Varianten.

## Grenzen / Not verifiable

- Visueller Top-Level-Gewichts-Unterschied („Ziegel finden" optisch prominenter als „Ratgeber") ist **nicht** Teil von NAV-1 — bewusst kein Design-Refactor. **Ich kann das nicht bestätigen**, ob das ohne zusätzliche CSS-Mikro-Anpassungen optisch schon ausreichend wirkt.
- Projekt-Anfrage erscheint bewusst **zweimal** (unter „Anfrage" und unter „Für Profis") — redundante Navigation, gewollt, weil beide Intents sinnvoll dorthin führen.
- Mega-Menu-Breite (460 px) wurde in NAV-1 **nicht** verändert — steht als P2 im Navigation-Audit. Mit 7 Items im „Ziegel finden"-Submenu kann es optisch knapp werden — **Ich kann das nicht bestätigen** ohne Live-Check.
- Ob die bestehende Mobile-Drawer-Accordion-JS die Parent-Link-Navigation auf Touch sauber von Expand-Tap trennt — **Ich kann das nicht bestätigen** ohne Device-Test.

## Sync-Befehl (zur Wiederherstellung)

```bash
cd ~/blechziegel-admin-tools
node set-menu.js
```

Schreibt die Struktur aus `menu.json` idempotent nach Shopify `main-menu`.
