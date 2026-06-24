#!/bin/bash
# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 1

cd /home/z/my-project

# Use nohup + setsid + disown with all fds redirected
nohup setsid bash -c '
  exec node /home/z/my-project/node_modules/.bin/next dev -p 3000 -H 0.0.0.0
' > /tmp/next-detached.log 2>&1 < /dev/null &

LAUNCH_PID=$!
disown $LAUNCH_PID 2>/dev/null

# Wait up to 25 seconds for the server to respond
for i in $(seq 1 25); do
  if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 http://localhost:3000/ 2>/dev/null | grep -q "200"; then
    echo "READY after ${i}s"
    echo "PID: $(pgrep -f 'next-server' | head -1)"
    exit 0
  fi
  sleep 1
done

echo "TIMEOUT after 25s"
echo "--- Last 30 log lines ---"
tail -30 /tmp/next-detached.log 2>/dev/null
exit 1
