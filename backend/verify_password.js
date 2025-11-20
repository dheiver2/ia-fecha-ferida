const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@fechaferida.com' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Hash:', user.passwordHash);
    
    const password = 'admin123';
    const match = await bcrypt.compare(password, user.passwordHash);
    
    console.log(`Password '${password}' matches? ${match}`);
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

verify();