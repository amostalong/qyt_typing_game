@echo off
chcp 437 >nul
cd /d "%~dp0"

echo ============================================
echo      Install Rust for Keyboard Warrior
echo ============================================
echo.

:: Step 0: Kill old processes
echo [0/5] Killing old Rust processes...
taskkill /f /im rustup.exe 2>nul
taskkill /f /im cargo.exe 2>nul
taskkill /f /im rustc.exe 2>nul
timeout /t 2 /nobreak >nul
echo OK
echo.

:: Step 1: Clean old files
echo [1/5] Cleaning old Rust files...
if exist "%USERPROFILE%\.rustup" (
    attrib -r "%USERPROFILE%\.rustup\*.*" /s /d >nul 2>&1
    rmdir /s /q "%USERPROFILE%\.rustup" 2>nul
)
if exist "%USERPROFILE%\.cargo" (
    attrib -r "%USERPROFILE%\.cargo\*.*" /s /d >nul 2>&1
    rmdir /s /q "%USERPROFILE%\.cargo" 2>nul
)
if exist "%TEMP%\rustup-init.exe" (
    del /f "%TEMP%\rustup-init.exe" 2>nul
)
echo OK
echo.

:: Step 2: Download
echo [2/5] Downloading rustup-init.exe...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://win.rustup.rs/x86_64' -OutFile '%TEMP%\rustup-init.exe' -UseBasicParsing"
if not exist "%TEMP%\rustup-init.exe" (
    echo [FAIL] Download failed. Check internet.
    pause
    exit /b 1
)
echo OK
echo.

:: Step 3: Install
echo [3/5] Installing Rust (stable toolchain)...
echo This downloads ~100MB. May take a few minutes.
echo.
"%TEMP%\rustup-init.exe" -y --default-toolchain stable --profile default
if errorlevel 1 (
    echo [FAIL] Install failed.
    pause
    exit /b 1
)
echo OK
echo.

:: Step 4: Verify
echo [4/5] Verifying installation...
"%USERPROFILE%\.cargo\bin\rustc.exe" --version
if errorlevel 1 (
    "%USERPROFILE%\.cargo\bin\rustup.exe" toolchain install stable
    "%USERPROFILE%\.cargo\bin\rustc.exe" --version
)
"%USERPROFILE%\.cargo\bin\cargo.exe" --version
echo.
echo ============================================
echo      Rust installed successfully!
echo ============================================
echo.
echo NEXT: Close this window, open a NEW one,
echo       then run: start-all.bat
echo.
pause
