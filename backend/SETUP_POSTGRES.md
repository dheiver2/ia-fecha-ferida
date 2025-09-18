# 🐘 Configuração do PostgreSQL para o Projeto

## ⚡ Opção 1: PostgreSQL Online (Mais Rápido)

### 🌐 Usando Neon (Gratuito)
1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a string de conexão fornecida
4. No arquivo `.env`, substitua a `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/banco?sslmode=require"
   ```

### 🌐 Usando Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a "Connection string" 
5. No arquivo `.env`, substitua a `DATABASE_URL`

## 🐳 Opção 2: Docker Local (Recomendado para Desenvolvimento)

### Pré-requisitos
- Docker Desktop instalado e rodando

### Passos:
1. **Iniciar PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

2. **Verificar se está rodando:**
   ```bash
   docker ps
   ```

3. **No arquivo `.env`, descomente:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/fecha_ferida_db"
   ```

## 🔧 Opção 3: PostgreSQL Local

1. Instale o PostgreSQL do [site oficial](https://www.postgresql.org/download/)
2. Configure senha `password` para o usuário `postgres`
3. Crie banco `fecha_ferida_db`
4. Use a URL local no `.env`

## 🚀 Após Configurar o Banco

1. **Execute as migrações:**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Inicie o servidor:**
   ```bash
   npm start
   ```

3. **Visualize o banco (opcional):**
   ```bash
   npx prisma studio
   ```

## 🛠️ Comandos Úteis

- **Parar Docker:** `docker-compose down`
- **Logs do container:** `docker-compose logs postgres`
- **Resetar banco:** `npx prisma migrate reset`
- **Gerar cliente:** `npx prisma generate`

## ❗ Problemas Comuns

- **Erro P1001:** Banco não está rodando ou URL incorreta
- **Docker não funciona:** Use opção online (Neon/Supabase)
- **Migração falha:** Verifique se a URL está correta no `.env`