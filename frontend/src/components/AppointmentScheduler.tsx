import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, User, Video, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { format, addDays, isSameDay, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: Date;
  time: string;
  type: 'teleconsulta' | 'presencial' | 'retorno';
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  notes: string;
  duration: number; // em minutos
}

interface AppointmentSchedulerProps {
  doctorName?: string;
  onAppointmentCreate?: (appointment: Appointment) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  onAppointmentDelete?: (appointmentId: string) => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  doctorName = "Dr. João Silva",
  onAppointmentCreate,
  onAppointmentUpdate,
  onAppointmentDelete
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreating, setIsCreating] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: '',
    patientId: '',
    doctorName,
    date: new Date(),
    time: '',
    type: 'teleconsulta',
    status: 'agendado',
    notes: '',
    duration: 30
  });

  // Horários disponíveis (8h às 18h, intervalos de 30min)
  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const appointmentTypes = [
    { value: 'teleconsulta', label: 'Teleconsulta', icon: Video },
    { value: 'presencial', label: 'Presencial', icon: User },
    { value: 'retorno', label: 'Retorno', icon: FileText }
  ];

  const statusOptions = [
    { value: 'agendado', label: 'Agendado', color: 'bg-blue-100 text-blue-800' },
    { value: 'confirmado', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'concluido', label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    // Simular carregamento de consultas existentes
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'Maria Silva',
        patientId: 'PAC001',
        doctorName,
        date: new Date(),
        time: '09:00',
        type: 'teleconsulta',
        status: 'confirmado',
        notes: 'Consulta de acompanhamento',
        duration: 30
      },
      {
        id: '2',
        patientName: 'João Santos',
        patientId: 'PAC002',
        doctorName,
        date: addDays(new Date(), 1),
        time: '14:30',
        type: 'presencial',
        status: 'agendado',
        notes: 'Primeira consulta',
        duration: 45
      }
    ];
    setAppointments(mockAppointments);
  }, [doctorName]);

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const isTimeAvailable = (date: Date, time: string) => {
    const appointmentsForDate = getAppointmentsForDate(date);
    return !appointmentsForDate.some(apt => apt.time === time && apt.status !== 'cancelado');
  };

  const createAppointment = () => {
    if (newAppointment.patientName && newAppointment.time && newAppointment.date) {
      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientName: newAppointment.patientName!,
        patientId: newAppointment.patientId || `PAC${Date.now()}`,
        doctorName: newAppointment.doctorName!,
        date: newAppointment.date!,
        time: newAppointment.time!,
        type: newAppointment.type as any,
        status: newAppointment.status as any,
        notes: newAppointment.notes || '',
        duration: newAppointment.duration || 30
      };

      setAppointments(prev => [...prev, appointment]);
      onAppointmentCreate?.(appointment);
      
      setNewAppointment({
        patientName: '',
        patientId: '',
        doctorName,
        date: new Date(),
        time: '',
        type: 'teleconsulta',
        status: 'agendado',
        notes: '',
        duration: 30
      });
      setIsCreating(false);
    }
  };

  const updateAppointment = () => {
    if (editingAppointment) {
      setAppointments(prev => 
        prev.map(apt => apt.id === editingAppointment.id ? editingAppointment : apt)
      );
      onAppointmentUpdate?.(editingAppointment);
      setEditingAppointment(null);
    }
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    onAppointmentDelete?.(appointmentId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color}>
        {statusConfig?.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = appointmentTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || User;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Agendamento de Consultas
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'calendar' ? 'default' : 'outline'}
                onClick={() => setView('calendar')}
              >
                Calendário
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                onClick={() => setView('list')}
              >
                Lista
              </Button>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
              modifiers={{
                hasAppointments: (date) => getAppointmentsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasAppointments: { backgroundColor: '#dbeafe', fontWeight: 'bold' }
              }}
            />
          </CardContent>
        </Card>

        {/* Lista de consultas do dia selecionado */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Consultas - {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma consulta agendada para este dia
                </p>
              ) : (
                getAppointmentsForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{appointment.time}</span>
                            {getTypeIcon(appointment.type)}
                            <span className="text-sm text-muted-foreground">
                              {appointmentTypes.find(t => t.value === appointment.type)?.label}
                            </span>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <h4 className="font-semibold">{appointment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
                          {appointment.notes && (
                            <p className="text-sm mt-2">{appointment.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Duração: {appointment.duration} minutos
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAppointment(appointment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteAppointment(appointment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para criar nova consulta */}
      {isCreating && (
        <Card className="fixed inset-0 z-50 m-4 overflow-auto bg-white">
          <CardHeader>
            <CardTitle>Nova Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient-name">Nome do Paciente</Label>
                <Input
                  id="patient-name"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Digite o nome do paciente"
                />
              </div>
              <div>
                <Label htmlFor="patient-id">ID do Paciente</Label>
                <Input
                  id="patient-id"
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="ID do paciente (opcional)"
                />
              </div>
              <div>
                <Label htmlFor="appointment-date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAppointment.date ? format(newAppointment.date, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAppointment.date}
                      onSelect={(date) => setNewAppointment(prev => ({ ...prev, date: date || new Date() }))}
                      locale={ptBR}
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="appointment-time">Horário</Label>
                <Select
                  value={newAppointment.time}
                  onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem 
                        key={time} 
                        value={time}
                        disabled={!isTimeAvailable(newAppointment.date || new Date(), time)}
                      >
                        {time} {!isTimeAvailable(newAppointment.date || new Date(), time) && '(Ocupado)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointment-type">Tipo de Consulta</Label>
                <Select
                  value={newAppointment.type}
                  onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Select
                  value={newAppointment.duration?.toString()}
                  onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações sobre a consulta..."
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button onClick={createAppointment}>
                Agendar Consulta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para editar consulta */}
      {editingAppointment && (
        <Card className="fixed inset-0 z-50 m-4 overflow-auto bg-white">
          <CardHeader>
            <CardTitle>Editar Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-patient-name">Nome do Paciente</Label>
                <Input
                  id="edit-patient-name"
                  value={editingAppointment.patientName}
                  onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, patientName: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingAppointment.status}
                  onValueChange={(value) => setEditingAppointment(prev => prev ? { ...prev, status: value as any } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={editingAppointment.notes}
                onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, notes: e.target.value } : null)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                Cancelar
              </Button>
              <Button onClick={updateAppointment}>
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};