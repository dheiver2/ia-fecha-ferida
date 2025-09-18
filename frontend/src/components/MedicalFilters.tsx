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
      case 'completed': return <CheckCircle className="h-4 w-4 text-medical-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-medical-warning" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-medical-error" />;
      case 'reviewing': return <FileText className="h-4 w-4 text-primary" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-medical-error';
      case 'high': return 'bg-medical-warning';
      case 'normal': return 'bg-primary';
      case 'low': return 'bg-muted-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span className="text-gray-900 dark:text-gray-100">Filtros de Análise</span>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
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
            >
              {isExpanded ? 'Menos filtros' : 'Mais filtros'}
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-medical-error hover:text-medical-error/80"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por protocolo, paciente ou descrição..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 flex items-center text-gray-700 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 mr-1" />
              Status
            </Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
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

          <div>
            <Label className="text-sm font-medium mb-2 flex items-center">
              <Stethoscope className="h-4 w-4 mr-1" />
              Especialidade
            </Label>
            <Select value={filters.examType} onValueChange={(value) => updateFilter('examType', value)}>
              <SelectTrigger>
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

          <div>
            <Label className="text-sm font-medium mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" />
              Médico
            </Label>
            <Select value={filters.doctor} onValueChange={(value) => updateFilter('doctor', value)}>
              <SelectTrigger>
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

          <div>
            <Label className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Prioridade
            </Label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor('urgent')}`}></div>
                    <span>Urgente</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor('high')}`}></div>
                    <span>Alta</span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor('normal')}`}></div>
                    <span>Normal</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor('low')}`}></div>
                    <span>Baixa</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Período de Análise
                </Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
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
                      <Button variant="outline" size="sm" className="flex-1">
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
                <Label className="text-sm font-medium">
                  Confiança da Análise ({filters.confidenceRange.min}% - {filters.confidenceRange.max}%)
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
                    className="flex-1"
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
                    className="flex-1"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Starred Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Favoritos
                </Label>
                <Select 
                  value={filters.starred === null ? 'all' : filters.starred ? 'starred' : 'unstarred'} 
                  onValueChange={(value) => updateFilter('starred', 
                    value === 'all' ? null : value === 'starred'
                  )}
                >
                  <SelectTrigger>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeTag(tag)}
                    />
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
                      className="text-xs"
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalFilters;