import { useState, useEffect } from 'react';

interface CallLinkData {
  roomId: string;
  callLink: string;
  shortLink: string;
  qrCode?: string;
}

export const useCallLink = (
  patientId?: string, 
  doctorName?: string,
  onLinkGenerated?: (linkData: { roomId: string; callLink: string; patientId?: string }) => void,
  existingRoomId?: string
) => {
  const [callLinkData, setCallLinkData] = useState<CallLinkData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Função para obter o IP da rede local
  const getNetworkUrl = () => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    // Para produção (domínio real), usar o origin normal
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return window.location.origin;
    }
    
    // Para desenvolvimento local, usar IP da rede
    // Primeiro, verificar se há uma variável de ambiente configurada
    const envNetworkIP = import.meta.env.VITE_NETWORK_IP;
    if (envNetworkIP) {
      console.log(`🌐 Usando IP da rede configurado: ${envNetworkIP}:${port}`);
      return `${protocol}//${envNetworkIP}:${port}`;
    }
    
    // Fallback: tentar detectar automaticamente
    // Em desenvolvimento, avisar que o IP deve ser configurado
    console.warn('⚠️ IP da rede não configurado. Configure VITE_NETWORK_IP no arquivo .env');
    console.log('💡 Para compartilhar links, adicione: VITE_NETWORK_IP=SEU_IP_DA_REDE');
    
    // Usar localhost como último recurso (não funcionará para outras pessoas)
    return window.location.origin;
  };

  // Função para gerar um ID único para a sala
  const generateRoomId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `room_${timestamp}_${randomStr}`;
  };

  // Função para gerar um link curto
  const generateShortLink = (roomId: string) => {
    const baseUrl = getNetworkUrl();
    return `${baseUrl}/enter/${roomId}`;
  };

  // Função para gerar o link completo da chamada
  const generateCallLink = (roomId: string) => {
    const baseUrl = getNetworkUrl();
    const params = new URLSearchParams();
    
    if (patientId) params.append('patient', patientId);
    if (doctorName) params.append('doctor', encodeURIComponent(doctorName));
    
    const queryString = params.toString();
    return `${baseUrl}/enter/${roomId}${queryString ? `?${queryString}` : ''}`;
  };

  // Função para copiar link para a área de transferência
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Erro ao copiar para área de transferência:', error);
      return false;
    }
  };

  // Gerar link automaticamente quando o hook é inicializado
  useEffect(() => {
    // Se já existe um roomId (modo guest), não gerar novo link
    if (existingRoomId) {
      console.log('🔗 Modo guest detectado - usando roomId existente:', existingRoomId);
      
      const callLink = generateCallLink(existingRoomId);
      const shortLink = generateShortLink(existingRoomId);

      const linkData: CallLinkData = {
        roomId: existingRoomId,
        callLink,
        shortLink
      };

      setCallLinkData(linkData);
      setIsGenerating(false);
      return;
    }

    // Apenas gerar novo link se não houver roomId existente (modo médico)
    const generateAutoLink = () => {
      setIsGenerating(true);
      
      const roomId = generateRoomId();
      const callLink = generateCallLink(roomId);
      const shortLink = generateShortLink(roomId);

      const linkData: CallLinkData = {
        roomId,
        callLink,
        shortLink
      };

      setCallLinkData(linkData);
      setIsGenerating(false);

      // Notificar que o link foi gerado
      if (onLinkGenerated) {
        onLinkGenerated({
          roomId,
          callLink,
          patientId
        });
      }
    };

    // Gerar link automaticamente quando o componente monta (apenas para médicos)
    generateAutoLink();
  }, [patientId, doctorName, onLinkGenerated, existingRoomId]);

  // Função para regenerar o link
  const regenerateLink = () => {
    setIsGenerating(true);
    
    const roomId = generateRoomId();
    const callLink = generateCallLink(roomId);
    const shortLink = generateShortLink(roomId);

    const linkData: CallLinkData = {
      roomId,
      callLink,
      shortLink
    };

    setCallLinkData(linkData);
    setIsGenerating(false);
  };

  return {
    callLinkData,
    isGenerating,
    copyToClipboard,
    regenerateLink
  };
};