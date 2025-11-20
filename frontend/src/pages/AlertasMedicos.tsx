import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  Info, 
  CheckCircle2, 
  Clock, 
  X, 
  Filter,
  Settings,
  Trash2,
  CheckCheck
} from 'lucide-react';
import Header from '@/components/Header';

type AlertType = 'critical' | 'warning' | 'info' | 'success';

interface MedicalAlert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  timestamp: string;
  read: boolean;
  patientId?: string;
  patientName?: string;
}

const AlertasMedicos: React.FC = () => {
  const [alerts, setAlerts] = useState<MedicalAlert[]>([
    {
      id: '1',
      title: 'Paciente em Risco Alto',
      message: 'O paciente João Silva apresentou piora nos sinais vitais nas últimas 2 horas.',
      type: 'critical',
      timestamp: 'Há 10 min',
      read: false,
      patientName: 'João Silva'
    },
    {
      id: '2',
      title: 'Resultado de Exame Disponível',
      message: 'Os resultados laboratoriais de Maria Santos já estão disponíveis para análise.',
      type: 'success',
      timestamp: 'Há 45 min',
      read: false,
      patientName: 'Maria Santos'
    },
    {
      id: '3',
      title: 'Lembrete de Follow-up',
      message: 'Consulta de retorno agendada para amanhã com Carlos Oliveira.',
      type: 'info',
      timestamp: 'Há 2 horas',
      read: true,
      patientName: 'Carlos Oliveira'
    },
    {
      id: '4',
      title: 'Interação Medicamentosa',
      message: 'Alerta de possível interação entre medicamentos prescritos para Ana Costa.',
      type: 'warning',
      timestamp: 'Há 3 horas',
      read: true,
      patientName: 'Ana Costa'
    },
    {
      id: '5',
      title: 'Atualização de Protocolo',
      message: 'Novas diretrizes para tratamento de feridas crônicas foram publicadas.',
      type: 'info',
      timestamp: 'Ontem',
      read: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: AlertType) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary'; // Yellowish usually handled by custom class or secondary
      case 'success': return 'default'; // Green usually default or custom
      case 'info': return 'outline';
    }
  };

  const getBadgeClass = (type: AlertType) => {
    switch (type) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'info': return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
      default: return '';
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'unread') return !alert.read;
    if (activeTab === 'critical') return alert.type === 'critical';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                Central de Alertas
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie notificações clínicas e avisos do sistema
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Marcar todos como lidos
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats */}
            <div className="space-y-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Críticos</p>
                    <p className="text-2xl font-bold text-destructive">
                      {alerts.filter(a => a.type === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive/50" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Não Lidos</p>
                    <p className="text-2xl font-bold text-primary">
                      {unreadCount}
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-primary/50" />
                </CardContent>
              </Card>
            </div>

            {/* Main List */}
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList>
                          <TabsTrigger value="all">Todos</TabsTrigger>
                          <TabsTrigger value="unread">Não Lidos</TabsTrigger>
                          <TabsTrigger value="critical">Críticos</TabsTrigger>
                        </TabsList>
                        
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Limpar
                        </Button>
                      </div>

                      <TabsContent value="all" className="mt-0">
                        <ScrollArea className="h-[600px] pr-4">
                          <div className="space-y-3">
                            {filteredAlerts.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhum alerta encontrado</p>
                              </div>
                            ) : (
                              filteredAlerts.map((alert) => (
                                <Alert 
                                  key={alert.id} 
                                  className={`transition-all duration-200 hover:shadow-md ${!alert.read ? 'bg-muted/30 border-l-4 border-l-primary' : 'opacity-80'}`}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                      {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <AlertTitle className="text-base font-semibold flex items-center gap-2 mb-0">
                                          {alert.title}
                                          {!alert.read && (
                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">NOVO</Badge>
                                          )}
                                        </AlertTitle>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                          <Clock className="h-3 w-3" />
                                          {alert.timestamp}
                                        </span>
                                      </div>
                                      
                                      <AlertDescription className="text-sm text-muted-foreground mt-1">
                                        {alert.message}
                                      </AlertDescription>
                                      
                                      {alert.patientName && (
                                        <div className="mt-3 flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs font-normal">
                                            Paciente: {alert.patientName}
                                          </Badge>
                                          <Badge className={`text-xs font-normal ${getBadgeClass(alert.type)}`} variant={getBadgeVariant(alert.type) as any}>
                                            {alert.type.toUpperCase()}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                      {!alert.read && (
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-primary hover:text-primary/80"
                                          onClick={() => markAsRead(alert.id)}
                                          title="Marcar como lido"
                                        >
                                          <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteAlert(alert.id)}
                                        title="Excluir"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Alert>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="unread" className="mt-0">
                        {/* Same structure, filtered by logic above */}
                        <ScrollArea className="h-[600px] pr-4">
                          <div className="space-y-3">
                            {filteredAlerts.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <p>Nenhum alerta não lido</p>
                              </div>
                            ) : (
                              filteredAlerts.map((alert) => (
                                <Alert 
                                  key={alert.id} 
                                  className="transition-all duration-200 hover:shadow-md bg-muted/30 border-l-4 border-l-primary"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                      {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <AlertTitle className="text-base font-semibold flex items-center gap-2 mb-0">
                                          {alert.title}
                                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">NOVO</Badge>
                                        </AlertTitle>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                          <Clock className="h-3 w-3" />
                                          {alert.timestamp}
                                        </span>
                                      </div>
                                      <AlertDescription className="text-sm text-muted-foreground mt-1">
                                        {alert.message}
                                      </AlertDescription>
                                      {alert.patientName && (
                                        <div className="mt-3 flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs font-normal">
                                            Paciente: {alert.patientName}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-primary hover:text-primary/80"
                                        onClick={() => markAsRead(alert.id)}
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Alert>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="critical" className="mt-0">
                         <ScrollArea className="h-[600px] pr-4">
                          <div className="space-y-3">
                            {filteredAlerts.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground">
                                <p>Nenhum alerta crítico</p>
                              </div>
                            ) : (
                              filteredAlerts.map((alert) => (
                                <Alert 
                                  key={alert.id} 
                                  className={`transition-all duration-200 hover:shadow-md ${!alert.read ? 'bg-muted/30' : ''}`}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                      {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <AlertTitle className="text-base font-semibold flex items-center gap-2 mb-0">
                                          {alert.title}
                                        </AlertTitle>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                          <Clock className="h-3 w-3" />
                                          {alert.timestamp}
                                        </span>
                                      </div>
                                      <AlertDescription className="text-sm text-muted-foreground mt-1">
                                        {alert.message}
                                      </AlertDescription>
                                    </div>
                                  </div>
                                </Alert>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertasMedicos;