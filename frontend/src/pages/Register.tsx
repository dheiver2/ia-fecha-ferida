import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user' as 'user' | 'doctor' | 'nurse',
    phone: '',
    institution: '',
    specialty: '',
    crm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número';
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validar telefone (opcional, mas se preenchido deve ser válido)
    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (11) 99999-9999';
    }

    // Validações específicas para médicos
    if (formData.role === 'doctor') {
      if (!formData.crm.trim()) {
        newErrors.crm = 'CRM é obrigatório para médicos';
      } else if (!/^\d{4,6}\/[A-Z]{2}$/.test(formData.crm)) {
        newErrors.crm = 'CRM deve estar no formato 123456/SP';
      }

      if (!formData.specialty.trim()) {
        newErrors.specialty = 'Especialidade é obrigatória para médicos';
      }
    }

    // Validações específicas para enfermeiros
    if (formData.role === 'nurse') {
      if (!formData.specialty.trim()) {
        newErrors.specialty = 'Área de atuação é obrigatória para enfermeiros';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name.trim(),
        role: formData.role,
        phone: formData.phone || undefined,
        institution: formData.institution.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        crm: formData.crm.trim() || undefined,
      };

      const result = await register(userData);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatação especial para telefone
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'crm') {
      const formatted = formatCRM(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCRM = (value: string): string => {
    const clean = value.replace(/[^\d\/A-Z]/g, '').toUpperCase();
    if (clean.includes('/')) {
      const [numbers, state] = clean.split('/');
      return `${numbers}/${state.slice(0, 2)}`;
    }
    return clean;
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'doctor': return 'Médico';
      case 'nurse': return 'Enfermeiro';
      default: return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950 -z-20"></div>
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 -z-10"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50 relative z-10">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground dark:text-white tracking-tight">
            Criar nova conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground dark:text-gray-400">
            Junte-se à Vascular One
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className={`rounded-xl p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30'
            } animate-in fade-in slide-in-from-top-2`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nome completo *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.email}</p>
              )}
            </div>

            {/* Tipo de usuário */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tipo de usuário *
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm appearance-none"
                >
                  <option value="user">Usuário</option>
                  <option value="doctor">Médico</option>
                  <option value="nurse">Enfermeiro</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Campos específicos para médicos */}
            {formData.role === 'doctor' && (
              <>
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label htmlFor="crm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    CRM *
                  </label>
                  <input
                    id="crm"
                    name="crm"
                    type="text"
                    value={formData.crm}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm"
                    placeholder="123456/UF"
                  />
                  {errors.crm && (
                    <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.crm}</p>
                  )}
                </div>

                <div className="animate-in fade-in slide-in-from-top-2">
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Especialidade *
                  </label>
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border ${
                      errors.specialty ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                    } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                    placeholder="Ex: Dermatologia, Cirurgia Plástica"
                  />
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.specialty}</p>
                  )}
                </div>
              </>
            )}

            {/* Campos específicos para enfermeiros */}
            {formData.role === 'nurse' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Área de atuação *
                </label>
                <input
                  id="specialty"
                  name="specialty"
                  type="text"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 border ${
                    errors.specialty ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="Ex: UTI, Emergência, Dermatologia"
                />
                {errors.specialty && (
                  <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.specialty}</p>
                )}
              </div>
            )}

            {/* Telefone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Telefone
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.phone ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.phone}</p>
              )}
            </div>

            {/* Instituição */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Instituição
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  value={formData.institution}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm"
                  placeholder="Hospital, clínica ou universidade"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Senha *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirmar senha *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm`}
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5'
              } transition-all duration-200`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-bold text-primary hover:text-primary-dark transition-colors"
              >
                Faça login aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;