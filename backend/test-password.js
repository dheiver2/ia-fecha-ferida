const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testPassword() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Testando verificação de senha...');
        
        // Buscar usuário admin
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@fechaferida.com' }
        });
        
        if (!admin) {
            console.log('❌ Usuário admin não encontrado');
            return;
        }
        
        console.log(`✅ Usuário encontrado: ${admin.name}`);
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Hash da senha: ${admin.passwordHash.substring(0, 30)}...`);
        
        // Testar senha
        const testPassword = 'admin123';
        console.log(`\n🧪 Testando senha: "${testPassword}"`);
        
        const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
        
        if (isValid) {
            console.log('✅ Senha VÁLIDA! A verificação está funcionando.');
        } else {
            console.log('❌ Senha INVÁLIDA! Há um problema na verificação.');
            
            // Vamos testar criando um novo hash
            console.log('\n🔧 Testando criação de novo hash...');
            const newHash = await bcrypt.hash(testPassword, 12);
            console.log(`Novo hash: ${newHash.substring(0, 30)}...`);
            
            const isNewValid = await bcrypt.compare(testPassword, newHash);
            console.log(`Novo hash válido: ${isNewValid ? 'SIM' : 'NÃO'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar senha:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testPassword();