# Navigation — Live Browser Test (Playwright)

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Methode:** Playwright (Chromium-Headless) gegen https://blechziegel.de/
**Test-Skript:** [`scripts/nav-test/nav.mjs`](../scripts/nav-test/nav.mjs)
**Screenshots:** [`scripts/nav-test/screenshots/`](../scripts/nav-test/screenshots/)

---

## 1. Methodik

- Chromium-Browser headless gegen Live-URL
- Cookie-Banner auto-akzeptiert
- Desktop: Viewport 1440×900 + zusätzliche Probe bei 1280×800
- Mobile: iPhone-13-Device-Emulation (390×844, Touch, DPR 3)
- Computed-Style-Probe für NAV-2-CSS-Selektoren
- Screenshots aller 5 Mega-Menus aufgeklappt + Mobile-Drawer geöffnet

**Live verifiziert** = Aus echtem Browser-Rendering belegt.
**Computed-Style verifiziert** = Aus Live-DOM/CSSOM extrahiert.

---

## 2. Desktop-Header (1440×900)

### Live verifiziert ✅

- **5 Top-Level-Items + Logo** passen in eine Reihe — **kein „Mehr"-Overflow-Button**
- Reihenfolge: Ziegel finden · Produkte · Anfrage · Für Profis · Ratgeber
- DE-Selector + Search + Account + Cart-Icon rechts korrekt
- Trust-Strip darüber: „Kostenloser Versand ab 100 € · Lieferzeit 1–3 Werktage · Trusted Shops 4,9 / 5" — **außerhalb Nav-Scope**, siehe Restpunkte
- Hover „Ratgeber": Orange-Underline + Orange-Color erscheinen sauber

### Bei 1280×800 ebenfalls

Auch hier alle 5 Items + Logo + Icons in einer Reihe, **kein Overflow**. NAV-2-Polish (Orange-Dot vor „Ziegel finden") deutlich sichtbar.

### Computed-Style-Probe

| Selector | Ergebnis | NAV-2-Erwartung | Status |
|---|---|---|---|
| `.menu-list__link[href$="/pages/ziegel-finder"] span color` | `rgb(10, 34, 64)` (Navy) | Navy | ✅ |
| `.menu-list__link[href$="/pages/ziegel-finder"] span weight` | `700` | 700 | ✅ |
| `.menu-list__link[href$="/pages/ziegel-finder"] span ::before content` | `""` | `""` | ✅ |
| `.menu-list__link[href$="/pages/ziegel-finder"] span ::before bg` | `rgb(255, 165, 0)` (Orange) | Orange | ✅ |
| `.menu-list__link[href$="/pages/ziegel-finder"] span ::before size` | `6×6 px` | 6×6 | ✅ |
| `.menu-list__link[href$="/pages/ratgeber"] span weight` | `600` | 600 | ✅ |

**Orange-Dot vor „Ziegel finden" ist live aktiv und korrekt gerendert.**
**Ratgeber-Soft-Style aktiv (Weight 600).**

---

## 3. Desktop-Mega-Menu

### Ziegel finden — live verifiziert ✅

Sichtbar im Screenshot `desktop-01-hover-Ziegel-finden.png`:
- Ziegel-Finder starten (Top, mit Orange-Bullet)
- Braas · Bramac · Creaton · Nelskamp
- Alle Hersteller (Top-Separator + softer Look)
- Mega-Menu-Breite 520 px reicht für alle 6 Items, Spacing wirkt ruhig

### Produkte — live verifiziert ✅

Horizon rendert das Mega-Menu hier mit **Featured-Product-Preview-Card** (PV-Dachziegel Frankfurter Pfanne mit Preis + Bild rechts neben den Links). Zusätzliches Plus, das nicht aus NAV-1/2 kommt — Horizon-Theme-Default für Collection-Parent-Menüs.

### Anfrage — live verifiziert ✅ (kritischer Test bestanden)

Sichtbar im Screenshot `desktop-03-hover-Anfrage.png`:
- **„Ziegel-Anfrage — Foto & Maße prüfen"** auf einer Zeile, bold, mit Orange-▸-Marker
- **„Projekt-Anfrage — B2B, Mengen, Sonderprofile"** sauber **auf 2 Zeilen umgebrochen** (kein Abschneiden, kein Quetschen)
- Beide Zeilen klar unterscheidbar dank Bold + Marker

**Genau die Stelle, die im Smoke-Test als unsicher markiert war, funktioniert live korrekt.**

### Für Profis — live verifiziert ✅

Sichtbar im Screenshot `desktop-04-hover-Für-Profis.png`:
- Gewerbe · Solar Installateure · Für Händler · Projekt-Anfrage
- Layout ruhig, kein Quetschen, alle 4 Items lesbar

### Ratgeber — live verifiziert ✅

Plain Top-Level-Link ohne Mega-Menu (kein Submenu im Menu-JSON). Hover zeigt Orange-Underline + Color-Wechsel. Korrekt.

---

## 4. Mobile-Drawer (iPhone 13)

### Live verifiziert — überraschend gutes Verhalten ✅

`mobile-10-drawer-open.png` zeigt:
- Hamburger öffnet Drawer von links
- **Alle Top-Level-Items + alle Submenus sind FLACH ausgeklappt sichtbar** — keine Accordion-Mechanik, kein Expand-Tap nötig
- „Ziegel finden" als aktives Item mit **Orange-Bullet + Orange-Hintergrund**
- „Ziegel-Finder starten" auch mit Orange-Bullet (NAV-2-Selektor `[href$="/pages/ziegel-finder"]` matcht beide — beabsichtigt)
- Hairline-Trennlinie zwischen „Alle Hersteller" und „Produkte" sichtbar (NAV-2-Polish)

### Tap-vs-Expand: KEIN PROBLEM ✅

Klick auf „Ziegel finden" im Drawer → **navigiert direkt** auf `/pages/ziegel-finder` (Screenshot `mobile-20-expand-Ziegel-finden.png` zeigt die Finder-Seite, nicht ein expandiertes Submenu). Die im Smoke-Test offene Frage „Tap = navigate vs. expand?" ist damit beantwortet: **navigate, immer**. Submenus sind dauerhaft sichtbar — keine Reibung möglich.

### Tap-Targets

Item-Reihenhöhe großzügig (visuell ~50 px), gute Lesbarkeit. Spacing zwischen Top-Level-Gruppen sauber.

---

## 5. Funnel-Wirkung — live verifiziert

| Nutzer-Intent | Pfad live geprüft | Status |
|---|---|---|
| „Ich weiß nicht, was passt" → Finder | Top-Bar „Ziegel finden" mit Orange-Dot, ein Klick | ✅ |
| „Foto prüfen" | Top-Bar „Anfrage" → Submenu „Ziegel-Anfrage — Foto & Maße prüfen" | ✅ |
| „Projekt / B2B / Sonderprofil" | Top-Bar „Anfrage" → „Projekt-Anfrage" **oder** „Für Profis" → „Projekt-Anfrage" | ✅ doppelt erreichbar |
| Direkter Kauf | Top-Bar „Produkte" → PV Dachziegel + Featured-Card | ✅ |
| Hersteller-Browsing | Top-Bar „Ziegel finden" → 4 Marken-Collections | ✅ |
| B2B-Differenzierung | Top-Bar „Für Profis" → Gewerbe/Solar/Händler | ✅ |

**Alle Conversion-Pfade live erreichbar in maximal 2 Klicks.**

---

## 6. Konsistenz zu Home / PDP / Finder / Anfrage

Verifiziert über Live-HTML + Style-Probe:
- Home Final-CTA-B2B → projekt-anfrage ✅
- PDP Project-Note → projekt-anfrage ✅
- Finder Empty-State → ziegel-anfrage ✅
- Menü-Trennung Anfrage/Projekt-Anfrage matcht Funnel-Architektur ✅
- Wording konsistent (gleiche Qualifier in Menü + Funnel-Hero) ✅

**Keine Brüche zwischen Menü und Seiten.**

---

## 7. Restprobleme

### P1 — keine

### P2 — außerhalb Nav-Scope, aber im Live-Screenshot sichtbar

1. **Trust-Strip oben „Trusted Shops 4,9 / 5"** — unverifizierter Claim, war im Home-Cleanup im Body schon entfernt, lebt aber noch im global gerenderten Trust-Strip. Außerhalb Nav-Scope, sollte aber separat adressiert werden.
2. **Mobile Logo-Subtext „MADE IN GERMANY"** — direkt unter dem Logo sichtbar im Mobile-Header. Widerspricht der „in Deutschland gelasert"-Linie. Außerhalb Nav-Scope.

### P3 — Nice-to-have

3. **Orange-Bullet auch auf Submenu-Item „Ziegel-Finder starten"** im Drawer (gleicher href). Nicht störend, eher konsistent — wenn er nur am Parent gewünscht ist, müsste der Selektor auf `:not([class*="menu-drawer__menu-item--childlist"])` o. ä. eingegrenzt werden. Aktuell beide Stellen markiert.

---

## 8. Antworten auf die 7 Schlüsselfragen

1. **Live wirklich gut?** Ja — alle NAV-1/NAV-2-Ziele live verifiziert, keine harten Probleme.
2. **„Mehr"-Overflow-Problem?** **Nein.** Bei 1440 und 1280 alle 5 Top-Level + Logo + Icons in einer Reihe.
3. **Mobile-Tap-vs-Expand sauber?** **Ja, sehr sauber.** Drawer zeigt alles flach, Tap navigiert immer direkt — keine Confusion möglich.
4. **Anfragepfade klar verständlich?** **Ja.** Beide Mega-Menu-Einträge bold, mit Orange-Marker, qualifiziert beschriftet, sauber 2-zeilig umgebrochen wenn nötig.
5. **Was funktioniert am besten?** (a) Mega-Menu „Anfrage" mit klarer 2-Funnel-Trennung, (b) Mobile-Drawer flach + tap-direct, (c) Orange-Dot auf „Ziegel finden" als ruhiger Premium-Marker.
6. **Restprobleme?** Innerhalb Nav: keine. Außerhalb Nav: Trust-Strip-„Trusted-Shops" + Logo-Subtext „Made in Germany".
7. **NAV-3 nötig?** **Nein.** Navigation ist live fertig. Die zwei Restpunkte sind globaler Header-/Logo-Scope, kein Menü-Problem.

---

## 9. Fazit

**Navigation ist live fertig.**

- Alle NAV-1- + NAV-2-Änderungen sind live wirksam und durch Browser-Rendering belegt
- 5 Top-Level-Items klar priorisiert
- 2-Funnel-Anfrage-Architektur sichtbar
- B2B-Pfade unter „Für Profis" gebündelt
- Mobile-Drawer überraschend stark (flach + tap-direct)
- Computed-Style-Probe bestätigt: Orange-Dot, Bold-Markierung, Ratgeber-Soft-Style — alles aktiv

**Empfehlung:** Kein NAV-3. Die 2 außerhalb-Nav-Findings (Trust-Strip + Logo-Subtext) als eigenes kleines Cleanup adressieren, falls gewünscht.

**Re-Run-Anweisung:** `cd scripts/nav-test && node nav.mjs` reproduziert alle Screenshots.
