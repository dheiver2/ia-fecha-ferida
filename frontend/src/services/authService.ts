import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// DEBUG: Log da configuração de ambiente e baseURL
console.log('[AuthService] Ambiente', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  isProd: import.meta.env.PROD,
  locationOrigin: typeof window !== 'undefined' ? window.location.origin : 'server'
});

// Configurar axios com interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// DEBUG: Confirmação da instância axios
console.log('[AuthService] Axios instance criada com baseURL=', api.defaults.baseURL);

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // DEBUG: Log da request
    console.log('[AuthService] Request', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL || ''}${config.url || ''}`,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('[AuthService] Request error', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => {
    // DEBUG: Log da response
    console.log('[AuthService] Response OK', {
      status: response.status,
      url: response.config?.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // DEBUG: Log detalhado do erro
    console.error('[AuthService] Response error', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'doctor' | 'nurse' | 'admin';
  specialty?: string;
  crm?: string;
  institution?: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'doctor' | 'nurse';
  specialty?: string;
  crm?: string;
  institution?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    expires_at: string;
  };
  errors?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  code?: string;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login do usuário
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // DEBUG: Log da chamada de login
      console.log('[AuthService] login() - enviando requisição', {
        endpoint: '/api/auth/login',
        baseURL: API_BASE_URL,
        origin: typeof window !== 'undefined' ? window.location.origin : 'server',
        payload: credentials
      });

      const response = await api.post<AuthResponse>('/api/auth/login', credentials);

      // DEBUG: Log da resposta de login
      console.log('[AuthService] login() - resposta', {
        status: response.status,
        data: response.data
      });
      
      if (response.data.success && response.data.data) {
        // Salvar token e dados do usuário
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      // DEBUG: Log de erro no login
      console.error('[AuthService] login() - erro', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
      return {
        success: false,
        message: error.response?.data?.message || 'Erro interno do servidor',
        errors: error.response?.data?.errors
      };
    }
  }

  // Registro de novo usuário
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro interno do servidor',
        errors: error.response?.data?.errors
      };
    }
  }

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais independentemente do resultado da API
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Verificar se usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }

  // Obter dados do usuário atual
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  // Obter token atual
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Verificar validade do token (consulta ao backend)
  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get<ApiResponse>('/api/auth/verify');
      return response.data.success;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  // Obter informações do usuário atual (me)
  async getMe(): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<User>>('/api/auth/me');
      return response.data.data || null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  // Alterar senha do usuário
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return { success: false, message: 'Erro ao alterar senha' };
    }
  }

  // Obter sessões ativas (admin)
  async getSessions(): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/api/auth/sessions');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter sessões:', error);
      return { success: false, message: 'Erro ao obter sessões' };
    }
  }

  // Verificar roles
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificar se é médico
  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  // Verificar se é enfermeiro
  isNurse(): boolean {
    return this.hasRole('nurse');
  }
}

export default AuthService.getInstance();