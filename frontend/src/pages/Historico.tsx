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
  X,
  Sparkles
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
import Breadcrumbs from '@/components/Breadcrumbs';

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
        // Validar e corrigir datas inválidas e migrar dados antigos
        examData = rawData.map((exam: any) => {
          // Migração de dados antigos: converter patientName para patient.name
          let patient = exam.patient;
          if (!patient && exam.patientName) {
            patient = {
              name: exam.patientName,
              age: 'Não informado',
              gender: 'Não informado',
              id: `PAC-${exam.id || Date.now()}`
            };
          }

          return {
            ...exam,
            patient,
            analysisDate: exam.analysisDate && !isNaN(new Date(exam.analysisDate).getTime()) 
              ? exam.analysisDate 
              : new Date().toISOString(),
            lastModified: exam.lastModified && !isNaN(new Date(exam.lastModified).getTime()) 
              ? exam.lastModified 
              : new Date().toISOString(),
            followUpDate: exam.followUpDate && !isNaN(new Date(exam.followUpDate).getTime()) 
              ? exam.followUpDate 
              : undefined
          };
        });
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

  // Sincronizar com backend se houver token de autenticação
  useEffect(() => {
    const sync = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.debug('Historico: sem token, mantendo dados locais.');
        return;
      }
      setIsLoading(true);
      try {
        const { analyses } = await analysisService.getAnalyses(1, 100);
        const examData = analyses.map((a: any) => analysisService.convertToExamRecord(a));
        setExamHistory(examData);
        setFilteredExams(examData);
        localStorage.setItem('examHistory', JSON.stringify(examData));
        toast({
          title: 'Histórico sincronizado',
          description: `Carregado ${examData.length} registros do servidor.`
        });
      } catch (err) {
        console.warn('Historico: falha ao buscar análises do backend', err);
      } finally {
        setIsLoading(false);
      }
    };
    sync();
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
        return <CheckCircle className="h-4 w-4 text-medical-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-medical-warning" />;
      case 'reviewing':
        return <Eye className="h-4 w-4 text-accent" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-medical-error" />;
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
        return <Badge className="bg-accent/15 text-accent hover:bg-accent/20 dark:bg-accent/20 dark:text-accent-foreground">Em Revisão</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="default">Alta</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-muted-foreground border-muted">Baixa</Badge>;
      default:
        return null;
    }
  };

  // Normaliza confiança para 0–100
  const safeConfidence = (value: any) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    const pct = n <= 1 ? n * 100 : n;
    return Math.max(0, Math.min(100, Math.round(pct)));
  };

  const getConfidenceColor = (confidence: number) => {
    const c = safeConfidence(confidence);
    if (c >= 90) return 'text-medical-success';
    if (c >= 75) return 'text-medical-info';
    if (c >= 60) return 'text-medical-warning';
    return 'text-medical-error';
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
      ? examHistory.reduce((sum, exam) => sum + safeConfidence(exam.confidence), 0) / examHistory.length 
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
    avgConfidence: examHistory.length > 0 ? Math.round(examHistory.reduce((acc, e) => acc + safeConfidence(e.confidence), 0) / examHistory.length) : 0
  };

  // Paginação
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Breadcrumbs />
        
        {/* Header da página com funcionalidades avançadas */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 text-blue-100 mb-2">
                <Database className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Gestão de Dados</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
                Histórico de Análises
              </h1>
              <p className="text-blue-100 max-w-2xl text-lg">
                Gerencie, filtre e analise todo o histórico de exames médicos com ferramentas avançadas de IA.
              </p>
              
              {selectedExams.length > 0 && (
                <div className="pt-4 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/30">
                    <CheckCircle2 className="h-4 w-4 text-green-300" />
                    <span className="font-medium">{selectedExams.length} selecionados</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-white hover:bg-white/20 hover:text-white"
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </div>
            
            {/* Controles principais */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(true)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>

              <Button
                asChild
                className="bg-white text-indigo-600 hover:bg-blue-50 shadow-lg border-0 font-semibold"
              >
                <Link to="/analise">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Análise
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Avançado */}
        {showDashboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Estatísticas Principais */}
            <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total de Exames</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{examHistory.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <Target className="h-6 w-6" />
                  </div>
                  <Progress value={safeConfidence(advancedStats.avgConfidence)} className="w-16 h-1.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Confiança Média</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{advancedStats.avgConfidence}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    Atenção
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Casos Críticos</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{advancedStats.criticalCases}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                    {advancedStats.healingCases} casos
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Cicatrização</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{advancedStats.healingRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Barra de Ferramentas e Filtros */}
        <div className="sticky top-20 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar por paciente, protocolo, médico..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <Button
                variant={showAdvancedFilters ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {(filters.status !== 'all' || filters.priority !== 'all') && (
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'white' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`h-8 px-3 ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'white' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>

              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-[70px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Painel de Filtros Expansível */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="reviewing">Em Revisão</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase">Prioridade</Label>
                <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase">Departamento</Label>
                <Select
                  value={filters.department || 'all'}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, department: value === 'all' ? undefined : value }))}
                >
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {Object.keys(advancedStats.departmentCounts).map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full border-dashed text-muted-foreground hover:text-foreground"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Ações em Lote */}
        {selectedExams.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <span className="font-medium text-sm">{selectedExams.length} selecionados</span>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={bulkExport}
                className="text-white hover:bg-white/20 h-8 px-3 rounded-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={bulkArchive}
                className="text-white hover:bg-white/20 h-8 px-3 rounded-full"
              >
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={bulkDelete}
                className="text-red-300 hover:bg-red-500/20 hover:text-red-200 h-8 px-3 rounded-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSelection}
              className="h-6 w-6 rounded-full hover:bg-white/20 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Lista de exames */}
        <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  Análises Médicas
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {filteredExams.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Lista completa de exames e laudos médicos
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysisDate">Data da Análise</SelectItem>
                    <SelectItem value="patient">Nome do Paciente</SelectItem>
                    <SelectItem value="confidence">Confiança da IA</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="bg-white dark:bg-slate-800"
                >
                  {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {currentExams.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileImage className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Nenhum exame encontrado
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                  Não encontramos nenhum exame com os filtros selecionados. Tente ajustar sua busca ou limpar os filtros.
                </p>
                <Button onClick={clearAllFilters} variant="outline" className="mr-4">
                  Limpar Filtros
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/analise">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Análise
                  </Link>
                </Button>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4 w-[50px]">
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
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Protocolo</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Data</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Confiança</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Departamento</th>
                      <th className="p-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentExams.map((exam) => (
                      <tr 
                        key={exam.id} 
                        className={`group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          selectedExams.includes(exam.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedExams.includes(exam.id)}
                            onCheckedChange={(checked) => toggleSelectExam(exam.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold text-sm">
                              {exam.patient?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 dark:text-white truncate">{exam.patient?.name || 'Não informado'}</p>
                              <p className="text-xs text-slate-500 truncate">
                                {exam.patient?.age && exam.patient?.gender ? 
                                  `${exam.patient.age} anos • ${exam.patient.gender}` : 
                                  'Dados não informados'
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2 group/copy">
                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {exam.protocol}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyProtocol(exam.protocol)}
                              className="h-6 w-6 opacity-0 group-hover/copy:opacity-100 transition-opacity"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {safeFormatDate(exam.analysisDate, 'dd/MM/yyyy')}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {safeFormatDate(exam.analysisDate, 'HH:mm')}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(exam.status)}
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  safeConfidence(exam.confidence) >= 90 ? 'bg-green-500' :
                                  safeConfidence(exam.confidence) >= 70 ? 'bg-blue-500' :
                                  safeConfidence(exam.confidence) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${safeConfidence(exam.confidence)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {safeConfidence(exam.confidence)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 hidden xl:table-cell">
                          <Badge variant="outline" className="font-normal">
                            {exam.department || 'Geral'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleStarred(exam.id)}
                              className="h-8 w-8 text-slate-400 hover:text-yellow-400"
                            >
                              <Star className={`h-4 w-4 ${exam.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
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

                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteExam(exam.id)}
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 dark:border-slate-800 overflow-hidden ${
                      selectedExams.includes(exam.id) ? 'ring-2 ring-blue-500 bg-blue-50/30' : 'bg-white dark:bg-slate-800'
                    }`}
                    onClick={() => toggleSelectExam(exam.id)}
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg">
                            {exam.patient?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{exam.patient?.name || 'Não informado'}</h3>
                            <p className="text-sm text-slate-500">
                              {exam.patient?.age && exam.patient?.gender ? 
                                `${exam.patient.age} anos • ${exam.patient.gender}` : 
                                'Dados não informados'
                              }
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarred(exam.id);
                          }}
                          className="h-8 w-8 -mr-2 -mt-2 text-slate-400 hover:text-yellow-400"
                        >
                          <Star className={`h-4 w-4 ${exam.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-500">
                            <CalendarIcon className="h-4 w-4" />
                            {safeFormatDate(exam.analysisDate, 'dd/MM/yyyy')}
                          </div>
                          <Badge variant="outline" className="font-normal">
                            {exam.department || 'Geral'}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Confiança da IA</span>
                            <span className="font-medium text-slate-900 dark:text-white">{safeConfidence(exam.confidence)}%</span>
                          </div>
                          <Progress value={safeConfidence(exam.confidence)} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                          {getStatusBadge(exam.status)}
                          
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Ver Detalhes
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
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Paginação Avançada */}
            {totalPages > 1 && (
              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-500">
                    Mostrando <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> a{' '}
                    <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredExams.length)}</span> de{' '}
                    <span className="font-medium text-slate-900 dark:text-white">{filteredExams.length}</span> resultados
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
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
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
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
                  notification.type === 'success' ? 'border-l-medical-success bg-medical-success/10' :
                  notification.type === 'error' ? 'border-l-medical-error bg-medical-error/10' :
                  notification.type === 'warning' ? 'border-l-medical-warning bg-medical-warning/10' :
                  'border-l-medical-info bg-medical-info/10'
                }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'error' && <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'info' && <Info className="h-4 w-4 sm:h-5 sm:w-5 text-medical-info mt-0.5 flex-shrink-0" />}
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