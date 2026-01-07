@echo off
echo Starting Life in the UK Study App with Database...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server on http://localhost:3000
echo.
start http://localhost:3000
node server.js
