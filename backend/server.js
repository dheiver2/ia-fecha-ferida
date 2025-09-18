const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar trust proxy para Railway
app.set('trust proxy', true);

// Middleware de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - Configuração mais permissiva para desenvolvimento
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests em dev, 100 em produção
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: process.env.NODE_ENV === 'production', // Apenas confiar em proxy em produção
  skip: (req) => {
    // Pular rate limiting para localhost em desenvolvimento
    if (process.env.NODE_ENV !== 'production' && 
        (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

// authLimiter removido para desenvolvimento - sem limite de tentativas de login
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 5, // máximo 5 tentativas de login por IP por janela
//   message: {
//     success: false,
//     message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
//     code: 'AUTH_RATE_LIMIT_EXCEEDED'
//   }
// });

app.use(limiter);

// Middleware básico - Configuração CORS com variáveis de ambiente
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (ex: mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('uploads'));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

// Importar serviços
const geminiService = require('./services/geminiService');

// Importar rotas
const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const analysesRoutes = require('./routes/analyses');

// Inicializar banco de dados
async function initializeDatabase() {
  try {
    console.log('🔍 DATABASE_URL configurada:', process.env.DATABASE_URL ? 'SIM' : 'NÃO');
    console.log('🔍 Tentando conectar ao Prisma...');
    await prisma.$connect();
    console.log('✅ Banco de dados inicializado com sucesso');
    
    // Testar uma query simples
    const userCount = await prisma.user.count();
    console.log('✅ Teste de query: encontrados', userCount, 'usuários');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    console.error('❌ Stack trace:', error.stack);
    process.exit(1);
  }
}

// Rotas de autenticação (rate limiting removido para desenvolvimento)
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);

// Rotas de pacientes
app.use('/api/patients', patientsRoutes);
app.use('/api/analyses', analysesRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Fecha Ferida - Backend funcionando!',
    version: '1.0.0',
    endpoints: [
      'POST /api/analyze - Análise de ferida com imagem',
      'GET /health - Status da API'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint principal para análise de feridas
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Nenhuma imagem foi enviada' 
      });
    }

    const { patientContext } = req.body;
    const imagePath = req.file.path;

    console.log('=== DEBUG ANÁLISE ===');
    console.log('Analisando imagem:', imagePath);
    console.log('Dados recebidos no req.body:', req.body);
    console.log('Tipo do patientContext:', typeof patientContext);
    console.log('Contexto do paciente (raw):', patientContext);
    
    // Tentar fazer parse se for string
    let parsedContext = patientContext;
    if (typeof patientContext === 'string') {
      try {
        parsedContext = JSON.parse(patientContext);
        console.log('Contexto após parse:', parsedContext);
      } catch (parseError) {
        console.error('Erro ao fazer parse do contexto:', parseError);
        parsedContext = {};
      }
    }
    
    console.log('Contexto final enviado para análise:', parsedContext);
    console.log('=== FIM DEBUG ===');

    // Chamar o serviço Gemini para análise
    console.log('Chamando serviço Gemini com:', { imagePath, parsedContext });
    const analysis = await geminiService.analyzeWoundImage(imagePath, parsedContext);
    console.log('Análise recebida do Gemini:', analysis ? 'Sucesso' : 'Falhou');
    console.log('Tamanho da resposta:', analysis ? analysis.length : 0);

    res.json({
      success: true,
      analysis: analysis,
      imageUrl: `/uploads/${req.file.filename}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Arquivo muito grande. Máximo 10MB.' 
      });
    }
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: error.message 
  });
});

// Criar diretório uploads se não existir
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Inicializar aplicação
async function startServer() {
  try {
    // Inicializar banco de dados
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Banco de dados: PostgreSQL`);
      console.log(`🔐 Autenticação: JWT`);
      console.log(`🏥 Sistema de pacientes: Ativo`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();