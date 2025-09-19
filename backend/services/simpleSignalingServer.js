const { Server } = require('socket.io');

class SimpleSignalingServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.rooms = new Map();
    this.setupEventHandlers();
    
    console.log('🔄 Simple Signaling Server initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Entrar em uma sala
      socket.on('join-room', (roomId, userType = 'patient') => {
        console.log(`🏠 User ${socket.id} joining room ${roomId} as ${userType}`);
        
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userType = userType;

        // Inicializar sala se não existir
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, {
            id: roomId,
            users: new Map(),
            createdAt: new Date()
          });
        }

        const room = this.rooms.get(roomId);
        room.users.set(socket.id, {
          id: socket.id,
          type: userType,
          joinedAt: new Date()
        });

        // Notificar outros usuários na sala
        socket.to(roomId).emit('user-joined', {
          userId: socket.id,
          userType: userType,
          totalUsers: room.users.size
        });

        // Enviar lista de usuários para o novo usuário
        socket.emit('room-users', Array.from(room.users.values()));

        console.log(`✅ Room ${roomId} now has ${room.users.size} users`);
      });

      // Sinalização WebRTC - Offer
      socket.on('offer', (data) => {
        console.log(`📤 Offer from ${socket.id} to ${data.target}`);
        socket.to(data.target).emit('offer', {
          offer: data.offer,
          sender: socket.id
        });
      });

      // Sinalização WebRTC - Answer
      socket.on('answer', (data) => {
        console.log(`📥 Answer from ${socket.id} to ${data.target}`);
        socket.to(data.target).emit('answer', {
          answer: data.answer,
          sender: socket.id
        });
      });

      // Sinalização WebRTC - ICE Candidate
      socket.on('ice-candidate', (data) => {
        console.log(`🧊 ICE candidate from ${socket.id} to ${data.target}`);
        socket.to(data.target).emit('ice-candidate', {
          candidate: data.candidate,
          sender: socket.id
        });
      });

      // Chat de texto
      socket.on('chat-message', (data) => {
        if (socket.roomId) {
          socket.to(socket.roomId).emit('chat-message', {
            message: data.message,
            sender: socket.id,
            senderType: socket.userType,
            timestamp: new Date()
          });
        }
      });

      // Controles de mídia
      socket.on('toggle-audio', (enabled) => {
        if (socket.roomId) {
          socket.to(socket.roomId).emit('user-audio-toggle', {
            userId: socket.id,
            enabled: enabled
          });
        }
      });

      socket.on('toggle-video', (enabled) => {
        if (socket.roomId) {
          socket.to(socket.roomId).emit('user-video-toggle', {
            userId: socket.id,
            enabled: enabled
          });
        }
      });

      // Desconexão
      socket.on('disconnect', () => {
        console.log(`👋 User disconnected: ${socket.id}`);
        
        if (socket.roomId && this.rooms.has(socket.roomId)) {
          const room = this.rooms.get(socket.roomId);
          room.users.delete(socket.id);

          // Notificar outros usuários
          socket.to(socket.roomId).emit('user-left', {
            userId: socket.id,
            totalUsers: room.users.size
          });

          // Remover sala se vazia
          if (room.users.size === 0) {
            this.rooms.delete(socket.roomId);
            console.log(`🗑️ Room ${socket.roomId} deleted (empty)`);
          }
        }
      });

      // Heartbeat para manter conexão
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Método para obter estatísticas
  getStats() {
    return {
      totalRooms: this.rooms.size,
      totalConnections: this.io.sockets.sockets.size,
      rooms: Array.from(this.rooms.values()).map(room => ({
        id: room.id,
        userCount: room.users.size,
        createdAt: room.createdAt
      }))
    };
  }

  // Limpeza de salas vazias (chamado periodicamente)
  cleanupEmptyRooms() {
    const now = new Date();
    const maxAge = 30 * 60 * 1000; // 30 minutos

    for (const [roomId, room] of this.rooms.entries()) {
      if (room.users.size === 0 && (now - room.createdAt) > maxAge) {
        this.rooms.delete(roomId);
        console.log(`🧹 Cleaned up old empty room: ${roomId}`);
      }
    }
  }
}

module.exports = SimpleSignalingServer;