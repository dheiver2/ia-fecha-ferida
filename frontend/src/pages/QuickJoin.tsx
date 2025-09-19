import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, ArrowRight } from 'lucide-react';

const QuickJoin: React.FC = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (code.trim()) {
      // Extrair apenas o código da sala se for um link completo
      let roomCode = code.trim();
      
      // Se for um link completo, extrair o código
      if (roomCode.includes('/join/')) {
        roomCode = roomCode.split('/join/')[1];
      }
      if (roomCode.includes('/call/')) {
        roomCode = roomCode.split('/call/')[1];
      }
      if (roomCode.includes('/simple/')) {
        roomCode = roomCode.split('/simple/')[1];
      }
      
      // Remover parâmetros de query se houver
      if (roomCode.includes('?')) {
        roomCode = roomCode.split('?')[0];
      }
      
      // Navegar para a videochamada
      navigate(`/simple/${roomCode}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Entrar na Consulta
          </CardTitle>
          <p className="text-gray-600">
            Cole o link ou digite o código da sala
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Cole o link completo ou digite apenas o código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg py-4 text-center"
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">
              Exemplo: room_abc123 ou link completo
            </p>
          </div>

          <Button 
            onClick={handleJoin}
            disabled={!code.trim()}
            className="w-full text-xl py-6 bg-blue-600 hover:bg-blue-700"
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            Entrar Agora
          </Button>

          <div className="text-center space-y-3">
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Funciona com:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>✓ Links completos de convite</p>
                <p>✓ Códigos de sala simples</p>
                <p>✓ Qualquer formato de link</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickJoin;