const authService = require('./services/authService');

async function testLogin() {
    
    try {
        console.log('🧪 Testando login diretamente com authService...');
        
        const credentials = {
            email: 'admin@fechaferida.com',
            password: 'admin123'
        };
        
        console.log(`📧 Email: ${credentials.email}`);
        console.log(`🔑 Senha: ${credentials.password}`);
        
        const result = await authService.login(credentials, {
            ip: '127.0.0.1',
            userAgent: 'Test Script',
            deviceInfo: 'Test Device'
        });
        
        console.log('\n✅ Login bem-sucedido!');
        console.log('📊 Resultado:');
        console.log(`   Token: ${result.token.substring(0, 50)}...`);
        console.log(`   Usuário: ${result.user.name}`);
        console.log(`   Email: ${result.user.email}`);
        console.log(`   Role: ${result.user.role}`);
        
    } catch (error) {
        console.log('\n❌ Erro no login:');
        console.log(`   Mensagem: ${error.message}`);
        console.log(`   Stack: ${error.stack}`);
    }
}

testLogin();