const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDatabase } = require('../database/database');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'fecha-ferida-secret-key-2024';
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
        const db = await getDatabase();
        
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
            const existingUser = await db.getUserByEmail(email);
            if (existingUser) {
                throw new Error('Email já está em uso');
            }

            // Hash da senha
            const password_hash = await this.hashPassword(password);

            // Criar usuário
            const result = await db.createUser({
                email,
                password_hash,
                name,
                role,
                specialty,
                crm,
                institution,
                phone
            });

            // Log da ação
            await db.logAction({
                user_id: result.id,
                action: 'register',
                resource_type: 'user',
                resource_id: result.id,
                details: { email, name, role },
                ip_address: requestInfo.ip,
                user_agent: requestInfo.userAgent
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
        const db = await getDatabase();
        
        try {
            const { email, password } = credentials;
            
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Buscar usuário
            const user = await db.getUserByEmail(email);
            if (!user) {
                throw new Error('Credenciais inválidas');
            }

            // Verificar senha
            const isValidPassword = await this.verifyPassword(password, user.password_hash);
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
            await db.createSession({
                user_id: user.id,
                token_hash: tokenHash,
                device_info: requestInfo.deviceInfo || 'Unknown',
                ip_address: requestInfo.ip,
                user_agent: requestInfo.userAgent,
                expires_at: expiresAt.toISOString()
            });

            // Atualizar último login
            await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            // Log da ação
            await db.logAction({
                user_id: user.id,
                action: 'login',
                resource_type: 'user',
                resource_id: user.id,
                details: { email },
                ip_address: requestInfo.ip,
                user_agent: requestInfo.userAgent
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
        const db = await getDatabase();
        
        try {
            const tokenHash = this.hashToken(token);
            
            // Buscar sessão ativa
            const session = await db.getActiveSession(tokenHash);
            if (session) {
                // Invalidar sessão
                await db.invalidateSession(tokenHash);

                // Log da ação
                await db.logAction({
                    user_id: session.user_id,
                    action: 'logout',
                    resource_type: 'user',
                    resource_id: session.user_id,
                    details: { email: session.email },
                    ip_address: requestInfo.ip,
                    user_agent: requestInfo.userAgent
                });

                console.log(`✅ Logout realizado: ${session.email}`);
            }

            return { success: true };

        } catch (error) {
            console.error('❌ Erro no logout:', error.message);
            throw error;
        }
    }

    // Verificar se usuário está autenticado
    async verifyAuthentication(token) {
        const db = await getDatabase();
        
        try {
            // Verificar token JWT
            const decoded = this.verifyToken(token);
            const tokenHash = this.hashToken(token);

            // Verificar sessão no banco
            const session = await db.getActiveSession(tokenHash);
            if (!session) {
                throw new Error('Sessão inválida ou expirada');
            }

            // Atualizar último uso da sessão
            await db.run('UPDATE user_sessions SET last_used = CURRENT_TIMESTAMP WHERE token_hash = ?', [tokenHash]);

            return {
                id: session.user_id,
                email: session.email,
                name: session.name,
                role: session.role
            };

        } catch (error) {
            console.error('❌ Erro na verificação de autenticação:', error.message);
            throw error;
        }
    }

    // Alterar senha
    async changePassword(userId, oldPassword, newPassword) {
        const db = await getDatabase();
        
        try {
            if (!oldPassword || !newPassword) {
                throw new Error('Senha atual e nova senha são obrigatórias');
            }

            if (newPassword.length < 6) {
                throw new Error('Nova senha deve ter pelo menos 6 caracteres');
            }

            // Buscar usuário
            const user = await db.getUserById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Verificar senha atual
            const isValidPassword = await this.verifyPassword(oldPassword, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Senha atual incorreta');
            }

            // Hash da nova senha
            const newPasswordHash = await this.hashPassword(newPassword);

            // Atualizar senha
            await db.run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
                [newPasswordHash, userId]);

            // Invalidar todas as sessões do usuário (forçar novo login)
            await db.run('UPDATE user_sessions SET is_active = 0 WHERE user_id = ?', [userId]);

            console.log(`✅ Senha alterada para usuário ID: ${userId}`);
            
            return { success: true };

        } catch (error) {
            console.error('❌ Erro ao alterar senha:', error.message);
            throw error;
        }
    }

    // Listar sessões ativas do usuário
    async getUserSessions(userId) {
        const db = await getDatabase();
        
        try {
            const sql = `
                SELECT id, device_info, ip_address, created_at, last_used, expires_at
                FROM user_sessions 
                WHERE user_id = ? AND is_active = 1 AND expires_at > datetime('now')
                ORDER BY last_used DESC
            `;
            
            return await db.all(sql, [userId]);

        } catch (error) {
            console.error('❌ Erro ao buscar sessões:', error.message);
            throw error;
        }
    }
}

module.exports = new AuthService();