@echo off
title Visalytica - Parar Ambiente Docker
chcp 65001 >nul
cls

cd /d "%~dp0"

echo =====================================================================
echo                  PARANDO AMBIENTE VISALYTICA                        
echo =====================================================================
echo.

docker compose down

echo.
echo [OK] Todos os containers foram parados com sucesso!
echo.
pause
