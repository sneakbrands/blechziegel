# Navigation — Menu Snapshot nach Phase H1

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16 (Phase H1 — Hersteller-Strategie)
**Quelle:** `~/blechziegel-admin-tools/menu.json` (extern zum Theme-Repo, via `set-menu.js` nach Shopify `main-menu` synct)

---

## Live-Struktur nach H1

```
Hauptmenü
├─ Ziegel finden                            → /pages/ziegel-finder   (direkter Link, kein Submenu)
├─ Hersteller                               → /pages/hersteller
│  ├─ Braas                                 → /collections/braas
│  ├─ Bramac                                → /collections/bramac
│  ├─ Creaton                               → /collections/creaton
│  ├─ Nelskamp                              → /collections/nelskamp
│  ├─ Alle Hersteller                       → /pages/hersteller
│  └─ Alle Produkte                         → /collections/all
├─ Anfrage                                  → /pages/ziegel-anfrage
│  ├─ Ziegel-Anfrage — Foto & Maße prüfen   → /pages/ziegel-anfrage
│  └─ Projekt-Anfrage — B2B, Mengen, Sonderprofile → /pages/projekt-anfrage
├─ Für Profis                               → /pages/gewerbe
│  ├─ Gewerbe                               → /pages/gewerbe
│  ├─ Solar-Installateure                   → /pages/solar-installateure
│  ├─ Für Händler                           → /pages/haendler
│  └─ Projekt-Anfrage                       → /pages/projekt-anfrage
└─ Ratgeber                                 → /pages/ratgeber
```

**Top-Level = 5 Einträge.**

## Änderungen gegenüber Vorphase (NAV-1)

| Element | Vor H1 | Nach H1 |
|---|---|---|
| Top-Level „Produkte" | vorhanden | **entfernt** |
| Top-Level „Hersteller" | nur Submenu-Eintrag unter „Ziegel finden" | **eigenes Top-Level** |
| Hersteller-Brands (Braas/Bramac/…) | unter „Ziegel finden" | **unter „Hersteller"** |
| „Ziegel-Finder starten" Submenu | ja | entfernt (Top-Level-Link selbst navigiert auf Finder) |
| „Alle Hersteller" | unter „Ziegel finden" | unter „Hersteller" |
| „Alle Produkte" (Catalog-Link) | unter „Produkte" | **unter „Hersteller" als letztes Item** |

## Rollen-Klärung

| Element | Rolle |
|---|---|
| Ziegel finden (Top-Level) | **UX-Problemlöser** — unsichere Nutzer, direkter Finder-Einstieg |
| Hersteller (Top-Level) | **Tragende Marken-Achse** — Hub + 4 Brand-Collections + Catalog-Fallback |
| Anfrage (Top-Level) | 2-Funnel-Anfrage (Ziegel + Projekt) |
| Für Profis (Top-Level) | B2B-Landings |
| Ratgeber (Top-Level) | Content/Ressource |

## „Produkte"-Abfang

Direkter Produkte-Katalog (`/collections/all`) bleibt über **Hersteller > Alle Produkte** erreichbar. Keine dedizierte Top-Level-„Produkte"-Seite mehr, kein Verlust einer Zugangsroute.

## NAV-2-Polish (unverändert übernommen)

- Orange-Dot vor „Ziegel finden" bleibt — bestätigt sich weiterhin als UX-Akzent auf dem Problem-Löser-Einstieg. **Bewusst nicht** auf „Hersteller" verschoben.
- Ratgeber weiterhin softer (Weight 600)
- Mega-Menu-Breite 520 px, Meta-Link-Styling für „Alle Hersteller" (= `/pages/hersteller` Selfhref) weiterhin aktiv

## Sync-Befehl

```bash
cd ~/blechziegel-admin-tools
node set-menu.js
```

Schreibt die Struktur aus `menu.json` idempotent nach Shopify `main-menu`.

## Nicht verifizierbar

- SEO-Effekt der Top-Level-Umbenennung („Produkte" raus) auf bestehende Rankings → **„Ich kann das nicht bestätigen."**
- Ob „Alle Hersteller" + „Alle Produkte" als zwei ähnliche Meta-Links im Submenu Nutzer verwirren → **„Ich kann das nicht bestätigen"** ohne A/B-Test.
