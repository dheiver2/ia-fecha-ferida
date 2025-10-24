// Serviço para integração com APIs de análises médicas
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_BASE_URL = (() => {
  try {
    const base = RAW_API_URL.replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  } catch (e) {
    return 'http://localhost:3001/api';
  }
})();

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  errors?: any[];
}

interface AnalysisData {
  id: number;
  protocol_number: string;
  image_filename: string;
  lesion_location: string;
  diagnosis_primary: string;
  diagnosis_confidence: number;
  severity: string;
  status: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patient_id?: number;
}

interface PaginatedAnalyses {
  analyses: AnalysisData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class AnalysisService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Operação falhou');
    }
    
    return data.data;
  }

  // Listar análises do usuário
  async getAnalyses(page: number = 1, limit: number = 50): Promise<PaginatedAnalyses> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analyses?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      return await this.handleResponse<PaginatedAnalyses>(response);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
      throw error;
    }
  }

  // Obter análise específica
  async getAnalysis(id: number): Promise<AnalysisData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analyses/${id}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      const data = await this.handleResponse<{ analysis: AnalysisData }>(response);
      return data.analysis;
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      throw error;
    }
  }

  // Deletar análise específica
  async deleteAnalysis(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analyses/${id}`,
        {
          method: 'DELETE',
          headers: this.getHeaders()
        }
      );

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error('Erro ao deletar análise:', error);
      throw error;
    }
  }

  // Deletar múltiplas análises
  async bulkDeleteAnalyses(analysisIds: number[]): Promise<{ deletedAnalyses: number; removedImages: number }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analyses/bulk`,
        {
          method: 'DELETE',
          headers: this.getHeaders(),
          body: JSON.stringify({ analysisIds })
        }
      );

      return await this.handleResponse<{ deletedAnalyses: number; removedImages: number }>(response);
    } catch (error) {
      console.error('Erro ao deletar análises em lote:', error);
      throw error;
    }
  }

  // Converter dados da API para formato do frontend
  convertToExamRecord(analysis: AnalysisData): any {
    return {
      id: analysis.id.toString(),
      fileName: analysis.image_filename,
      analysisDate: analysis.created_at,
      status: analysis.status as 'completed' | 'pending' | 'error' | 'reviewing' | 'archived' | 'draft',
      confidence: analysis.diagnosis_confidence,
      analysisResult: analysis.diagnosis_primary,
      protocol: analysis.protocol_number,
      patient: analysis.patient_name ? {
        name: analysis.patient_name,
        id: analysis.patient_id?.toString() || '',
        age: '',
        gender: ''
      } : undefined,
      examType: 'Análise de Ferida',
      priority: this.getSeverityPriority(analysis.severity)
    };
  }

  private getSeverityPriority(severity: string): 'low' | 'normal' | 'high' | 'urgent' | 'critical' {
    switch (severity?.toLowerCase()) {
      case 'leve':
      case 'low':
        return 'low';
      case 'moderada':
      case 'normal':
        return 'normal';
      case 'alta':
      case 'high':
        return 'high';
      case 'urgente':
        return 'urgent';
      case 'crítica':
      case 'critical':
        return 'critical';
      default:
        return 'normal';
    }
  }

  // Sincronizar dados do localStorage com o backend
  async syncWithLocalStorage(): Promise<void> {
    try {
      // Buscar dados do backend
      const backendData = await this.getAnalyses(1, 1000); // Buscar todas as análises
      
      // Converter para formato do frontend
      const examHistory = backendData.analyses.map(analysis => 
        this.convertToExamRecord(analysis)
      );

      // Atualizar localStorage
      localStorage.setItem('examHistory', JSON.stringify(examHistory));
      
      console.log('✅ Dados sincronizados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao sincronizar dados:', error);
      throw error;
    }
  }
}

// Instância singleton do serviço
const analysisService = new AnalysisService();

export default analysisService;
export type { AnalysisData, PaginatedAnalyses };