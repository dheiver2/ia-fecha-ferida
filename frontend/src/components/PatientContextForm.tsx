import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { User, Calendar, Stethoscope, FileText, AlertCircle, ChevronDown, ChevronUp, Activity, ClipboardList, HeartPulse } from 'lucide-react';

export interface PatientContext {
  // Dados básicos
  nome?: string;
  idade?: string;
  sexo?: string;
  localAtendimento?: string;
  
  // Queixa Principal (QP)
  queixaPrincipal?: string[];
  queixaOutro?: string;
  
  // História da Doença Atual (HDA)
  historiaDoencaAtual?: string[];
  hdaOutro?: string;
  
  // Exame Físico (ExF)
  pressaoArterial?: string;
  exameFisico?: string[];
  exfOutro?: string;
  
  // Conduta
  conduta?: string[];
  condutaOutro?: string;
  
  // Avaliação do Pulso - Artéria Dorsal do Pé
  avaliacaoPulso?: string;
  
  // Campos originais mantidos para compatibilidade
  hipoteseDiagnostica?: string;
  historiaClinica?: string;
  sintomas?: string;
  medicacoes?: string;
  alergias?: string;
  sinaisVitais?: string;
  localizacaoLesao?: string;
  tempoEvolucao?: string;
  tratamentoPrevio?: string;
  observacoes?: string;
}

interface PatientContextFormProps {
  onContextChange: (context: PatientContext) => void;
  initialContext?: PatientContext;
}

export const PatientContextForm: React.FC<PatientContextFormProps> = ({ 
  onContextChange, 
  initialContext = {} 
}) => {
  const [context, setContext] = useState<PatientContext>(initialContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // Função auxiliar para garantir que o valor seja um array
  const ensureArray = (value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

  const updateContext = (field: keyof PatientContext, value: string | string[]) => {
    const newContext = { ...context, [field]: value };
    setContext(newContext);
    onContextChange(newContext);
  };

  const updateCheckboxArray = (field: keyof PatientContext, value: string, checked: boolean) => {
    const currentArray = (context[field] as string[]) || [];
    let newArray: string[];
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    updateContext(field, newArray);
  };

  const clearForm = () => {
    const emptyContext: PatientContext = {};
    setContext(emptyContext);
    onContextChange(emptyContext);
  };

  return (
    <Card className="w-full border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
            </div>
            <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Informações do Paciente</CardTitle>
                <CardDescription className="text-xs mt-1">
                Dados clínicos para aumentar a precisão da IA
                </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:bg-primary/10 hover:text-primary"
          >
            {isExpanded ? (
                <>
                    <span className="mr-2">Recolher</span>
                    <ChevronUp className="h-4 w-4" />
                </>
            ) : (
                <>
                    <span className="mr-2">Expandir</span>
                    <ChevronDown className="h-4 w-4" />
                </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Dados Básicos - Sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Nome do Paciente</Label>
            <Input
              id="nome"
              placeholder="Nome completo"
              value={context.nome || ''}
              onChange={(e) => updateContext('nome', e.target.value)}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Idade</Label>
            <Input
              id="idade"
              placeholder="Ex: 45"
              value={context.idade || ''}
              onChange={(e) => updateContext('idade', e.target.value)}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sexo" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Sexo</Label>
            <Select value={context.sexo || ''} onValueChange={(value) => updateContext('sexo', value)}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="local-atendimento" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Local</Label>
            <Input
              id="local-atendimento"
              placeholder="Ex: UBS, Hospital..."
              value={context.localAtendimento || ''}
              onChange={(e) => updateContext('localAtendimento', e.target.value)}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary"
            />
          </div>
        </div>

        {/* Informações Clínicas Básicas */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hipotese" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Stethoscope className="w-4 h-4 text-primary" />
                Hipótese Diagnóstica
            </Label>
            <Input
              id="hipotese"
              placeholder="Ex: Lesão cutânea suspeita, ferida infectada..."
              value={context.hipoteseDiagnostica || ''}
              onChange={(e) => updateContext('hipoteseDiagnostica', e.target.value)}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sintomas" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Activity className="w-4 h-4 text-primary" />
                Sintomas Principais
            </Label>
            <Textarea
              id="sintomas"
              placeholder="Ex: Dor, coceira, vermelhidão, secreção..."
              value={context.sintomas || ''}
              onChange={(e) => updateContext('sintomas', e.target.value)}
              rows={2}
              className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Seção Expandida com Animação */}
        <div className={`space-y-8 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700' : 'max-h-0 opacity-0'}`}>
            
            {/* Queixa Principal */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                Queixa Principal (QP)
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                   <Checkbox
                     id="qp-ferida-perna"
                     checked={(context.queixaPrincipal || []).includes('Ferida na perna direita há 3 meses')}
                     onCheckedChange={(checked) => updateCheckboxArray('queixaPrincipal', 'Ferida na perna direita há 3 meses', checked as boolean)}
                   />
                   <Label htmlFor="qp-ferida-perna" className="cursor-pointer font-normal">Ferida na perna direita há 3 meses</Label>
                 </div>
                 <div className="space-y-2 pt-2">
                   <div className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                     <Checkbox
                       id="qp-outro"
                       checked={ensureArray(context.queixaPrincipal).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.queixaPrincipal).filter(item => !item.startsWith('Outro:'));
                           updateContext('queixaPrincipal', filtered);
                         }
                       }}
                     />
                     <Label htmlFor="qp-outro" className="cursor-pointer font-normal">Outro:</Label>
                   </div>
                  <Input
                    placeholder="Descreva outra queixa..."
                    value={(ensureArray(context.queixaPrincipal).find(item => item.startsWith('Outro:')) || '').replace('Outro: ', '')}
                    onChange={(e) => {
                      const filtered = ensureArray(context.queixaPrincipal).filter(item => !item.startsWith('Outro:'));
                      if (e.target.value.trim()) {
                        updateContext('queixaPrincipal', [...filtered, `Outro: ${e.target.value}`]);
                      } else {
                        updateContext('queixaPrincipal', filtered);
                      }
                    }}
                    className="ml-9 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* História da Doença Atual */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                História da Doença Atual (HDA)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['DM', 'HAS', 'Início após trauma leve', 'Dor mínima', 'Edema crônico'].map((item) => (
                   <div key={item} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                     <Checkbox
                       id={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.historiaDoencaAtual || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('historiaDoencaAtual', item, checked as boolean)}
                     />
                     <Label htmlFor={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`} className="cursor-pointer font-normal">{item}</Label>
                   </div>
                 ))}
               </div>
               <div className="space-y-2 pt-2">
                   <div className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                     <Checkbox
                       id="hda-outro"
                       checked={ensureArray(context.historiaDoencaAtual).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.historiaDoencaAtual).filter(item => !item.startsWith('Outro:'));
                           updateContext('historiaDoencaAtual', filtered);
                         }
                       }}
                     />
                     <Label htmlFor="hda-outro" className="cursor-pointer font-normal">Outro:</Label>
                   </div>
                <Input
                  placeholder="Descreva outro aspecto da HDA..."
                  value={(ensureArray(context.historiaDoencaAtual).find(item => item.startsWith('Outro:')) || '').replace('Outro: ', '')}
                  onChange={(e) => {
                    const filtered = ensureArray(context.historiaDoencaAtual).filter(item => !item.startsWith('Outro:'));
                    if (e.target.value.trim()) {
                      updateContext('historiaDoencaAtual', [...filtered, `Outro: ${e.target.value}`]);
                    } else {
                      updateContext('historiaDoencaAtual', filtered);
                    }
                  }}
                  className="ml-9 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Exame Físico */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-green-500" />
                Exame Físico (ExF)
              </h3>
              
              <div className="space-y-2 mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="pressao-arterial" className="text-xs font-semibold uppercase text-muted-foreground">PA (mmHg)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="pressao-arterial"
                    placeholder="120"
                    value={context.pressaoArterial?.split('/')[0] || ''}
                    onChange={(e) => {
                      const sistolica = e.target.value;
                      const diastolica = context.pressaoArterial?.split('/')[1] || '';
                      updateContext('pressaoArterial', `${sistolica}/${diastolica}`);
                    }}
                    className="w-24 text-center font-mono"
                  />
                  <span className="text-muted-foreground font-light">/</span>
                  <Input
                    placeholder="80"
                    value={context.pressaoArterial?.split('/')[1] || ''}
                    onChange={(e) => {
                      const sistolica = context.pressaoArterial?.split('/')[0] || '';
                      const diastolica = e.target.value;
                      updateContext('pressaoArterial', `${sistolica}/${diastolica}`);
                    }}
                    className="w-24 text-center font-mono"
                  />
                  <span className="text-sm text-muted-foreground ml-2">mmHg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                 {['Úlcera medial em MMII direito', 'Bordas irregulares', 'Exsudato moderado'].map((item) => (
                   <div key={item} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                     <Checkbox
                       id={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.exameFisico || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('exameFisico', item, checked as boolean)}
                     />
                     <Label htmlFor={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`} className="cursor-pointer font-normal">{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2 pt-2">
                 <div className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                   <Checkbox
                     id="exf-outro"
                     checked={ensureArray(context.exameFisico).some(item => item.startsWith('Outro:'))}
                     onCheckedChange={(checked) => {
                       if (!checked) {
                         const filtered = ensureArray(context.exameFisico).filter(item => !item.startsWith('Outro:'));
                         updateContext('exameFisico', filtered);
                       }
                     }}
                   />
                   <Label htmlFor="exf-outro" className="cursor-pointer font-normal">Outro:</Label>
                 </div>
                 <Input
                   placeholder="Descreva outros achados do exame físico..."
                   value={(ensureArray(context.exameFisico).find(item => item.startsWith('Outro:')) || '').replace('Outro: ', '')}
                   onChange={(e) => {
                     const filtered = ensureArray(context.exameFisico).filter(item => !item.startsWith('Outro:'));
                     if (e.target.value.trim()) {
                       updateContext('exameFisico', [...filtered, `Outro: ${e.target.value}`]);
                     } else {
                       updateContext('exameFisico', filtered);
                     }
                   }}
                   className="ml-9 bg-white dark:bg-gray-800"
                 />
               </div>
            </div>

            {/* Conduta */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Conduta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['Úlcera venosa (CEAP C6)', 'Curativos', 'Compressão elástica', 'Seguimento ambulatorial'].map((item) => (
                   <div key={item} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                     <Checkbox
                       id={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}
                       checked={(context.conduta || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('conduta', item, checked as boolean)}
                     />
                     <Label htmlFor={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`} className="cursor-pointer font-normal">{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2 pt-2">
                 <div className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                   <Checkbox
                       id="conduta-outro"
                       checked={ensureArray(context.conduta).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.conduta).filter(item => !item.startsWith('Outro:'));
                           updateContext('conduta', filtered);
                         }
                       }}
                     />
                     <Label htmlFor="conduta-outro" className="cursor-pointer font-normal">Outro:</Label>
                   </div>
                  <Input
                    placeholder="Descreva outra conduta..."
                    value={(ensureArray(context.conduta).find(item => item.startsWith('Outro:')) || '').replace('Outro: ', '')}
                    onChange={(e) => {
                      const filtered = ensureArray(context.conduta).filter(item => !item.startsWith('Outro:'));
                      if (e.target.value.trim()) {
                        updateContext('conduta', [...filtered, `Outro: ${e.target.value}`]);
                      } else {
                      updateContext('conduta', filtered);
                    }
                  }}
                  className="ml-9 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Avaliação do Pulso */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-red-500" />
                Avaliação do Pulso – Artéria Dorsal do Pé
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Presente', 'Ausente', 'Não realizado'].map((item) => (
                  <div key={item} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" onClick={() => updateContext('avaliacaoPulso', item)}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${context.avaliacaoPulso === item ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {context.avaliacaoPulso === item && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <Label htmlFor={`pulso-${item.toLowerCase().replace(/\s+/g, '-')}`} className="cursor-pointer font-normal">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="ghost" onClick={clearForm} className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            Limpar Formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientContextForm;