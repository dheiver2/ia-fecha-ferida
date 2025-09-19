import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

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
        <div key="localhost" className="mb-3">
          <p className="font-medium text-sm mb-2">✅ Solução Recomendada:</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = localhostUrl}
            className="w-full justify-start"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Acessar via localhost
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Clique para acessar via localhost (mais seguro)
          </p>
        </div>
      );
      
      solutions.push(
        <div key="https" className="mb-3">
          <p className="font-medium text-sm mb-2">🔒 Alternativa:</p>
          <p className="text-xs text-muted-foreground">
            Configure HTTPS para acesso via rede (veja MEDIA_ACCESS_SOLUTION.md)
          </p>
        </div>
      );
    }
    
    if (hasGetUserMediaIssue) {
      solutions.push(
        <div key="browser" className="mb-3">
          <p className="font-medium text-sm mb-2">🌐 Atualize seu navegador:</p>
          <p className="text-xs text-muted-foreground">
            Use Chrome, Firefox ou Edge atualizados
          </p>
        </div>
      );
    }
    
    return solutions;
  };
  
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">
        {getMainMessage()}
      </AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="mt-2">
          <p className="text-sm mb-3">
            A videochamada não pode ser iniciada devido aos seguintes problemas:
          </p>
          
          <ul className="text-xs space-y-1 mb-4 pl-4">
            {issues.map((issue, index) => (
              <li key={index} className="list-disc">
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
              className="w-full"
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