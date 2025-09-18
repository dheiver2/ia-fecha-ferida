const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Verificando usuários no banco...');
        
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                passwordHash: true,
                createdAt: true
            }
        });
        
        console.log(`📊 Total de usuários: ${users.length}`);
        
        if (users.length === 0) {
            console.log('❌ Nenhum usuário encontrado no banco');
        } else {
            console.log('\n👥 Usuários encontrados:');
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   ID: ${user.id}`);
                console.log(`   Password Hash: ${user.passwordHash ? 'Existe' : 'Não existe'}`);
                console.log(`   Criado em: ${user.createdAt}`);
            });
        }
        
        // Verificar especificamente o admin
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@fechaferida.com' }
        });
        
        if (admin) {
            console.log('\n✅ Usuário admin encontrado!');
            console.log(`   Hash da senha: ${admin.passwordHash.substring(0, 20)}...`);
        } else {
            console.log('\n❌ Usuário admin NÃO encontrado!');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar usuários:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();