# SEO-Zielseiten-Matrix blechziegel.de

> Produktabgrenzung verbindlich: blechziegel.de verkauft PV-Blechziegel / Aluminium-Ersatzdachziegel
> fuer PV-Montage — **keine stromerzeugenden Solarziegel**.

## Startseite

**URL:** `/`
**Template:** `templates/index.json` -> `sections/blechziegel-home.liquid`

**Zielkeywords:**
- PV-Blechziegel
- Blechziegel PV
- PV-Dachziegel aus Aluminium
- Aluminium-Ersatzdachziegel für PV-Montage

**Risiko:**
- klare Abgrenzung zu stromerzeugenden Solarziegeln erforderlich

**Zu pruefen:**
- H1
- Meta Title
- Meta Description
- Intro
- interne Links
- FAQ
- JSON-LD
- Produkt-/Kategorieverlinkung

## Herstellerseiten

**URL-Muster:** `/collections/<hersteller-handle>`
**Template:** `templates/collection.json` -> `sections/blechziegel-collection.liquid`
**Hersteller-Hub-Page:** `/pages/hersteller` -> `templates/page.hersteller.json` + `snippets/blechziegel-hersteller.liquid`

**Beispiele:**
- Braas (`/collections/braas`)
- Nelskamp (`/collections/nelskamp`)
- Creaton (`/collections/creaton`)
- Wienerberger (Hersteller-Handle noch zu pruefen)
- Bramac (`/collections/bramac`)

**Ziel:** Hersteller-/Modell-Suchintention abholen, ohne Marken-/Kompatibilitaetsrisiken falsch darzustellen.

**Zu pruefen:**
- H1
- Intro
- Modellverlinkung
- FAQ
- interne Links
- Filterlogik
- Canonical

## Produktseiten

**URL-Muster:** `/products/<handle>`
**Template:** `templates/product.json` -> `sections/blechziegel-product.liquid`

**Ziel:** Kaufnahe Suchintention und Modellbezug staerken.

**Pflicht:**
- keine Aussage, dass der Blechziegel Strom erzeugt
- klare Produktdefinition als Aluminium-Ersatzdachziegel für PV-Montage

## Ziegel-Finder

**URL:** `/pages/ziegel-finder`
**Snippet:** `snippets/blechziegel-ziegel-finder.liquid`

**Ziel:** SEO- und Conversion-Hub für Nutzer, die ihr Modell nicht kennen.

**Zu pruefen:**
- Indexierbarkeit
- sichtbarer Erklaerungstext
- interne Links
- FAQ
- Hersteller-/Modellpfade

## Ratgeberseiten

**URLs:**
- `/pages/ratgeber` (Ratgeber-Hub) -> `snippets/blechziegel-ratgeber.liquid`
- `/pages/montageanleitung-mit-dachhaken` + `/ohne-dachhaken` -> `snippets/blechziegel-montage.liquid`
- `/blogs/neuigkeiten` (Blog-Artikel) -> `templates/article.json`

**Potenziale:**
- Dachziegel mit PV-Halterung
- Ersatzdachziegel für Photovoltaik
- PV-Montage auf Ziegeldach
- Dachhaken ohne Ziegelbruch
- Blechersatzziegel PV
