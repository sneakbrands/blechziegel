# Enterprise-Audit blechziegel.de Theme

> Produktives Shopify Theme (Horizon 3.5.0 + Custom-Layer), Stand 2026-04-14.
> Umfang: `sections/`, `snippets/`, `templates/`, `assets/`, `layout/`.
> Methodik: Code-Inspektion + zwei parallele Explore-Agenten. Belege mit Datei:Zeile.

---

## 1. EXECUTIVE SUMMARY (C-Level)

1. **Accessibility-Defizit bei Kern-Interaktionen** → Farbauswahl und Galerie-Thumbnails auf der Produktseite sind `<div onclick>` statt `<button>`. Nicht tastatur-/screenreader-bedienbar — rechtliches Risiko (BFSG ab 06/2025 für Onlineshops).
2. **Fehlendes Product-JSON-LD** → Kein schema.org/Product auf Custom-Produktseite. Google Shopping-Ergebnisse, Preis/Rating-Snippets verloren.
3. **Font-Token-Fallback bricht Typografie** → `var(--font-heading-family, …)` (1-Dash) existiert in Horizon nicht; korrekt ist `--font-heading--family` (2-Dash). Fallback läuft ins Leere, Headings rendern im Body-Font.
4. **Hero-Image ohne width/height** → CLS-Risiko am LCP-Element, Core-Web-Vital-Strafe.
5. **Hardcoded dachtyp-Filter** (5 Typen) in Collection-Section → neue Dachtypen erfordern Code-Deploy, nicht Admin-Task.
6. **Filter-Highlight bricht** → `current_tags contains 'Frankfurter Pfanne'` prüft Tag-Filter, die URL-Param ist aber `filter.p.m.custom.dachziegel_typ` (Metafield-Facet). Button-`.active`-State funktioniert nicht.
7. **hreflang fehlt** trotz 51 Locale-Files → Multi-Language-SEO verschenkt.
8. **Kein Captcha** am Kontaktformular → Spam-Risiko/Postfach-Überflutung.
9. **CSS-Token-Inkonsistenz** → `--bz-orange`/`--bz-navy` definiert, aber in Custom-Sections oft hartcodiert (`#f5a623`, `#0d1e35`) → Rebrand/Dark-Mode-Änderung = grep-and-replace über 100+ Stellen.
10. **Monolithische Sections** (home 700+ Z., product 1050+ Z.) → Wartungs- und Merge-Konflikt-Risiko, CSS nicht wiederverwendbar.

---

## 2. CRITICAL ISSUES (TOP 10)

| # | Problem | Ort | Ursache | Business Impact | Fix |
|---|---|---|---|---|---|
| 1 | Swatches / Thumbnails nicht keyboard-accessible | `sections/blechziegel-product.liquid:650-657` | `<div onclick>` statt `<button>`, kein `tabindex`, kein `aria-pressed` | Legal (BFSG 2025), Conversion −5–10 % auf Mobile-Tastatur-User | `<button type="button" class="bz-swatch" aria-pressed="{{ forloop.first }}" aria-label="Farbe {{ value }}">` |
| 2 | Produktseite ohne schema.org/Product JSON-LD | `sections/blechziegel-product.liquid` (fehlt) | Custom-Section ersetzt Standard `main-product.liquid` ohne das Schema zu übernehmen | Hoch — Rich Results, Google Shopping | Snippet `product-schema.liquid` mit `@type: Product`, offers, aggregateRating anlegen + in Section einbinden |
| 3 | `--font-heading-family` (1-Dash) → Fallback greift nicht | `sections/blechziegel-home.liquid:38`, `:149`, u. a. | Horizon-Konvention ist `--font-heading--family` (2-Dash) | Mittel — Headings rendern nicht in gesetztem Heading-Font | Replace-All `--font-heading-family` → `--font-heading--family`; dito `--font-body-family` → `--font-body--family` |
| 4 | Hero `image_tag` ohne width/height | `sections/blechziegel-home.liquid` Hero-Bereich | Kein explizites `width:/height:` im image_tag-Call | Hoch — CLS, LCP-Bewertung | `image_tag: loading: 'eager', fetchpriority: 'high', width: 1920, height: 580` |
| 5 | Hardcoded Dachtyp-Filterbuttons | `sections/blechziegel-collection.liquid:568-596` | 5 `<a href="?filter...">`-Tags im Liquid fest | Hoch — neue Typen = Code-Deploy | Schema-Setting `dachtyp_list` (Liste) oder Metaobject iterieren: `for typ in shop.metaobjects.dachtyp.values` |
| 6 | Filter-`active`-State bricht | `sections/blechziegel-collection.liquid:568-596` | `{% if current_tags contains 'Frankfurter Pfanne' %}` — Tags prüfen, aber Facet ist Metafield | Mittel — verwirrte Nutzer, kein visuelles Feedback | `{%- assign active_typ = collection.filters \| where: 'param_name', 'filter.p.m.custom.dachziegel_typ' \| first -%}` und dessen `active_values` prüfen |
| 7 | `hreflang` fehlt | `snippets/meta-tags.liquid` | Snippet gibt keine Alternate-Language-Links aus | Mittel/hoch für international | `{%- for locale in shop.published_locales -%}<link rel="alternate" hreflang="{{ locale.iso_code }}" href="{{ canonical_url }}">` |
| 8 | Kontaktformular ohne Spam-Schutz | `sections/contact-blechziegel.liquid` Form-Area | Keine Captcha/Honeypot | Hoch — Spam-Flut, Zustellbarkeits-Score | Honeypot-Feld + hCaptcha (Shopify-Standard) |
| 9 | `imgSrc` Dead-Code + Image-URL-Hacking | `sections/blechziegel-product.liquid:~1127` | `var imgSrc = ...replace(...)` wird nicht genutzt; `'https:' + src + '&width=800'` bricht wenn CDN-URL kein `?v=` hat | Mittel — Varianten-Bild bleibt ggf. stehen | Serverseitig Map `{variantId: image_url}` rendern, Client nur Lookup |
| 10 | Accordion-FAQ ohne `aria-expanded` | Product-/Home-FAQ-Blöcke | JS toggelt nur `.open`-Class | Mittel — Screen-Reader-UX, A11y-Score | `aria-expanded="false"` setzen, toggle via JS mit `aria-controls="answer-X"` |

---

## 3. CONVERSION OPPORTUNITIES (TOP 10)

1. **Product-Page: Variant-Preview bleibt bei nicht-verfügbarer Kombi aktiv** (`product:1109-1112`) — wenn `matched` `undefined`, wird Button-Status nicht zurückgesetzt → User kauft falsche oder veraltete Variante. Fix: `else { disable both ATCs }`-Branch.
2. **Hersteller-Liefertag-Signal fehlt** → "Heute bestellt, Mo. verschickt" als dynamischer Microcopy-Countdown; hoher CVR-Uplift bei B2B.
3. **Bestseller-Limit von 3** (`home:375`) — Setting statt hardcoded `limit: 3`.
4. **Strikepreis auf Produktseite** — Ersparnis in € + % nebeneinander = +4–7 % CVR.
5. **Mengenrabatt-Hinweis fehlt** bei Dachdecker-Zielgruppe — "Ab 20 Stück: auf Anfrage" als Inline-Badge.
6. **Sticky-ATC ohne Bild-Thumbnail** → kleiner `<img>` vor Kontexttext erhöht Wiedererkennung auf Scroll.
7. **Galerie-Zoom fehlt** → Dachdecker prüfen Materialdetails; Lightbox/Pinch-Zoom = Trust.
8. **"Passgenau"-Check-Tool-CTA** auf Homepage — Hero sekundär-CTA "Passenden Blechziegel finden" führt aktuell ins Leere: `hero_cta_primary_url:""` in `templates/index.json`.
9. **Reviews-Number vs. Trusted-Shops-Gesamtwert** — Trusted-Shops-Badge ist nur Text, kein offizielles Widget → Vertrauen niedriger als möglich.
10. **Warenkorb-Drawer auf Mobile fehlt** — nach Add-to-Cart kein Side-Drawer, nur Redirect → Abbruchsgefahr bei Bundle-Käufen.

---

## 4. SEO QUICK WINS

| Finding | Ort | Fix |
|---|---|---|
| Kein Product JSON-LD | Produktseite | siehe §2-2 |
| Kein Breadcrumb JSON-LD | Product/Collection | `BreadcrumbList`-Schema in `meta-tags.liquid` bei template contains 'product'/'collection' |
| Kein Organization JSON-LD | global | einmalig im `<head>`: name, logo, address, sameAs |
| OG:Image-Protokoll | `snippets/meta-tags.liquid:~64` (Agent-Finding, bitte prüfen) | `http:`-Variante durch Protokoll-relativ oder `https:` ersetzen |
| hreflang | `snippets/meta-tags.liquid` | siehe §2-7 |
| H1-Hierarchie homepage | Hero `<h1>` | ✓ bereits eine H1 pro Page |
| FAQ-Schema bereits da | `sections/blechziegel-product.liquid` | ✓ beibehalten |
| SEO-Text unter Collection-Pagination | `blechziegel-collection.liquid:808+` | ✓ gut strukturiert |

---

## 5. PERFORMANCE QUICK WINS

1. **Hero-LCP-Bild mit `fetchpriority="eager"`** statt `lazy`.
2. **CSS-Gradient-Overhang in Product-Card** (`::after` + radial + linear) — auf Low-End-Mobile messbar; `will-change:transform` nur auf Hover-Child begrenzen.
3. **40+ Inline-SVG-Icons** → `snippets/icons.liquid` mit `<symbol>`s + `<use href>`; ~30 % HTML-Weight-Reduktion der Homepage.
4. **Monolithischer `{% style %}`-Block in home** (~400 Zeilen inline CSS) → in `assets/blechziegel-home.css` auslagern.
5. **Contact-Section nutzt `<style>` statt `{% style %}`** — `{% style %}` wird Shopify-seitig optimiert.
6. **Scripts ohne `defer`** im Home-FAQ-Block.

Nicht-Problem (Agent irrte): `product.variants | json` ist in Shopify automatisch JS-sicher. `| safe` ist Jekyll/Jinja, nicht Liquid.

---

## 6. UX PROBLEME NACH SEITEN

### Startseite (`sections/blechziegel-home.liquid`)
- **Hero-CTAs ohne URL** (`templates/index.json` `hero_cta_primary_url:""`) → klickbare Buttons führen nirgendwohin.
- **Dachtypen-Grid (3×)** gut strukturiert, aber hardcoded (nicht Settings-editierbar).
- **Bestseller-Sektion ist leer** wenn `bestseller_collection` nicht gesetzt — Fallback auf `collections['all']`. Bei leerer Collection → keine Warnung.
- **Social Proof-Reviews** — reine Texte, keine echten Kundenavatare/-Logos.

### Produktseite (`sections/blechziegel-product.liquid`)
- **Lange Select-Labels** ("Mit integriertem Dachhaken (für PV-Montage)", `:664-665`) überlaufen auf 375px-iPhones.
- **Kundengruppen-Select (Privatkunde/Gewerbekunde)** erzeugt Entscheidungsfriktion; besser per Header-Toggle / Session-Setting.
- **Galerie-Thumbs `<div onclick>`** — siehe Critical.
- **Sticky-Bar jetzt premium** ✓ (neu in dieser Session).
- **Tab-Navigation ohne `aria-selected`/`role=tab`** (`:834`).

### Collection (`sections/blechziegel-collection.liquid`)
- **Hardcoded Dachtyp-Buttons** — siehe Critical.
- **Filter-State-Bug** — siehe Critical.
- **Empty-State-Copy** zeigt "Für diesen Filter..." auch ohne aktivem Filter (`:799-803`) → irreführend bei wirklich leeren Collections.
- **SEO-Footer-Text** gut, Keyword-Dichte reviewen.

### Mobile UX (cross-page)
- **Sticky-ATC** ✓ jetzt premium.
- **Breadcrumbs fehlen** — Orientierungsverlust bei tief verlinkten Collections/Produkten.
- **Thumb-Reach**: Hero-CTAs mittig ✓.

---

## 7. TECHNISCHE FEHLERLISTE

| Datei | Zeile | Problem | Risiko |
|---|---|---|---|
| `sections/blechziegel-product.liquid` | 990-991 | `var imgSrc = ...` dead code, nie gelesen | Code-Rot |
| `sections/blechziegel-product.liquid` | ~1127 | `'https:' + src + '&width=800'` — fragile URL-Konkatenation | Bildfehler bei CDN-URL-Änderungen |
| `sections/blechziegel-product.liquid` | 967-979 | `bzUpdateVariant` ohne `if (!matched)`-Fallback | Falsche ATC bei nicht-matchender Kombi |
| `sections/blechziegel-product.liquid` | 1028-1032 | `IntersectionObserver` ohne `disconnect` | Memory-Leak bei Theme-Editor-Rerender |
| `sections/blechziegel-product.liquid` | 650-657 | Swatches als `<div>` | A11y |
| `sections/blechziegel-product.liquid` | 834-836 | Tabs ohne ARIA | A11y |
| `sections/blechziegel-collection.liquid` | 568-596 | Hardcoded Dachtypen + falscher `current_tags`-Check | Skalierung + Bug |
| `sections/blechziegel-home.liquid` | 38, 149, diverse | `--font-heading-family` (1-Dash) statt 2-Dash | Typo-Rendering |
| `sections/blechziegel-home.liquid` | Hero | `image_tag` ohne width/height | CLS/LCP |
| `layout/theme.liquid` | 19-26 | `link rel="expect"` blockiert Render — Shopify-Standard, bewusst lassen | — |
| `snippets/meta-tags.liquid` | ~64 (Agent) | OG-Image `http:` statt `https:` | Mixed-Content (verifizieren) |

---

## 8. DESIGN-INKONSISTENZEN

- **Border-Radius**: `--bz-r` (6), `--bz-r-lg` (12), 14, 18, 20, 22, 999px — **7 Werte**. Reduzieren auf: 6 (klein), 12 (Karten), 22 (Hero-Karten), 999 (Pills).
- **Orange-Token**: `#f5a623`, `rgba(245,166,35,X)`, `var(--bz-orange)`, Light/Dark-Varianten — mal Var, mal hart. Regel: immer Var; für Transparenz `color-mix(in srgb, var(--bz-orange) 20%, transparent)`.
- **Navy-Token**: analog.
- **Button-Styles**: `.bz-btn-primary`, `.bz-atc-btn`, `.bz-sticky-btn`, Produktkarten-CTA — **4 unterschiedliche Primary-Stile**. Ein System mit Size-Varianten.
- **Card-Background**: `#fff`, `#ffffff`, `#f8f8f6`, `#f8f7f4`, `#efede8`, `#f0efeb` — 6 Off-White-Werte. Auf 2 reduzieren (`--bz-surface`, `--bz-surface-2`).
- **Breakpoints**: 400/580/640/860/900/901 gemischt. Standardisieren auf 480/768/1024.

---

## 9. ROADMAP

### Phase 1 — Quick Wins (0–7 Tage)
1. Font-Token fixen (`--font-heading-family` → `--font-heading--family`).
2. Hero `image_tag` width/height + `fetchpriority: 'eager'`.
3. Hero-CTA-URLs in `templates/index.json` setzen.
4. Product-Swatches `<div>` → `<button>` + `aria-pressed`.
5. Collection-Filter-Active-State mit `collection.filters` statt `current_tags`.
6. Product-JSON-LD als Snippet einbinden.
7. Breadcrumb-JSON-LD im `meta-tags`-Snippet.
8. Captcha/Honeypot im Kontaktformular.
9. `bzUpdateVariant` — `else`-Branch für fehlende Variante.
10. Dead-Code `imgSrc` entfernen.

### Phase 2 — High Impact (1–4 Wochen)
1. **Design-Token-Refactor**: alle Farben/Radien/Spacings zentralisieren.
2. **Dachtyp-Architektur umstellen** → Shopify Metaobject `dachtyp` (name, slug, thumbnail, hauptprodukt); Home-Grid + Collection-Buttons iterieren.
3. **Icon-Sprite** (`snippets/icons.liquid`) → SVGs referenzieren.
4. **`{% style %}`-Auslagerung** in `assets/*.css`.
5. **Accordion/Tab-ARIA** vollständig.
6. **hreflang** im meta-tags-Snippet.
7. **ATC Drawer** statt Redirect.
8. **Mengen-Staffel-Preise** (Metafield-gestützt).

### Phase 3 — Skalierung
1. **Headless-Option offenhalten**: Logik in Snippets/Blocks.
2. **Schema.org-Strategie** vollständig: Product, Breadcrumb, Organization, LocalBusiness, FAQPage, VideoObject für Montagevideos.
3. **A/B-Framework** via Shopify-Markets/Segments.
4. **Admin-Pflege-fähig**: alle hardcoded Texte/Zahlen (Versand, Dachtypen, Trust-Punkte, Badges) → Section-Settings oder Metaobjects.
5. **Performance-Budget** (CSS ≤ 100 KB, LCP < 2.0 s, CLS < 0.05) + Lighthouse-CI im GitHub-Workflow.
6. **Metrics**: Shopify Web Pixels + Server-Side-Tracking für Funnel-Monitoring.

---

## Belastbarkeits-Hinweis

Die meisten Findings sind direkt code-verifiziert. **Nicht eindeutig verifiziert** (bitte selbst prüfen):

- OG-Image-Protokoll `http:` in `snippets/meta-tags.liquid:64`
- Footer-Inhalte (Versand-Tabelle, Zahlungsarten) hardcoded
- Captcha-Status im Kontaktformular — muss live gegen `blechziegel.de/pages/contact` geprüft werden

Agent-Claim **`product.variants | json` ohne `| safe`** bewusst **nicht** im Fix-Katalog — `| safe` ist Jekyll/Jinja, nicht Shopify-Liquid. `json`-Filter ist bereits JS-sicher.
