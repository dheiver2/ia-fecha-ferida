import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';

interface WebRTCAlertProps {
  issues: string[];
  onRetry?: () => void;
}

export const WebRTCAlert: React.FC<WebRTCAlertProps> = ({ issues, onRetry }) => {
  const hasContextIssue = issues.some(issue => issue.includes('Contexto não seguro'));
  const hasGetUserMediaIssue = issues.some(issue => issue.includes('getUserMedia'));
  
  const getMainMessage = () => {
    if (hasContextIssue) {
      return "Acesso à câmera bloqueado por segurança";
    }
    if (hasGetUserMediaIssue) {
      return "WebRTC não suportado neste navegador";
    }
    return "Problemas de compatibilidade detectados";
  };
  
  const getSolutions = () => {
    const solutions = [];
    
    if (hasContextIssue) {
      const currentUrl = window.location.href;
      const localhostUrl = currentUrl.replace(window.location.hostname, 'localhost');
      
      solutions.push(
        <div key="localhost" className="mb-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <p className="font-medium text-sm mb-2 text-amber-900 dark:text-amber-200">✅ Solução Recomendada:</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = localhostUrl}
            className="w-full justify-start bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Acessar via localhost
          </Button>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
            Clique para acessar via localhost (mais seguro)
          </p>
        </div>
      );
      
      solutions.push(
        <div key="https" className="mb-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <p className="font-medium text-sm mb-2 text-amber-900 dark:text-amber-200">🔒 Alternativa:</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Configure HTTPS para acesso via rede (veja MEDIA_ACCESS_SOLUTION.md)
          </p>
        </div>
      );
    }
    
    if (hasGetUserMediaIssue) {
      solutions.push(
        <div key="browser" className="mb-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <p className="font-medium text-sm mb-2 text-amber-900 dark:text-amber-200">🌐 Atualize seu navegador:</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Use Chrome, Firefox ou Edge atualizados
          </p>
        </div>
      );
    }
    
    return solutions;
  };
  
  return (
    <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 backdrop-blur-sm shadow-lg">
      <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold text-lg ml-2">
        {getMainMessage()}
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 ml-2 mt-2">
        <div>
          <p className="text-sm mb-4 font-medium">
            A videochamada não pode ser iniciada devido aos seguintes problemas:
          </p>
          
          <ul className="text-xs space-y-2 mb-6 pl-4">
            {issues.map((issue, index) => (
              <li key={index} className="list-disc marker:text-amber-500">
                {issue}
              </li>
            ))}
          </ul>
          
          {getSolutions()}
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="w-full mt-2 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};