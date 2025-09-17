const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { authenticateToken, requireRole, extractRequestInfo } = require('../middleware/auth');
const Database = require('../database/database');

const router = express.Router();

// Middleware para autenticação e extração de informações
router.use(authenticateToken);
router.use(extractRequestInfo);

// Validações
const patientValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Nome deve ter entre 2 e 255 caracteres'),
    body('email')
        .optional({ nullable: true })
        .isEmail()
        .normalizeEmail()
        .withMessage('Email deve ser válido'),
    body('phone')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('Telefone deve ter no máximo 20 caracteres'),
    body('birth_date')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Data de nascimento deve ser uma data válida (YYYY-MM-DD)'),
    body('gender')
        .optional({ nullable: true })
        .isIn(['M', 'F', 'O'])
        .withMessage('Gênero deve ser M (Masculino), F (Feminino) ou O (Outro)'),
    body('cpf')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 14 })
        .withMessage('CPF deve ter no máximo 14 caracteres'),
    body('address')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage('Endereço deve ter no máximo 500 caracteres'),
    body('medical_history')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Histórico médico deve ter no máximo 2000 caracteres'),
    body('allergies')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Alergias devem ter no máximo 1000 caracteres'),
    body('medications')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Medicações devem ter no máximo 1000 caracteres'),
    body('emergency_contact')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 255 })
        .withMessage('Contato de emergência deve ter no máximo 255 caracteres'),
    body('emergency_phone')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('Telefone de emergência deve ter no máximo 20 caracteres')
];

const searchValidation = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Termo de busca deve ter entre 1 e 100 caracteres'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página deve ser um número inteiro positivo'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite deve ser um número entre 1 e 100'),
    query('sort_by')
        .optional()
        .isIn(['name', 'created_at', 'updated_at'])
        .withMessage('Ordenação deve ser por: name, created_at ou updated_at'),
    query('sort_order')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('Ordem deve ser ASC ou DESC')
];

const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID deve ser um número inteiro positivo')
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

// GET /api/patients - Listar pacientes com busca e paginação
router.get('/', searchValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const {
            search = '',
            page = 1,
            limit = 20,
            sort_by = 'name',
            sort_order = 'ASC'
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Query base
        let whereClause = 'WHERE created_by = ?';
        let params = [req.user.id];

        // Adicionar busca se fornecida
        if (search) {
            whereClause += ' AND (name LIKE ? OR email LIKE ? OR cpf LIKE ? OR phone LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Query para contar total
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM patients 
            ${whereClause}
        `;
        const countResult = await db.get(countQuery, params);
        const total = countResult.total;

        // Query para buscar pacientes
        const patientsQuery = `
            SELECT 
                id, name, email, phone, birth_date, gender, cpf,
                created_at, updated_at
            FROM patients 
            ${whereClause}
            ORDER BY ${sort_by} ${sort_order}
            LIMIT ? OFFSET ?
        `;
        params.push(parseInt(limit), offset);

        const patients = await db.all(patientsQuery, params);

        // Calcular informações de paginação
        const totalPages = Math.ceil(total / parseInt(limit));
        const hasNext = parseInt(page) < totalPages;
        const hasPrev = parseInt(page) > 1;

        res.json({
            success: true,
            data: {
                patients,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_items: total,
                    items_per_page: parseInt(limit),
                    has_next: hasNext,
                    has_previous: hasPrev
                }
            }
        });

    } catch (error) {
        console.error('❌ Erro ao listar pacientes:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENTS_LIST_ERROR'
        });
    }
});

// GET /api/patients/:id - Obter paciente específico
router.get('/:id', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const patientId = parseInt(req.params.id);

        const patient = await db.get(`
            SELECT * FROM patients 
            WHERE id = ? AND created_by = ?
        `, [patientId, req.user.id]);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        res.json({
            success: true,
            data: {
                patient
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter paciente:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENT_GET_ERROR'
        });
    }
});

// POST /api/patients - Criar novo paciente
router.post('/', patientValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const patientData = {
            ...req.body,
            created_by: req.user.id
        };

        // Verificar se já existe paciente com mesmo CPF (se fornecido)
        if (patientData.cpf) {
            const existingPatient = await db.get(`
                SELECT id FROM patients 
                WHERE cpf = ? AND created_by = ?
            `, [patientData.cpf, req.user.id]);

            if (existingPatient) {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe um paciente com este CPF',
                    code: 'CPF_ALREADY_EXISTS'
                });
            }
        }

        const result = await db.createPatient(patientData);

        res.status(201).json({
            success: true,
            message: 'Paciente criado com sucesso',
            data: {
                patient: result
            }
        });

    } catch (error) {
        console.error('❌ Erro ao criar paciente:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENT_CREATE_ERROR'
        });
    }
});

// PUT /api/patients/:id - Atualizar paciente
router.put('/:id', idValidation, patientValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const existingPatient = await db.get(`
            SELECT id FROM patients 
            WHERE id = ? AND created_by = ?
        `, [patientId, req.user.id]);

        if (!existingPatient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        // Verificar se CPF já está em uso por outro paciente (se fornecido)
        if (req.body.cpf) {
            const cpfInUse = await db.get(`
                SELECT id FROM patients 
                WHERE cpf = ? AND id != ? AND created_by = ?
            `, [req.body.cpf, patientId, req.user.id]);

            if (cpfInUse) {
                return res.status(409).json({
                    success: false,
                    message: 'CPF já está em uso por outro paciente',
                    code: 'CPF_ALREADY_EXISTS'
                });
            }
        }

        const result = await db.updatePatient(patientId, req.body);

        res.json({
            success: true,
            message: 'Paciente atualizado com sucesso',
            data: {
                patient: result
            }
        });

    } catch (error) {
        console.error('❌ Erro ao atualizar paciente:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENT_UPDATE_ERROR'
        });
    }
});

// DELETE /api/patients/:id - Excluir paciente
router.delete('/:id', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const existingPatient = await db.get(`
            SELECT id FROM patients 
            WHERE id = ? AND created_by = ?
        `, [patientId, req.user.id]);

        if (!existingPatient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        // Verificar se existem análises associadas
        const analysisCount = await db.get(`
            SELECT COUNT(*) as count 
            FROM wound_analyses 
            WHERE patient_id = ?
        `, [patientId]);

        if (analysisCount.count > 0) {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir paciente com análises associadas',
                code: 'PATIENT_HAS_ANALYSES'
            });
        }

        await db.run(`
            DELETE FROM patients 
            WHERE id = ? AND created_by = ?
        `, [patientId, req.user.id]);

        res.json({
            success: true,
            message: 'Paciente excluído com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao excluir paciente:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENT_DELETE_ERROR'
        });
    }
});

// GET /api/patients/:id/analyses - Obter análises do paciente
router.get('/:id/analyses', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const patient = await db.get(`
            SELECT id FROM patients 
            WHERE id = ? AND created_by = ?
        `, [patientId, req.user.id]);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        const analyses = await db.all(`
            SELECT 
                id, image_path, analysis_result, confidence_score,
                created_at, updated_at
            FROM wound_analyses 
            WHERE patient_id = ?
            ORDER BY created_at DESC
        `, [patientId]);

        res.json({
            success: true,
            data: {
                analyses
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter análises do paciente:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'PATIENT_ANALYSES_ERROR'
        });
    }
});

module.exports = router;