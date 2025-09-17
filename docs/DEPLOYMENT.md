# Deployment Guide - Fecha Ferida IA

## 🚀 Deployment em Produção

### Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Servidor com pelo menos 2GB RAM
- Domínio configurado (opcional)
- Certificado SSL (recomendado)

### Variáveis de Ambiente

#### Backend (.env)
```env
# API Configuration
PORT=3001
NODE_ENV=production

# Google Gemini AI
GEMINI_API_KEY=your_production_gemini_key

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=24h

# Database
DB_PATH=./database/fecha_ferida.db

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# App Configuration
VITE_APP_NAME=Fecha Ferida IA
VITE_APP_VERSION=1.0.0
```

### Build e Deploy

#### 1. Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gerenciamento de processos
sudo npm install -g pm2

# Criar usuário para a aplicação
sudo adduser fechaferida
sudo usermod -aG sudo fechaferida
```

#### 2. Deploy da Aplicação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/fecha-ferida-ia.git
cd fecha-ferida-ia

# Instalar dependências
npm run install:all

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Editar os arquivos .env com os valores de produção

# Build do frontend
npm run build

# Configurar banco de dados
cd backend
npm run db:setup  # Se existir script de setup
```

#### 3. Configuração do PM2

Criar arquivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'fecha-ferida-backend',
      script: './backend/server.js',
      cwd: '/path/to/fecha-ferida-ia',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    }
  ]
};
```

Iniciar aplicação:

```bash
# Criar pasta de logs
mkdir logs

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup
```

#### 4. Configuração do Nginx

Instalar e configurar Nginx:

```bash
sudo apt install nginx

# Criar configuração do site
sudo nano /etc/nginx/sites-available/fecha-ferida-ia
```

Configuração do Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Frontend (React build)
    location / {
        root /path/to/fecha-ferida-ia/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Upload files
    location /uploads/ {
        alias /path/to/fecha-ferida-ia/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # File upload size
    client_max_body_size 10M;
}
```

Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/fecha-ferida-ia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Monitoramento e Logs

#### Configurar logrotate

```bash
sudo nano /etc/logrotate.d/fecha-ferida-ia
```

```
/path/to/fecha-ferida-ia/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 fechaferida fechaferida
    postrotate
        pm2 reload fecha-ferida-backend
    endscript
}
```

#### Comandos úteis de monitoramento

```bash
# Status da aplicação
pm2 status

# Logs em tempo real
pm2 logs

# Monitoramento de recursos
pm2 monit

# Restart da aplicação
pm2 restart fecha-ferida-backend

# Reload sem downtime
pm2 reload fecha-ferida-backend
```

### 7. Backup e Segurança

#### Script de backup do banco

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/fecha-ferida-ia"
DB_PATH="/path/to/fecha-ferida-ia/backend/database/fecha_ferida.db"

mkdir -p $BACKUP_DIR

# Backup do banco de dados
cp $DB_PATH $BACKUP_DIR/fecha_ferida_$DATE.db

# Backup dos uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /path/to/fecha-ferida-ia/backend/uploads/

# Manter apenas os últimos 30 backups
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Configurar cron para backup diário:

```bash
sudo crontab -e
# Adicionar:
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

#### Firewall

```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3001  # Bloquear acesso direto ao backend
```

### 8. Atualizações

Script para deploy de atualizações:

```bash
#!/bin/bash
# deploy.sh

echo "Iniciando deploy..."

# Backup antes da atualização
./backup.sh

# Atualizar código
git pull origin main

# Instalar dependências
npm run install:all

# Build do frontend
npm run build

# Restart da aplicação
pm2 reload fecha-ferida-backend

echo "Deploy concluído!"
```

### 9. Troubleshooting

#### Problemas comuns

1. **Aplicação não inicia:**
   ```bash
   pm2 logs fecha-ferida-backend
   ```

2. **Erro de permissões:**
   ```bash
   sudo chown -R fechaferida:fechaferida /path/to/fecha-ferida-ia
   ```

3. **Banco de dados corrompido:**
   ```bash
   # Restaurar do backup mais recente
   cp /backups/fecha-ferida-ia/fecha_ferida_YYYYMMDD_HHMMSS.db ./backend/database/fecha_ferida.db
   ```

4. **Alto uso de memória:**
   ```bash
   pm2 reload fecha-ferida-backend
   ```

### 10. Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] SSL certificado instalado
- [ ] Firewall configurado
- [ ] Backup automático configurado
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Testes de funcionalidade realizados
- [ ] DNS configurado
- [ ] Performance testada

### Contatos de Suporte

Para problemas de deploy, verifique:
1. Logs da aplicação (`pm2 logs`)
2. Logs do Nginx (`/var/log/nginx/`)
3. Status dos serviços (`systemctl status`)
4. Espaço em disco (`df -h`)
5. Memória disponível (`free -h`)