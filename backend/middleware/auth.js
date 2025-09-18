const authService = require('../services/authService');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
    try {
        // Extrair token do header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acesso requerido',
                code: 'NO_TOKEN'
            });
        }

        // Verificar autenticação
        const user = await authService.verifyAuthentication(token);
        
        // Adicionar usuário ao request
        req.user = user;
        req.token = token;
        
        next();

    } catch (error) {
        console.error('❌ Erro na autenticação:', error.message);
        
        let statusCode = 401;
        let code = 'INVALID_TOKEN';
        
        if (error.message.includes('expirado')) {
            code = 'TOKEN_EXPIRED';
        } else if (error.message.includes('Sessão inválida')) {
            code = 'SESSION_INVALID';
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message,
            code
        });
    }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado',
                code: 'NOT_AUTHENTICATED'
            });
        }

        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Permissões insuficientes.',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: allowedRoles,
                current: userRole
            });
        }

        next();
    };
};

// Middleware para verificar se é admin
const requireAdmin = requireRole(['admin']);

// Middleware para verificar se é profissional de saúde
const requireHealthProfessional = requireRole(['admin', 'doctor', 'nurse']);

// Middleware opcional de autenticação (não falha se não autenticado)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const user = await authService.verifyAuthentication(token);
            req.user = user;
            req.token = token;
        }
        
        next();

    } catch (error) {
        // Em caso de erro, continua sem autenticação
        console.warn('⚠️ Autenticação opcional falhou:', error.message);
        next();
    }
};

// Middleware para extrair informações da requisição
const extractRequestInfo = (req, res, next) => {
    req.requestInfo = {
        ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        deviceInfo: req.get('X-Device-Info') || 'Unknown'
    };
    next();
};

// Middleware para verificar se usuário pode acessar recurso
const canAccessResource = (resourceType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const resourceId = req.params.id || req.params.userId || req.params.patientId;

            // Admin pode acessar tudo
            if (req.user.role === 'admin') {
                return next();
            }

            // Para outros recursos, implementar lógica específica
            switch (resourceType) {
                case 'user':
                    // Usuário só pode acessar seus próprios dados
                    if (userId.toString() !== resourceId.toString()) {
                        return res.status(403).json({
                            success: false,
                            message: 'Acesso negado ao recurso',
                            code: 'RESOURCE_ACCESS_DENIED'
                        });
                    }
                    break;

                case 'patient':
                    // Verificar se o paciente pertence ao usuário
                    const { PrismaClient } = require('@prisma/client');
                    const prisma = new PrismaClient();
                    const patient = await prisma.patient.findUnique({
                        where: { id: parseInt(resourceId) },
                        select: { userId: true }
                    });
                    
                    if (!patient || patient.userId !== userId) {
                        return res.status(403).json({
                            success: false,
                            message: 'Acesso negado ao paciente',
                            code: 'PATIENT_ACCESS_DENIED'
                        });
                    }
                    break;

                case 'analysis':
                    // Verificar se a análise pertence ao usuário
                    const prisma2 = new PrismaClient();
                    const analysis = await prisma2.woundAnalysis.findUnique({
                        where: { id: parseInt(resourceId) },
                        select: { userId: true }
                    });
                    
                    if (!analysis || analysis.userId !== userId) {
                        return res.status(403).json({
                            success: false,
                            message: 'Acesso negado à análise',
                            code: 'ANALYSIS_ACCESS_DENIED'
                        });
                    }
                    break;

                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Tipo de recurso não reconhecido',
                        code: 'UNKNOWN_RESOURCE_TYPE'
                    });
            }

            next();

        } catch (error) {
            console.error('❌ Erro na verificação de acesso:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
    };
};

module.exports = {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireHealthProfessional,
    optionalAuth,
    extractRequestInfo,
    canAccessResource
};
