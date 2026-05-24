@echo off
title 键盘小勇士 - 开发运行
cd /d "%~dp0"

echo.
echo ======================================
echo   键盘小勇士 - 开发运行
echo ======================================
echo.
echo   [1] Web 预览    (vite, 浏览器打开, 最快)
echo   [2] Tauri 桌面   (带 Rust 后端, 首次较慢)
echo.
set /p mode=" 请选择 (1/2，默认1): "

if "%mode%"=="" set mode=1
if "%mode%"=="1" goto WEB
if "%mode%"=="2" goto TAURI
goto WEB

:WEB
echo.
echo [WEB] 启动 Vite 开发服务器...
echo 打开浏览器 http://localhost:5173
echo.
call npx vite
goto END

:TAURI
echo.
echo [Tauri] 启动桌面开发环境...
echo.
call npx tauri dev
goto END

:END
if errorlevel 1 (
    echo.
    echo [ERROR] 启动失败!
) else (
    echo.
    echo [OK] 已关闭
)
echo.
pause
