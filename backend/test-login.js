const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testLogin() {
    console.log('=== TESTE DE LOGIN ===');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NÃO CONFIGURADA');
    
    const prisma = new PrismaClient();
    
    try {
        console.log('1. Testando conexão com banco...');
        await prisma.$connect();
        console.log('✅ Conexão estabelecida');
        
        console.log('2. Buscando usuário admin...');
        const user = await prisma.user.findUnique({
            where: { email: 'admin@fechaferida.com' }
        });
        
        if (!user) {
            console.log('❌ Usuário admin não encontrado');
            return;
        }
        
        console.log('✅ Usuário encontrado:', {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
        
        console.log('3. Testando senha...');
        const isValidPassword = await bcrypt.compare('admin123', user.passwordHash);
        console.log('✅ Senha válida:', isValidPassword);
        
        if (isValidPassword) {
            console.log('🎉 Login funcionaria perfeitamente!');
        } else {
            console.log('❌ Senha inválida');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin();