import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Configurações
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/';
const MAX_SHOTS = parseInt(process.env.MAX_SHOTS || '10', 10);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fechaferida.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Lista fixa de rotas para capturas individuais
const ROUTES = [
  '/',
  '/login',
  '/register',
  '/paciente',
  '/simple',
  '/dashboard',
  '/analise',
  '/historico',
  '/teleconsulta',
  '/alertas',
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugifyUrl(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/?$/g, '')
    .replace(/[^a-zA-Z0-9/_-]/g, '-')
    .replace(/\//g, '_')
    .replace(/_{2,}/g, '_');
}

async function tryLogin(page) {
  try {
    console.log('🔐 Tentando login automatizado...');
    await page.goto(new URL('/login', BASE_URL).toString(), { waitUntil: 'networkidle0', timeout: 60000 });

    await page.waitForSelector('input#email');
    await page.type('input#email', ADMIN_EMAIL, { delay: 30 });
    await page.type('input#password', ADMIN_PASSWORD, { delay: 30 });

    await page.click('button[type="submit"]');

    // Aguardar navegação ou confirmação
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }).catch(() => {});

    // Pequena espera para transições
    await new Promise(res => setTimeout(res, 800));

    console.log('✅ Login automatizado concluído (se necessário).');
  } catch (err) {
    console.warn('⚠️ Login automatizado falhou ou não foi necessário:', err?.message || err);
  }
}

async function takeFullPageScreenshot(browser, url, outputDir) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Acessa a página
  const targetUrl = new URL(url, BASE_URL).toString();
  console.log('📸 Acessando:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  // Tenta logar se necessário (para páginas protegidas)
  await tryLogin(page);

  // Aguarda renderizações e transições
  await new Promise(res => setTimeout(res, 800));

  const safeName = slugifyUrl(targetUrl);
  const filePath = path.join(outputDir, `${safeName}.png`);

  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`💾 Screenshot salva: ${filePath}`);

  await page.close();
}

async function main() {
  const outputDir = path.resolve('frontend/public/screenshots');
  ensureDir(outputDir);

  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    const routesToCapture = ROUTES.slice(0, MAX_SHOTS);

    for (const route of routesToCapture) {
      await takeFullPageScreenshot(browser, route, outputDir);
    }
  } catch (err) {
    console.error('❌ Erro ao capturar screenshots:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();