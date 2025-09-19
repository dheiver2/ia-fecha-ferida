import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, User } from 'lucide-react';
import ContextualNavigation from '@/components/ContextualNavigation';
import Breadcrumbs from '@/components/Breadcrumbs';

const PatientEntry: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinCall = () => {
    if (patientName.trim() && roomCode.trim()) {
      // Navegar para a videochamada com os parâmetros
      navigate(`/simple/${roomCode}?patient=${encodeURIComponent(patientName)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinCall();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ContextualNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Entrar na Consulta
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Digite seus dados para participar da videochamada
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Seu nome
            </label>
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Código da sala
            </label>
            <Input
              type="text"
              placeholder="Digite o código fornecido pelo médico"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="text-lg font-mono"
            />
          </div>

          <Button 
            onClick={handleJoinCall}
            disabled={!patientName.trim() || !roomCode.trim()}
            className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
          >
            <Video className="w-5 h-5 mr-2" />
            Entrar na Videochamada
          </Button>

          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>✓ Sua câmera e microfone serão ativados automaticamente</p>
            <p>✓ Você pode desligar a qualquer momento</p>
            <p>✓ A chamada é segura e privada</p>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientEntry;