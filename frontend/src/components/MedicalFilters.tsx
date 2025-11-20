import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Calendar } from './ui/calendar';
import { 
  Filter, 
  Search, 
  Calendar as CalendarIcon, 
  X,
  Stethoscope,
  User,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface FilterOptions {
  searchTerm: string;
  status: string;
  examType: string;
  doctor: string;
  priority: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  confidenceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  starred: boolean | null;
  department?: string;
  followUpRequired?: boolean;
}

interface MedicalFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  availableOptions?: {
    examTypes: string[];
    doctors: string[];
    tags: string[];
  };
}

const defaultOptions = {
  examTypes: [
    'Dermatologia',
    'Cardiologia', 
    'Neurologia',
    'Radiologia',
    'Oftalmologia',
    'Ortopedia',
    'Clínica Geral'
  ],
  doctors: [
    'Médico Laudador'
  ],
  tags: [
    'Urgente',
    'Revisão',
    'Complexo',
    'Rotina',
    'Seguimento',
    'Primeira consulta'
  ]
};

export const MedicalFilters: React.FC<MedicalFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  availableOptions = defaultOptions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag));
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.status !== 'all' ||
      filters.examType !== 'all' ||
      filters.doctor !== 'all' ||
      filters.priority !== 'all' ||
      filters.dateRange.from ||
      filters.dateRange.to ||
      filters.confidenceRange.min > 0 ||
      filters.confidenceRange.max < 100 ||
      filters.tags.length > 0 ||
      filters.starred !== null
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'reviewing': return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-slate-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <Card className="w-full border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-md">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg text-slate-900 dark:text-white">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Filtros de Análise</span>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                {Object.values(filters).filter(v => 
                  v && v !== 'all' && v !== '' && 
                  (Array.isArray(v) ? v.length > 0 : true)
                ).length} ativos
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {isExpanded ? 'Menos filtros' : 'Mais filtros'}
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por protocolo, paciente ou descrição..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 h-11"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
              Status
            </Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('completed')}
                    <span>Concluído</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('pending')}
                    <span>Pendente</span>
                  </div>
                </SelectItem>
                <SelectItem value="reviewing">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('reviewing')}
                    <span>Em Revisão</span>
                  </div>
                </SelectItem>
                <SelectItem value="error">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('error')}
                    <span>Erro</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
              <Stethoscope className="h-4 w-4 mr-2 text-blue-500" />
              Especialidade
            </Label>
            <Select value={filters.examType} onValueChange={(value) => updateFilter('examType', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {availableOptions.examTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
              <User className="h-4 w-4 mr-2 text-purple-500" />
              Médico
            </Label>
            <Select value={filters.doctor} onValueChange={(value) => updateFilter('doctor', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableOptions.doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Prioridade
            </Label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor('urgent')}`}></div>
                    <span>Urgente</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor('high')}`}></div>
                    <span>Alta</span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor('normal')}`}></div>
                    <span>Normal</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor('low')}`}></div>
                    <span>Baixa</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                  <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                  Período de Análise
                </Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {filters.dateRange.from 
                          ? format(filters.dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                          : 'Data inicial'
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from || undefined}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date || null })}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                        {filters.dateRange.to 
                          ? format(filters.dateRange.to, 'dd/MM/yyyy', { locale: ptBR })
                          : 'Data final'
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to || undefined}
                        onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date || null })}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Confidence Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-slate-400" />
                  Confiança ({filters.confidenceRange.min}% - {filters.confidenceRange.max}%)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.confidenceRange.min}
                    onChange={(e) => updateFilter('confidenceRange', {
                      ...filters.confidenceRange,
                      min: parseInt(e.target.value) || 0
                    })}
                    className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.confidenceRange.max}
                    onChange={(e) => updateFilter('confidenceRange', {
                      ...filters.confidenceRange,
                      max: parseInt(e.target.value) || 100
                    })}
                    className="flex-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Starred Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center text-slate-700 dark:text-slate-300">
                  <Star className="h-4 w-4 mr-2 text-amber-400" />
                  Favoritos
                </Label>
                <Select 
                  value={filters.starred === null ? 'all' : filters.starred ? 'starred' : 'unstarred'} 
                  onValueChange={(value) => updateFilter('starred', 
                    value === 'all' ? null : value === 'starred'
                  )}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="starred">Apenas favoritos</SelectItem>
                    <SelectItem value="unstarred">Não favoritos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3 mt-6">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                {filters.tags.length === 0 && (
                  <span className="text-slate-400 text-sm italic self-center">Nenhuma tag selecionada</span>
                )}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm pl-2 pr-1 py-1">
                    <span>{tag}</span>
                    <button 
                      className="ml-1 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-colors" 
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableOptions.tags
                  .filter(tag => !filters.tags.includes(tag))
                  .map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalFilters;