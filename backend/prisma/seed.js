const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Verificar se o usuário administrador já existe
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@fechaferida.com'
      }
    });

    if (existingAdmin) {
      console.log('✅ Usuário administrador já existe no banco de dados');
      return;
    }

    // Hash da senha padrão
    const passwordHash = await bcrypt.hash('admin123', 12);

    // Criar usuário administrador
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@fechaferida.com',
        passwordHash: passwordHash,
        name: 'Administrador Sistema',
        role: 'admin',
        specialty: 'Administração',
        crm: 'ADMIN-2024',
        institution: 'Sistema Fecha Ferida IA',
        isActive: true,
        emailVerified: true
      }
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Senha: admin123');
    console.log('👤 Nome:', adminUser.name);
    console.log('🎭 Role:', adminUser.role);
    console.log('🆔 ID:', adminUser.id);

  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seed concluído com sucesso!');
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
