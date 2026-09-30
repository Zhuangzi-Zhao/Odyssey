import subprocess
import time
import urllib.request
import json
import asyncio
import sys

# Start Chrome in headless mode with debugging port
cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "file:///f:/Projects/Project_Vibe/Odyssey/index.html"
]

proc = subprocess.Popen(cmd)
time.sleep(2)

try:
    # Query targets
    req = urllib.request.urlopen("http://127.0.0.1:9222/json")
    targets = json.loads(req.read().decode())
    print("Chrome targets:", targets)
    ws_url = targets[0]["webSocketDebuggerUrl"]
    print("WebSocket URL:", ws_url)
except Exception as e:
    print("Error querying Chrome:", e)
finally:
    proc.terminate()
