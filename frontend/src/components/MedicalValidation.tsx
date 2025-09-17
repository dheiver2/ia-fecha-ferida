import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  FileCheck, 
  Clock,
  User,
  Stethoscope,
  Eye,
  Target,
  AlertCircle,
  Info
} from 'lucide-react';

// Interfaces para validação
interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'mandatory' | 'recommended' | 'quality' | 'safety';
  severity: 'error' | 'warning' | 'info';
  validator: (content: string, metadata?: any) => ValidationResult;
}

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string;
  confidence?: number;
}

interface MedicalValidationProps {
  reportContent: string;
  metadata?: {
    patientAge?: number;
    patientSex?: string;
    examType?: string;
    urgency?: string;
  };
  onValidationComplete?: (results: ValidationResult[]) => void;
}

export const MedicalValidation: React.FC<MedicalValidationProps> = ({
  reportContent,
  metadata = {},
  onValidationComplete
}) => {
  const [validationResults, setValidationResults] = useState<(ValidationResult & { rule: ValidationRule })[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  // Regras de validação médica
  const validationRules: ValidationRule[] = [
    // Campos Obrigatórios
    {
      id: 'patient_identification',
      name: 'Identificação do Paciente',
      description: 'Deve conter informações básicas de identificação',
      category: 'mandatory',
      severity: 'error',
      validator: (content) => {
        const hasPatientInfo = /dados do paciente|identificação|patient/i.test(content);
        return {
          passed: hasPatientInfo,
          message: hasPatientInfo ? 'Identificação do paciente presente' : 'Identificação do paciente ausente',
          details: hasPatientInfo ? undefined : 'É obrigatório incluir seção de identificação do paciente'
        };
      }
    },
    {
      id: 'clinical_history',
      name: 'História Clínica',
      description: 'Deve incluir história clínica relevante',
      category: 'mandatory',
      severity: 'error',
      validator: (content) => {
        const hasHistory = /história clínica|clinical history|anamnese/i.test(content);
        return {
          passed: hasHistory,
          message: hasHistory ? 'História clínica documentada' : 'História clínica ausente',
          details: hasHistory ? undefined : 'É obrigatório documentar a história clínica relevante'
        };
      }
    },
    {
      id: 'diagnostic_impression',
      name: 'Impressão Diagnóstica',
      description: 'Deve conter impressão diagnóstica clara',
      category: 'mandatory',
      severity: 'error',
      validator: (content) => {
        const hasDiagnosis = /impressão diagnóstica|diagnóstico|diagnostic impression/i.test(content);
        return {
          passed: hasDiagnosis,
          message: hasDiagnosis ? 'Impressão diagnóstica presente' : 'Impressão diagnóstica ausente',
          details: hasDiagnosis ? undefined : 'É obrigatório incluir impressão diagnóstica'
        };
      }
    },
    {
      id: 'clinical_recommendations',
      name: 'Recomendações Clínicas',
      description: 'Deve incluir recomendações de conduta',
      category: 'mandatory',
      severity: 'error',
      validator: (content) => {
        const hasRecommendations = /recomendações|conduta|recommendations|tratamento/i.test(content);
        return {
          passed: hasRecommendations,
          message: hasRecommendations ? 'Recomendações clínicas presentes' : 'Recomendações clínicas ausentes',
          details: hasRecommendations ? undefined : 'É obrigatório incluir recomendações clínicas'
        };
      }
    },

    // Qualidade do Conteúdo
    {
      id: 'content_length',
      name: 'Extensão do Conteúdo',
      description: 'Laudo deve ter extensão adequada',
      category: 'quality',
      severity: 'warning',
      validator: (content) => {
        const wordCount = content.split(/\s+/).length;
        const passed = wordCount >= 100 && wordCount <= 2000;
        return {
          passed,
          message: passed ? `Extensão adequada (${wordCount} palavras)` : `Extensão inadequada (${wordCount} palavras)`,
          details: wordCount < 100 ? 'Laudo muito curto, pode estar incompleto' : 
                   wordCount > 2000 ? 'Laudo muito longo, considere ser mais conciso' : undefined
        };
      }
    },
    {
      id: 'medical_terminology',
      name: 'Terminologia Médica',
      description: 'Uso adequado de terminologia médica',
      category: 'quality',
      severity: 'warning',
      validator: (content) => {
        const medicalTerms = [
          'morfologia', 'anatomia', 'fisiologia', 'patologia', 'lesão', 'tecido',
          'epiderme', 'derme', 'cicatrização', 'inflamação', 'edema', 'eritema'
        ];
        const foundTerms = medicalTerms.filter(term => 
          new RegExp(term, 'i').test(content)
        ).length;
        const passed = foundTerms >= 3;
        return {
          passed,
          message: passed ? `Terminologia médica adequada (${foundTerms} termos)` : `Terminologia médica limitada (${foundTerms} termos)`,
          confidence: Math.min(100, (foundTerms / medicalTerms.length) * 100)
        };
      }
    },
    {
      id: 'objective_language',
      name: 'Linguagem Objetiva',
      description: 'Uso de linguagem objetiva e científica',
      category: 'quality',
      severity: 'info',
      validator: (content) => {
        const objectiveIndicators = [
          'observa-se', 'evidencia-se', 'identifica-se', 'constata-se', 
          'verifica-se', 'nota-se', 'apresenta', 'demonstra'
        ];
        const subjectiveIndicators = [
          'acredito', 'penso', 'talvez', 'possivelmente', 'provavelmente'
        ];
        
        const objectiveCount = objectiveIndicators.filter(term => 
          new RegExp(term, 'i').test(content)
        ).length;
        const subjectiveCount = subjectiveIndicators.filter(term => 
          new RegExp(term, 'i').test(content)
        ).length;
        
        const passed = objectiveCount > subjectiveCount;
        return {
          passed,
          message: passed ? 'Linguagem objetiva adequada' : 'Linguagem muito subjetiva',
          details: `Indicadores objetivos: ${objectiveCount}, subjetivos: ${subjectiveCount}`
        };
      }
    },

    // Segurança e Aspectos Legais
    {
      id: 'legal_disclaimer',
      name: 'Aspectos Médico-Legais',
      description: 'Deve incluir aspectos médico-legais',
      category: 'safety',
      severity: 'warning',
      validator: (content) => {
        const hasLegalAspects = /aspectos médico-legais|limitações|responsabilidade|legal/i.test(content);
        return {
          passed: hasLegalAspects,
          message: hasLegalAspects ? 'Aspectos legais documentados' : 'Aspectos legais ausentes',
          details: hasLegalAspects ? undefined : 'Recomenda-se incluir aspectos médico-legais e limitações'
        };
      }
    },
    {
      id: 'urgency_indicators',
      name: 'Indicadores de Urgência',
      description: 'Identificação adequada de situações urgentes',
      category: 'safety',
      severity: 'error',
      validator: (content) => {
        const urgentKeywords = ['urgente', 'emergência', 'crítico', 'grave', 'imediato'];
        const hasUrgentKeywords = urgentKeywords.some(keyword => 
          new RegExp(keyword, 'i').test(content)
        );
        
        if (hasUrgentKeywords) {
          const hasUrgentRecommendations = /encaminhar|referir|avaliação imediata|urgente/i.test(content);
          return {
            passed: hasUrgentRecommendations,
            message: hasUrgentRecommendations ? 'Urgência adequadamente tratada' : 'Urgência identificada mas sem conduta adequada',
            details: hasUrgentRecommendations ? undefined : 'Situações urgentes devem incluir recomendações específicas'
          };
        }
        
        return {
          passed: true,
          message: 'Nenhuma urgência identificada',
          details: 'Análise normal sem indicadores de urgência'
        };
      }
    },

    // Recomendações
    {
      id: 'follow_up',
      name: 'Seguimento Clínico',
      description: 'Deve incluir orientações de seguimento',
      category: 'recommended',
      severity: 'info',
      validator: (content) => {
        const hasFollowUp = /seguimento|acompanhamento|retorno|reavaliação|follow.?up/i.test(content);
        return {
          passed: hasFollowUp,
          message: hasFollowUp ? 'Orientações de seguimento presentes' : 'Orientações de seguimento ausentes',
          details: hasFollowUp ? undefined : 'Recomenda-se incluir orientações de seguimento'
        };
      }
    }
  ];

  // Executar validações
  useEffect(() => {
    if (!reportContent) return;

    setIsValidating(true);
    
    const results = validationRules.map(rule => {
      const result = rule.validator(reportContent, metadata);
      return { ...result, rule };
    });

    setValidationResults(results);

    // Calcular score geral
    const totalRules = results.length;
    const passedRules = results.filter(r => r.passed).length;
    const score = Math.round((passedRules / totalRules) * 100);
    setOverallScore(score);

    setIsValidating(false);

    if (onValidationComplete) {
      onValidationComplete(results);
    }
  }, [reportContent, metadata]);

  // Renderizar resultado de validação
  const renderValidationItem = (result: ValidationResult & { rule: ValidationRule }) => {
    const getIcon = () => {
      if (result.passed) {
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      } else {
        switch (result.rule.severity) {
          case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
          case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
          case 'info': return <Info className="h-5 w-5 text-blue-600" />;
        }
      }
    };

    const getColorClass = () => {
      if (result.passed) return 'border-green-200 bg-green-50';
      switch (result.rule.severity) {
        case 'error': return 'border-red-200 bg-red-50';
        case 'warning': return 'border-yellow-200 bg-yellow-50';
        case 'info': return 'border-blue-200 bg-blue-50';
      }
    };

    const getCategoryIcon = () => {
      switch (result.rule.category) {
        case 'mandatory': return <Shield className="h-4 w-4" />;
        case 'quality': return <Target className="h-4 w-4" />;
        case 'safety': return <AlertCircle className="h-4 w-4" />;
        case 'recommended': return <Info className="h-4 w-4" />;
      }
    };

    return (
      <div key={result.rule.id} className={`p-4 rounded-lg border ${getColorClass()}`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {getCategoryIcon()}
              <h4 className="font-medium text-gray-900">{result.rule.name}</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {result.rule.category}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1">{result.message}</p>
            {result.details && (
              <p className="text-xs text-gray-600">{result.details}</p>
            )}
            {result.confidence && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Confiança:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{result.confidence}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Estatísticas por categoria
  const getStatsByCategory = () => {
    const stats = {
      mandatory: { total: 0, passed: 0 },
      quality: { total: 0, passed: 0 },
      safety: { total: 0, passed: 0 },
      recommended: { total: 0, passed: 0 }
    };

    validationResults.forEach(result => {
      stats[result.rule.category].total++;
      if (result.passed) {
        stats[result.rule.category].passed++;
      }
    });

    return stats;
  };

  const stats = getStatsByCategory();

  if (isValidating) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-600 animate-spin" />
            <span className="text-gray-700">Validando laudo médico...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card className="shadow-lg border-l-4 border-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-2">
            <FileCheck className="h-6 w-6 text-blue-600" />
            <span>Validação do Laudo Médico</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Geral */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{overallScore}%</div>
              <div className="text-gray-600">Score de Qualidade</div>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      overallScore >= 80 ? 'bg-green-500' : 
                      overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Estatísticas por Categoria */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Obrigatórios</span>
                <span className="text-sm text-gray-600">
                  {stats.mandatory.passed}/{stats.mandatory.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Qualidade</span>
                <span className="text-sm text-gray-600">
                  {stats.quality.passed}/{stats.quality.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Segurança</span>
                <span className="text-sm text-gray-600">
                  {stats.safety.passed}/{stats.safety.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Recomendados</span>
                <span className="text-sm text-gray-600">
                  {stats.recommended.passed}/{stats.recommended.total}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados Detalhados */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <span>Resultados da Validação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {validationResults.map(renderValidationItem)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalValidation;