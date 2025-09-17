const express = require('express');
const { param, validationResult } = require('express-validator');
const { authenticateToken, extractRequestInfo } = require('../middleware/auth');
const Database = require('../database/database');
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
        const db = Database.getInstance();
        const { page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const analyses = await db.all(`
            SELECT 
                wa.id,
                wa.protocol_number,
                wa.image_filename,
                wa.lesion_location,
                wa.diagnosis_primary,
                wa.diagnosis_confidence,
                wa.severity,
                wa.status,
                wa.created_at,
                wa.updated_at,
                p.name as patient_name,
                p.id as patient_id
            FROM wound_analyses wa
            LEFT JOIN patients p ON wa.patient_id = p.id
            WHERE wa.user_id = ?
            ORDER BY wa.created_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, limit, offset]);

        // Contar total de análises
        const totalResult = await db.get(`
            SELECT COUNT(*) as total 
            FROM wound_analyses 
            WHERE user_id = ?
        `, [req.user.id]);

        res.json({
            success: true,
            data: {
                analyses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: totalResult.total,
                    totalPages: Math.ceil(totalResult.total / limit)
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
        const db = Database.getInstance();
        const analysisId = parseInt(req.params.id);

        const analysis = await db.get(`
            SELECT 
                wa.*,
                p.name as patient_name,
                p.birth_date as patient_birth_date,
                p.gender as patient_gender
            FROM wound_analyses wa
            LEFT JOIN patients p ON wa.patient_id = p.id
            WHERE wa.id = ? AND wa.user_id = ?
        `, [analysisId, req.user.id]);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada',
                code: 'ANALYSIS_NOT_FOUND'
            });
        }

        // Parse dos campos JSON
        if (analysis.patient_context) {
            try {
                analysis.patient_context = JSON.parse(analysis.patient_context);
            } catch (e) {
                analysis.patient_context = null;
            }
        }

        if (analysis.analysis_result) {
            try {
                analysis.analysis_result = JSON.parse(analysis.analysis_result);
            } catch (e) {
                analysis.analysis_result = null;
            }
        }

        res.json({
            success: true,
            data: {
                analysis
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

// DELETE /api/analyses/:id - Excluir análise
router.delete('/:id', idValidation, handleValidationErrors, async (req, res) => {
    try {
        const db = Database.getInstance();
        const analysisId = parseInt(req.params.id);

        // Verificar se análise existe e pertence ao usuário
        const existingAnalysis = await db.get(`
            SELECT id, image_path, image_filename 
            FROM wound_analyses 
            WHERE id = ? AND user_id = ?
        `, [analysisId, req.user.id]);

        if (!existingAnalysis) {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada',
                code: 'ANALYSIS_NOT_FOUND'
            });
        }

        // Deletar análise do banco de dados
        await db.deleteWoundAnalysis(analysisId, req.user.id);

        // Tentar remover arquivo de imagem (não crítico se falhar)
        try {
            if (existingAnalysis.image_path) {
                const imagePath = path.resolve(existingAnalysis.image_path);
                await fs.unlink(imagePath);
                console.log(`✅ Imagem removida: ${existingAnalysis.image_filename}`);
            }
        } catch (imageError) {
            console.warn(`⚠️ Não foi possível remover imagem: ${existingAnalysis.image_filename}`, imageError.message);
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

// DELETE /api/analyses/bulk - Excluir múltiplas análises
router.delete('/bulk', async (req, res) => {
    try {
        const db = Database.getInstance();
        const { analysisIds } = req.body;

        if (!Array.isArray(analysisIds) || analysisIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Lista de IDs de análises é obrigatória',
                code: 'INVALID_ANALYSIS_IDS'
            });
        }

        // Verificar se todas as análises pertencem ao usuário
        const placeholders = analysisIds.map(() => '?').join(',');
        const existingAnalyses = await db.all(`
            SELECT id, image_path, image_filename 
            FROM wound_analyses 
            WHERE id IN (${placeholders}) AND user_id = ?
        `, [...analysisIds, req.user.id]);

        if (existingAnalyses.length !== analysisIds.length) {
            return res.status(404).json({
                success: false,
                message: 'Uma ou mais análises não foram encontradas',
                code: 'ANALYSES_NOT_FOUND'
            });
        }

        // Deletar análises do banco de dados
        await db.bulkDeleteWoundAnalyses(analysisIds, req.user.id);

        // Tentar remover arquivos de imagem
        let removedImages = 0;
        for (const analysis of existingAnalyses) {
            try {
                if (analysis.image_path) {
                    const imagePath = path.resolve(analysis.image_path);
                    await fs.unlink(imagePath);
                    removedImages++;
                }
            } catch (imageError) {
                console.warn(`⚠️ Não foi possível remover imagem: ${analysis.image_filename}`, imageError.message);
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

module.exports = router;