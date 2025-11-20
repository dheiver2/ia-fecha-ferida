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
    { value: 'agendado', label: 'Agendado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { value: 'confirmado', label: 'Confirmado', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    { value: 'concluido', label: 'Concluído', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
    { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' }
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
      <Badge className={`${statusConfig?.color} border shadow-sm`}>
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
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Agendamento de Consultas</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie sua agenda médica</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
                <Button
                  variant={view === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('calendar')}
                  className={view === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}
                >
                  Calendário
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                  className={view === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}
                >
                  Lista
                </Button>
              </div>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Calendário</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              modifiers={{
                hasAppointments: (date) => getAppointmentsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasAppointments: { 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  color: '#059669',
                  fontWeight: 'bold',
                  borderRadius: '100%'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Lista de consultas do dia selecionado */}
        <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Consultas - {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Nenhuma consulta agendada para este dia
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsCreating(true)}
                    className="text-emerald-600 dark:text-emerald-400 mt-2"
                  >
                    Agendar agora
                  </Button>
                </div>
              ) : (
                getAppointmentsForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="group border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900/50 hover:border-emerald-200 dark:hover:border-emerald-800/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <Clock className="w-3.5 h-3.5" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                              {getTypeIcon(appointment.type)}
                              <span>{appointmentTypes.find(t => t.value === appointment.type)?.label}</span>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{appointment.patientName}</h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-mono">ID: {appointment.patientId}</span>
                                <span>•</span>
                                <span>{appointment.duration} min</span>
                              </div>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                              <p className="line-clamp-2">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingAppointment(appointment)}
                            className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteAppointment(appointment.id)}
                            className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Nova Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient-name" className="text-slate-700 dark:text-slate-300">Nome do Paciente</Label>
                  <Input
                    id="patient-name"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Digite o nome do paciente"
                    className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-id" className="text-slate-700 dark:text-slate-300">ID do Paciente</Label>
                  <Input
                    id="patient-id"
                    value={newAppointment.patientId}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, patientId: e.target.value }))}
                    placeholder="ID do paciente (opcional)"
                    className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-date" className="text-slate-700 dark:text-slate-300">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {newAppointment.date ? format(newAppointment.date, "dd/MM/yyyy") : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-slate-200 dark:border-slate-800">
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={(date) => setNewAppointment(prev => ({ ...prev, date: date || new Date() }))}
                        locale={ptBR}
                        disabled={(date) => isBefore(date, new Date())}
                        className="bg-white dark:bg-slate-900"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-time" className="text-slate-700 dark:text-slate-300">Horário</Label>
                  <Select
                    value={newAppointment.time}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger className="border-slate-200 dark:border-slate-700">
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
                <div className="space-y-2">
                  <Label htmlFor="appointment-type" className="text-slate-700 dark:text-slate-300">Tipo de Consulta</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger className="border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4 text-slate-500" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">Duração (minutos)</Label>
                  <Select
                    value={newAppointment.duration?.toString()}
                    onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: parseInt(value) }))}
                  >
                    <SelectTrigger className="border-slate-200 dark:border-slate-700">
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
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300">Observações</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações sobre a consulta..."
                  rows={3}
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setIsCreating(false)} className="border-slate-200 dark:border-slate-700">
                  Cancelar
                </Button>
                <Button onClick={createAppointment} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                  Agendar Consulta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para editar consulta */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-500" />
                Editar Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-patient-name" className="text-slate-700 dark:text-slate-300">Nome do Paciente</Label>
                  <Input
                    id="edit-patient-name"
                    value={editingAppointment.patientName}
                    onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, patientName: e.target.value } : null)}
                    className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-slate-700 dark:text-slate-300">Status</Label>
                  <Select
                    value={editingAppointment.status}
                    onValueChange={(value) => setEditingAppointment(prev => prev ? { ...prev, status: value as any } : null)}
                  >
                    <SelectTrigger className="border-slate-200 dark:border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`}></div>
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="text-slate-700 dark:text-slate-300">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={editingAppointment.notes}
                  onChange={(e) => setEditingAppointment(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  rows={3}
                  className="border-slate-200 dark:border-slate-700 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setEditingAppointment(null)} className="border-slate-200 dark:border-slate-700">
                  Cancelar
                </Button>
                <Button onClick={updateAppointment} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};