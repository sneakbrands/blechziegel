#!/usr/bin/env bash
# Shopify CLI Verbindungstest für blechziegel.de
SHOPIFY="$APPDATA/npm/shopify"
STORE="blechziegel-de.myshopify.com"
THEME="193125220736"

echo "=== Shopify CLI Verbindungstest ==="
echo ""

# 1. CLI vorhanden?
if [ ! -f "$SHOPIFY" ]; then
  echo "[FAIL] Shopify CLI nicht gefunden unter $SHOPIFY"
  exit 1
fi
echo "[OK] Shopify CLI gefunden: $($SHOPIFY version)"

# 2. Auth prüfen
echo ""
echo "Teste Verbindung zu $STORE ..."
OUTPUT=$("$SHOPIFY" theme list --store "$STORE" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "[FAIL] Nicht autorisiert oder Verbindung fehlgeschlagen:"
  echo "$OUTPUT"
  echo ""
  echo ">>> Fix: Bitte einmalig ausführen:"
  echo "    $SHOPIFY auth login --store blechziegel.de"
  exit 1
fi

echo "[OK] Verbindung zu $STORE erfolgreich"
echo ""
echo "Installierte Themes:"
echo "$OUTPUT"

# 3. Live-Theme prüfen
echo ""
if echo "$OUTPUT" | grep -q "$THEME"; then
  echo "[OK] Theme #$THEME gefunden (blechziegel/main, live)"
else
  echo "[WARN] Theme #$THEME nicht in der Liste gefunden"
fi

echo ""
echo "=== Konfiguration ==="
echo "Store:  $STORE"
echo "Theme:  #$THEME"
echo "Push:   $SHOPIFY theme push --store $STORE --theme $THEME"
echo "Pull:   $SHOPIFY theme pull --store $STORE --theme $THEME"
echo "Dev:    $SHOPIFY theme dev --store $STORE --theme $THEME"
