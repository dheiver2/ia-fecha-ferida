interface AnalysisResult {
  success: boolean;
  data?: string;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  analysis: string;
  imageUrl: string;
  timestamp: string;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  async analyzeImage(file: File, patientContext: any): Promise<AnalysisResult> {
    try {
      console.log('=== DEBUG FRONTEND ===');
      console.log('Arquivo a ser enviado:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      console.log('Contexto do paciente recebido:', patientContext);
      console.log('Contexto serializado:', JSON.stringify(patientContext));
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('patientContext', JSON.stringify(patientContext));
      
      console.log('FormData criado, enviando para:', `${this.baseUrl}/api/analyze`);
      console.log('=== FIM DEBUG FRONTEND ===');

      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      return {
        success: true,
        data: data.analysis
      };

    } catch (error) {
      console.error('Erro na análise:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar saúde da API:', error);
      return false;
    }
  }

  // Método de fallback para análise de prognóstico (mantém compatibilidade)
  async analyzePrognosis(reportData: string, patientContext: any): Promise<AnalysisResult> {
    // Por enquanto, retorna um resultado vazio para manter compatibilidade
    // Pode ser implementado como um endpoint separado no futuro
    return {
      success: false,
      error: 'Análise de prognóstico não implementada no backend ainda'
    };
  }
}

export const apiService = new ApiService();