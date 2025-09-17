import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';

interface MedicalStatsProps {
  data?: {
    weeklyAnalyses: Array<{ day: string; analyses: number; accuracy: number }>;
    specialtyDistribution: Array<{ name: string; value: number; color: string }>;
    monthlyTrends: Array<{ month: string; total: number; success: number; pending: number }>;
    performanceMetrics: {
      avgProcessingTime: number;
      avgAccuracy: number;
      totalAnalyses: number;
      successRate: number;
      criticalCases: number;
      pendingReviews: number;
    };
  };
}

const defaultData = {
  weeklyAnalyses: [
    { day: 'Seg', analyses: 45, accuracy: 94.2 },
    { day: 'Ter', analyses: 52, accuracy: 95.1 },
    { day: 'Qua', analyses: 38, accuracy: 93.8 },
    { day: 'Qui', analyses: 61, accuracy: 96.3 },
    { day: 'Sex', analyses: 48, accuracy: 94.7 },
    { day: 'Sáb', analyses: 23, accuracy: 92.1 },
    { day: 'Dom', analyses: 15, accuracy: 91.5 }
  ],
  specialtyDistribution: [
    { name: 'Dermatologia', value: 35, color: '#8B5CF6' },
    { name: 'Cardiologia', value: 25, color: '#EF4444' },
    { name: 'Neurologia', value: 20, color: '#3B82F6' },
    { name: 'Radiologia', value: 15, color: '#10B981' },
    { name: 'Outros', value: 5, color: '#F59E0B' }
  ],
  monthlyTrends: [
    { month: 'Jan', total: 1200, success: 1150, pending: 50 },
    { month: 'Fev', total: 1350, success: 1290, pending: 60 },
    { month: 'Mar', total: 1180, success: 1120, pending: 60 },
    { month: 'Abr', total: 1420, success: 1380, pending: 40 },
    { month: 'Mai', total: 1380, success: 1340, pending: 40 },
    { month: 'Jun', total: 1520, success: 1485, pending: 35 }
  ],
  performanceMetrics: {
    avgProcessingTime: 28,
    avgAccuracy: 94.2,
    totalAnalyses: 8250,
    successRate: 98.5,
    criticalCases: 12,
    pendingReviews: 45
  }
};

export const MedicalStats: React.FC<MedicalStatsProps> = ({ 
  data = defaultData 
}) => {
  const { weeklyAnalyses, specialtyDistribution, monthlyTrends, performanceMetrics } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'accuracy' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Estatísticas Médicas
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Análise detalhada do desempenho e tendências do sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
            Últimos 30 dias
          </span>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total de Análises
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {performanceMetrics.totalAnalyses.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">+12.5%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Precisão Média
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatPercentage(performanceMetrics.avgAccuracy)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">+2.1%</span>
                  <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tempo Médio
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {performanceMetrics.avgProcessingTime}s
                </p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">-8.2%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-50 dark:bg-orange-900/20">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Taxa de Sucesso
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatPercentage(performanceMetrics.successRate)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">+0.8%</span>
                  <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Análises da Semana</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAnalyses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="analyses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Specialty Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-purple-600" />
              <span>Distribuição por Especialidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specialtyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {specialtyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {specialtyDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Tendências Mensais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="success" 
                stackId="2" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stackId="3" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Precisão Geral</span>
                <span className="text-sm text-gray-600">
                  {formatPercentage(performanceMetrics.avgAccuracy)}
                </span>
              </div>
              <Progress value={performanceMetrics.avgAccuracy} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Taxa de Sucesso</span>
                <span className="text-sm text-gray-600">
                  {formatPercentage(performanceMetrics.successRate)}
                </span>
              </div>
              <Progress value={performanceMetrics.successRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Eficiência de Tempo</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    {performanceMetrics.criticalCases} casos críticos
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Requerem atenção imediata
                  </p>
                </div>
              </div>
              <Badge variant="destructive">Urgente</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-200">
                    {performanceMetrics.pendingReviews} revisões pendentes
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Aguardando validação médica
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Pendente</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Sistema operacional
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Todos os serviços funcionando
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Normal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalStats;