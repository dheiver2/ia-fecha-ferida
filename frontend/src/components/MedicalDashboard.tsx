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
  Eye
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
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Confiança Média",
      value: `${stats.avgConfidence}%`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      change: "+2.1%",
      changeType: "positive" as const
    },
    {
      title: "Pendentes",
      value: stats.pendingReviews,
      icon: Clock,
      color: "text-medical-warning",
      bgColor: "bg-medical-warning/10",
      change: "-3",
      changeType: "negative" as const
    },
    {
      title: "Taxa de Sucesso",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      color: "text-medical-success",
      bgColor: "bg-medical-success/10",
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
      color: "bg-primary"
    },
    {
      name: "Cardiologia", 
      cases: 234,
      accuracy: 94.2,
      icon: Heart,
      color: "bg-medical-error"
    },
    {
      name: "Neurologia",
      cases: 189,
      accuracy: 92.1,
      icon: Brain,
      color: "bg-accent"
    },
    {
      name: "Clínica Geral",
      cases: 368,
      accuracy: 95.4,
      icon: Stethoscope,
      color: "bg-medical-success"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Dashboard Médico
          </h2>
          <p className="text-muted-foreground mt-1">
            Visão geral das análises e estatísticas do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
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
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' 
                          ? 'text-medical-success' 
                          : 'text-medical-error'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">vs ontem</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Performance do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tempo Médio de Processamento</span>
                <span className="text-sm text-gray-600">{stats.avgProcessingTime}s</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Confiança Média</span>
                <span className="text-sm text-gray-600">{stats.avgConfidence}%</span>
              </div>
              <Progress value={stats.avgConfidence} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Taxa de Sucesso</span>
                <span className="text-sm text-gray-600">{stats.successRate}%</span>
              </div>
              <Progress value={stats.successRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-medical-warning" />
              <span>Alertas Críticos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-medical-error/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-medical-error rounded-full"></div>
                  <div>
                    <p className="font-medium text-medical-error">
                      {stats.criticalCases} casos críticos
                    </p>
                    <p className="text-sm text-medical-error/80">
                      Requerem atenção imediata
                    </p>
                  </div>
                </div>
                <Badge variant="destructive">Urgente</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-medical-warning/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-medical-warning rounded-full"></div>
                  <div>
                    <p className="font-medium text-medical-warning">
                      {stats.pendingReviews} análises pendentes
                    </p>
                    <p className="text-sm text-medical-warning/80">
                      Aguardando revisão médica
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Pendente</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-medical-success/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-medical-success rounded-full"></div>
                  <div>
                    <p className="font-medium text-medical-success">
                      Sistema operacional
                    </p>
                    <p className="text-sm text-medical-success/80">
                      Todos os serviços funcionando
                    </p>
                  </div>
                </div>
                <Badge className="bg-medical-success hover:bg-medical-success/90 text-white">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specialty Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Estatísticas por Especialidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialtyStats.map((specialty, index) => {
              const Icon = specialty.icon;
              return (
                <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${specialty.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {specialty.name}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Casos</span>
                      <span className="font-medium text-foreground">{specialty.cases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Precisão</span>
                      <span className="font-medium text-medical-success">{specialty.accuracy}%</span>
                    </div>
                    <Progress value={specialty.accuracy} className="h-1" />
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