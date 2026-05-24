@echo off
title 键盘小勇士 - 构建发布版
cd /d "%~dp0"

echo.
echo ======================================
echo   键盘小勇士 - 构建发布版
echo ======================================
echo.
echo 构建 Tauri 桌面应用安装包...
echo 输出目录: src-tauri/target/release/
echo.
cd /d "%~dp0"
npx tauri build
if errorlevel 1 (
    echo.
    echo [ERROR] 构建失败!
) else (
    echo.
    echo [OK] 构建成功!
    echo 安装包在 src-tauri/target/release/bundle/
)
echo.
pause
