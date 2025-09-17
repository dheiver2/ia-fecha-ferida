import React from 'react';
import { CheckCircle, Clock, Brain, FileText, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'in_progress' | 'completed';
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps?: ProgressStep[];
}

const defaultSteps: ProgressStep[] = [
  {
    id: 'upload',
    title: 'Upload da Imagem',
    description: 'Processando arquivo enviado',
    icon: <FileText className="h-5 w-5" />,
    status: 'pending'
  },
  {
    id: 'preprocessing',
    title: 'Pré-processamento',
    description: 'Otimizando qualidade da imagem',
    icon: <Clock className="h-5 w-5" />,
    status: 'pending'
  },
  {
    id: 'analysis',
    title: 'Análise com IA',
    description: 'Processamento com inteligência artificial',
    icon: <Brain className="h-5 w-5" />,
    status: 'pending'
  },
  {
    id: 'report',
    title: 'Geração do Laudo',
    description: 'Estruturando resultado final',
    icon: <FileText className="h-5 w-5" />,
    status: 'pending'
  }
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  steps = defaultSteps 
}) => {
  const getStepStatus = (index: number): 'pending' | 'in_progress' | 'completed' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'in_progress';
    return 'pending';
  };

  const getProgressPercentage = () => {
    return Math.min(((currentStep + 1) / steps.length) * 100, 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Barra de progresso geral */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Progresso da Análise
          </h3>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Steps detalhados */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div 
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                status === 'completed' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : status === 'in_progress'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Ícone do status */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                status === 'completed'
                  ? 'bg-green-500 text-white'
                  : status === 'in_progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : status === 'in_progress' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Conteúdo do step */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold ${
                    status === 'completed'
                      ? 'text-green-800 dark:text-green-200'
                      : status === 'in_progress'
                      ? 'text-blue-800 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  
                  {/* Status badge */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    status === 'completed'
                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                      : status === 'in_progress'
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {status === 'completed' ? 'Concluído' : status === 'in_progress' ? 'Em andamento' : 'Pendente'}
                  </span>
                </div>
                
                <p className={`text-sm mt-1 ${
                  status === 'completed'
                    ? 'text-green-600 dark:text-green-300'
                    : status === 'in_progress'
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-muted-foreground'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tempo estimado */}
      {currentStep < steps.length && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Tempo estimado restante: {(steps.length - currentStep) * 15-30} segundos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;