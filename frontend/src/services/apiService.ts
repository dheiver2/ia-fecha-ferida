export interface PatientContext {
  nome?: string;
  idade?: string;
  sexo?: string;
  [key: string]: any;
}

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

interface PrognosisResponse {
  success: boolean;
  data: string;
  timestamp: string;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async analyzeImage(file: File, patientContext: PatientContext): Promise<AnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('patientContext', JSON.stringify(patientContext));
      
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
        headers: this.getHeaders(),
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

  async analyzePrognosis(reportData: string, patientContext: PatientContext): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-prognosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders()
        },
        body: JSON.stringify({
          reportData,
          patientContext
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: PrognosisResponse = await response.json();

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Erro na análise de prognóstico:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

export const apiService = new ApiService();