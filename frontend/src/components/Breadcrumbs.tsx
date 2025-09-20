import { ReactNode } from "react";
import { ChevronRight, Home, Camera, History, Video, Users, LogIn, UserPlus, Phone, Stethoscope, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  description?: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Base home sempre presente (exceto na própria home)
    const homeBase: BreadcrumbItem = isAuthenticated 
      ? { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" />, description: 'Área médica' }
      : { label: 'Início', href: '/', icon: <Home className="h-4 w-4" />, description: 'Página inicial' };

    // Mapeamento dinâmico baseado no contexto
    const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
      '/': [
        { label: 'Casa Fecha Feridas', icon: <Home className="h-4 w-4" /> }
      ],
      '/dashboard': [
        homeBase,
        { label: 'Dashboard', icon: <Stethoscope className="h-4 w-4" />, description: 'Visão geral médica' }
      ],
      '/analise': [
        homeBase,
        { label: 'Análise IA', icon: <Camera className="h-4 w-4" />, description: 'Análise de feridas com inteligência artificial' }
      ],
      '/historico': [
        homeBase,
        { label: 'Histórico', icon: <History className="h-4 w-4" />, description: 'Histórico de análises e pacientes' }
      ],
      '/teleconsulta': [
        homeBase,
        { label: 'Teleconsulta', icon: <Video className="h-4 w-4" />, description: 'Videochamadas médicas' }
      ],
      '/alertas': [
        homeBase,
        { label: 'Alertas Médicos', icon: <AlertTriangle className="h-4 w-4" />, description: 'Sistema de alertas e monitoramento' }
      ],
      '/paciente': [
        { label: 'Início', href: '/', icon: <Home className="h-4 w-4" /> },
        { label: 'Área do Paciente', icon: <Users className="h-4 w-4" />, description: 'Acesso para pacientes' }
      ],
      '/login': [
        { label: 'Início', href: '/', icon: <Home className="h-4 w-4" /> },
        { label: 'Login Médico', icon: <LogIn className="h-4 w-4" />, description: 'Acesso profissional' }
      ],
      '/register': [
        { label: 'Início', href: '/', icon: <Home className="h-4 w-4" /> },
        { label: 'Cadastro Médico', icon: <UserPlus className="h-4 w-4" />, description: 'Registro profissional' }
      ]
    };

    // Tratamento especial para rotas dinâmicas
    if (pathSegments[0] === 'paciente' && pathSegments[1]) {
      return [
        { label: 'Início', href: '/', icon: <Home className="h-4 w-4" /> },
        { label: 'Área do Paciente', href: '/paciente', icon: <Users className="h-4 w-4" /> },
        { label: `Código: ${pathSegments[1]}`, icon: <Phone className="h-4 w-4" />, description: 'Consulta específica' }
      ];
    }

    if (pathSegments[0] === 'consulta' && pathSegments[1]) {
      return [
        { label: 'Início', href: '/', icon: <Home className="h-4 w-4" /> },
        { label: 'Teleconsulta', icon: <Video className="h-4 w-4" /> },
        { label: `Sala: ${pathSegments[1]}`, icon: <Phone className="h-4 w-4" />, description: 'Videochamada ativa' }
      ];
    }

    // Fallback para rotas não mapeadas
    return breadcrumbMap[path] || [
      homeBase,
      { label: 'Página', description: 'Localização atual' }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  // Não mostrar breadcrumbs na página inicial
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-all duration-200 group"
              title={item.description}
            >
              <span className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                {item.icon}
              </span>
              <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary font-medium">
                {item.label}
              </span>
            </Link>
          ) : (
            <span 
              className="flex items-center gap-2 px-2 py-1 text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-700 rounded-md"
              title={item.description}
            >
              <span className="text-primary">
                {item.icon}
              </span>
              {item.label}
            </span>
          )}
        </div>
      ))}
      
      {/* Indicador de contexto */}
      <div className="ml-auto flex items-center gap-2">
        {isAuthenticated && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            Área Médica
          </span>
        )}
        {location.pathname.includes('/paciente') && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            Área do Paciente
          </span>
        )}
      </div>
    </nav>
  );
};

export default Breadcrumbs;