# /usr/local/bin/startâ€‘springâ€‘app.sh
#!/usr/bin/env bash
set -e

# 1) Make sure the cluster service you need is up
sudo systemctl start pcscd.service        # â€¦and enable it once so it survives reboots
                                          #   sudo systemctl enable pcsd.service

# 2) run the Electron/Node app
cd /home/pi/project/spring2025-team05/app
npm run dev &                             # launches Electron

APP_PID=$!

# 3)  optional: shove the window to fullâ€‘screen
#     (F11 is the universal Electron â€œtoggle fullâ€‘screenâ€)
sleep 8                                   # give the window time to appear
xdotool search --onlyvisible --name "Electron" windowactivate --sync key F11

wait "$APP_PID"

