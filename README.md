# 🚀 Visalytica - Ambiente Docker Integrado

Este diretório contém a infraestrutura Docker que orquestra todos os componentes do ecossistema **Visalytica**:
- 🌐 **Frontend**: Interface web em Next.js 15 (porta `3000`)
- ⚙️ **Backend**: API REST em NestJS com Swagger (porta `3001`)
- 👁️ **Visão Computacional**: Processamento de imagens em tempo real com YOLOv8 e Socket.IO (porta `5000`)
- 🗄️ **Banco de Dados**: PostgreSQL 16 (porta `5432`)

---

## ⚡ Como Inicializar

### Método 1: Duplo Clique (Windows)
Basta abrir esta pasta (`visalytica`) e dar um duplo clique no arquivo:
* **`start.bat`**

O script irá:
1. Verificar se o Docker Desktop está em execução (iniciando-o automaticamente se necessário).
2. Criar o arquivo `.env` a partir de `.env.example` (se ainda não existir).
3. Construir as imagens Docker e subir todos os contêineres em segundo plano (`-d`).
4. Exibir todos os links de acesso no console.

---

### Método 2: Via Terminal (PowerShell / CMD)
Abra o terminal dentro desta pasta (`visalytica`) e execute:

```powershell
# Subir todos os serviços (buildando imagens se necessário)
docker compose up --build -d
```

---

## 🛑 Como Parar os Ambientes

* **Pelo Windows**: Dê um duplo clique no arquivo **`stop.bat`**.
* **Pelo Terminal**:
  ```powershell
  docker compose down
  ```

---

## 🔍 Visualizar Logs em Tempo Real

Para acompanhar o que cada serviço está emitindo no terminal:
```powershell
# Logs de todos os servicos
docker compose logs -f

# Log apenas do backend
docker compose logs -f backend

# Log apenas da visao computacional
docker compose logs -f visao_computacional

# Log apenas do frontend
docker compose logs -f frontend
```

---

## 🔗 Endereços dos Serviços

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | Interface do usuário (Next.js) |
| **Backend API** | [http://localhost:3001](http://localhost:3001) | API NestJS |
| **Swagger UI** | [http://localhost:3001/api](http://localhost:3001/api) | Documentação interativa dos endpoints |
| **Visão Computacional** | [http://localhost:5000](http://localhost:5000) | Servidor Socket.IO / Flask |
| **Banco PostgreSQL** | `localhost:5432` | Usuário: `postgres` / Base: `visalytica` |

---

## ⚙️ Configurações e Variáveis de Ambiente

As configurações ficam centralizadas no arquivo `.env` dentro desta pasta:
* `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`: Credenciais do banco.
* `DB_SSL`: `false` para o Postgres local; mude para `true` se apontar para bancos em nuvem (Neon/Supabase/RDS).
* `JWT_SECRET`: Segredo de autenticação JWT da API.
* `VISION_MODEL_PATH`: Modelo YOLO carregado (padrão: `chicletes.pt`).
* `NEXT_PUBLIC_API_URL`: URL da API para o frontend (`http://localhost:3001`).

---

## 👤 Credenciais de Acesso (Login)

Os usuários abaixo já foram cadastrados no banco de dados e estão prontos para login em [http://localhost:3000/login](http://localhost:3000/login):

### 1. Usuário Médico (Comum)
* **Usuário / CRM**: `12345SP`
* **Senha**: `Medico@123`
* **Nome**: Dr. Lucas Silva
* **Perfil (Role)**: `medico`

### 2. Usuário Administrador (Admin)
* **Usuário / CRM**: `admin`
* **Senha**: `Admin@123`
* **Nome**: Administrador
* **Perfil (Role)**: `admin`

