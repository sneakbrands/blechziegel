# Sprint 1 Meta-Umsetzung — Startseite

## Status

**LIVE gesetzt (manuell durch User im Shopify Admin, 2026-05-16) und extern verifiziert.**

Begruendung: Die Homepage Meta Title und Meta Description (`page_title` /
`page_description` in Liquid) kommen bei Shopify aus **Online Store → Preferences**.
Diese beiden Felder sind **nicht** ueber die Shopify Admin API setzbar:

| Probe | Ergebnis |
|---|---|
| GraphQL `__schema.mutationType.fields` mit `/^shop/` | nur `shopLocale*`, `shopPolicy*`, `shopResourceFeedback*` — kein `shopUpdate` / `shopSEOSet` |
| REST `GET /admin/api/2025-01/shop.json` | keine Felder `meta_title` / `meta_description` |
| Shop-Metafields `namespace:"global"` (`title_tag` / `description_tag`) | leer; Shopify rendert Homepage-Meta nicht aus diesen Metafields |
| GraphQL `Shop` type-Felder mit `seo` / `preferences` / `brand` | keine Treffer |

Damit greift Aufgabe 8 der Vorgabe: „Falls kein sicherer Shopify-Admin-Zugriff
vorhanden ist: STOP und nur manuelle Anleitung ausgeben."

## Ist-Stand vor Aenderung (live ausgelesen)

| Feld | Aktueller Wert |
|---|---|
| `<title>` | „blechziegel.de \| Dein Shop für PV-Montage am Dac…" |
| `<meta name="description">` | „Blechziegel und Dachhaken für die Solarmontage auf Frankfurter Pfanne. Made in Germany. Aluminium, Anthrazit und Ziegelrot. Direkt bestellen." |
| `<meta property="og:title">` | „blechziegel.de \| Dein Shop für PV-Montage am Dac…" |

## Zu setzende Werte (Freigabe Sprint 1)

### Meta Title

```
PV-Blechziegel aus Aluminium für Photovoltaik-Montage
```

(56 Zeichen)

### Meta Description

```
PV-Blechziegel aus Aluminium für die sichere Montage von Photovoltaikanlagen auf Ziegeldächern. Ersatzdachziegel mit Dachhaken, passend für viele Profile.
```

(154 Zeichen)

## Manuelle Schritt-fuer-Schritt-Anleitung (Shopify Admin)

1. Im Browser einloggen: <https://admin.shopify.com/store/a1tmha-5m>
2. Unten links **Settings** (Zahnrad)
3. Linke Sidebar: **Online Store** → **Preferences**
   - Direkt-Link:
     `https://admin.shopify.com/store/a1tmha-5m/online_store/preferences`
4. Block **„Title and meta description"**:
   - Feld **„Homepage title"** komplett ersetzen mit:
     `PV-Blechziegel aus Aluminium für Photovoltaik-Montage`
   - Feld **„Homepage meta description"** komplett ersetzen mit:
     `PV-Blechziegel aus Aluminium für die sichere Montage von Photovoltaikanlagen auf Ziegeldächern. Ersatzdachziegel mit Dachhaken, passend für viele Profile.`
5. **„Save"** oben rechts klicken.

Verifikation (lokal nach ~1-2 min Cache-Refresh):

```bash
curl -sL "https://blechziegel.de/" | grep -oE '<title>[^<]*</title>'
curl -sL "https://blechziegel.de/" | grep -oE '<meta name="description"[^>]*>'
```

Erwartet:
- `<title>` exakt: `PV-Blechziegel aus Aluminium für Photovoltaik-Montage – Blechziegel.de`
  (Shopify haengt automatisch `– <Shop-Name>` an, falls der Shop-Name nicht
  bereits im Title enthalten ist — siehe `snippets/meta-tags.liquid` Z. 116.)
- `<meta name="description">` exakt: der freigegebene Wert.

## Technischer Weg

- **Shopify Admin → Online Store → Preferences → „Title and meta description"** (manuell durch User)
- Kein Theme-Code geaendert
- Keine Admin-API-Writes
- Keine Liquid-Aenderung in `snippets/meta-tags.liquid`

## Verifikation (Stand 2026-05-16, live ueber `curl` ausgelesen)

| Feld | Live-Wert (HTML) | Erwartung | Status |
|---|---|---|---|
| `<title>` | `PV-Blechziegel aus Aluminium für Photovoltaik-Montage – Blechziegel.de` | freigegebener Title + Shopify-Auto-Suffix `– Blechziegel.de` (laut `snippets/meta-tags.liquid` Z. 116) | ✅ exakt |
| `<meta name="description">` | `PV-Blechziegel aus Aluminium für die sichere Montage von Photovoltaikanlagen auf Ziegeldächern. Ersatzdachziegel mit Dachhaken, passend für viele Profile.` | exakt der freigegebene Wert | ✅ exakt, 154 Zeichen |
| `<meta property="og:title">` | `PV-Blechziegel aus Aluminium für Photovoltaik-Montage` | ohne Suffix (Shopify-Standard) | ✅ exakt |

Verifikations-Befehl:

```bash
curl -sL "https://blechziegel.de/" | grep -oE '<title>[^<]*</title>|<meta name="description"[^>]*>'
```

## Nicht geaendert

- keine Theme-Dateien
- keine Produkte
- keine Collections
- keine Preise
- keine Varianten
- kein Checkout
- keine Steuerlogik
- keine Versandlogik
- kein `shopify theme push`
- keine Shopify-Admin-API-Writes
