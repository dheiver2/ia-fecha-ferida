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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Carregando convite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Convite Inválido
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {error || 'Este convite não foi encontrado ou pode ter expirado.'}
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="text-center border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Video className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Convite para Teleconsulta</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          {/* Informações do Médico */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">{inviteData.doctorName}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Dermatologista</p>
          </div>

          {/* Status da Consulta */}
          <div className="text-center">
            <Badge 
              variant={
                timeStatus.status === 'active' ? 'default' :
                timeStatus.status === 'soon' ? 'secondary' :
                timeStatus.status === 'expired' ? 'destructive' : 'outline'
              }
              className={`text-sm px-4 py-1.5 rounded-full ${
                timeStatus.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                timeStatus.status === 'soon' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                timeStatus.status === 'expired' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {timeStatus.message}
            </Badge>
          </div>

          {/* Informações da Consulta */}
          <div className="space-y-4">
            {inviteData.scheduledTime && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {format(inviteData.scheduledTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {format(inviteData.scheduledTime, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {inviteData.duration && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Duração Estimada</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{inviteData.duration} minutos</p>
                </div>
              </div>
            )}

            {inviteData.notes && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Observações
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">{inviteData.notes}</p>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleJoinCall}
              disabled={!canJoin || isJoining}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-12 text-lg rounded-xl transition-all hover:scale-[1.02]"
              size="lg"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  {timeStatus.status === 'expired' ? 'Horário Expirado' : 'Entrar na Consulta'}
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 h-12 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          {/* Instruções */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <p>Certifique-se de que sua câmera e microfone estão funcionando.</p>
            <p>A consulta será iniciada automaticamente quando você clicar em "Entrar na Consulta".</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};