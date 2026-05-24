@echo off
title Typing Game - Install Dependencies
cd /d "%~dp0"

echo.
echo =============================================
echo   Typing Game - Install
echo =============================================
echo.
echo Quick start: just double-click index.html
echo No installation needed for standalone mode.
echo.
echo Dependencies are only needed for Vite dev mode.
echo.

call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] Install failed. But you can still:
    echo   Just double-click index.html to play!
) else (
    echo.
    echo [OK] Dependencies installed!
    echo   Play: double-click index.html
    echo   Dev mode: npm run dev
)

echo.
pause
