import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, FileText, History, User } from 'lucide-react';

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, { name: string; icon: React.ReactNode }> = {
    '': { name: 'Início', icon: <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    'analise': { name: 'Análise', icon: <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    'historico': { name: 'Histórico', icon: <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    'perfil': { name: 'Perfil', icon: <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
  };

  return (
    <Breadcrumb className={`${className} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {breadcrumbNameMap[''].icon}
              {breadcrumbNameMap[''].name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbInfo = breadcrumbNameMap[pathname] || { name: pathname, icon: null };

          return (
            <React.Fragment key={pathname}>
              <BreadcrumbSeparator className="text-slate-400 dark:text-slate-600" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    {breadcrumbInfo.icon}
                    {breadcrumbInfo.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo} className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {breadcrumbInfo.icon}
                      {breadcrumbInfo.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;