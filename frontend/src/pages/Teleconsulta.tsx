import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Phone, Users, Video, Clock, MapPin, ArrowRight, Plus, Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle, Mic, Monitor, Share2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';

const Teleconsulta: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Maria Silva",
      type: "Retorno",
      time: "14:30",
      date: "Hoje",
      status: "confirmed",
      avatar: "MS",
      duration: "30 min"
    },
    {
      id: 2,
      patient: "João Santos",
      type: "Primeira Consulta",
      time: "15:15",
      date: "Hoje",
      status: "pending",
      avatar: "JS",
      duration: "45 min"
    },
    {
      id: 3,
      patient: "Ana Oliveira",
      type: "Acompanhamento",
      time: "09:00",
      date: "Amanhã",
      status: "confirmed",
      avatar: "AO",
      duration: "30 min"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 space-y-8 animate-in fade-in duration-500">
        <Breadcrumbs />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <Video className="h-6 w-6 lg:h-8 lg:w-8 text-white flex-shrink-0" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Telemedicina
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Gerencie suas consultas virtuais e atendimentos remotos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Agenda Completa
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              <Plus className="mr-2 h-4 w-4" />
              Nova Consulta
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Ações e Próximas Consultas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cards de Ação Rápida */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="group relative overflow-hidden border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Iniciar Videochamada</CardTitle>
                  <CardDescription>Começar atendimento imediato</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Inicie uma sala de conferência segura para atendimento remoto com vídeo e áudio em alta definição.
                  </p>
                  <Link to="/video">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:translate-x-1 transition-transform">
                      Iniciar Agora <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-xl">Agendar Consulta</CardTitle>
                  <CardDescription>Marcar para data futura</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Agende novas consultas, configure lembretes automáticos e gerencie a disponibilidade.
                  </p>
                  <Button variant="outline" className="w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:hover:bg-emerald-900/20">
                    Agendar <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Consultas */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Próximas Consultas</CardTitle>
                  <CardDescription>Seus agendamentos para hoje e amanhã</CardDescription>
                </div>
                <Tabs defaultValue="upcoming" className="w-auto">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                          <span className="text-xs font-medium text-slate-500 uppercase">{apt.date}</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white">{apt.time}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {apt.patient}
                            {apt.status === 'confirmed' && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] h-5 px-1.5">Confirmado</Badge>
                            )}
                            {apt.status === 'pending' && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[10px] h-5 px-1.5">Pendente</Badge>
                            )}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              {apt.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {apt.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Entrar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button variant="ghost" className="w-full text-slate-500 hover:text-blue-600">
                  Ver agenda completa <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Coluna Lateral - Status e Ferramentas */}
          <div className="space-y-6">
            {/* Status do Sistema */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  Verificação de Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                      <Video className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Câmera</span>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                      <Mic className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Microfone</span>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                      <Share2 className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Conexão</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">Estável</span>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Settings className="mr-2 h-3 w-3" />
                  Configurar Dispositivos
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-100">Atendimentos Hoje</h3>
                  <Users className="h-5 w-5 text-blue-200" />
                </div>
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="flex items-center text-sm text-blue-200">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-white mr-2">+3</span>
                  que ontem
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">4h 30m</div>
                    <div className="text-xs text-blue-200">Tempo em chamada</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-xs text-blue-200">Avaliação média</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Teleconsulta };
export default Teleconsulta;