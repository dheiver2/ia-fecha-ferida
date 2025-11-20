import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Video, User, ArrowRight, Shield, Clock } from 'lucide-react';

export const PatientEntry: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [patientName, setPatientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Médico');
  const [isLoading, setIsLoading] = useState(false);
  const [isInviteLink, setIsInviteLink] = useState(false);

  // Processar parâmetros da URL de convite
  useEffect(() => {
    const salaParam = searchParams.get('sala');
    const medicoParam = searchParams.get('medico');
    
    if (salaParam) {
      setRoomId(salaParam);
      setIsInviteLink(true);
    }
    
    if (medicoParam) {
      setDoctorName(decodeURIComponent(medicoParam));
    }
  }, [searchParams]);

  const handleJoinCall = async () => {
    if (!patientName.trim() || !roomId.trim()) {
      alert('Por favor, preencha seu nome e o código da sala');
      return;
    }

    setIsLoading(true);
    
    // Simular validação
    setTimeout(() => {
      // Navegar para a sala de videochamada
      navigate(`/guest/${roomId}`, {
          state: {
            inviteData: {
              roomId: roomId.trim(),
              patientName: patientName.trim(),
              doctorName: doctorName,
              scheduledTime: new Date().toISOString(),
              duration: 30,
              notes: isInviteLink ? 'Teleconsulta via link de convite' : 'Teleconsulta via entrada direta'
            },
            isGuest: true
          }
        });
    }, 1000);
  };

  const handleQuickJoin = () => {
    // Gerar dados de exemplo para teste rápido
    const testRoomId = `sala-${Date.now().toString().slice(-6)}`;
    const testPatientName = 'Paciente Teste';
    
    navigate(`/guest/${testRoomId}`, {
      state: {
        inviteData: {
          roomId: testRoomId,
          patientName: testPatientName,
          doctorName: 'Dr. Médico',
          scheduledTime: new Date().toISOString(),
          duration: 30,
          notes: 'Teleconsulta de teste'
        },
        isGuest: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Logo e Cabeçalho */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 mb-2">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isInviteLink ? 'Convite para Teleconsulta' : 'Portal do Paciente'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              {isInviteLink 
                ? `${doctorName} está aguardando você`
                : 'Acesse sua consulta de forma segura'
              }
            </p>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-blue-600" />
              Identificação
            </CardTitle>
            <CardDescription>
              Preencha seus dados para entrar na sala
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {isInviteLink && (
              <div className="bg-medical-success/10 dark:bg-medical-success/20 border border-medical-success/20 dark:border-medical-success/30 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-medical-success mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-medical-success dark:text-medical-success-foreground text-sm">
                    Convite Verificado
                  </h3>
                  <p className="text-medical-success dark:text-medical-success-foreground text-xs mt-1">
                    Você foi convidado por <strong>{doctorName}</strong> para a sala <strong>{roomId}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-slate-700 dark:text-slate-300">Seu Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="patientName"
                    type="text"
                    placeholder="Ex: João Silva"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-slate-700 dark:text-slate-300">Código da Sala</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="roomId"
                    type="text"
                    placeholder={isInviteLink ? "Código automático" : "Ex: sala-123456"}
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    disabled={isInviteLink}
                    className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                {!isInviteLink && (
                  <p className="text-xs text-slate-500 ml-1">
                    O código foi enviado para seu email ou WhatsApp
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleJoinCall}
              disabled={isLoading || !patientName.trim() || !roomId.trim()}
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Conectando...
                </>
              ) : (
                <>
                  Entrar na Consulta <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700/50 pt-6 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3" />
              <span>Ambiente criptografado de ponta a ponta</span>
            </div>
            
            {!isInviteLink && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickJoin}
                className="text-xs text-slate-400 hover:text-blue-600"
              >
                Modo de Teste (Demo)
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Instruções Rápidas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Identifique-se</p>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm">2</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Permita Acesso</p>
          </div>
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 text-blue-600 dark:text-blue-400 font-bold text-sm">3</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">Inicie Consulta</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            Precisa de ajuda? <a href="#" className="text-blue-600 hover:underline">Fale com o suporte</a>
          </p>
        </div>
      </div>
    </div>
  );
};