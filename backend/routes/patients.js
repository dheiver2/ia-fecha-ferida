const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const { authenticateToken, requireRole, extractRequestInfo } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        
        const {
            search = '',
            page = 1,
            limit = 20,
            sort_by = 'name',
            sort_order = 'ASC'
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Construir filtros para Prisma
        const whereCondition = {
            userId: req.user.id
        };

        // Adicionar busca se fornecida
        if (search) {
            whereCondition.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { cpf: { contains: search } },
                { phone: { contains: search } }
            ];
        }

        // Mapear campos de ordenação
        const sortFieldMap = {
            'name': 'name',
            'created_at': 'createdAt',
            'updated_at': 'updatedAt'
        };

        const orderBy = {
            [sortFieldMap[sort_by]]: sort_order.toLowerCase()
        };

        // Contar total de registros
        const total = await prisma.patient.count({
            where: whereCondition
        });

        // Buscar pacientes
        const patients = await prisma.patient.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birthDate: true,
                gender: true,
                cpf: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy,
            skip: offset,
            take: parseInt(limit)
        });

        // Mapear campos para manter compatibilidade
        const mappedPatients = patients.map(patient => ({
            id: patient.id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            birth_date: patient.birthDate,
            gender: patient.gender,
            cpf: patient.cpf,
            created_at: patient.createdAt,
            updated_at: patient.updatedAt
        }));

        // Calcular informações de paginação
        const totalPages = Math.ceil(total / parseInt(limit));
        const hasNext = parseInt(page) < totalPages;
        const hasPrev = parseInt(page) > 1;

        res.json({
            success: true,
            data: {
                patients: mappedPatients,
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
        const patientId = parseInt(req.params.id);

        const patient = await prisma.patient.findFirst({
            where: {
                id: patientId,
                userId: req.user.id
            }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        // Mapear campos para manter compatibilidade
        const mappedPatient = {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            birth_date: patient.birthDate,
            gender: patient.gender,
            cpf: patient.cpf,
            address: patient.address,
            medical_history: patient.medicalHistory,
            created_by: patient.userId,
            created_at: patient.createdAt,
            updated_at: patient.updatedAt
        };

        res.json({
            success: true,
            data: {
                patient: mappedPatient
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

        const patientData = {
            ...req.body,
            created_by: req.user.id
        };

        // Verificar se já existe paciente com mesmo CPF (se fornecido)
        if (patientData.cpf) {
            const existingPatient = await prisma.patient.findFirst({
                where: {
                    cpf: patientData.cpf,
                    userId: req.user.id
                },
                select: { id: true }
            });

            if (existingPatient) {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe um paciente com este CPF',
                    code: 'CPF_ALREADY_EXISTS'
                });
            }
        }

        // Mapear campos para Prisma
        const prismaData = {
            name: patientData.name,
            email: patientData.email || null,
            phone: patientData.phone || null,
            birthDate: patientData.birth_date || null,
            gender: patientData.gender || null,
            cpf: patientData.cpf || null,
            address: patientData.address || null,
            medicalHistory: patientData.medical_history || null,
            userId: req.user.id
        };

        const result = await prisma.patient.create({
            data: prismaData
        });

        // Mapear resultado para manter compatibilidade
        const mappedResult = {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone,
            birth_date: result.birthDate,
            gender: result.gender,
            cpf: result.cpf,
            address: result.address,
            medical_history: result.medicalHistory,
            created_by: result.userId,
            created_at: result.createdAt,
            updated_at: result.updatedAt
        };

        res.status(201).json({
            success: true,
            message: 'Paciente criado com sucesso',
            data: {
                patient: mappedResult
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

        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const existingPatient = await prisma.patient.findFirst({
            where: {
                id: patientId,
                userId: req.user.id
            },
            select: { id: true }
        });

        if (!existingPatient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        // Verificar se CPF já está em uso por outro paciente (se fornecido)
        if (req.body.cpf) {
            const cpfInUse = await prisma.patient.findFirst({
                where: {
                    cpf: req.body.cpf,
                    id: { not: patientId },
                    userId: req.user.id
                },
                select: { id: true }
            });

            if (cpfInUse) {
                return res.status(409).json({
                    success: false,
                    message: 'CPF já está em uso por outro paciente',
                    code: 'CPF_ALREADY_EXISTS'
                });
            }
        }

        // Mapear campos para Prisma
        const updateData = {
            name: req.body.name,
            email: req.body.email || null,
            phone: req.body.phone || null,
            birthDate: req.body.birth_date || null,
            gender: req.body.gender || null,
            cpf: req.body.cpf || null,
            address: req.body.address || null,
            medicalHistory: req.body.medical_history || null
        };

        const result = await prisma.patient.update({
            where: { id: patientId },
            data: updateData
        });

        // Mapear resultado para manter compatibilidade
        const mappedResult = {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone,
            birth_date: result.birthDate,
            gender: result.gender,
            cpf: result.cpf,
            address: result.address,
            medical_history: result.medicalHistory,
            created_by: result.userId,
            created_at: result.createdAt,
            updated_at: result.updatedAt
        };

        res.json({
            success: true,
            message: 'Paciente atualizado com sucesso',
            data: {
                patient: mappedResult
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
        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const existingPatient = await prisma.patient.findFirst({
            where: {
                id: patientId,
                userId: req.user.id
            },
            select: { id: true }
        });

        if (!existingPatient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        // Verificar se existem análises associadas
        const analysisCount = await prisma.woundAnalysis.count({
            where: {
                patientId: patientId
            }
        });

        if (analysisCount > 0) {
            return res.status(409).json({
                success: false,
                message: 'Não é possível excluir paciente com análises associadas',
                code: 'PATIENT_HAS_ANALYSES'
            });
        }

        await prisma.patient.delete({
            where: {
                id: patientId
            }
        });

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
        const patientId = parseInt(req.params.id);

        // Verificar se paciente existe e pertence ao usuário
        const patient = await prisma.patient.findFirst({
            where: {
                id: patientId,
                userId: req.user.id
            },
            select: { id: true }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado',
                code: 'PATIENT_NOT_FOUND'
            });
        }

        const analyses = await prisma.woundAnalysis.findMany({
            where: {
                patientId: patientId
            },
            select: {
                id: true,
                imagePath: true,
                analysisResult: true,
                confidenceScore: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Mapear campos para manter compatibilidade
        const mappedAnalyses = analyses.map(analysis => ({
            id: analysis.id,
            image_path: analysis.imagePath,
            analysis_result: analysis.analysisResult,
            confidence_score: analysis.confidenceScore,
            created_at: analysis.createdAt,
            updated_at: analysis.updatedAt
        }));

        res.json({
            success: true,
            data: {
                analyses: mappedAnalyses
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