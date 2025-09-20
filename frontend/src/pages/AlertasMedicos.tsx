import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Clock, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Search,
  Filter,
  Bell,
  User,
  Activity,
  TrendingUp,
  AlertCircle,
  Eye,
  MessageSquare,
  Stethoscope,
  FileText,
  Settings,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Alert {
  id: string;
  type: 'wound_stagnant' | 'no_followup' | 'urgent_unread' | 'missed_consultation' | 'medication_reminder' | 'critical_result';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  patientName: string;
  patientId: string;
  createdAt: Date;
  dueDate?: Date;
  isRead: boolean;
  actionRequired: boolean;
  metadata?: {
    woundLocation?: string;
    daysSinceLastUpdate?: number;
    analysisId?: string;
    consultationId?: string;
    urgencyLevel?: string;
  };
}

interface AlertStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unread: number;
  actionRequired: number;
}

const AlertasMedicos: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stats, setStats] = useState<AlertStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    unread: 0,
    actionRequired: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção viria da API
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'wound_stagnant',
      priority: 'critical',
      title: 'Ferida sem evolução',
      description: 'Paciente João Silva - ferida no pé direito sem melhora há 8 dias',
      patientName: 'João Silva',
      patientId: 'PAT001',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      isRead: false,
      actionRequired: true,
      metadata: {
        woundLocation: 'Pé direito',
        daysSinceLastUpdate: 8,
        analysisId: 'ANA001'
      }
    },
    {
      id: '2',
      type: 'urgent_unread',
      priority: 'high',
      title: 'Análise urgente não visualizada',
      description: 'Maria Santos - resultado crítico aguardando revisão há 3 horas',
      patientName: 'Maria Santos',
      patientId: 'PAT002',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: false,
      actionRequired: true,
      metadata: {
        analysisId: 'ANA002',
        urgencyLevel: 'critical'
      }
    },
    {
      id: '3',
      type: 'no_followup',
      priority: 'medium',
      title: 'Retorno não agendado',
      description: 'Carlos Oliveira - sem retorno agendado após análise de 5 dias',
      patientName: 'Carlos Oliveira',
      patientId: 'PAT003',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      isRead: true,
      actionRequired: true,
      metadata: {
        daysSinceLastUpdate: 5
      }
    },
    {
      id: '4',
      type: 'missed_consultation',
      priority: 'high',
      title: 'Teleconsulta perdida',
      description: 'Ana Costa - não compareceu à teleconsulta agendada',
      patientName: 'Ana Costa',
      patientId: 'PAT004',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      actionRequired: true,
      metadata: {
        consultationId: 'CONS001'
      }
    },
    {
      id: '5',
      type: 'medication_reminder',
      priority: 'low',
      title: 'Lembrete de medicação',
      description: 'Pedro Lima - verificar adesão ao tratamento prescrito',
      patientName: 'Pedro Lima',
      patientId: 'PAT005',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: true,
      actionRequired: false
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Calcular estatísticas
    const newStats: AlertStats = {
      total: alerts.length,
      critical: alerts.filter(a => a.priority === 'critical').length,
      high: alerts.filter(a => a.priority === 'high').length,
      medium: alerts.filter(a => a.priority === 'medium').length,
      low: alerts.filter(a => a.priority === 'low').length,
      unread: alerts.filter(a => !a.isRead).length,
      actionRequired: alerts.filter(a => a.actionRequired).length
    };
    setStats(newStats);
  }, [alerts]);

  useEffect(() => {
    // Filtrar alertas
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(alert => alert.priority === selectedPriority);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(alert => alert.type === selectedType);
    }

    // Ordenar por prioridade e data
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, selectedPriority, selectedType]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wound_stagnant': return <Activity className="w-4 h-4" />;
      case 'urgent_unread': return <Eye className="w-4 h-4" />;
      case 'no_followup': return <Calendar className="w-4 h-4" />;
      case 'missed_consultation': return <MessageSquare className="w-4 h-4" />;
      case 'medication_reminder': return <Stethoscope className="w-4 h-4" />;
      case 'critical_result': return <FileText className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wound_stagnant': return 'Ferida Estagnada';
      case 'urgent_unread': return 'Urgente Não Lida';
      case 'no_followup': return 'Sem Retorno';
      case 'missed_consultation': return 'Consulta Perdida';
      case 'medication_reminder': return 'Lembrete Medicação';
      case 'critical_result': return 'Resultado Crítico';
      default: return 'Outros';
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAsResolved = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleQuickAction = (alertItem: Alert, action: string) => {
    switch (action) {
      case 'call':
        // Simular ligação
        window.alert(`Ligando para ${alertItem.patientName}...`);
        break;
      case 'schedule':
        // Simular agendamento
        window.alert(`Agendando retorno para ${alertItem.patientName}...`);
        break;
      case 'view':
        // Simular visualização
        markAsRead(alertItem.id);
        window.alert(`Abrindo análise de ${alertItem.patientName}...`);
        break;
      case 'resolve':
        markAsResolved(alertItem.id);
        break;
    }
  };

  const refreshAlerts = () => {
    setIsLoading(true);
    // Simular refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleConfigureAlerts = () => {
    // Navegar para página de configurações de alertas
    navigate('/dashboard'); // Por enquanto volta para dashboard, pode ser uma página específica de configurações
  };

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-6 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumbs />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
              Alertas Médicos Inteligentes
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sistema proativo de monitoramento e alertas para cuidados médicos
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshAlerts}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" onClick={handleConfigureAlerts}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Críticos</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-500">{stats.critical}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Alta</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-500">{stats.high}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Média</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-500">{stats.medium}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Baixa</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-500">{stats.low}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Não Lidos</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-500">{stats.unread}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Ação Req.</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-500">{stats.actionRequired}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Buscar por paciente, tipo de alerta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">Todos os Tipos</option>
                <option value="wound_stagnant">Ferida Estagnada</option>
                <option value="urgent_unread">Urgente Não Lida</option>
                <option value="no_followup">Sem Retorno</option>
                <option value="missed_consultation">Consulta Perdida</option>
                <option value="medication_reminder">Lembrete Medicação</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Alertas */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando alertas...</span>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum alerta encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedPriority !== 'all' || selectedType !== 'all' 
                    ? 'Tente ajustar os filtros para ver mais resultados.'
                    : 'Parabéns! Não há alertas pendentes no momento.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`transition-all hover:shadow-md ${
                  !alert.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/20' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getTypeIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {getTypeLabel(alert.type)}
                          </Badge>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {alert.patientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(alert.createdAt, "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </span>
                          {alert.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Vence: {format(alert.dueDate, "dd/MM 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {alert.actionRequired && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction(alert, 'call')}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Ligar
                          </Button>
                          
                          {alert.type === 'no_followup' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickAction(alert, 'schedule')}
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Agendar
                            </Button>
                          )}
                          
                          {(alert.type === 'urgent_unread' || alert.type === 'wound_stagnant') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickAction(alert, 'view')}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          )}
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleQuickAction(alert, 'resolve')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasMedicos;