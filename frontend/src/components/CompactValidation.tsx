import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Shield, Clock } from 'lucide-react';

interface ValidationResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  score: number;
}

interface CompactValidationProps {
  reportContent: string;
  metadata?: {
    examType?: string;
    urgency?: string;
    confidence?: number;
  };
}

export const CompactValidation: React.FC<CompactValidationProps> = ({ 
  reportContent, 
  metadata 
}) => {
  const validateReport = (): ValidationResult[] => {
    const results: ValidationResult[] = [];
    const lowerContent = reportContent.toLowerCase();
    
    // Validação de completude expandida
    const essentialSections = [
      'identificação do exame',
      'dados do paciente',
      'história clínica relevante',
      'análise morfológica detalhada',
      'impressão diagnóstica',
      'recomendações clínicas detalhadas'
    ];
    
    const presentSections = essentialSections.filter(section => 
      lowerContent.includes(section.toLowerCase())
    );
    
    const completenessScore = Math.round((presentSections.length / essentialSections.length) * 100);
    
    results.push({
      category: 'Completude',
      status: completenessScore >= 90 ? 'success' : completenessScore >= 70 ? 'warning' : 'error',
      message: `${presentSections.length}/${essentialSections.length} seções essenciais presentes`,
      score: completenessScore
    });

    // Validação de detalhamento técnico
    const technicalTerms = [
      'dimensões',
      'leito',
      'bordas',
      'exsudato',
      'perilesional',
      'classificação',
      'estágio',
      'curativo',
      'limpeza',
      'seguimento'
    ];
    
    const presentTerms = technicalTerms.filter(term => lowerContent.includes(term));
    const technicalScore = Math.round((presentTerms.length / technicalTerms.length) * 100);
    
    results.push({
      category: 'Detalhamento',
      status: technicalScore >= 80 ? 'success' : technicalScore >= 60 ? 'warning' : 'error',
      message: `${presentTerms.length}/${technicalTerms.length} aspectos técnicos abordados`,
      score: technicalScore
    });

    // Validação de qualidade expandida
    const wordCount = reportContent.split(' ').length;
    const qualityScore = Math.min(100, Math.max(30, (wordCount / 500) * 100));
    
    results.push({
      category: 'Extensão',
      status: qualityScore >= 80 ? 'success' : qualityScore >= 50 ? 'warning' : 'error',
      message: `${wordCount} palavras - ${qualityScore >= 80 ? 'Detalhado' : qualityScore >= 50 ? 'Adequado' : 'Insuficiente'}`,
      score: qualityScore
    });

    // Validação de segurança clínica
    const safetyElements = [
      'limitações',
      'correlação clínica',
      'avaliação presencial',
      'médico responsável',
      'sinais de alerta',
      'reavaliação'
    ];
    
    const presentSafetyElements = safetyElements.filter(element => lowerContent.includes(element));
    const safetyScore = Math.round((presentSafetyElements.length / safetyElements.length) * 100);
    
    results.push({
      category: 'Segurança',
      status: safetyScore >= 80 ? 'success' : safetyScore >= 60 ? 'warning' : 'error',
      message: `${presentSafetyElements.length}/${safetyElements.length} aspectos de segurança incluídos`,
      score: safetyScore
    });

    // Validação de estrutura diagnóstica
    const diagnosticElements = [
      'diagnósticos diferenciais',
      'fatores prognósticos',
      'complicações potenciais',
      'classificação principal'
    ];
    
    const presentDiagnosticElements = diagnosticElements.filter(element => lowerContent.includes(element));
    const diagnosticScore = Math.round((presentDiagnosticElements.length / diagnosticElements.length) * 100);
    
    results.push({
      category: 'Diagnóstico',
      status: diagnosticScore >= 75 ? 'success' : diagnosticScore >= 50 ? 'warning' : 'error',
      message: `${presentDiagnosticElements.length}/${diagnosticElements.length} elementos diagnósticos presentes`,
      score: diagnosticScore
    });

    return results;
  };

  const results = validateReport();
  const overallScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Validação</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            {getStatusIcon(result.status)}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-gray-700">{result.category}</div>
              <div className="text-xs text-gray-500 truncate">{result.message}</div>
            </div>
          </div>
        ))}
      </div>

      {metadata && (
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
          {metadata.confidence && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Confiança: {metadata.confidence}%
            </div>
          )}
          {metadata.urgency && (
            <div>Urgência: {metadata.urgency}</div>
          )}
        </div>
      )}
    </div>
  );
};