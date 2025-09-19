import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';
import io, { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Copy,
  Users,
  MessageCircle
} from 'lucide-react';

interface SimplePeerVideoCallProps {
  userType?: 'doctor' | 'patient';
  roomId?: string;
}

const SimplePeerVideoCall: React.FC<SimplePeerVideoCallProps> = ({ 
  userType = 'patient',
  roomId: propRoomId 
}) => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const roomId = propRoomId || paramRoomId || `room-${Date.now()}`;
  
  // Refs para vídeos
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Estados
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('Conectando...');
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    message: string;
    sender: string;
    senderType: string;
    timestamp: Date;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Inicializar conexão
  useEffect(() => {
    initializeConnection();
    return () => {
      cleanup();
    };
  }, []);

  const initializeConnection = async () => {
    try {
      // Conectar ao servidor Socket.IO
      const socketConnection = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        transports: ['websocket', 'polling']
      });

      socketConnection.on('connect', () => {
        console.log('✅ Conectado ao servidor');
        setConnectionStatus('Conectado ao servidor');
        setIsConnected(true);
        
        // Entrar na sala
        socketConnection.emit('join-room', roomId, userType);
      });

      socketConnection.on('disconnect', () => {
        console.log('❌ Desconectado do servidor');
        setConnectionStatus('Desconectado');
        setIsConnected(false);
      });

      // Eventos de usuários
      socketConnection.on('user-joined', (data) => {
        console.log('👤 Usuário entrou:', data);
        setRemoteUserConnected(true);
        setConnectionStatus(`${data.userType} conectado`);
        
        // Se somos o segundo usuário, iniciar chamada
        if (data.totalUsers === 2) {
          initiateCall(socketConnection);
        }
      });

      socketConnection.on('user-left', () => {
        console.log('👋 Usuário saiu');
        setRemoteUserConnected(false);
        setConnectionStatus('Aguardando outro usuário...');
        if (peer) {
          peer.destroy();
          setPeer(null);
        }
      });

      // Eventos WebRTC
      socketConnection.on('offer', async (data) => {
        console.log('📥 Recebendo offer');
        await handleOffer(data, socketConnection);
      });

      socketConnection.on('answer', (data) => {
        console.log('📤 Recebendo answer');
        if (peer) {
          peer.signal(data.answer);
        }
      });

      socketConnection.on('ice-candidate', (data) => {
        console.log('🧊 Recebendo ICE candidate');
        if (peer) {
          peer.signal(data.candidate);
        }
      });

      // Chat
      socketConnection.on('chat-message', (data) => {
        setChatMessages(prev => [...prev, data]);
      });

      setSocket(socketConnection);

      // Obter mídia local
      await getLocalMedia();

    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      setConnectionStatus('Erro na conexão');
    }
  };

  const getLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log('📹 Mídia local obtida');
      setConnectionStatus('Mídia local ativa');

    } catch (error) {
      console.error('❌ Erro ao obter mídia:', error);
      setConnectionStatus('Erro no acesso à câmera/microfone');
    }
  };

  const initiateCall = (socketConnection: Socket) => {
    if (!localStream) return;

    console.log('📞 Iniciando chamada...');
    
    const peerConnection = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    setupPeerEvents(peerConnection, socketConnection);
    setPeer(peerConnection);
  };

  const handleOffer = async (data: any, socketConnection: Socket) => {
    if (!localStream) return;

    console.log('📞 Respondendo à chamada...');
    
    const peerConnection = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    setupPeerEvents(peerConnection, socketConnection);
    setPeer(peerConnection);
    
    peerConnection.signal(data.offer);
  };

  const setupPeerEvents = (peerConnection: Peer.Instance, socketConnection: Socket) => {
    peerConnection.on('signal', (data) => {
      console.log('📡 Enviando sinal WebRTC');
      
      if (data.type === 'offer') {
        socketConnection.emit('offer', {
          offer: data,
          target: 'all'
        });
      } else if (data.type === 'answer') {
        socketConnection.emit('answer', {
          answer: data,
          target: 'all'
        });
      } else {
        socketConnection.emit('ice-candidate', {
          candidate: data,
          target: 'all'
        });
      }
    });

    peerConnection.on('connect', () => {
      console.log('🔗 Peer conectado!');
      setConnectionStatus('Chamada conectada');
    });

    peerConnection.on('stream', (remoteStream) => {
      console.log('📺 Stream remoto recebido');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setConnectionStatus('Vídeo ativo');
    });

    peerConnection.on('error', (error) => {
      console.error('❌ Erro no peer:', error);
      setConnectionStatus('Erro na conexão');
    });

    peerConnection.on('close', () => {
      console.log('📴 Peer desconectado');
      setConnectionStatus('Chamada encerrada');
    });
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        if (socket) {
          socket.emit('toggle-video', videoTrack.enabled);
        }
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        if (socket) {
          socket.emit('toggle-audio', audioTrack.enabled);
        }
      }
    }
  };

  const endCall = () => {
    cleanup();
    navigate('/teleconsulta');
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    if (socket) {
      socket.disconnect();
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/teleconsulta/join/${roomId}`;
    navigator.clipboard.writeText(inviteLink);
  };

  const sendChatMessage = () => {
    if (chatInput.trim() && socket) {
      socket.emit('chat-message', {
        message: chatInput.trim()
      });
      
      setChatMessages(prev => [...prev, {
        message: chatInput.trim(),
        sender: 'Você',
        senderType: userType,
        timestamp: new Date()
      }]);
      
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teleconsulta - {userType === 'doctor' ? 'Médico' : 'Paciente'}
              </h1>
              <p className="text-gray-600">Sala: {roomId}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {connectionStatus}
              </Badge>
              {userType === 'doctor' && (
                <Button onClick={copyInviteLink} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Área de vídeo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Vídeo principal (remoto) */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[500px]">
              <CardContent className="p-0 h-full relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg bg-gray-900"
                />
                {!remoteUserConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                    <div className="text-center text-white">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Aguardando outro participante...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vídeo local e chat */}
          <div className="space-y-4">
            {/* Vídeo local */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Seu vídeo</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-32 object-cover rounded bg-gray-900"
                />
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Chat</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(!showChat)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              {showChat && (
                <CardContent className="p-2 space-y-2">
                  <div className="h-32 overflow-y-auto bg-gray-50 rounded p-2 text-sm">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium text-blue-600">
                          {msg.sender}:
                        </span>
                        <span className="ml-1">{msg.message}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Digite uma mensagem..."
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                    <Button size="sm" onClick={sendChatMessage}>
                      Enviar
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Controles */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? (
                  <Video className="w-5 h-5 mr-2" />
                ) : (
                  <VideoOff className="w-5 h-5 mr-2" />
                )}
                {isVideoEnabled ? 'Câmera On' : 'Câmera Off'}
              </Button>

              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? (
                  <Mic className="w-5 h-5 mr-2" />
                ) : (
                  <MicOff className="w-5 h-5 mr-2" />
                )}
                {isAudioEnabled ? 'Microfone On' : 'Microfone Off'}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Encerrar Chamada
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplePeerVideoCall;