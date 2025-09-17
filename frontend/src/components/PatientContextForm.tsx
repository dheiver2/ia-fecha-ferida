import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { User, Calendar, Stethoscope, FileText, AlertCircle } from 'lucide-react';

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Informações do Paciente</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </Button>
        </div>
        <CardDescription>
          Forneça informações clínicas para melhorar a precisão da análise
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dados Básicos - Sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Paciente</Label>
            <Input
              id="nome"
              placeholder="Nome completo"
              value={context.nome || ''}
              onChange={(e) => updateContext('nome', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            <Input
              id="idade"
              placeholder="Ex: 45"
              value={context.idade || ''}
              onChange={(e) => updateContext('idade', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select value={context.sexo || ''} onValueChange={(value) => updateContext('sexo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="local-atendimento">Local de Atendimento</Label>
            <Input
              id="local-atendimento"
              placeholder="Ex: UBS, Hospital..."
              value={context.localAtendimento || ''}
              onChange={(e) => updateContext('localAtendimento', e.target.value)}
            />
          </div>
        </div>

        {/* Informações Clínicas Básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hipotese">Hipótese Diagnóstica</Label>
            <Input
              id="hipotese"
              placeholder="Ex: Lesão cutânea suspeita, ferida infectada..."
              value={context.hipoteseDiagnostica || ''}
              onChange={(e) => updateContext('hipoteseDiagnostica', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sintomas">Sintomas Principais</Label>
            <Textarea
              id="sintomas"
              placeholder="Ex: Dor, coceira, vermelhidão, secreção..."
              value={context.sintomas || ''}
              onChange={(e) => updateContext('sintomas', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Seção Expandida */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Queixa Principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Queixa Principal (QP)</h3>
              <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="qp-ferida-perna"
                     checked={(context.queixaPrincipal || []).includes('Ferida na perna direita há 3 meses')}
                     onChange={(e) => updateCheckboxArray('queixaPrincipal', 'Ferida na perna direita há 3 meses', e.target.checked)}
                     className="rounded border-gray-300"
                   />
                   <Label htmlFor="qp-ferida-perna">Ferida na perna direita há 3 meses</Label>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="qp-outro"
                       checked={ensureArray(context.queixaPrincipal).some(item => item.startsWith('Outro:'))}
                       onChange={(e) => {
                         if (!e.target.checked) {
                           const filtered = ensureArray(context.queixaPrincipal).filter(item => !item.startsWith('Outro:'));
                           updateContext('queixaPrincipal', filtered);
                         }
                       }}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor="qp-outro">Outro:</Label>
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
                    className="ml-6"
                  />
                </div>
              </div>
            </div>

            {/* História da Doença Atual */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">História da Doença Atual (HDA)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['DM', 'HAS', 'Início após trauma leve', 'Dor mínima', 'Edema crônico'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.historiaDoencaAtual || []).includes(item)}
                       onChange={(e) => updateCheckboxArray('historiaDoencaAtual', item, e.target.checked)}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor={`hda-${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Label>
                   </div>
                 ))}
               </div>
               <div className="space-y-2">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="hda-outro"
                       checked={ensureArray(context.historiaDoencaAtual).some(item => item.startsWith('Outro:'))}
                       onChange={(e) => {
                         if (!e.target.checked) {
                           const filtered = ensureArray(context.historiaDoencaAtual).filter(item => !item.startsWith('Outro:'));
                           updateContext('historiaDoencaAtual', filtered);
                         }
                       }}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor="hda-outro">Outro:</Label>
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
                  className="ml-6"
                />
              </div>
            </div>

            {/* Exame Físico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Exame Físico (ExF)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="pressao-arterial">PA (mmHg)</Label>
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
                    className="w-20"
                  />
                  <span>/</span>
                  <Input
                    placeholder="80"
                    value={context.pressaoArterial?.split('/')[1] || ''}
                    onChange={(e) => {
                      const sistolica = context.pressaoArterial?.split('/')[0] || '';
                      const diastolica = e.target.value;
                      updateContext('pressaoArterial', `${sistolica}/${diastolica}`);
                    }}
                    className="w-20"
                  />
                  <span>mmHg</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['Úlcera medial em MMII direito', 'Bordas irregulares', 'Exsudato moderado'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`}
                       checked={(context.exameFisico || []).includes(item)}
                       onChange={(e) => updateCheckboxArray('exameFisico', item, e.target.checked)}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor={`exf-${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2">
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="exf-outro"
                     checked={ensureArray(context.exameFisico).some(item => item.startsWith('Outro:'))}
                     onChange={(e) => {
                       if (!e.target.checked) {
                         const filtered = ensureArray(context.exameFisico).filter(item => !item.startsWith('Outro:'));
                         updateContext('exameFisico', filtered);
                       }
                     }}
                     className="rounded border-gray-300"
                   />
                   <Label htmlFor="exf-outro">Outro:</Label>
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
                   className="ml-6"
                 />
               </div>
            </div>

            {/* Conduta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Conduta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {['Úlcera venosa (CEAP C6)', 'Curativos', 'Compressão elástica', 'Seguimento ambulatorial'].map((item) => (
                   <div key={item} className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}
                       checked={(context.conduta || []).includes(item)}
                       onChange={(e) => updateCheckboxArray('conduta', item, e.target.checked)}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor={`conduta-${item.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}>{item}</Label>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2">
                 <div className="flex items-center space-x-2">
                   <input
                       type="checkbox"
                       id="conduta-outro"
                       checked={ensureArray(context.conduta).some(item => item.startsWith('Outro:'))}
                       onChange={(e) => {
                         if (!e.target.checked) {
                           const filtered = ensureArray(context.conduta).filter(item => !item.startsWith('Outro:'));
                           updateContext('conduta', filtered);
                         }
                       }}
                       className="rounded border-gray-300"
                     />
                     <Label htmlFor="conduta-outro">Outro:</Label>
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
                  className="ml-6"
                />
              </div>
            </div>

            {/* Avaliação do Pulso */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Avaliação do Pulso – Artéria Dorsal do Pé</h3>
              <div className="flex flex-wrap gap-4">
                {['Presente', 'Ausente', 'Não realizado'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`pulso-${item.toLowerCase().replace(/\s+/g, '-')}`}
                      name="avaliacao-pulso"
                      checked={context.avaliacaoPulso === item}
                      onChange={() => updateContext('avaliacaoPulso', item)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`pulso-${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={clearForm}>
            Limpar Formulário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientContextForm;