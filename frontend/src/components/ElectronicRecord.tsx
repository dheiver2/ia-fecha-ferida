import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, User, Heart, Pill } from 'lucide-react';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  allergies: string[];
  medications: string[];
  medicalHistory: string;
  currentComplaint: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  observations: string;
  lastUpdated: Date;
}

interface ElectronicRecordProps {
  patientId: string;
  patientName?: string;
  doctorName?: string;
  isDoctor?: boolean;
  onSave?: (record: PatientRecord) => void;
}

export const ElectronicRecord: React.FC<ElectronicRecordProps> = ({
  patientId,
  patientName = '',
  doctorName = '',
  isDoctor = false,
  onSave
}) => {
  const [record, setRecord] = useState<PatientRecord>({
    id: patientId,
    name: patientName,
    age: 0,
    gender: '',
    allergies: [],
    medications: [],
    medicalHistory: '',
    currentComplaint: '',
    physicalExam: '',
    diagnosis: '',
    treatment: '',
    observations: '',
    lastUpdated: new Date()
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Carregar dados do paciente
    loadPatientRecord();
  }, [patientId]);

  const loadPatientRecord = async () => {
    try {
      // Simular carregamento de dados
      // Em produção, fazer chamada para API
      const mockRecord: PatientRecord = {
        id: patientId,
        name: 'João Silva',
        age: 45,
        gender: 'Masculino',
        allergies: ['Penicilina', 'Dipirona'],
        medications: ['Losartana 50mg', 'Metformina 850mg'],
        medicalHistory: 'Hipertensão arterial, Diabetes tipo 2',
        currentComplaint: 'Ferida na perna direita há 2 semanas',
        physicalExam: '',
        diagnosis: '',
        treatment: '',
        observations: '',
        lastUpdated: new Date()
      };
      setRecord(mockRecord);
    } catch (error) {
      console.error('Erro ao carregar prontuário:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedRecord = {
        ...record,
        lastUpdated: new Date()
      };
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecord(updatedRecord);
      onSave?.(updatedRecord);
      
      alert('Prontuário salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error);
      alert('Erro ao salvar prontuário');
    } finally {
      setIsSaving(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !record.allergies.includes(newAllergy.trim())) {
      setRecord(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setRecord(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !record.medications.includes(newMedication.trim())) {
      setRecord(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setRecord(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Prontuário Eletrônico
          </CardTitle>
          {isDoctor && (
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
        {doctorName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <User className="w-4 h-4" />
            <span>Médico Responsável: <strong>{doctorName}</strong></span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient-info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patient-info">
              <User className="w-4 h-4 mr-2" />
              Paciente
            </TabsTrigger>
            <TabsTrigger value="medical-history">
              <Heart className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="consultation">
              <FileText className="w-4 h-4 mr-2" />
              Consulta
            </TabsTrigger>
            <TabsTrigger value="medications">
              <Pill className="w-4 h-4 mr-2" />
              Medicações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={record.name}
                  onChange={(e) => setRecord(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isDoctor}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={record.age}
                  onChange={(e) => setRecord(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  disabled={!isDoctor}
                />
              </div>
              <div>
                <Label htmlFor="gender">Sexo</Label>
                <Input
                  id="gender"
                  value={record.gender}
                  onChange={(e) => setRecord(prev => ({ ...prev, gender: e.target.value }))}
                  disabled={!isDoctor}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical-history" className="space-y-4">
            <div>
              <Label htmlFor="medical-history">Histórico Médico</Label>
              <Textarea
                id="medical-history"
                value={record.medicalHistory}
                onChange={(e) => setRecord(prev => ({ ...prev, medicalHistory: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Doenças prévias, cirurgias, internações..."
              />
            </div>

            <div>
              <Label>Alergias</Label>
              <div className="flex gap-2 mb-2">
                {record.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="cursor-pointer">
                    {allergy}
                    {isDoctor && (
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isDoctor && (
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Nova alergia"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button onClick={addAllergy}>Adicionar</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-4">
            <div>
              <Label htmlFor="complaint">Queixa Principal</Label>
              <Textarea
                id="complaint"
                value={record.currentComplaint}
                onChange={(e) => setRecord(prev => ({ ...prev, currentComplaint: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Motivo da consulta..."
              />
            </div>

            <div>
              <Label htmlFor="physical-exam">Exame Físico</Label>
              <Textarea
                id="physical-exam"
                value={record.physicalExam}
                onChange={(e) => setRecord(prev => ({ ...prev, physicalExam: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Achados do exame físico..."
              />
            </div>

            <div>
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                value={record.diagnosis}
                onChange={(e) => setRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Diagnóstico médico..."
              />
            </div>

            <div>
              <Label htmlFor="treatment">Tratamento</Label>
              <Textarea
                id="treatment"
                value={record.treatment}
                onChange={(e) => setRecord(prev => ({ ...prev, treatment: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Plano terapêutico..."
              />
            </div>

            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={record.observations}
                onChange={(e) => setRecord(prev => ({ ...prev, observations: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Observações adicionais..."
              />
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <div>
              <Label>Medicações em Uso</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {record.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    {medication}
                    {isDoctor && (
                      <button
                        onClick={() => removeMedication(medication)}
                        className="ml-2 text-xs"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isDoctor && (
                <div className="flex gap-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Nova medicação"
                    onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  />
                  <Button onClick={addMedication}>Adicionar</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-sm text-muted-foreground">
          Última atualização: {record.lastUpdated.toLocaleString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};