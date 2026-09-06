@echo off
title Visalytica - Subir Ambiente Docker
chcp 65001 >nul
cls

:: Garante que o diretorio atual e o da pasta visalytica
cd /d "%~dp0"

echo =====================================================================
echo                  INICIALIZANDO AMBIENTE VISALYTICA                  
echo =====================================================================
echo.

:: 1. Verificar se Docker esta no PATH
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] O Docker nao foi encontrado no PATH do sistema.
    echo Certifique-se de que o Docker Desktop esta instalado.
    echo.
    pause
    exit /b 1
)

:: 2. Verificar se o daemon do Docker esta ativo
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] O daemon do Docker nao esta respondendo.
    echo Tentando iniciar o Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" 2>nul
    echo Aguardando o Docker inicializar...
    :check_docker
    timeout /t 5 /nobreak >nul
    docker info >nul 2>nul
    if %errorlevel% neq 0 (
        echo Aguardando Docker Desktop...
        goto check_docker
    )
    echo [OK] Docker daemon pronto!
)

:: 3. Verificar se .env existe
if not exist ".env" (
    echo [INFO] Criando arquivo .env a partir de .env.example...
    copy ".env.example" ".env" >nul
)

echo.
echo [1/2] Construindo e iniciando containers (Backend, Frontend, IA, Postgres)...
echo.

docker compose up --build -d

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao subir os containers Docker.
    echo Verifique as mensagens acima para diagnosticar.
    echo.
    pause
    exit /b 1
)

echo.
echo =====================================================================
echo              TODOS OS SERVICOS SUBIRAM COM SUCESSO!                 
echo =====================================================================
echo.
echo  * Frontend:             http://localhost:3000
echo  * Backend API:          http://localhost:3001
echo  * Documentacao Swagger: http://localhost:3001/api
echo  * Visao Computacional:  http://localhost:5000
echo  * Banco de Dados:       localhost:5432 (visalytica)
echo.
echo =====================================================================
echo Dicas uteis:
echo  - Para ver os logs em tempo real: docker compose logs -f
echo  - Para parar os servicos:        execute stop.bat ou docker compose down
echo =====================================================================
echo.
pause
