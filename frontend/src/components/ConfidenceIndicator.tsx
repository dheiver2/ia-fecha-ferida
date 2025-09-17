import React from 'react';
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  category?: 'analysis' | 'diagnosis' | 'recommendation';
  showDetails?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  category = 'analysis',
  showDetails = true,
  className = ''
}) => {
  const getConfidenceLevel = () => {
    if (confidence >= 85) return 'high';
    if (confidence >= 70) return 'medium';
    if (confidence >= 50) return 'low';
    return 'very-low';
  };

  const getConfidenceColor = () => {
    const level = getConfidenceLevel();
    switch (level) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-orange-600 dark:text-orange-400';
      case 'very-low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getConfidenceBackground = () => {
    const level = getConfidenceLevel();
    switch (level) {
      case 'high': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'very-low': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getConfidenceIcon = () => {
    const level = getConfidenceLevel();
    switch (level) {
      case 'high': return <CheckCircle className="h-5 w-5" />;
      case 'medium': return <TrendingUp className="h-5 w-5" />;
      case 'low': return <Info className="h-5 w-5" />;
      case 'very-low': return <AlertTriangle className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getConfidenceText = () => {
    const level = getConfidenceLevel();
    switch (level) {
      case 'high': return 'Alta Confiança';
      case 'medium': return 'Confiança Moderada';
      case 'low': return 'Baixa Confiança';
      case 'very-low': return 'Confiança Muito Baixa';
      default: return 'Confiança Indefinida';
    }
  };

  const getRecommendation = () => {
    const level = getConfidenceLevel();
    switch (level) {
      case 'high': 
        return 'Resultado com alta precisão. Recomenda-se correlação clínica para confirmação.';
      case 'medium': 
        return 'Resultado moderadamente confiável. Avaliação por médico laudador recomendada.';
      case 'low': 
        return 'Resultado com limitações. Necessária validação por médico laudador e exames complementares.';
      case 'very-low': 
        return 'Resultado incerto. Requer reavaliação completa e métodos diagnósticos adicionais.';
      default: 
        return 'Nível de confiança não determinado.';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'analysis': return 'Análise de Imagem';
      case 'diagnosis': return 'Sugestão Diagnóstica';
      case 'recommendation': return 'Recomendações';
      default: return 'Análise';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getConfidenceBackground()} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Nível de Confiança da IA
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {getCategoryLabel()}
        </span>
      </div>

      {/* Barra de confiança */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center space-x-2 ${getConfidenceColor()}`}>
            {getConfidenceIcon()}
            <span className="text-sm font-medium">
              {getConfidenceText()}
            </span>
          </div>
          <span className={`text-lg font-bold ${getConfidenceColor()}`}>
            {confidence}%
          </span>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              getConfidenceLevel() === 'high' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              getConfidenceLevel() === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              getConfidenceLevel() === 'low' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Detalhes e recomendações */}
      {showDetails && (
        <div className="space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>{getRecommendation()}</p>
          </div>

          {/* Fatores que influenciam a confiança */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              FATORES QUE INFLUENCIAM A CONFIANÇA:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Qualidade e resolução da imagem</li>
              <li>• Clareza das estruturas anatômicas</li>
              <li>• Presença de artefatos ou ruídos</li>
              <li>• Complexidade do caso clínico</li>
              <li>• Disponibilidade de dados clínicos</li>
            </ul>
          </div>

          {/* Aviso importante */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Importante:</strong> Este indicador reflete a confiança do algoritmo de IA. 
                Independente do nível, sempre correlacione com avaliação médica especializada.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceIndicator;