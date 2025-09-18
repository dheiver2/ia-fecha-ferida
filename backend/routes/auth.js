const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const { authenticateToken, extractRequestInfo } = require('../middleware/auth');

const router = express.Router();

// Middleware para extrair informações da requisição
router.use(extractRequestInfo);

// Validações
const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ser válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Nome deve ter pelo menos 2 caracteres'),
    body('role')
        .optional()
        .isIn(['user', 'doctor', 'nurse', 'admin'])
        .withMessage('Role deve ser: user, doctor, nurse ou admin'),
    body('specialty')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Especialidade deve ter no máximo 100 caracteres'),
    body('crm')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('CRM deve ter no máximo 20 caracteres'),
    body('institution')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Instituição deve ter no máximo 255 caracteres'),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Telefone deve ter no máximo 20 caracteres')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ser válido'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
];

const changePasswordValidation = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Senha atual é obrigatória'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

// Função para tratar erros de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors.array()
        });
    }
    next();
};

// POST /api/auth/register - Registrar novo usuário
router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const userData = req.body;
        const user = await authService.register(userData, req.requestInfo);

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            data: {
                user
            }
        });

    } catch (error) {
        console.error('❌ Erro no registro:', error.message);
        
        let statusCode = 400;
        if (error.message.includes('já está em uso')) {
            statusCode = 409; // Conflict
        } else if (error.message.includes('Erro interno')) {
            statusCode = 500;
        }

        res.status(statusCode).json({
            success: false,
            message: error.message,
            code: 'REGISTRATION_ERROR'
        });
    }
});

// POST /api/auth/login - Login do usuário
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const credentials = req.body;
        const result = await authService.login(credentials, req.requestInfo);

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: result
        });

    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        
        let statusCode = 401;
        if (error.message.includes('obrigatórios')) {
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            message: error.message,
            code: 'LOGIN_ERROR'
        });
    }
});

// POST /api/auth/logout - Logout do usuário
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        await authService.logout(req.token, req.requestInfo);

        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro no logout:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'LOGOUT_ERROR'
        });
    }
});

// GET /api/auth/me - Obter dados do usuário autenticado
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter dados do usuário:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'USER_DATA_ERROR'
        });
    }
});

// PUT /api/auth/change-password - Alterar senha
router.put('/change-password', authenticateToken, changePasswordValidation, handleValidationErrors, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.id, oldPassword, newPassword);

        res.json({
            success: true,
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao alterar senha:', error.message);
        
        let statusCode = 400;
        if (error.message.includes('não encontrado')) {
            statusCode = 404;
        } else if (error.message.includes('incorreta')) {
            statusCode = 401;
        }

        res.status(statusCode).json({
            success: false,
            message: error.message,
            code: 'PASSWORD_CHANGE_ERROR'
        });
    }
});

// GET /api/auth/sessions - Listar sessões ativas
router.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const sessions = await authService.getUserSessions(req.user.id);

        res.json({
            success: true,
            data: {
                sessions
            }
        });

    } catch (error) {
        console.error('❌ Erro ao listar sessões:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'SESSIONS_ERROR'
        });
    }
});

// POST /api/auth/verify - Verificar se token é válido
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token é obrigatório',
                code: 'NO_TOKEN'
            });
        }

        const user = await authService.verifyAuthentication(token);

        res.json({
            success: true,
            message: 'Token válido',
            data: {
                user,
                valid: true
            }
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message,
            data: {
                valid: false
            },
            code: 'INVALID_TOKEN'
        });
    }
});

module.exports = router;
