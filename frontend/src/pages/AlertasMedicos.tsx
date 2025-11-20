import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle, Clock, Filter, Search, Activity, ArrowUpRight, Siren } from 'lucide-react';
import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

const AlertasMedicos: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 p-8 lg:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-red-100 mb-4">
                <Siren className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium uppercase tracking-wider">Monitoramento em Tempo Real</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Central de Alertas
              </h1>
              <p className="text-red-50 text-lg lg:text-xl max-w-xl leading-relaxed">
                Gerencie notificações críticas e acompanhe a evolução dos pacientes com prioridade inteligente.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[100px]">
                <div className="text-3xl font-bold">3</div>
                <div className="text-xs text-red-100 uppercase tracking-wide font-medium">Críticos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[100px]">
                <div className="text-3xl font-bold">12</div>
                <div className="text-xs text-red-100 uppercase tracking-wide font-medium">Novos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="sticky top-20 z-30 -mx-4 px-4 py-4 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-y border-slate-200 dark:border-slate-800 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-rose-500 transition-colors" />
              <input 
                placeholder="Buscar alertas..." 
                className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button variant="outline" size="sm" className="rounded-full border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:text-rose-600 bg-white dark:bg-slate-900">
                <Filter className="mr-2 h-3 w-3" />
                Filtrar
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
              <Badge variant="secondary" className="cursor-pointer hover:bg-rose-100 hover:text-rose-700 transition-colors px-3 py-1.5 rounded-full">Todos</Badge>
              <Badge variant="outline" className="cursor-pointer hover:border-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-full bg-white dark:bg-slate-900">Críticos</Badge>
              <Badge variant="outline" className="cursor-pointer hover:border-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-full bg-white dark:bg-slate-900">Atenção</Badge>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="grid gap-4">
          {[1, 2, 3].map((alert) => (
            <Card key={alert} className="group border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 group-hover:w-2 transition-all duration-300"></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Infecção Detectada</h3>
                        <Badge variant="destructive" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">Crítico</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Paciente: João Silva • ID: #8492
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Há 15 minutos
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto pl-14 md:pl-0">
                    <Button variant="outline" className="flex-1 md:flex-none border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Ignorar
                    </Button>
                    <Button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
                      Ver Detalhes
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {[1, 2].map((alert) => (
            <Card key={`warning-${alert}`} className="group border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 group-hover:w-2 transition-all duration-300"></div>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Alteração na Cicatrização</h3>
                        <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">Atenção</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Paciente: Maria Oliveira • ID: #9231
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Há 2 horas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto pl-14 md:pl-0">
                    <Button variant="outline" className="flex-1 md:flex-none border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Arquivar
                    </Button>
                    <Button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white">
                      Analisar
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export { AlertasMedicos };
export default AlertasMedicos;