import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  CheckCircle, 
  AlertCircle,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InviteData {
  roomId: string;
  doctorName: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  scheduledTime?: Date;
  duration?: number;
  notes?: string;
}

interface InviteHandlerProps {
  onJoinCall?: (roomId: string) => void;
}

export const InviteHandler: React.FC<InviteHandlerProps> = ({ onJoinCall }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (roomId) {
      loadInviteData(roomId);
    }
  }, [roomId]);

  const loadInviteData = async (roomId: string) => {
    try {
      setLoading(true);
      
      // Validar se o roomId tem formato válido
      if (!roomId || !roomId.startsWith('room_')) {
        setError('ID da sala inválido');
        return;
      }
      
      // Tentar carregar dados do localStorage (simulando backend)
      const storedData = localStorage.getItem(`invite_${roomId}`);
      
      if (storedData) {
        const data = JSON.parse(storedData) as InviteData;
        // Converter string de data de volta para Date object
        if (data.scheduledTime) {
          data.scheduledTime = new Date(data.scheduledTime);
        }
        setInviteData(data);
      } else {
        // Se não há dados salvos, criar dados padrão para permitir acesso direto
        const defaultInviteData: InviteData = {
          roomId,
          doctorName: 'Médico',
          patientName: 'Paciente',
          scheduledTime: new Date(), // Horário atual
          duration: 30,
          notes: 'Teleconsulta de acesso direto'
        };
        
        setInviteData(defaultInviteData);
        
        // Salvar os dados padrão para futuras referências
        localStorage.setItem(`invite_${roomId}`, JSON.stringify(defaultInviteData));
      }
    } catch (err) {
      console.error('Erro ao carregar convite:', err);
      setError('Erro ao carregar informações do convite');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = async () => {
    if (!roomId || !inviteData) return;
    
    setIsJoining(true);
    
    try {
      // Aqui você implementaria a lógica para entrar na sala
      if (onJoinCall) {
        onJoinCall(roomId);
      }
      
      // Redirecionar para a página pública de videochamada
      navigate(`/call/${roomId}`, { 
        state: { 
          inviteData,
          isGuest: true 
        } 
      });
      
    } catch (err) {
      console.error('Erro ao entrar na chamada:', err);
      setError('Erro ao entrar na chamada');
    } finally {
      setIsJoining(false);
    }
  };

  const isCallTime = () => {
    if (!inviteData?.scheduledTime) return true; // Se não há horário, pode entrar a qualquer momento
    
    const now = new Date();
    const scheduledTime = new Date(inviteData.scheduledTime);
    const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
    const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
    
    // Permite entrar 15 minutos antes ou depois do horário agendado
    return minutesDiff <= 15;
  };

  const getTimeStatus = () => {
    if (!inviteData?.scheduledTime) return { status: 'available', message: 'Disponível agora' };
    
    const now = new Date();
    const scheduledTime = new Date(inviteData.scheduledTime);
    
    if (now < scheduledTime) {
      const timeDiff = scheduledTime.getTime() - now.getTime();
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      
      if (minutesDiff <= 15) {
        return { status: 'soon', message: `Inicia em ${minutesDiff} minutos` };
      } else {
        return { status: 'scheduled', message: 'Aguardando horário' };
      }
    } else {
      const timeDiff = now.getTime() - scheduledTime.getTime();
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      
      if (minutesDiff <= 15) {
        return { status: 'active', message: 'Em andamento' };
      } else {
        return { status: 'expired', message: 'Horário expirado' };
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Carregando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Convite Inválido
              </h2>
              <p className="text-gray-600 mb-4">
                {error || 'Este convite não foi encontrado ou pode ter expirado.'}
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeStatus = getTimeStatus();
  const canJoin = isCallTime() && timeStatus.status !== 'expired';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Convite para Teleconsulta</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informações do Médico */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-lg">{inviteData.doctorName}</span>
            </div>
            <p className="text-gray-600">Dermatologista</p>
          </div>

          {/* Status da Consulta */}
          <div className="text-center">
            <Badge 
              variant={
                timeStatus.status === 'active' ? 'default' :
                timeStatus.status === 'soon' ? 'secondary' :
                timeStatus.status === 'expired' ? 'destructive' : 'outline'
              }
              className="text-sm px-3 py-1"
            >
              {timeStatus.message}
            </Badge>
          </div>

          {/* Informações da Consulta */}
          <div className="space-y-3">
            {inviteData.scheduledTime && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {format(inviteData.scheduledTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(inviteData.scheduledTime, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {inviteData.duration && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Duração</p>
                  <p className="text-sm text-gray-600">{inviteData.duration} minutos</p>
                </div>
              </div>
            )}

            {inviteData.notes && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Observações</p>
                <p className="text-sm text-blue-700">{inviteData.notes}</p>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button
              onClick={handleJoinCall}
              disabled={!canJoin || isJoining}
              className="w-full"
              size="lg"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  {timeStatus.status === 'expired' ? 'Horário Expirado' : 'Entrar na Consulta'}
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          {/* Instruções */}
          <div className="text-center text-sm text-gray-600">
            <p>Certifique-se de que sua câmera e microfone estão funcionando.</p>
            <p>A consulta será iniciada automaticamente quando você clicar em "Entrar na Consulta".</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};