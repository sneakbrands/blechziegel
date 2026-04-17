# Navigation — Live Smoke Test (NAV-1 + NAV-2)

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Stand Live-Build:** Commit `714bda0` (NAV-2 deployed)
**Test-Methode:** `curl` gegen https://blechziegel.de/ + Source-Parsing. **Kein Browser/Touch-Test möglich** — keine Chrome-Extension verfügbar in dieser Session.

---

## 1. Smoke-Test-Ergebnis

### Live verifiziert (curl + HTML-Parsing)

✅ **Top-Level-Struktur live korrekt:** 5 Items + Overflow-Button
```
Ziegel finden · Produkte · Anfrage · Für Profis · Ratgeber [Mehr]
```

✅ **Mega-Menu-Items live korrekt** (14 Sub-Items extrahiert):
- Ziegel finden → Ziegel-Finder starten · Braas · Bramac · Creaton · Nelskamp · Alle Hersteller
- Produkte → PV Dachziegel · Alle Produkte
- Anfrage → **Ziegel-Anfrage — Foto & Maße prüfen** · **Projekt-Anfrage — B2B, Mengen, Sonderprofile**
- Für Profis → Gewerbe · Solar-Installateure · Für Händler · Projekt-Anfrage

✅ **NAV-2-CSS live ausgeliefert:** 6 Treffer auf unsere href-Attribut-Selektoren (`max-width: 520px`, `[href$="/pages/ziegel-finder"]`-Polish, etc.)

✅ **A11y-Attribute live:** `aria-haspopup="true"` (4×), `aria-expanded` (true/false-Toggle), `aria-haspopup="dialog"` für Drawer

⚠️ **Overflow-Button „Mehr" wird gerendert** (2 Vorkommen im HTML). Das deutet darauf hin, dass die responsive Overflow-Logik triggert — auf der curl-Antwort ohne Viewport-Hint. Ob das auf echtem Desktop ≥1280 px auch passiert: **Ich kann das nicht bestätigen** ohne Browser-Test.

### Nur aus Code abgeleitet

- Hover-Animationen (Underline-Scale, Mega-Menu-Fade-In, Caret-Rotation)
- Drawer-Open/Close-Verhalten (`<details>` + `scroll-lock`)
- Mobile-Touch-Tap-vs.-Expand-Verhalten
- Mega-Menu-Aufklapp-Trigger (Hover-Delay, Focus-Verhalten)

### Nicht sicher verifiziert

- Echte Mega-Menu-Breite mit 6 Sub-Items → optisch ausreichend?
- Mobile-Drawer-Render auf iPhone SE / Android 360 px
- Tap-Target-Trennung: Parent-Link-Navigation vs. Submenu-Expand
- Optische Wirkung des Orange-Dot-Markers neben „Ziegel finden"
- Hairline-Trennlinie zwischen Top-Level-Parents im Drawer

---

## 2. Desktop-Header

**Live-Befund:**
- 5 Top-Level-Punkte korrekt rendern
- Reihenfolge: Ziegel finden → Produkte → Anfrage → Für Profis → Ratgeber ✓
- Overflow-„Mehr"-Button wird beim curl-Fetch eingefügt → kann darauf hindeuten, dass der Theme-Layout-Algorithmus die 5 Items + Logo + Cart bei schmalem Mess-Container nicht alle in eine Zeile bekommt
- NAV-2-CSS-Polish-Selektoren werden ausgeliefert

**Code-Bewertung:**
- „Ziegel finden" hat den Orange-Dot-Marker-Code → optisch sollte er hervorstechen
- „Ratgeber" hat den Soft-Color-Code (72 % Navy)
- Aktiv- und Hover-States definiert

**Nicht verifiziert:** Visueller Eindruck im Vergleich, Hover-Smoothness, ob „Mehr" auf Standard-Desktop-Auflösung (1440 px) auftritt oder nur beim curl ohne Viewport.

---

## 3. Desktop-Mega-Menu

**Live-Befund:**
- Alle Submenu-Items vorhanden, Reihenfolge stimmt
- „Anfrage" → beide Ziele mit Qualifier-Suffix („— Foto & Maße prüfen" / „— B2B, Mengen, Sonderprofile") ✓ Live im HTML
- „Für Profis" → 4 Items inkl. Projekt-Anfrage als Cross-Link ✓
- „Alle Hersteller" als 6. Item im Ziegel-finden-Submenu ✓ — bekommt per CSS Top-Separator + reduziertes Gewicht

**Code-Bewertung:**
- Mega-Menu-Container `max-width: 520px` (NAV-2 erhöht von 460) → mit 6 Items im längsten Submenu sollte es reichen
- Primär-Einträge (Finder, Ziegel-Anfrage, Projekt-Anfrage) bold + Orange-▸-Marker
- „Ziegel-Anfrage — Foto & Maße prüfen" + langes „Projekt-Anfrage — B2B, Mengen, Sonderprofile" durften per `white-space: normal` umbrechen — sollte 2-zeilig wirken statt abgeschnitten

**Nicht verifiziert:**
- Tatsächliche Wrap-Aussehen der Anfrage-Qualifier
- Ob die Hairline + Soft-Style auf „Alle Hersteller" optisch als Meta-Abschluss wirkt oder als Bug

---

## 4. Mobile-Drawer

**Live-Befund:**
- Im curl-HTML Drawer-Markup vorhanden (CSS-Selektoren `.menu-drawer__menu-item` aktiv)
- A11y: `aria-haspopup="dialog"` (3×) für Drawer-Trigger

**Code-Bewertung:**
- Mobile nutzt **dieselbe 5-Top-Level-Struktur** wie Desktop (Theme-Architektur erzwingt parallele Ordnung)
- NAV-2 fügt im `@media (max-width: 749px)`-Block hinzu:
  - Orange-Dot vor „Ziegel finden"-Eintrag
  - Soft-Color für „Ratgeber"
  - Hairline-Separator zwischen Top-Level-Parents
- Tap-Targets im bestehenden `bz-nav-premium.liquid` mit 44 px Min-Höhe definiert

**Restrisiken (Code-only, nicht live geprüft):**
- Ob Tap auf Top-Level-Parent direkt navigiert oder nur expand-iert: **„Ich kann das nicht bestätigen"** — Horizon-Default verhält sich theme-/version-spezifisch
- Ob Drawer auf iPhone SE-Höhe (568 px) scrollt oder Items abschneidet
- Ob die zweizeiligen Anfrage-Qualifier im Drawer hineinpassen oder umbrechen

---

## 5. Funnel-Wirkung

**Aus Live-HTML rekonstruierbar:**

| Nutzer-Frage | Pfad im Live-Header | Verifiziert |
|---|---|---|
| „Welcher Ziegel passt?" | Ziegel finden → Ziegel-Finder starten | ✅ live im HTML |
| „Hersteller suchen" | Ziegel finden → 4 Marken-Collections | ✅ live im HTML |
| „Direkt kaufen" | Produkte → PV Dachziegel | ✅ live im HTML |
| „Foto prüfen lassen" | Anfrage → Ziegel-Anfrage | ✅ live im HTML |
| „Projekt / Sonderprofil" | Anfrage → Projekt-Anfrage **und** Für Profis → Projekt-Anfrage | ✅ live im HTML, beide Pfade verfügbar |
| „Dachdecker / PV-Betrieb" | Für Profis → Gewerbe | ✅ live im HTML |
| „Solarbetrieb" | Für Profis → Solar-Installateure | ✅ live im HTML |
| „Baustoffhandel" | Für Profis → Für Händler | ✅ live im HTML |

**Funnel-Architektur ist live wirklich abgebildet** — kein Pfad fehlt mehr.

---

## 6. Konsistenz zu Home / PDP / Finder / Anfrage

- Home Final-CTA-B2B-Card → `/pages/projekt-anfrage` ✅ matcht Menü-Eintrag „Anfrage → Projekt-Anfrage"
- Home Hero-Sek-CTA → `/pages/ziegel-anfrage` ✅ matcht Menü-Eintrag „Anfrage → Ziegel-Anfrage"
- PDP Service-Path „Variante unsicher?" → ziegel-anfrage ✅ matcht
- PDP Service-Path „Projekt oder Sonderprofil?" → projekt-anfrage ✅ matcht
- Finder Empty-State → ziegel-anfrage ✅ matcht
- Finder selbst ist über Menü → Ziegel finden direkt erreichbar ✅
- Beratungs-/Anfrage-Pfad-Trennung im Menü ist **konsistent** zur 2-Funnel-Architektur

**Keine Brüche** zwischen Menü und Seitenstrategie nachweisbar im Code-/Live-Abgleich.

---

## 7. Restprobleme

### P1 — keiner kritisch

**Strukturell ist die Navigation live in dem Zustand, der im Plan stand.** Keine harten Live-Bugs aus dem HTML ableitbar.

### P2 — wahrscheinlich, aber nicht verifiziert

1. **Overflow-„Mehr"-Button erscheint im curl-Fetch.** Wenn das auf echtem 1440-px-Desktop auch passiert, sollten die Top-Level-Punkte enger gesetzt werden (kleinerer Padding, kürzere Labels) oder das Logo schmaler. **Ich kann das nicht bestätigen** ohne Browser-Test.
2. **Mobile Tap-vs.-Expand-Trennung.** Horizon-Default-Verhalten: oft expandiert Tap auf Parent-Reihe das Submenu, der Parent-Link selbst ist nur per separatem Link-Bereich erreichbar. Wenn das hier so ist, kommt der Nutzer auf Mobile **nicht direkt** auf die Flaggschiff-Seite des Parents (z. B. `/pages/ziegel-finder`) ohne erst zu expandieren und dann das erste Submenu-Item „Ziegel-Finder starten" zu tippen. **Das wäre eine Reibung.** Verifizierung erforderlich.
3. **Anfrage-Qualifier-Lesbarkeit.** „— B2B, Mengen, Sonderprofile" ist eine lange Phrase. Auf Mega-Menu-Breite 520 px sollte sie auf 1–2 Zeilen passen. Auf Mobile-Drawer-Breite (~280–320 px) eher 2–3 Zeilen. Optisch eventuell unruhig. Nicht verifiziert.

### P3 — Polish-Backlog

4. Visueller Top-Level-Gewichtsunterschied: ist der Orange-Dot vor „Ziegel finden" subtil genug, oder sieht es nach „Notification-Badge" aus? Nicht verifiziert.
5. „Mehr"-Button-Inhalt: Was landet darin, wenn die Overflow-Logik triggert? Eventuell wertvolle Items wie „Anfrage" oder „Für Profis" — kritisch, weil die hinter einem zusätzlichen Klick verschwinden würden.

---

## 8. Antworten auf die 8 Schlüsselfragen

1. **Strategisch klar?** Code-/HTML-seitig **ja**. Live-visuell kann ich es nicht bestätigen.
2. **„Ziegel finden" stärkster Einstieg?** Strukturell ja (Position 1, Orange-Dot-Polish in CSS aktiv). Optisch live: **„Ich kann das nicht bestätigen."**
3. **Anfragepfade klar verständlich?** Im HTML stehen beide mit Qualifier-Suffix sichtbar. Lesbarkeit auf engem Screen: nicht verifiziert.
4. **Mobile gut genug?** Strukturell ja, **funktional nicht verifizierbar** ohne Touch-Test.
5. **Visuelle/strukturelle Reibung?** Möglicherweise: Overflow-„Mehr"-Button + Mobile-Tap-Verhalten — beides nicht verifiziert.
6. **Was funktioniert am besten (im Code/HTML belegbar)?** (a) 2-Funnel-Architektur ist im Menü vollständig sichtbar, (b) B2B-Pfade gebündelt + redundant verlinkt, (c) Projekt-Anfrage doppelt zugänglich (Anfrage + Für Profis).
7. **Restprobleme?** (a) Overflow-Verhalten unklar, (b) Mobile-Tap-Trennung unklar, (c) Mega-Menu-Wrap-Optik bei 6-Item-Submenus unklar.
8. **Fertig oder NAV-3?** **Vermutlich fertig**, sofern echte Browser-Verifikation keine harten Bugs zeigt. Eine **NAV-3 Mini-Runde** ist nur sinnvoll, wenn der Live-Test (a) Overflow auf Standard-Desktop oder (b) Mobile-Tap-Reibung bestätigt.

---

## 9. Fazit

**Strukturell + im HTML-Output: live korrekt deployed.** Alle NAV-1- und NAV-2-Änderungen sind im ausgelieferten DOM angekommen.

**Visuell + interaktiv: nicht final verifizierbar in dieser Session.** Browser/Touch-Tests fehlen.

**Empfehlung:**
- **Kein blinder NAV-3-Umbau jetzt.**
- **Mache einen echten Live-Check im Browser** (Desktop ≥1440, iPhone-Width-Simulation, oder echtes Gerät) und prüfe genau diese 3 Punkte:
  1. Erscheint „Mehr"-Overflow auf 1440×900?
  2. Auf Mobile: Tippt man auf „Ziegel finden" → öffnet sich Submenu **oder** navigiert direkt?
  3. Sind die Anfrage-Qualifier („— Foto & Maße prüfen" / „— B2B, Mengen, Sonderprofile") sauber lesbar?

Wenn alle drei OK → **fertig**. Wenn 1 oder 2 Probleme zeigen → **NAV-3 Mini-Fix** mit gezieltem Eingriff (Overflow-Schwelle, Mobile-Parent-Link-Klick-Handling).

**Status:** **strukturell verbessert, visuell wahrscheinlich rund — finale Bestätigung braucht echten Browser-Test.**
