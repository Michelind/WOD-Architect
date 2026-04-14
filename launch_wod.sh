#!/bin/bash
# WOD Architect — Local PWA Launcher
# Double-click this file (or run in Terminal) to start the app

PORT=8080
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════╗"
echo "║      WOD ARCHITECT LAUNCHER      ║"
echo "╚══════════════════════════════════╝"
echo ""
echo "📂 Serving from: $DIR"
echo "🌐 Opening:      http://localhost:$PORT/index.html"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Open browser after short delay
(sleep 1.5 && open "http://localhost:$PORT/index.html") &

# Start Python server
cd "$DIR"
python3 -m http.server $PORT
