# 🚀 Visalytica - Ambiente Docker Integrado

Este repositório contém a infraestrutura Docker que orquestra todos os componentes do ecossistema **Visalytica**:
- 🌐 **Frontend**: Interface web em Next.js 15 (porta `3000`)
- ⚙️ **Backend**: API REST em NestJS com Swagger (porta `3001`)
- 👁️ **Visão Computacional**: Processamento de imagens em tempo real com YOLOv8 e Socket.IO (porta `5000`)
- 🗄️ **Banco de Dados**: PostgreSQL 16 (porta `5432`)

---

## 📋 Pré-requisitos

- **Docker Desktop** instalado e **em execução**.
- Portas livres na máquina: `3000`, `3001`, `5000` e `5432`.
- Alguns GB de disco para as imagens. O primeiro build baixa as imagens base e
  instala as dependências — pode levar alguns minutos.

---

## ▶️ Como Rodar (passo a passo)

### 1. Clonar o repositório

```powershell
git clone https://github.com/Acquesta/visalytica.git
cd visalytica
```

### 2. Criar o arquivo `.env`

O `.env` não é versionado. Crie a partir do exemplo:

```powershell
copy .env.example .env
```

Os valores padrão já funcionam para rodar tudo localmente — não é preciso editar
nada para o ambiente de desenvolvimento.

### 3. Subir os 4 serviços

```powershell
docker compose up --build -d
```

- `--build` reconstrói as imagens (necessário na primeira vez e sempre que o
  código mudar).
- `-d` roda em segundo plano. Omita o `-d` para acompanhar os logs no terminal.

> No Windows também dá para dar **duplo clique em `start.bat`**: ele verifica o
> Docker Desktop, cria o `.env` se faltar, builda e sobe tudo.

### 4. Conferir se subiu

```powershell
docker compose ps
```

Devem aparecer `visalytica_postgres` (`healthy`), `visalytica_backend`,
`visalytica_visao_computacional` e `visalytica_frontend`, todos `running`.

### 5. Acessar

Abra [http://localhost:3000](http://localhost:3000) e faça login com uma das
contas da seção [Credenciais de Acesso](#-credenciais-de-acesso) (criadas
automaticamente pelo seed).

### 6. Parar

```powershell
docker compose down        # para os contêineres, mantém os dados
docker compose down -v      # para tudo e APAGA o banco (recomeça do zero)
```

No Windows, **`stop.bat`** faz o `docker compose down`.

---

## 🌱 Seed (dados de exemplo)

O container do **backend roda o seed automaticamente a cada start**, de forma
**idempotente**:

- Cria as contas de acesso (`12345SP` e `admin`) **se ainda não existirem**.
- Gera **20 pacientes + exames fictícios** **apenas quando o banco está vazio**
  (tabela `tb_pacientes` sem registros).

Reiniciar o backend não duplica dados. Para recriar tudo do zero, derrube o
volume e suba de novo:

```powershell
docker compose down -v
docker compose up --build -d
```

Para rodar o seed manualmente dentro do container:

```powershell
docker compose exec backend node dist/seed.js
```

---

## 👤 Credenciais de Acesso

Criadas pelo seed. Login em [http://localhost:3000/login](http://localhost:3000/login):

| Perfil | Usuário / CRM | Senha | Role |
| :--- | :--- | :--- | :--- |
| Médico | `12345SP` | `Visalytica@2026` | `medico` |
| Administrador | `admin` | `Visalytica@2026` | `admin` |

---

## 🔗 Endereços dos Serviços

| Serviço | URL | Descrição |
| :--- | :--- | :--- |
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | Interface do usuário (Next.js) |
| **Backend API** | [http://localhost:3001](http://localhost:3001) | API NestJS |
| **Swagger UI** | [http://localhost:3001/api](http://localhost:3001/api) | Documentação interativa dos endpoints |
| **Visão Computacional** | `http://localhost:5000` | Servidor Socket.IO / Flask (sem página HTML — consumido pelo frontend) |
| **Banco PostgreSQL** | `localhost:5432` | Usuário: `postgres` / Base: `visalytica` |

---

## 🔍 Logs

```powershell
docker compose logs -f                      # todos os serviços
docker compose logs -f backend              # só o backend
docker compose logs -f visao_computacional  # só a visão computacional
docker compose logs -f frontend             # só o frontend
```

---

## ⚙️ Variáveis de Ambiente

Centralizadas no `.env` (criado a partir de `.env.example`):

| Variável | Descrição |
| :--- | :--- |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credenciais do Postgres local. |
| `POSTGRES_PORT` | Porta do Postgres exposta no host (padrão `5432`). |
| `DB_SSL` | `false` para o Postgres local; `true` para bancos em nuvem (Neon/Supabase/RDS). |
| `JWT_SECRET` / `JWT_EXPIRATION` | Segredo e validade do token JWT da API. |
| `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET_NAME` | Credenciais S3 (valores mock por padrão para dev). |
| `VISION_MODEL_PATH` | Arquivo de pesos YOLO carregado pela visão computacional (padrão: `my_model.pt`). |
| `NEXT_PUBLIC_API_URL` | URL da API usada pelo frontend em build-time (`http://localhost:3001`). |

---

## 🛠️ Comandos úteis

```powershell
# Rebuildar e reiniciar só um serviço
docker compose up --build -d backend

# Reiniciar um serviço sem rebuild
docker compose restart frontend

# Abrir um shell no banco
docker compose exec postgres psql -U postgres -d visalytica
```
