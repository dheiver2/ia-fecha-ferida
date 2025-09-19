import { webrtcConfig } from '../config/webrtc';

export interface WebRTCCallbacks {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onError?: (error: Error) => void;
  onDataChannelMessage?: (message: string) => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private callbacks: WebRTCCallbacks = {};
  private isInitiator = false;

  constructor(callbacks: WebRTCCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Inicializa a conexão WebRTC
   */
  async initialize(isInitiator: boolean = false): Promise<void> {
    console.log('🚀 [WebRTC] Iniciando inicialização...', { isInitiator });
    this.isInitiator = isInitiator;
    
    try {
      // Verificar suporte WebRTC
      if (!WebRTCService.isSupported()) {
        throw new Error('WebRTC não é suportado neste navegador');
      }
      
      console.log('📡 [WebRTC] Criando RTCPeerConnection com config:', webrtcConfig);
      
      // Criar RTCPeerConnection com configurações STUN/TURN
      this.peerConnection = new RTCPeerConnection(webrtcConfig);
      
      // Configurar event listeners
      console.log('🔧 [WebRTC] Configurando listeners...');
      this.setupPeerConnectionListeners();
      
      // Se for o iniciador, criar data channel
      if (this.isInitiator) {
        console.log('📢 [WebRTC] Criando data channel (iniciador)...');
        this.dataChannel = this.peerConnection.createDataChannel('messages', {
          ordered: true
        });
        this.setupDataChannelListeners(this.dataChannel);
      } else {
        console.log('👂 [WebRTC] Aguardando data channel (receptor)...');
        // Se não for iniciador, aguardar data channel
        this.peerConnection.ondatachannel = (event) => {
          console.log('📢 [WebRTC] Data channel recebido:', event.channel.label);
          this.dataChannel = event.channel;
          this.setupDataChannelListeners(this.dataChannel);
        };
      }
      
      console.log('✅ [WebRTC] Inicializado com sucesso');
    } catch (error) {
      console.error('❌ [WebRTC] Erro ao inicializar:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Adiciona stream local à conexão
   */
  async addLocalStream(stream: MediaStream): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('WebRTC não foi inicializado');
    }

    console.log('📹 [WebRTC] Adicionando stream local...', {
      tracks: stream.getTracks().length,
      video: stream.getVideoTracks().length,
      audio: stream.getAudioTracks().length
    });

    this.localStream = stream;
    
    // Adicionar tracks à conexão
    stream.getTracks().forEach((track, index) => {
      console.log(`🎵 [WebRTC] Adicionando track ${index + 1}:`, {
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState
      });
      this.peerConnection!.addTrack(track, stream);
    });
    
    console.log('✅ [WebRTC] Stream local adicionado com sucesso');
  }

  /**
   * Cria uma oferta WebRTC
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('WebRTC não foi inicializado');
    }

    try {
      console.log('🤝 [WebRTC] Criando oferta...');
      
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('📝 [WebRTC] Definindo descrição local (oferta)...');
      await this.peerConnection.setLocalDescription(offer);
      
      console.log('✅ [WebRTC] Oferta criada com sucesso:', {
        type: offer.type,
        sdpLength: offer.sdp?.length || 0
      });
      
      return offer;
    } catch (error) {
      console.error('❌ [WebRTC] Erro ao criar oferta:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Cria uma resposta WebRTC
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('WebRTC não foi inicializado');
    }

    try {
      console.log('📥 [WebRTC] Processando oferta recebida...', {
        type: offer.type,
        sdpLength: offer.sdp?.length || 0
      });
      
      await this.peerConnection.setRemoteDescription(offer);
      console.log('✅ [WebRTC] Descrição remota (oferta) definida');
      
      console.log('🤝 [WebRTC] Criando resposta...');
      const answer = await this.peerConnection.createAnswer();
      
      console.log('📝 [WebRTC] Definindo descrição local (resposta)...');
      await this.peerConnection.setLocalDescription(answer);
      
      console.log('✅ [WebRTC] Resposta criada com sucesso:', {
        type: answer.type,
        sdpLength: answer.sdp?.length || 0
      });
      
      return answer;
    } catch (error) {
      console.error('❌ [WebRTC] Erro ao criar resposta:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Define a descrição remota
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('WebRTC não foi inicializado');
    }

    try {
      console.log('📥 [WebRTC] Definindo descrição remota...', {
        type: description.type,
        sdpLength: description.sdp?.length || 0
      });
      
      await this.peerConnection.setRemoteDescription(description);
      console.log('✅ [WebRTC] Descrição remota definida com sucesso');
    } catch (error) {
      console.error('❌ [WebRTC] Erro ao definir descrição remota:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Adiciona candidato ICE
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('WebRTC não foi inicializado');
    }

    try {
      console.log('🧊 [WebRTC] Adicionando candidato ICE...', {
        candidate: candidate.candidate?.substring(0, 50) + '...',
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid
      });
      
      await this.peerConnection.addIceCandidate(candidate);
      console.log('✅ [WebRTC] Candidato ICE adicionado com sucesso');
    } catch (error) {
      console.error('❌ [WebRTC] Erro ao adicionar candidato ICE:', error);
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Envia mensagem via data channel
   */
  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
      console.log('Mensagem enviada:', message);
    } else {
      console.warn('Data channel não está aberto');
    }
  }

  /**
   * Obtém estatísticas da conexão
   */
  async getStats(): Promise<RTCStatsReport | null> {
    if (!this.peerConnection) {
      return null;
    }

    try {
      return await this.peerConnection.getStats();
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }

  /**
   * Encerra a conexão WebRTC
   */
  close(): void {
    // Fechar data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    // Parar tracks locais
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Fechar peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    console.log('Conexão WebRTC encerrada');
  }

  /**
   * Configura listeners da peer connection
   */
  private setupPeerConnectionListeners(): void {
    if (!this.peerConnection) return;

    // Stream remoto recebido
    this.peerConnection.ontrack = (event) => {
      console.log('📺 [WebRTC] Stream remoto recebido:', {
        streams: event.streams.length,
        tracks: event.streams[0]?.getTracks().length || 0,
        video: event.streams[0]?.getVideoTracks().length || 0,
        audio: event.streams[0]?.getAudioTracks().length || 0
      });
      this.callbacks.onRemoteStream?.(event.streams[0]);
    };

    // Candidatos ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 [WebRTC] Novo candidato ICE gerado:', {
          candidate: event.candidate.candidate?.substring(0, 50) + '...',
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        });
        this.callbacks.onIceCandidate?.(event.candidate);
      } else {
        console.log('🧊 [WebRTC] Coleta de candidatos ICE finalizada');
      }
    };

    // Estado da conexão
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection!.connectionState;
      console.log(`🔗 [WebRTC] Estado da conexão: ${state}`);
      this.callbacks.onConnectionStateChange?.(state);
      
      if (state === 'failed') {
        console.error('❌ [WebRTC] Conexão falhou - verificar configuração STUN/TURN');
      } else if (state === 'connected') {
        console.log('✅ [WebRTC] Conexão estabelecida com sucesso!');
      }
    };

    // Estado da conexão ICE
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection!.iceConnectionState;
      console.log(`🧊 [WebRTC] Estado da conexão ICE: ${state}`);
      this.callbacks.onIceConnectionStateChange?.(state);
      
      if (state === 'failed') {
        console.error('❌ [WebRTC] Conexão ICE falhou - possível problema de rede/firewall');
      } else if (state === 'connected') {
        console.log('✅ [WebRTC] Conexão ICE estabelecida!');
      }
    };

    // Estado de coleta ICE
    this.peerConnection.onicegatheringstatechange = () => {
      const state = this.peerConnection!.iceGatheringState;
      console.log(`🔍 [WebRTC] Estado de coleta ICE: ${state}`);
    };

    // Erro de sinalização
    this.peerConnection.onsignalingstatechange = () => {
      const state = this.peerConnection!.signalingState;
      console.log(`📡 [WebRTC] Estado de sinalização: ${state}`);
    };
  }

  /**
   * Configura listeners do data channel
   */
  private setupDataChannelListeners(channel: RTCDataChannel): void {
    channel.onopen = () => {
      console.log('Data channel aberto');
    };

    channel.onclose = () => {
      console.log('Data channel fechado');
    };

    channel.onmessage = (event) => {
      console.log('Mensagem recebida:', event.data);
      this.callbacks.onDataChannelMessage?.(event.data);
    };

    channel.onerror = (error) => {
      console.error('Erro no data channel:', error);
    };
  }

  /**
   * Verifica se WebRTC é suportado
   */
  static isSupported(): boolean {
    return !!(window.RTCPeerConnection && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Obtém estado atual da conexão
   */
  getConnectionState(): RTCPeerConnectionState | null {
    return this.peerConnection?.connectionState || null;
  }

  /**
   * Obtém estado atual da conexão ICE
   */
  getIceConnectionState(): RTCIceConnectionState | null {
    return this.peerConnection?.iceConnectionState || null;
  }
}

export default WebRTCService;