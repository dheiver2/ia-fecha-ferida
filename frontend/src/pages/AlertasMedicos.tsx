import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Bell, Info, CheckCircle2, XCircle, Filter, Search, MoreVertical, Clock, ArrowRight, Settings, ShieldAlert, Activity } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

const AlertasMedicos: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Paciente em Risco Elevado',
      description: 'Análise de imagem detectou sinais de infecção avançada no paciente João Silva.',
      time: '10 min atrás',
      patient: 'João Silva',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Retorno Pendente',
      description: 'Paciente Maria Oliveira não compareceu ao retorno agendado.',
      time: '2 horas atrás',
      patient: 'Maria Oliveira',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Atualização de Protocolo',
      description: 'Novas diretrizes para tratamento de feridas diabéticas disponíveis.',
      time: '1 dia atrás',
      patient: null,
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Alta Médica Aprovada',
      description: 'Paciente Carlos Santos atingiu critérios de cicatrização completa.',
      time: '2 dias atrás',
      patient: 'Carlos Santos',
      read: true
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <ShieldAlert className="h-5 w-5 text-amber-600" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30';
      case 'warning': return 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30';
      case 'success': return 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30';
      default: return 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 space-y-8 animate-in fade-in duration-500">
        <Breadcrumbs />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
                <Bell className="h-6 w-6 lg:h-8 lg:w-8 text-white flex-shrink-0" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Central de Alertas
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Monitoramento em tempo real e notificações críticas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Settings className="mr-2 h-4 w-4" />
              Configurar Notificações
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Lista de Alertas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtrar por:</span>
                <div className="flex gap-2 ml-2">
                  <Badge 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => setFilter('all')}
                  >
                    Todos
                  </Badge>
                  <Badge 
                    variant={filter === 'critical' ? 'destructive' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => setFilter('critical')}
                  >
                    Críticos
                  </Badge>
                  <Badge 
                    variant={filter === 'unread' ? 'secondary' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => setFilter('unread')}
                  >
                    Não lidos
                  </Badge>
                </div>
              </div>
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar alertas..." 
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`relative group p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${getAlertColor(alert.type)} ${!alert.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-sm flex-shrink-0`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {alert.title}
                          {!alert.read && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                        {alert.description}
                      </p>
                      {alert.patient && (
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 text-xs font-normal">
                            Paciente: {alert.patient}
                          </Badge>
                          <Button size="sm" variant="link" className="h-auto p-0 text-blue-600 dark:text-blue-400 text-xs">
                            Ver prontuário <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <CheckCircle2 className="h-4 w-4 text-slate-500 hover:text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <XCircle className="h-4 w-4 text-slate-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Lateral - Resumo e Configurações */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Resumo de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">3</div>
                    <div className="text-xs font-medium text-red-800 dark:text-red-200 mt-1">Críticos</div>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">5</div>
                    <div className="text-xs font-medium text-amber-800 dark:text-amber-200 mt-1">Avisos</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">Canais de Notificação</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Push Web</span>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 flex items-center justify-center text-xs font-bold text-slate-500">@</div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Email</span>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">SMS / WhatsApp</span>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button variant="ghost" className="w-full text-slate-500 hover:text-blue-600 text-sm">
                  Gerenciar preferências
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ShieldAlert className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">IA Monitor</h3>
                    <p className="text-xs text-slate-300">Análise preditiva ativa</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  O sistema está monitorando 124 pacientes ativos em busca de anomalias nos padrões de recuperação.
                </p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                  <div className="bg-green-400 h-1.5 rounded-full w-[98%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Status do Sistema</span>
                  <span className="text-green-400">Operacional</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertasMedicos;