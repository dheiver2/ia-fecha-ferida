import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Camera, 
  History, 
  Video, 
  Users, 
  Settings, 
  HelpCircle,
  ArrowRight,
  Stethoscope,
  FileText,
  Phone
} from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  description?: string;
  badge?: string;
  primary?: boolean;
}

const ContextualNavigation: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Detectar contexto atual
  const isPatientContext = location.pathname.includes('/paciente') || location.pathname.includes('/consulta/');
  const isMedicalContext = isAuthenticated && user;
  const isLandingContext = location.pathname === '/';

  // Navegação para médicos autenticados
  const medicalNavigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-4 h-4" />,
      description: 'Visão geral das suas atividades',
      primary: true
    },
    {
      label: 'Nova Análise',
      href: '/analise',
      icon: <Camera className="w-4 h-4" />,
      description: 'Analisar feridas com IA',
      badge: 'IA'
    },
    {
      label: 'Teleconsulta',
      href: '/teleconsulta',
      icon: <Video className="w-4 h-4" />,
      description: 'Iniciar videochamada'
    },
    {
      label: 'Histórico',
      href: '/historico',
      icon: <History className="w-4 h-4" />,
      description: 'Ver análises anteriores'
    }
  ];

  // Navegação para pacientes
  const patientNavigation: NavigationItem[] = [
    {
      label: 'Entrar na Consulta',
      href: '/paciente',
      icon: <Video className="w-4 h-4" />,
      description: 'Digite o código da consulta',
      primary: true
    },
    {
      label: 'Ajuda',
      href: '#ajuda',
      icon: <HelpCircle className="w-4 h-4" />,
      description: 'Como usar a plataforma'
    }
  ];

  // Navegação para visitantes (página inicial)
  const visitorNavigation: NavigationItem[] = [
    {
      label: 'Para Médicos',
      href: '/login',
      icon: <Stethoscope className="w-4 h-4" />,
      description: 'Acesso profissional completo',
      primary: true
    },
    {
      label: 'Para Pacientes',
      href: '/paciente',
      icon: <Users className="w-4 h-4" />,
      description: 'Entrar em consulta'
    },
    {
      label: 'Demonstração',
      href: '#demo',
      icon: <FileText className="w-4 h-4" />,
      description: 'Ver como funciona'
    }
  ];

  // Selecionar navegação apropriada
  let currentNavigation: NavigationItem[] = [];
  let title = '';
  let subtitle = '';

  if (isMedicalContext) {
    currentNavigation = medicalNavigation;
    title = `Olá, Dr(a). ${user?.name || 'Médico'}`;
    subtitle = 'O que você gostaria de fazer hoje?';
  } else if (isPatientContext) {
    currentNavigation = patientNavigation;
    title = 'Área do Paciente';
    subtitle = 'Acesse sua consulta médica';
  } else if (isLandingContext) {
    currentNavigation = visitorNavigation;
    title = 'Casa Fecha Feridas';
    subtitle = 'Escolha como você quer usar nossa plataforma';
  }

  // Não mostrar se não há navegação contextual
  if (currentNavigation.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {subtitle}
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentNavigation.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="group block"
              >
                <div className={`
                  p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg
                  ${item.primary 
                    ? 'border-blue-200 bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:bg-blue-900/20' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50'
                  }
                  group-hover:scale-105
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-2 rounded-lg
                        ${item.primary 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }
                      `}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions para médicos */}
          {isMedicalContext && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Ações Rápidas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Acesso direto às funcionalidades mais usadas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/analise">
                      <Camera className="w-4 h-4 mr-2" />
                      Analisar
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/teleconsulta">
                      <Phone className="w-4 h-4 mr-2" />
                      Consulta
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Ajuda contextual para pacientes */}
          {isPatientContext && (
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Precisa de ajuda?
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Se você não tem um código de consulta, entre em contato com seu médico. 
                    Ele enviará um link ou código para você acessar a videochamada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextualNavigation;