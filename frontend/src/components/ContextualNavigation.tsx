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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              {subtitle}
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentNavigation.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="group block"
              >
                <div className={`
                  p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                  ${item.primary 
                    ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-800/50 dark:bg-emerald-900/10 hover:shadow-emerald-500/10' 
                    : 'border-slate-200 bg-white hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-800/50 hover:shadow-slate-200/50 dark:hover:shadow-black/20'
                  }
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        p-3 rounded-xl transition-colors duration-300
                        ${item.primary 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/20 dark:group-hover:text-emerald-400'
                        }
                      `}>
                        {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {item.label}
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                              {item.badge}
                            </Badge>
                          )}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 dark:text-slate-600 dark:group-hover:text-emerald-400 transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions para médicos */}
          {isMedicalContext && (
            <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    Ações Rápidas
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Acesso direto às funcionalidades mais usadas
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button size="lg" variant="outline" asChild className="flex-1 sm:flex-none border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
                    <Link to="/analise">
                      <Camera className="w-4 h-4 mr-2" />
                      Analisar
                    </Link>
                  </Button>
                  <Button size="lg" asChild className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
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
            <div className="mt-10 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                    Precisa de ajuda?
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
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