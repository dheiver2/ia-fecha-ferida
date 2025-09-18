import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Archive,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  FileDown,
  Shield,
  Calendar as CalendarIcon,
  Activity,
  TrendingUp,
  Users,
  User,
  FileImage,
  Plus,
  RefreshCw,
  Settings,
  Star,
  Share2,
  Copy,
  ExternalLink,
  Stethoscope,
  Heart,
  Brain,
  Microscope,
  Database,
  Layers,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  Bell,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  History,
  Workflow,
  PieChart,
  LineChart,
  MoreHorizontal,
  Edit,
  Tag,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarDays,
  Timer,
  Gauge,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Upload,
  FolderOpen,
  Grid,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  FilterX,
  Search as SearchIcon,
  Bookmark,
  BookmarkCheck,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função auxiliar para formatar datas de forma segura
const safeFormatDate = (dateString: string, formatString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return format(date, formatString, { locale: ptBR });
  } catch (error) {
    return 'Data inválida';
  }
};
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import StructuredMedicalReportViewer from '@/components/StructuredMedicalReportViewer';
import MedicalReportViewer from '@/components/MedicalReportViewer';
import MedicalDashboard from '@/components/MedicalDashboard';
import MedicalFilters, { FilterOptions } from '@/components/MedicalFilters';
import Header from '@/components/Header';
import analysisService from '@/services/analysisService';

interface ExamRecord {
  id: string;
  fileName: string;
  analysisDate: string;
  status: 'completed' | 'pending' | 'error' | 'reviewing' | 'archived' | 'draft';
  confidence: number;
  analysisResult: string;
  fileSize?: string;
  imageUrl?: string;
  protocol: string;
  examType?: string;
  doctor?: string;
  patient?: {
    name: string;
    age: string;
    gender: string;
    id: string;
    phone?: string;
    email?: string;
    address?: string;
    medicalHistory?: string[];
    allergies?: string[];
  };
  priority?: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  tags?: string[];
  notes?: string;
  accessLog?: Array<{timestamp: string, action: string, user: string, ip?: string}>;
  reviewedBy?: string;
  reviewDate?: string;
  starred?: boolean;
  bookmarked?: boolean;
  shared?: boolean;
  locked?: boolean;
  version?: number;
  lastModified?: string;
  createdBy?: string;
  department?: string;
  location?: string;
  equipment?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  complications?: string[];
  treatment?: {
    prescribed: string[];
    dosage?: string[];
    duration?: string;
    instructions?: string;
  };
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
  aiAnalysis?: {
    detectedConditions: string[];
    riskFactors: string[];
    recommendations: string[];
    similarCases?: number;
    accuracy?: number;
  };
  billing?: {
    cost: number;
    insurance: string;
    covered: boolean;
  };
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
}

type SortField = 'analysisDate' | 'fileName' | 'confidence' | 'status' | 'protocol' | 'priority';
type SortDirection = 'asc' | 'desc';

const Historico: React.FC = () => {
  const [examHistory, setExamHistory] = useState<ExamRecord[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('analysisDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<Array<{name: string, filters: FilterOptions}>>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error'}>>([]);
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    status: 'all',
    examType: 'all',
    doctor: 'all',
    priority: 'all',
    dateRange: { from: null, to: null },
    confidenceRange: { min: 0, max: 100 },
    tags: [],
    starred: null,
    department: undefined,
    followUpRequired: undefined
  });

  const { toast } = useToast();

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      examType: 'all',
      doctor: 'all',
      priority: 'all',
      dateRange: { from: null, to: null },
      confidenceRange: { min: 0, max: 100 },
      tags: [],
      starred: null,
      department: undefined,
      followUpRequired: undefined
    });
  };

  // Carregar dados das análises realizadas do localStorage
  useEffect(() => {
    // Carregar dados reais das análises do localStorage
    const savedExamHistory = localStorage.getItem('examHistory');
    let examData: ExamRecord[] = [];
    
    if (savedExamHistory) {
      try {
        const rawData = JSON.parse(savedExamHistory);
        // Validar e corrigir datas inválidas
        examData = rawData.map((exam: any) => ({
          ...exam,
          analysisDate: exam.analysisDate && !isNaN(new Date(exam.analysisDate).getTime()) 
            ? exam.analysisDate 
            : new Date().toISOString(),
          lastModified: exam.lastModified && !isNaN(new Date(exam.lastModified).getTime()) 
            ? exam.lastModified 
            : new Date().toISOString(),
          followUpDate: exam.followUpDate && !isNaN(new Date(exam.followUpDate).getTime()) 
            ? exam.followUpDate 
            : undefined
        }));
      } catch (error) {
        console.error('Erro ao carregar histórico de exames:', error);
      }
    }
    
    // Se não houver dados salvos, usar dados de exemplo para demonstração
    if (examData.length === 0) {
      examData = [
        {
          id: '1',
          fileName: 'ferida_paciente_001.jpg',
          analysisDate: new Date().toISOString(),
          status: 'completed',
          confidence: 92,
          analysisResult: 'Análise completa realizada com sucesso. Ferida em processo de cicatrização adequado.',
          protocol: 'CFI-20240115001',
          examType: 'Análise de Ferida',
          doctor: 'Médico Laudador',
          department: 'Cirurgia Geral',
          location: 'Sala 201 - Ala Norte',
          equipment: 'Camera Digital HD Pro',
          patient: {
            name: 'Maria Santos',
            age: '45',
            gender: 'Feminino',
            id: 'PAC001',
            phone: '(11) 99999-1234',
            email: 'maria.santos@email.com',
            address: 'Rua das Flores, 123 - São Paulo/SP',
            medicalHistory: ['Diabetes Tipo 2', 'Hipertensão'],
            allergies: ['Penicilina', 'Látex']
          },
          priority: 'normal',
          tags: ['cicatrização', 'pós-operatório', 'diabetes'],
          starred: true,
          bookmarked: false,
          shared: true,
          locked: false,
          version: 2,
          lastModified: new Date(Date.now() - 3600000).toISOString(),
          createdBy: 'Médico Laudador',
          followUpRequired: true,
          followUpDate: new Date(Date.now() + 604800000).toISOString(),
          vitals: {
            bloodPressure: '140/90',
            heartRate: 78,
            temperature: 36.8,
            oxygenSaturation: 98
          },
          aiAnalysis: {
            detectedConditions: ['Ferida cirúrgica em cicatrização', 'Sinais de inflamação leve'],
            riskFactors: ['Diabetes', 'Idade avançada'],
            recommendations: ['Curativo diário', 'Antibiótico tópico', 'Controle glicêmico'],
            similarCases: 127,
            accuracy: 94.2
          },
          treatment: {
            prescribed: ['Amoxicilina 500mg', 'Curativo com hidrogel'],
            dosage: ['8/8h por 7 dias', 'Troca diária'],
            duration: '7-10 dias',
            instructions: 'Manter ferida limpa e seca. Retorno em 7 dias.'
          },
          billing: {
            cost: 350.00,
            insurance: 'Unimed',
            covered: true
          },
          attachments: [
            {
              id: 'att1',
              name: 'Exame_Laboratorial.pdf',
              type: 'PDF',
              size: '2.3 MB',
              url: '/attachments/lab_001.pdf'
            }
          ]
        }
      ];
    }
    
    setExamHistory(examData);
    setFilteredExams(examData);
  }, []);

  // Aplicar filtros, ordenação e paginação
  useEffect(() => {
    let filtered = examHistory;

    // Filtro por termo de busca
    if (filters.searchTerm) {
      filtered = filtered.filter(exam => 
        exam.fileName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        exam.protocol.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (exam.doctor && exam.doctor.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (exam.patient?.name && exam.patient.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (exam.examType && exam.examType.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (exam.tags && exam.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())))
      );
    }

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = filtered.filter(exam => exam.status === filters.status);
    }

    // Filtro por prioridade
    if (filters.priority !== 'all') {
      filtered = filtered.filter(exam => exam.priority === filters.priority);
    }

    // Filtro por favoritos
    if (filters.starred !== null) {
      filtered = filtered.filter(exam => exam.starred === filters.starred);
    }

    // Filtro por tipo de exame
    if (filters.examType !== 'all') {
      filtered = filtered.filter(exam => exam.examType === filters.examType);
    }

    // Filtro por médico
    if (filters.doctor !== 'all') {
      filtered = filtered.filter(exam => exam.doctor === filters.doctor);
    }

    // Filtro por data
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(exam => {
        const examDate = new Date(exam.analysisDate);
        
        if (filters.dateRange.from && examDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && examDate > filters.dateRange.to) {
          return false;
        }
        return true;
      });
    }

    // Filtro por confiança
    if (filters.confidenceRange.min > 0 || filters.confidenceRange.max < 100) {
      filtered = filtered.filter(exam => 
        exam.confidence >= filters.confidenceRange.min && 
        exam.confidence <= filters.confidenceRange.max
      );
    }

    // Filtro por tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(exam => 
        exam.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'analysisDate') {
        // Validar datas antes de converter
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        aValue = !isNaN(aDate.getTime()) ? aDate.getTime() : 0;
        bValue = !isNaN(bDate.getTime()) ? bDate.getTime() : 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredExams(filtered);
    setCurrentPage(1);
  }, [examHistory, filters, sortField, sortDirection]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100">Pendente</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100">Em Revisão</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Urgente</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Alta</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Baixa</Badge>;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 80) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const toggleStarred = (examId: string) => {
    setExamHistory(prev => prev.map(exam => 
      exam.id === examId ? { ...exam, starred: !exam.starred } : exam
    ));
    toast({
      title: "Favorito atualizado",
      description: "O status de favorito foi alterado com sucesso.",
    });
  };

  const deleteExam = async (examId: string) => {
    try {
      // Verificar se o ID é numérico (existe no backend) ou é um ID de exemplo
      const isNumericId = !isNaN(parseInt(examId)) && parseInt(examId) > 0;
      
      if (isNumericId) {
        // Tentar deletar do backend apenas se for um ID válido
        try {
          await analysisService.deleteAnalysis(parseInt(examId));
        } catch (backendError) {
          console.warn('Erro ao deletar do backend, removendo apenas do localStorage:', backendError);
        }
      }
      
      // Sempre remover do estado local e localStorage
      setExamHistory(prev => prev.filter(exam => exam.id !== examId));
      
      // Atualizar localStorage
      const updatedHistory = examHistory.filter(exam => exam.id !== examId);
      localStorage.setItem('examHistory', JSON.stringify(updatedHistory));
      
      toast({
        title: "Exame removido",
        description: "O exame foi removido do histórico com sucesso.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Erro ao deletar exame:', error);
      toast({
        title: "Erro ao remover exame",
        description: "Não foi possível remover o exame. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const copyProtocol = (protocol: string) => {
    navigator.clipboard.writeText(protocol);
    toast({
      title: "Protocolo copiado",
      description: "O número do protocolo foi copiado para a área de transferência.",
    });
  };

  // Funcionalidades avançadas
  const toggleSelectExam = (examId: string) => {
    setSelectedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const selectAllExams = () => {
    setSelectedExams(currentExams.map(exam => exam.id));
  };

  const clearSelection = () => {
    setSelectedExams([]);
  };

  const bulkDelete = async () => {
    try {
      // Separar IDs numéricos (backend) dos IDs de exemplo
      const numericIds = selectedExams
        .filter(id => !isNaN(parseInt(id)) && parseInt(id) > 0)
        .map(id => parseInt(id));
      
      let deletedCount = 0;
      
      // Deletar do backend apenas os IDs válidos
      if (numericIds.length > 0) {
        try {
          const result = await analysisService.bulkDeleteAnalyses(numericIds);
          deletedCount = result.deletedAnalyses;
        } catch (backendError) {
          console.warn('Erro ao deletar alguns itens do backend, removendo apenas do localStorage:', backendError);
        }
      }
      
      // Sempre remover do estado local e localStorage
      setExamHistory(prev => prev.filter(exam => !selectedExams.includes(exam.id)));
      
      // Atualizar localStorage
      const updatedHistory = examHistory.filter(exam => !selectedExams.includes(exam.id));
      localStorage.setItem('examHistory', JSON.stringify(updatedHistory));
      
      setSelectedExams([]);
      
      toast({
        title: "Exames removidos",
        description: `${selectedExams.length} exames foram removidos do histórico com sucesso.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error('Erro ao deletar exames:', error);
      toast({
        title: "Erro ao remover exames",
        description: "Não foi possível remover os exames selecionados. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const bulkArchive = () => {
    setExamHistory(prev => prev.map(exam => 
      selectedExams.includes(exam.id) 
        ? { ...exam, status: 'archived' as const }
        : exam
    ));
    setSelectedExams([]);
    toast({
      title: "Exames arquivados",
      description: `${selectedExams.length} exames foram arquivados.`,
    });
  };

  const bulkExport = () => {
    const selectedData = examHistory.filter(exam => selectedExams.includes(exam.id));
    const csvContent = generateCSV(selectedData);
    downloadFile(csvContent, 'exames_selecionados.csv', 'text/csv');
    toast({
      title: "Exportação concluída",
      description: `${selectedExams.length} exames foram exportados.`,
    });
  };

  const generateCSV = (data: ExamRecord[]) => {
    const headers = ['Protocolo', 'Paciente', 'Data', 'Status', 'Confiança', 'Médico', 'Tipo'];
    const rows = data.map(exam => [
      exam.protocol,
      exam.patient?.name || 'N/A',
      safeFormatDate(exam.analysisDate, 'dd/MM/yyyy'),
      exam.status,
      `${exam.confidence}%`,
      exam.doctor || 'N/A',
      exam.examType || 'N/A'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveFilter = (name: string) => {
    setSavedFilters(prev => [...prev, { name, filters }]);
    toast({
      title: "Filtro salvo",
      description: `O filtro "${name}" foi salvo com sucesso.`,
    });
  };

  const loadFilter = (savedFilter: {name: string, filters: FilterOptions}) => {
    setFilters(savedFilter.filters);
    toast({
      title: "Filtro carregado",
      description: `O filtro "${savedFilter.name}" foi aplicado.`,
    });
  };

  const addToSearchHistory = (term: string) => {
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 9)]);
    }
  };

  // Estatísticas avançadas
  const advancedStats = useMemo(() => {
    const totalCost = examHistory.reduce((sum, exam) => sum + (exam.billing?.cost || 0), 0);
    const avgConfidence = examHistory.length > 0 
      ? examHistory.reduce((sum, exam) => sum + exam.confidence, 0) / examHistory.length 
      : 0;
    
    const statusCounts = examHistory.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = examHistory.reduce((acc, exam) => {
      const priority = exam.priority || 'normal';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departmentCounts = examHistory.reduce((acc, exam) => {
      const dept = exam.department || 'Não especificado';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calcular taxa de cicatrização baseada nos exames
    const healingCases = examHistory.filter(exam => 
      exam.status === 'completed' && (
        exam.analysisResult?.toLowerCase().includes('cicatrização') || 
        exam.analysisResult?.toLowerCase().includes('cicatrizada') ||
        exam.analysisResult?.toLowerCase().includes('melhora') ||
        exam.analysisResult?.toLowerCase().includes('adequado') ||
        exam.analysisResult?.toLowerCase().includes('evolução')
      )
    ).length;
    
    const healingRate = examHistory.length > 0 ? Math.round((healingCases / examHistory.length) * 100) : 0;

    return {
      totalCost,
      avgConfidence: Math.round(avgConfidence),
      statusCounts,
      priorityCounts,
      departmentCounts,
      followUpRequired: examHistory.filter(e => e.followUpRequired).length,
      criticalCases: examHistory.filter(e => e.priority === 'critical' || e.priority === 'urgent').length,
      healingRate,
      healingCases
    };
  }, [examHistory]);

  // Estatísticas do dashboard
  const stats = {
    total: examHistory.length,
    completed: examHistory.filter(e => e.status === 'completed').length,
    pending: examHistory.filter(e => e.status === 'pending').length,
    reviewing: examHistory.filter(e => e.status === 'reviewing').length,
    avgConfidence: examHistory.length > 0 ? Math.round(examHistory.reduce((acc, e) => acc + e.confidence, 0) / examHistory.length) : 0
  };

  // Paginação
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
        {/* Header da página com funcionalidades avançadas */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <Database className="h-6 w-6 lg:h-8 lg:w-8 text-primary flex-shrink-0" />
              <span className="truncate">Gestão Avançada de Análises</span>
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2 text-sm lg:text-base">
              <Layers className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Sistema inteligente para gerenciamento completo de exames médicos</span>
            </p>
            {selectedExams.length > 0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {selectedExams.length} exame(s) selecionado(s)
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-6 px-2 text-xs"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              </div>
            )}
          </div>
          
          {/* Controles avançados */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 justify-start lg:justify-end">
            {/* Modo de visualização */}
            <div className="flex items-center bg-secondary/50 rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-2 lg:px-3"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Tabela</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-2 lg:px-3"
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Grade</span>
              </Button>
            </div>

            {/* Ações rápidas */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportDialog(true)}
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Importar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Análise
            </Button>
          </div>
        </div>

        {/* Dashboard Avançado */}
        {showDashboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Estatísticas Principais */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Total de Exames</p>
                    <p className="text-2xl lg:text-3xl font-bold text-primary">{examHistory.length}</p>
                  </div>
                  <Activity className="h-6 w-6 lg:h-8 lg:w-8 text-primary flex-shrink-0 ml-2" />
                </div>
                <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm">
                  <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-green-600 truncate">+12% este mês</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Confiança Média</p>
                    <p className="text-2xl lg:text-3xl font-bold text-accent">{advancedStats.avgConfidence}%</p>
                  </div>
                  <Target className="h-6 w-6 lg:h-8 lg:w-8 text-accent flex-shrink-0 ml-2" />
                </div>
                <div className="mt-3 lg:mt-4">
                  <Progress value={advancedStats.avgConfidence} className="h-1.5 lg:h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Casos Críticos</p>
                    <p className="text-2xl lg:text-3xl font-bold text-destructive">{advancedStats.criticalCases}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-destructive flex-shrink-0 ml-2" />
                </div>
                <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm">
                  <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-orange-500 mr-1 flex-shrink-0" />
                  <span className="text-orange-600">Requer atenção</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green/10 to-green/5 border-green/20">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">Taxa de Cicatrização</p>
                    <p className="text-2xl lg:text-3xl font-bold text-green-600">
                      {advancedStats.healingRate}%
                    </p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0 ml-2" />
                </div>
                <div className="mt-3 lg:mt-4 flex items-center text-xs lg:text-sm">
                  <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-green-600 truncate">{advancedStats.healingCases} casos com melhora</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros Avançados */}
        {showAdvancedFilters && (
          <Card className="mb-8 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Filter className="h-5 w-5" />
                Filtros Avançados
              </CardTitle>
              <CardDescription>
                Configure filtros personalizados para análise detalhada dos dados
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Busca Inteligente */}
                <div className="space-y-2">
                  <Label htmlFor="search">Busca Inteligente</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Buscar por paciente, protocolo, diagnóstico..."
                      value={filters.searchTerm}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
                        addToSearchHistory(e.target.value);
                      }}
                      className="pl-10"
                    />
                  </div>
                  {searchHistory.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {searchHistory.slice(0, 5).map((term, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setFilters(prev => ({ ...prev, searchTerm: term }))}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filtro por Departamento */}
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select
                    value={filters.department || 'all'}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, department: value === 'all' ? undefined : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os departamentos</SelectItem>
                      {Object.keys(advancedStats.departmentCounts).map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept} ({advancedStats.departmentCounts[dept]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Prioridade */}
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as prioridades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as prioridades</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Follow-up */}
                <div className="space-y-2">
                  <Label>Follow-up Necessário</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="followup"
                      checked={filters.followUpRequired || false}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, followUpRequired: checked as boolean }))
                      }
                    />
                    <Label htmlFor="followup" className="text-sm">
                      Apenas casos que requerem follow-up
                    </Label>
                  </div>
                </div>

                {/* Filtro por Confiança */}
                <div className="space-y-2">
                  <Label>Nível de Confiança (%)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.confidenceRange?.min || 0}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        confidenceRange: { ...prev.confidenceRange, min: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-20"
                    />
                    <span>até</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={filters.confidenceRange?.max || 100}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        confidenceRange: { ...prev.confidenceRange, max: parseInt(e.target.value) || 100 }
                      }))}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Filtros Salvos */}
                <div className="space-y-2">
                  <Label>Filtros Salvos</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => {
                      const savedFilter = savedFilters.find(f => f.name === value);
                      if (savedFilter) loadFilter(savedFilter);
                    }}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Carregar filtro salvo" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedFilters.map(filter => (
                          <SelectItem key={filter.name} value={filter.name}>
                            {filter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const name = prompt('Nome do filtro:');
                        if (name) saveFilter(name);
                      }}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Limpar Filtros
                </Button>
                <div className="text-sm text-muted-foreground">
                  {filteredExams.length} de {examHistory.length} exames encontrados
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações em Lote */}
        {selectedExams.length > 0 && (
          <Card className="mb-8 border-accent/20 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {selectedExams.length} selecionado(s)
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllExams}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Selecionar Todos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={bulkExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={bulkArchive}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Arquivar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={bulkDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros Médicos Básicos */}
        <div className="mb-8">
          <MedicalFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearAllFilters}
          />
        </div>

        {/* Dashboard de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de Exames</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Concluídos</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pendentes</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Em Revisão</p>
                  <p className="text-3xl font-bold">{stats.reviewing}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Confiança Média</p>
                  <p className="text-3xl font-bold">{stats.avgConfidence}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por protocolo, paciente, médico..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="reviewing">Em Revisão</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                Filtros de data disponíveis nos filtros avançados
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={filters.starred ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, starred: !prev.starred }))}
              >
                <Star className={`h-4 w-4 mr-2 ${filters.starred ? 'fill-current' : ''}`} />
                Apenas Favoritos
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <span className="text-sm text-muted-foreground">
                {filteredExams.length} de {examHistory.length} exames
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lista de exames */}
        <Card className="border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Database className="h-5 w-5" />
                Análises Médicas
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  {filteredExams.length}
                </Badge>
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'table' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  {viewMode === 'table' ? 'Grade' : 'Tabela'}
                </Button>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {currentExams.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Nenhum exame encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Não há exames que correspondam aos filtros selecionados.
                </p>
                <Button asChild>
                  <Link to="/analise">
                    <Plus className="h-4 w-4 mr-2" />
                    Realizar Nova Análise
                  </Link>
                </Button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="p-2 lg:p-4 text-left">
                        <Checkbox
                          checked={selectedExams.length === currentExams.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedExams(currentExams.map(e => e.id));
                            } else {
                              setSelectedExams([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-2 lg:p-4 text-left font-medium">Paciente</th>
                      <th className="p-2 lg:p-4 text-left font-medium hidden sm:table-cell">Protocolo</th>
                      <th className="p-2 lg:p-4 text-left font-medium hidden md:table-cell">Data</th>
                      <th className="p-2 lg:p-4 text-left font-medium">Status</th>
                      <th className="p-2 lg:p-4 text-left font-medium hidden lg:table-cell">Confiança</th>
                      <th className="p-2 lg:p-4 text-left font-medium hidden xl:table-cell">Departamento</th>
                      <th className="p-2 lg:p-4 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExams.map((exam) => (
                      <tr 
                        key={exam.id} 
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          selectedExams.includes(exam.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="p-2 lg:p-4">
                          <Checkbox
                            checked={selectedExams.includes(exam.id)}
                            onCheckedChange={(checked) => toggleSelectExam(exam.id)}
                          />
                        </td>
                        <td className="p-2 lg:p-4">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm lg:text-base truncate">{exam.patient?.name || 'Não informado'}</p>
                              <p className="text-xs lg:text-sm text-muted-foreground truncate sm:hidden">
                                {exam.protocol}
                              </p>
                              <p className="text-xs lg:text-sm text-muted-foreground hidden lg:block">
                                {exam.patient?.age && exam.patient?.gender ? 
                                  `${exam.patient.age} anos, ${exam.patient.gender}` : 
                                  'Dados não informados'
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 lg:p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs lg:text-sm font-mono truncate max-w-[100px]">
                              {exam.protocol}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyProtocol(exam.protocol)}
                              className="p-1 h-auto flex-shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-2 lg:p-4 hidden md:table-cell">
                          <div>
                            <p className="font-medium text-sm lg:text-base">
                              {safeFormatDate(exam.analysisDate, 'dd/MM/yyyy')}
                            </p>
                            <p className="text-xs lg:text-sm text-muted-foreground">
                              {safeFormatDate(exam.analysisDate, 'HH:mm')}
                            </p>
                          </div>
                        </td>
                        <td className="p-2 lg:p-4">
                          <div className="flex items-center gap-1 lg:gap-2">
                            <div className="md:hidden">
                              {getStatusIcon(exam.status)}
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                              {getStatusIcon(exam.status)}
                              {getStatusBadge(exam.status)}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 lg:p-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-12 lg:w-16">
                              <Progress value={exam.confidence} className="h-1.5 lg:h-2" />
                            </div>
                            <span className={`font-medium text-xs lg:text-sm ${getConfidenceColor(exam.confidence)}`}>
                              {exam.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2 lg:p-4 hidden xl:table-cell">
                          <Badge variant="outline" className="text-xs truncate max-w-[80px]">
                            {exam.department}
                          </Badge>
                        </td>
                        <td className="p-2 lg:p-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStarred(exam.id)}
                              className="p-1 h-auto"
                            >
                              <Star className={`h-4 w-4 ${exam.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Laudo Médico - {exam.protocol}</DialogTitle>
                                  <DialogDescription>
                                    Análise realizada em {safeFormatDate(exam.analysisDate, 'dd/MM/yyyy HH:mm')}
                                  </DialogDescription>
                                </DialogHeader>
                                <StructuredMedicalReportViewer 
                                  reportContent={exam.analysisResult}
                                  isLoading={false}
                                  patientData={{
                                    name: exam.patient?.name || 'Paciente não identificado',
                                    age: exam.patient?.age || 'N/A',
                                    gender: exam.patient?.gender || 'N/A',
                                    id: exam.patient?.id || exam.id,
                                    protocol: exam.protocol
                                  }}
                                />
                              </DialogContent>
                            </Dialog>

                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                              <Download className="h-4 w-4" />
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteExam(exam.id)}
                              className="p-1 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentExams.map((exam) => (
                  <Card 
                    key={exam.id} 
                    className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                      selectedExams.includes(exam.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleSelectExam(exam.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedExams.includes(exam.id)}
                              onCheckedChange={(checked) => toggleSelectExam(exam.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{exam.patient?.name || 'Não informado'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {exam.patient?.age && exam.patient?.gender ? 
                                  `${exam.patient.age} anos, ${exam.patient.gender}` : 
                                  'Dados não informados'
                                }
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStarred(exam.id);
                            }}
                            className="p-1 h-auto"
                          >
                            <Star className={`h-4 w-4 ${exam.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                              {exam.protocol}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyProtocol(exam.protocol);
                              }}
                              className="p-1 h-auto"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getStatusIcon(exam.status)}
                            {getStatusBadge(exam.status)}
                          </div>

                          <div className="flex items-center gap-2">
                            <Progress value={exam.confidence} className="flex-1 h-2" />
                            <span className={`font-medium text-sm ${getConfidenceColor(exam.confidence)}`}>
                              {exam.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{safeFormatDate(exam.analysisDate, 'dd/MM/yyyy')}</span>
                          <Badge variant="outline" className="text-xs">
                            {exam.department}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Laudo Médico - {exam.protocol}</DialogTitle>
                                <DialogDescription>
                                  Análise realizada em {safeFormatDate(exam.analysisDate, 'dd/MM/yyyy HH:mm')}
                                </DialogDescription>
                              </DialogHeader>
                              <StructuredMedicalReportViewer 
                                reportContent={exam.analysisResult}
                                isLoading={false}
                                patientData={{
                                  name: exam.patient?.name || 'Paciente não identificado',
                                  age: exam.patient?.age || 'N/A',
                                  gender: exam.patient?.gender || 'N/A',
                                  id: exam.patient?.id || exam.id,
                                  protocol: exam.protocol
                                }}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteExam(exam.id);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Paginação Avançada */}
            {totalPages > 1 && (
              <div className="border-t bg-muted/20 p-3 lg:p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span className="text-center sm:text-left">
                      Mostrando <span className="font-medium text-foreground">{startIndex + 1}</span> a{' '}
                      <span className="font-medium text-foreground">{Math.min(endIndex, filteredExams.length)}</span> de{' '}
                      <span className="font-medium text-foreground">{filteredExams.length}</span> exames
                    </span>
                    <Separator orientation="vertical" className="h-4 hidden sm:block" />
                    <span className="text-center sm:text-left">
                      Página <span className="font-medium text-foreground">{currentPage}</span> de{' '}
                      <span className="font-medium text-foreground">{totalPages}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="hidden md:flex p-1 sm:p-2"
                    >
                      <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Primeira página</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1 sm:p-2"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Página anterior</span>
                    </Button>
                    
                    {/* Números das páginas */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                        let pageNum;
                        const maxPages = window.innerWidth < 640 ? 3 : 5;
                        if (totalPages <= maxPages) {
                          pageNum = i + 1;
                        } else if (currentPage <= Math.floor(maxPages / 2) + 1) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                          pageNum = totalPages - maxPages + 1 + i;
                        } else {
                          pageNum = currentPage - Math.floor(maxPages / 2) + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 sm:p-2"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Próxima página</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="hidden md:flex p-1 sm:p-2"
                    >
                      <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Última página</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sistema de Notificações */}
        {notifications.length > 0 && (
          <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 left-2 sm:left-auto z-50 space-y-2 max-w-sm sm:max-w-md">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 shadow-lg ${
                  notification.type === 'success' ? 'border-l-green-500 bg-green-50' :
                  notification.type === 'error' ? 'border-l-red-500 bg-red-50' :
                  notification.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'error' && <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm truncate">{notification.title}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                      className="p-1 h-auto flex-shrink-0"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialogs de Exportação e Importação */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportar Dados
              </DialogTitle>
              <DialogDescription>
                Selecione o formato e os dados que deseja exportar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Formato de Exportação</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dados a Exportar</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-selected" defaultChecked />
                    <Label htmlFor="export-selected">Apenas exames selecionados ({selectedExams.length})</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-all" />
                    <Label htmlFor="export-all">Todos os exames filtrados ({filteredExams.length})</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                bulkExport();
                setShowExportDialog(false);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar Dados
              </DialogTitle>
              <DialogDescription>
                Faça upload de um arquivo para importar dados de exames
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste e solte um arquivo aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos suportados: CSV, JSON
                </p>
                <Button variant="outline" className="mt-4">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancelar
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Historico;