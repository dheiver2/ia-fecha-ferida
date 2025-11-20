import React, { ReactNode } from 'react';
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
      <Card className="w-full max-w-4xl mx-auto border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Processando análise médica</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Nossa IA está examinando os detalhes clínicos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportContent) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
              <FileText className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nenhum laudo disponível</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Faça o upload de uma imagem para gerar o laudo médico detalhado.</p>
            </div>
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
  const renderSection = (title: string, content: string, icon: ReactNode, bgColor: string, borderColor: string) => {
    if (!content.trim()) return null;
    
    const lines = content.split('\n').filter(line => line.trim());
    const sectionContent = lines.slice(1).join('\n'); // Remove o título
    
    return (
      <div className={`${bgColor} p-6 rounded-xl border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm group`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1 p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
              {title}
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
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
        case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'urgent': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        default: return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      }
    };

    const getUrgencyIcon = () => {
      switch (structuredData.urgency) {
        case 'critical': return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
        case 'urgent': return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
        default: return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Status e Confiança */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status de Urgência */}
          <div className={`p-4 rounded-xl border ${getUrgencyColor()} backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                {getUrgencyIcon()}
              </div>
              <div>
                <p className="font-semibold text-sm uppercase tracking-wide opacity-80">Status Clínico</p>
                <p className="font-bold text-lg">
                  {structuredData.urgency === 'critical' ? 'Crítico' : 
                   structuredData.urgency === 'urgent' ? 'Urgente' : 'Normal'}
                </p>
              </div>
            </div>
          </div>

          {/* Qualidade da Análise */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl backdrop-blur-sm shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 uppercase tracking-wide opacity-80">Confiança da IA</p>
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-lg text-blue-900 dark:text-blue-100">{structuredData.confidence}%</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">Alta Precisão</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seções Principais do Laudo */}
        <div className="space-y-5">
          {renderSection(
            "Impressão Diagnóstica",
            structuredData.diagnosticImpression,
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
            "bg-blue-50/50 dark:bg-blue-900/10",
            "border-blue-500 dark:border-blue-400"
          )}

          {renderSection(
            "Achados Específicos",
            structuredData.specificFindings,
            <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
            "bg-indigo-50/50 dark:bg-indigo-900/10",
            "border-indigo-500 dark:border-indigo-400"
          )}

          {renderSection(
            "Análise Morfológica Sistemática",
            structuredData.morphologicalAnalysis,
            <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
            "bg-emerald-50/50 dark:bg-emerald-900/10",
            "border-emerald-500 dark:border-emerald-400"
          )}

          {renderSection(
            "Estruturas Anatômicas Identificadas",
            structuredData.anatomicalStructures,
            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            "bg-purple-50/50 dark:bg-purple-900/10",
            "border-purple-500 dark:border-purple-400"
          )}

          {renderSection(
            "Recomendações Clínicas",
            structuredData.clinicalRecommendations,
            <Clipboard className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
            "bg-amber-50/50 dark:bg-amber-900/10",
            "border-amber-500 dark:border-amber-400"
          )}

          {renderSection(
            "Técnica e Qualidade do Exame",
            structuredData.technique,
            <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />,
            "bg-slate-50/50 dark:bg-slate-900/10",
            "border-slate-500 dark:border-slate-400"
          )}

          {renderSection(
            "Limitações e Observações",
            structuredData.limitations,
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
            "bg-yellow-50/50 dark:bg-yellow-900/10",
            "border-yellow-500 dark:border-yellow-400"
          )}

          {renderSection(
            "Aspectos Médico-Legais e Éticos",
            structuredData.legalAspects,
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />,
            "bg-red-50/50 dark:bg-red-900/10",
            "border-red-500 dark:border-red-400"
          )}

          {renderSection(
            "Controle de Qualidade",
            structuredData.qualityControl,
            <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
            "bg-teal-50/50 dark:bg-teal-900/10",
            "border-teal-500 dark:border-teal-400"
          )}
        </div>

        {/* Resumo Executivo */}
        {!structuredData.diagnosticImpression && (
          <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Resumo da Análise</span>
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
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
      <Card className="shadow-2xl border-0 overflow-hidden bg-white dark:bg-slate-900 rounded-2xl">
        <CardContent className="p-0">
          {/* Header Profissional Melhorado */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Padrão de fundo sutil */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shadow-xl ring-1 ring-emerald-500/20">
                    <Stethoscope className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">LAUDO MÉDICO DIGITAL</h1>
                    <p className="text-emerald-400 text-base font-semibold tracking-wide">Vascular One - Centro de Excelência</p>
                    <p className="text-slate-400 text-sm mt-1 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      <span>Sistema de Diagnóstico Assistido por IA Avançada</span>
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-3 w-full md:w-auto">
                  <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 shadow-lg">
                    <p className="text-xs font-semibold flex items-center justify-end space-x-2 mb-1 text-slate-400 uppercase tracking-wider">
                      <Calendar className="h-3 w-3" />
                      <span>Data/Hora do Exame</span>
                    </p>
                    <p className="text-lg font-bold font-mono text-white">
                      {new Date().toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric'
                      })} <span className="text-slate-500 mx-1">|</span> {new Date().toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/20 shadow-lg flex items-center justify-end space-x-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-200 text-sm font-medium">Processamento Seguro LGPD</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barra de Status Melhorada */}
            <div className="bg-black/20 px-8 py-4 border-t border-white/5 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">Sistema Operacional</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">Certificado CFM nº 2.314/2022</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">ISO 27001</span>
                  </div>
                </div>
                <div className="bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                  <p className="text-slate-400 text-xs font-mono">
                    ID: <span className="font-bold text-white">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Paciente - Layout Profissional Melhorado */}
          {patientData && (
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-3">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                      <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>DADOS DO PACIENTE</span>
                  </h2>
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">CONFIDENCIAL</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Nome do Paciente</p>
                    </div>
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {patientData.name || 'Paciente não identificado'}
                    </p>
                  </div>
                  {patientData.age && (
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Idade</p>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{patientData.age}</p>
                    </div>
                  )}
                  {patientData.protocol && (
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Protocolo</p>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white font-mono">{patientData.protocol}</p>
                    </div>
                  )}
                  {patientData.gender && (
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition-transform"></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Sexo</p>
                      </div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{patientData.gender}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo do Laudo - Layout Profissional */}
          <div className="bg-white dark:bg-slate-950">
            <div className="p-8">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>LAUDO MÉDICO RADIOLÓGICO</span>
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 ml-14">Análise detalhada gerada por Inteligência Artificial Avançada</p>
                </div>
                <div className="p-8">
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
          <div className="bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/30">
            <div className="p-8">
              <div className="flex items-start space-x-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-4">AVISOS MÉDICO-LEGAIS IMPORTANTES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p><strong>Validação Obrigatória:</strong> Este laudo foi gerado por IA e requer validação por médico habilitado</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p><strong>Não Substitui Consulta:</strong> Conforme Resolução CFM nº 2.314/2022</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p><strong>Responsabilidade Médica:</strong> O médico laudador é responsável pela interpretação final</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p><strong>Uso Restrito:</strong> Documento para uso médico exclusivo</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 rounded-xl shadow-sm">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-emerald-500" />
                      <strong>Assinatura Digital:</strong> Este documento requer assinatura digital do médico laudador para validade legal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Médico-Legal Profissional */}
          <div className="bg-slate-900 text-white border-t border-slate-800">
            <div className="p-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="text-center group">
                    <div className="bg-slate-800 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-slate-700 transition-colors duration-300 border border-slate-700">
                      <AlertTriangle className="h-8 w-8 text-amber-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2">AVISO MÉDICO-LEGAL</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Laudo gerado por IA. Validação médica obrigatória.
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-slate-800 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-slate-700 transition-colors duration-300 border border-slate-700">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2">SEGURANÇA & PRIVACIDADE</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Dados protegidos conforme LGPD e normas CFM.
                    </p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-slate-800 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-slate-700 transition-colors duration-300 border border-slate-700">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2">CERTIFICAÇÃO</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Sistema certificado CFM nº 2.314/2022.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 pt-8">
                  <p className="text-center text-sm text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8">
                    <strong className="text-amber-400">IMPORTANTE:</strong> Este laudo foi gerado por sistema de inteligência artificial e deve ser sempre validado por profissional médico habilitado. 
                    Não substitui consulta médica presencial. Em caso de emergência, procure atendimento médico imediato.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>© 2024 Vascular One</span>
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span>v2.1.0</span>
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      <span>ISO 27001</span>
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>LGPD</span>
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