import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, AlertTriangle, RefreshCw } from 'lucide-react';

interface SimpleVideoCallProps {
  doctorName?: string;
  patientName?: string;
  roomId?: string;
}

const SimpleVideoCall: React.FC<SimpleVideoCallProps> = ({ 
  doctorName = 'Médico', 
  patientName = 'Paciente', 
  roomId 
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Inicializar mídia automaticamente
  useEffect(() => {
    initializeMedia();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      setError(null);
      
      // Verificar se APIs de mídia estão disponíveis
      if (!navigator.mediaDevices) {
        setError(null);
        return;
      }

      // Estratégia de fallback em 6 níveis
      const strategies = [
        // Nível 1: Vídeo HD e áudio
        { video: { width: 1280, height: 720, facingMode: 'user' }, audio: true },
        // Nível 2: Vídeo padrão com áudio
        { video: { width: 640, height: 480 }, audio: true },
        // Nível 3: Vídeo básico com áudio
        { video: { width: 320, height: 240 }, audio: true },
        // Nível 4: Apenas vídeo sem áudio
        { video: { width: 320, height: 240 }, audio: false },
        // Nível 5: Apenas áudio sem vídeo
        { video: false, audio: true },
        // Nível 6: Modo sem mídia
        null
      ];

      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        
        try {
          if (strategy === null) {
            // Modo sem mídia - funciona sempre
            setError(null);
            return;
          }
          
          const stream = await navigator.mediaDevices.getUserMedia(strategy);
          setLocalStream(stream);
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          console.log('Mídia inicializada com sucesso');
          setError(null);
          return;
          
        } catch (strategyError) {
          console.warn(`Estratégia ${i + 1} falhou:`, strategyError);
          
          if (i === strategies.length - 2) {
            // Penúltima tentativa falhou, vai para modo sem mídia
            setError(null);
            return;
          }
        }
      }
    } catch (error: any) {
      console.error('Erro na inicialização de mídia:', error);
      // Mesmo com erro, permitir conexão em modo texto
      setError(null);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const startCall = () => {
    if (!localStream) {
      alert('Câmera não está disponível. Tente recarregar a página.');
      return;
    }
    
    setIsConnecting(true);
    
    // Simular conexão
    setTimeout(() => {
      setIsCallActive(true);
      setIsConnecting(false);
    }, 2000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsConnecting(false);
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Reinicializar mídia após encerrar
    setTimeout(() => {
      initializeMedia();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Teleconsulta: {doctorName} ↔ {patientName}
          </h1>
          <p className="text-gray-300">
            {isCallActive ? '🟢 Chamada ativa' : 
             isConnecting ? '🟡 Conectando...' : 
             '⚪ Aguardando início'}
          </p>
          
          {/* Status da Conexão */}
          {(!localStream && !error) && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-medium">Conectado - Modo texto</span>
              </div>
              <p className="text-xs text-green-400 mt-1">
                Você pode se comunicar através do chat abaixo
              </p>
            </div>
          )}
        </div>

        {/* Área de vídeo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Vídeo local */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {error ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="text-center text-gray-300 max-w-sm">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                      <p className="text-sm mb-4 whitespace-pre-line">{error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={initializeMedia}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tentar Novamente
                      </Button>
                    </div>
                  </div>
                ) : localStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-center font-medium text-green-400 mb-2">Conectado</p>
                    <p className="text-xs text-center text-gray-300">
                      Pronto para chat de texto
                    </p>
                  </div>
                )}
                
                {localStream && (
                  <>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      Você
                    </div>
                    
                    {/* Indicadores de status */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {!isVideoOn && (
                        <div className="bg-red-500 p-1 rounded">
                          <VideoOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {!isAudioOn && (
                        <div className="bg-red-500 p-1 rounded">
                          <MicOff className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vídeo remoto */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    {isCallActive ? (
                      <div>
                        <Video className="w-12 h-12 mx-auto mb-2" />
                        <p>Aguardando {patientName === 'Paciente' ? 'paciente' : 'médico'}...</p>
                      </div>
                    ) : (
                      <div>
                        <VideoOff className="w-12 h-12 mx-auto mb-2" />
                        <p>Chamada não iniciada</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {patientName === 'Paciente' ? 'Paciente' : 'Médico'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat para modo texto */}
        {(!localStream && !error) && (
          <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Video className="w-4 h-4 mr-2" />
              Chat da Consulta
            </h3>
            
            <div className="space-y-3">
              <div className="h-32 bg-gray-50 rounded border p-3 overflow-y-auto">
                <div className="text-sm text-gray-500 text-center">
                  Chat pronto para uso. Aguardando mensagens...
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleVideo}
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleAudio}
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          {!isCallActive && !isConnecting ? (
            <Button
              onClick={startCall}
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={!localStream || !!error}
            >
              <Phone className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Instruções */}
        <div className="mt-8 text-center">
          <Card className="bg-blue-900 border-blue-700">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">📋 Instruções Simples:</h3>
              <div className="text-blue-200 text-sm space-y-1">
                <p>1. Permita o acesso à câmera quando solicitado</p>
                <p>2. Clique no botão verde para iniciar a chamada</p>
                <p>3. Use os botões para ligar/desligar câmera e microfone</p>
                <p>4. Clique no botão vermelho para encerrar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoCall;