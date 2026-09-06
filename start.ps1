Set-Location -Path $PSScriptRoot

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "                 INICIALIZANDO AMBIENTE VISALYTICA                   " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan

# 1. Verificar Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Docker nao encontrado no PATH." -ForegroundColor Red
    exit 1
}

# 2. Verificar se .env existe
if (-not (Test-Path ".env")) {
    Write-Host "[INFO] Criando .env a partir de .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# 3. Executar Docker Compose
Write-Host "[INFO] Construindo e subindo containers..." -ForegroundColor Green
docker compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=====================================================================" -ForegroundColor Green
    Write-Host "             TODOS OS SERVICOS SUBIRAM COM SUCESSO!                 " -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host " * Frontend:             http://localhost:3000" -ForegroundColor White
    Write-Host " * Backend API:          http://localhost:3001" -ForegroundColor White
    Write-Host " * Documentacao Swagger: http://localhost:3001/api" -ForegroundColor White
    Write-Host " * Visao Computacional:  http://localhost:5000" -ForegroundColor White
    Write-Host " * Banco de Dados:       localhost:5432 (visalytica)`n" -ForegroundColor White
    Write-Host "Logs:  docker compose logs -f" -ForegroundColor Yellow
    Write-Host "Parar: docker compose down`n" -ForegroundColor Yellow
} else {
    Write-Host "[ERRO] Falha ao iniciar containers. Verifique os logs." -ForegroundColor Red
}
