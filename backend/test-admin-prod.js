const fetch = require('node-fetch');

async function testAdminLogin() {
    const BACKEND_URL = 'https://worthy-clarity-production.up.railway.app';
    
    try {
        console.log('🔍 Testando login do administrador em produção...');
        console.log('🌐 URL:', BACKEND_URL);
        
        // Testar se o servidor está respondendo
        console.log('\n1. Testando se o servidor está online...');
        const healthResponse = await fetch(`${BACKEND_URL}/api/auth/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!healthResponse.ok) {
            console.log('❌ Servidor não está respondendo');
            return;
        }
        
        console.log('✅ Servidor está online');
        
        // Testar login do admin
        console.log('\n2. Testando login do administrador...');
        const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@fechaferida.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
            console.log('✅ Login do administrador funcionando!');
            console.log('📋 Dados retornados:', {
                user: loginData.user?.email,
                role: loginData.user?.role,
                hasToken: !!loginData.token
            });
        } else {
            console.log('❌ Erro no login:', loginData);
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar:', error.message);
    }
}

testAdminLogin();