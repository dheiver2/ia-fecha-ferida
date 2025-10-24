const express = require('express');
const { param, validationResult } = require('express-validator');
const { authenticateToken, extractRequestInfo } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);
router.use(extractRequestInfo);

// Validação de ID
const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID deve ser um número inteiro positivo')
];

// Middleware para tratar erros de validação
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

// GET /api/analyses - Listar análises do usuário
router.get('/', async (req, res) => {
    try {
        // Usando Prisma Client
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        // Usar método específico do Prisma para buscar análises
        const analyses = await prisma.woundAnalysis.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: parseInt(limit),
            skip: offset
        });

        // Contar total de análises
        const total = await prisma.woundAnalysis.count({
            where: {
                userId: req.user.id
            }
        });

        // Mapear para formato compatível
        const mappedAnalyses = analyses.map(analysis => ({
            id: analysis.id,
            protocol_number: analysis.protocolNumber,
            image_filename: analysis.imageFilename,
            lesion_location: analysis.lesionLocation,
            diagnosis_primary: analysis.diagnosisPrimary,
            diagnosis_confidence: analysis.diagnosisConfidence,
            severity: analysis.severity,
            status: analysis.status,
            created_at: analysis.createdAt,
            updated_at: analysis.updatedAt,
            patient_name: analysis.patient?.name || null,
            patient_id: analysis.patient?.id || null,
            analysis_result: analysis.analysisResult
        }));

        res.json({
            success: true,
            data: {
                analyses: mappedAnalyses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('❌ Erro ao listar análises:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'ANALYSES_LIST_ERROR'
        });
    }
});

// GET /api/analyses/:id - Obter análise específica
router.get('/:id', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const analysisId = parseInt(req.params.id);

        const analysis = await prisma.woundAnalysis.findFirst({
            where: {
                id: analysisId,
                userId: req.user.id
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        birthDate: true,
                        gender: true
                    }
                }
            }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada',
                code: 'ANALYSIS_NOT_FOUND'
            });
        }

        // Parse dos campos JSON e mapear para formato compatível
        let patientContext = null;
        let analysisResult = null;

        if (analysis.patientContext) {
            try {
                patientContext = JSON.parse(analysis.patientContext);
            } catch (e) {
                patientContext = null;
            }
        }

        if (analysis.analysisResult) {
            try {
                analysisResult = JSON.parse(analysis.analysisResult);
            } catch (e) {
                analysisResult = null;
            }
        }

        // Mapear para formato compatível
        const mappedAnalysis = {
            id: analysis.id,
            user_id: analysis.userId,
            patient_id: analysis.patientId,
            protocol_number: analysis.protocolNumber,
            image_filename: analysis.imageFilename,
            image_path: analysis.imagePath,
            lesion_location: analysis.lesionLocation,
            patient_context: patientContext,
            analysis_result: analysisResult,
            diagnosis_primary: analysis.diagnosisPrimary,
            diagnosis_confidence: analysis.diagnosisConfidence,
            severity: analysis.severity,
            healing_potential: analysis.healingPotential,
            wound_length: analysis.woundLength,
            wound_width: analysis.woundWidth,
            wound_depth: analysis.woundDepth,
            wound_area: analysis.woundArea,
            processing_time: analysis.processingTime,
            status: analysis.status,
            created_at: analysis.createdAt,
            updated_at: analysis.updatedAt,
            patient_name: analysis.patient?.name || null,
            patient_birth_date: analysis.patient?.birthDate || null,
            patient_gender: analysis.patient?.gender || null
        };

        res.json({
            success: true,
            data: {
                analysis: mappedAnalysis
            }
        });

    } catch (error) {
        console.error('❌ Erro ao obter análise:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'ANALYSIS_GET_ERROR'
        });
    }
});

// DELETE /api/analyses/bulk - Excluir múltiplas análises
router.delete('/bulk', async (req, res) => {
    try {
        const { analysisIds } = req.body;

        if (!Array.isArray(analysisIds) || analysisIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de IDs de análises é obrigatória',
                code: 'INVALID_ANALYSIS_IDS'
            });
        }

        const numericIds = analysisIds.map(id => parseInt(id));

        // Verificar se todas as análises pertencem ao usuário
        const existingAnalyses = await prisma.woundAnalysis.findMany({
            where: {
                id: {
                    in: numericIds
                },
                userId: req.user.id
            },
            select: {
                id: true,
                imagePath: true,
                imageFilename: true
            }
        });

        if (existingAnalyses.length !== analysisIds.length) {
            return res.status(404).json({
                success: false,
                message: 'Uma ou mais análises não foram encontradas',
                code: 'ANALYSES_NOT_FOUND'
            });
        }

        // Deletar análises do banco de dados
        await prisma.woundAnalysis.deleteMany({
            where: {
                id: {
                    in: numericIds
                },
                userId: req.user.id
            }
        });

        // Tentar remover arquivos de imagem
        let removedImages = 0;
        for (const analysis of existingAnalyses) {
            try {
                if (analysis.imagePath) {
                    const imagePath = path.resolve(analysis.imagePath);
                    await fs.unlink(imagePath);
                    removedImages++;
                }
            } catch (imageError) {
                console.warn(`⚠️ Não foi possível remover imagem: ${analysis.imageFilename}`, imageError.message);
            }
        }

        res.json({
            success: true,
            message: `${analysisIds.length} análises excluídas com sucesso`,
            data: {
                deletedAnalyses: analysisIds.length,
                removedImages
            }
        });

    } catch (error) {
        console.error('❌ Erro ao excluir análises em lote:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'BULK_DELETE_ERROR'
        });
    }
});

// DELETE /api/analyses/:id - Excluir análise
router.delete('/:id', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const analysisId = parseInt(req.params.id);

        // Verificar se análise existe e pertence ao usuário
        const existingAnalysis = await prisma.woundAnalysis.findFirst({
            where: {
                id: analysisId,
                userId: req.user.id
            },
            select: {
                id: true,
                imagePath: true,
                imageFilename: true
            }
        });

        if (!existingAnalysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada',
                code: 'ANALYSIS_NOT_FOUND'
            });
        }

        // Deletar análise do banco de dados
        await prisma.woundAnalysis.delete({
            where: {
                id: analysisId
            }
        });

        // Tentar remover arquivo de imagem (não crítico se falhar)
        try {
            if (existingAnalysis.imagePath) {
                const imagePath = path.resolve(existingAnalysis.imagePath);
                await fs.unlink(imagePath);
                console.log(`✅ Imagem removida: ${existingAnalysis.imageFilename}`);
            }
        } catch (imageError) {
            console.warn(`⚠️ Não foi possível remover imagem: ${existingAnalysis.imageFilename}`, imageError.message);
            // Não falha a operação se não conseguir remover a imagem
        }

        res.json({
            success: true,
            message: 'Análise excluída com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro ao excluir análise:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            code: 'ANALYSIS_DELETE_ERROR'
        });
    }
});

module.exports = router;