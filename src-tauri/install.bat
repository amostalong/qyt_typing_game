@echo off
title 键盘小勇士 - Tauri 后端依赖安装
cd /d "%~dp0"

echo.
echo =============================================
echo   键盘小勇士 - Tauri 后端安装
echo =============================================
echo.
echo 安装 Rust 依赖 (首次编译会自动下载)...
echo.
cargo build
if errorlevel 1 (
    echo.
    echo [ERROR] 编译失败!
    echo 请确保已安装 Rust: https://rustup.rs
    pause
    exit /b 1
) else (
    echo.
    echo [OK] 编译成功!
    echo.
    echo   Tauri 开发: cd ..\typing-kids ^&^& npm run tauri:dev
    echo   构建安装包: cd ..\typing-kids ^&^& npm run tauri:build
)
echo.
pause
