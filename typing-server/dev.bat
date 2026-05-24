@echo off
title Typing Game - Backend Server
cd /d "%~dp0"

echo.
echo ======================================
echo   Typing Game - Backend Server
echo ======================================
echo.

echo [1/2] Building...
cargo build --release 2>nul
if errorlevel 1 (
    echo [INFO] First build (debug mode)...
    cargo build
    if errorlevel 1 (
        echo [ERROR] Build failed! Is Rust installed?
        pause
        exit /b 1
    )
) else (
    echo [OK] Release build complete
)

echo.
echo [2/2] Starting server...
echo.
echo API: http://127.0.0.1:8080
echo.
echo Endpoints:
echo   GET  /api/health
echo   GET  /api/words
echo   POST /api/scores
echo   GET  /api/scores/top
echo.
echo Press Ctrl+C to stop
echo.

cargo run

pause
