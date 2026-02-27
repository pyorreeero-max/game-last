@echo off
setlocal

cd /d "%~dp0"

echo ======================================
echo   Starting game-last (Windows helper)
echo ======================================

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] npm was not found.
  echo Install Node.js LTS from https://nodejs.org/ then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo.
  echo [Setup] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

if not exist .env.local (
  echo.
  echo [Setup] Creating .env.local from .env.example
  copy /Y .env.example .env.local >nul
  echo [ACTION REQUIRED] Open .env.local and set GEMINI_API_KEY.
)

echo.
echo [Run] Starting dev server...
echo Open: http://localhost:3000
call npm run dev

endlocal
