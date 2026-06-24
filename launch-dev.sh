#!/bin/bash
# Kill any existing
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 1

# Start in a new session with setsid
cd /home/z/my-project
exec setsid node node_modules/.bin/next dev -p 3000 -H 0.0.0.0 > /home/z/my-project/dev.log 2>&1
