import React, { useState, useMemo } from 'react';
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
  Download,
  TrendingUp,
  Zap,
  Sparkles,
  AlertCircle,
  Info,
  ArrowRight,
  Layers,
  Microscope,
  ThermometerSun,
  Droplets,
  CircleDot,
  BarChart3,
  PieChart,
  Copy,
  ExternalLink
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

// Componente de Métrica Visual Circular
const CircularProgress = ({ value, label, color, size = 80 }: { value: number; label: string; color: string; size?: number }) => {
  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-gray-200 dark:text-gray-700" />
          <circle 
            cx="40" cy="40" r="35" 
            stroke={color} 
            strokeWidth="6" 
            fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2 text-center">{label}</span>
    </div>
  );
};

// Componente de Card de Estatística
const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${color} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold">{value}</p>
        {trend && <p className="text-xs flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
      </div>
      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// Componente de Timeline
const TimelineItem = ({ icon: Icon, title, description, status, isLast }: { icon: any; title: string; description: string; status: 'done' | 'current' | 'pending'; isLast?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`p-2 rounded-full ${
        status === 'done' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
        status === 'current' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/20' :
        'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      {!isLast && <div className={`w-0.5 h-full min-h-8 mt-2 ${status === 'done' ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-gray-200 dark:bg-gray-700'}`} />}
    </div>
    <div className="pb-6">
      <h4 className={`font-semibold ${status === 'pending' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

export const CompactUnifiedMedicalReport: React.FC<CompactUnifiedMedicalReportProps> = ({ 
  reportContent, 
  isLoading = false,
  patientData,
  onPrint
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'treatment'>('overview');
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    const summary = `Laudo: ${parsedReport?.diagnosis?.primary?.condition}\nPaciente: ${parsedReport?.patientInfo?.name || 'N/A'}\nData: ${parsedReport?.header?.date}\nProtocolo: ${parsedReport?.header?.protocol}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Animação de Loading Melhorada */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse scale-150"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
                <div className="relative">
                  <Brain className="h-16 w-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" style={{ fill: 'url(#gradient)' }} />
                  <svg className="absolute inset-0 w-16 h-16 animate-spin" style={{ animationDuration: '3s' }}>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analisando com IA Avançada
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Nossa inteligência artificial está processando a imagem com precisão médica...
              </p>
            </div>

            {/* Progress Steps */}
            <div className="w-full max-w-md space-y-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-500" /> Imagem recebida</span>
                <span className="flex items-center gap-1 text-blue-500 animate-pulse"><Zap className="w-3 h-3" /> Processando...</span>
                <span className="text-gray-300 dark:text-gray-600">Gerando laudo</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '66%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!parsedReport) {
    return (
      <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-red-900 dark:text-red-100">Não foi possível processar o laudo</h3>
              <p className="text-red-700 dark:text-red-300 max-w-md text-sm">
                A imagem pode estar em baixa resolução ou formato incompatível. Tente enviar uma nova foto com melhor iluminação.
              </p>
            </div>
            <Button variant="outline" className="mt-4 border-red-200 text-red-700 hover:bg-red-50">
              <ArrowRight className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'grave':
      case 'severo':
      case 'crítico':
        return { bg: 'bg-red-500', text: 'text-white', badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
      case 'moderado':
      case 'moderada':
        return { bg: 'bg-orange-500', text: 'text-white', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' };
      case 'leve':
        return { bg: 'bg-yellow-500', text: 'text-white', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      default:
        return { bg: 'bg-emerald-500', text: 'text-white', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' };
    }
  };

  const severityColors = getSeverityColor(parsedReport.diagnosis?.primary?.severity);
  const confidence = parsedReport.diagnosis?.primary?.confidence || 85;

  return (
    <div className="compact-unified-report w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Header - Design Moderno */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-xl overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        {/* Severity Indicator Bar */}
        <div className={`h-1.5 w-full ${severityColors.bg}`}></div>
        
        <CardHeader className="relative pb-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Logo e Título */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Microscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Laudo Médico Inteligente
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md">
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA v4.0
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Análise dermatológica avançada com inteligência artificial
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                {copied ? <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPrint}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-0">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
            <StatCard 
              icon={User} 
              label="Paciente" 
              value={Array.isArray(parsedReport.patientInfo?.name) 
                ? parsedReport.patientInfo.name[0]?.text?.split(' ')[0] || 'N/A'
                : (parsedReport.patientInfo?.name as string)?.split(' ')[0] || patientData?.name?.split(' ')[0] || 'N/A'}
              color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            />
            <StatCard 
              icon={Calendar} 
              label="Data" 
              value={parsedReport.header?.date || new Date().toLocaleDateString('pt-BR')}
              color="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
            />
            <StatCard 
              icon={Target} 
              label="Confiança IA" 
              value={`${confidence}%`}
              trend="Alta precisão"
              color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            />
            <StatCard 
              icon={Activity} 
              label="Severidade" 
              value={parsedReport.diagnosis?.primary?.severity || 'Moderado'}
              color={`bg-gradient-to-br ${parsedReport.diagnosis?.primary?.severity?.toLowerCase() === 'grave' ? 'from-red-500 to-red-600' : 'from-orange-500 to-orange-600'} text-white`}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Eye },
              { id: 'analysis', label: 'Análise Detalhada', icon: BarChart3 },
              { id: 'treatment', label: 'Tratamento', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagnóstico Principal - Card Destacado */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50/30 dark:from-gray-900 dark:to-red-950/10 overflow-hidden h-full">
              <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Impressão Diagnóstica</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Análise principal da lesão</p>
                    </div>
                  </div>
                  <Badge className={severityColors.badge}>
                    {parsedReport.diagnosis?.primary?.severity || 'Moderado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {parsedReport.diagnosis?.primary?.condition || 'Análise em andamento'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                        <Layers className="w-3 h-3" /> Etiologia
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{parsedReport.diagnosis?.primary?.etiology || 'A determinar'}</span>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                        <TrendingUp className="w-3 h-3" /> Estágio
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">{parsedReport.diagnosis?.primary?.stage || 'Em avaliação'}</span>
                    </div>
                  </div>

                  {parsedReport.diagnosis?.primary?.justification && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mt-0.5">
                          <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Justificativa da IA</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{parsedReport.diagnosis.primary.justification}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confidence Meter */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Índice de Confiança da Análise</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{confidence}%</span>
                  </div>
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000"
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise de Tecido - Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow">
                    <PieChart className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Composição Tecidual</h4>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="flex justify-around mb-6">
                  <CircularProgress 
                    value={parsedReport.findings?.tissueAnalysis?.granulation?.percentage || 0} 
                    label="Granulação" 
                    color="#ef4444"
                  />
                  <CircularProgress 
                    value={parsedReport.findings?.tissueAnalysis?.necrotic?.percentage || 0} 
                    label="Necrose" 
                    color="#374151"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                    <span className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <Droplets className="w-4 h-4" /> Fibrina
                    </span>
                    <span className="font-bold text-yellow-600">{parsedReport.findings?.tissueAnalysis?.fibrin?.percentage || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <span className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                      <ThermometerSun className="w-4 h-4" /> Epitelização
                    </span>
                    <span className="font-bold text-blue-600">{parsedReport.findings?.tissueAnalysis?.epithelization?.percentage || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Protocolo</span>
                    <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      #{parsedReport.header?.protocol || 'N/A'}
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Dimensões</span>
                    <span className="font-medium">{parsedReport.findings?.morphology?.dimensions?.length || '-'}x{parsedReport.findings?.morphology?.dimensions?.width || '-'} cm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Profundidade</span>
                    <span className="font-medium">{parsedReport.findings?.morphology?.depth || 'Superficial'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Morfologia */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Análise Morfológica</h4>
                  <p className="text-sm text-gray-500">Características físicas da lesão</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {[
                  { label: 'Dimensões', value: `${parsedReport.findings?.morphology?.dimensions?.length || '-'} x ${parsedReport.findings?.morphology?.dimensions?.width || '-'} cm`, icon: Layers },
                  { label: 'Área', value: `${parsedReport.findings?.morphology?.dimensions?.area || '-'} cm²`, icon: CircleDot },
                  { label: 'Profundidade', value: parsedReport.findings?.morphology?.depth || '-', icon: Layers },
                  { label: 'Bordas', value: parsedReport.findings?.morphology?.edges?.definition || '-', icon: CircleDot },
                  { label: 'Formato', value: parsedReport.findings?.morphology?.shape || '-', icon: Target }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:shadow-md transition-all">
                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sinais Clínicos */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Sinais Clínicos</h4>
                  <p className="text-sm text-gray-500">Indicadores de alerta</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border-2 ${
                  parsedReport.findings?.signs?.infection?.present 
                    ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800' 
                    : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <AlertTriangle className={`w-4 h-4 ${parsedReport.findings?.signs?.infection?.present ? 'text-red-500' : 'text-emerald-500'}`} />
                      Infecção
                    </span>
                    <Badge className={parsedReport.findings?.signs?.infection?.present ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}>
                      {parsedReport.findings?.signs?.infection?.present ? 'DETECTADA' : 'Ausente'}
                    </Badge>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 ${
                  parsedReport.findings?.signs?.inflammation?.present 
                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <ThermometerSun className="w-4 h-4 text-orange-500" />
                      Inflamação
                    </span>
                    <Badge variant={parsedReport.findings?.signs?.inflammation?.present ? 'default' : 'outline'}>
                      {parsedReport.findings?.signs?.inflammation?.present ? 'Presente' : 'Ausente'}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 font-medium">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      Exsudato
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Quantidade:</strong> {parsedReport.findings?.signs?.exudate?.amount || 'Mínimo'}<br/>
                    <strong>Tipo:</strong> {parsedReport.findings?.signs?.exudate?.type || 'Seroso'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'treatment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline de Tratamento */}
          <Card className="lg:col-span-2 border-0 shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Plano Terapêutico</h4>
                  <p className="text-sm text-gray-500">Protocolo de tratamento recomendado</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-0">
                <TimelineItem 
                  icon={Droplets} 
                  title="Limpeza da Ferida" 
                  description={parsedReport.recommendations?.immediate?.cleaning?.solution || 'Soro fisiológico 0.9%'} 
                  status="done"
                />
                <TimelineItem 
                  icon={Shield} 
                  title="Curativo Primário" 
                  description={parsedReport.recommendations?.immediate?.dressing?.primary?.type || 'Hidrogel ou hidrocolóide'}
                  status="current"
                />
                <TimelineItem 
                  icon={Activity} 
                  title="Monitoramento" 
                  description={`Reavaliação em ${parsedReport.recommendations?.monitoring?.nextEvaluation || '7 dias'}`}
                  status="pending"
                />
                <TimelineItem 
                  icon={CheckCircle} 
                  title="Cicatrização Esperada" 
                  description={parsedReport.diagnosis?.primary?.prognosticImplications?.healingPotential?.timelineEstimate || '4-8 semanas'}
                  status="pending"
                  isLast
                />
              </div>
            </CardContent>
          </Card>

          {/* Prognóstico */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Prognóstico</h4>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg mb-4">
                  <span className="text-3xl font-bold">
                    {parsedReport.diagnosis?.primary?.prognosticImplications?.healingPotential?.probabilityScore || 75}%
                  </span>
                </div>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  Probabilidade de Cura
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Estimado</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                    {parsedReport.diagnosis?.primary?.prognosticImplications?.healingPotential?.timelineEstimate || '4-8 semanas'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Complexidade</span>
                  <Badge variant="outline" className="bg-white dark:bg-gray-800">
                    {parsedReport.diagnosis?.primary?.complexity || 'Moderada'}
                  </Badge>
                </div>
              </div>

              {parsedReport.recommendations?.referrals && parsedReport.recommendations.referrals.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Encaminhamentos
                  </h5>
                  <ul className="space-y-1">
                    {parsedReport.recommendations.referrals.map((ref, i) => (
                      <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" />
                        {ref.specialty}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botão Expandir Detalhes */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="group text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 rounded-full px-6"
        >
          {showDetails ? (
            <>
              <span className="mr-2">Ocultar Informações Técnicas</span>
              <ChevronUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            </>
          ) : (
            <>
              <span className="mr-2">Ver Informações Técnicas Completas</span>
              <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </>
          )}
        </Button>
      </div>

      {/* Seção Expandida */}
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showDetails ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dados do Paciente Expandidos */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <User className="w-5 h-5 text-blue-500" />
                  Dados do Paciente
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {Array.isArray(parsedReport.patientInfo?.name) ? parsedReport.patientInfo.name[0]?.text : parsedReport.patientInfo?.name || 'N/A'}</p>
                  <p><strong>Idade:</strong> {parsedReport.patientInfo?.age || 'N/A'}</p>
                  <p><strong>Sexo:</strong> {parsedReport.patientInfo?.gender || 'N/A'}</p>
                  <p><strong>ID:</strong> {parsedReport.patientInfo?.identifier || 'N/A'}</p>
                </div>
              </div>

              {/* Metadados do Exame */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Clipboard className="w-5 h-5 text-purple-500" />
                  Metadados do Exame
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Protocolo:</strong> {parsedReport.header?.protocol || 'N/A'}</p>
                  <p><strong>Data:</strong> {parsedReport.header?.date || 'N/A'}</p>
                  <p><strong>Hora:</strong> {parsedReport.header?.time || 'N/A'}</p>
                  <p><strong>Versão:</strong> {parsedReport.header?.version || 'N/A'}</p>
                </div>
              </div>

              {/* Instituição */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Building className="w-5 h-5 text-emerald-500" />
                  Instituição
                </h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {parsedReport.header?.institution || 'N/A'}</p>
                  <p><strong>Responsável:</strong> {parsedReport.header?.responsiblePhysician || 'N/A'}</p>
                  <p><strong>Sistema:</strong> {parsedReport.header?.system || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Profissional */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {parsedReport.header?.institution || 'Fecha Ferida IA'}
              </span>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                {parsedReport.header?.responsiblePhysician || 'Sistema Automatizado'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 font-semibold">Este laudo requer validação médica profissional</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactUnifiedMedicalReport;