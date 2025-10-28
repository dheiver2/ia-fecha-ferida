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
    <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isInviteLink ? 'Convite para Teleconsulta' : 'Entrada do Paciente'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isInviteLink 
              ? `${doctorName} está convidando você para uma teleconsulta`
              : 'Entre na teleconsulta com seu médico'
            }
          </p>
        </div>

        {/* Informações do Convite */}
        {isInviteLink && (
          <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CardContent className="py-4">
              <div className="text-center">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  ✅ Convite Recebido
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm mb-2">
                  Você foi convidado por <strong>{doctorName}</strong>
                </p>
                <p className="text-green-600 dark:text-green-500 text-xs">
                  Sala: {roomId}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Seu Nome</Label>
              <Input
                id="patientName"
                type="text"
                placeholder="Digite seu nome completo"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Código da Sala</Label>
              <Input
                id="roomId"
                type="text"
                placeholder={isInviteLink ? "Código preenchido automaticamente" : "Digite o código fornecido pelo médico"}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                disabled={isInviteLink}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                {isInviteLink 
                  ? "Código da sala preenchido automaticamente pelo convite"
                  : "O médico forneceu este código para você"
                }
              </p>
            </div>

            <Button
              onClick={handleJoinCall}
              disabled={isLoading || !patientName.trim() || !roomId.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Entrar na Teleconsulta
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Teste Rápido */}
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-6">
            <h3 className="font-semibold mb-2">Teste Rápido</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para demonstração, clique abaixo para entrar em uma sala de teste
            </p>
            <Button
              variant="outline"
              onClick={handleQuickJoin}
              className="w-full"
            >
              <Video className="w-4 h-4 mr-2" />
              Entrar em Sala de Teste
            </Button>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  Conexão Segura
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Sua teleconsulta é protegida e privada. Apenas você e seu médico têm acesso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-secondary border-accent/20 dark:bg-accent/10 dark:border-accent/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent dark:text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold text-accent dark:text-accent mb-2">
                  Como funciona:
                </h4>
                <ol className="text-sm text-accent dark:text-accent space-y-1">
                  <li>1. Digite seu nome e o código da sala</li>
                  <li>2. Clique em "Entrar na Teleconsulta"</li>
                  <li>3. Permita acesso à câmera e microfone</li>
                  <li>4. Aguarde seu médico iniciar a consulta</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Problemas para acessar? Entre em contato com a clínica
          </p>
        </div>
      </div>
    </div>
  );
};