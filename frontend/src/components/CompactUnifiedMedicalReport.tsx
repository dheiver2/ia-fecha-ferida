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
  Printer
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
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-semibold">Gerando laudo médico...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!parsedReport) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Erro ao processar o relatório médico</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="compact-unified-report w-full max-w-4xl mx-auto space-y-4">
      {/* Cabeçalho do Laudo */}
      <Card className="gradient-header border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl text-primary">LAUDO MÉDICO</CardTitle>
                <p className="text-sm text-muted-foreground">Análise por Inteligência Artificial</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                {parsedReport.header.version}
              </Badge>
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informações Principais - Layout Compacto */}
      <Card>
        <CardContent className="p-6">
          <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Dados do Paciente */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <User className="h-4 w-4" />
                <span>Paciente</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {Array.isArray(parsedReport.patientInfo.name) 
                    ? parsedReport.patientInfo.name.map(n => n.text || `${n.given?.join(' ') || ''} ${n.family || ''}`.trim()).join(', ')
                    : parsedReport.patientInfo.name || patientData?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {parsedReport.patientInfo.age || patientData?.age || 'N/A'} • {parsedReport.patientInfo.gender || patientData?.gender || 'N/A'}
                </p>
              </div>
            </div>

            {/* Data e Protocolo */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Exame</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">
                  {patientData?.protocol || `CFI-${Date.now().toString().slice(-8)}`}
                </p>
              </div>
            </div>

            {/* Qualidade da Imagem */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <Eye className="h-4 w-4" />
                <span>Qualidade</span>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {parsedReport.examination?.imageQuality?.resolution || 'Boa'}
                </p>
                <p className="text-sm text-gray-600">
                  Score: {parsedReport.examination?.imageQuality?.overallScore || 8}/10
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span>Status</span>
              </div>
              <div className="space-y-1">
                <Badge className={getUrgencyColor('normal')}>
                  Concluído
                </Badge>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnóstico Principal - Destaque */}
          <div className="diagnosis-section bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Impressão Diagnóstica</h3>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-red-900">
                {parsedReport.diagnosis?.primary?.condition || 'Análise em andamento'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Etiologia:</strong> {parsedReport.diagnosis?.primary?.etiology || 'A determinar'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Estágio:</strong> {parsedReport.diagnosis?.primary?.stage || 'Em avaliação'}
              </p>
            </div>
          </div>

          {/* Achados Principais - Resumo */}
          <div className="findings-section grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Características Morfológicas</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Dimensões:</strong> {parsedReport.findings?.morphology?.dimensions?.length || 'N/A'} x {parsedReport.findings?.morphology?.dimensions?.width || 'N/A'} cm</p>
                <p><strong>Profundidade:</strong> {parsedReport.findings?.morphology?.depth || 'N/A'}</p>
                <p><strong>Bordas:</strong> {parsedReport.findings?.morphology?.edges?.definition || 'N/A'}</p>
                <p><strong>Formato:</strong> {parsedReport.findings?.morphology?.shape || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Recomendações Imediatas</h4>
              </div>
              <div className="space-y-2 text-sm">
                {parsedReport.recommendations?.immediate ? (
                  <>
                    {parsedReport.recommendations.immediate.cleaning && (
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Limpeza: {parsedReport.recommendations.immediate.cleaning.solution}</span>
                      </div>
                    )}
                    {parsedReport.recommendations.immediate.dressing && (
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Curativo: {parsedReport.recommendations.immediate.dressing.primary.type}</span>
                      </div>
                    )}
                    {parsedReport.recommendations.immediate.debridement?.indicated && (
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>Desbridamento: {parsedReport.recommendations.immediate.debridement.type}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p>Seguir protocolo padrão de cuidados com feridas</p>
                )}
              </div>
            </div>
          </div>

          {/* Botão para Detalhes Completos */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="details-toggle w-full no-print"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Ocultar Detalhes Completos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Ver Detalhes Completos
                </>
              )}
            </Button>
          </div>

          {/* Seção de Detalhes Expandida */}
          {showDetails && (
            <div className="expanded-details mt-6 space-y-6 border-t pt-6">
              {/* Análise Detalhada */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span>Análise Detalhada</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Análise Tecidual</h5>
                    <div className="text-sm space-y-1">
                      <p><strong>Granulação:</strong> {parsedReport.findings?.tissueAnalysis?.granulation?.percentage || 'N/A'}%</p>
                      <p><strong>Tecido Necrótico:</strong> {parsedReport.findings?.tissueAnalysis?.necrotic?.percentage || 'N/A'}%</p>
                      <p><strong>Fibrina:</strong> {parsedReport.findings?.tissueAnalysis?.fibrin?.percentage || 'N/A'}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Sinais Clínicos</h5>
                    <div className="text-sm space-y-1">
                      <p><strong>Infecção:</strong> {parsedReport.findings?.signs?.infection?.present ? 'Presente' : 'Ausente'}</p>
                      <p><strong>Inflamação:</strong> {parsedReport.findings?.signs?.inflammation?.present ? 'Presente' : 'Ausente'}</p>
                      <p><strong>Exsudato:</strong> {parsedReport.findings?.signs?.exudate?.amount || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendações Completas */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center space-x-2">
                  <Clipboard className="h-5 w-5 text-primary" />
                  <span>Plano de Tratamento</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Encaminhamentos</h5>
                    <div className="space-y-2">
                      {parsedReport.recommendations?.referrals?.map((referral, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {referral.urgency}
                          </Badge>
                          <span>{referral.specialty}</span>
                        </div>
                      )) || <p className="text-sm text-gray-600">Nenhum encaminhamento específico</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-700">Monitoramento</h5>
                    <div className="space-y-2">
                      {parsedReport.recommendations?.monitoring?.parameters?.map((param, index) => (
                        <div key={index} className="text-sm">
                          <p><strong>{param.parameter}:</strong> {param.frequency}</p>
                        </div>
                      )) || <p className="text-sm text-gray-600">Seguimento padrão</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Compacto */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{parsedReport.header.institution}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserCheck className="h-4 w-4" />
                <span>{parsedReport.header.responsiblePhysician}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Validação médica necessária</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactUnifiedMedicalReport;