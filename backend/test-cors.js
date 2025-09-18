require('dotenv').config();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

console.log('=== TESTE DE CONFIGURAÇÃO CORS ===');
console.log('Allowed Origins configuradas:');
allowedOrigins.forEach((origin, index) => {
  console.log(`  ${index + 1}. ${origin}`);
});

console.log('\nVariáveis de ambiente:');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);

// Teste da função CORS
function testCorsOrigin(origin) {
  if (!origin) return { allowed: true, reason: 'No origin (mobile/Postman)' };
  
  if (allowedOrigins.indexOf(origin) !== -1) {
    return { allowed: true, reason: 'Origin in allowed list' };
  } else {
    return { allowed: false, reason: 'Origin not in allowed list' };
  }
}

console.log('\n=== TESTES DE ORIGEM ===');
const testOrigins = [
  'https://fecha-ferida-jopi2g8my-dheiver2s-projects.vercel.app',
  'https://frontend-4me393ux6-dheiver2s-projects.vercel.app',
  'http://localhost:5173',
  'https://malicious-site.com'
];

testOrigins.forEach(origin => {
  const result = testCorsOrigin(origin);
  console.log(`${result.allowed ? '✅' : '❌'} ${origin} - ${result.reason}`);
});