const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
// Usando template simplificado para evitar problemas de parsing JSON
const { createSimplifiedPrompt, createPrognosisPrompt } = require('../templates/simplifiedMedicalReportTemplate.js');

// Lista base alinhada com a documentação e README
const DEFAULT_MODEL_PRIORITY = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.0-pro',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-flash-001'
];

class GeminiService {
  constructor() {
    // Verificar se a API key está configurada
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não está configurada no arquivo .env');
      throw new Error('GEMINI_API_KEY não configurada');
    }
    
    // Verificar se a API key não está vazia ou é um placeholder
    if (process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || 
        process.env.GEMINI_API_KEY.length < 20) {
      console.error('❌ GEMINI_API_KEY parece ser inválida ou um placeholder');
      throw new Error('GEMINI_API_KEY inválida');
    }
    
    // Define lista de modelos respeitando variáveis de ambiente e fallback
    this.availableModels = this.buildModelPriorityList();
    console.log('📋 Prioridade de modelos configurada:', this.availableModels.join(', '));
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.currentModel = null;
    this.model = null;
    
    // Configurações de segurança para permitir conteúdo médico
    this.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    // Instrução de sistema para reforçar o contexto médico e evitar bloqueios
    this.systemInstruction = {
      role: "system",
      parts: [{ text: "Você é um assistente médico especializado em dermatologia e tratamento de feridas. Sua função é analisar imagens clínicas para fins de diagnóstico e tratamento. As imagens fornecidas são de contexto médico profissional e não devem ser interpretadas como conteúdo violento ou explícito. Forneça análises técnicas, objetivas e estruturadas." }]
    };

    // Inicializar com o primeiro modelo disponível
    this.initializeModel();
  }

  buildModelPriorityList() {
    const rawEnvValue = process.env.GEMINI_MODEL_PRIORITY || '';
    const envModels = rawEnvValue
      .split(',')
      .map((model) => model.trim())
      .filter(Boolean);

    const priority = [];

    const addModel = (modelName) => {
      if (!modelName) return;
      const sanitized = modelName.replace(/^models\//, '');
      if (!sanitized.startsWith('gemini')) return;
      if (!priority.includes(sanitized)) {
        priority.push(sanitized);
      }
    };

    envModels.forEach(addModel);
    DEFAULT_MODEL_PRIORITY.forEach(addModel);

    return priority;
  }

  async initializeModel() {
    for (const modelName of this.availableModels) {
      try {
        console.log(`🔄 Tentando inicializar modelo: ${modelName}`);
        this.model = this.genAI.getGenerativeModel({ 
          model: modelName,
          safetySettings: this.safetySettings,
          systemInstruction: this.systemInstruction
        });
        this.currentModel = modelName;
        console.log(`✅ Gemini AI inicializado com sucesso com modelo: ${modelName}`);
        return;
      } catch (error) {
        console.log(`⚠️ Modelo ${modelName} não disponível: ${error.message}`);
        continue;
      }
    }
    
    // Se chegou aqui, nenhum modelo funcionou
    console.error('❌ Nenhum modelo Gemini disponível');
    throw new Error('Nenhum modelo Gemini disponível');
  }

  async tryWithFallback(operation) {
    let lastError = null;
    
    for (const modelName of this.availableModels) {
      try {
        console.log(`🔄 Tentando operação com modelo: ${modelName}`);
        this.model = this.genAI.getGenerativeModel({ 
          model: modelName,
          safetySettings: this.safetySettings,
          systemInstruction: this.systemInstruction
        });
        this.currentModel = modelName;
        
        const result = await operation();
        console.log(`✅ Operação bem-sucedida com modelo: ${modelName}`);
        return result;
      } catch (error) {
        console.log(`⚠️ Falha com modelo ${modelName}: ${error.message}`);
        lastError = error;
        
        // Tratamento específico para diferentes tipos de erro
        if (error.message.includes('API key expired') || error.message.includes('API_KEY_INVALID')) {
          throw new Error('API key do Google Gemini expirada. Por favor, renove a chave de API no arquivo .env');
        } else if (error.message.includes('quota exceeded') || error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('Cota da API do Google Gemini excedida. Tente novamente mais tarde');
        } else if (error.message.includes('permission denied') || error.message.includes('PERMISSION_DENIED')) {
          throw new Error('Permissão negada para a API do Google Gemini. Verifique as configurações da chave');
        }
        
        // Se for erro 404 (modelo não encontrado), tenta o próximo
        if (error.message.includes('404') || error.message.includes('not found')) {
          continue;
        }
        
        // Para outros erros críticos, relança a exceção
        if (error.message.includes('INVALID_ARGUMENT') || error.message.includes('UNAUTHENTICATED')) {
          throw new Error(`Erro de configuração da API: ${error.message}`);
        }
      }
    }
    
    // Se chegou aqui, todos os modelos falharam
    const errorMessage = lastError ? 
      `Todos os modelos Gemini falharam. Último erro: ${lastError.message}` : 
      'Todos os modelos Gemini falharam';
    throw new Error(errorMessage);
  }

  async analyzeWoundImage(imagePath, patientContext = '') {
    console.log('=== GEMINI SERVICE DEBUG ===');
    console.log('Caminho da imagem:', imagePath);
    console.log('Contexto recebido:', patientContext);
    console.log('Tipo do contexto:', typeof patientContext);
    
    // Verificar se a imagem existe
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Arquivo de imagem não encontrado: ${imagePath}`);
    }
    
    // Ler a imagem
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    console.log('Imagem lida, tamanho do buffer:', imageBuffer.length);
    
    // Preparar o contexto do paciente
    const contextText = this.formatPatientContext(patientContext);
    console.log('Contexto formatado:', contextText);
    
    // Prompt para análise médica
    const prompt = createSimplifiedPrompt(patientContext);

    // Usar sistema de fallback para tentar diferentes modelos
    return await this.tryWithFallback(async () => {
      console.log(`Enviando para Gemini API com modelo: ${this.currentModel}...`);
      
      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: this.getMimeType(imagePath)
          }
        }
      ]);

      console.log('Resposta recebida do Gemini');
      const response = await result.response;
      const responseText = response.text();
      console.log('Tamanho da resposta:', responseText.length);
      console.log('📄 CONTEÚDO DA RESPOSTA (primeiros 500 chars):');
      console.log(responseText.substring(0, 500));
      console.log('📄 CONTEÚDO DA RESPOSTA (últimos 500 chars):');
      console.log(responseText.substring(Math.max(0, responseText.length - 500)));
      console.log('🔍 Verificando se é JSON válido...');
      
      try {
        JSON.parse(responseText);
        console.log('✅ Resposta é JSON válido');
      } catch (parseError) {
        console.log('❌ Resposta NÃO é JSON válido:', parseError.message);
        console.log('🔧 Tentando limpar resposta...');
        const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        try {
          JSON.parse(cleanText);
          console.log('✅ Resposta limpa é JSON válido');
        } catch (cleanParseError) {
          console.log('❌ Resposta limpa ainda NÃO é JSON válido:', cleanParseError.message);
        }
      }
      
      console.log('=== FIM GEMINI SERVICE DEBUG ===');
      return responseText;
    });
  }

  async analyzePrognosis(reportData, patientContext = '') {
    console.log('=== GEMINI SERVICE PROGNOSIS DEBUG ===');
    console.log('Tamanho do laudo:', reportData.length);
    
    const prompt = createPrognosisPrompt(reportData, patientContext);

    return await this.tryWithFallback(async () => {
      console.log(`Enviando prognóstico para Gemini API com modelo: ${this.currentModel}...`);
      
      const result = await this.model.generateContent([prompt]);

      console.log('Resposta de prognóstico recebida do Gemini');
      const response = await result.response;
      const responseText = response.text();
      console.log('Tamanho da resposta:', responseText.length);
      
      console.log('🔍 Verificando se é JSON válido...');
      try {
        JSON.parse(responseText);
        console.log('✅ Resposta é JSON válido');
      } catch (parseError) {
        console.log('❌ Resposta NÃO é JSON válido:', parseError.message);
        console.log('🔧 Tentando limpar resposta...');
        const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        try {
          JSON.parse(cleanText);
          console.log('✅ Resposta limpa é JSON válido');
          return cleanText;
        } catch (cleanParseError) {
          console.log('❌ Resposta limpa ainda NÃO é JSON válido:', cleanParseError.message);
        }
      }
      
      console.log('=== FIM GEMINI SERVICE PROGNOSIS DEBUG ===');
      return responseText;
    });
  }

  formatPatientContext(context) {
    try {
      console.log('🔍 Formatando contexto do paciente:', context);
      
      if (!context || context === '{}' || context === '') {
        console.log('⚠️ Contexto vazio ou não fornecido');
        return '\n**CONTEXTO DO PACIENTE:** Não fornecido - Análise baseada apenas na imagem\n\n';
      }
      
      const parsedContext = typeof context === 'string' ? JSON.parse(context) : context;
      console.log('📋 Contexto parseado:', parsedContext);
      
      // Verificar se o objeto está realmente vazio
      const hasAnyData = Object.keys(parsedContext).some(key => {
        const value = parsedContext[key];
        return value && value !== '' && (!Array.isArray(value) || value.length > 0);
      });
      
      if (!hasAnyData) {
        console.log('⚠️ Contexto sem dados válidos');
        return '\n**CONTEXTO DO PACIENTE:** Campos não preenchidos - Análise baseada apenas na imagem\n\n';
      }
      
      let formatted = '\n**CONTEXTO DO PACIENTE:**\n';
      
      if (parsedContext.nome) formatted += `- Nome: ${parsedContext.nome}\n`;
      if (parsedContext.idade) formatted += `- Idade: ${parsedContext.idade} anos\n`;
      if (parsedContext.sexo) formatted += `- Sexo: ${parsedContext.sexo}\n`;
      if (parsedContext.localAtendimento) formatted += `- Local: ${parsedContext.localAtendimento}\n`;
      
      if (parsedContext.queixaPrincipal && parsedContext.queixaPrincipal.length > 0) {
        formatted += `- Queixa Principal: ${parsedContext.queixaPrincipal.join(', ')}\n`;
      }
      
      if (parsedContext.historiaDoencaAtual && parsedContext.historiaDoencaAtual.length > 0) {
        formatted += `- História da Doença Atual: ${parsedContext.historiaDoencaAtual.join(', ')}\n`;
      }
      
      if (parsedContext.exameFisico && parsedContext.exameFisico.length > 0) {
        formatted += `- Exame Físico: ${parsedContext.exameFisico.join(', ')}\n`;
      }
      
      if (parsedContext.pressaoArterial) {
        formatted += `- Pressão Arterial: ${parsedContext.pressaoArterial}\n`;
      }
      
      if (parsedContext.avaliacaoPulso) {
        formatted += `- Pulso Dorsal do Pé: ${parsedContext.avaliacaoPulso}\n`;
      }
      
      if (parsedContext.conduta && parsedContext.conduta.length > 0) {
        formatted += `- Conduta Atual: ${parsedContext.conduta.join(', ')}\n`;
      }
      
      console.log('✅ Contexto formatado:', formatted);
      return formatted + '\n';
      
    } catch (error) {
      console.error('❌ Erro ao formatar contexto:', error);
      return '\n**CONTEXTO DO PACIENTE:** Erro ao processar dados - Análise baseada apenas na imagem\n\n';
    }
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
}

module.exports = new GeminiService();
