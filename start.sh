#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev -p 3000 -H 0.0.0.0 2>&1
  echo "[$(date)] Server crashed, restarting in 2s..." >> /home/z/my-project/restart.log
  sleep 2
done
