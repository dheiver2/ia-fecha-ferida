# 🚀 Guia de Deploy - Fecha Ferida IA

Este guia detalha como fazer o deploy do projeto usando **Vercel** (frontend), **Railway** (backend) e **Neon** (banco de dados).

## 📋 Pré-requisitos

- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Conta na [Railway](https://railway.app)
- [ ] Conta na [Neon](https://neon.tech)
- [ ] Chave da API do Google Gemini ([Obter aqui](https://makersuite.google.com/app/apikey))
- [ ] Repositório Git (GitHub, GitLab, etc.)

## 🗄️ 1. Deploy do Banco de Dados (Neon)

### 1.1 Criar Projeto no Neon
1. Acesse [Neon Console](https://console.neon.tech)
2. Clique em "Create Project"
3. Escolha um nome: `fecha-ferida-ia-db`
4. Selecione a região mais próxima
5. Copie a **DATABASE_URL** gerada

### 1.2 Configurar Schema
```bash
# No seu ambiente local
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## 🖥️ 2. Deploy do Backend (Railway)

### 2.1 Conectar Repositório
1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório do projeto

### 2.2 Configurar Variáveis de Ambiente
No Railway Dashboard, vá em **Variables** e adicione:

```env
# Configuração do Servidor
NODE_ENV=production
PORT=3001

# Google Gemini AI
GEMINI_API_KEY=sua_chave_gemini_aqui

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=24h

# Banco de Dados (Neon)
DATABASE_URL=postgresql://usuario:senha@host:5432/database?sslmode=require

# Configurações de Segurança
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (URL do frontend na Vercel)
FRONTEND_URL=https://seu-app.vercel.app
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

### 2.3 Configurar Build
O Railway detectará automaticamente o Node.js. O arquivo `railway.toml` já está configurado.

## 🌐 3. Deploy do Frontend (Vercel)

### 3.1 Conectar Repositório
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure o **Root Directory** como `frontend`

### 3.2 Configurar Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Configurar Variáveis de Ambiente
No Vercel Dashboard, vá em **Settings > Environment Variables**:

```env
# API Configuration (URL do Railway)
VITE_API_URL=https://seu-backend.railway.app

# App Configuration
VITE_APP_NAME=Fecha Ferida IA
VITE_APP_VERSION=1.0.0
```

## 🔧 4. Configurações Finais

### 4.1 Atualizar CORS no Backend
Certifique-se de que a URL da Vercel está nas variáveis `FRONTEND_URL` e `ALLOWED_ORIGINS` do Railway.

### 4.2 Testar Conexões
1. **Backend Health Check**: `https://seu-backend.railway.app/health`
2. **Frontend**: `https://seu-app.vercel.app`
3. **Teste de Login**: Criar conta e fazer login
4. **Teste de Análise**: Upload de imagem e análise

### 4.3 Configurar Domínio Personalizado (Opcional)
- **Vercel**: Settings > Domains
- **Railway**: Settings > Networking > Custom Domain

## 🔐 5. Variáveis de Ambiente Completas

### Backend (Railway)
```env
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=AIzaSyAf4OvR408NrNp6pQaBCJKMWXeZnTaXuTU
JWT_SECRET=OoAPaqNC4c9xVthGvqDuOZ9ZtU0B1So2
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://neondb_owner:npg_gHsPjVuap5O0@ep-old-surf-advzi4ig-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://fecha-ferida-ia.vercel.app
ALLOWED_ORIGINS=https://fecha-ferida-ia.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://fecha-ferida-ia-production.up.railway.app
VITE_APP_NAME=Fecha Ferida IA
VITE_APP_VERSION=1.0.0
```

## 🚨 6. Troubleshooting

### Problemas Comuns

**❌ CORS Error**
- Verifique se `FRONTEND_URL` no Railway está correto
- Confirme se `ALLOWED_ORIGINS` inclui a URL da Vercel

**❌ Database Connection Error**
- Verifique se `DATABASE_URL` está correto
- Confirme se as migrações foram executadas no Neon

**❌ Gemini API Error**
- Verifique se `GEMINI_API_KEY` está correto
- Confirme se a API está ativa no Google AI Studio

**❌ Build Error no Frontend**
- Verifique se `VITE_API_URL` está definido
- Confirme se todas as dependências estão instaladas

### Logs e Monitoramento
- **Railway**: Dashboard > Deployments > View Logs
- **Vercel**: Dashboard > Functions > View Function Logs
- **Neon**: Console > Monitoring

## ✅ 7. Checklist de Deploy

- [ ] Banco Neon criado e configurado
- [ ] Backend no Railway funcionando
- [ ] Frontend na Vercel funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Health checks passando
- [ ] Teste de login funcionando
- [ ] Teste de análise funcionando
- [ ] SSL/HTTPS ativo
- [ ] Domínios configurados (se aplicável)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs das plataformas
2. Confirme todas as variáveis de ambiente
3. Teste as conexões individualmente
4. Verifique a documentação das plataformas

---

**🎉 Parabéns! Seu projeto está no ar!**