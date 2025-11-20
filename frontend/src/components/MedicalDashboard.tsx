import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Activity, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalAnalyses: number;
  todayAnalyses: number;
  avgConfidence: number;
  pendingReviews: number;
  completedToday: number;
  criticalCases: number;
  avgProcessingTime: number;
  successRate: number;
}

interface MedicalDashboardProps {
  stats?: DashboardStats;
}

const defaultStats: DashboardStats = {
  totalAnalyses: 1247,
  todayAnalyses: 23,
  avgConfidence: 94.2,
  pendingReviews: 8,
  completedToday: 15,
  criticalCases: 3,
  avgProcessingTime: 28,
  successRate: 98.5
};

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ 
  stats = defaultStats 
}) => {
  const quickStats = [
    {
      title: "Análises Hoje",
      value: stats.todayAnalyses,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Confiança Média",
      value: `${stats.avgConfidence}%`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      change: "+2.1%",
      changeType: "positive" as const
    },
    {
      title: "Pendentes",
      value: stats.pendingReviews,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      change: "-3",
      changeType: "negative" as const
    },
    {
      title: "Taxa de Sucesso",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      change: "+0.3%",
      changeType: "positive" as const
    }
  ];

  const specialtyStats = [
    {
      name: "Dermatologia",
      cases: 456,
      accuracy: 96.8,
      icon: Eye,
      color: "bg-blue-500"
    },
    {
      name: "Cardiologia", 
      cases: 234,
      accuracy: 94.2,
      icon: Heart,
      color: "bg-red-500"
    },
    {
      name: "Neurologia",
      cases: 189,
      accuracy: 92.1,
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      name: "Clínica Geral",
      cases: 368,
      accuracy: 95.4,
      icon: Stethoscope,
      color: "bg-emerald-500"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard Médico
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Visão geral das análises e estatísticas do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium flex items-center ${
                        stat.changeType === 'positive' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.changeType === 'positive' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </span>
                      <span className="text-sm text-slate-400 ml-1">vs ontem</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Performance */}
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Performance do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tempo Médio de Processamento</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{stats.avgProcessingTime}s</span>
              </div>
              <Progress value={85} className="h-2 bg-slate-100 dark:bg-slate-700" indicatorClassName="bg-blue-600 dark:bg-blue-500" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Confiança Média</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{stats.avgConfidence}%</span>
              </div>
              <Progress value={stats.avgConfidence} className="h-2 bg-slate-100 dark:bg-slate-700" indicatorClassName="bg-purple-600 dark:bg-purple-500" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Taxa de Sucesso</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{stats.successRate}%</span>
              </div>
              <Progress value={stats.successRate} className="h-2 bg-slate-100 dark:bg-slate-700" indicatorClassName="bg-emerald-600 dark:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>Alertas Críticos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">
                      {stats.criticalCases} casos críticos
                    </p>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80">
                      Requerem atenção imediata
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">Urgente</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      {stats.pendingReviews} análises pendentes
                    </p>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                      Aguardando revisão médica
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">Pendente</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-emerald-700 dark:text-emerald-300">
                      Sistema operacional
                    </p>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                      Todos os serviços funcionando
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialty Statistics */}
      <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Estatísticas por Especialidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialtyStats.map((specialty, index) => {
              const Icon = specialty.icon;
              return (
                <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg shadow-sm ${specialty.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {specialty.name}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Casos</span>
                      <span className="font-medium text-slate-900 dark:text-white">{specialty.cases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Precisão</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{specialty.accuracy}%</span>
                    </div>
                    <Progress value={specialty.accuracy} className="h-1.5 bg-slate-200 dark:bg-slate-700" indicatorClassName={specialty.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalDashboard;