export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room' | 'user-joined' | 'user-left' | 'joined-room';
  roomId: string;
  userId: string;
  data?: any;
}

export interface SignalingCallbacks {
  onOffer?: (offer: RTCSessionDescriptionInit, fromUserId: string) => void;
  onAnswer?: (answer: RTCSessionDescriptionInit, fromUserId: string) => void;
  onIceCandidate?: (candidate: RTCIceCandidateInit, fromUserId: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onRoomJoined?: (isFirstUser: boolean, totalUsers: number) => void;
  onError?: (error: Error) => void;
  onConnectionStateChange?: (connected: boolean) => void;
}

export class SignalingService {
  private ws: WebSocket | null = null;
  private callbacks: SignalingCallbacks = {};
  private roomId: string | null = null;
  private userId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;

  constructor(userId: string, callbacks: SignalingCallbacks = {}) {
    this.userId = userId;
    this.callbacks = callbacks;
  }

  /**
   * Conecta ao servidor de sinalização
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Em produção, use wss:// e o domínio correto
        const wsUrl = process.env.NODE_ENV === 'production' 
          ? `wss://${window.location.host}/ws`
          : 'ws://localhost:3000/ws';
        
        console.log('Conectando ao servidor de sinalização:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('Conectado ao servidor de sinalização');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.callbacks.onConnectionStateChange?.(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: SignalingMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('Conexão com servidor de sinalização fechada');
          this.isConnected = false;
          this.callbacks.onConnectionStateChange?.(false);
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Erro na conexão WebSocket:', error);
          this.callbacks.onError?.(new Error('Erro na conexão de sinalização'));
          reject(error);
        };

        // Timeout para conexão
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Timeout na conexão com servidor de sinalização'));
          }
        }, 10000);

      } catch (error) {
        console.error('Erro ao conectar:', error);
        reject(error);
      }
    });
  }

  /**
   * Entra em uma sala
   */
  joinRoom(roomId: string): void {
    this.roomId = roomId;
    this.sendMessage({
      type: 'join-room',
      roomId,
      userId: this.userId
    });
    console.log(`Entrando na sala: ${roomId}`);
  }

  /**
   * Sai da sala atual
   */
  leaveRoom(): void {
    if (this.roomId) {
      this.sendMessage({
        type: 'leave-room',
        roomId: this.roomId,
        userId: this.userId
      });
      console.log(`Saindo da sala: ${this.roomId}`);
      this.roomId = null;
    }
  }

  /**
   * Envia oferta WebRTC
   */
  sendOffer(offer: RTCSessionDescriptionInit): void {
    if (!this.roomId) {
      console.error('Não está em uma sala');
      return;
    }

    this.sendMessage({
      type: 'offer',
      roomId: this.roomId,
      userId: this.userId,
      data: offer
    });
    console.log('Oferta enviada:', offer);
  }

  /**
   * Envia resposta WebRTC
   */
  sendAnswer(answer: RTCSessionDescriptionInit): void {
    if (!this.roomId) {
      console.error('Não está em uma sala');
      return;
    }

    this.sendMessage({
      type: 'answer',
      roomId: this.roomId,
      userId: this.userId,
      data: answer
    });
    console.log('Resposta enviada:', answer);
  }

  /**
   * Envia candidato ICE
   */
  sendIceCandidate(candidate: RTCIceCandidateInit): void {
    if (!this.roomId) {
      console.error('Não está em uma sala');
      return;
    }

    this.sendMessage({
      type: 'ice-candidate',
      roomId: this.roomId,
      userId: this.userId,
      data: candidate
    });
    console.log('Candidato ICE enviado:', candidate);
  }

  /**
   * Desconecta do servidor
   */
  disconnect(): void {
    if (this.roomId) {
      this.leaveRoom();
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    console.log('Desconectado do servidor de sinalização');
  }

  /**
   * Verifica se está conectado
   */
  isConnectedToServer(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Envia mensagem para o servidor
   */
  private sendMessage(message: SignalingMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket não está conectado');
      this.callbacks.onError?.(new Error('Servidor de sinalização não conectado'));
    }
  }

  /**
   * Processa mensagens recebidas
   */
  private handleMessage(message: SignalingMessage): void {
    console.log('Mensagem recebida:', message);

    // Ignorar mensagens do próprio usuário
    if (message.userId === this.userId) {
      return;
    }

    switch (message.type) {
      case 'offer':
        this.callbacks.onOffer?.(message.data, message.userId);
        break;

      case 'answer':
        this.callbacks.onAnswer?.(message.data, message.userId);
        break;

      case 'ice-candidate':
        this.callbacks.onIceCandidate?.(message.data, message.userId);
        break;

      case 'user-joined':
        console.log(`Usuário entrou na sala: ${message.userId}`);
        this.callbacks.onUserJoined?.(message.userId);
        break;

      case 'user-left':
        console.log(`Usuário saiu da sala: ${message.userId}`);
        this.callbacks.onUserLeft?.(message.userId);
        break;

      case 'joined-room':
        console.log(`Entrou na sala com sucesso:`, message.data);
        this.callbacks.onRoomJoined?.(message.data?.isFirstUser || false, message.data?.totalUsers || 1);
        break;

      default:
        console.warn('Tipo de mensagem desconhecido:', message.type);
    }
  }

  /**
   * Tenta reconectar automaticamente
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${delay}ms`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Falha na reconexão:', error);
        });
      }, delay);
    } else {
      console.error('Máximo de tentativas de reconexão atingido');
      this.callbacks.onError?.(new Error('Não foi possível reconectar ao servidor'));
    }
  }
}

export default SignalingService;