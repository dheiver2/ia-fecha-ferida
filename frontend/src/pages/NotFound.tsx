import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center p-4">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Página não encontrada</h2>
          <p className="text-slate-500 dark:text-slate-400">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;