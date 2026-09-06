# ==============================================================================
# Cria o repositorio git deste monorepo (backend + frontend + visao
# computacional + docker-compose), pronto para ser enviado a um repositorio
# NOVO no GitHub e entregue para a empresa fazer "git clone" + "docker compose up".
#
# Rode este script de DENTRO desta pasta (F:\programacao\DASA\POC-DASA\visalytica):
#   powershell -ExecutionPolicy Bypass -File .\criar_repositorio.ps1
# ==============================================================================

git init
git add -A
git commit -m "Monorepo completo para entrega/homologacao: backend (NestJS), frontend (Next.js) e visao computacional (YOLO), com Docker Compose funcional"
git branch -M main

Write-Host ""
Write-Host "Repositorio local criado com sucesso." -ForegroundColor Green
Write-Host ""
Write-Host "Falta so enviar para o GitHub. Va em github.com e crie um repositorio" -ForegroundColor Yellow
Write-Host "NOVO e VAZIO (sem README/gitignore/license marcados na criacao)," -ForegroundColor Yellow
Write-Host "depois rode, substituindo pela URL do seu repositorio novo:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git"
Write-Host "  git push -u origin main"
Write-Host ""
Write-Host "Depois disso, a empresa so precisa rodar:" -ForegroundColor Yellow
Write-Host "  git clone https://github.com/SEU_USUARIO/NOME_DO_REPO.git"
Write-Host "  cd NOME_DO_REPO"
Write-Host "  copy .env.example .env"
Write-Host "  docker compose up --build"
