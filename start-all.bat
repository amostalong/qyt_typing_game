@echo off
chcp 65001 >nul
title Typing - Launcher
cd /d "%~dp0"

echo.
echo ========================================
echo     Keyboard Warrior - Launcher
echo ========================================
echo.
echo   [1] Web preview (Vite, fastest)
echo   [2] Server + Web
echo   [3] Tauri desktop
echo   [4] All (Server + Tauri)
echo.
set /p mode="  Choose (1/2/3/4, default 1): "
if "%mode%"=="" set mode=1

if exist "typing-kids\node_modules" goto dispatch
echo.
echo Installing frontend deps...
cd typing-kids
call npm install
if errorlevel 1 (
    echo [FAIL] npm install failed
    pause
    exit /b 1
)
cd ..

:dispatch
if "%mode%"=="1" goto web
if "%mode%"=="2" goto srvweb
if "%mode%"=="3" goto tauri
if "%mode%"=="4" goto all
goto web

:web
echo.
echo Starting Vite (port 3000)...
echo Open: http://localhost:3000
echo.
echo If blank, press F12 in browser - check Console tab for errors
echo.
cd typing-kids
call npx vite --open --host
goto end

:srvweb
echo.
echo Starting server (new window)...
start "Typing-Server" cmd /c "cd /d %~dp0typing-server && cargo run"
echo API: http://127.0.0.1:8080
echo.
echo Starting Vite...
cd typing-kids
call npx vite
goto end

:tauri
echo.
echo Starting Tauri desktop...
echo.
cd /d "%~dp0"
call npx --prefix typing-kids tauri dev
goto end

:all
echo.
echo Starting server (new window)...
start "Typing-Server" cmd /c "cd /d %~dp0typing-server && cargo run"
echo API: http://127.0.0.1:8080
echo.
echo Starting Tauri desktop...
cd /d "%~dp0"
call npx --prefix typing-kids tauri dev
goto end

:end
echo.
echo Done
pause
