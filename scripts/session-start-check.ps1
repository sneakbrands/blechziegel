#Requires -Version 5.1
<#
  Session-Start-Check fuer blechziegel-theme
  Wird per SessionStart-Hook aus .claude/settings.json aufgerufen.
  Ziel: in <5 Sekunden die kritischen Verbindungen validieren und eine knappe
  Statuszeile ausgeben.

  Prueft:
    1. Git-Branch == main
    2. Git-Remote ist das korrekte Repo (sneakbrands/blechziegel)
    3. Stock-Monitor-Bot Scheduled-Task State
    4. Shopify Admin API erreichbar (single shop.json Ping, 3s timeout)

  Ausgabe: eine Zeile pro Check mit Prefix Check Green / Check Red.
  Exit-Code: 0 immer (Hook darf Session-Start nicht blocken).
#>

$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'

$root = 'C:\Users\Administrator\blechziegel-theme'
$okSym = '[OK]'
$warnSym = '[WARN]'
$errSym = '[ERR]'

Write-Host ""
Write-Host "--- Blechziegel Session-Start-Check ---"

# 1) Branch
try {
  $branch = (& git -C $root branch --show-current 2>$null).Trim()
  if ($branch -eq 'main') {
    Write-Host "$okSym  Branch: main"
  } else {
    Write-Host "$warnSym Branch: $branch  (CLAUDE.md verlangt main; STOP und Benutzer fragen vor Aenderungen)"
  }
} catch {
  Write-Host "$errSym Branch: git nicht aufrufbar"
}

# 2) Remote
try {
  $remote = (& git -C $root remote get-url origin 2>$null).Trim()
  if ($remote -match 'sneakbrands/blechziegel') {
    Write-Host "$okSym  Remote: $remote"
  } else {
    Write-Host "$warnSym Remote weicht ab: $remote"
  }
} catch {
  Write-Host "$errSym Remote: git nicht aufrufbar"
}

# 3) Stock-Monitor-Bot (Scheduled Task)
$task = Get-ScheduledTask -TaskName 'Blechziegel Stock Monitor Bot' -ErrorAction SilentlyContinue
if ($task) {
  $info = $task | Get-ScheduledTaskInfo -ErrorAction SilentlyContinue
  $lastResult = if ($info) { $info.LastTaskResult } else { 'n/a' }
  $lastRun = if ($info -and $info.LastRunTime) { $info.LastRunTime.ToString('yyyy-MM-dd HH:mm') } else { 'n/a' }
  if ($task.State -in @('Ready','Running') -and ($lastResult -eq 0 -or $lastResult -eq 267011)) {
    Write-Host "$okSym  Stock-Monitor-Bot: $($task.State) (letzter Run $lastRun)"
  } else {
    Write-Host "$warnSym Stock-Monitor-Bot: $($task.State), LastResult=$lastResult"
  }
} else {
  Write-Host "$warnSym Stock-Monitor-Bot: Task nicht registriert (siehe LStockagent/install-bot-task.ps1)"
}

# 4) Shopify Admin API Ping
try {
  $envPath = 'C:\Users\Administrator\blechziegel-admin-tools\.env'
  if (Test-Path $envPath) {
    $envLines = Get-Content $envPath | Where-Object { $_ -and -not $_.StartsWith('#') }
    $envMap = @{}
    foreach ($line in $envLines) {
      $i = $line.IndexOf('=')
      if ($i -gt 0) { $envMap[$line.Substring(0, $i).Trim()] = $line.Substring($i + 1).Trim() }
    }
    $shop = $envMap['SHOP_DOMAIN']
    $tok = $envMap['SHOPIFY_ADMIN_TOKEN']
    if ($shop -and $tok) {
      $resp = Invoke-WebRequest -Uri "https://$shop/admin/api/2025-01/shop.json" -Headers @{ 'X-Shopify-Access-Token' = $tok; 'Accept' = 'application/json' } -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
      if ($resp.StatusCode -eq 200) {
        $name = ($resp.Content | ConvertFrom-Json).shop.name
        Write-Host "$okSym  Shopify: $name erreichbar ($shop)"
      } else {
        Write-Host "$warnSym Shopify: HTTP $($resp.StatusCode)"
      }
    } else {
      Write-Host "$warnSym Shopify: SHOP_DOMAIN oder SHOPIFY_ADMIN_TOKEN fehlt in .env"
    }
  } else {
    Write-Host "$warnSym Shopify: .env nicht gefunden ($envPath)"
  }
} catch {
  Write-Host "$warnSym Shopify: nicht erreichbar ($($_.Exception.Message.Split([Environment]::NewLine)[0]))"
}

Write-Host "---"
Write-Host ""
exit 0
