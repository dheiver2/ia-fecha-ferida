const { PrismaClient } = require('@prisma/client');

class Database {
    constructor() {
        this.prisma = null;
    }

    // Conectar ao banco (alias para initialize)
    async connect() {
        return await this.initialize();
    }

    // Inicializar conexão com o banco
    async initialize() {
        try {
            console.log('🗄️ Inicializando Prisma Client...');
            
            this.prisma = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'],
            });

            // Conectar ao banco
            await this.prisma.$connect();
            
            console.log('✅ Conectado ao banco via Prisma');
            console.log('🎉 Banco de dados inicializado com sucesso!');
            return this.prisma;
        } catch (error) {
            console.error('❌ Erro ao inicializar Prisma:', error);
            throw error;
        }
    }

    // Fechar conexão
    async close() {
        try {
            if (this.prisma) {
                await this.prisma.$disconnect();
                console.log('✅ Conexão com banco fechada');
            }
        } catch (error) {
            console.error('❌ Erro ao fechar banco:', error);
            throw error;
        }
    }

    // Métodos de conveniência para usuários
    async createUser(userData) {
        const { email, password_hash, name, role = 'user', specialty, crm, institution, phone } = userData;
        
        return await this.prisma.user.create({
            data: {
                email,
                passwordHash: password_hash,
                name,
                role,
                specialty,
                crm,
                institution,
                phone,
                isActive: true
            }
        });
    }

    async getUserByEmail(email) {
        return await this.prisma.user.findFirst({
            where: {
                email,
                isActive: true
            }
        });
    }

    async getUserById(id) {
        return await this.prisma.user.findFirst({
            where: {
                id: parseInt(id),
                isActive: true
            }
        });
    }

    // Métodos para pacientes
    async createPatient(patientData) {
        const { 
            user_id, name, birth_date, gender, cpf, phone, email, 
            address, medical_history, allergies, current_medications,
            emergency_contact_name, emergency_contact_phone, notes 
        } = patientData;
        
        return await this.prisma.patient.create({
            data: {
                userId: parseInt(user_id),
                name,
                birthDate: new Date(birth_date),
                gender,
                cpf,
                phone,
                email,
                address,
                medicalHistory: medical_history,
                allergies,
                currentMedications: current_medications,
                emergencyContactName: emergency_contact_name,
                emergencyContactPhone: emergency_contact_phone,
                notes,
                isActive: true
            }
        });
    }

    async getPatientsByUser(userId) {
        return await this.prisma.patient.findMany({
            where: {
                userId: parseInt(userId),
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }

    // Métodos para análises
    async createWoundAnalysis(analysisData) {
        const {
            user_id, patient_id, protocol_number, image_filename, image_path,
            lesion_location, patient_context, analysis_result, diagnosis_primary,
            diagnosis_confidence, severity, healing_potential, wound_length,
            wound_width, wound_depth, wound_area, processing_time
        } = analysisData;
        
        return await this.prisma.woundAnalysis.create({
            data: {
                userId: parseInt(user_id),
                patientId: patient_id ? parseInt(patient_id) : null,
                protocolNumber: protocol_number,
                imageFilename: image_filename,
                imagePath: image_path,
                lesionLocation: lesion_location,
                patientContext: typeof patient_context === 'string' ? patient_context : JSON.stringify(patient_context),
                analysisResult: typeof analysis_result === 'string' ? analysis_result : JSON.stringify(analysis_result),
                diagnosisPrimary: diagnosis_primary,
                diagnosisConfidence: diagnosis_confidence,
                severity,
                healingPotential: healing_potential,
                woundLength: wound_length,
                woundWidth: wound_width,
                woundDepth: wound_depth,
                woundArea: wound_area,
                processingTime: processing_time,
                status: 'completed'
            }
        });
    }

    async getAnalysesByUser(userId, limit = 50) {
        return await this.prisma.woundAnalysis.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                patient: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
    }

    // Deletar uma análise específica
    async deleteWoundAnalysis(analysisId, userId) {
        return await this.prisma.woundAnalysis.delete({
            where: {
                id: parseInt(analysisId),
                userId: parseInt(userId)
            }
        });
    }

    // Deletar múltiplas análises
    async bulkDeleteWoundAnalyses(analysisIds, userId) {
        if (!Array.isArray(analysisIds) || analysisIds.length === 0) {
            throw new Error('Lista de IDs de análises é obrigatória');
        }

        const numericIds = analysisIds.map(id => parseInt(id));
        
        return await this.prisma.woundAnalysis.deleteMany({
            where: {
                id: {
                    in: numericIds
                },
                userId: parseInt(userId)
            }
        });
    }

    // Métodos para sessões
    async createSession(sessionData) {
        const { user_id, token_hash, device_info, ip_address, user_agent, expires_at } = sessionData;
        
        return await this.prisma.userSession.create({
            data: {
                userId: parseInt(user_id),
                tokenHash: token_hash,
                deviceInfo: device_info,
                ipAddress: ip_address,
                userAgent: user_agent,
                expiresAt: new Date(expires_at),
                isActive: true
            }
        });
    }

    async getActiveSession(tokenHash) {
        return await this.prisma.userSession.findFirst({
            where: {
                tokenHash: tokenHash,
                isActive: true,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });
    }

    async invalidateSession(tokenHash) {
        return await this.prisma.userSession.updateMany({
            where: {
                tokenHash: tokenHash
            },
            data: {
                isActive: false
            }
        });
    }

    // Log de auditoria
    async logAction(logData) {
        const { user_id, action, resource_type, resource_id, details, ip_address, user_agent } = logData;
        
        return await this.prisma.auditLog.create({
            data: {
                userId: user_id ? parseInt(user_id) : null,
                action,
                resourceType: resource_type,
                resourceId: resource_id,
                details: typeof details === 'string' ? details : JSON.stringify(details),
                ipAddress: ip_address,
                userAgent: user_agent
            }
        });
    }

    // Métodos de compatibilidade para queries diretas (se necessário)
    async run(sql, params = []) {
        // Para compatibilidade, mas recomenda-se usar os métodos específicos do Prisma
        console.warn('⚠️ Método run() é para compatibilidade. Use métodos específicos do Prisma.');
        return await this.prisma.$executeRaw`${sql}`;
    }

    async get(sql, params = []) {
        // Para compatibilidade, mas recomenda-se usar os métodos específicos do Prisma
        console.warn('⚠️ Método get() é para compatibilidade. Use métodos específicos do Prisma.');
        return await this.prisma.$queryRaw`${sql}`;
    }

    async all(sql, params = []) {
        // Para compatibilidade, mas recomenda-se usar os métodos específicos do Prisma
        console.warn('⚠️ Método all() é para compatibilidade. Use métodos específicos do Prisma.');
        return await this.prisma.$queryRaw`${sql}`;
    }
}

// Singleton instance
let dbInstance = null;

class DatabaseManager {
    static getInstance() {
        if (!dbInstance) {
            dbInstance = new Database();
        }
        return dbInstance;
    }

    static async getDatabase() {
        if (!dbInstance) {
            dbInstance = new Database();
            await dbInstance.initialize();
        }
        return dbInstance;
    }
}

module.exports = DatabaseManager;
