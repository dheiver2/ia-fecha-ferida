const express = require('express');
const request = require('supertest');
const authRoutes = require('./routes/auth');

// Criar app de teste
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

async function testLoginRoute() {
    console.log('🧪 Testando rota de login...');
    
    const loginData = {
        email: 'admin@fechaferida.com',
        password: 'admin123'
    };
    
    try {
        const response = await request(app)
            .post('/api/auth/login')
            .send(loginData)
            .expect('Content-Type', /json/);
            
        console.log(`📊 Status: ${response.status}`);
        console.log(`📄 Resposta:`, JSON.stringify(response.body, null, 2));
        
        if (response.status === 200) {
            console.log('✅ Login bem-sucedido!');
        } else {
            console.log('❌ Login falhou');
        }
        
    } catch (error) {
        console.log('❌ Erro no teste:', error.message);
        if (error.response) {
            console.log(`📊 Status: ${error.response.status}`);
            console.log(`📄 Resposta:`, JSON.stringify(error.response.body, null, 2));
        }
    }
}

testLoginRoute();