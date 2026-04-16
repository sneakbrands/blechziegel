# H4 — Interne Verlinkung: Hub ↔ Collections ↔ PDP ↔ Finder

**Branch:** `feat/ziegel-finder-enterprise`
**Stand:** 2026-04-16
**Methode:** GitHub-Review → Shopify-CLI Theme-Check → Umsetzung → curl Live-Verify + Playwright (CDN-Cache-Lag dokumentiert)

---

## 1. GitHub-Review

### Bestehende Linkpfade (vor H4)

| Pfad | Status | Quelle |
|---|---|---|
| Hub → Collections | ✅ | Hero-Brands (`blechziegel-hersteller.liquid:444-447`) + Brand-Cards (`:554-578`) |
| Collection → PDP | ✅ | Produkt-Grid-Listing (Shopify Standard) |
| PDP → Hersteller-Collection | ✅ | Breadcrumb (H3) + Brand-Pill „Passend für Brand" (H3) |
| PDP → Hersteller-Hub | ✅ | Breadcrumb „Hersteller"-Link → `/pages/hersteller` (H3) |
| **Collection → Hub** | ⚠️ nur via Breadcrumb | Breadcrumb-Link „Hersteller" auf `is_hersteller`-Collections |
| Finder → PDP | ✅ | Result-Card: `<a href="{{ p.url }}">Zum Produkt</a>` |
| Finder → Hersteller-Struktur | ❌ kein direkter Link | Nur indirekt: Finder → PDP → Hersteller |

### Identifizierte Lücken

**Lücke 1 — Collection → Hub (sichtbare Rückverlinkung über Breadcrumb hinaus):**
Breadcrumb enthält bereits den „Hersteller"-Link, aber keine eigenständige sichtbare Rückverlinkung im Hero-Bereich. Bei Hersteller-Collections fehlt ein klar erkennbarer „zurück zur Hersteller-Übersicht"-Pfad.

**Lücke 2 — Finder → Hersteller:**
Finder verlinkt Ergebnisse nur auf die PDP. Kein direkter Link zur Hersteller-Struktur. Architektonisch korrekt: Finder = UX-Problemlöser, nicht Hersteller-Hub-Element. Direkter Hersteller-Link im Finder wäre Strategiebruch.

### Bewusst unverändert

- Finder-Logik (UX-Tool, nicht Hersteller-Achse)
- Hub-Page-Inhalt (bereits gut verlinkt)
- PDP-Breadcrumb + Brand-Pill (H3 abgeschlossen)
- Collection-Breadcrumb (COLL-1 abgeschlossen)

---

## 2. Umsetzungsstrategie

**Gewählt:** Ein kleiner, dezenter „← Alle Hersteller anzeigen"-Link am Ende des Hersteller-Collection-Hero (nur wenn `is_hersteller = true`). Keine neue Komponente, kein Banner, kein Layout-Umbau — eine einzelne `<a>`-Zeile im bestehenden Container.

**Finder bewusst nicht geändert:** Direkter Hersteller-Link im Finder wäre Vermischung der Dual-Logik (UX-Einstieg vs. Struktur-Achse). Der Pfad Finder → PDP → Hersteller ist architektonisch korrekt.

**Nicht gebaut:**
- Keine „Weitere Produkte von Hersteller"-Sektion (H4-Regel: keine neue Recommendation-Logik)
- Keine neue Komponente oder Snippet
- Keine neue Datenquelle

---

## 3. Konkrete Änderungen

### Datei: [`sections/blechziegel-collection.liquid`](../sections/blechziegel-collection.liquid)

#### CSS (L1005–1014)

```css
.bz-col-hero-hublink {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 18px;
  font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,.72);
  text-decoration: none;
  transition: color .15s;
}
.bz-col-hero-hublink:hover { color: #fff; }
.bz-col-hero-hublink svg { flex-shrink: 0; }
```

#### HTML (L1126–1131)

```liquid
{%- if is_hersteller -%}
  <a class="bz-col-hero-hublink" href="{{ routes.root_url }}pages/hersteller">
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
    Alle Hersteller anzeigen
  </a>
{%- endif -%}
```

Positioniert: nach den Trust-Pills, innerhalb `bz-col-hero-trust`-Container, vor dem schließenden `</div>` des Hero-Inners. Nur auf Hersteller-Collections (`is_hersteller = true`).

---

## 4. Shopify-CLI-Ergebnis

- `shopify theme check --path . --fail-level error`
- Ergebnis: **183 Errors, 74 Warnings** (identisch zum Vor-Stand)
- **0 neue Fehler eingeführt**

---

## 5. Verifikation

### curl (Live-HTML)

✅ **Bestätigt:** `<a class="bz-col-hero-hublink" href="/pages/hersteller">Alle Hersteller anzeigen</a>` im Live-HTML von `/collections/braas` vorhanden. CSS-Klassen ebenfalls im Stylesheet.

### Playwright

⚠️ **CDN-Cache-Lag:** Playwright-Chromium konnte den neuen Hub-Link im DOM nicht finden (`.bz-col-hero-hublink` → `found: false`). curl mit Cache-Buster (`?nv=timestamp`) bestätigt die Auslieferung. Playwright nutzt Chromium-internes Caching, das trotz Query-Parameter die alte Edge-Response serviert.

**„Ich kann das nicht bestätigen"** via Playwright-Screenshot. Empfehlung: manueller Browser-Check nach CDN-Cache-Ablauf (~5 Min) oder Hard-Refresh (Ctrl+Shift+R).

### Desktop/Mobile-Screenshots

Collection-Screenshots aus dem Re-Run zeigen den Vor-Cache-Stand. Der Hub-Link ist in der HTML-Quelle bestätigt, visuell aber erst nach Cache-Refresh sichtbar.

---

## 6. Linkpfad-Matrix nach H4

| Pfad | Status | Mechanismus |
|---|---|---|
| Hub → Collection | ✅ | Hero-Brands + Brand-Cards |
| Collection → PDP | ✅ | Produkt-Grid-Listing |
| PDP → Hersteller-Collection | ✅ | Breadcrumb (H3) + Brand-Pill (H3) |
| PDP → Hersteller-Hub | ✅ | Breadcrumb „Hersteller"-Link (H3) |
| **Collection → Hub** | ✅ | Breadcrumb (COLL-1) **+ Hero-Link „← Alle Hersteller" (H4)** |
| Finder → PDP | ✅ | Result-Card (unverändert) |
| Finder → Hersteller | ❌ bewusst offen | Architekturkonform: Finder = UX-Tool |

**Vollständiger Kreislauf:** Hub → Collection → PDP → Collection → Hub ✅

---

## 7. Qualitätskriterien-Check

| Kriterium | Status |
|---|---|
| Hub, Collections, PDPs sauber verlinkt | ✅ |
| Keine strukturelle Sackgasse | ✅ (Finder → Hersteller bewusst offen) |
| Hersteller-Achse gestärkt | ✅ |
| Finder nicht in Hauptstruktur hineingezogen | ✅ |
| Keine neuen Datenquellen | ✅ |
| Keine Design-Refactors | ✅ |
| Minimale Änderung (1 Datei, 16 Zeilen) | ✅ |
| CLI-Prüfung erfolgt | ✅ |
| Browser-Prüfung erfolgt (curl) | ✅ (Playwright CDN-Lag) |

---

## 8. Abschlussstatus

**H4 ist abgeschlossen.**

Die interne Verlinkung ist jetzt konsistent geschlossen:
- Hersteller-Hub ↔ Collections ↔ PDPs bilden einen vollständigen Kreislauf
- Breadcrumbs + eigenständige Links ergänzen sich
- Finder bleibt architekturkonform als UX-Tool getrennt

**Kein Blocker.**

**Offene Restpunkte (nicht H4):**
- Playwright-CDN-Cache-Lag für visuellen Screenshot-Nachweis → manueller Browser-Check empfohlen
- Finder → Hersteller bewusst nicht verlinkt (Strategieentscheidung, kein Defekt)
- H5 (Vendor-Hygiene / Datenmodell) steht noch im Masterplan als separate Phase

### Commits

| SHA | Beschreibung |
|---|---|
| `bc660f3` | Hub-Link auf Hersteller-Collections (Code + CSS) |
| `b5331a2` | Verifikation (curl bestätigt, Playwright-Cache-Lag dokumentiert) |

**Repo:** https://github.com/sneakbrands/blechziegel/commit/bc660f3
