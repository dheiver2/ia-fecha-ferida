import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Link2, Users, Copy, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { InviteGenerator } from './InviteGenerator';
import { useCallLink } from '@/hooks/useCallLink';

interface VideoCallProps {
  isDoctor?: boolean;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
  roomId?: string;
  onCallEnd?: () => void;
  onInviteSent?: (method: 'email' | 'whatsapp' | 'sms', patientData: {
    name: string;
    contact: string;
    roomId: string;
  }) => void;
  onLinkGenerated?: (linkData: { roomId: string; callLink: string; patientId?: string }) => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ 
  isDoctor = false, 
  patientId,
  doctorName = 'Médico',
  patientName = 'Paciente',
  roomId,
  onCallEnd,
  onInviteSent,
  onLinkGenerated
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [showInviteGenerator, setShowInviteGenerator] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Hook para gerar link automático da chamada (apenas se não tiver roomId)
  const { callLinkData, isGenerating, copyToClipboard, regenerateLink } = useCallLink(
    patientId, 
    isDoctor ? 'Dr. Médico' : undefined,
    onLinkGenerated,
    roomId // Passar o roomId existente para evitar gerar novo
  );

  useEffect(() => {
    initializeMedia();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-iniciar chamada quando há roomId (modo guest)
  useEffect(() => {
    if (roomId && !isCallActive) {
      console.log('Auto-iniciando chamada em modo guest...');
      // Iniciar chamada mesmo sem stream local (modo texto)
      setTimeout(() => {
        setIsCallActive(true);
        setCallStatus('connected');
        console.log('Chamada iniciada automaticamente para guest');
      }, 1000); // Pequeno delay para garantir que tudo está carregado
    }
  }, [roomId, isCallActive]);

  // Tentar inicializar mídia quando há roomId, mas não bloquear a chamada
  useEffect(() => {
    if (roomId && localStream && !mediaError) {
      console.log('Stream disponível, melhorando qualidade da chamada...');
    }
  }, [roomId, localStream, mediaError]);

  const initializeMedia = async () => {
    try {
      console.log('Iniciando acesso à mídia...');
      
      // Nova estratégia: tentar primeiro, verificar depois
      // Removendo verificações restritivas - vamos tentar diretamente

      // Estratégia de fallbacks progressivos
      let stream: MediaStream;
      
      // Função auxiliar para tentar APIs legadas
      const tryLegacyGetUserMedia = (constraints: any): Promise<MediaStream> => {
        return new Promise((resolve, reject) => {
          const nav = navigator as any;
          const getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;
          
          if (getUserMedia) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          } else {
            reject(new Error('getUserMedia não disponível'));
          }
        });
      };
      
      // Fallback 1: API moderna com configurações ideais
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true
            }
          });
        } else {
          throw new Error('mediaDevices não disponível');
        }
      } catch (idealError) {
        console.warn('Fallback 1 falhou, tentando configurações básicas:', idealError);
        
        // Fallback 2: API moderna com configurações básicas
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
            });
          } else {
            throw new Error('mediaDevices não disponível');
          }
        } catch (basicError) {
          console.warn('Fallback 2 falhou, tentando apenas vídeo:', basicError);
          
          // Fallback 3: API moderna apenas vídeo
          try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
            } else {
              throw new Error('mediaDevices não disponível');
            }
          } catch (videoOnlyError) {
            console.warn('Fallback 3 falhou, tentando APIs legadas:', videoOnlyError);
            
            // Fallback 4: APIs legadas com vídeo e áudio
            try {
              stream = await tryLegacyGetUserMedia({
                video: true,
                audio: true
              });
            } catch (legacyError) {
              console.warn('Fallback 4 falhou, tentando API legada apenas vídeo:', legacyError);
              
              // Fallback 5: APIs legadas apenas vídeo
              stream = await tryLegacyGetUserMedia({
                video: true,
                audio: false
              });
            }
          }
        }
      }
      
      console.log('Stream obtido com sucesso:', stream);
      console.log('Tracks de vídeo:', stream.getVideoTracks());
      console.log('Tracks de áudio:', stream.getAudioTracks());
      
      setLocalStream(stream);
      setMediaError(null); // Limpar erro se conseguiu acesso
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Stream atribuído ao elemento de vídeo');
        
        // Aguardar o vídeo carregar
        localVideoRef.current.onloadedmetadata = () => {
          console.log('Metadados do vídeo carregados');
          localVideoRef.current?.play().catch(e => {
            console.error('Erro ao reproduzir vídeo:', e);
          });
        };
      }
      
      setCallStatus('idle');
    } catch (error: any) {
      console.error('Erro ao acessar mídia:', error);
      
      // Tratamento específico para diferentes tipos de erro com instruções detalhadas
      let errorMessage = 'Erro ao acessar câmera/microfone';
      let errorDetails = '';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permissão negada para acessar câmera/microfone';
        errorDetails = 'Clique no ícone da câmera na barra de endereços e selecione "Permitir". Ou vá em Configurações > Privacidade > Câmera/Microfone e permita o acesso.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Câmera ou microfone não encontrados';
        errorDetails = 'Verifique se os dispositivos estão conectados e funcionando. Teste em outras aplicações primeiro.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Dispositivos já estão sendo usados';
        errorDetails = 'Feche outros aplicativos que usam câmera/microfone (Zoom, Teams, Skype, etc.) e tente novamente.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configurações de vídeo não suportadas';
        errorDetails = 'Seu dispositivo não suporta as configurações solicitadas. Tentando configurações mais simples...';
      } else if (error.message.includes('getUserMedia não disponível')) {
        errorMessage = 'Navegador muito antigo ou incompatível';
        errorDetails = 'Atualize seu navegador para a versão mais recente ou use Chrome, Firefox ou Edge modernos.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Erro de segurança ao acessar mídia';
        errorDetails = 'Verifique se está usando HTTPS ou localhost. Alguns navegadores bloqueiam acesso à câmera em HTTP.';
      } else {
        errorMessage = 'Falha ao acessar câmera/microfone';
        errorDetails = `Erro técnico: ${error.message}. Tente atualizar a página ou usar outro navegador.`;
      }
      
      console.error('Detalhes do erro:', errorMessage);
      console.error('Instruções:', errorDetails);
      
      // Combinar mensagem e detalhes para exibição
      const fullErrorMessage = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;
      setMediaError(fullErrorMessage);
      setCallStatus('idle');
    }
  };

  const startCall = async () => {
    // Verificar se há mídia disponível antes de iniciar
    if (!localStream && !mediaError) {
      console.log('Tentando inicializar mídia antes de iniciar chamada...');
      await initializeMedia();
    }
    
    if (mediaError) {
      console.warn('Não é possível iniciar chamada devido a erro de mídia:', mediaError);
      return;
    }
    
    setIsCallActive(true);
    setCallStatus('connecting');
    
    // Aqui você implementaria a lógica WebRTC real
    // Por enquanto, simulamos uma conexão
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallStatus('ended');
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onCallEnd?.();
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleCopyLink = async () => {
    if (callLinkData) {
      const success = await copyToClipboard(callLinkData.shortLink);
      if (success) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {isDoctor ? 'Teleconsulta - Médico' : 'Teleconsulta - Paciente'}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {callStatus}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Área de vídeo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vídeo local */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {isDoctor ? `Dr. ${doctorName}` : patientName}
            </div>
            {!isVideoEnabled && !mediaError && (
              <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                <VideoOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {mediaError && (
              <div className="absolute inset-0 bg-red-900 rounded-lg flex items-center justify-center p-4">
                 <div className="text-center text-white">
                   <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-red-300" />
                   <p className="text-sm mb-3">{mediaError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={initializeMedia}
                    className="bg-white text-red-900 hover:bg-gray-100"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Vídeo remoto */}
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {isDoctor ? patientName : `Dr. ${doctorName}`}
            </div>
            {!isCallActive && (
              <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p>Aguardando conexão...</p>
                </div>
              </div>
            )}
            {isCallActive && !remoteVideoRef.current?.srcObject && (
              <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p>Conectado - Aguardando vídeo</p>
                  <p className="text-sm mt-1">Use o chat abaixo para se comunicar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Link Automático da Chamada */}
        {callLinkData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Link2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Link da Chamada</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateLink}
                disabled={isGenerating}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                Compartilhe este link para convidar alguém para a chamada:
              </p>
              
              <div className="flex items-center space-x-2 bg-white border border-blue-200 rounded-md p-2">
                <code className="flex-1 text-sm text-gray-700 truncate">
                  {callLinkData.shortLink}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-blue-600">
                ID da Sala: {callLinkData.roomId}
              </p>
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          {!isCallActive ? (
            <Button
              variant="default"
              size="lg"
              onClick={startCall}
              className="rounded-full w-12 h-12 p-0 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full w-12 h-12 p-0"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          )}

          {/* Botão de Compartilhamento Rápido */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyLink}
            className="rounded-full w-12 h-12 p-0"
            title="Copiar Link da Chamada"
          >
            {copiedLink ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </Button>

          {/* Botão de Convite - apenas para médicos */}
          {isDoctor && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowInviteGenerator(!showInviteGenerator)}
              className="rounded-full w-12 h-12 p-0"
              title="Convidar Paciente"
            >
              {showInviteGenerator ? <Users className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
            </Button>
          )}
        </div>

        {/* Informações da consulta */}
        {isDoctor && patientId && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Informações da Consulta</h3>
            <p className="text-blue-700">Paciente ID: {patientId}</p>
            <p className="text-blue-700">Tipo: Teleconsulta de Dermatologia</p>
          </div>
        )}

        {/* Gerador de Convites */}
        {isDoctor && showInviteGenerator && (
          <div className="mt-6">
            <InviteGenerator
              doctorName="Dr. João Silva" // Aqui você pode passar o nome real do médico
              onInviteGenerated={(inviteData) => {
                console.log('Convite gerado:', inviteData);
                // Aqui você pode implementar lógica adicional quando um convite é gerado
              }}
              onInviteSent={onInviteSent}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};