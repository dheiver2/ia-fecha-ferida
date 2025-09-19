// Configurações WebRTC para produção
export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}

// Configurações para diferentes ambientes
export const getWebRTCConfig = (): WebRTCConfig => {
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // Configurações para produção com servidores STUN/TURN
    return {
      iceServers: [
        // Servidores STUN gratuitos do Google
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        
        // Servidor STUN alternativo
        { urls: 'stun:stun.stunprotocol.org:3478' },
        
        // TURN servers (configurar com suas credenciais)
        // Descomente e configure quando tiver um servidor TURN
        /*
        {
          urls: 'turn:your-turn-server.com:3478',
          username: import.meta.env.VITE_TURN_USERNAME || '',
          credential: import.meta.env.VITE_TURN_PASSWORD || ''
        },
        {
          urls: 'turns:your-turn-server.com:5349',
          username: import.meta.env.VITE_TURN_USERNAME || '',
          credential: import.meta.env.VITE_TURN_PASSWORD || ''
        }
        */
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    };
  } else {
    // Configurações para desenvolvimento (apenas STUN)
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10
    };
  }
};

// Configurações de mídia para diferentes qualidades
export const getMediaConstraints = (quality: 'low' | 'medium' | 'high' = 'medium') => {
  const constraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100
    },
    video: false
  };

  switch (quality) {
    case 'low':
      constraints.video = {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 15 }
      };
      break;
    case 'medium':
      constraints.video = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 24 }
      };
      break;
    case 'high':
      constraints.video = {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      };
      break;
  }

  return constraints;
};

// Exportar configuração padrão
export const webrtcConfig = getWebRTCConfig();

// Verificar suporte WebRTC
export const checkWebRTCSupport = (): { supported: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Verificar contexto seguro
  if (!window.isSecureContext) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    if (protocol === 'http:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      issues.push(`Contexto não seguro (${protocol}//${hostname}). Use HTTPS ou localhost`);
    }
  }
  
  if (!window.RTCPeerConnection) {
    issues.push('RTCPeerConnection não suportado');
  }
  
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    issues.push('getUserMedia não suportado');
  }
  
  if (!window.MediaStream) {
    issues.push('MediaStream não suportado');
  }
  
  return {
    supported: issues.length === 0,
    issues
  };
};

// Configurações de fallback para navegadores antigos
export const getLegacyWebRTCConfig = () => {
  return {
    iceServers: [
      { url: 'stun:stun.l.google.com:19302' }, // Formato antigo
      { url: 'stun:stun1.l.google.com:19302' }
    ]
  };
};