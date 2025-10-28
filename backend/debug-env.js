/*
  Simple environment diagnostics for backend
  Usage: node debug-env.js
*/

const required = [
  'NODE_ENV',
  'PORT',
  'GEMINI_API_KEY',
  'JWT_SECRET',
  'DATABASE_URL',
  'FRONTEND_URL'
];

const optional = [
  'ALLOWED_ORIGINS',
  'JWT_EXPIRES_IN',
  'BCRYPT_ROUNDS',
  'MAX_FILE_SIZE',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS',
  'UPLOAD_PATH'
];

const redacted = new Set(['GEMINI_API_KEY', 'JWT_SECRET', 'DATABASE_URL']);

let hasError = false;

console.log('== Backend Environment Diagnostic ==');

for (const key of required) {
  const val = process.env[key];
  if (!val) {
    console.error(`❌ Missing required env: ${key}`);
    hasError = true;
  } else {
    const show = redacted.has(key) ? '<redacted>' : val;
    console.log(`✅ ${key} = ${show}`);
  }
}

for (const key of optional) {
  const val = process.env[key];
  if (val) {
    console.log(`ℹ️  ${key} = ${redacted.has(key) ? '<redacted>' : val}`);
  }
}

if (hasError) {
  console.error('\nEnvironment check failed. Please set missing variables.');
  process.exitCode = 1;
} else {
  console.log('\nEnvironment looks OK.');
}