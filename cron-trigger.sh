#!/bin/bash

# Script to trigger the close-loads cron job
# Usage: ./cron-trigger.sh <APP_URL> <CRON_SECRET>

APP_URL="${1:-http://localhost:3000}"
CRON_SECRET="${2:-}"

if [ -z "$CRON_SECRET" ]; then
  echo "Error: CRON_SECRET is required"
  echo "Usage: $0 <APP_URL> <CRON_SECRET>"
  exit 1
fi

echo "[$(date)] Triggering close-loads cron job..."

curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  "$APP_URL/api/cron/close-loads"

echo ""
echo "[$(date)] Cron job trigger completed"
