# Shopify Admin API Diagnose für blechziegel (PowerShell)
# Nutzung im Terminal:
#   cd c:/Users/Administrator/blechziegel-theme
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/shopify-api-check.ps1
#
# Liest c:/Users/Administrator/blechziegel-admin-tools/.env
# Erwartete Variablen: SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOP_DOMAIN, SHOPIFY_ADMIN_TOKEN

$ErrorActionPreference = 'Continue'

# ── .env einlesen ─────────────────────────────────────────────────
$envPath = 'c:/Users/Administrator/blechziegel-admin-tools/.env'
if (-not (Test-Path $envPath)) { Write-Host "FEHLT: $envPath" -ForegroundColor Red; exit 1 }

$env = @{}
Get-Content $envPath | Where-Object { $_ -and -not $_.StartsWith('#') } | ForEach-Object {
  $i = $_.IndexOf('=')
  if ($i -gt 0) { $env[$_.Substring(0, $i).Trim()] = $_.Substring($i + 1).Trim() }
}

$SHOP     = if ($env.SHOP_DOMAIN) { $env.SHOP_DOMAIN } else { 'blechziegel.myshopify.com' }
$TOK      = $env.SHOPIFY_ADMIN_TOKEN
$CID      = $env.SHOPIFY_CLIENT_ID
$SEC      = $env.SHOPIFY_CLIENT_SECRET
$VER      = '2025-01'
$BASE     = "https://$SHOP/admin/api/$VER"
$THEME_ID = 193125220736
$KEY      = 'sections/blechziegel-product.liquid'

function OK    ($msg) { Write-Host "✓ $msg" -ForegroundColor Green }
function FAIL  ($msg) { Write-Host "✗ $msg" -ForegroundColor Red }
function WARN  ($msg) { Write-Host "! $msg" -ForegroundColor Yellow }
function LABEL ($msg) { Write-Host "`n── $msg ──" -ForegroundColor Cyan }

function Prefix($s, $n) { if (-not $s) { return '(leer)' } else { return $s.Substring(0, [Math]::Min($n, $s.Length)) } }

# Invoke-WebRequest sauberer Wrapper, der auch bei 4xx/5xx kein Exception wirft
function Invoke-Http {
  param([string]$Method = 'GET', [string]$Url, [hashtable]$Headers, [string]$Body)
  $params = @{ Uri = $Url; Method = $Method; Headers = $Headers; UseBasicParsing = $true; SkipHttpErrorCheck = $true; ErrorAction = 'SilentlyContinue' }
  if ($Body) { $params.Body = $Body; if (-not $Headers.ContainsKey('Content-Type')) { $params.ContentType = 'application/json' } }
  try {
    $resp = Invoke-WebRequest @params
    return @{ Status = [int]$resp.StatusCode; Body = $resp.Content }
  } catch {
    # Fallback: einige PowerShell-Versionen werfen bei fehlendem SkipHttpErrorCheck
    $webex = $_.Exception.Response
    if ($webex) {
      $reader = New-Object System.IO.StreamReader($webex.GetResponseStream())
      $body = $reader.ReadToEnd()
      return @{ Status = [int]$webex.StatusCode; Body = $body }
    }
    return @{ Status = 0; Body = $_.Exception.Message }
  }
}

# ── Übersicht ────────────────────────────────────────────────────
Write-Host "Shopify API Diagnose" -ForegroundColor White
Write-Host "  SHOP          : $SHOP"
Write-Host "  API_VERSION   : $VER"
Write-Host "  THEME_ID      : $THEME_ID"
Write-Host "  CLIENT_ID     : $(if ($CID) { "gesetzt ($($CID.Length) chars, prefix: $(Prefix $CID 8))" } else { 'FEHLT' })"
Write-Host "  CLIENT_SECRET : $(if ($SEC) { "gesetzt (prefix: $(Prefix $SEC 6))" } else { 'FEHLT' })"
Write-Host "  ADMIN_TOKEN   : $(if ($TOK) { "gesetzt (prefix: $(Prefix $TOK 6))" } else { 'FEHLT' })"

if (-not $TOK) { FAIL 'SHOPIFY_ADMIN_TOKEN fehlt. Bitte in .env eintragen (Wert beginnt mit shpat_...).'; exit 2 }
if (-not $TOK.StartsWith('shpat_')) {
  WARN "SHOPIFY_ADMIN_TOKEN beginnt mit '$(Prefix $TOK 6)', erwartet 'shpat_'. Wahrscheinlich Client-Secret statt Admin-API-Token kopiert."
}

$H = @{ 'X-Shopify-Access-Token' = $TOK; 'Accept' = 'application/json' }

# ── 1) shop.json ──────────────────────────────────────────────────
LABEL '1) Grundauth — GET /shop.json'
$r = Invoke-Http -Url "$BASE/shop.json" -Headers $H
if ($r.Status -eq 200) {
  OK "Status $($r.Status) — App ist installiert und Admin-Token ist gültig"
  try { $j = $r.Body | ConvertFrom-Json; Write-Host "   shop.name: $($j.shop.name)   plan: $($j.shop.plan_display_name)" } catch {}
} else {
  FAIL "Status $($r.Status): $($r.Body.Substring(0, [Math]::Min(200, $r.Body.Length)))"
}

# ── 2) client_credentials ─────────────────────────────────────────
LABEL '2) App-Install-Check — client_credentials grant'
if ($CID -and $SEC) {
  $body = @{ client_id = $CID; client_secret = $SEC; grant_type = 'client_credentials' } | ConvertTo-Json -Compress
  $r = Invoke-Http -Method 'POST' -Url "https://$SHOP/admin/oauth/access_token" -Headers @{ 'Content-Type' = 'application/json'; 'Accept' = 'application/json' } -Body $body
  if ($r.Body -match 'app_not_installed') {
    FAIL 'App ist NICHT auf dem Shop installiert. Admin → Apps entwickeln → deine App → "App installieren" klicken.'
  } elseif ($r.Status -eq 200) {
    OK 'OAuth-Roundtrip funktioniert'
  } else {
    WARN "Status $($r.Status): $($r.Body.Substring(0, [Math]::Min(200, $r.Body.Length)))"
  }
} else {
  WARN 'CLIENT_ID oder CLIENT_SECRET fehlen — Test uebersprungen'
}

# ── 3) themes.json ────────────────────────────────────────────────
LABEL '3) Theme-Scope — GET /themes.json'
$r = Invoke-Http -Url "$BASE/themes.json" -Headers $H
if ($r.Status -eq 200) {
  OK "Status $($r.Status) — read_themes Scope ist aktiv"
  try {
    $j = $r.Body | ConvertFrom-Json
    $main = $j.themes | Where-Object { $_.role -eq 'main' } | Select-Object -First 1
    if ($main) {
      OK "Live-Theme: id=$($main.id) name=$($main.name) (role=main)"
      if ($main.id -ne $THEME_ID) { WARN "Hard-coded THEME_ID $THEME_ID <> live $($main.id)" }
    }
  } catch {}
} elseif ($r.Status -eq 403) {
  FAIL "Status 403: $($r.Body.Substring(0, [Math]::Min(200, $r.Body.Length)))"
  WARN 'Scope read_themes fehlt. Admin → App → Konfiguration → Scopes: write_themes, read_themes aktivieren, dann App NEU INSTALLIEREN (= neuer Token).'
} else {
  FAIL "Status $($r.Status): $($r.Body.Substring(0, [Math]::Min(200, $r.Body.Length)))"
}

# ── 4) Asset GET ──────────────────────────────────────────────────
LABEL "4) Asset lesen — GET /themes/$THEME_ID/assets.json?asset[key]=$KEY"
$url = "$BASE/themes/$THEME_ID/assets.json?asset%5Bkey%5D=$([System.Uri]::EscapeDataString($KEY))"
$r = Invoke-Http -Url $url -Headers $H
if ($r.Status -eq 200) {
  OK "Status $($r.Status) — Asset lesbar"
  try {
    $j = $r.Body | ConvertFrom-Json
    $val = $j.asset.value
    Write-Host "   size: $($val.Length) bytes"
    Write-Host "   enthaelt H6 Multi-Brand-Pill  (bz-product-brand-link--multi): $(if ($val -match 'bz-product-brand-link--multi') { 'JA' } else { 'NEIN' })"
    Write-Host "   enthaelt H6 Zubehoer-Block     (bz-addon-block)              : $(if ($val -match 'bz-addon-block') { 'JA' } else { 'NEIN' })"
  } catch {}
} else {
  FAIL "Status $($r.Status): $($r.Body.Substring(0, [Math]::Min(200, $r.Body.Length)))"
}

# ── 5) Write-Test (No-Op PUT mit aktuell gelesenem Wert) ──────────
LABEL '5) Write-Scope — pruefen ob write_themes nutzbar ist (No-Op PUT)'
$live = Invoke-Http -Url $url -Headers $H
if ($live.Status -ne 200) {
  WARN "Lese-Check fehlgeschlagen (Status $($live.Status)) — Write-Test uebersprungen"
} else {
  try {
    $j = $live.Body | ConvertFrom-Json
    $val = $j.asset.value
    if (-not $val) { WARN 'asset.value leer — Write-Test uebersprungen' }
    else {
      $putBody = @{ asset = @{ key = $KEY; value = $val } } | ConvertTo-Json -Depth 5 -Compress
      $putH = $H.Clone(); $putH['Content-Type'] = 'application/json'
      $p = Invoke-Http -Method 'PUT' -Url "$BASE/themes/$THEME_ID/assets.json" -Headers $putH -Body $putBody
      if ($p.Status -eq 200) {
        OK "Status $($p.Status) — write_themes Scope ist aktiv (No-Op PUT akzeptiert)"
      } elseif ($p.Status -eq 403) {
        FAIL 'Status 403 — write_themes Scope fehlt. Scopes erweitern + App neu installieren.'
      } else {
        WARN "Status $($p.Status): $($p.Body.Substring(0, [Math]::Min(200, $p.Body.Length)))"
      }
    }
  } catch {
    WARN "Parse-Fehler: $($_.Exception.Message)"
  }
}

# ── Zusammenfassung ──────────────────────────────────────────────
LABEL 'Zusammenfassung'
Write-Host 'Wenn alle Tests gruen sind, kann das Theme-Repo direkt via API gepusht werden.'
Write-Host ''
Write-Host 'Typische Fixes:'
Write-Host '  - 401 ueberall        -> Admin-Token (shpat_...) in .env falsch/veraltet -> App neu installieren'
Write-Host '  - app_not_installed   -> Admin → App → "App installieren" klicken'
Write-Host '  - 403 bei theme-calls -> Scopes write_themes, read_themes fehlen -> aktivieren + REINSTALL'
Write-Host '  - shpss_ statt shpat_ -> Client-Secret statt Admin-Token kopiert -> richtige Sektion suchen'
