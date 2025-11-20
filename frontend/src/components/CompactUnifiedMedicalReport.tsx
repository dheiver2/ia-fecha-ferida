import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MedicalReportTemplate } from '@/templates/medicalReportTemplate';
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
  Clock,
  Stethoscope,
  Heart,
  Brain,
  MapPin,
  Clipboard,
  Building,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Download
} from 'lucide-react';

interface CompactUnifiedMedicalReportProps {
  reportContent: string;
  isLoading?: boolean;
  patientData?: {
    name?: string;
    age?: string;
    gender?: string;
    id?: string;
    protocol?: string;
  };
  onPrint?: () => void;
}

export const CompactUnifiedMedicalReport: React.FC<CompactUnifiedMedicalReportProps> = ({ 
  reportContent, 
  isLoading = false,
  patientData,
  onPrint
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const parsedReport = useMemo(() => {
    if (!reportContent) return null;
    
    try {
      const cleanContent = reportContent.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanContent) as MedicalReportTemplate;
    } catch (error) {
      console.error('Erro ao fazer parse do relatório:', error);
      return null;
    }
  }, [reportContent]);

  if (isLoading) {
    return (
      <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <Brain className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gerando Laudo de Alta Precisão</h3>
                <p className="text-sm text-muted-foreground mt-1">Nossa IA está analisando cada pixel da imagem...</p>
            </div>
            <div className="w-64 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-primary animate-progress-indeterminate"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!parsedReport) {
    return (
      <Card className="w-full border-red-200 bg-red-50/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Erro ao processar o relatório</h3>
            <p className="text-red-700 max-w-md">Não foi possível interpretar os dados retornados pela IA. Por favor, tente novamente com uma imagem mais clara.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'high':
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="compact-unified-report w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho do Laudo */}
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600"></div>
        <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl shadow-inner">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">LAUDO MÉDICO INTELIGENTE</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs font-normal bg-primary/5 text-primary border-primary/10">
                        IA Generativa v4.0
                    </Badge>
                    <span className="text-sm text-muted-foreground">Análise Dermatológica Avançada</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                v{parsedReport.header.version}
              </Badge>
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint} className="hover:bg-primary/5 hover:text-primary transition-colors">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              )}
              <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Grid de Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            {/* Dados do Paciente */}
            <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                <User className="h-4 w-4" />
                <span>Paciente</span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                  {Array.isArray(parsedReport.patientInfo.name) 
                    ? parsedReport.patientInfo.name.map(n => n.text || `${n.given?.join(' ') || ''} ${n.family || ''}`.trim()).join(', ')
                    : parsedReport.patientInfo.name || patientData?.name || 'Paciente Não Identificado'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                    {parsedReport.patientInfo.age || patientData?.age || '--'} anos
                  </span>
                  <span>•</span>
                  <span>{parsedReport.patientInfo.gender || patientData?.gender || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Data e Protocolo */}
            <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                <Calendar className="h-4 w-4" />
                <span>Exame</span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {parsedReport.header?.date || new Date().toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 inline-block px-2 py-0.5 rounded">
                  #{parsedReport.header?.protocol || patientData?.protocol || 'CFI-79479063'}
                </p>
              </div>
            </div>

            {/* Qualidade da Imagem */}
            <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                <Eye className="h-4 w-4" />
                <span>Qualidade</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{parsedReport.examination?.imageQuality?.resolution || 'Boa'}</span>
                    <span className="text-xs font-bold text-primary">{parsedReport.examination?.imageQuality?.overallScore || 8}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                        className="bg-primary h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${((parsedReport.examination?.imageQuality?.overallScore || 8) / 10) * 100}%` }}
                    ></div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                <CheckCircle className="h-4 w-4" />
                <span>Status</span>
              </div>
              <div className="space-y-2">
                <Badge className={`${getUrgencyColor('normal')} px-3 py-1`}>
                  Análise Concluída
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">
            {/* Diagnóstico Principal - Destaque */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Impressão Diagnóstica</h3>
                    </div>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                    <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-4">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                        {parsedReport.diagnosis?.primary?.condition || 'Análise em andamento'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Etiologia</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{parsedReport.diagnosis?.primary?.etiology || 'A determinar'}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Estágio</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{parsedReport.diagnosis?.primary?.stage || 'Em avaliação'}</span>
                            </div>
                        </div>

                        {parsedReport.diagnosis?.primary?.justification && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                            <strong className="text-blue-700 dark:text-blue-400 block mb-1">Justificativa da IA:</strong> 
                            {parsedReport.diagnosis.primary.justification}
                        </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {parsedReport.diagnosis?.primary?.severity && (
                            <Badge variant="outline" className="px-3 py-1 bg-white dark:bg-gray-800">
                            Severidade: <span className="font-bold ml-1">{parsedReport.diagnosis.primary.severity}</span>
                            </Badge>
                        )}
                        {parsedReport.diagnosis?.primary?.confidence && (
                            <Badge variant="outline" className="px-3 py-1 bg-white dark:bg-gray-800 border-green-200 text-green-700 dark:text-green-400">
                            Confiança IA: <span className="font-bold ml-1">{parsedReport.diagnosis.primary.confidence}%</span>
                            </Badge>
                        )}
                        {parsedReport.diagnosis?.primary?.diagnosticCertainty?.level && (
                            <Badge variant="outline" className="px-3 py-1 bg-white dark:bg-gray-800">
                            Certeza: <span className="font-bold ml-1">{parsedReport.diagnosis.primary.diagnosticCertainty.level}</span>
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Achados e Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Morfologia</h4>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Dimensões</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{parsedReport.findings?.morphology?.dimensions?.length || '-'} x {parsedReport.findings?.morphology?.dimensions?.width || '-'} cm</span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Profundidade</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{parsedReport.findings?.morphology?.depth || '-'}</span>
                            </li>
                            <li className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm text-muted-foreground">Bordas</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{parsedReport.findings?.morphology?.edges?.definition || '-'}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Tecido</h4>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-red-600 font-medium">Granulação</span>
                                    <span className="font-bold">{parsedReport.findings?.tissueAnalysis?.granulation?.percentage || 0}%</span>
                                </div>
                                <div className="w-full bg-red-100 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${parsedReport.findings?.tissueAnalysis?.granulation?.percentage || 0}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">Necrose</span>
                                    <span className="font-bold">{parsedReport.findings?.tissueAnalysis?.necrotic?.percentage || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gray-800 h-2 rounded-full" style={{ width: `${parsedReport.findings?.tissueAnalysis?.necrotic?.percentage || 0}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-yellow-600 font-medium">Fibrina</span>
                                    <span className="font-bold">{parsedReport.findings?.tissueAnalysis?.fibrin?.percentage || 0}%</span>
                                </div>
                                <div className="w-full bg-yellow-100 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${parsedReport.findings?.tissueAnalysis?.fibrin?.percentage || 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Coluna Lateral (1/3) - Recomendações */}
        <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 h-full">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Plano Terapêutico</h4>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {parsedReport.recommendations?.immediate ? (
                        <>
                        <div className="space-y-3">
                            <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">Imediato</h5>
                            
                            {parsedReport.recommendations.immediate.cleaning && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-muted-foreground">Limpeza</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{parsedReport.recommendations.immediate.cleaning.solution}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {parsedReport.recommendations.immediate.dressing && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-muted-foreground">Curativo Primário</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{parsedReport.recommendations.immediate.dressing.primary.type}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {parsedReport.recommendations.immediate.debridement?.indicated && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-1 rounded-full">
                                            <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-muted-foreground">Intervenção</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Desbridamento {parsedReport.recommendations.immediate.debridement.type}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {parsedReport.diagnosis?.primary?.prognosticImplications?.healingPotential && (
                            <div className="bg-emerald-100/50 dark:bg-emerald-900/20 p-4 rounded-xl mt-4">
                                <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2">Prognóstico</h5>
                                <p className="text-sm text-emerald-900 dark:text-emerald-100">
                                    {parsedReport.diagnosis.primary.prognosticImplications.healingPotential.timelineEstimate}
                                </p>
                                {parsedReport.diagnosis.primary.prognosticImplications.healingPotential.probabilityScore && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 bg-emerald-200 dark:bg-emerald-800 h-1.5 rounded-full">
                                            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${parsedReport.diagnosis.primary.prognosticImplications.healingPotential.probabilityScore}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-700">{parsedReport.diagnosis.primary.prognosticImplications.healingPotential.probabilityScore}%</span>
                                    </div>
                                )}
                            </div>
                        )}
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Recomendações indisponíveis no momento.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Botão para Detalhes Completos */}
      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="group text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
        >
          {showDetails ? (
            <>
              <span className="mr-2">Ocultar Detalhes Técnicos</span>
              <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            </>
          ) : (
            <>
              <span className="mr-2">Ver Detalhes Técnicos Completos</span>
              <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      {/* Seção de Detalhes Expandida */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-4">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Análise Detalhada */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold flex items-center space-x-2 text-primary border-b pb-2">
                            <Stethoscope className="h-5 w-5" />
                            <span>Análise Clínica Profunda</span>
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sinais Clínicos</h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="text-sm text-muted-foreground">Infecção</span>
                                        <Badge variant={parsedReport.findings?.signs?.infection?.present ? "destructive" : "outline"} className="text-xs">
                                            {parsedReport.findings?.signs?.infection?.present ? 'DETECTADO' : 'Ausente'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="text-sm text-muted-foreground">Inflamação</span>
                                        <Badge variant={parsedReport.findings?.signs?.inflammation?.present ? "default" : "outline"} className="text-xs">
                                            {parsedReport.findings?.signs?.inflammation?.present ? 'Presente' : 'Ausente'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                                        <span className="text-sm text-muted-foreground block mb-1">Exsudato</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{parsedReport.findings?.signs?.exudate?.amount || 'Não especificado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recomendações Completas */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold flex items-center space-x-2 text-primary border-b pb-2">
                            <Clipboard className="h-5 w-5" />
                            <span>Protocolos e Encaminhamentos</span>
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Encaminhamentos</h5>
                                <div className="space-y-2">
                                    {parsedReport.recommendations?.referrals?.map((referral, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{referral.specialty}</span>
                                            <Badge variant={referral.urgency === 'Urgente' ? 'destructive' : 'secondary'} className="text-xs">
                                                {referral.urgency}
                                            </Badge>
                                        </div>
                                    )) || <p className="text-sm text-muted-foreground italic">Nenhum encaminhamento específico necessário.</p>}
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Monitoramento</h5>
                                <div className="space-y-2">
                                    {parsedReport.recommendations?.monitoring?.parameters?.map((param, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm p-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <span className="text-muted-foreground">{param.parameter}</span>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{param.frequency}</span>
                                        </div>
                                    )) || <p className="text-sm text-muted-foreground italic">Seguimento padrão.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Footer Compacto */}
      <Card className="bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Building className="h-3 w-3" />
                <span>{parsedReport.header.institution}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-3 w-3" />
                <span>Resp: {parsedReport.header.responsiblePhysician}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/30">
              <Shield className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-700 dark:text-yellow-300 font-medium">Validação médica necessária</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactUnifiedMedicalReport;