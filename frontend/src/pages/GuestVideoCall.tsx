import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimplePeerVideoCall from '@/features/peerVideoCall';
import { ArrowLeft, Clock, Shield, User, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
    if (!roomId) {
      console.error('❌ Room ID não encontrado na URL');
      navigate('/', { replace: true });
      return;
    }

    console.log('🔍 Inicializando GuestVideoCall com roomId:', roomId);

    // Tentar obter dados do state (vindo do InviteHandler)
    const stateData = location.state as { inviteData?: InviteData; isGuest?: boolean };
    
    if (stateData?.inviteData) {
      console.log('✅ Dados encontrados no state:', stateData.inviteData);
      setInviteData(stateData.inviteData);
    } else {
      // Tentar obter do localStorage como fallback
      const storedData = localStorage.getItem(`invite_${roomId}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log('✅ Dados encontrados no localStorage:', parsedData);
          setInviteData(parsedData);
        } catch (error) {
          console.error('❌ Erro ao carregar dados do localStorage:', error);
          createDefaultInviteData();
        }
      } else {
        console.log('⚠️ Nenhum dado encontrado, criando dados padrão para acesso direto');
        createDefaultInviteData();
      }
    }

    function createDefaultInviteData() {
      // Extrair parâmetros da URL se disponíveis
      const urlParams = new URLSearchParams(location.search);
      const doctorName = urlParams.get('doctor') || 'Médico';
      const patientName = urlParams.get('patient') || 'Visitante';
      
      const defaultData: InviteData = {
        roomId,
        doctorName: decodeURIComponent(doctorName),
        patientName: decodeURIComponent(patientName),
        scheduledTime: new Date().toISOString(),
        duration: 30,
        notes: 'Teleconsulta via link direto'
      };
      
      console.log('📝 Criando dados padrão:', defaultData);
      setInviteData(defaultData);
      
      // Salvar no localStorage para futuras visitas
      localStorage.setItem(`invite_${roomId}`, JSON.stringify(defaultData));
    }
  }, [roomId, location.state, location.search, navigate]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl">
          <CardContent className="text-center py-12">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border-4 border-blue-200 dark:border-blue-800/30 animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Conectando...</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Preparando ambiente seguro para sua teleconsulta...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 transition-colors duration-300 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Sala de Teleconsulta
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                  <Wifi className="w-3 h-3 mr-1" /> Ao Vivo
                </Badge>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                ID: <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-xs">{inviteData.roomId}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleBackToInvite}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Informações */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Detalhes da Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Médico Responsável</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{inviteData.doctorName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{inviteData.patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Duração Estimada</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{inviteData.duration} minutos</p>
                    </div>
                  </div>
                </div>

                {inviteData.notes && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1 uppercase">Observações</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                      {inviteData.notes}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 justify-center">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span>Conexão criptografada de ponta a ponta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área Principal de Vídeo */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative min-h-[500px] flex flex-col">
              {/* Video Call Component */}
              <div className="flex-1 relative">
                <SimplePeerVideoCall 
                  userType="patient"
                  roomId={roomId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};