#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/CHATGPT_EXPORT.md"

ext_to_lang() {
  case "$1" in
    liquid) echo "liquid" ;;
    json)   echo "json" ;;
    js)     echo "javascript" ;;
    css)    echo "css" ;;
    md)     echo "markdown" ;;
    svg)    echo "xml" ;;
    *)      echo "" ;;
  esac
}

count_files() {
  find "$ROOT/$1" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' '
}

{
cat <<'HEADER'
# Blechziegel Shopify Theme — ChatGPT Wissens-Export

> **Anleitung für ChatGPT:** Diese Datei enthält das komplette Shopify Theme von blechziegel.de. Du sollst sie als Wissensbasis nutzen, um Fragen zum Theme zu beantworten, Code-Änderungen vorzuschlagen und neue Sections/Snippets im selben Stil zu schreiben. Achte auf Horizon-Konventionen, deutsche Copy und B2B-Fokus.

## Theme-Identität
- **Basis:** Shopify Horizon 3.5.0 (angepasst)
- **Brand:** blechziegel.de
- **Domain:** Blechziegel, Dachzubehör, PV-Montagematerial
- **Zielgruppe:** Dachdecker, PV-Installateure (B2B) + Privatkunden (B2C)
- **Primärsprache:** Deutsch (51 Locales unterstützt)

## Tech-Stack
- Shopify Online Store 2.0 (JSON-Templates, Section Groups)
- Liquid Templating
- Vanilla JS Web Components (HTMLElement-basiert)
- CSS Custom Properties (Design Tokens)
- Keine Build-Tools (kein webpack/vite), direktes Asset-Loading

## Architektur — Custom Layer über Horizon
Custom Sections (eigene blechziegel-Markenkomponenten):
- `sections/blechziegel-home.liquid` — Homepage Hero + Bestseller
- `sections/blechziegel-product.liquid` — Produkt-Detail mit Sticky Gallery
- `sections/blechziegel-collection.liquid` — Custom Collection Layout
- `sections/contact-blechziegel.liquid` — B2B Kontaktformular

Custom JS:
- `assets/accordion-custom.js` — Accordion mit Mobile/Desktop-Awareness
- `assets/product-custom-property.js` — Personalisierungs-Input mit Counter

Templates die Customs nutzen:
- `templates/index.json`, `templates/product.json`, `templates/collection.json`, `templates/page.contact.json`

Design-Tokens (überlagern Horizon-Variablen):
- `--bz-orange: #f5a623`
- `--bz-navy: #0d1e35`
- Typo: Montserrat (Headings) + Open Sans (Body) im Kontaktbereich

## Verzeichnis-Übersicht
HEADER

  echo ""
  echo "| Ordner | Dateien |"
  echo "|---|---|"
  for d in layout templates sections blocks snippets assets config locales; do
    echo "| \`$d/\` | $(count_files $d) |"
  done
  echo ""
  echo "---"
  echo ""
  echo "# Datei-Inhalte"
  echo ""

  # Reihenfolge der Ordner
  for dir in layout templates sections blocks snippets assets config locales; do
    [ -d "$ROOT/$dir" ] || continue
    echo ""
    echo "# === $dir/ ==="
    echo ""

    # Custom-Dateien zuerst in sections/
    if [ "$dir" = "sections" ]; then
      mapfile -t files < <( { ls "$ROOT/$dir"/blechziegel-*.liquid 2>/dev/null; ls "$ROOT/$dir"/contact-blechziegel.liquid 2>/dev/null; ls "$ROOT/$dir"/*.liquid "$ROOT/$dir"/*.json 2>/dev/null | sort -u; } | awk '!seen[$0]++' )
    elif [ "$dir" = "assets" ]; then
      mapfile -t files < <(find "$ROOT/$dir" -maxdepth 1 -type f \( -name "*.js" -o -name "*.css" \) | sort)
    else
      mapfile -t files < <(find "$ROOT/$dir" -maxdepth 1 -type f \( -name "*.liquid" -o -name "*.json" -o -name "*.css" -o -name "*.js" -o -name "*.md" \) | sort)
    fi

    for f in "${files[@]}"; do
      [ -f "$f" ] || continue
      rel="${f#$ROOT/}"
      ext="${f##*.}"
      lang=$(ext_to_lang "$ext")
      echo ""
      echo "## $rel"
      echo ""
      echo "\`\`\`$lang"
      cat "$f"
      echo ""
      echo "\`\`\`"
    done
  done

  echo ""
  echo "---"
  echo ""
  echo "# Binär-Assets (nicht eingebettet)"
  echo ""
  find "$ROOT/assets" -maxdepth 1 -type f ! \( -name "*.js" -o -name "*.css" \) 2>/dev/null \
    | sed "s|$ROOT/||" | sort | sed 's/^/- /'

} > "$OUT"

echo "Generated: $OUT"
ls -lh "$OUT"
echo "Section-Header (## ): $(grep -c '^## ' "$OUT")"
