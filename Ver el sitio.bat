@echo off
title Sitio de prueba - TuLavanderia
cd /d "%~dp0"
echo.
echo   Abriendo el sitio de prueba...
echo.
echo   Landing:  http://localhost:8080
echo   Sistema:  http://localhost:8080/login
echo.
echo   Para detenerlo, cierra esta ventana.
echo.
start "" http://localhost:8080
node servidor.js
pause
