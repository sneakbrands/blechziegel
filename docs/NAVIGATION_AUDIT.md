# Audit — Navigation / Header / Mobile Drawer

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Referenz:** Home · PDP · Finder · Ziegel-Anfrage · Projekt-Anfrage (alle auf Enterprise-Niveau)

---

## 1. Technische Ist-Analyse

### Beteiligte Dateien

| Datei | Zweck |
|---|---|
| [`layout/theme.liquid`](../layout/theme.liquid) | rendert Header-Gruppe |
| [`sections/header.liquid`](../sections/header.liquid) | Header-Layout, Menu-Rendering |
| [`blocks/_header-menu.liquid`](../blocks/_header-menu.liquid) | Desktop-Mega-Menu + Mobile-Drawer-Varianten |
| [`snippets/bz-nav-premium.liquid`](../snippets/bz-nav-premium.liquid) | **Custom-Styling** (Navy/Orange, Montserrat, Hover, Drawer-Accordion) |
| [`snippets/header-drawer.liquid`](../snippets/header-drawer.liquid) | Mobile-Drawer-Details + Accordion |
| [`snippets/mega-menu-list.liquid`](../snippets/mega-menu-list.liquid) | Mega-Menu-Grid |
| [`snippets/overflow-list.liquid`](../snippets/overflow-list.liquid) | „More"-Button bei Platzmangel |
| `~/blechziegel-admin-tools/menu.json` | **deklarative Menü-Quelle** (8 Top-Level-Items) |
| `~/blechziegel-admin-tools/set-menu.js` | synct via GraphQL nach Shopify |

### Rendering-Flow

```
theme.liquid → sections/header.liquid → blocks/_header-menu.liquid (3 Varianten: desktop/mobile/navigation_bar)
  → snippets/bz-nav-premium.liquid (CI-Override)
  → snippets/mega-menu-list.liquid (Desktop-Grid)
  → snippets/header-drawer.liquid (Mobile-Accordion)
```

**Mechanik:** Desktop-Hover mit Orange-Underline + Mega-Menu-Card (460 px), Mobile `<details>`-Akkordeon mit Back-Navigation, 44-px-Hit-Areas.

---

## 2. Aktuelle Menüstruktur

```
Hauptmenü (menu.json)
├─ Startseite                              [FRONTPAGE]
├─ Hersteller ▼                            [PAGE: hersteller]
│  ├─ Braas                                [COLLECTION]
│  ├─ Bramac                               [COLLECTION]
│  ├─ Creaton                              [COLLECTION]
│  ├─ Nelskamp                             [COLLECTION]
│  └─ Alle Hersteller                      [PAGE: hersteller]   ← redundant zum Parent
├─ PV Dachziegel kaufen                    [COLLECTION: pv-dachziegel]
├─ Ziegel Finder                           [PAGE: ziegel-finder]
├─ Ratgeber                                [PAGE: ratgeber]     ← Orphan ohne Sub-Content
├─ Ziegel anfragen                         [PAGE: ziegel-anfrage]
├─ Für Händler                             [PAGE: haendler]
└─ Kontakt                                 [PAGE: contact]      ← alter Kontakt-Handle
```

**Nicht im Menü (obwohl relevant):**
- `/pages/projekt-anfrage` (neuer B2B-Funnel, seit ANF-ARCH-1) ❌
- `/pages/gewerbe` (B2B-Landing) ❌
- `/pages/solar-installateure` (B2B-Landing) ❌

---

## 3. Informationsarchitektur-Audit

**Stärken:**
- Kundensprache (kein Fachjargon)
- Top-Level klar in Kategorien: Hersteller · Produkt · Tool · Info · Anfrage · B2B · Kontakt
- Finder + Anfrage prominent sichtbar

**Schwächen:**
1. **Redundanz** „Hersteller" + Submenü „Alle Hersteller" → gleiches Ziel
2. **Orphan** „Ratgeber" auf Top-Level, aber ohne Sub-Navigation / Blog-Archiv
3. **Kannibalisierung** „Kontakt" vs. „Ziegel anfragen" — unklar, wofür welcher Pfad
4. **Fehlen** Projekt-Anfrage, Gewerbe, Solar-Installateure

---

## 4. Desktop-Mega-Menu-Audit

- **Stärken:** Navy/Orange-CI konsistent, Hover-Underline smooth, Focus-Outline erkennbar, Arrow-Pointer dezent.
- **Schwäche 1:** Mega-Menu `max-width: 460px` ([bz-nav-premium.liquid:86](../snippets/bz-nav-premium.liquid#L86)) ist knapp für 5 Submenu-Items. Sollte 520–600 px.
- **Schwäche 2:** Top-Level-Items alle gleich gewichtet — keine visuelle Priorisierung zwischen „Finder" (Tool) und „Kontakt" (Info).
- **Schwäche 3:** Overflow-Menu („More"-Button) erzeugt Extra-Klick bei schmalen Desktops.

---

## 5. Mobile-Drawer-Audit

- **Stärken:** Hamburger 44×44 px, Accordion-Expand für Parent-Items, Back-Nav mit Kontext-Titel, Active-State mit Orange-Border-Left, Backdrop mit Blur.
- **Schwäche 1:** Drawer kann bei kleinen Screens (iPhone SE) über Viewport laufen. Scroll vorhanden, Verhalten auf iOS **Ich kann das nicht bestätigen**.
- **Schwäche 2:** Featured-Content-Block im Drawer-Code vorhanden ([bz-nav-premium.liquid:471–494](../snippets/bz-nav-premium.liquid#L471-L494)), wird aber nie gerendert (menu.json liefert keine Featured-Items).
- **Schwäche 3:** Nur 3 Ebenen möglich — bei Expansion zu B2B-Submenü könnte das eng werden.

---

## 6. Conversion-/CTA-Audit

| Pfad | Menü-Support |
|---|---|
| Hersteller-Browsing | ✅ stark (Submenu + Top-Level) |
| PV-Collection | ✅ direkter L1-Link |
| Ziegel Finder | ✅ prominent als L1 |
| Ziegel-Anfrage | ✅ prominent als L1 |
| **Projekt-Anfrage (B2B)** | ❌ **nicht im Menü** |
| **Gewerbe (B2B)** | ❌ **nicht im Menü** |
| **Solar-Installateure (B2B)** | ❌ **nicht im Menü** |
| Händler | ✅ im Menü |
| Blog/Content | ⚠️ Ratgeber als L1, aber ohne Inhalte |
| Kontakt | ✅ L1 |

**Kernproblem:** Die gesamte 2-Seiten-Anfrage-Architektur (Ziegel-Anfrage + Projekt-Anfrage) ist **nur zur Hälfte navigierbar**. B2B-Nutzer landen zwangsläufig auf `ziegel-anfrage`, auch wenn `projekt-anfrage` für sie gebaut ist.

---

## 7. Accessibility-/Bedien-Audit

**Stärken:**
- Semantisches `<nav>` + `<ul role="list">` + `<details><summary>`
- `aria-label`, `aria-haspopup`, `aria-expanded`, `aria-current="page"` vorhanden
- Focus-Outline 2 px Orange, `focus-inset`-Klasse konsistent
- Farbkontrast Navy/Weiß: ~13:1 (AAA), Orange/Navy: ~5.8:1 (AAA)

**Beobachtungen:**
- Orange (#ffa500) auf weißem Hintergrund: ~4.2:1 (nur AA, grenzwertig für Fließtext)
- Scroll-Lock-Verhalten im Drawer: **Ich kann das nicht bestätigen** ohne Live-Test

---

## 8. SEO-/Interlinking-Audit

**Gut verlinkt:**
- Hersteller-Landing + 4 Top-Collections
- PV-Dachziegel-Collection
- Finder + Ziegel-Anfrage

**Nicht verlinkt (SEO-Verlust):**
- Projekt-Anfrage — neue URL bekommt keinen internen Link-Equity
- Gewerbe — B2B-Landing bleibt SEO-stumm
- Solar-Installateure — separate Landing existiert ([snippets/blechziegel-solar-installateure.liquid](../snippets/blechziegel-solar-installateure.liquid)), aber unsichtbar

**Footer:** prüfen, ob fehlende Pfade dort zumindest verlinkt sind — **Ich kann das nicht bestätigen** ohne Footer-Audit.

---

## 9. Antworten auf die 10 Schlüsselfragen

1. **Schön oder strategisch-stark?** Visuell top, strategisch lückenhaft — die 2-Funnel-Anfrage-Architektur ist im Menü nur halb umgesetzt.
2. **Top-Level verständlich?** Größtenteils ja. „Ratgeber" orphan, „Kontakt" vs. „Ziegel anfragen" unklar abgegrenzt.
3. **3 größte strukturelle Schwächen:** (a) Projekt-Anfrage fehlt, (b) Gewerbe/Solar-Installateure fehlen, (c) „Alle Hersteller"-Redundanz + „Ratgeber" orphan.
4. **3 größte UX-Stärken:** (a) Mega-Menu-CI/Hover sauber, (b) Mobile-Accordion mit Back-Nav, (c) Finder + Ziegel-Anfrage prominent.
5. **Sales-Path?** ~70 % — Retail-Pfade stark, B2B-Pfade blind.
6. **Finder + 2 Funnels?** Finder ✓, Ziegel-Anfrage ✓, Projekt-Anfrage ✗.
7. **Mobile wirklich gut?** Ja, technisch solide. Stresstests auf kleinen Screens **Ich kann das nicht bestätigen**.
8. **Zu viel Platz?** „Alle Hersteller" (redundant), „Kontakt" (überlappt mit Anfrage).
9. **Fehlende Ziele?** Projekt-Anfrage, Gewerbe, Solar-Installateure, ggf. Blog-Sub.
10. **P1/P2/P3:** siehe unten.

---

## 10. Priorisierte Schwächen

### P1 — jetzt

1. **Projekt-Anfrage in Menü aufnehmen** ([menu.json]) — größter strategischer Defekt, sofort beheben.
2. **Gewerbe** (+ ggf. Solar-Installateure) als B2B-Pfad sichtbar machen.
3. **„Alle Hersteller"** → „Alle anzeigen" oder entfernen (Redundanz raus).

### P2 — Feinschliff

4. **Anfrage-Bündelung:** „Ziegel anfragen" + „Projekt-Anfrage" unter Submenu „Anfragen" zusammenfassen oder visuell nebeneinander setzen.
5. **„Kontakt" vs. „Ziegel anfragen"** klären: „Kontakt" ggf. in Footer, oder als Sub-Item unter „Anfragen".
6. **Mega-Menu-Breite** von 460 → 520 px erhöhen, damit Submenu-Items atmen.
7. **Ratgeber-Architektur** entscheiden: Blog ausbauen, in „Ressourcen" umbenennen, oder Footer-only.

### P3 — später

8. **Featured-Content-Block im Drawer** aktivieren (existierendes CSS, fehlende Daten).
9. **B2B-Sektion** als eigenes Submenu („Für Profis" → Gewerbe · Händler · Solar-Installateure · Projekt-Anfrage).
10. **Visuelle Priorisierung** im Top-Level (Finder könnte dezent Orange-Pill bekommen).

---

## 11. Empfohlene Soll-Struktur

```json
{
  "Hauptmenü": [
    "Startseite",
    {
      "Hersteller": [
        "Braas", "Bramac", "Creaton", "Nelskamp", "Alle anzeigen"
      ]
    },
    "PV Dachziegel kaufen",
    "Ziegel Finder",
    {
      "Anfragen": [
        "Ziegel-Anfrage (Foto-Prüfung)",
        "Projekt-Anfrage (B2B, Mengen, Sonderprofile)"
      ]
    },
    {
      "Für Profis": [
        "Gewerbe",
        "Solar-Installateure",
        "Für Händler"
      ]
    },
    "Ratgeber",
    "Kontakt"
  ]
}
```

**Effekte:**
- Projekt-Anfrage sichtbar
- B2B-Pfade gebündelt (statt verstreut / versteckt)
- Top-Level bleibt ≤ 8 Einträge (scanbar)
- Anfragen-Architektur wird endlich im Menü widergespiegelt

---

## 12. Umsetzungsplan

### Phase NAV-1 — Menü-Struktur (klein, via admin tool)

- `menu.json` erweitern: Projekt-Anfrage, Gewerbe, Solar-Installateure aufnehmen
- „Alle Hersteller" umbenennen
- ggf. Anfragen + B2B-Submenus einführen
- `node set-menu.js` ausführen, Shopify-Admin verifizieren

**Commit:** `feat(nav): add b2b paths and bundle inquiry routes`

### Phase NAV-2 — Styling-Polish (klein, Theme-Code)

- Mega-Menu-Breite 520 px
- ggf. Finder-Item als dezentes Orange-Highlight
- Ratgeber-Entscheidung umsetzen (Submenu, Rename oder Entfernen)

**Commit:** `refine(nav): widen mega-menu and sharpen visual priority`

### Phase NAV-3 — optional

- Featured-Content im Drawer aktivieren (eigenes Daten-Feld in menu.json)
- Accessibility-Tests auf echten Mobile-Geräten

---

## Gesamturteil

**Die Navigation ist visuell exzellent (Custom-CI, saubere Mechanik, gute A11y-Basis), aber strategisch lückenhaft.** Die gesamte B2B-Ebene + die neue Projekt-Anfrage sind unsichtbar. Das ist der größte ungelöste Hebel nach den Funnel-Upgrades.

**Empfehlung:** Phase NAV-1 (Menü-Struktur-Update via `set-menu.js`) ist ein **kleiner Admin-Eingriff mit hoher Wirkung** — klarer P1.

**Nicht verifizierbar:**
- Echte Live-Drawer-Performance auf iOS Safari → **„Ich kann das nicht bestätigen."**
- Ob Footer die fehlenden Pfade abfängt → **„Ich kann das nicht bestätigen."** (Footer nicht im Scope).
- Reale Conversion-Differenz B2B-Pfade mit/ohne Menü-Sichtbarkeit → **„Ich kann das nicht bestätigen."**
