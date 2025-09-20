import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SimplePeerVideoCall from '@/components/SimplePeerVideoCall';
import { ElectronicRecord } from '@/components/ElectronicRecord';
import { ElectronicPrescription } from '@/components/ElectronicPrescription';
import { AppointmentScheduler } from '@/components/AppointmentScheduler';
import { InviteHandler } from '@/components/InviteHandler';
import { NotificationSystem } from '@/components/NotificationSystem';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ThemeToggle } from '@/components/ThemeToggle';
import Header from '@/components/Header';
import { 
  Video, 
  FileText, 
  Calendar, 
  Pill, 
  User, 
  Clock,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  lastConsultation?: Date;
}

interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  scheduledTime: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'teleconsulta' | 'presencial' | 'retorno';
}

export const Teleconsulta: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('agenda');
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isInviteMode, setIsInviteMode] = useState(false);
  
  // Sistema de notificações
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    notifyInviteSent, 
    notifyLinkGenerated,
    unreadCount 
  } = useNotificationSystem();

  useEffect(() => {
    // Se há um roomId na URL, está em modo de convite
    if (roomId) {
      setIsInviteMode(true);
    }
  }, [roomId]);

  // Mock data
  const mockPatient: Patient = {
    id: 'PAC001',
    name: 'Maria Silva',
    age: 45,
    phone: '(11) 99999-9999',
    email: 'maria.silva@email.com',
    lastConsultation: new Date(2024, 0, 15)
  };

  const mockConsultation: Consultation = {
    id: 'CONS001',
    patientId: 'PAC001',
    patientName: 'Maria Silva',
    scheduledTime: new Date(),
    status: 'scheduled',
    type: 'teleconsulta'
  };

  const startConsultation = (consultation: Consultation) => {
    setCurrentConsultation({ ...consultation, status: 'in_progress' });
    setSelectedPatient(mockPatient);
    setActiveTab('video');
    setIsInCall(true);
  };

  const endConsultation = () => {
    if (currentConsultation) {
      setCurrentConsultation({ ...currentConsultation, status: 'completed' });
    }
    setIsInCall(false);
    setActiveTab('prontuario');
  };

  const endCall = () => {
    setIsInCall(false);
    if (currentConsultation) {
      setCurrentConsultation({ ...currentConsultation, status: 'completed' });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      in_progress: { label: 'Em Andamento', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Se está em modo de convite, mostrar apenas o InviteHandler
  if (isInviteMode && roomId) {
    return (
      <InviteHandler 
        onJoinCall={(roomId) => {
          setIsInviteMode(false);
          setIsInCall(true);
          setActiveTab('videochamada');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <div className="max-w-7xl mx-auto pt-24">
        <Breadcrumbs />
        
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-6 h-6" />
                <span>Plataforma de Teleconsulta</span>
                {currentConsultation && (
                  <div className="flex items-center gap-2 ml-4">
                    <User className="w-4 h-4" />
                    <span className="text-lg">{currentConsultation.patientName}</span>
                    {getStatusBadge(currentConsultation.status)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                 <ThemeToggle />
                 <NotificationSystem 
                   onNotificationClick={(notification) => {
                     markAsRead(notification.id);
                     console.log('Notificação clicada:', notification);
                     // Aqui você pode adicionar lógica para navegar ou realizar ações específicas
                   }}
                 />
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4" />
                   <span className="text-sm text-muted-foreground">
                     {new Date().toLocaleTimeString('pt-BR')}
                   </span>
                 </div>
               </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        {!currentConsultation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => startConsultation(mockConsultation)}
                  className="h-20 flex flex-col gap-2"
                >
                  <Video className="w-6 h-6" />
                  Iniciar Teleconsulta
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('agenda')}
                  className="h-20 flex flex-col gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  Ver Agenda
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('prontuario')}
                  className="h-20 flex flex-col gap-2"
                >
                  <FileText className="w-6 h-6" />
                  Prontuários
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('prescricao')}
                  className="h-20 flex flex-col gap-2"
                >
                  <Pill className="w-6 h-6" />
                  Prescrições
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videoconferência
            </TabsTrigger>
            <TabsTrigger value="prontuario" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prontuário
            </TabsTrigger>
            <TabsTrigger value="prescricao" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Prescrição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="space-y-6">
            <AppointmentScheduler
              doctorName="Dr. João Silva"
              onAppointmentCreate={(appointment) => {
                console.log('Nova consulta criada:', appointment);
              }}
              onAppointmentUpdate={(appointment) => {
                console.log('Consulta atualizada:', appointment);
              }}
              onAppointmentDelete={(appointmentId) => {
                console.log('Consulta deletada:', appointmentId);
              }}
            />
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            {currentConsultation ? (
              <div className="space-y-4">
                {/* Consultation Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>Teleconsulta em Andamento</span>
                        {getStatusBadge(currentConsultation.status)}
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={endConsultation}
                        className="flex items-center gap-2"
                      >
                        <PhoneOff className="w-4 h-4" />
                        Encerrar Consulta
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Paciente:</span> {currentConsultation.patientName}
                      </div>
                      <div>
                        <span className="font-medium">Horário:</span> {currentConsultation.scheduledTime.toLocaleTimeString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span> {currentConsultation.type}
                      </div>
                      <div>
                        <span className="font-medium">ID:</span> {currentConsultation.id}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Video Call Component */}
                <SimplePeerVideoCall 
                  userType="doctor"
                  roomId={roomId}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma consulta ativa</h3>
                  <p className="text-muted-foreground mb-4">
                    Inicie uma teleconsulta para usar a videoconferência
                  </p>
                  <Button onClick={() => startConsultation(mockConsultation)}>
                    Iniciar Teleconsulta de Teste
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prontuario" className="space-y-6">
            {selectedPatient ? (
              <ElectronicRecord
                patientId={selectedPatient.id}
                patientName={selectedPatient.name}
                doctorName="Dr. João Silva"
                onSave={(record) => {
                  console.log('Prontuário salvo:', record);
                }}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Selecione um paciente</h3>
                  <p className="text-muted-foreground mb-4">
                    Inicie uma consulta ou selecione um paciente para ver o prontuário
                  </p>
                  <Button onClick={() => setSelectedPatient(mockPatient)}>
                    Carregar Paciente de Teste
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prescricao" className="space-y-6">
            {selectedPatient ? (
              <ElectronicPrescription
                patientId={selectedPatient.id}
                patientName={selectedPatient.name}
                doctorName="Dr. João Silva"
                doctorCRM="CRM/SP 123456"
                onSave={(prescription) => {
                  console.log('Prescrição salva:', prescription);
                }}
                onSend={(prescription) => {
                  console.log('Prescrição enviada:', prescription);
                }}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Pill className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Selecione um paciente</h3>
                  <p className="text-muted-foreground mb-4">
                    Inicie uma consulta ou selecione um paciente para criar prescrições
                  </p>
                  <Button onClick={() => setSelectedPatient(mockPatient)}>
                    Carregar Paciente de Teste
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Call Controls (when in call) */}
        {isInCall && (
          <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Controles da Chamada:</span>
              <Button size="sm" variant="outline">
                <Mic className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Camera className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={endConsultation}>
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};