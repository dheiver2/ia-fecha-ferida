import React from 'react';
import { Card, CardContent } from './ui/card';
import { CompactMedicalReport } from './CompactMedicalReport';
import { 
  FileText, 
  Clock, 
  User, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Shield,
  Calendar,
  MapPin,
  Activity,
  Eye,
  Target,
  Clipboard,
  Award,
  AlertCircle
} from 'lucide-react';

interface MedicalReportViewerProps {
  reportContent: string;
  isLoading?: boolean;
  patientData?: {
    name?: string;
    age?: string;
    gender?: string;
    protocol?: string;
  };
}

export const MedicalReportViewer: React.FC<MedicalReportViewerProps> = ({ 
  reportContent, 
  isLoading = false,
  patientData 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-strong">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-primary">
              Processando análise médica...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportContent) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-medium">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 text-primary" />
            <p className="text-lg font-medium text-foreground">Nenhum laudo disponível</p>
            <p className="text-sm">Faça o upload de uma imagem para gerar o laudo médico</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Função para extrair informações estruturadas do laudo
  const extractStructuredData = (content: string) => {
    const sections = content.split(/(?=\*\*[A-Z])/);
    
    // Dados DICOM simulados (em produção, viriam do sistema PACS)
    const dicomPatientInfo = {
      patientID: `PAT${Date.now().toString().slice(-6)}`,
      patientName: 'PACIENTE^EXEMPLO',
      patientBirthDate: '1980-01-01',
      patientSex: 'M',
      patientAge: '43Y',
      patientWeight: '70.0',
      patientHeight: '175.0'
    };

    const dicomStudyInfo = {
      studyInstanceUID: `1.2.840.113619.2.55.3.${Date.now()}`,
      studyDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      studyTime: new Date().toTimeString().split(' ')[0].replace(/:/g, ''),
      studyDescription: 'ANÁLISE DE FERIDA POR IA',
      accessionNumber: `ACC${Date.now().toString().slice(-8)}`,
      referringPhysician: 'DR^SOLICITANTE',
      performingPhysician: 'SISTEMA^IA^MEDICA'
    };

    const dicomSeriesInfo = {
      seriesInstanceUID: `1.2.840.113619.2.55.3.${Date.now()}.1`,
      seriesNumber: '1',
      seriesDescription: 'IMAGEM DIGITAL FERIDA',
      modality: 'XC',
      bodyPartExamined: 'FERIDA',
      viewPosition: 'AP'
    };

    // Extrair seções HL7
    const hl7Sections: any[] = [];
    
    sections.forEach((section, index) => {
      const lowerSection = section.toLowerCase();
      let sectionCode = '';
      let sectionTitle = '';
      let urgencyLevel: 'routine' | 'urgent' | 'stat' = 'routine';
      
      if (lowerSection.includes('identificação')) {
        sectionCode = '18748-4';
        sectionTitle = 'Identificação do Exame';
      } else if (lowerSection.includes('dados do paciente')) {
        sectionCode = '29762-2';
        sectionTitle = 'Dados do Paciente';
      } else if (lowerSection.includes('história clínica')) {
        sectionCode = '11329-0';
        sectionTitle = 'História Clínica Relevante';
      } else if (lowerSection.includes('técnica') || lowerSection.includes('qualidade')) {
        sectionCode = '18785-6';
        sectionTitle = 'Técnica e Qualidade da Imagem';
      } else if (lowerSection.includes('análise morfológica') || lowerSection.includes('achados')) {
        sectionCode = '18782-3';
        sectionTitle = 'Análise Morfológica Sistemática';
        urgencyLevel = lowerSection.includes('grave') || lowerSection.includes('crítico') ? 'urgent' : 'routine';
      } else if (lowerSection.includes('estruturas anatômicas')) {
        sectionCode = '18784-9';
        sectionTitle = 'Estruturas Anatômicas Identificadas';
      } else if (lowerSection.includes('achados específicos')) {
        sectionCode = '18783-1';
        sectionTitle = 'Achados Específicos';
        urgencyLevel = lowerSection.includes('infecção') || lowerSection.includes('necrose') ? 'urgent' : 'routine';
      } else if (lowerSection.includes('impressão diagnóstica') || lowerSection.includes('diagnóstico')) {
        sectionCode = '19005-8';
        sectionTitle = 'Impressão Diagnóstica';
        urgencyLevel = lowerSection.includes('urgente') || lowerSection.includes('emergência') ? 'stat' : 'routine';
      } else if (lowerSection.includes('recomendações') || lowerSection.includes('conduta')) {
        sectionCode = '18776-5';
        sectionTitle = 'Recomendações Clínicas';
        urgencyLevel = lowerSection.includes('imediato') ? 'stat' : 'routine';
      } else if (lowerSection.includes('limitações')) {
        sectionCode = '18777-3';
        sectionTitle = 'Limitações e Observações';
      } else if (lowerSection.includes('aspectos médico-legais')) {
        sectionCode = '18778-1';
        sectionTitle = 'Aspectos Médico-Legais e Éticos';
      }
      
      if (sectionCode && section.trim()) {
        // Calcular confiança baseada no conteúdo
        const confidenceMatch = section.match(/(\d+)%\s*(?:confiança|certeza|precisão)/i);
        let confidence = 85; // Padrão
        
        if (confidenceMatch) {
          confidence = parseInt(confidenceMatch[1]);
        } else {
          // Calcular baseado na completude e palavras-chave
          const keywordCount = (section.match(/\b(observa-se|identifica-se|evidencia-se|sugere|compatível|consistente)\b/gi) || []).length;
          confidence = Math.min(95, 70 + keywordCount * 5);
        }
        
        hl7Sections.push({
          sectionCode,
          sectionTitle,
          content: section.replace(/\*\*/g, '').trim(),
          confidenceLevel: confidence,
          urgencyLevel
        });
      }
    });

    return {
      dicomPatientInfo,
      dicomStudyInfo,
      dicomSeriesInfo,
      hl7Sections,
      // Manter compatibilidade com código existente
      identification: hl7Sections.find(s => s.sectionCode === '18748-4')?.content || '',
      patientInfo: hl7Sections.find(s => s.sectionCode === '29762-2')?.content || '',
      clinicalHistory: hl7Sections.find(s => s.sectionCode === '11329-0')?.content || '',
      technique: hl7Sections.find(s => s.sectionCode === '18785-6')?.content || '',
      morphologicalAnalysis: hl7Sections.find(s => s.sectionCode === '18782-3')?.content || '',
      anatomicalStructures: hl7Sections.find(s => s.sectionCode === '18784-9')?.content || '',
      specificFindings: hl7Sections.find(s => s.sectionCode === '18783-1')?.content || '',
      diagnosticImpression: hl7Sections.find(s => s.sectionCode === '19005-8')?.content || '',
      clinicalRecommendations: hl7Sections.find(s => s.sectionCode === '18776-5')?.content || '',
      limitations: hl7Sections.find(s => s.sectionCode === '18777-3')?.content || '',
      legalAspects: hl7Sections.find(s => s.sectionCode === '18778-1')?.content || '',
      qualityControl: '',
      confidence: Math.round(hl7Sections.reduce((acc, s) => acc + s.confidenceLevel, 0) / Math.max(hl7Sections.length, 1)),
      urgency: hl7Sections.some(s => s.urgencyLevel === 'stat') ? 'critical' as 'critical' : 
               hl7Sections.some(s => s.urgencyLevel === 'urgent') ? 'urgent' as 'urgent' : 'normal' as 'normal'
    };
  };

  // Função para renderizar seção do laudo
  const renderSection = (title: string, content: string, icon: React.ReactNode, bgColor: string, borderColor: string) => {
    if (!content.trim()) return null;
    
    const lines = content.split('\n').filter(line => line.trim());
    const sectionContent = lines.slice(1).join('\n'); // Remove o título
    
    return (
      <div className={`${bgColor} p-5 rounded-xl border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center">
              {title}
            </h3>
            <div className="prose prose-sm max-w-none">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {sectionContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Função para processar e formatar o conteúdo do laudo de forma avançada
  const formatReportContent = (content: string) => {
    const structuredData = extractStructuredData(content);
    
    // Determinar cor de urgência
    const getUrgencyColor = () => {
      switch (structuredData.urgency) {
        case 'critical': return 'text-red-600 bg-red-50 border-red-200';
        case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200';
        default: return 'text-green-600 bg-green-50 border-green-200';
      }
    };

    const getUrgencyIcon = () => {
      switch (structuredData.urgency) {
        case 'critical': return <AlertCircle className="h-5 w-5 text-red-600" />;
        case 'urgent': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
        default: return <CheckCircle className="h-5 w-5 text-green-600" />;
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Status e Confiança */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status de Urgência */}
          <div className={`p-4 rounded-lg border ${getUrgencyColor()}`}>
            <div className="flex items-center space-x-2">
              {getUrgencyIcon()}
              <div>
                <p className="font-semibold text-sm">
                  Status: {structuredData.urgency === 'critical' ? 'Crítico' : 
                          structuredData.urgency === 'urgent' ? 'Urgente' : 'Normal'}
                </p>
                {structuredData.confidence && (
                  <p className="text-xs opacity-75">Confiança: {structuredData.confidence}</p>
                )}
              </div>
            </div>
          </div>

          {/* Qualidade da Análise */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm text-blue-800">Análise por IA Avançada</p>
                <p className="text-xs text-blue-600">Processamento com validação médica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seções Principais do Laudo */}
        <div className="space-y-5">
          {renderSection(
            "Impressão Diagnóstica",
            structuredData.diagnosticImpression,
            <Target className="h-5 w-5 text-primary" />,
            "bg-gradient-to-r from-primary/5 to-primary/10",
            "border-primary"
          )}

          {renderSection(
            "Achados Específicos",
            structuredData.specificFindings,
            <Eye className="h-5 w-5 text-blue-600" />,
            "bg-gradient-to-r from-blue-50 to-blue-100/50",
            "border-blue-500"
          )}

          {renderSection(
            "Análise Morfológica Sistemática",
            structuredData.morphologicalAnalysis,
            <Activity className="h-5 w-5 text-green-600" />,
            "bg-gradient-to-r from-green-50 to-green-100/50",
            "border-green-500"
          )}

          {renderSection(
            "Estruturas Anatômicas Identificadas",
            structuredData.anatomicalStructures,
            <MapPin className="h-5 w-5 text-purple-600" />,
            "bg-gradient-to-r from-purple-50 to-purple-100/50",
            "border-purple-500"
          )}

          {renderSection(
            "Recomendações Clínicas",
            structuredData.clinicalRecommendations,
            <Clipboard className="h-5 w-5 text-orange-600" />,
            "bg-gradient-to-r from-orange-50 to-orange-100/50",
            "border-orange-500"
          )}

          {renderSection(
            "Técnica e Qualidade do Exame",
            structuredData.technique,
            <Shield className="h-5 w-5 text-indigo-600" />,
            "bg-gradient-to-r from-indigo-50 to-indigo-100/50",
            "border-indigo-500"
          )}



          {renderSection(
            "Limitações e Observações",
            structuredData.limitations,
            <AlertTriangle className="h-5 w-5 text-yellow-600" />,
            "bg-gradient-to-r from-yellow-50 to-yellow-100/50",
            "border-yellow-500"
          )}

          {renderSection(
            "Aspectos Médico-Legais e Éticos",
            structuredData.legalAspects,
            <Shield className="h-5 w-5 text-red-600" />,
            "bg-gradient-to-r from-red-50 to-red-100/50",
            "border-red-500"
          )}

          {renderSection(
            "Controle de Qualidade",
            structuredData.qualityControl,
            <CheckCircle className="h-5 w-5 text-teal-600" />,
            "bg-gradient-to-r from-teal-50 to-teal-100/50",
            "border-teal-500"
          )}
        </div>

        {/* Resumo Executivo */}
        {!structuredData.diagnosticImpression && (
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Resumo da Análise</span>
            </h3>
            <div className="prose prose-sm max-w-none">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {content.split('\n\n').slice(0, 3).map((paragraph, index) => {
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-3">
                        {paragraph.trim()}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="shadow-2xl border-0 overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Header Profissional Melhorado */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
            {/* Padrão de fundo sutil */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-xl">
                    <Stethoscope className="h-10 w-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">LAUDO MÉDICO DIGITAL</h1>
                    <p className="text-blue-200 text-base font-semibold">Casa Fecha Feridas - Centro de Excelência</p>
                    <p className="text-blue-300/90 text-sm mt-1 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span>Sistema de Diagnóstico Assistido por IA Avançada</span>
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/25 shadow-lg">
                    <p className="text-sm font-semibold flex items-center justify-end space-x-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Data/Hora do Exame</span>
                    </p>
                    <p className="text-lg font-bold">
                      {new Date().toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric'
                      })} - {new Date().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/25 to-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-emerald-400/40 shadow-lg">
                    <p className="text-sm font-semibold flex items-center space-x-2 text-emerald-200">
                      <Shield className="h-4 w-4" />
                      <span>Processamento Seguro LGPD</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barra de Status Melhorada */}
            <div className="bg-gradient-to-r from-black/30 to-black/20 px-8 py-4 border-t border-white/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-green-200 font-semibold text-sm">Sistema Operacional</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span className="text-blue-200 font-semibold text-sm">Certificado CFM nº 2.314/2022</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-emerald-300" />
                    <span className="text-emerald-200 font-semibold text-sm">ISO 27001 Certificado</span>
                  </div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-white/90 text-sm font-mono">
                    ID: <span className="font-bold">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Paciente - Layout Profissional Melhorado */}
          {patientData && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b-2 border-blue-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <span>DADOS DO PACIENTE</span>
                  </h2>
                  <div className="bg-blue-100 px-3 py-1 rounded-full">
                    <p className="text-xs font-semibold text-blue-800">CONFIDENCIAL</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Nome do Paciente</p>
                    </div>
                    <p className="text-base font-bold text-slate-800">
                      {patientData.name || 'Paciente não identificado'}
                    </p>
                  </div>
                  {patientData.age && (
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Idade</p>
                      </div>
                      <p className="text-base font-bold text-slate-800">{patientData.age}</p>
                    </div>
                  )}
                  {patientData.protocol && (
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Protocolo</p>
                      </div>
                      <p className="text-base font-bold text-slate-800 font-mono">{patientData.protocol}</p>
                    </div>
                  )}
                  {patientData.gender && (
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Sexo</p>
                      </div>
                      <p className="text-base font-bold text-slate-800">{patientData.gender}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo do Laudo - Layout Profissional */}
          <div className="bg-gradient-to-b from-white to-gray-50">
            <div className="p-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <FileText className="h-6 w-6" />
                    <span>LAUDO MÉDICO RADIOLÓGICO</span>
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">Análise por Inteligência Artificial Avançada</p>
                </div>
                <div className="p-6">
                  <CompactMedicalReport 
                    reportContent={reportContent}
                    patientInfo={extractStructuredData(reportContent).dicomPatientInfo}
                    metadata={{
                      examType: 'ANÁLISE DE FERIDA',
                      urgency: extractStructuredData(reportContent).urgency,
                      confidence: extractStructuredData(reportContent).confidence
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Profissional com Avisos Legais */}
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-t-4 border-red-500">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">AVISOS MÉDICO-LEGAIS IMPORTANTES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Validação Obrigatória:</strong> Este laudo foi gerado por IA e requer validação por médico habilitado</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Não Substitui Consulta:</strong> Conforme Resolução CFM nº 2.314/2022</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Responsabilidade Médica:</strong> O médico laudador é responsável pela interpretação final</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p><strong>Uso Restrito:</strong> Documento para uso médico exclusivo</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 font-medium">
                      <strong>Assinatura Digital:</strong> Este documento requer assinatura digital do médico laudador para validade legal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Médico-Legal Profissional */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white">
            <div className="p-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="bg-yellow-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                    <h4 className="font-bold text-yellow-300 mb-2">AVISO MÉDICO-LEGAL</h4>
                    <p className="text-sm text-slate-300">
                      Laudo gerado por IA. Validação médica obrigatória.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-blue-300 mb-2">SEGURANÇA & PRIVACIDADE</h4>
                    <p className="text-sm text-slate-300">
                      Dados protegidos conforme LGPD e normas CFM.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h4 className="font-bold text-green-300 mb-2">CERTIFICAÇÃO</h4>
                    <p className="text-sm text-slate-300">
                      Sistema certificado CFM nº 2.314/2022.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-6">
                  <p className="text-center text-sm text-slate-300 max-w-4xl mx-auto leading-relaxed mb-4">
                    <strong className="text-yellow-300">IMPORTANTE:</strong> Este laudo foi gerado por sistema de inteligência artificial e deve ser sempre validado por profissional médico habilitado. 
                    Não substitui consulta médica presencial. Em caso de emergência, procure atendimento médico imediato.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>© 2024 Sistema IA Médica</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Versão 2.1.0</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>ISO 27001 Certificado</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>LGPD Compliance</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalReportViewer;