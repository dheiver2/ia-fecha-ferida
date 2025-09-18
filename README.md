# 🏥 Fecha Ferida IA

Sistema inteligente de análise de feridas utilizando Inteligência Artificial para auxiliar profissionais de saúde no diagnóstico e acompanhamento de lesões cutâneas.

## ✨ Funcionalidades

- 🤖 **Análise com IA**: Análise automática de feridas usando Google Gemini AI
- 👥 **Gerenciamento de Usuários**: Sistema completo de autenticação e autorização
- 📊 **Relatórios Médicos**: Geração automática de relatórios estruturados
- 📱 **Interface Responsiva**: Design moderno e adaptável para todos os dispositivos
- 🗂️ **Histórico de Análises**: Acompanhamento completo das análises realizadas
- 🔒 **Segurança**: Criptografia, rate limiting e validação robusta
- 👨‍⚕️ **Gerenciamento de Pacientes**: CRUD completo para dados de pacientes

## 🏗️ Estrutura do Projeto

```
fecha-ferida-ia/
├── backend/                    # API Express.js + Node.js
│   ├── prisma/               # Configuração e schema do PostgreSQL
│   ├── middleware/            # Middlewares de autenticação e validação
│   ├── routes/               # Rotas da API (auth, patients, analyses)
│   ├── services/             # Serviços (Gemini AI, Auth)
│   ├── templates/            # Templates de relatórios médicos
│   ├── uploads/              # Armazenamento de imagens
│   └── server.js             # Servidor principal
├── frontend/                  # Aplicação React + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── contexts/        # Contexts do React
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilitários
│   └── public/              # Arquivos estáticos
├── docs/                     # Documentação técnica
│   ├── API.md               # Documentação da API
│   ├── DEPLOYMENT.md        # Guia de deploy
│   ├── CONTRIBUTING.md      # Guia de contribuição
│   └── ADMIN_CREDENTIALS.md # Credenciais padrão
└── .env.example             # Exemplo de variáveis de ambiente
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **NPM** ou **Yarn**
- **Chave da API do Google Gemini** ([Obter aqui](https://makersuite.google.com/app/apikey))

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/fecha-ferida-ia.git
cd fecha-ferida-ia
```

2. **Instale todas as dependências:**
```bash
npm run install:all
```

3. **Configure as variáveis de ambiente:**

Copie o arquivo de exemplo e configure:
```bash
cp .env.example .env
```

**Backend** (`backend/.env`):
```env
# Configuração do servidor
PORT=3001
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY=sua_chave_gemini_aqui

# JWT (gere uma chave segura)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
JWT_EXPIRES_IN=24h

# Banco de dados
DB_PATH=./database/fecha_ferida.db

# Upload de arquivos
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Segurança
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend** (`frontend/.env`):
```env
# URL da API
VITE_API_URL=http://localhost:3001

# Configurações da aplicação
VITE_APP_NAME=Fecha Ferida IA
VITE_APP_VERSION=1.0.0
```

4. **Inicialize o banco de dados:**
```bash
cd backend
npm run db:init  # Se disponível, ou o banco será criado automaticamente
```

### Executar em Desenvolvimento

**Opção 1: Executar tudo junto (recomendado)**
```bash
npm run dev
```

**Opção 2: Executar separadamente**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### URLs de Acesso

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 📡 API Endpoints

### Principais Endpoints

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/auth/register` | Registrar novo usuário | ❌ |
| `POST` | `/api/auth/login` | Login de usuário | ❌ |
| `GET` | `/api/patients` | Listar pacientes | ✅ |
| `POST` | `/api/patients` | Criar paciente | ✅ |
| `PUT` | `/api/patients/:id` | Atualizar paciente | ✅ |
| `DELETE` | `/api/patients/:id` | Remover paciente | ✅ |
| `POST` | `/api/analyze` | Analisar ferida com IA | ✅ |
| `GET` | `/api/analyses` | Listar análises | ✅ |
| `DELETE` | `/api/analyses/:id` | Remover análise | ✅ |
| `DELETE` | `/api/analyses/bulk` | Remover múltiplas análises | ✅ |
| `GET` | `/health` | Status da API | ❌ |

### Exemplo de Análise

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@ferida.jpg" \
  -F "patientContext={\"name\":\"João\",\"age\":45}"
```

**Response:**
```json
{
  "success": true,
  "analysis": "Relatório médico detalhado...",
  "imageUrl": "/uploads/filename.jpg",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "analysisId": 123
}
```

📖 **Documentação completa da API:** [docs/API.md](docs/API.md)

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express.js** - Servidor e API REST
- **PostgreSQL** - Banco de dados robusto e escalável
- **Google Generative AI (Gemini)** - Análise inteligente de feridas
- **JWT** - Autenticação e autorização
- **Multer** - Upload e processamento de imagens
- **bcryptjs** - Criptografia de senhas
- **express-rate-limit** - Proteção contra ataques
- **helmet** - Headers de segurança
- **express-validator** - Validação de dados

### Frontend
- **React 18** + **TypeScript** - Interface moderna e tipada
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **React Router** - Navegação SPA
- **React Query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas

### DevOps & Ferramentas
- **Concurrently** - Execução paralela de scripts
- **Nodemon** - Hot reload no desenvolvimento
- **ESLint** + **Prettier** - Qualidade de código
- **Git** - Controle de versão

## 📝 Scripts Disponíveis

```bash
npm run dev              # Executa frontend e backend
npm run dev:backend      # Apenas backend
npm run dev:frontend     # Apenas frontend
npm run install:all      # Instala todas as dependências
npm run build           # Build do frontend
npm run start           # Produção (apenas backend)
```

## 🚀 Funcionalidades

- ✅ Upload de imagens de feridas
- ✅ Análise com IA (Google Gemini)
- ✅ Contexto do paciente
- ✅ Relatórios médicos estruturados
- ✅ Interface responsiva
- ✅ Histórico de exames
- ✅ API REST simples e rápida

## 🔒 Segurança

### Medidas Implementadas
- ✅ **Autenticação JWT** com tokens seguros
- ✅ **Criptografia de senhas** com bcrypt
- ✅ **Rate limiting** para prevenir ataques
- ✅ **Headers de segurança** com Helmet
- ✅ **Validação de entrada** em todas as rotas
- ✅ **Upload seguro** com validação de tipos
- ✅ **CORS configurado** para origens específicas

### Credenciais Padrão
📋 **Administrador:** Consulte [docs/ADMIN_CREDENTIALS.md](docs/ADMIN_CREDENTIALS.md)

⚠️ **IMPORTANTE:** Altere as credenciais padrão em produção!

## 🏥 Como Usar

1. **Página Inicial**: Navegue pelas opções disponíveis
2. **Análise de Ferida**: 
   - Faça upload de uma imagem da ferida
   - Preencha o contexto do paciente
   - Clique em "Analisar com IA"
   - Visualize o relatório gerado
3. **Histórico**: Consulte análises anteriores

## 🚀 Deploy

### Produção
```bash
# Build da aplicação
npm run build

# Iniciar em produção
npm start
```

📖 **Guia completo de deploy:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

📖 **Guia de contribuição:** [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

## 📚 Documentação

- 📖 [API Documentation](docs/API.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md)
- 🤝 [Contributing Guide](docs/CONTRIBUTING.md)
- 🔑 [Admin Credentials](docs/ADMIN_CREDENTIALS.md)

## ⚠️ Avisos Importantes

- Este sistema é para fins educacionais e de demonstração
- Não substitui avaliação médica profissional
- Sempre consulte um profissional de saúde qualificado
- As análises da IA são sugestões, não diagnósticos definitivos

## 📞 Suporte

Para dúvidas ou problemas:
- 🐛 [Reportar Bug](https://github.com/seu-usuario/fecha-ferida-ia/issues/new?template=bug_report.md)
- 💡 [Solicitar Feature](https://github.com/seu-usuario/fecha-ferida-ia/issues/new?template=feature_request.md)
- 📧 Email: [seu-email@exemplo.com]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Desenvolvido com ❤️ para auxiliar profissionais de saúde</p>
  <p>
    <a href="#-sobre-o-projeto">Início</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-início-rápido">Instalação</a> •
    <a href="#-api-endpoints">API</a> •
    <a href="#-documentação">Docs</a>
  </p>
</div>
