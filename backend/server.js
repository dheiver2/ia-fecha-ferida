const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

// Importar Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importar middlewares de autenticação
const { authenticateToken, extractRequestInfo } = require('./middleware/auth');

// Importar servidor de sinalização WebRTC
const SimpleSignalingServer = require('./services/simpleSignalingServer');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração CORS específica para desenvolvimento
const corsOptions = {
	origin: [
		'http://localhost:8080',
		'http://127.0.0.1:8080',
		'http://localhost:8081',
		'http://127.0.0.1:8081',
		'http://localhost:3000',
		'http://127.0.0.1:3000',
		'http://localhost:5173',
		'http://127.0.0.1:5173',
		'http://localhost:4173',
		'http://127.0.0.1:4173',
		process.env.FRONTEND_URL || 'http://localhost:5173'
	],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting - Configuração mais permissiva para desenvolvimento
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests em dev, 100 em produção
	message: {
		success: false,
		message: 'Muitas tentativas. Tente novamente em 15 minutos.',
		code: 'RATE_LIMIT_EXCEEDED',
	},
	standardHeaders: true,
	legacyHeaders: false,
	trustProxy: false, // Desabilitar proxy em desenvolvimento
	skip: (req) => {
		// Pular rate limiting para localhost em desenvolvimento
		if (
			process.env.NODE_ENV !== 'production' &&
			(req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost'))
		) {
			return true;
		}
		return false;
	},
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

// Middleware básico - Configuração CORS simplificada e segura
console.log('DEBUG - ALLOWED_ORIGINS env var:', process.env.ALLOWED_ORIGINS);
console.log('DEBUG - FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('uploads'));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
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
	},
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
		endpoints: ['POST /api/analyze - Análise de ferida com imagem', 'GET /health - Status da API'],
	});
});

app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// Endpoint principal para análise de feridas
app.post('/api/analyze', authenticateToken, extractRequestInfo, upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				error: 'Nenhuma imagem foi enviada',
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

		// Persistir a análise no banco de dados
		const protocolNumber = `ANL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		let analysisText = '';
		try {
			analysisText = typeof analysis === 'string' ? analysis : JSON.stringify(analysis);
		} catch (_) {
			analysisText = String(analysis);
		}

		const patientId = (parsedContext && parsedContext.patientId) ? Number(parsedContext.patientId) : null;
		const lesionLocation = (parsedContext && parsedContext.lesionLocation) ? String(parsedContext.lesionLocation) : null;

		const saved = await prisma.woundAnalysis.create({
			data: {
				userId: req.user.id,
				patientId: patientId,
				protocolNumber,
				imageFilename: req.file.filename,
				imagePath: imagePath,
				lesionLocation: lesionLocation,
				patientContext: JSON.stringify(parsedContext || {}),
				analysisResult: analysisText,
				status: 'completed'
			}
		});

		res.json({
			success: true,
			analysis: analysis,
			imageUrl: `/uploads/${req.file.filename}`,
			analysis_id: saved.id,
			protocol_number: saved.protocolNumber,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('Erro na análise:', error);
		
		// Tratamento específico para diferentes tipos de erro
		if (error.message.includes('API key do Google Gemini expirada')) {
			return res.status(503).json({ 
				error: 'Serviço temporariamente indisponível',
				message: 'A chave de API do Google Gemini expirou. Entre em contato com o administrador do sistema.',
				code: 'GEMINI_API_KEY_EXPIRED'
			});
		} else if (error.message.includes('Cota da API do Google Gemini excedida')) {
			return res.status(429).json({ 
				error: 'Limite de uso excedido',
				message: 'O limite de análises foi excedido. Tente novamente mais tarde.',
				code: 'GEMINI_QUOTA_EXCEEDED'
			});
		} else if (error.message.includes('Arquivo de imagem não encontrado')) {
			return res.status(400).json({ 
				error: 'Arquivo não encontrado',
				message: 'A imagem enviada não foi encontrada no servidor.',
				code: 'IMAGE_NOT_FOUND'
			});
		} else {
			return res.status(500).json({ 
				error: 'Erro interno do servidor',
				message: 'Ocorreu um erro inesperado durante a análise. Tente novamente.',
				code: 'INTERNAL_SERVER_ERROR',
				details: process.env.NODE_ENV === 'development' ? error.message : undefined
			});
		}
	}
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		if (error.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				error: 'Arquivo muito grande. Máximo 10MB.',
			});
		}
	}

	res.status(500).json({
		error: 'Erro interno do servidor',
		message: error.message,
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

		// Criar servidor HTTP
		const server = http.createServer(app);

		// Inicializar servidor de sinalização WebRTC
		const signalingServer = new SimpleSignalingServer(server);

		// Rota para estatísticas do WebRTC (opcional)
		app.get('/api/webrtc/stats', (req, res) => {
			res.json(signalingServer.getStats());
		});

		// Iniciar servidor
		server.listen(PORT, () => {
			console.log(`🚀 Servidor rodando na porta ${PORT}`);
			console.log(`📊 Banco de dados: PostgreSQL`);
			console.log(`🔐 Autenticação: JWT`);
			console.log(`🏥 Sistema de pacientes: Ativo`);
			console.log(`📹 WebRTC Signaling: Ativo (ws://localhost:${PORT}/ws)`);
		});

		// Limpeza periódica de salas vazias
		setInterval(() => {
			signalingServer.cleanupEmptyRooms();
		}, 5 * 60 * 1000); // A cada 5 minutos
	} catch (error) {
		console.error('❌ Erro ao iniciar servidor:', error);
		process.exit(1);
	}
}

startServer();