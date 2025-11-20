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
    <Card className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Prontuário Eletrônico</h2>
              {doctorName && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <User className="w-3 h-3" />
                  <span>Médico Responsável: <strong className="text-slate-700 dark:text-slate-300">{doctorName}</strong></span>
                </div>
              )}
            </div>
          </CardTitle>
          {isDoctor && (
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="patient-info" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            <TabsTrigger 
              value="patient-info"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Paciente
            </TabsTrigger>
            <TabsTrigger 
              value="medical-history"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger 
              value="consultation"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Consulta
            </TabsTrigger>
            <TabsTrigger 
              value="medications"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <Pill className="w-4 h-4 mr-2" />
              Medicações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-info" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Nome Completo</Label>
                <Input
                  id="name"
                  value={record.name}
                  onChange={(e) => setRecord(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isDoctor}
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={record.age}
                  onChange={(e) => setRecord(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  disabled={!isDoctor}
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">Sexo</Label>
                <Input
                  id="gender"
                  value={record.gender}
                  onChange={(e) => setRecord(prev => ({ ...prev, gender: e.target.value }))}
                  disabled={!isDoctor}
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical-history" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="medical-history" className="text-slate-700 dark:text-slate-300">Histórico Médico</Label>
              <Textarea
                id="medical-history"
                value={record.medicalHistory}
                onChange={(e) => setRecord(prev => ({ ...prev, medicalHistory: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Doenças prévias, cirurgias, internações..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-300">Alergias</Label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                {record.allergies.length === 0 && (
                  <span className="text-slate-400 text-sm italic self-center">Nenhuma alergia registrada</span>
                )}
                {record.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                    {allergy}
                    {isDoctor && (
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="ml-2 text-xs hover:text-red-900 dark:hover:text-red-100"
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
                    className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                  />
                  <Button onClick={addAllergy} variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Adicionar</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-2">
              <Label htmlFor="complaint" className="text-slate-700 dark:text-slate-300">Queixa Principal</Label>
              <Textarea
                id="complaint"
                value={record.currentComplaint}
                onChange={(e) => setRecord(prev => ({ ...prev, currentComplaint: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Motivo da consulta..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physical-exam" className="text-slate-700 dark:text-slate-300">Exame Físico</Label>
              <Textarea
                id="physical-exam"
                value={record.physicalExam}
                onChange={(e) => setRecord(prev => ({ ...prev, physicalExam: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Achados do exame físico..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-slate-700 dark:text-slate-300">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                value={record.diagnosis}
                onChange={(e) => setRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Diagnóstico médico..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment" className="text-slate-700 dark:text-slate-300">Tratamento</Label>
              <Textarea
                id="treatment"
                value={record.treatment}
                onChange={(e) => setRecord(prev => ({ ...prev, treatment: e.target.value }))}
                disabled={!isDoctor}
                rows={4}
                placeholder="Plano terapêutico..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations" className="text-slate-700 dark:text-slate-300">Observações</Label>
              <Textarea
                id="observations"
                value={record.observations}
                onChange={(e) => setRecord(prev => ({ ...prev, observations: e.target.value }))}
                disabled={!isDoctor}
                rows={3}
                placeholder="Observações adicionais..."
                className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none bg-slate-50 dark:bg-slate-800/30"
              />
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-3">
              <Label className="text-slate-700 dark:text-slate-300">Medicações em Uso</Label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] p-2 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                {record.medications.length === 0 && (
                  <span className="text-slate-400 text-sm italic self-center">Nenhuma medicação registrada</span>
                )}
                {record.medications.map((medication, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                    {medication}
                    {isDoctor && (
                      <button
                        onClick={() => removeMedication(medication)}
                        className="ml-2 text-xs hover:text-blue-900 dark:hover:text-blue-100"
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
                    className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                  />
                  <Button onClick={addMedication} variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Adicionar</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>Última atualização: {record.lastUpdated.toLocaleString('pt-BR')}</span>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">ID: {record.id}</span>
        </div>
      </CardContent>
    </Card>
  );
};