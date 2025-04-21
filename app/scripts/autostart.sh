# /usr/local/bin/start‑spring‑app.sh
#!/usr/bin/env bash
set -e

# 1) Make sure the cluster service you need is up
sudo systemctl start pcsd.service        # …and enable it once so it survives reboots
                                          #   sudo systemctl enable pcsd.service

# 2) run the Electron/Node app
cd /project/spring/app
npm run dev &                             # launches Electron

APP_PID=$!

# 3)  optional: shove the window to full‑screen
#     (F11 is the universal Electron “toggle full‑screen”)
sleep 8                                   # give the window time to appear
xdotool search --onlyvisible --name "Electron" windowactivate --sync key F11

wait "$APP_PID"
