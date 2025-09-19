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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Prescrição Eletrônica
            <Badge variant={prescription.status === 'draft' ? 'secondary' : 'default'}>
              {prescription.status === 'draft' ? 'Rascunho' : 
               prescription.status === 'issued' ? 'Emitida' : 'Enviada'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPrescription}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={savePrescription}>
              Salvar
            </Button>
            <Button onClick={sendPrescription} className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do cabeçalho */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-blue-900">Paciente</h3>
              <p className="text-blue-700">{prescription.patientName}</p>
              <p className="text-blue-600 text-sm">ID: {prescription.patientId}</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Médico</h3>
              <p className="text-blue-700">{prescription.doctorName}</p>
              <p className="text-blue-600 text-sm">{prescription.doctorCRM}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-blue-600 text-sm">
              Data: {prescription.date.toLocaleDateString('pt-BR')} às {prescription.date.toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Adicionar medicamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Medicamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medication-name">Medicamento</Label>
                <Select
                  value={currentMedication.name}
                  onValueChange={(value) => setCurrentMedication(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione ou digite o medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonMedications.map((med) => (
                      <SelectItem key={med} value={med}>{med}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dosage">Dosagem</Label>
                <Input
                  id="dosage"
                  value={currentMedication.dosage}
                  onChange={(e) => setCurrentMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="Ex: 1 comprimido"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequência</Label>
                <Select
                  value={currentMedication.frequency}
                  onValueChange={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={currentMedication.duration}
                  onChange={(e) => setCurrentMedication(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Ex: 7 dias"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="instructions">Instruções Especiais</Label>
              <Textarea
                id="instructions"
                value={currentMedication.instructions}
                onChange={(e) => setCurrentMedication(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Ex: Tomar com alimentos, evitar álcool..."
                rows={2}
              />
            </div>
            <Button onClick={addMedication} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Medicamento
            </Button>
          </CardContent>
        </Card>

        {/* Lista de medicamentos */}
        {prescription.medications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medicamentos Prescritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.medications.map((medication, index) => (
                  <div key={medication.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {index + 1}. {medication.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm">
                          <div>
                            <span className="font-medium">Dosagem:</span> {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequência:</span> {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duração:</span> {medication.duration}
                          </div>
                        </div>
                        {medication.instructions && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Instruções:</span> {medication.instructions}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMedication(medication.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instruções gerais */}
        <div>
          <Label htmlFor="general-instructions">Instruções Gerais</Label>
          <Textarea
            id="general-instructions"
            value={prescription.generalInstructions}
            onChange={(e) => setPrescription(prev => ({ ...prev, generalInstructions: e.target.value }))}
            placeholder="Instruções gerais para o paciente..."
            rows={4}
          />
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground">
          <p>ID da Prescrição: {prescription.id}</p>
          <p>Esta prescrição foi gerada eletronicamente e possui validade legal.</p>
        </div>
      </CardContent>
    </Card>
  );
};