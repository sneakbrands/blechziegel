# Homepage Consistency & Polish Audit

**Branch:** `feat/ziegel-finder-enterprise`
**Datei:** [`sections/blechziegel-home.liquid`](../sections/blechziegel-home.liquid)
**Stand:** 2026-04-16
**Nach:** Phase 1 (Trust-Cleanup + JSON-LD) · Phase 2 (Reihenfolge + Commerce-Fakten zentralisiert) · Phase 3 (Hero-Fact-Tiles + Navy-Final-CTA)

---

## 1) Kurzbewertung

**Nahezu enterprise-ready, aber nicht sauber fertig.** Die Architektur steht — die verbleibenden Punkte sind konkrete **Copy-Widersprüche** zur `cf_*`-Entscheidung und zwei **„Made in Germany"-Claims**, die härter sind als der verifizierte „In Deutschland **gelasert**"-Wortlaut aus dem Trust-Block. Ohne diese Korrekturen ist die Seite intern inkonsistent.

---

## 2) Offene Punkte

| # | Fundstelle | Problem |
|---|---|---|
| 1 | [blechziegel-home.liquid:941](../sections/blechziegel-home.liquid#L941) FAQ „Versand/Rabatte" | Hardcoded: **„Ab 100 Euro Bestellwert kostenlos"** — widerspricht direkt `cf_free_threshold` (leer gelassen, weil nicht verifiziert). Muss konditional aus zentraler Quelle kommen. |
| 2 | [blechziegel-home.liquid:624](../sections/blechziegel-home.liquid#L624) Hero-Tag | „Made in Germany · Lagerware" — „Lagerware" gehört an `cf_stock_label`; „Made in Germany" ist härter als der verifizierte „gelasert"-Wortlaut. |
| 3 | [blechziegel-home.liquid:761](../sections/blechziegel-home.liquid#L761) USP-Card „Made in Germany" | „Produziert in Deutschland" — widerspricht dem Trust-Block, der bewusst nur „gelasert, nicht gepresst" behauptet. **Ich kann „produziert in Deutschland" nicht bestätigen.** |
| 4 | [blechziegel-home.liquid:753](../sections/blechziegel-home.liquid#L753) USP-Headline | „Made in Germany" in H2 — gleiche Thematik. |
| 5 | [blechziegel-home.liquid:758](../sections/blechziegel-home.liquid#L758) USP-Card „Aluminium 25+ Jahre" | Zahl nicht durch Datenblatt im Repo belegt. **Ich kann das nicht bestätigen.** |
| 6 | CSS `.bz-cta-banner` (tot seit Phase 3) | Harmlos, aber unnötiger Restartefakt. |

---

## 3) Priorisierung

- **P1** (jetzt): #1, #2, #3, #4 — echte Inkonsistenzen + unverifizierte Claims
- **P2** (Feinschliff): #5 (sprachlich entschärfen), #6 (CSS-Aufräumen)
- **P3** (später mit Produktbereich): USP-Grid-Trimmung, FAQ-Volltext-Review

---

## 4) Abschluss-Prompt für P1+P2

```text
# CLAUDE CODE — HOMEPAGE POLISH P1+P2
# Datei: sections/blechziegel-home.liquid

Aufgabe: Letzte Copy-Inkonsistenzen beseitigen. Kein Umbau.

## Änderungen

1. FAQ-Antwort zu Versand/Rabatten (aktuell: „Lieferung per DHL in 1–3 Werktagen.
   Ab 100 Euro Bestellwert kostenlos. …") vollständig aus cf_* zusammensetzen:
   - cf_carrier statt "DHL"
   - cf_lead_time statt "1–3 Werktagen"
   - Versand-kostenlos-Satz NUR wenn cf_free_threshold gesetzt
   - Satz zu Handwerk/Großbestellungen bleibt unverändert

2. Hero-Tag "Made in Germany · Lagerware" ersetzen durch:
   "{{ cf_origin }} · {{ cf_stock_label }}" (konditional, falls leer: nichts)

3. USP-Headline "Profi-Qualität. Einfache Montage. Made in Germany."
   → "Profi-Qualität. Einfache Montage. In Deutschland gelasert."

4. USP-Card "Made in Germany" / "Produziert in Deutschland":
   Headline → "{{ cf_origin | default: 'In Deutschland gelasert' }}"
   Body → "Präzise gelasert statt gepresst. Geprüfte Maßhaltigkeit, sofort versandfertig."

5. USP-Card "Aluminium – 25+ Jahre":
   Body entschärfen auf belegbare Aussage — Zahl "25+ Jahre" entfernen,
   stattdessen: "Korrosionsbeständig, pulverbeschichtet, witterungsstabil.
   Ausgelegt auf die Lebensdauer einer PV-Anlage."

6. Tote CSS-Regel `.bz-cta-banner { … }` (alter orange Banner-Stil) entfernen.

## Validierung
- grep "100 Euro|100 €" → 0 (außer im Schema-Label)
- grep "Made in Germany" → 0 in <body>-Content; im hero_alt-Default erlaubt
- grep "25\+" → 0
- grep "bz-cta-banner" → 0

## Commit
refine(home): align faq shipping copy with central facts and tighten origin claims
```
