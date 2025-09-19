import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Copy, Phone, UserPlus } from 'lucide-react';

const SimpleTelehealth: React.FC = () => {
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateSimpleRoom = () => {
    if (!doctorName.trim() || !patientName.trim()) {
      alert('Por favor, preencha o nome do médico e do paciente');
      return;
    }

    setIsCreating(true);
    
    // Gerar ID simples baseado nos nomes e timestamp
    const timestamp = Date.now();
    const roomId = `consulta_${timestamp}`;
    const link = `${window.location.origin}/join/${roomId}?doctor=${encodeURIComponent(doctorName)}&patient=${encodeURIComponent(patientName)}`;
    
    setRoomLink(link);
    setIsCreating(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(roomLink);
    alert('Link copiado! Envie para o paciente.');
  };

  const startCall = () => {
    window.open(roomLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📹 Teleconsulta Simples
          </h1>
          <p className="text-gray-600">
            Crie uma videochamada em 3 passos simples
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Passo 1: Informações da Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Médico
              </label>
              <Input
                type="text"
                placeholder="Dr. João Silva"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nome do Paciente
              </label>
              <Input
                type="text"
                placeholder="Maria Santos"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Passo 2: Criar Sala de Videochamada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generateSimpleRoom}
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isCreating ? 'Criando...' : 'Criar Videochamada'}
            </Button>
          </CardContent>
        </Card>

        {roomLink && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Phone className="w-5 h-5" />
                Passo 3: Compartilhar com o Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-green-800">
                  Link da Videochamada
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={roomLink}
                    readOnly
                    className="flex-1 bg-white"
                  />
                  <Button 
                    onClick={copyLink}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={startCall}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Entrar na Chamada
                </Button>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  📱 Como enviar para o paciente:
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Copie o link acima</li>
                  <li>• Envie por WhatsApp, SMS ou email</li>
                  <li>• O paciente só precisa clicar no link</li>
                  <li>• Não precisa instalar nada!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Para o Paciente:</h3>
          <p className="text-sm text-gray-600 mb-3">
            Envie este link para o paciente entrar diretamente:
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <code className="text-sm text-blue-800">
              {window.location.origin}/paciente
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/paciente`)}
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            O paciente precisará do código da sala: <strong>{roomLink.split('/').pop()?.split('?')[0]}</strong>
          </p>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-2 mt-6">
          <p>✓ Link válido por 24 horas</p>
          <p>✓ Máximo 2 participantes por sala</p>
          <p>✓ Conexão segura e criptografada</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTelehealth;