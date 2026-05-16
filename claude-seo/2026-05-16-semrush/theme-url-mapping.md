# Theme-/URL-Mapping blechziegel.de

Read-only Inventarisierung der relevanten Theme-Dateien fuer die Phase-2-Umsetzung.
**Keine Aenderungen.** Pfade relativ zum Repo-Root `sneakbrands/blechziegel`.

## Layout (global)

| Datei | Zweck | SEO-relevante Hooks |
|---|---|---|
| `layout/theme.liquid` | Globales Layout `<html>`/`<head>`/`<body>`-Frame | `<html lang>`, `meta-tags`-Render, EN-noindex-Guard (Z. 75-77), Collection-Meta-Description-Fallback (Z. 85-108), CCM19 + GTM Consent, Tidio-Positioning |
| `layout/password.liquid` | Passwort-Schutz | nicht produktiv-relevant |

## Templates (Template-Auswahl pro Routing)

| Template | Section-Type | Hinweis |
|---|---|---|
| `templates/index.json` | `blechziegel-home` | Startseite |
| `templates/product.json` | `blechziegel-product` | Alle Produkte ausser Zubehoer |
| `templates/product.zubehoer.json` | (separat) | Zubehoer-PDP |
| `templates/collection.json` | `blechziegel-collection` | Alle Collection-Seiten inkl. Hersteller-Collections (`/collections/braas` etc.) |
| `templates/page.json` | Page-Builder Sections | Default-Page-Template |
| `templates/page.hersteller.json` | `blechziegel-hersteller`-Block | `/pages/hersteller` Uebersichtsseite |
| `templates/page.contact.json` | `contact-blechziegel` | `/pages/contact` |
| `templates/page.ig.json` | `ig-linkinbio` | `/pages/ig` |
| `templates/article.json` | Blog-Artikel | Ratgeber-/News-Artikel |
| `templates/blog.json` | Blog-Index | `/blogs/neuigkeiten` |
| `templates/list-collections.json` | Sammlungs-Uebersicht | |
| `templates/search.json` | Suche | |
| `templates/cart.json` | Cart-Page | nicht indexrelevant |
| `templates/404.json` | 404 | |

## Sections (sichtbare Bloecke)

### Startseite
- `sections/blechziegel-home.liquid` -- Hero, USPs, Bestseller, Ziegel-Finder-Teaser, Trust, Hersteller-Block
- Eingebunden: kompakter Finder ueber `bz-finder-compact`

### Produkt
- `sections/blechziegel-product.liquid` -- PDP komplett (Above-the-fold-Block, Variant-Picker, Add-to-Cart, Brand-Pill, FAQ-Block, Zubehoer-Inline, JSON-LD Product + BreadcrumbList)
- `sections/featured-product.liquid` + `sections/featured-product-information.liquid` -- Horizon-Default fuer Featured-Product-Bloecke
- `sections/product-information.liquid` -- Horizon-Default-Hilfssection

### Collection / Hersteller
- `sections/blechziegel-collection.liquid` -- Collection-Page mit Hero, Filter-Sidebar (aktuell ausgeblendet), Produkt-Grid, Pagination, kompaktem Finder oben (`bz-finder-compact`)
- `sections/blechziegel-hersteller.liquid` -- Section fuer `/pages/hersteller` (Uebersicht der unterstuetzten Marken)

### Page-spezifische Sections
- `sections/contact-blechziegel.liquid` -- `/pages/contact` (Shopify-native `{% form 'contact' %}`)
- `sections/ig-linkinbio.liquid` -- `/pages/ig`
- `sections/footer.liquid` -- Globaler Footer (Adressblock, Legal, Mail-Link)
- `sections/header.liquid` -- Header (Nav, Logo)
- `sections/main-page.liquid`, `sections/main-blog-post.liquid` -- Horizon-Defaults

## Snippets — SEO / Produktdaten / FAQ / JSON-LD / Links

### SEO / Meta
- `snippets/meta-tags.liquid` -- `<title>`, `meta description`, OG-Tags, hreflang (Horizon-Default)
- `layout/theme.liquid` Collection-Meta-Fallback (s.o.)

### JSON-LD / Structured Data
- `sections/blechziegel-product.liquid` -- enthaelt Product-JSON-LD (Z. ~2293-2370) + BreadcrumbList-JSON-LD (Z. ~2370-2390); Brand dynamisch (erkannter Hersteller), AggregateOffer mit Lieferdetails, hasMerchantReturnPolicy
- `snippets/bz-product-faq.liquid` -- FAQ-Block (sichtbar) + JSON-LD-FAQPage (potenziell)

### Produktbeschreibungs- und Trust-Snippets
- `snippets/bz-product-card.liquid` + `snippets/bz-product-card-styles.liquid` -- Card-Render fuer Grids
- `snippets/bz-product-metafields.liquid` -- Tabelle Technische Daten (Laenge, Breite, Material, Hersteller)
- `snippets/bz-price-tax-note.liquid` -- Preis + MwSt-Hinweis (Privat/Gewerbe)
- `snippets/bz-customer-type-segment.liquid` -- B2B/B2C-Segmentierung

### Anfrage-/Formular-Snippets (Conversion-relevant fuer interne Verlinkung)
- `snippets/blechziegel-anfrage.liquid` -- `/pages/ziegel-anfrage` (FormSubmit, CC + Foto-Upload)
- `snippets/blechziegel-projekt-anfrage.liquid` -- `/pages/projekt-anfrage` (B2B)

### Content-Snippets (eigene Pages)
- `snippets/blechziegel-haendler.liquid` -- `/pages/haendler` (B2B-Partnerprogramm, FAQ)
- `snippets/blechziegel-gewerbe.liquid` -- `/pages/gewerbe` (Dachdecker-Zielgruppe, FAQ)
- `snippets/blechziegel-solar-installateure.liquid` -- `/pages/solar-installateure` (PV-Installateure, FAQ)
- `snippets/blechziegel-montage.liquid` -- Montageanleitungen mit/ohne Dachhaken (FAQ-Block + Schritte)
- `snippets/blechziegel-ratgeber.liquid` -- `/pages/ratgeber` (Ratgeber-Hub, FAQ)
- `snippets/blechziegel-hersteller.liquid` -- Uebersicht-Section eingebunden in `templates/page.hersteller.json`
- `snippets/blechziegel-ziegel-finder.liquid` -- `/pages/ziegel-finder` (3-Step-Flow + FAQ-Page-Body)
- `snippets/blechziegel-anfrage-erfolg.liquid` -- `/pages/anfrage-erfolg` (noindex, Success-Page)
- `snippets/blechziegel-versand.liquid` + `snippets/bz-versand-content.liquid` -- `/pages/versand`
- `snippets/blechziegel-impressum.liquid` + `snippets/bz-impressum-content.liquid` -- `/pages/impressum`
- `snippets/blechziegel-agb.liquid` + `snippets/bz-agb-content.liquid` -- `/pages/agb`
- `snippets/blechziegel-datenschutz.liquid` + `snippets/bz-datenschutz-content.liquid` -- `/pages/datenschutz`

### Globale UI / Conversion-Hooks
- `snippets/bz-nav-premium.liquid` -- Hauptnavigation
- `snippets/bz-cart-drawer.liquid` -- Cart-Drawer
- `snippets/bz-cookie-banner.liquid` -- Cookie-Banner (Consent-Mode v2)
- `snippets/bz-finder-compact.liquid` -- Top-Bereich /collections und Home
- `snippets/bz-finder-launcher.liquid` -- Floating-Button auf jeder Seite

### Helper-Snippets fuer Kontaktdaten
- `snippets/bz-contact.liquid` -- zentraler Lieferant fuer `email`, `phone`, `phone_href`, `has_phone`
- `snippets/bz-flag.liquid` -- Sprachflagge

## Daten-Assets
- `assets/ziegel-finder-data.json` -- 146-Profile-Dataset (Hersteller -> Profil -> Produkt-Handle), benutzt von:
  - `snippets/blechziegel-ziegel-finder.liquid` (Detail-Finder)
  - `snippets/bz-finder-compact.liquid`
  - `snippets/bz-finder-launcher.liquid`

## SEO-spezifisch zu pruefende Stellen

| Bereich | Wo | Hebel |
|---|---|---|
| H1 pro Page-Typ | jeweilige Section/Snippet | Suchintention vs. Title-Konsistenz |
| Meta-Title (Schreib-Empfaenger `global.title_tag`) | Shopify Admin -> Pages/Collections/Products | API-fix moeglich (per `metafieldsSet`) |
| Meta-Description (`global.description_tag`) | Shopify Admin (s.o.) | API-fix moeglich |
| Canonical | `meta-tags.liquid` (Horizon-Default) | meist OK, bei Tag-/Filter-URLs pruefen |
| hreflang | `meta-tags.liquid` + content_for_header | aktuell nur `de` published (EN unpublished) |
| Interne Links | `snippets/blechziegel-*.liquid` (Footer-Bereich der Pages) | Hub-Linking zwischen Page/Collection/Produkt staerken |
| JSON-LD Product | `sections/blechziegel-product.liquid` | bereits offers + brand_name + shippingDetails |
| JSON-LD FAQ | `snippets/blechziegel-*` mit FAQ-Bloecken | potentielle Erweiterung |
| Bilder-Alt | Theme-weit (Asset-Renders) | bei jedem `image_url` pruefen |
| robots.txt / sitemap.xml | Shopify-System, nicht im Theme | nicht direkt aenderbar |
