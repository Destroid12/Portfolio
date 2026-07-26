@echo off
echo Scanning assets folder...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0update_projects.ps1"
echo.
pause
