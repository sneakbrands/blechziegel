# claude-seo

Einmalig auf User-Wunsch im Repo abgelegte SEO-/Semrush-Berichte zu
blechziegel.de — damit ChatGPT/Claude sie via stabile GitHub-Raw-URLs
lesen koennen.

> **Default-Regel (CLAUDE.md):** Audit-/Strategie-/Bericht-Dateien
> gehoeren NICHT ins Theme-Repo, sondern in `theme-workspace/`. Dieser
> Ordner ist eine **Ausnahme auf expliziten User-Auftrag**. Neue Berichte
> werden weiterhin standardmaessig in `theme-workspace/claude-seo/`
> abgelegt — und nur auf erneute Anweisung in dieses Verzeichnis kopiert.

## Struktur

```
claude-seo/
├── README.md                  ← diese Datei
├── 2026-05-16-semrush/        ← Phase 1: Datenbasis-Vorbereitung
│   ├── competitors.csv
│   ├── domain-overview-de.csv
│   ├── organic-keywords-de.csv
│   ├── top-pages-de.csv
│   ├── backlinks-overview.csv
│   ├── keyword-priorities.md
│   ├── theme-url-mapping.md
│   └── seo-target-pages.md
└── <weitere Berichte>/
```

Jeder Bericht liegt in einem eigenen Ordner mit dem Schema
`<YYYY-MM-DD>-<thema>/`.

## Konventionen

- **Datenquelle pro CSV-Zeile** in der Spalte `source` (z.B. `Semrush (Schaetzung)`).
- **Export-Datum** in der Spalte `export_date` (ISO YYYY-MM-DD).
- **Keine erfundenen Daten.** Leere Zellen heissen „noch nicht exportiert".
- **Semrush-Werte sind Schaetzwerte**, nicht Google-Search-Console-Wahrheit.

## Wichtige Produkt-Abgrenzung (verbindlich fuer alle SEO-Texte)

blechziegel.de verkauft **PV-Blechziegel / Aluminium-Ersatzdachziegel
fuer PV-Montage** — **keine stromerzeugenden Solarziegel**.

Pflicht-Formulierung bei missverstaendlichen Keywords:
> „Unsere PV-Blechziegel sind keine stromerzeugenden Solarziegel,
> sondern Aluminium-Ersatzdachziegel fuer die sichere Montage von
> Photovoltaikanlagen auf Ziegeldaechern."

Siehe auch `.claude/agents/blechziegelsem.md` fuer den vollstaendigen
Semrush-/SEO-Arbeitskontext.

## Shopify-Sync

Dieser Ordner wird **nicht** von Shopify auf das Theme gezogen. Shopify
zieht nur Standard-Theme-Ordner (`assets/`, `blocks/`, `config/`,
`layout/`, `locales/`, `sections/`, `snippets/`, `templates/`).
`claude-seo/` ist reiner Doku-/Daten-Ablageort auf GitHub-Seite.

## Raw-URLs fuer externen Zugriff

Beispielmuster fuer ChatGPT/externe Tools:

```
https://raw.githubusercontent.com/sneakbrands/blechziegel/main/claude-seo/2026-05-16-semrush/keyword-priorities.md
https://raw.githubusercontent.com/sneakbrands/blechziegel/main/claude-seo/2026-05-16-semrush/competitors.csv
```
