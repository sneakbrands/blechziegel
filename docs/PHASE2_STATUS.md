# Phase 2 — Status-Bewertung Home

**Branch:** `feat/ziegel-finder-enterprise`
**Datei:** [`sections/blechziegel-home.liquid`](../sections/blechziegel-home.liquid)
**Stand:** 2026-04-15

---

## Aktuelle Block-Reihenfolge (live)

1. Hero (L509)
2. Finder-Teaser (L574) ✅ neu
3. Dachtypen-Filter (L623) — alter Filter, unverändert
4. USP-Grid 6 Cards (L672)
5. Bestseller (L690)
6. Problem/Lösung „bz-pvl" (L708) — immer noch tief unten
7. Trust-Block / 3 USP-Kacheln (L743) ✅ frisch verifiziert
8. How-it-works (L768)
9. FAQ (L823)
10. CTA-Banner (L861)

---

## 1) Hero

**Status: alt.** Trust-Zeile ist noch die alte Drei-Item-Variante:
„Für alle gängigen Dachtypen · Gratis Versand ab 100 € · 30 Tage Rückgabe"
([blechziegel-home.liquid:555-567](../sections/blechziegel-home.liquid#L555-L567)).

**Inkonsistenz:** „Gratis Versand ab 100 €" steht hier UND in USP-Card L683 — die `55 € netto`-Schwelle wurde gestrichen, weil unbestätigt. **Ich kann nicht bestätigen**, ob die 100 €-Schwelle verifiziert ist.

Fact-Tiles-Umbau ist **nicht** passiert.

## 2) Block-Reihenfolge

**Nicht umgesetzt.** Problem/Lösung steht bei Position 6, nicht direkt nach Finder-Teaser. Reihenfolge ist noch die ursprüngliche.

## 3) Dachtypen-Block

**Unverändert.** Klassischer 6-Card-Filter auf Collections. Keine Hub-Logik, keine Entfernung. Konkurriert thematisch mit dem Finder-Teaser direkt darüber.

## 4) Konsistenz

- Trust-Block (frisch): sauber, belegt ✅
- Hero-Trust + USP-Card „1–3 Werktage … gratis ab 100 €": **widersprüchlich** zur Schwellen-Streichung
- USP-Card „Aluminium – 25+ Jahre" — **Ich kann das nicht bestätigen.**
- USP-Card „bis 12:00 Uhr" vs. neuer Trust-Block „Vor 13 Uhr" — **Inkonsistenz**

## 5) SEO/UX

**Sauber gelöst (Phase 1):**
- Trust-Block USPs verifiziert
- Organization + WebSite JSON-LD
- Hero-CTA → Finder
- Finder-Teaser

**Offen (Phase 2):**
- Problem/Lösung nicht hochgezogen
- Hero-Fact-Tiles nicht umgebaut
- 12-vs-13-Uhr-Widerspruch
- 100 €-Versandschwelle doppelt + unbelegt(?)
- Dachtypen-Block-Strategie ungeklärt
- FAQPage-Schema nicht ergänzt
- Bestseller-Rename nicht erfolgt

---

## Fazit

**Phase 2 ist nicht fertig.** Was läuft, ist Phase 1 + MINI-Cleanups. Phase-2-Kernpunkte (Reihenfolge, Hero-Fact-Tiles, Konsistenz-Sweep) stehen noch aus.

## Nächste Priorität

1. Konsistenz-Sweep: 12/13-Uhr + 100 €-Schwelle klären (1 Quelle der Wahrheit)
2. Hero-Trust-Zeile auf verifizierte Fact-Tiles umbauen
3. Problem/Lösung nach Position 3 (direkt unter Finder-Teaser)
4. Dachtypen-Block: behalten als sek. Hub ODER entfernen
