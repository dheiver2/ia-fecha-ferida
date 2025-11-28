const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../database/prismaClient');

class AuthService {
    constructor() {
        // Validar JWT_SECRET obrigatório em produção
        if (!process.env.JWT_SECRET) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('JWT_SECRET é obrigatório em produção. Configure a variável de ambiente.');
            }
            console.warn('⚠️ AVISO: JWT_SECRET não configurado. Usando chave de desenvolvimento (NÃO USE EM PRODUÇÃO)');
        }
        this.jwtSecret = process.env.JWT_SECRET || 'dev-only-insecure-key-2024';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
        this.saltRounds = 12;
    }

    // Hash da senha
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            console.error('❌ Erro ao fazer hash da senha:', error);
            throw new Error('Erro interno do servidor');
        }
    }

    // Verificar senha
    async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('❌ Erro ao verificar senha:', error);
            return false;
        }
    }

    // Gerar JWT token
    generateToken(payload) {
        try {
            return jwt.sign(payload, this.jwtSecret, { 
                expiresIn: this.jwtExpiration,
                issuer: 'fecha-ferida-ia',
                audience: 'fecha-ferida-users'
            });
        } catch (error) {
            console.error('❌ Erro ao gerar token:', error);
            throw new Error('Erro ao gerar token de autenticação');
        }
    }

    // Verificar JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret, {
                issuer: 'fecha-ferida-ia',
                audience: 'fecha-ferida-users'
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado');
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Token inválido');
            } else {
                console.error('❌ Erro ao verificar token:', error);
                throw new Error('Erro na verificação do token');
            }
        }
    }

    // Hash do token para armazenar no banco
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    // Registrar novo usuário
    async register(userData, requestInfo = {}) {

        
        try {
            const { email, password, name, role = 'user', specialty, crm, institution, phone } = userData;
            
            // Validações básicas
            if (!email || !password || !name) {
                throw new Error('Email, senha e nome são obrigatórios');
            }

            if (password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }

            // Verificar se email já existe
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                throw new Error('Email já está em uso');
            }

            // Hash da senha
            const password_hash = await this.hashPassword(password);

            // Criar usuário
            const result = await prisma.user.create({
                data: {
                    email,
                    passwordHash: password_hash,
                    name,
                    role,
                    specialty,
                    crm,
                    institution,
                    phone
                }
            });

            // Log da ação
            await prisma.auditLog.create({
                data: {
                    userId: result.id,
                    action: 'register',
                    resourceType: 'user',
                    resourceId: result.id,
                    details: JSON.stringify({ email, name, role }),
                    ipAddress: requestInfo.ip,
                    userAgent: requestInfo.userAgent
                }
            });

            console.log(`✅ Usuário registrado: ${email} (ID: ${result.id})`);
            
            return {
                id: result.id,
                email,
                name,
                role,
                specialty,
                crm,
                institution
            };

        } catch (error) {
            console.error('❌ Erro no registro:', error.message);
            throw error;
        }
    }

    // Login do usuário
    async login(credentials, requestInfo = {}) {

        
        try {
            console.log('🔍 AuthService: Iniciando login...');
            console.log('🔍 Prisma instance:', prisma ? 'OK' : 'UNDEFINED');
            const { email, password } = credentials;
            
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            // Verificar senha
            const isValidPassword = await this.verifyPassword(password, user.passwordHash);
            if (!isValidPassword) {
                throw new Error('Credenciais inválidas');
            }

            // Gerar token
            const tokenPayload = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            };
            
            const token = this.generateToken(tokenPayload);
            const tokenHash = this.hashToken(token);

            // Calcular expiração
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

            // Salvar sessão
            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    tokenHash: tokenHash,
                    deviceInfo: requestInfo.deviceInfo || 'Unknown',
                    ipAddress: requestInfo.ip,
                    userAgent: requestInfo.userAgent,
                    expiresAt: expiresAt
                }
            });

            // Atualizar último login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });

            // Log da ação
            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'login',
                    resourceType: 'user',
                    resourceId: user.id,
                    details: JSON.stringify({ email }),
                    ipAddress: requestInfo.ip,
                    userAgent: requestInfo.userAgent
                }
            });

            console.log(`✅ Login realizado: ${email} (ID: ${user.id})`);

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    specialty: user.specialty,
                    crm: user.crm,
                    institution: user.institution
                }
            };

        } catch (error) {
            console.error('❌ Erro no login:', error.message);
            throw error;
        }
    }

    // Logout do usuário
    async logout(token, requestInfo = {}) {

        
        try {
            const tokenHash = this.hashToken(token);
            
            // Buscar sessão ativa
            const session = await prisma.userSession.findFirst({
                where: {
                    tokenHash: tokenHash,
                    expiresAt: { gt: new Date() }
                },
                include: { user: true }
            });
            if (session) {
                // Invalidar sessão
                await prisma.userSession.delete({
                    where: { id: session.id }
                });

                // Log da ação
                await prisma.auditLog.create({
                    data: {
                        userId: session.userId,
                        action: 'logout',
                        resourceType: 'user',
                        resourceId: session.userId,
                        details: JSON.stringify({ email: session.user.email }),
                        ipAddress: requestInfo.ip,
                        userAgent: requestInfo.userAgent
                    }
                });

                console.log(`✅ Logout realizado: ${session.user.email}`);
            }

            return { success: true };

        } catch (error) {
            console.error('❌ Erro no logout:', error.message);
            throw error;
        }
    }

    // Verificar se usuário está autenticado
    async verifyAuthentication(token) {

        
        try {
            // Verificar token JWT
            const decoded = this.verifyToken(token);
            const tokenHash = this.hashToken(token);

            // Verificar sessão no banco
            const session = await prisma.userSession.findFirst({
                where: {
                    tokenHash: tokenHash,
                    expiresAt: { gt: new Date() }
                },
                include: { user: true }
            });
            if (!session) {
                throw new Error('Sessão inválida ou expirada');
            }

            // Atualizar último uso da sessão
            await prisma.userSession.update({
                where: { id: session.id },
                data: { lastUsed: new Date() }
            });

            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role
            };

        } catch (error) {
            console.error('❌ Erro na verificação de autenticação:', error.message);
            throw error;
        }
    }

    // Alterar senha
    async changePassword(userId, oldPassword, newPassword) {

        
        try {
            if (!oldPassword || !newPassword) {
                throw new Error('Senha atual e nova senha são obrigatórias');
            }

            if (newPassword.length < 6) {
                throw new Error('Nova senha deve ter pelo menos 6 caracteres');
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Verificar senha atual
            const isValidPassword = await this.verifyPassword(oldPassword, user.passwordHash);
            if (!isValidPassword) {
                throw new Error('Senha atual incorreta');
            }

            // Hash da nova senha
            const newPasswordHash = await this.hashPassword(newPassword);

            // Atualizar senha
            await prisma.user.update({
                where: { id: userId },
                data: { 
                    passwordHash: newPasswordHash,
                    updatedAt: new Date()
                }
            });

            // Invalidar todas as sessões do usuário (forçar novo login)
            await prisma.userSession.updateMany({
                where: { userId: userId },
                data: { isActive: false }
            });

            // Log sem expor dados sensíveis
            if (process.env.NODE_ENV !== 'production') {
                console.log(`✅ Senha alterada para usuário ID: ${userId}`);
            }
            
            return { success: true };

        } catch (error) {
            console.error('❌ Erro ao alterar senha:', error.message);
            throw error;
        }
    }

    // Listar sessões ativas do usuário
    async getUserSessions(userId) {

        
        try {
            const sessions = await prisma.userSession.findMany({
                where: {
                    userId: userId,
                    isActive: true,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                select: {
                    id: true,
                    deviceInfo: true,
                    ipAddress: true,
                    createdAt: true,
                    lastUsed: true,
                    expiresAt: true
                },
                orderBy: {
                    lastUsed: 'desc'
                }
            });

            // Mapear campos para manter compatibilidade
            return sessions.map(session => ({
                id: session.id,
                device_info: session.deviceInfo,
                ip_address: session.ipAddress,
                created_at: session.createdAt,
                last_used: session.lastUsed,
                expires_at: session.expiresAt
            }));

        } catch (error) {
            console.error('❌ Erro ao buscar sessões:', error.message);
            throw error;
        }
    }
}

module.exports = new AuthService();