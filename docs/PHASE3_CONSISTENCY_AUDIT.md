# Homepage Consistency & Polish Audit

**Branch:** `feat/ziegel-finder-enterprise`
**Datei:** [`sections/blechziegel-home.liquid`](../sections/blechziegel-home.liquid)
**Stand:** 2026-04-16 (re-verified)
**Nach:** Phase 1 (Trust-Cleanup + JSON-LD) · Phase 2 (Reihenfolge + Commerce-Fakten zentralisiert) · Phase 3 (Hero-Fact-Tiles + Navy-Final-CTA)

---

## 1) Kurzbewertung

**Fast enterprise-ready, aber nicht fertig.** Architektur + Visuals stehen sauber. Es bleiben **konkrete Copy-Inkonsistenzen** rund um Herkunfts-Claims und einen hardcoded Versand-Satz im FAQ, der der zentralen `cf_*`-Logik direkt widerspricht. Ohne diese Korrekturen ist die Seite intern widersprüchlich.

---

## 2) Offene Punkte (verifiziert via grep)

| # | Fundstelle | Problem | Prio |
|---|---|---|---|
| 1 | [blechziegel-home.liquid:941](../sections/blechziegel-home.liquid#L941) FAQ | Hardcoded „Lieferung per DHL in 1–3 Werktagen. Ab 100 Euro Bestellwert kostenlos." — widerspricht `cf_free_threshold=leer` (bewusst unverifiziert). `cf_carrier`/`cf_lead_time` werden ignoriert. | **P1** |
| 2 | [blechziegel-home.liquid:624](../sections/blechziegel-home.liquid#L624) Hero-Tag | „Made in Germany · Lagerware" — härter als der im Trust-Block bewusst gewählte „gelasert". „Lagerware" sollte `cf_stock_label` nutzen. | **P1** |
| 3 | [blechziegel-home.liquid:761](../sections/blechziegel-home.liquid#L761) USP-Card | Headline „Made in Germany" + Body „Produziert in Deutschland" — **Ich kann nicht bestätigen**, dass das komplette Produkt in DE produziert wird. Trust-Block sagt nur „gelasert". | **P1** |
| 4 | [blechziegel-home.liquid:753](../sections/blechziegel-home.liquid#L753) USP-H2 | „Profi-Qualität. Einfache Montage. Made in Germany." — gleiche Thematik. | **P1** |
| 5 | [blechziegel-home.liquid:758](../sections/blechziegel-home.liquid#L758) USP-Card | „Aluminium – 25+ Jahre" — Zahl nicht durch Datenblatt im Repo belegt. **Ich kann das nicht bestätigen.** | **P2** |
| 6 | Stylesheet `.bz-cta-banner` | Tote CSS-Klasse seit Phase 3. | **P2** |
| 7 | [blechziegel-home.liquid:593](../sections/blechziegel-home.liquid#L593) `hero_alt` Default | „Made in Germany" im Alt-Text — niedriger Impact, Konsistenz-Punkt. | **P2** |

---

## 3) Priorisierung

- **P1 (jetzt):** #1, #2, #3, #4 — Copy-Inkonsistenzen + unverifizierte Claims
- **P2 (Feinschliff):** #5 entschärfen, #6 CSS-Aufräumen, #7 Alt-Text angleichen
- **P3 (später mit Produktbereich):** USP-Grid von 6 auf 4 härter trimmen, FAQ-Volltext-Review, Bestseller-Copy

---

## 4) Abschluss-Prompt für P1+P2

```text
# CLAUDE CODE — HOMEPAGE POLISH P1+P2
# Datei: sections/blechziegel-home.liquid — keine weiteren.

Aufgabe: Finale Copy-Inkonsistenzen beseitigen. Kein Umbau.

1. FAQ-Antwort (L941) dynamisch aus cf_* zusammensetzen:
   "Lieferung per {{ cf_carrier }} in {{ cf_lead_time }}.
   {%- if cf_free_threshold != blank %} Versandkostenfrei ab {{ cf_free_threshold }}.{%- endif %}
   Für Handwerksbetriebe und Großbestellungen sind individuelle Konditionen auf Anfrage möglich."

2. Hero-Tag (L624) ersetzen durch:
   "{{ cf_origin }}{%- if cf_stock_label != blank %} · {{ cf_stock_label }}{%- endif %}"

3. USP-H2 (L753): "Made in Germany." → "In Deutschland gelasert."

4. USP-Card "Made in Germany" (L761):
   h3 → "{{ cf_origin | default: 'In Deutschland gelasert' }}"
   p  → "Präzise gelasert statt gepresst. Geprüfte Maßhaltigkeit, sofort versandfertig."

5. USP-Card "Aluminium – 25+ Jahre" (L758):
   h3 → "Aluminium, witterungsstabil"
   p  → "Korrosionsbeständig, pulverbeschichtet, UV-stabil. Ausgelegt auf die Lebensdauer einer PV-Anlage."

6. hero_alt Default: "… – Made in Germany" → "… – in Deutschland gelasert"

7. Tote CSS-Regel `.bz-cta-banner { … }` entfernen.

## Validierung (grep in home.liquid)
- "Made in Germany"           → 0
- "100 Euro|100 €"             → 1 (nur Schema-Label erlaubt)
- "25\+"                       → 0
- "bz-cta-banner"              → 0
- "Produziert in Deutschland"  → 0

## Commit
refine(home): align remaining copy with verified origin and central commerce facts
```
