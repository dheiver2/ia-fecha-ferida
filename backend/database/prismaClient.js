/**
 * Singleton do PrismaClient para evitar múltiplas instâncias
 * Isso previne problemas de conexão e melhora a performance
 */
const { PrismaClient } = require('@prisma/client');

// Usar variável global para manter a instância em desenvolvimento (hot reload)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;
