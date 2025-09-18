// Script para debugar variáveis de ambiente
console.log('=== DEBUG VARIÁVEIS DE AMBIENTE ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('CORS_UPDATE:', process.env.CORS_UPDATE);
console.log('DEPLOY_TIMESTAMP:', process.env.DEPLOY_TIMESTAMP);
console.log('=====================================');

// Verificar se há arquivo .env sendo lido
const fs = require('fs');
const path = require('path');

const envFiles = ['.env', '../.env', '.env.production'];
envFiles.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`Arquivo ${file} encontrado em: ${fullPath}`);
  } else {
    console.log(`Arquivo ${file} NÃO encontrado em: ${fullPath}`);
  }
});