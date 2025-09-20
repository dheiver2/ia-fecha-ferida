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
    '': { name: 'Início', icon: <Home className="h-4 w-4" /> },
    'analise': { name: 'Análise', icon: <FileText className="h-4 w-4" /> },
    'historico': { name: 'Histórico', icon: <History className="h-4 w-4" /> },
    'perfil': { name: 'Perfil', icon: <User className="h-4 w-4" /> },
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-2">
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {breadcrumbInfo.icon}
                    {breadcrumbInfo.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo} className="flex items-center gap-2">
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