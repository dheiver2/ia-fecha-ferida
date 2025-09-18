const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Testando conexão com Prisma...');
        const users = await prisma.user.findMany();
        console.log('✅ Prisma funcionando! Usuários encontrados:', users.length);
        
        if (users.length > 0) {
            console.log('Primeiro usuário:', {
                id: users[0].id,
                email: users[0].email,
                name: users[0].name,
                role: users[0].role
            });
        }
        
    } catch (error) {
        console.error('❌ Erro no Prisma:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

testPrisma();