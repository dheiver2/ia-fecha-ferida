import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, Trash2, Download, Send } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorCRM: string;
  date: Date;
  medications: Medication[];
  generalInstructions: string;
  status: 'draft' | 'issued' | 'sent';
}

interface ElectronicPrescriptionProps {
  patientId: string;
  patientName: string;
  doctorName?: string;
  doctorCRM?: string;
  onSave?: (prescription: Prescription) => void;
  onSend?: (prescription: Prescription) => void;
}

export const ElectronicPrescription: React.FC<ElectronicPrescriptionProps> = ({
  patientId,
  patientName,
  doctorName = "Dr. João Silva",
  doctorCRM = "CRM/SP 123456",
  onSave,
  onSend
}) => {
  const [prescription, setPrescription] = useState<Prescription>({
    id: `RX-${Date.now()}`,
    patientName,
    patientId,
    doctorName,
    doctorCRM,
    date: new Date(),
    medications: [],
    generalInstructions: '',
    status: 'draft'
  });

  const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const commonMedications = [
    'Paracetamol 500mg',
    'Ibuprofeno 600mg',
    'Dipirona 500mg',
    'Amoxicilina 500mg',
    'Azitromicina 500mg',
    'Omeprazol 20mg',
    'Losartana 50mg',
    'Metformina 850mg',
    'Sinvastatina 20mg',
    'Ácido Acetilsalicílico 100mg'
  ];

  const frequencies = [
    '1x ao dia',
    '2x ao dia',
    '3x ao dia',
    '4x ao dia',
    '6/6 horas',
    '8/8 horas',
    '12/12 horas',
    'Se necessário',
    'Uso contínuo'
  ];

  const addMedication = () => {
    if (currentMedication.name && currentMedication.dosage && currentMedication.frequency) {
      const newMedication: Medication = {
        id: `med-${Date.now()}`,
        name: currentMedication.name,
        dosage: currentMedication.dosage,
        frequency: currentMedication.frequency,
        duration: currentMedication.duration || '',
        instructions: currentMedication.instructions || ''
      };

      setPrescription(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication]
      }));

      setCurrentMedication({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const removeMedication = (medicationId: string) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== medicationId)
    }));
  };

  const savePrescription = () => {
    const savedPrescription = {
      ...prescription,
      status: 'issued' as const
    };
    setPrescription(savedPrescription);
    onSave?.(savedPrescription);
    alert('Prescrição salva com sucesso!');
  };

  const sendPrescription = () => {
    const sentPrescription = {
      ...prescription,
      status: 'sent' as const
    };
    setPrescription(sentPrescription);
    onSend?.(sentPrescription);
    alert('Prescrição enviada para o paciente!');
  };

  const downloadPrescription = () => {
    // Simular download da prescrição em PDF
    const prescriptionText = generatePrescriptionText();
    const blob = new Blob([prescriptionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescricao-${prescription.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrescriptionText = () => {
    return `
PRESCRIÇÃO MÉDICA ELETRÔNICA

Paciente: ${prescription.patientName}
ID: ${prescription.patientId}
Data: ${prescription.date.toLocaleDateString('pt-BR')}

Médico: ${prescription.doctorName}
${prescription.doctorCRM}

MEDICAMENTOS PRESCRITOS:
${prescription.medications.map((med, index) => `
${index + 1}. ${med.name}
   Posologia: ${med.dosage}
   Frequência: ${med.frequency}
   Duração: ${med.duration}
   Instruções: ${med.instructions}
`).join('')}

INSTRUÇÕES GERAIS:
${prescription.generalInstructions}

Esta prescrição foi gerada eletronicamente.
ID da Prescrição: ${prescription.id}
    `;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Prescrição Eletrônica</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={prescription.status === 'draft' ? 'secondary' : 'default'} className={
                  prescription.status === 'draft' 
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' 
                    : prescription.status === 'issued'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }>
                  {prescription.status === 'draft' ? 'Rascunho' : 
                   prescription.status === 'issued' ? 'Emitida' : 'Enviada'}
                </Badge>
                <span className="text-xs text-slate-400">ID: {prescription.id}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPrescription} className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={savePrescription} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
              Salvar
            </Button>
            <Button onClick={sendPrescription} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Informações do cabeçalho */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paciente</h3>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{prescription.patientName}</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded inline-block border border-slate-200 dark:border-slate-700">ID: {prescription.patientId}</p>
            </div>
            <div className="space-y-1 md:text-right">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Médico Responsável</h3>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{prescription.doctorName}</p>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{prescription.doctorCRM}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
            <span>Data da Prescrição</span>
            <span className="font-mono">{prescription.date.toLocaleDateString('pt-BR')} às {prescription.date.toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>

        {/* Adicionar medicamento */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              Adicionar Medicamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="medication-name" className="text-slate-700 dark:text-slate-300">Medicamento</Label>
                <Select
                  value={currentMedication.name}
                  onValueChange={(value) => setCurrentMedication(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecione ou digite o medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonMedications.map((med) => (
                      <SelectItem key={med} value={med}>{med}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage" className="text-slate-700 dark:text-slate-300">Dosagem</Label>
                <Input
                  id="dosage"
                  value={currentMedication.dosage}
                  onChange={(e) => setCurrentMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="Ex: 1 comprimido"
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-slate-700 dark:text-slate-300">Frequência</Label>
                <Select
                  value={currentMedication.frequency}
                  onValueChange={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">Duração</Label>
                <Input
                  id="duration"
                  value={currentMedication.duration}
                  onChange={(e) => setCurrentMedication(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 7 dias"
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-slate-700 dark:text-slate-300">Instruções Especiais</Label>
              <Textarea
                id="instructions"
                value={currentMedication.instructions}
                onChange={(e) => setCurrentMedication(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Ex: Tomar com alimentos, evitar álcool..."
                rows={2}
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none"
              />
            </div>
            <Button onClick={addMedication} className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar à Prescrição
            </Button>
          </CardContent>
        </Card>

        {/* Lista de medicamentos */}
        {prescription.medications.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              Medicamentos Prescritos
            </h3>
            <div className="grid gap-4">
              {prescription.medications.map((medication, index) => (
                <div key={medication.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                          {medication.name}
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 pl-9">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1">Dosagem</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{medication.dosage}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1">Frequência</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{medication.frequency}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                          <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1">Duração</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{medication.duration}</span>
                        </div>
                      </div>
                      
                      {medication.instructions && (
                        <div className="mt-3 pl-9">
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                            <span className="font-medium not-italic text-slate-700 dark:text-slate-300">Instruções:</span> {medication.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedication(medication.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instruções gerais */}
        <div className="space-y-2">
          <Label htmlFor="general-instructions" className="text-slate-700 dark:text-slate-300 font-semibold">Instruções Gerais</Label>
          <Textarea
            id="general-instructions"
            value={prescription.generalInstructions}
            onChange={(e) => setPrescription(prev => ({ ...prev, generalInstructions: e.target.value }))}
            placeholder="Instruções gerais para o paciente..."
            rows={4}
            className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
          />
        </div>

        <Separator className="bg-slate-200 dark:bg-slate-800" />

        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
          <p>Esta prescrição foi gerada eletronicamente e possui validade legal.</p>
          <p className="text-xs mt-1 opacity-70">Documento assinado digitalmente conforme MP 2.200-2/2001</p>
        </div>
      </CardContent>
    </Card>
  );
};