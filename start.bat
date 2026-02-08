@echo off
REM AutoSRS Quick Start Script for Windows

echo ========================================
echo AutoSRS Quick Start
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created!
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Check if dependencies are installed
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed!
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and add your API keys
    echo.
    pause
    exit /b 1
)

REM Check if mmdc is installed
where mmdc >nul 2>&1
if errorlevel 1 (
    echo WARNING: Mermaid CLI not found!
    echo Please install it: npm install -g @mermaid-js/mermaid-cli
    echo.
    pause
    exit /b 1
)

echo ========================================
echo Starting AutoSRS server...
echo ========================================
echo Server will be available at: http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.

uvicorn srs_engine.main:app --reload

pause
