# ============================================================
# Backend Visalytica - NestJS
# Build multi-stage: instala deps, compila TypeScript e roda
# apenas o resultado compilado (dist) na imagem final.
# ============================================================

# ---- Etapa 1: dependencias + build ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# node:*-bookworm-slim é baseado em Debian (glibc), o que permite
# usar os binarios pre-compilados do pacote "bcrypt" sem precisar
# instalar toolchain de compilacao (diferente de Alpine/musl).
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Etapa 2: dependencias de producao ----
FROM node:20-bookworm-slim AS deps-prod

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# ---- Etapa 3: imagem final ----
FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./package.json

EXPOSE 3001

# Roda o seed (idempotente) antes de subir a API. Se o seed falhar, a API
# sobe mesmo assim ("|| true"). O "exec" garante que o node vire PID 1 e
# receba os sinais (SIGTERM) do Docker corretamente.
CMD ["sh", "-c", "node dist/seed.js || true; exec node dist/main"]
