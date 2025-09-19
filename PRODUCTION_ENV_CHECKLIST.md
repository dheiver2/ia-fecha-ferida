# Lista de Verificação - Variáveis de Ambiente para Produção

## 🔧 Backend (.env)

### ✅ Obrigatórias
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001` (ou porta configurada no servidor)
- [ ] `GEMINI_API_KEY=sua_chave_gemini_aqui`
- [ ] `JWT_SECRET=chave_jwt_super_segura_minimo_32_caracteres`
- [ ] `DATABASE_URL=caminho_para_banco_producao`
- [ ] `FRONTEND_URL=https://seu-dominio-frontend.com`

### ⚙️ Opcionais (com valores padrão)
- [ ] `JWT_EXPIRES_IN=24h`
- [ ] `BCRYPT_ROUNDS=12` (recomendado para produção)
- [ ] `MAX_FILE_SIZE=10485760` (10MB)
- [ ] `RATE_LIMIT_WINDOW_MS=900000` (15 minutos)
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`
- [ ] `UPLOAD_PATH=./uploads`

### 🔒 Segurança
- [ ] `ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com`
- [ ] `CORS_UPDATE=true` (se necessário)

## 🌐 Frontend (.env)

### ✅ Obrigatórias
- [ ] `VITE_API_URL=https://seu-backend-api.com`
- [ ] `VITE_APP_NAME=Fecha Ferida IA`
- [ ] `VITE_APP_VERSION=1.0.0`

### 📡 Teleconsulta (Opcionais)
- [ ] `VITE_NETWORK_IP=seu.ip.da.rede` (para links locais)
- [ ] `VITE_TURN_USERNAME=usuario_turn` (se usar servidor TURN)
- [ ] `VITE_TURN_PASSWORD=senha_turn` (se usar servidor TURN)
- [ ] `VITE_TURN_SERVER=turn:seu-servidor-turn.com:3478`

### 🔑 APIs Externas
- [ ] `VITE_GEMINI_API_KEY=sua_chave_gemini_frontend` (se necessário no frontend)

## 🚀 Comandos para Gerar Valores Seguros

### JWT Secret (32+ caracteres)
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Verificar Configurações
```bash
# Backend
cd backend && node debug-env.js

# Frontend (durante build)
npm run build
```

## 🌍 Configurações de Domínio

### CORS - Backend
```env
FRONTEND_URL=https://seu-dominio.com
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

### API URL - Frontend
```env
VITE_API_URL=https://api.seu-dominio.com
```

## 📋 Checklist de Deploy

### Antes do Deploy
- [ ] Todas as variáveis obrigatórias configuradas
- [ ] JWT_SECRET gerado com segurança
- [ ] GEMINI_API_KEY válida e ativa
- [ ] URLs de produção corretas
- [ ] CORS configurado para domínios corretos

### Após o Deploy
- [ ] Testar login/registro
- [ ] Testar análise de imagem
- [ ] Testar teleconsulta
- [ ] Verificar logs de erro
- [ ] Testar em diferentes navegadores

### Teleconsulta Específico
- [ ] Testar acesso à câmera/microfone
- [ ] Verificar conectividade WebRTC
- [ ] Testar em redes diferentes (WiFi, 4G)
- [ ] Validar links de convite
- [ ] Testar modo guest

## 🔧 Servidores TURN (Para Produção)

### Opções Gratuitas/Baratas
1. **Coturn** (self-hosted)
2. **Twilio STUN/TURN**
3. **Xirsys**
4. **Metered TURN**

### Configuração TURN
```env
# Frontend
VITE_TURN_SERVER=turn:seu-servidor.com:3478
VITE_TURN_USERNAME=usuario
VITE_TURN_PASSWORD=senha
```

## ⚠️ Problemas Comuns

### CORS Errors
- Verificar `FRONTEND_URL` no backend
- Confirmar `ALLOWED_ORIGINS`
- Certificar que não há trailing slash

### WebRTC Falhas
- Configurar servidores TURN para redes restritivas
- Verificar HTTPS (obrigatório para getUserMedia)
- Testar em diferentes redes

### API Errors
- Confirmar `VITE_API_URL` correto
- Verificar se backend está acessível
- Validar certificados SSL

## 📞 Suporte

Em caso de problemas:
1. Verificar logs do servidor
2. Testar variáveis com `debug-env.js`
3. Validar conectividade de rede
4. Consultar documentação do provedor de hospedagem