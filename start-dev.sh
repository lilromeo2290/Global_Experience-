#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js dev server..." >> /tmp/dev-restart.log
  node node_modules/.bin/next dev -p 3000 -H 0.0.0.0 2>&1 | tee -a /home/z/my-project/dev.log
  echo "[$(date)] Server exited, restarting in 3s..." >> /tmp/dev-restart.log
  sleep 3
done
