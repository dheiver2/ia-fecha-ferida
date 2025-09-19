import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoCall } from '@/components/VideoCall';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Video, ArrowLeft, User, Clock, Shield } from 'lucide-react';

interface InviteData {
  roomId: string;
  doctorName: string;
  patientName: string;
  scheduledTime: string;
  duration: number;
  notes: string;
}

export const GuestVideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Tentar obter dados do state (vindo do InviteHandler)
    const stateData = location.state as { inviteData?: InviteData; isGuest?: boolean };
    
    if (stateData?.inviteData) {
      setInviteData(stateData.inviteData);
    } else if (roomId) {
      // Tentar obter do localStorage como fallback
      const storedData = localStorage.getItem(`invite_${roomId}`);
      if (storedData) {
        try {
          setInviteData(JSON.parse(storedData));
        } catch (error) {
          console.error('Erro ao carregar dados do convite:', error);
          // Criar dados padrão se não conseguir carregar
          const defaultData: InviteData = {
            roomId,
            doctorName: 'Dr. Médico',
            patientName: 'Paciente',
            scheduledTime: new Date().toISOString(),
            duration: 30,
            notes: 'Teleconsulta de acesso direto'
          };
          setInviteData(defaultData);
          localStorage.setItem(`invite_${roomId}`, JSON.stringify(defaultData));
        }
      }
    }
  }, [roomId, location.state]);

  const handleCallEnd = () => {
    setIsCallActive(false);
    // Redirecionar para página inicial após encerrar
    navigate('/', { replace: true });
  };

  const handleBackToInvite = () => {
    navigate(`/join/${roomId}`, { replace: true });
  };

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Carregando...</h3>
            <p className="text-muted-foreground">
              Preparando a videochamada...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-card-foreground">
              <div className="flex items-center gap-2">
                <Video className="w-6 h-6" />
                <span>Teleconsulta</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToInvite}
                  className="flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Convite
                </Button>
                <ThemeToggle />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-card-foreground">Médico:</span> <span className="text-card-foreground">{inviteData.doctorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-card-foreground">Paciente:</span> <span className="text-card-foreground">{inviteData.patientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="font-medium text-card-foreground">Duração:</span> <span className="text-card-foreground">{inviteData.duration} min</span>
              </div>
            </div>
            {inviteData.notes && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Observações:</strong> {inviteData.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Call Component */}
        <VideoCall 
          isDoctor={false}
          patientId={inviteData.patientName}
          doctorName={inviteData.doctorName}
          patientName={inviteData.patientName}
          onCallEnd={handleCallEnd}
          roomId={roomId}
        />

        {/* Informações adicionais */}
        <Card className="mt-6 border-border bg-card">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-muted-foreground">
                Esta é uma teleconsulta segura. Suas informações são protegidas.
              </p>
            </div>
            <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3 inline-block">
              <p className="text-xs text-muted-foreground font-mono">
                ID da Sala: <span className="text-foreground font-semibold">{inviteData.roomId}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};