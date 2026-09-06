# Como testar o Visalytica localmente

## 1. Pré-requisitos

- Docker Desktop instalado e rodando.

## 2. Subir o ambiente

Dentro da pasta do projeto:

```powershell
copy .env.example .env
docker compose up --build
```

A primeira vez demora alguns minutos (baixa as imagens base e instala as
dependências). Deixe o terminal aberto rodando, ou use `-d` para rodar em
segundo plano:

```powershell
docker compose up --build -d
docker compose logs -f
```

## 3. Conferir se os 4 serviços subiram

```powershell
docker compose ps
```

Espera-se ver `visalytica_postgres`, `visalytica_backend`,
`visalytica_visao_computacional` e `visalytica_frontend`, todos com status
`running` (o postgres também deve aparecer `healthy`).

## 4. IMPORTANTE: criar os usuários de teste

O README menciona um médico (`12345SP` / `Medico@123`) e um admin (`admin` /
`Admin@123`) "já cadastrados". **Isso não é automático** — o banco sobe
vazio. É preciso criar essas duas contas uma vez, via Swagger, antes do
primeiro login.

1. Abra `http://localhost:3001/api` (Swagger UI do backend).
2. Use o endpoint **POST /auth/registrar** para criar o médico:
   ```json
   {
     "nome": "Dr. Lucas Silva",
     "username": "12345SP",
     "senha": "Medico@123",
     "cpf": "11111111111",
     "crm": "12345SP"
   }
   ```
3. Use o mesmo endpoint de novo para criar o admin (repare no campo `role`):
   ```json
   {
     "nome": "Administrador",
     "username": "admin",
     "senha": "Admin@123",
     "cpf": "22222222222",
     "crm": "00000000000",
     "role": "admin"
   }
   ```
   (o campo `crm` é obrigatório no formulário mesmo para o admin — pode ser
   qualquer valor único, não precisa ser um CRM real)

## 5. (Opcional) Popular pacientes e exames de exemplo

Depois de criar o médico `12345SP` acima, você pode gerar 20 pacientes e
exames fictícios para a demonstração:

```powershell
docker compose exec backend node dist/seed.js
```

## 6. Testar cada serviço

- **Backend (Swagger)**: `http://localhost:3001/api` — deve carregar a
  documentação da API e permitir testar os endpoints (login, pacientes,
  amostras, etc.).
- **Frontend**: `http://localhost:3000` — faça login com as credenciais
  criadas no passo 4. Deve entrar no dashboard, listar pacientes (se rodou o
  seed), etc.
- **Visão Computacional**: não tem uma página própria no navegador (é um
  servidor de WebSocket na porta 5000, sem rota HTTP) — o jeito de testar é
  pela tela de análise/câmera do frontend, que se conecta nele via
  Socket.IO. Se quiser confirmar isoladamente que o serviço está de pé:
  ```powershell
  docker compose logs visao_computacional
  ```
  Não deve ter erros de import nem de "address already in use".

## 7. Encerrar

```powershell
docker compose down
```

Para apagar também os dados do banco (recomeçar do zero):

```powershell
docker compose down -v
```
