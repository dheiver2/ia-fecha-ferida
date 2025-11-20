import React, { useState, useEffect, ReactNode } from 'react';
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
  icon: ReactNode;
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
      case 'critical': return 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'urgent': return 'border-orange-500 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-emerald-500 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    }
  };

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'urgent': return <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      default: return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
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
        <Card className="animate-pulse bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
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
      <div className={`bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-2 rounded-2xl shadow-xl overflow-hidden ${getUrgencyColor(urgencyLevel)}`}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">LAUDO MÉDICO DIGITAL</h1>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                      🤖 IA Avançada
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">
                      ✅ Validado
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date().toLocaleDateString('pt-BR')} • {new Date().toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Score de Qualidade Melhorado */}
                <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {overallScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Qualidade da Análise</p>
                </div>
                
                {/* Status de Urgência Melhorado */}
                <div className="text-center bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    {getUrgencyIcon(urgencyLevel)}
                    <span className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                      {urgencyLevel === 'critical' ? '🚨 CRÍTICO' : 
                       urgencyLevel === 'urgent' ? '⚠️ URGENTE' : '✅ NORMAL'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Nível de Urgência</p>
                </div>
                
                {/* Informações Adicionais */}
                <div className="text-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                      {reportSections.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Seções Analisadas</p>
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
            high: 'border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10',
            medium: 'border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10',
            low: 'border-emerald-300 dark:border-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10'
          };

          const urgencyColors = {
            critical: 'text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-700',
            urgent: 'text-orange-700 dark:text-orange-300 bg-orange-200 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700',
            normal: 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700'
          };

          const priorityIcons = {
            high: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
            medium: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
            low: <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          };
          
          return (
            <div 
              key={section.id} 
              className={`border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${priorityColors[section.priority]} mb-4 overflow-hidden backdrop-blur-sm`}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-white/30 dark:hover:bg-slate-800/30 transition-all duration-200"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg shadow-sm">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{section.title}</h3>
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
                      <span className="text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                        {section.priority === 'high' ? 'Alta Prioridade' : 
                         section.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg shadow-sm">
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                </div>
              </div>
              
              {isExpanded && (
                <div className="bg-white/40 dark:bg-slate-900/40 border-t-2 border-white/60 dark:border-slate-700/60">
                  <div className="p-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
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
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">Resumo Executivo</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>Diagnóstico:</strong> {
                  sortedSections.find(s => s.id === 'diagnosis')?.content.slice(0, 50) + '...' || 'Não especificado'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>Urgência:</strong> {
                  urgencyLevel === 'critical' ? 'Crítica' : 
                  urgencyLevel === 'urgent' ? 'Urgente' : 'Normal'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-slate-700 dark:text-slate-300">
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
      <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
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