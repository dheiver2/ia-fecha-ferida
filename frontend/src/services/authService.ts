import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Configurar axios com interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Salvar token e dados do usuário
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
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

  // Verificar token no servidor
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await api.post<ApiResponse<{ user: User; valid: boolean }>>('/api/auth/verify', { token });
      
      if (response.data.success && response.data.data?.valid) {
        // Atualizar dados do usuário se necessário
        if (response.data.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }

  // Obter dados atualizados do usuário
  async getMe(): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/me');
      
      if (response.data.success && response.data.data?.user) {
        const user = response.data.data.user;
        localStorage.setItem('user_data', JSON.stringify(user));
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  // Alterar senha
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.put<ApiResponse>('/api/auth/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro interno do servidor',
        errors: error.response?.data?.errors
      };
    }
  }

  // Listar sessões ativas
  async getSessions(): Promise<ApiResponse> {
    try {
      const response = await api.get<ApiResponse>('/api/auth/sessions');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter sessões:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro interno do servidor'
      };
    }
  }

  // Verificar se usuário tem permissão específica
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Verificar se usuário é admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificar se usuário é médico
  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  // Verificar se usuário é enfermeiro
  isNurse(): boolean {
    return this.hasRole('nurse');
  }
}

export default AuthService.getInstance();