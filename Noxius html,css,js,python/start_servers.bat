@echo off
echo Starting NoxAi.py server...
start /B python NoxAi.py

echo Starting inventory.py server...
start /B python inventory.py

echo Both servers are starting in the background.
pause
