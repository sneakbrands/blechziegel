"""Build Blechziegel-CI PDF from AUDIT_H7.md via Chrome Headless."""
import markdown
import subprocess
import datetime
from pathlib import Path

ROOT = Path(__file__).parent
MD = ROOT / "AUDIT_H7.md"
HTML = ROOT / "AUDIT_H7.html"
PDF = ROOT / "AUDIT_H7.pdf"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

md_text = MD.read_text(encoding="utf-8")
body = markdown.markdown(
    md_text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
)

today = datetime.date.today().strftime("%d.%m.%Y")

html = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>H7 Enterprise-Audit · blechziegel.de</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {{
    --bz-navy: #0d1e35;
    --bz-navy-mid: #152840;
    --bz-orange: #f5a623;
    --bz-orange-dark: #d4891a;
    --bz-orange-light: #fff4e0;
    --bz-surface: #f8f8f6;
    --bz-surface-2: #efede8;
    --bz-border: rgba(13, 30, 53, 0.08);
    --bz-text: #1a1a18;
    --bz-muted: #5a5955;
  }}

  @page {{
    size: A4;
    margin: 18mm 16mm 22mm 16mm;
    @bottom-left {{ content: "H7 Enterprise-Audit · blechziegel.de"; font-family: 'Open Sans', sans-serif; font-size: 9pt; color: #5a5955; }}
    @bottom-right {{ content: "Seite " counter(page) " / " counter(pages); font-family: 'Open Sans', sans-serif; font-size: 9pt; color: #5a5955; }}
  }}

  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; }}

  body {{
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: var(--bz-text);
    background: #fff;
  }}

  .cover {{
    page-break-after: always;
    min-height: 255mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16mm 14mm;
    background: linear-gradient(135deg, var(--bz-navy) 0%, var(--bz-navy-mid) 100%);
    color: #fff;
    margin: -18mm -16mm -22mm -16mm;
  }}

  .cover-head {{
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 18mm;
    border-bottom: 3px solid var(--bz-orange);
  }}

  .cover-logo {{
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 26pt;
    letter-spacing: -0.02em;
  }}
  .cover-logo span {{ color: var(--bz-orange); }}
  .cover-tag {{
    font-family: 'Montserrat', sans-serif;
    font-size: 9pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin-top: 4px;
  }}

  .cover-body {{
    padding: 20mm 0;
  }}
  .cover-kicker {{
    display: inline-block;
    background: rgba(245, 166, 35, 0.15);
    border: 1px solid rgba(245, 166, 35, 0.45);
    color: var(--bz-orange);
    font-family: 'Montserrat', sans-serif;
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
  }}
  .cover-title {{
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 38pt;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
    max-width: 160mm;
  }}
  .cover-sub {{
    font-size: 13pt;
    line-height: 1.5;
    color: rgba(255,255,255,0.75);
    max-width: 150mm;
    font-weight: 400;
  }}

  .cover-meta {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10mm;
    padding-top: 16mm;
    border-top: 1px solid rgba(255,255,255,0.15);
  }}
  .cover-meta-item {{
    font-family: 'Montserrat', sans-serif;
  }}
  .cover-meta-label {{
    font-size: 8.5pt;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 6px;
  }}
  .cover-meta-value {{
    font-size: 11.5pt;
    font-weight: 700;
    color: #fff;
  }}

  .content {{
    padding: 0;
  }}

  h1, h2, h3, h4 {{
    font-family: 'Montserrat', sans-serif;
    color: var(--bz-navy);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }}

  h1 {{
    font-size: 22pt;
    font-weight: 800;
    margin: 0 0 14px;
    padding-bottom: 10px;
    border-bottom: 3px solid var(--bz-orange);
    page-break-before: always;
  }}
  h1:first-of-type {{ page-break-before: auto; }}

  h2 {{
    font-size: 15pt;
    font-weight: 700;
    margin: 22px 0 10px;
    padding-left: 10px;
    border-left: 4px solid var(--bz-orange);
    page-break-after: avoid;
  }}

  h3 {{
    font-size: 12pt;
    font-weight: 700;
    margin: 18px 0 8px;
    color: var(--bz-navy);
    page-break-after: avoid;
  }}

  p {{ margin: 6px 0 10px; }}

  ol, ul {{ margin: 6px 0 12px; padding-left: 22px; }}
  ol li, ul li {{ margin-bottom: 4px; }}

  strong {{ color: var(--bz-navy); font-weight: 700; }}

  code {{
    font-family: 'Consolas', 'SF Mono', monospace;
    font-size: 9pt;
    background: var(--bz-surface);
    border: 1px solid var(--bz-border);
    border-radius: 4px;
    padding: 1px 5px;
    color: var(--bz-navy);
  }}
  pre {{
    background: var(--bz-surface);
    border: 1px solid var(--bz-border);
    border-left: 4px solid var(--bz-orange);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 9pt;
    overflow-x: auto;
    line-height: 1.45;
    page-break-inside: avoid;
  }}
  pre code {{ background: transparent; border: none; padding: 0; }}

  blockquote {{
    margin: 10px 0;
    padding: 10px 14px;
    background: var(--bz-orange-light);
    border-left: 4px solid var(--bz-orange);
    border-radius: 6px;
    color: var(--bz-text);
    font-size: 10pt;
  }}
  blockquote p {{ margin: 0; }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }}
  thead tr {{ background: var(--bz-navy); color: #fff; }}
  th, td {{
    padding: 7px 9px;
    border-bottom: 1px solid var(--bz-border);
    text-align: left;
    vertical-align: top;
  }}
  th {{
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 9pt;
    letter-spacing: 0.02em;
  }}
  tbody tr:nth-child(even) td {{ background: var(--bz-surface); }}

  hr {{
    border: none;
    border-top: 1px solid var(--bz-border);
    margin: 18px 0;
  }}

  a {{ color: var(--bz-orange-dark); text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}

  h1 + p, h2 + p {{ margin-top: 0; }}
</style>
</head>
<body>

<section class="cover">
  <div class="cover-head">
    <div>
      <div class="cover-logo">blech<span>ziegel</span>.de</div>
      <div class="cover-tag">Made in Germany · B2B · PV-Montage</div>
    </div>
  </div>

  <div class="cover-body">
    <div class="cover-kicker">H7 Enterprise-Audit · E2E Playwright + CLI</div>
    <h1 class="cover-title">End-to-End Audit<br>Desktop &amp; Mobile</h1>
    <p class="cover-sub">Automatisierter Audit aller Shop-Seiten via Playwright (Desktop 1440x900 + iPhone 13) und Shopify CLI Theme Check. 46 Tests, Screenshot-Evidenz, Conversion-Analyse.</p>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="cover-meta-label">Shop</div>
      <div class="cover-meta-value">blechziegel.de</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Theme</div>
      <div class="cover-meta-value">Horizon 3.5.0 · #193125220736</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Datum</div>
      <div class="cover-meta-value">{today}</div>
    </div>
  </div>
</section>

<main class="content">
{body}
</main>

</body>
</html>
"""

HTML.write_text(html, encoding="utf-8")
print(f"HTML written: {HTML} ({HTML.stat().st_size/1024:.1f} KB)")

# Chrome Headless -> PDF
url = "file:///" + str(HTML).replace("\\", "/")
cmd = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF}",
    "--print-to-pdf-no-header",
    "--hide-scrollbars",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=10000",
    url,
]
print("Running Chrome headless...")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
if result.returncode != 0:
    print("STDERR:", result.stderr[-500:])
print(f"PDF written: {PDF} ({PDF.stat().st_size/1024:.1f} KB)")
