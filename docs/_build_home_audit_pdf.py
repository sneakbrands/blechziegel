"""Build PDF for HOME_UX_SEO_AUDIT.md via Chrome Headless."""
import markdown, subprocess, datetime
from pathlib import Path

ROOT = Path(__file__).parent
MD = ROOT / "HOME_UX_SEO_AUDIT.md"
HTML = ROOT / "HOME_UX_SEO_AUDIT.html"
PDF = ROOT / "HOME_UX_SEO_AUDIT.pdf"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

body = markdown.markdown(
    MD.read_text(encoding="utf-8"),
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
)
today = datetime.date.today().strftime("%d.%m.%Y")

html = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Home UX + SEO Audit · blechziegel.de</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root {{ --navy:#0a2240; --navy-lt:#163660; --orange:#ffa500; --orange-dk:#e69400;
           --text:#222; --muted:#5a6271; --border:#e5e7eb; --bg-soft:#f8f9fb; }}
  * {{ box-sizing:border-box; }}
  html,body {{ margin:0; padding:0; font-family:'Open Sans',sans-serif;
    color:var(--text); font-size:10.5pt; line-height:1.55; }}
  .page {{ max-width:790px; margin:0 auto; padding:42px 50px 50px; }}
  .brand {{ display:flex; align-items:center; justify-content:space-between;
    padding-bottom:16px; margin-bottom:28px; border-bottom:3px solid var(--orange); }}
  .brand__name {{ font-family:'Montserrat',sans-serif; font-weight:800;
    font-size:16pt; color:var(--navy); letter-spacing:-0.01em; }}
  .brand__name em {{ color:var(--orange); font-style:normal; }}
  .brand__meta {{ font-size:8.5pt; color:var(--muted); text-align:right;
    font-family:'Montserrat',sans-serif; font-weight:600; }}
  h1 {{ font-family:'Montserrat',sans-serif; font-weight:800;
    font-size:20pt; color:var(--navy); line-height:1.18;
    margin:6pt 0 14pt; padding-bottom:8pt; border-bottom:2px solid var(--orange);
    display:inline-block; }}
  h2 {{ font-family:'Montserrat',sans-serif; font-weight:800;
    font-size:13pt; color:var(--navy); margin:22pt 0 8pt;
    padding-bottom:4pt; border-bottom:1px solid var(--border); }}
  h3 {{ font-family:'Montserrat',sans-serif; font-weight:700;
    font-size:11pt; color:var(--navy); margin:14pt 0 4pt; }}
  p {{ margin:0 0 8pt; }}
  strong {{ color:var(--navy); font-weight:700; }}
  code {{ background:var(--bg-soft); border:1px solid var(--border);
    border-radius:3px; padding:1px 6px; font-size:9.5pt;
    font-family:'Consolas','Courier New',monospace; color:var(--navy); }}
  ul,ol {{ margin:4pt 0 10pt; padding-left:20pt; }}
  li {{ margin-bottom:3pt; }}
  table {{ width:100%; border-collapse:collapse; margin:8pt 0 14pt;
    font-size:9.5pt; }}
  th,td {{ text-align:left; padding:6pt 8pt; vertical-align:top;
    border-bottom:1px solid var(--border); }}
  th {{ background:var(--navy); color:#fff; font-family:'Montserrat',sans-serif;
    font-weight:700; font-size:9pt; text-transform:uppercase;
    letter-spacing:0.04em; border-bottom:none; }}
  tr:nth-child(even) td {{ background:var(--bg-soft); }}
  hr {{ border:none; border-top:1px solid var(--border); margin:20pt 0; }}
  a {{ color:var(--orange-dk); text-decoration:none; }}
  blockquote {{ border-left:3px solid var(--orange); padding:6pt 14pt;
    margin:10pt 0; background:var(--bg-soft); color:var(--muted); }}
  @page {{ size:A4; margin:16mm 14mm 18mm 14mm; }}
  @page:first {{ margin-top:0mm; }}
  .footer-note {{ margin-top:28pt; padding-top:14pt;
    border-top:1px solid var(--border); font-size:8.5pt;
    color:var(--muted); text-align:center; }}
</style>
</head>
<body>
<div class="page">
  <div class="brand">
    <div class="brand__name">blechziegel<em>.</em>de</div>
    <div class="brand__meta">Enterprise UX + SEO Audit<br>Stand: {today}</div>
  </div>
  {body}
  <div class="footer-note">
    blechziegel.de · TiWi Trade GmbH · Branch feat/ziegel-finder-enterprise<br>
    Master-Referenz für Design-DNA: /pages/gewerbe
  </div>
</div>
</body>
</html>
"""

HTML.write_text(html, encoding="utf-8")

subprocess.run([
    CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
    "--print-to-pdf-no-header",
    f"--print-to-pdf={PDF}",
    HTML.as_uri(),
], check=True)

print(f"OK: {PDF.relative_to(ROOT.parent)}  ({PDF.stat().st_size//1024} KB)")
