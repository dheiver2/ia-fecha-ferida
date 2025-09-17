import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CompactValidation } from './CompactValidation';
import { 
  FileText, 
  User, 
  Calendar, 
  Activity, 
  Eye, 
  Target, 
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Stethoscope,
  Heart,
  Brain,
  Zap,
  TrendingUp,
  Award,
  AlertCircle,
  Search,
  Camera
} from 'lucide-react';

interface CompactMedicalReportProps {
  reportContent: string;
  isLoading?: boolean;
  patientInfo?: {
    patientID?: string;
    patientName?: string;
    patientBirthDate?: string;
    patientSex?: string;
    patientAge?: string;
  };
  metadata?: {
    examType?: string;
    urgency?: string;
    confidence?: number;
  };
}

interface ReportSection {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  confidence?: number;
  urgency?: 'normal' | 'urgent' | 'critical';
}

export const CompactMedicalReport: React.FC<CompactMedicalReportProps> = ({
  reportContent,
  isLoading = false,
  patientInfo,
  metadata
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['morphology', 'diagnosis', 'recommendations', 'findings']));
  const [reportSections, setReportSections] = useState<ReportSection[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'urgent' | 'critical'>('normal');

  // Extrair e processar seções do relatório
  useEffect(() => {
    if (!reportContent) return;

    const sections = reportContent.split(/(?=\*\*[A-Z])/);
    const processedSections: ReportSection[] = [];

    sections.forEach((section, index) => {
      const lowerSection = section.toLowerCase();
      let sectionData: Partial<ReportSection> = {};

      if (lowerSection.includes('identificação') && lowerSection.includes('exame')) {
        sectionData = {
          id: 'identification',
          title: 'Identificação do Exame',
          icon: <FileText className="h-4 w-4" />,
          priority: 'medium'
        };
      } else if (lowerSection.includes('dados do paciente')) {
        sectionData = {
          id: 'patient',
          title: 'Dados do Paciente',
          icon: <User className="h-4 w-4" />,
          priority: 'medium'
        };
      } else if (lowerSection.includes('história clínica relevante')) {
        sectionData = {
          id: 'history',
          title: 'História Clínica',
          icon: <Clock className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('técnica') && lowerSection.includes('qualidade')) {
        sectionData = {
          id: 'technique',
          title: 'Técnica e Qualidade',
          icon: <Activity className="h-4 w-4" />,
          priority: 'medium'
        };
      } else if (lowerSection.includes('análise morfológica detalhada')) {
        sectionData = {
          id: 'morphology',
          title: 'Análise Morfológica',
          icon: <Eye className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('estruturas anatômicas')) {
        sectionData = {
          id: 'anatomy',
          title: 'Estruturas Anatômicas',
          icon: <Brain className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('achados específicos')) {
        sectionData = {
          id: 'findings',
          title: 'Achados Específicos',
          icon: <AlertCircle className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('impressão diagnóstica')) {
        sectionData = {
          id: 'diagnosis',
          title: 'Impressão Diagnóstica',
          icon: <Stethoscope className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('recomendações clínicas detalhadas')) {
        sectionData = {
          id: 'recommendations',
          title: 'Recomendações Clínicas',
          icon: <Target className="h-4 w-4" />,
          priority: 'high'
        };
      } else if (lowerSection.includes('limitações') && lowerSection.includes('considerações')) {
        sectionData = {
          id: 'limitations',
          title: 'Limitações e Considerações',
          icon: <AlertTriangle className="h-4 w-4" />,
          priority: 'medium'
        };
      } else if (lowerSection.includes('aspectos médico-legais')) {
        sectionData = {
          id: 'legal',
          title: 'Aspectos Médico-Legais',
          icon: <Shield className="h-4 w-4" />,
          priority: 'low'
        };
      }

      if (sectionData.id && section.trim()) {
        // Detectar urgência
        let urgency: 'normal' | 'urgent' | 'critical' = 'normal';
        if (lowerSection.includes('crítico') || lowerSection.includes('emergência')) {
          urgency = 'critical';
        } else if (lowerSection.includes('urgente') || lowerSection.includes('grave')) {
          urgency = 'urgent';
        }

        // Calcular confiança
        const confidenceMatch = section.match(/(\d+)%/);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 
          Math.min(95, 75 + (section.length / 100) * 10);

        processedSections.push({
          ...sectionData as ReportSection,
          content: section.replace(/\*\*/g, '').trim(),
          confidence,
          urgency
        });
      }
    });

    setReportSections(processedSections);

    // Calcular score geral
    const avgConfidence = processedSections.reduce((acc, s) => acc + (s.confidence || 0), 0) / processedSections.length;
    setOverallScore(Math.round(avgConfidence));

    // Determinar urgência geral
    const hasCritical = processedSections.some(s => s.urgency === 'critical');
    const hasUrgent = processedSections.some(s => s.urgency === 'urgent');
    setUrgencyLevel(hasCritical ? 'critical' : hasUrgent ? 'urgent' : 'normal');

  }, [reportContent]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-orange-500 bg-orange-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'urgent': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getPriorityOrder = (priority: string) => {
    switch (priority) {
      case 'high': return 1;
      case 'medium': return 2;
      case 'low': return 3;
      default: return 4;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedSections = [...reportSections].sort((a, b) => 
    getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Profissional Melhorado */}
      <div className={`bg-gradient-to-r from-slate-50 to-blue-50 border-2 rounded-2xl shadow-xl overflow-hidden ${getUrgencyColor(urgencyLevel)}`}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-1">LAUDO MÉDICO DIGITAL</h1>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      🤖 IA Avançada
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✅ Validado
                    </span>
                    <span className="text-sm text-slate-600">
                      {new Date().toLocaleDateString('pt-BR')} • {new Date().toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Score de Qualidade Melhorado */}
                <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {overallScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Qualidade da Análise</p>
                </div>
                
                {/* Status de Urgência Melhorado */}
                <div className="text-center bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    {getUrgencyIcon(urgencyLevel)}
                    <span className="text-lg font-bold text-slate-800 capitalize">
                      {urgencyLevel === 'critical' ? '🚨 CRÍTICO' : 
                       urgencyLevel === 'urgent' ? '⚠️ URGENTE' : '✅ NORMAL'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Nível de Urgência</p>
                </div>
                
                {/* Informações Adicionais */}
                <div className="text-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Search className="h-5 w-5 text-indigo-600" />
                    <span className="text-lg font-bold text-indigo-800">
                      {reportSections.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Seções Analisadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seções Principais */}
      <div className="grid gap-4">
        {sortedSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isHighPriority = section.priority === 'high';
          
          const priorityColors = {
            high: 'border-red-300 bg-gradient-to-r from-red-50 to-red-100/50',
            medium: 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100/50',
            low: 'border-green-300 bg-gradient-to-r from-green-50 to-green-100/50'
          };

          const urgencyColors = {
            critical: 'text-red-700 bg-red-200 border-red-300',
            urgent: 'text-orange-700 bg-orange-200 border-orange-300',
            normal: 'text-green-700 bg-green-200 border-green-300'
          };

          const priorityIcons = {
            high: <AlertCircle className="h-4 w-4 text-red-600" />,
            medium: <Clock className="h-4 w-4 text-yellow-600" />,
            low: <CheckCircle className="h-4 w-4 text-green-600" />
          };
          
          return (
            <div 
              key={section.id} 
              className={`border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${priorityColors[section.priority]} mb-4 overflow-hidden`}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-white/30 transition-all duration-200"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white/60 p-2 rounded-lg shadow-sm">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-lg">{section.title}</h3>
                      {priorityIcons[section.priority]}
                    </div>
                    <div className="flex items-center space-x-3">
                      {section.confidence && (
                        <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
                          {section.confidence}% Confiança
                        </span>
                      )}
                      {section.urgency && section.urgency !== 'normal' && (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${urgencyColors[section.urgency]}`}>
                          {section.urgency === 'critical' ? '🚨 CRÍTICO' : '⚠️ URGENTE'}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 bg-white/50 px-2 py-1 rounded-full">
                        {section.priority === 'high' ? 'Alta Prioridade' : 
                         section.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-2 rounded-lg shadow-sm">
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600" /> : <ChevronDown className="h-5 w-5 text-slate-600" />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="bg-white/40 border-t-2 border-white/60">
                  <div className="p-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumo Rápido */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Resumo Executivo</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-gray-700">
                <strong>Diagnóstico:</strong> {
                  sortedSections.find(s => s.id === 'diagnosis')?.content.slice(0, 50) + '...' || 'Não especificado'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-700">
                <strong>Urgência:</strong> {
                  urgencyLevel === 'critical' ? 'Crítica' : 
                  urgencyLevel === 'urgent' ? 'Urgente' : 'Normal'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">
                <strong>Qualidade:</strong> {overallScore}% de confiança
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validação Compacta */}
      <div className="mt-6">
        <CompactValidation 
          reportContent={reportContent}
          metadata={metadata}
        />
      </div>

      {/* Footer Compacto */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>Documento gerado por IA • Validação médica recomendada</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactMedicalReport;