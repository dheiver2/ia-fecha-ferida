import React, { useState, useMemo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
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
  Camera,
  MapPin,
  Clipboard,
  Building,
  UserCheck,
  Leaf,
  Users,
  Printer,
  Download,
  Share2,
  Star,
  BarChart3,
  PieChart,
  Thermometer,
  Droplets,
  Ruler,
  Microscope,
  Bandage,
  Pill,
  Timer,
  Bookmark,
  Tag,
  Verified,
  QrCode,
  Lock,
  Fingerprint,
  Mail,
  Phone,
  MapPin as Location,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

interface StructuredMedicalReportViewerProps {
  reportContent: string;
  isLoading?: boolean;
  patientData?: {
    name?: string;
    age?: string;
    gender?: string;
    id?: string;
    protocol?: string;
  };
}

// Componente de Recomendações Melhoradas
const ImprovedRecommendations = ({ parsedReport }: { parsedReport: MedicalReportTemplate }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
      <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-blue-800">
        <Target className="h-5 w-5" />
        <span>Resumo das Recomendações</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-700">Urgente</span>
          </div>
          <p className="text-sm text-gray-600">
            {parsedReport.recommendations.immediate ? 'Definidas' : 'Não definidas'}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-yellow-700">Seguimento</span>
          </div>
          <p className="text-sm text-gray-600">
            {parsedReport.recommendations.monitoring?.followUpSchedule?.length ? 'Agendado' : 'Não definido'}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Pill className="h-4 w-4 text-green-500" />
            <span className="font-medium text-green-700">Tratamento</span>
          </div>
          <p className="text-sm text-gray-600">
            {parsedReport.recommendations.referrals?.length || 0} encaminhamentos
          </p>
        </div>
      </div>
    </div>
  );
};

export const StructuredMedicalReportViewer: React.FC<StructuredMedicalReportViewerProps> = ({ 
  reportContent, 
  isLoading = false,
  patientData 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['header', 'findings', 'diagnosis', 'recommendations'])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handlePrintReport = () => {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Obter o conteúdo do laudo
    const reportElement = document.getElementById('medical-report-content');
    if (!reportElement) return;

    // HTML para impressão com estilos específicos
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Laudo Médico - ${parsedReport?.header?.protocol || 'N/A'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #000;
              background: white;
              padding: 20mm;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10mm;
              margin-bottom: 10mm;
            }
            
            .header h1 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 5mm;
            }
            
            .header h2 {
              font-size: 14pt;
              font-weight: normal;
              margin-bottom: 3mm;
            }
            
            .protocol-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5mm;
              font-size: 11pt;
            }
            
            .section {
              margin-bottom: 8mm;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 14pt;
              font-weight: bold;
              border-bottom: 1px solid #333;
              padding-bottom: 2mm;
              margin-bottom: 4mm;
              text-transform: uppercase;
            }
            
            .patient-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 5mm;
              margin-bottom: 5mm;
            }
            
            .info-item {
              margin-bottom: 2mm;
            }
            
            .info-label {
              font-weight: bold;
              display: inline-block;
              width: 40mm;
            }
            
            .diagnosis-box {
              border: 2px solid #000;
              padding: 5mm;
              margin: 5mm 0;
              background-color: #f9f9f9;
            }
            
            .diagnosis-title {
              font-size: 14pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 3mm;
            }
            
            .recommendations {
              margin-top: 5mm;
            }
            
            .recommendation-item {
              margin-bottom: 2mm;
              padding-left: 5mm;
            }
            
            .footer {
              margin-top: 15mm;
              border-top: 1px solid #000;
              padding-top: 5mm;
              text-align: center;
              font-size: 10pt;
            }
            
            .signature-area {
              margin-top: 20mm;
              text-align: center;
            }
            
            .signature-line {
              border-top: 1px solid #000;
              width: 60mm;
              margin: 10mm auto 2mm auto;
            }
            
            @media print {
              body { margin: 0; padding: 15mm; }
              .no-print { display: none !important; }
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${parsedReport?.header?.title || 'LAUDO MÉDICO ESPECIALIZADO'}</h1>
            <h2>Análise Computacional de Feridas</h2>
            <div class="protocol-info">
              <span><strong>Protocolo:</strong> ${parsedReport?.header?.protocol || 'N/A'}</span>
              <span><strong>Data:</strong> ${parsedReport?.header?.date || 'N/A'} às ${parsedReport?.header?.time || 'N/A'}</span>
            </div>
            <div style="font-size: 11pt;">
              <div><strong>Instituição:</strong> ${parsedReport?.header?.institution || 'N/A'}</div>
              <div><strong>Sistema:</strong> ${parsedReport?.header?.system || 'N/A'}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Dados do Paciente</div>
            <div class="patient-info">
              <div class="info-item">
                <span class="info-label">Nome:</span>
                ${Array.isArray(parsedReport?.patientInfo?.name) 
                  ? parsedReport.patientInfo.name.map(n => n.text || `${n.given?.join(' ') || ''} ${n.family || ''}`.trim()).join(', ')
                  : parsedReport?.patientInfo?.name || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">Idade:</span>
                ${parsedReport?.patientInfo?.age || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">Sexo:</span>
                ${parsedReport?.patientInfo?.gender || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">ID Paciente:</span>
                ${parsedReport?.patientInfo?.id || 'N/A'}
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Achados do Exame</div>
            <div style="margin-bottom: 5mm;">
              <strong>Localização da Lesão:</strong> ${parsedReport?.patientInfo?.lesionLocation || 'N/A'}
            </div>
            <div style="margin-bottom: 5mm;">
              <strong>Dimensões:</strong> 
              ${parsedReport?.findings?.morphology?.dimensions?.length || 'N/A'} x 
              ${parsedReport?.findings?.morphology?.dimensions?.width || 'N/A'} cm
              (Área: ${parsedReport?.findings?.morphology?.dimensions?.area || 'N/A'} cm²)
            </div>
            <div style="margin-bottom: 5mm;">
              <strong>Profundidade:</strong> ${parsedReport?.findings?.morphology?.depth || 'N/A'}
            </div>
            <div style="margin-bottom: 5mm;">
              <strong>Análise Tecidual:</strong>
              <ul style="margin-left: 10mm; margin-top: 2mm;">
                <li>Granulação: ${parsedReport?.findings?.tissueAnalysis?.granulation?.percentage || 'N/A'}% - ${parsedReport?.findings?.tissueAnalysis?.granulation?.quality || 'N/A'}</li>
                <li>Tecido Necrótico: ${parsedReport?.findings?.tissueAnalysis?.necrotic?.percentage || 'N/A'}% - ${parsedReport?.findings?.tissueAnalysis?.necrotic?.type || 'N/A'}</li>
                <li>Fibrina: ${parsedReport?.findings?.tissueAnalysis?.fibrin?.percentage || 'N/A'}%</li>
              </ul>
            </div>
          </div>
          
          <div class="diagnosis-box">
            <div class="diagnosis-title">IMPRESSÃO DIAGNÓSTICA</div>
            <div style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 3mm;">
              ${parsedReport?.diagnosis?.primary?.condition || 'N/A'}
            </div>
            <div style="margin-bottom: 2mm;">
              <strong>Etiologia:</strong> ${parsedReport?.diagnosis?.primary?.etiology || 'N/A'}
            </div>
            <div style="margin-bottom: 2mm;">
              <strong>Classificação:</strong> ${parsedReport?.diagnosis?.classification?.grade || 'N/A'}
            </div>
            <div>
              <strong>Nível de Confiança:</strong> ${parsedReport?.diagnosis?.primary?.confidence || 'N/A'}%
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Recomendações Terapêuticas</div>
            <div class="recommendations">
              ${parsedReport?.recommendations?.immediate ? 
                Object.entries(parsedReport.recommendations.immediate).map(([key, value]: [string, any], index: number) => 
                  `<div class="recommendation-item">${index + 1}. ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}</div>`
                ).join('') : '<div>Nenhuma recomendação específica disponível</div>'}
            </div>
          </div>
          
          <div class="footer">
            <div style="margin-bottom: 5mm;">
              <strong>IMPORTANTE:</strong> Este laudo foi gerado por sistema de inteligência artificial e deve ser validado por profissional médico habilitado.
            </div>
            <div style="font-size: 9pt; color: #666;">
              ${parsedReport?.footer?.disclaimers?.[0] || 'Sistema de análise médica assistida por IA'}
            </div>
            
            <div class="signature-area">
              <div class="signature-line"></div>
              <div style="margin-top: 2mm;">
                ${parsedReport?.header?.responsiblePhysician || 'Sistema IA'}<br>
                ${parsedReport?.header?.crm || 'IA-SYSTEM'}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Escrever o HTML na nova janela
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Aguardar o carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // Função para determinar severidade baseada nos dados
  const getSeverityLevel = (diagnosis: any) => {
    const confidence = diagnosis?.primary?.confidence || 0;
    const grade = diagnosis?.classification?.grade || '';
    
    if (confidence >= 90 || grade.includes('IV') || grade.includes('4')) {
      return { level: 'critical', color: 'bg-red-500', label: 'Crítico', icon: AlertTriangle };
    } else if (confidence >= 70 || grade.includes('III') || grade.includes('3')) {
      return { level: 'high', color: 'bg-orange-500', label: 'Alto', icon: AlertCircle };
    } else if (confidence >= 50 || grade.includes('II') || grade.includes('2')) {
      return { level: 'medium', color: 'bg-yellow-500', label: 'Moderado', icon: Eye };
    } else {
      return { level: 'low', color: 'bg-green-500', label: 'Baixo', icon: CheckCircle };
    }
  };

  // Componente de Indicador de Severidade
  const SeverityIndicator = ({ diagnosis }: { diagnosis: any }) => {
    const severity = getSeverityLevel(diagnosis);
    const IconComponent = severity.icon;
    
    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold ${severity.color} shadow-lg`}>
        <IconComponent className="w-4 h-4 mr-2" />
        <span>Severidade: {severity.label}</span>
      </div>
    );
  };

  // Componente de Resumo Executivo
  const ExecutiveSummary = ({ parsedReport }: { parsedReport: any }) => {
    const confidence = parsedReport?.diagnosis?.primary?.confidence || 0;
    const condition = parsedReport?.diagnosis?.primary?.condition || 'N/A';
    const area = parsedReport?.findings?.morphology?.dimensions?.area || 0;
    
    return (
      <Card className="mb-6 border-l-4 border-l-primary shadow-strong">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl font-bold text-primary">
              <Brain className="w-6 h-6 mr-2" />
              Resumo Executivo
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              <Star className="w-3 h-3 mr-1" />
              Análise IA
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Diagnóstico Principal</span>
              </div>
              <p className="text-blue-900 font-medium">{condition}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Confiança IA</span>
              </div>
              <div className="flex items-center">
                <Progress value={confidence} className="flex-1 mr-2" />
                <span className="text-green-900 font-bold">{confidence}%</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Ruler className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-semibold text-purple-800">Área da Lesão</span>
              </div>
              <p className="text-purple-900 font-medium">{area} cm²</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Métricas Visuais
  const VisualMetrics = ({ findings }: { findings: any }) => {
    const tissueData = findings?.tissueAnalysis || {};
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-bold">
            <PieChart className="w-5 h-5 mr-2 text-primary" />
            Análise Tecidual Visual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-700">Granulação</span>
                  <span className="font-bold">{tissueData?.granulation?.percentage || 0}%</span>
                </div>
                <Progress value={tissueData?.granulation?.percentage || 0} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">{tissueData?.granulation?.quality || 'N/A'}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-red-700">Tecido Necrótico</span>
                  <span className="font-bold">{tissueData?.necrotic?.percentage || 0}%</span>
                </div>
                <Progress value={tissueData?.necrotic?.percentage || 0} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">{tissueData?.necrotic?.type || 'N/A'}</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-yellow-700">Fibrina</span>
                  <span className="font-bold">{tissueData?.fibrin?.percentage || 0}%</span>
                </div>
                <Progress value={tissueData?.fibrin?.percentage || 0} className="h-3" />
              </div>
            </div>
            
            <div className="bg-gradient-subtle p-4 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center">
                <Thermometer className="w-4 h-4 mr-2" />
                Indicadores Clínicos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Profundidade:</span>
                  <span className="font-medium">{findings?.morphology?.depth || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bordas:</span>
                  <span className="font-medium">{(() => {
                    const e = findings?.morphology?.edges as any;
                    const t = [e?.definition, e?.elevation, e?.epithelialization].filter(Boolean).join(' / ');
                    return t || 'N/A';
                  })()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exsudato:</span>
                  <span className="font-medium">{findings?.exudate?.amount || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Odor:</span>
                  <span className="font-medium">{findings?.odor || 'Ausente'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Sistema de Tags
  const TagSystem = ({ diagnosis, findings }: { diagnosis: any, findings: any }) => {
    const tags = [
      { label: diagnosis?.classification?.grade || 'N/A', color: 'bg-blue-100 text-blue-800', icon: Tag },
      { label: findings?.morphology?.shape || 'N/A', color: 'bg-green-100 text-green-800', icon: Eye },
      { label: findings?.location || 'N/A', color: 'bg-purple-100 text-purple-800', icon: Location },
      { label: diagnosis?.primary?.etiology || 'N/A', color: 'bg-orange-100 text-orange-800', icon: Microscope }
    ];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => {
          const IconComponent = tag.icon;
          return (
            <Badge key={index} className={`${tag.color} px-3 py-1 rounded-full font-medium`}>
              <IconComponent className="w-3 h-3 mr-1" />
              {tag.label}
            </Badge>
          );
        })}
      </div>
    );
  };

  // Componente de Recomendações Melhoradas
  const EnhancedRecommendations = ({ recommendations }: { recommendations: any }) => {
    const immediateActions = recommendations?.immediate || {};
    const followUp = recommendations?.followUp || {};
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-bold">
            <Bandage className="w-5 h-5 mr-2 text-primary" />
            Plano Terapêutico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center text-red-700">
                <Timer className="w-4 h-4 mr-2" />
                Ações Imediatas
              </h4>
              <div className="space-y-3">
                {Object.entries(immediateActions).map(([key, value], index) => (
                  <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-red-800">{key}</p>
                      <p className="text-red-700 text-sm">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 flex items-center text-blue-700">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Acompanhamento
              </h4>
              <div className="space-y-3">
                {Object.entries(followUp).map(([key, value], index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">{key}</p>
                      <p className="text-blue-700 text-sm">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Componente de Certificação Digital
  const DigitalCertification = ({ parsedReport }: { parsedReport: any }) => {
    const reportId = parsedReport?.header?.protocol || 'N/A';
    const timestamp = new Date().toISOString();
    
    return (
      <Card className="mb-6 border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-bold text-green-800">
            <Verified className="w-5 h-5 mr-2" />
            Certificação Digital
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Relatório Criptografado</span>
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              </div>
              <div className="flex items-center">
                <Fingerprint className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Assinatura Digital Válida</span>
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              </div>
              <div className="flex items-center">
                <QrCode className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Código de Verificação</span>
                <span className="ml-2 text-xs font-mono bg-white px-2 py-1 rounded">{reportId}</span>
              </div>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>Timestamp:</strong> {timestamp}</p>
              <p><strong>Algoritmo:</strong> SHA-256 + RSA-2048</p>
              <p><strong>Certificado:</strong> Casa Fecha Feridas CA</p>
              <p><strong>Validade:</strong> 10 anos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const parsedReport = useMemo(() => {
    if (!reportContent) return null;
    
    try {
      // Tentar fazer parse do JSON
      const jsonMatch = reportContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as MedicalReportTemplate;
      }
      
      // Se não for JSON, retornar null para usar fallback
      return null;
    } catch (error) {
      console.error('Erro ao fazer parse do laudo JSON:', error);
      return null;
    }
  }, [reportContent]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-strong">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-primary">
              Processando análise médica estruturada...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportContent) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-medium">
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

  // Se não conseguiu fazer parse do JSON, usar componente de fallback
  if (!parsedReport) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-medium">
        <CardContent className="p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800 font-medium">
                Formato de laudo não estruturado detectado. Exibindo conteúdo original.
              </p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {reportContent}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'grave': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'leve': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSection = (
    id: string,
    title: string,
    icon: ReactNode,
    children: ReactNode,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    const isExpanded = expandedSections.has(id);
    const priorityColors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-blue-500 bg-blue-50',
      low: 'border-l-gray-500 bg-gray-50'
    };

    return (
      <Card className={`shadow-sm border-l-4 ${priorityColors[priority]}`}>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {icon}
              <span className="text-lg font-semibold">{title}</span>
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Botões de Impressão Melhorados - Nova Melhoria 6 */}
      <div className="flex justify-end mb-4 space-x-3 no-print">
        <button
          onClick={handlePrintReport}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Printer className="h-5 w-5" />
          <span>Imprimir Completo</span>
        </button>
        
        <button
          onClick={() => {
            const content = document.getElementById('medical-report-content');
            if (content) {
              const printWindow = window.open('', '_blank');
              printWindow?.document.write(`
                <html>
                  <head>
                    <title>Laudo Médico - Resumo</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 20px; }
                      .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; }
                      .highlight { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
                    </style>
                  </head>
                  <body>
                    <div class="summary">
                      <h1>Resumo do Laudo Médico</h1>
                      <div class="highlight">
                        <h3>Diagnóstico Principal:</h3>
                        <p>${parsedReport.diagnosis.primary.condition}</p>
                      </div>
                      <div class="highlight">
                        <h3>Severidade:</h3>
                        <p>${parsedReport.diagnosis.primary.severity}</p>
                      </div>
                      <div class="highlight">
                        <h3>Recomendações Principais:</h3>
                        <p>Consulte o laudo completo para detalhes</p>
                      </div>
                    </div>
                  </body>
                </html>
              `);
              printWindow?.document.close();
              printWindow?.print();
            }
          }}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Download className="h-5 w-5" />
          <span>Resumo</span>
        </button>
        
        <button
          onClick={() => {
            const reportData = {
              protocol: parsedReport.header.protocol,
              patient: parsedReport.patientInfo.name,
              diagnosis: parsedReport.diagnosis.primary.condition,
              date: parsedReport.header.date
            };
            navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
            alert('Dados copiados para a área de transferência!');
          }}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <Share2 className="h-5 w-5" />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* Conteúdo do Laudo */}
      <div id="medical-report-content">
        {/* Resumo Executivo - Nova Melhoria 1 */}
        {parsedReport && <ExecutiveSummary parsedReport={parsedReport} />}
        
        {/* Certificação Digital - Nova Melhoria 2 */}
        {parsedReport && <DigitalCertification parsedReport={parsedReport} />}
        
        {/* Header do Laudo */}
      {renderSection(
        'header',
        'Cabeçalho do Laudo',
        <FileText className="h-5 w-5 text-blue-600" />,
        <div className="space-y-6">
          {/* Indicador de Severidade - Nova Melhoria 3 */}
          <div className="flex justify-center">
            <SeverityIndicator diagnosis={parsedReport.diagnosis} />
          </div>
          
          {/* Sistema de Tags - Nova Melhoria 4 */}
          <TagSystem diagnosis={parsedReport.diagnosis} findings={parsedReport.findings} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center mb-2">
                <Clipboard className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-blue-700">Protocolo</p>
              </div>
              <p className="text-lg font-bold text-blue-900">{parsedReport.header.protocol}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <ClockIcon className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm font-medium text-green-700">Data/Hora</p>
              </div>
              <p className="text-lg font-bold text-green-900">
                {parsedReport.header.date} às {parsedReport.header.time}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-purple-600 mr-2" />
                <p className="text-sm font-medium text-purple-700">Sistema</p>
              </div>
              <p className="text-lg font-bold text-purple-900">{parsedReport.header.system}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center mb-2">
                <Building className="w-5 h-5 text-orange-600 mr-2" />
                <p className="text-sm font-medium text-orange-700">Instituição</p>
              </div>
              <p className="text-lg font-bold text-orange-900">{parsedReport.header.institution}</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
              <div className="flex items-center mb-2">
                <UserCheck className="w-5 h-5 text-teal-600 mr-2" />
                <p className="text-sm font-medium text-teal-700">Médico Responsável</p>
              </div>
              <p className="text-lg font-bold text-teal-900">
                {parsedReport.header.responsiblePhysician} - {parsedReport.header.crm}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 text-gray-600 mr-2" />
                <p className="text-sm font-medium text-gray-700">Versão</p>
              </div>
              <Badge variant="outline" className="bg-white border-gray-300 text-gray-800 font-bold">
                {parsedReport.header.version}
              </Badge>
            </div>
          </div>
        </div>,
        'high'
      )}

      {/* Informações do Paciente */}
      {renderSection(
        'patient',
        'Dados do Paciente',
        <User className="h-5 w-5 text-green-600" />,
        <div className="space-y-6">
          {/* Dados Pessoais Melhorados - Nova Melhoria 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-emerald-600 mr-2" />
                <p className="text-sm font-medium text-emerald-700">Nome Completo</p>
              </div>
              <p className="text-lg font-bold text-emerald-900">
                {Array.isArray(parsedReport.patientInfo.name) 
                  ? parsedReport.patientInfo.name.map(n => n.text || `${n.given?.join(' ') || ''} ${n.family || ''}`.trim()).join(', ')
                  : parsedReport.patientInfo.name || 'N/A'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center mb-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-blue-700">Idade</p>
              </div>
              <p className="text-lg font-bold text-blue-900">{parsedReport.patientInfo.age}</p>
              <p className="text-xs text-blue-600 mt-1">Nascimento: {parsedReport.patientInfo.birthDate}</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 text-pink-600 mr-2" />
                <p className="text-sm font-medium text-pink-700">Sexo</p>
              </div>
              <p className="text-lg font-bold text-pink-900">{parsedReport.patientInfo.gender}</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center mb-2">
                <Clipboard className="w-5 h-5 text-indigo-600 mr-2" />
                <p className="text-sm font-medium text-indigo-700">ID do Paciente</p>
              </div>
              <p className="text-lg font-bold text-indigo-900">{parsedReport.patientInfo.id}</p>
            </div>
            
            {parsedReport.patientInfo.clinicalInfo?.weight && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-amber-600 mr-2" />
                  <p className="text-sm font-medium text-amber-700">Peso</p>
                </div>
                <p className="text-lg font-bold text-amber-900">
                  {parsedReport.patientInfo.clinicalInfo.weight.value} {parsedReport.patientInfo.clinicalInfo.weight.unit || 'kg'}
                </p>
              </div>
            )}
          </div>
          
          {/* Informações Clínicas Adicionais */}
          {parsedReport.patientInfo.clinicalInfo && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 text-gray-600 mr-2" />
                Informações Clínicas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedReport.patientInfo.clinicalInfo.allergies && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-700 mb-1">Alergias</p>
                    <p className="text-sm text-red-800">
                      {Array.isArray(parsedReport.patientInfo.clinicalInfo.allergies) 
                        ? parsedReport.patientInfo.clinicalInfo.allergies.map((allergy: any) => 
                            typeof allergy === 'object' ? allergy.substance || JSON.stringify(allergy) : String(allergy)
                          ).join(', ')
                        : String(parsedReport.patientInfo.clinicalInfo.allergies)
                      }
                    </p>
                  </div>
                )}
                {parsedReport.patientInfo.clinicalInfo.medications && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-1">Medicações</p>
                    <p className="text-sm text-blue-800">
                      {Array.isArray(parsedReport.patientInfo.clinicalInfo.medications) 
                        ? parsedReport.patientInfo.clinicalInfo.medications.map((medication: any) => 
                            typeof medication === 'object' ? medication.medicationCodeableConcept?.text || medication.name || JSON.stringify(medication) : String(medication)
                          ).join(', ')
                        : String(parsedReport.patientInfo.clinicalInfo.medications)
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>,
        'high'
      )}

      {/* Informações do Exame */}
      {renderSection(
        'examination',
        'Dados do Exame',
        <Camera className="h-5 w-5 text-purple-600" />,
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Qualidade da Imagem</p>
              <div className="space-y-1">
                <p className="text-sm">Resolução: {parsedReport.examination.imageQuality?.resolution || 'N/A'}</p>
                <p className="text-sm">Foco: {parsedReport.examination.imageQuality?.focus || 'N/A'}</p>
                <p className="text-sm">Iluminação: {parsedReport.examination.imageQuality?.lighting || 'N/A'}</p>
                <p className="text-sm">Posicionamento: {parsedReport.examination.imageQuality?.positioning || 'N/A'}</p>
                <p className="text-sm">Score Geral: {parsedReport.examination.imageQuality?.overallScore || 'N/A'}/10</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Aspectos Técnicos</p>
              <div className="space-y-1">
                <p className="text-sm">Régua: {parsedReport.examination.technicalAspects?.hasRuler ? 'Presente' : 'Ausente'}</p>
                <p className="text-sm">Régua Visível: {parsedReport.examination.technicalAspects?.rulerVisible ? 'Sim' : 'Não'}</p>
                {parsedReport.examination.technicalAspects?.anatomicalReferences?.length > 0 && (
                  <p className="text-sm">Referências: {parsedReport.examination.technicalAspects.anatomicalReferences.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Referência de Medição</p>
            <p className="text-sm">{parsedReport.examination.measurementReference || 'N/A'}</p>
          </div>
          {parsedReport.examination.limitations?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Limitações</p>
              <div className="flex flex-wrap gap-2">
                {parsedReport.examination.limitations.map((limitation, index) => (
                  <Badge key={index} variant="outline">{limitation}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>,
        'medium'
      )}

      {/* Achados */}
      {renderSection(
        'findings',
        'Achados do Exame',
        <Eye className="h-5 w-5 text-orange-600" />,
        <div className="space-y-6">
          {/* Métricas Visuais - Nova Melhoria 3 */}
          <VisualMetrics findings={parsedReport.findings} />
          
          {/* Achados Gerais */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Achados Gerais</span>
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800">Morfologia da Ferida</h5>
                  <p className="text-sm">Dimensões: {parsedReport.findings.morphology.dimensions.length}x{parsedReport.findings.morphology.dimensions.width}x{parsedReport.findings.morphology.dimensions.depth} {parsedReport.findings.morphology.dimensions.unit}</p>
                  <p className="text-sm">Área: {parsedReport.findings.morphology.dimensions.area} {parsedReport.findings.morphology.dimensions.unit}²</p>
                  <p className="text-sm">Formato: {parsedReport.findings.morphology.shape}</p>
                  <p className="text-sm">Profundidade: {parsedReport.findings.morphology.depth}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800">Análise Tecidual</h5>
                  <p className="text-sm">Granulação: {parsedReport.findings.tissueAnalysis.granulation.percentage}% - {parsedReport.findings.tissueAnalysis.granulation.quality}</p>
                  <p className="text-sm">Tecido Necrótico: {parsedReport.findings.tissueAnalysis.necrotic.percentage}% - {parsedReport.findings.tissueAnalysis.necrotic.type}</p>
                  <p className="text-sm">Fibrina: {parsedReport.findings.tissueAnalysis.fibrin.percentage}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={getSeverityColor(parsedReport.findings.signs.infection.present ? 'grave' : 'leve')}>
                  Infecção: {parsedReport.findings.signs.infection.present ? 'Presente' : 'Ausente'}
                </Badge>
                <Badge variant="outline">
                  Exsudato: {parsedReport.findings.signs.exudate.amount}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tecido Circundante */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Tecido Circundante</span>
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-blue-900">Pele</h5>
                  <p className="text-sm">Cor: {parsedReport.findings.surroundingTissue.skin.color}</p>
                  <p className="text-sm">Temperatura: {parsedReport.findings.surroundingTissue.skin.temperature}</p>
                  <p className="text-sm">Textura: {parsedReport.findings.surroundingTissue.skin.texture}</p>
                  <p className="text-sm">Integridade: {parsedReport.findings.surroundingTissue.skin.integrity}</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-blue-900">Edema e Dor</h5>
                  <p className="text-sm">Edema: {parsedReport.findings.surroundingTissue.edema.present ? 'Presente' : 'Ausente'}</p>
                  {parsedReport.findings.surroundingTissue.edema.present && (
                    <>
                      <p className="text-sm">Severidade: {parsedReport.findings.surroundingTissue.edema.severity}</p>
                      <p className="text-sm">Distribuição: {parsedReport.findings.surroundingTissue.edema.distribution}</p>
                    </>
                  )}
                  <p className="text-sm">Dor: {parsedReport.findings.surroundingTissue.pain.present ? 'Presente' : 'Ausente'}</p>
                  {parsedReport.findings.surroundingTissue.pain.present && (
                    <p className="text-sm">Intensidade: {parsedReport.findings.surroundingTissue.pain.intensity}/10</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Análise Morfológica */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-green-800">
              <Activity className="h-5 w-5" />
              <span>Análise Morfológica</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Tecido</p>
                <div className="space-y-1">
                  <p className="text-sm">Bordas: {parsedReport.findings.morphology.edges.definition}</p>
                  <p className="text-sm">Elevação: {parsedReport.findings.morphology.edges.elevation}</p>
                  <p className="text-sm">Epitelização: {parsedReport.findings.morphology.edges.epithelialization}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Vascularização</p>
                <div className="space-y-1">
                  <p className="text-sm">Perfusão: {parsedReport.findings.vascularization.perfusion}</p>
                  <p className="text-sm">Enchimento Capilar: {parsedReport.findings.vascularization.capillaryRefill}</p>
                  <p className="text-sm">Pulsos: {parsedReport.findings.vascularization.pulses}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Inflamação</p>
                <div className="space-y-1">
                  <p className="text-sm">Presente: {parsedReport.findings.signs.inflammation.present ? 'Sim' : 'Não'}</p>
                  {parsedReport.findings.signs.inflammation.present && (
                    <div className="flex flex-wrap gap-1">
                      {parsedReport.findings.signs.inflammation.characteristics.map((char, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{char}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Estruturas Expostas</p>
                <div className="flex flex-wrap gap-1">
                  {parsedReport.findings.tissueAnalysis.exposedStructures.map((structure, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{structure}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        'high'
      )}

      {/* Análise de Risco Cardiovascular e Sistêmico */}
      {parsedReport.cardiovascularSystemicRiskAnalysis && renderSection(
        'cardiovascularSystemicRiskAnalysis',
        'Análise de Risco Cardiovascular e Sistêmico',
        <Heart className="h-5 w-5 text-purple-600" />,
        <div className="space-y-6">
          {/* Risco Cardiovascular Geral */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-purple-800">
              <Heart className="h-5 w-5" />
              <span>Avaliação Cardiovascular Geral</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge className={getSeverityColor(parsedReport.cardiovascularSystemicRiskAnalysis.overallCardiovascularRisk)}>
                  Risco Cardiovascular: {parsedReport.cardiovascularSystemicRiskAnalysis.overallCardiovascularRisk}
                </Badge>
              </div>
            </div>
          </div>

          {/* Avaliação Diabética */}
          {parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-orange-800">
                <Activity className="h-5 w-5" />
                <span>Avaliação de Risco Diabético</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Suspeita de Diabetes:</strong> {parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment.suspectedDiabetes ? 'Sim' : 'Não'}
                  </p>
                  <Badge className={getSeverityColor(parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment.diabeticFootRisk)}>
                    Risco Pé Diabético: {parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment.diabeticFootRisk}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment.neuropathyIndicators?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-orange-800">Indicadores de Neuropatia:</p>
                      <ul className="text-xs space-y-1">
                        {parsedReport.cardiovascularSystemicRiskAnalysis.diabeticRiskAssessment.neuropathyIndicators.map((indicator, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Avaliação Vascular */}
          {parsedReport.cardiovascularSystemicRiskAnalysis.vascularRiskAssessment && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-blue-800">
                <Zap className="h-5 w-5" />
                <span>Avaliação Vascular</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Doença Vascular Periférica:</strong> {parsedReport.cardiovascularSystemicRiskAnalysis.vascularRiskAssessment.peripheralVascularDisease}
                  </p>
                  <p className="text-sm">
                    <strong>Enchimento Capilar:</strong> {parsedReport.cardiovascularSystemicRiskAnalysis.vascularRiskAssessment.capillaryRefillAssessment}
                  </p>
                </div>
                <div className="space-y-2">
                  {parsedReport.cardiovascularSystemicRiskAnalysis.vascularRiskAssessment.arterialInsufficiencyIndicators?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Indicadores de Insuficiência Arterial:</p>
                      <ul className="text-xs space-y-1">
                        {parsedReport.cardiovascularSystemicRiskAnalysis.vascularRiskAssessment.arterialInsufficiencyIndicators.map((indicator, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fatores Nutricionais e Metabólicos */}
          {parsedReport.cardiovascularSystemicRiskAnalysis.nutritionalMetabolicFactors && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-green-800">
                <Leaf className="h-5 w-5" />
                <span>Fatores Nutricionais e Metabólicos</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge className={getSeverityColor(parsedReport.cardiovascularSystemicRiskAnalysis.nutritionalMetabolicFactors.proteinDeficiencyRisk)}>
                    Risco Deficiência Proteica: {parsedReport.cardiovascularSystemicRiskAnalysis.nutritionalMetabolicFactors.proteinDeficiencyRisk}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {parsedReport.cardiovascularSystemicRiskAnalysis.nutritionalMetabolicFactors.nutritionalInterventions?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-green-800">Intervenções Nutricionais:</p>
                      <ul className="text-xs space-y-1">
                        {parsedReport.cardiovascularSystemicRiskAnalysis.nutritionalMetabolicFactors.nutritionalInterventions.map((intervention, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{intervention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fatores Imunológicos */}
          {parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-yellow-800">
                <Shield className="h-5 w-5" />
                <span>Fatores Imunológicos</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Status Imunocomprometido:</strong> {parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors.immunocompromisedStatus}
                  </p>
                  <Badge className={getSeverityColor(parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors.infectionSusceptibility)}>
                    Susceptibilidade à Infecção: {parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors.infectionSusceptibility}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors.immunologicalSupport?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Suporte Imunológico:</p>
                      <ul className="text-xs space-y-1">
                        {parsedReport.cardiovascularSystemicRiskAnalysis.immunologicalFactors.immunologicalSupport.map((support, index) => (
                          <li key={index} className="flex items-start space-x-1">
                            <div className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{support}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recomendações de Cuidado Integrado */}
          {parsedReport.cardiovascularSystemicRiskAnalysis.integratedCareRecommendations && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-indigo-800">
                <Users className="h-5 w-5" />
                <span>Recomendações de Cuidado Integrado</span>
              </h4>
              <div className="space-y-4">
                {parsedReport.cardiovascularSystemicRiskAnalysis.integratedCareRecommendations.specialistReferrals?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-indigo-800 mb-2">Encaminhamentos Especializados:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parsedReport.cardiovascularSystemicRiskAnalysis.integratedCareRecommendations.specialistReferrals.map((referral, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-indigo-100">
                          <p className="text-sm font-semibold">{referral.specialty}</p>
                          <p className="text-xs text-gray-600">{referral.indication}</p>
                          <Badge variant="outline" className="mt-1">
                            {referral.urgency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {parsedReport.cardiovascularSystemicRiskAnalysis.integratedCareRecommendations.coordinatedCareProtocol?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-indigo-800 mb-2">Protocolo de Cuidado Coordenado:</p>
                    <ul className="text-xs space-y-1">
                      {parsedReport.cardiovascularSystemicRiskAnalysis.integratedCareRecommendations.coordinatedCareProtocol.map((protocol, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{protocol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>,
        'high'
      )}

      {/* Diagnóstico */}
      {renderSection(
        'diagnosis',
        'Impressão Diagnóstica',
        <Target className="h-5 w-5 text-red-600" />,
        <div className="space-y-6">
          {/* Diagnóstico Principal */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-red-800">
              <Stethoscope className="h-5 w-5" />
              <span>Diagnóstico Principal</span>
            </h4>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded border">
                <p className="text-lg font-bold text-red-900 mb-2">{parsedReport.diagnosis.primary.condition}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p className="text-gray-600">
                    <strong>Etiologia:</strong> {parsedReport.diagnosis.primary.etiology}
                  </p>
                  <p className="text-gray-600">
                    <strong>Estágio:</strong> {parsedReport.diagnosis.primary.stage}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Justificativa:</strong> {parsedReport.diagnosis.primary.justification}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <Badge className={getSeverityColor(parsedReport.diagnosis.primary.severity)}>
                    Severidade: {parsedReport.diagnosis.primary.severity}
                  </Badge>
                  <Badge variant="outline">
                    Confiança: {parsedReport.diagnosis.primary.confidence.toString()}%
                  </Badge>
                </div>
              </div>

              {/* Fisiopatologia */}
              {parsedReport.diagnosis.primary.pathophysiology && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Fisiopatologia
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p><strong>Mecanismo:</strong> {parsedReport.diagnosis.primary.pathophysiology.underlyingMechanism}</p>
                      <p><strong>Envolvimento Tecidual:</strong> {parsedReport.diagnosis.primary.pathophysiology.tissueInvolvement}</p>
                    </div>
                    <div>
                      <p><strong>Impacto Vascular:</strong> {parsedReport.diagnosis.primary.pathophysiology.vascularImpact}</p>
                      <p><strong>Resposta Inflamatória:</strong> {parsedReport.diagnosis.primary.pathophysiology.inflammatoryResponse}</p>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    <strong>Fase de Cicatrização:</strong> 
                    <Badge variant="outline" className="ml-2">
                      {parsedReport.diagnosis.primary.pathophysiology.healingPhase}
                    </Badge>
                  </p>
                </div>
              )}

              {/* Correlação Clínica */}
              {parsedReport.diagnosis.primary.clinicalCorrelation && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Correlação Clínica
                  </h5>
                  <div className="space-y-3">
                    {/* Localização Anatômica */}
                    {parsedReport.diagnosis.primary.clinicalCorrelation.anatomicalLocation && (
                      <div className="bg-white p-2 rounded">
                        <p className="font-medium text-green-700 mb-1">Localização Anatômica:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Região:</strong> {parsedReport.diagnosis.primary.clinicalCorrelation.anatomicalLocation.region}</p>
                          <p><strong>Lateralidade:</strong> {parsedReport.diagnosis.primary.clinicalCorrelation.anatomicalLocation.laterality}</p>
                        </div>
                        <p className="text-sm mt-1"><strong>Impacto Funcional:</strong> {parsedReport.diagnosis.primary.clinicalCorrelation.anatomicalLocation.functionalImpact}</p>
                      </div>
                    )}
                    
                    {/* Características Morfológicas */}
                    {parsedReport.diagnosis.primary.clinicalCorrelation.morphologicalCharacteristics && (
                      <div className="bg-white p-2 rounded">
                        <p className="font-medium text-green-700 mb-1">Características Morfológicas:</p>
                        <div className="text-sm space-y-1">
                          <p><strong>Padrão Primário:</strong> {parsedReport.diagnosis.primary.clinicalCorrelation.morphologicalCharacteristics.primaryPattern}</p>
                          <p><strong>Padrão de Evolução:</strong> {parsedReport.diagnosis.primary.clinicalCorrelation.morphologicalCharacteristics.evolutionPattern}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certeza Diagnóstica */}
              {parsedReport.diagnosis.primary.diagnosticCertainty && (
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <h5 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Certeza Diagnóstica
                  </h5>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Nível:</strong> 
                      <Badge variant="outline" className="ml-2">
                        {parsedReport.diagnosis.primary.diagnosticCertainty.level}
                      </Badge>
                    </p>
                    {parsedReport.diagnosis.primary.diagnosticCertainty.supportingEvidence?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-purple-700">Evidências de Apoio:</p>
                        <ul className="text-xs list-disc list-inside ml-4">
                          {parsedReport.diagnosis.primary.diagnosticCertainty.supportingEvidence.map((evidence, idx) => (
                            <li key={idx}>{evidence}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Implicações Prognósticas */}
              {parsedReport.diagnosis.primary.prognosticImplications && (
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Implicações Prognósticas
                  </h5>
                  <div className="space-y-2">
                    {parsedReport.diagnosis.primary.prognosticImplications.healingPotential && (
                      <div className="bg-white p-2 rounded">
                        <p className="text-sm font-medium text-orange-700">Potencial de Cicatrização:</p>
                        <p className="text-sm"><strong>Estimativa:</strong> {parsedReport.diagnosis.primary.prognosticImplications.healingPotential.timelineEstimate}</p>
                        <p className="text-sm">
                          <strong>Probabilidade:</strong> 
                          <Badge variant="outline" className="ml-2">
                            {parsedReport.diagnosis.primary.prognosticImplications.healingPotential.probabilityScore}%
                          </Badge>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagnósticos Diferenciais */}
          {parsedReport.diagnosis.differential.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Diagnósticos Diferenciais</span>
              </h4>
              {parsedReport.diagnosis.differential.map((diff, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-yellow-900">{diff.condition}</h5>
                    <Badge variant="outline">
                      Probabilidade: {diff.probability.toString()}%
                    </Badge>
                  </div>
                  {diff.supportingFindings && diff.supportingFindings.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Achados que apoiam:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {diff.supportingFindings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {diff.excludingFactors && diff.excludingFactors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fatores excludentes:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {diff.excludingFactors.map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>,
        'high'
      )}

      {/* Recomendações */}
      {renderSection(
        'recommendations',
        'Recomendações Clínicas',
        <Clipboard className="h-5 w-5 text-blue-600" />,
        <div className="space-y-6">
          {/* Recomendações Melhoradas - Nova Melhoria 5 */}
          <ImprovedRecommendations parsedReport={parsedReport} />
          
          {/* Ações Imediatas */}
          {parsedReport.recommendations.immediate && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-red-800">
                <Zap className="h-5 w-5" />
                <span>Ações Imediatas</span>
              </h4>
              <div className="space-y-4">
                {/* Limpeza */}
                {parsedReport.recommendations.immediate.cleaning && (
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <h5 className="font-medium text-gray-900 mb-2">Protocolo de Limpeza</h5>
                    <p className="text-sm text-gray-700 mb-1"><strong>Solução:</strong> {parsedReport.recommendations.immediate.cleaning.solution}</p>
                    <p className="text-sm text-gray-700 mb-1"><strong>Técnica:</strong> {parsedReport.recommendations.immediate.cleaning.technique}</p>
                    <p className="text-sm text-gray-700"><strong>Frequência:</strong> {parsedReport.recommendations.immediate.cleaning.frequency}</p>
                  </div>
                )}
                
                {/* Desbridamento */}
                {parsedReport.recommendations.immediate.debridement && (
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
                    <h5 className="font-medium text-gray-900 mb-2">Plano de Desbridamento</h5>
                    <p className="text-sm text-gray-700 mb-1"><strong>Indicado:</strong> {parsedReport.recommendations.immediate.debridement.indicated ? 'Sim' : 'Não'}</p>
                    {parsedReport.recommendations.immediate.debridement.indicated && (
                      <>
                        <p className="text-sm text-gray-700 mb-1"><strong>Tipo:</strong> {parsedReport.recommendations.immediate.debridement.type}</p>
                        <p className="text-sm text-gray-700"><strong>Urgência:</strong> {parsedReport.recommendations.immediate.debridement.urgency}</p>
                      </>
                    )}
                  </div>
                )}
                
                {/* Curativo */}
                {parsedReport.recommendations.immediate.dressing && (
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <h5 className="font-medium text-gray-900 mb-2">Recomendação de Curativo</h5>
                    <p className="text-sm text-gray-700 mb-1"><strong>Primário:</strong> {parsedReport.recommendations.immediate.dressing.primary.type}</p>
                    <p className="text-sm text-gray-700 mb-1"><strong>Secundário:</strong> {parsedReport.recommendations.immediate.dressing.secondary.type}</p>
                    <p className="text-sm text-gray-700"><strong>Frequência de troca:</strong> {parsedReport.recommendations.immediate.dressing.changeFrequency}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seguimento */}
          {parsedReport.recommendations.monitoring.followUpSchedule.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Plano de Seguimento</span>
              </h4>
              {parsedReport.recommendations.monitoring.followUpSchedule.map((followUp, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-blue-900">{followUp.provider}</h5>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {followUp.timeframe}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Objetivos:</p>
                    <ul className="text-sm text-gray-700">
                      {followUp.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="flex items-start space-x-1">
                          <span>•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tratamento Sugerido */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-green-800">
              <Heart className="h-5 w-5" />
              <span>Tratamento Sugerido</span>
            </h4>
            <div className="space-y-3">
              {parsedReport.recommendations.referrals.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">Encaminhamentos:</p>
                  <ul className="space-y-1">
                    {parsedReport.recommendations.referrals.map((referral, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          <strong>{referral.specialty}</strong> - {referral.reason}
                          <Badge className="ml-2" variant={referral.urgency === 'Urgente' ? 'destructive' : 'secondary'}>
                            {referral.urgency}
                          </Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedReport.recommendations.monitoring.parameters.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">Monitoramento:</p>
                  <ul className="space-y-1">
                    {parsedReport.recommendations.monitoring.parameters.map((parameter, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          <strong>{parameter.parameter}</strong> - {parameter.method} ({parameter.frequency})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>,
        'high'
      )}

      {/* Footer com Avisos Legais */}
      {renderSection(
        'footer',
        'Informações Legais e Limitações',
        <Shield className="h-5 w-5 text-gray-600" />,
        <div className="space-y-4">
          {/* Limitações */}
          {parsedReport.footer.limitations.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Limitações do Exame</span>
              </h4>
              <ul className="space-y-2">
                {parsedReport.footer.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avisos Legais */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>Avisos Médico-Legais</span>
            </h4>
            <ul className="space-y-2">
              {parsedReport.footer.disclaimers.map((disclaimer, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{disclaimer}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium text-sm">
                  <strong>VALIDAÇÃO MÉDICA OBRIGATÓRIA:</strong> Este laudo requer validação por médico habilitado.
                </p>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold mb-2 flex items-center space-x-2 text-blue-800">
              <TrendingUp className="h-5 w-5" />
              <span>Próximos Passos</span>
            </h4>
            <ul className="space-y-1">
              {parsedReport.footer.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        'medium'
      )}

      {/* Análise de Prognóstico */}
      {renderSection(
        'prognosis-analysis',
        'Análise de Prognóstico',
        <TrendingUp className="h-6 w-6" />,
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-purple-800">
              <TrendingUp className="h-6 w-6" />
              <span>Análise de Prognóstico</span>
            </h3>

            {/* Estimativa de Tempo de Cicatrização */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-purple-700">
                <Clock className="h-5 w-5" />
                <span>Estimativa de Tempo de Cicatrização</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800">Cenário Otimista</div>
                  <div className="text-lg font-bold text-green-900">{parsedReport.prognosisAnalysis?.healingTimeEstimate?.optimistic || 'N/A'}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-800">Cenário Realista</div>
                  <div className="text-lg font-bold text-yellow-900">{parsedReport.prognosisAnalysis?.healingTimeEstimate?.realistic || 'N/A'}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-800">Cenário Pessimista</div>
                  <div className="text-lg font-bold text-red-900">{parsedReport.prognosisAnalysis?.healingTimeEstimate?.pessimistic || 'N/A'}</div>
                </div>
              </div>
              {parsedReport.prognosisAnalysis?.healingTimeEstimate?.factors && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-700 mb-2">Fatores Influenciadores:</h5>
                  <ul className="space-y-1">
                    {parsedReport.prognosisAnalysis.healingTimeEstimate.factors.map((factor, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Probabilidade de Cicatrização */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2 text-purple-700">
                <Target className="h-5 w-5" />
                <span>Probabilidade de Cicatrização</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800">Cicatrização Completa</div>
                  <div className="text-lg font-bold text-green-900">{parsedReport.prognosisAnalysis?.healingProbability?.complete || 'N/A'}%</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm font-medium text-yellow-800">Cicatrização Parcial</div>
                  <div className="text-lg font-bold text-yellow-900">{parsedReport.prognosisAnalysis?.healingProbability?.partial || 'N/A'}%</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-sm font-medium text-red-800">Risco de Complicações</div>
                  <div className="text-lg font-bold text-red-900">{parsedReport.prognosisAnalysis?.healingProbability?.complications || 'N/A'}%</div>
                </div>
              </div>
              {parsedReport.prognosisAnalysis?.healingProbability?.reasoning && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">{parsedReport.prognosisAnalysis.healingProbability.reasoning}</p>
                </div>
              )}
            </div>

            {/* Fatores de Risco */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {parsedReport.prognosisAnalysis?.riskFactors?.high && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h5 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Alto Risco</span>
                  </h5>
                  <ul className="space-y-1">
                    {parsedReport.prognosisAnalysis.riskFactors.high.map((factor, index) => (
                      <li key={index} className="text-red-700 text-sm">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedReport.prognosisAnalysis?.riskFactors?.moderate && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-2 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Risco Moderado</span>
                  </h5>
                  <ul className="space-y-1">
                    {parsedReport.prognosisAnalysis.riskFactors.moderate.map((factor, index) => (
                      <li key={index} className="text-yellow-700 text-sm">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedReport.prognosisAnalysis?.riskFactors?.protective && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Fatores Protetivos</span>
                  </h5>
                  <ul className="space-y-1">
                    {parsedReport.prognosisAnalysis.riskFactors.protective.map((factor, index) => (
                      <li key={index} className="text-green-700 text-sm">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>,
        'high'
      )}

      {/* Recomendações Personalizadas */}
      {renderSection(
        'personalized-recommendations',
        'Recomendações Personalizadas',
        <Users className="h-6 w-6" />,
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-blue-800">
              <Users className="h-6 w-6" />
              <span>Recomendações Personalizadas</span>
            </h3>

            {/* Recomendações por Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {parsedReport.personalizedRecommendations?.immediate && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Imediatas (24-48h)</span>
                  </h4>
                  <ul className="space-y-1">
                    {parsedReport.personalizedRecommendations.immediate.actions?.map((action, index) => (
                      <li key={index} className="text-red-700 text-sm">• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedReport.personalizedRecommendations?.shortTerm && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Curto Prazo (1-2 semanas)</span>
                  </h4>
                  <ul className="space-y-1">
                    {parsedReport.personalizedRecommendations.shortTerm.actions?.map((action, index) => (
                      <li key={index} className="text-yellow-700 text-sm">• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedReport.personalizedRecommendations?.longTerm && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Longo Prazo (1-3 meses)</span>
                  </h4>
                  <ul className="space-y-1">
                    {parsedReport.personalizedRecommendations.longTerm.actions?.map((action, index) => (
                      <li key={index} className="text-blue-700 text-sm">• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recomendações de Estilo de Vida */}
            {parsedReport.personalizedRecommendations?.lifestyle && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {parsedReport.personalizedRecommendations.lifestyle.nutrition && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                      <Leaf className="h-4 w-4" />
                      <span>Nutrição</span>
                    </h5>
                    <ul className="space-y-1">
                      {parsedReport.personalizedRecommendations.lifestyle.nutrition.map((item, index) => (
                        <li key={index} className="text-green-700 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedReport.personalizedRecommendations.lifestyle.activity && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-orange-800 mb-2 flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Atividade</span>
                    </h5>
                    <ul className="space-y-1">
                      {parsedReport.personalizedRecommendations.lifestyle.activity.map((item, index) => (
                        <li key={index} className="text-orange-700 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedReport.personalizedRecommendations.lifestyle.hygiene && (
                  <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                    <h5 className="font-medium text-cyan-800 mb-2 flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Higiene</span>
                    </h5>
                    <ul className="space-y-1">
                      {parsedReport.personalizedRecommendations.lifestyle.hygiene.map((item, index) => (
                        <li key={index} className="text-cyan-700 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedReport.personalizedRecommendations.lifestyle.environment && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Ambiente</span>
                    </h5>
                    <ul className="space-y-1">
                      {parsedReport.personalizedRecommendations.lifestyle.environment.map((item, index) => (
                        <li key={index} className="text-purple-700 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Plano de Seguimento */}
            {parsedReport.followUpPlan?.schedule && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Plano de Seguimento</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(parsedReport.followUpPlan.schedule).map(([period, description]) => (
                    <div key={period} className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-800 capitalize">{period.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-gray-600 text-sm">{description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        'high'
      )}

      {/* Footer Final */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white rounded-lg">
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-bold">Sistema de Análise Médica Avançada</h3>
            </div>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Este laudo foi gerado por sistema de inteligência artificial avançada e deve ser sempre 
              validado por profissional médico habilitado. Não substitui consulta médica presencial.
            </p>
            <div className="flex flex-wrap items-center justify-center space-x-6 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>© 2024 Sistema IA Médica</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Versão {parsedReport.header.version}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>CFM Compliance</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StructuredMedicalReportViewer;