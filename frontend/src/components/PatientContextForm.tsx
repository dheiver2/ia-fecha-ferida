import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { User, Calendar, Stethoscope, FileText, AlertCircle, ChevronDown, ChevronUp, Activity, HeartPulse, ClipboardList } from 'lucide-react';

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
    <Card className="w-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Informações do Paciente</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Dados clínicos para contextualizar a análise da IA
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            {isExpanded ? (
              <span className="flex items-center gap-2">Recolher <ChevronUp className="w-4 h-4" /></span>
            ) : (
              <span className="flex items-center gap-2">Expandir <ChevronDown className="w-4 h-4" /></span>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Dados Básicos - Sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-slate-700 dark:text-slate-300">Nome do Paciente</Label>
            <Input
              id="nome"
              placeholder="Nome completo"
              value={context.nome || ''}
              onChange={(e) => updateContext('nome', e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade" className="text-slate-700 dark:text-slate-300">Idade</Label>
            <Input
              id="idade"
              placeholder="Ex: 45"
              value={context.idade || ''}
              onChange={(e) => updateContext('idade', e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sexo" className="text-slate-700 dark:text-slate-300">Sexo</Label>
            <Select value={context.sexo || ''} onValueChange={(value) => updateContext('sexo', value)}>
              <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="local-atendimento" className="text-slate-700 dark:text-slate-300">Local de Atendimento</Label>
            <Input
              id="local-atendimento"
              placeholder="Ex: UBS, Hospital..."
              value={context.localAtendimento || ''}
              onChange={(e) => updateContext('localAtendimento', e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Informações Clínicas Básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hipotese" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              Hipótese Diagnóstica
            </Label>
            <Input
              id="hipotese"
              placeholder="Ex: Lesão cutânea suspeita, ferida infectada..."
              value={context.hipoteseDiagnostica || ''}
              onChange={(e) => updateContext('hipoteseDiagnostica', e.target.value)}
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sintomas" className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Sintomas Principais
            </Label>
            <Textarea
              id="sintomas"
              placeholder="Ex: Dor, coceira, vermelhidão, secreção..."
              value={context.sintomas || ''}
              onChange={(e) => updateContext('sintomas', e.target.value)}
              rows={2}
              className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Seção Expandida */}
        {isExpanded && (
          <div className="space-y-8 border-t border-slate-100 dark:border-slate-800 pt-6 animate-in slide-in-from-top-4 duration-300">
            {/* Queixa Principal */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Queixa Principal (QP)
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="qp-ferida-perna"
                     checked={(context.queixaPrincipal || []).includes('Ferida na perna direita há 3 meses')}
                     onCheckedChange={(checked) => updateCheckboxArray('queixaPrincipal', 'Ferida na perna direita há 3 meses', checked as boolean)}
                     className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                   />
                   <Label htmlFor="qp-ferida-perna" className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">Ferida na perna direita há 3 meses</Label>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center space-x-2">
                     <Checkbox
                       id="qp-outro"
                       checked={ensureArray(context.queixaPrincipal).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.queixaPrincipal).filter(item => !item.startsWith('Outro:'));
                           updateContext('queixaPrincipal', filtered);
                         }
                       }}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor="qp-outro" className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">Outro:</Label>
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
                    className="ml-6 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* História da Doença Atual */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                História da Doença Atual (HDA)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['DM', 'HAS', 'Início após trauma leve', 'Dor mínima', 'Edema crônico'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <Checkbox
                       id={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.historiaDoencaAtual || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('historiaDoencaAtual', item, checked as boolean)}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">{item}</Label>
                   </div>
                 ))}
               </div>
               <div className="space-y-2 mt-2">
                   <div className="flex items-center space-x-2">
                     <Checkbox
                       id="hda-outro"
                       checked={ensureArray(context.historiaDoencaAtual).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.historiaDoencaAtual).filter(item => !item.startsWith('Outro:'));
                           updateContext('historiaDoencaAtual', filtered);
                         }
                       }}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor="hda-outro" className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">Outro:</Label>
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
                  className="ml-6 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Exame Físico */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Exame Físico (ExF)
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="pressao-arterial" className="text-slate-700 dark:text-slate-300">PA (mmHg)</Label>
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
                    className="w-24 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-slate-400">/</span>
                  <Input
                    placeholder="80"
                    value={context.pressaoArterial?.split('/')[1] || ''}
                    onChange={(e) => {
                      const sistolica = context.pressaoArterial?.split('/')[0] || '';
                      const diastolica = e.target.value;
                      updateContext('pressaoArterial', `${sistolica}/${diastolica}`);
                    }}
                    className="w-24 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="text-sm text-slate-500">mmHg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                 {['Úlcera medial em MMII direito', 'Bordas irregulares', 'Exsudato moderado'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <Checkbox
                       id={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.exameFisico || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('exameFisico', item, checked as boolean)}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2 mt-2">
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="exf-outro"
                     checked={ensureArray(context.exameFisico).some(item => item.startsWith('Outro:'))}
                     onCheckedChange={(checked) => {
                       if (!checked) {
                         const filtered = ensureArray(context.exameFisico).filter(item => !item.startsWith('Outro:'));
                         updateContext('exameFisico', filtered);
                       }
                     }}
                     className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                   />
                   <Label htmlFor="exf-outro" className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">Outro:</Label>
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
                   className="ml-6 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                   />
               </div>
            </div>

            {/* Conduta */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                Conduta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['Úlcera venosa (CEAP C6)', 'Curativos', 'Compressão elástica', 'Seguimento ambulatorial'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <Checkbox
                       id={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}
                       checked={(context.conduta || []).includes(item)}
                       onCheckedChange={(checked) => updateCheckboxArray('conduta', item, checked as boolean)}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`} className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2 mt-2">
                 <div className="flex items-center space-x-2">
                   <Checkbox
                       id="conduta-outro"
                       checked={ensureArray(context.conduta).some(item => item.startsWith('Outro:'))}
                       onCheckedChange={(checked) => {
                         if (!checked) {
                           const filtered = ensureArray(context.conduta).filter(item => !item.startsWith('Outro:'));
                           updateContext('conduta', filtered);
                         }
                       }}
                       className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                     />
                     <Label htmlFor="conduta-outro" className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">Outro:</Label>
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
                  className="ml-6 border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Avaliação do Pulso */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Avaliação do Pulso – Artéria Dorsal do Pé
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Presente', 'Ausente', 'Não realizado'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`pulso-${item.toLowerCase().replace(/\s+/g, '-')}`}
                      name="avaliacao-pulso"
                      checked={context.avaliacaoPulso === item}
                      onChange={() => updateContext('avaliacaoPulso', item)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                    />
                    <Label htmlFor={`pulso-${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 dark:text-slate-300 font-normal cursor-pointer">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button 
            variant="outline" 
            onClick={clearForm}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-slate-200 dark:border-slate-700"
          >
            Limpar Formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientContextForm;