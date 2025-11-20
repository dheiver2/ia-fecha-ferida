import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 p-4 rounded-full shadow-lg border border-slate-100 dark:border-slate-800">
              <Loader2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar role se especificado
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acesso Negado</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-left mb-6 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 dark:text-slate-400">Permissão necessária:</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{requiredRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Sua permissão:</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{user?.role}</span>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;