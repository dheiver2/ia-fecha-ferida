const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
// Usando template simplificado para evitar problemas de parsing JSON
const { createSimplifiedPrompt } = require('../templates/simplifiedMedicalReportTemplate.js');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzeWoundImage(imagePath, patientContext = '') {
    try {
      console.log('=== GEMINI SERVICE DEBUG ===');
      console.log('Caminho da imagem:', imagePath);
      console.log('Contexto recebido:', patientContext);
      console.log('Tipo do contexto:', typeof patientContext);
      
      // Ler a imagem
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString('base64');
      console.log('Imagem lida, tamanho do buffer:', imageBuffer.length);
      
      // Preparar o contexto do paciente
      const contextText = this.formatPatientContext(patientContext);
      console.log('Contexto formatado:', contextText);
      
      // Prompt para análise médica
      const prompt = createSimplifiedPrompt(patientContext);

      console.log('Enviando para Gemini API...');
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

    } catch (error) {
      console.error('Erro no serviço Gemini:', error);
      throw new Error(`Falha na análise da imagem: ${error.message}`);
    }
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
