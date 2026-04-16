# Navigation — Live-Browser-Test: Methodik-Grenze

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Status:** transparenter Nachtrag zu [`NAV_SMOKE_TEST.md`](./NAV_SMOKE_TEST.md)

---

## 1. Worum geht es

Der Auftrag war: **echter Live-Browser-Smoke-Test** der Navigation nach NAV-1 + NAV-2 — inkl. Mega-Menu-Aufklappen, Mobile-Drawer-Tap, Hover-Verhalten.

## 2. Methodik-Grenze

In der aktuellen Claude-Code-Session stehen **keine Browser-Tools** zur Verfügung:

- kein Playwright
- kein Puppeteer
- kein Browser-MCP-Server
- keine Chrome-Extension
- kein Screenshot-Werkzeug

Verfügbar sind nur: `Bash`/`curl`, Read/Edit/Write, Grep/Glob, Agent (mit identischem Tool-Set), ScheduleWakeup, Skill, ToolSearch.

Ein Tool-Suchlauf (`+browser chrome playwright puppeteer screenshot click`) lieferte nur Google-Drive-Auth-Tools — **kein Browser-Werkzeug ist in dieser Session registriert**.

## 3. Was damit geprüft werden konnte

Via `curl` + HTML-Parsing (siehe [NAV_SMOKE_TEST.md](./NAV_SMOKE_TEST.md)):

- ✅ Top-Level-Struktur live: 5 Items + „Mehr"-Overflow-Button im HTML
- ✅ Alle 14 Submenu-Items im DOM vorhanden
- ✅ Anfrage-Qualifier („— Foto & Maße prüfen" / „— B2B, Mengen, Sonderprofile") im HTML
- ✅ NAV-2-CSS-Selektoren (`max-width: 520px`, `[href$="/pages/ziegel-finder"]`-Polish) im ausgelieferten Stylesheet
- ✅ A11y-Attribute (`aria-haspopup`, `aria-expanded`, `aria-haspopup="dialog"` für Drawer)

## 4. Was damit nicht geprüft werden konnte

- Mega-Menu-Aufklapp-Animation, Hover-Delay, Focus-Flow
- Mobile-Drawer-Öffnen, Backdrop-Blur, Scroll-Lock
- Tap-Target-Verhalten auf Touch (Parent navigiert vs. expandiert)
- Visuelle Wirkung von Orange-Dot, Hairline-Trennern, Wrap-Verhalten langer Labels
- Overflow-Triggering-Schwelle auf realer Desktop-Auflösung
- Mobile-Render auf iPhone SE / kleinem Android
- Farbkontrast im tatsächlichen Rendering
- Lighthouse-Score

## 5. Wege, wie der Test echt erfolgen kann

| Option | Aufwand | Ergebnis |
|---|---|---|
| **Nutzer testet selbst** | 5–10 min | Subjektive Bewertung, Screenshots als Input für Fix-Plan |
| **Playwright lokal** (`npm i -D playwright && npx playwright install chromium`) + Script | 15–30 min | Automatisierte Screenshots, DOM-Assertions, CI-fähig |
| **Browser-MCP-Server** (z. B. `@playwright/mcp`) in Claude-Code-Config | einmalig einrichten | Zukünftige Sessions haben echte Browser-Tools |

## 6. Konkrete Browser-Checks, die jetzt nur manuell gehen

1. **Desktop 1440×900** — erscheint der „Mehr"-Overflow-Button?
2. **DevTools Mobile 375×667** — tippt man „Ziegel finden": expandiert oder navigiert es?
3. **Mega-Menu „Anfrage"** — sind „Ziegel-Anfrage — Foto & Maße prüfen" + „Projekt-Anfrage — B2B, Mengen, Sonderprofile" sauber lesbar, oder umbrechen/abgeschnitten?
4. **Mobile-Drawer-Scroll** — passen alle 5 Top-Level + Submenus ohne Clipping?
5. **Orange-Dot vor „Ziegel finden"** — wirkt er wie Premium-Marker oder wie Notification-Badge?

## 7. Empfehlung

**Kein blinder NAV-3-Umbau.**
Ergebnisse der manuellen Checks abwarten. Bei 0 Problemen → fertig. Bei 1–2 Problemen → gezielter NAV-3-Mini-Fix (Overflow-Schwelle bzw. Mobile-Parent-Link-Handling).

## 8. Ehrliche Zusammenfassung

Was ich geliefert habe: **strukturelle + HTML-Source-Verifikation + Code-Ableitung**.
Was ich **nicht** geliefert habe: **interaktive Browser-Verifikation**.

Jede Behauptung über visuelle Wirkung, Touch-Verhalten oder Animations-Qualität in der aktuellen Session wäre **ungedeckt** — daher hier explizit ausgewiesen als **„Ich kann das nicht bestätigen."**
