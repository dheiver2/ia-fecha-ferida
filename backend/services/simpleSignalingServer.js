const { Server } = require('socket.io');

class SimpleSignalingServer {
	constructor(httpServer) {
		this.io = new Server(httpServer, {
			cors: {
				origin: process.env.FRONTEND_URL || 'http://localhost:8080',
				methods: ['GET', 'POST'],
				credentials: true,
			},
			transports: ['websocket', 'polling'],
		});

		this.rooms = new Map();
		this.setupEventHandlers();

		console.log('🔄 Simple Signaling Server initialized');

		// Limpeza periódica de salas vazias
		setInterval(() => {
			this.cleanupEmptyRooms();
		}, 5 * 60 * 1000); // A cada 5 minutos
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
						createdAt: new Date(),
						callInitiated: false,
					});
				}

				const room = this.rooms.get(roomId);
				room.users.set(socket.id, {
					id: socket.id,
					type: userType,
					joinedAt: new Date(),
				});

				const totalUsers = room.users.size;
				console.log(`✅ Room ${roomId} now has ${totalUsers} users`);

				// Determinar quem deve iniciar a chamada quando há 2 usuários
				let shouldInitiate = false;
				if (totalUsers === 2 && !room.callInitiated) {
					// Lógica de prioridade:
					// 1. Médico sempre inicia se presente
					// 2. Se não há médico, o primeiro usuário (mais antigo) inicia

					const users = Array.from(room.users.values());
					const doctors = users.filter((u) => u.type === 'doctor');
					const patients = users.filter((u) => u.type === 'patient');

					if (doctors.length > 0) {
						// Há médico(s) - o médico que acabou de entrar inicia se for médico
						shouldInitiate = userType === 'doctor';
					} else if (patients.length === 2) {
						// Dois pacientes - o segundo (que acabou de entrar) inicia
						shouldInitiate = true;
					}

					if (shouldInitiate) {
						room.callInitiated = true;
					}

					console.log(`📞 Call initiation logic - shouldInitiate: ${shouldInitiate} for ${userType}`);
				}

				// Notificar outros usuários na sala sobre a entrada do novo usuário
				socket.to(roomId).emit('user-joined', {
					userId: socket.id,
					userType: userType,
					totalUsers: totalUsers,
					shouldInitiate: false, // Outros usuários não devem iniciar
				});

				// Notificar o usuário atual se ele deve iniciar a chamada
				if (shouldInitiate) {
					socket.emit('user-joined', {
						userId: socket.id,
						userType: userType,
						totalUsers: totalUsers,
						shouldInitiate: true,
					});
				}

				// Enviar lista de usuários para o novo usuário
				socket.emit('room-users', Array.from(room.users.values()));

				// Fallback: se após 5 segundos nenhuma chamada foi iniciada e há 2 usuários
				if (totalUsers === 2) {
					setTimeout(() => {
						const currentRoom = this.rooms.get(roomId);
						if (currentRoom && !currentRoom.callInitiated && currentRoom.users.size === 2) {
							console.log(`⏰ Fallback: No call initiated in room ${roomId}, forcing first user to start`);
							const firstUser = Array.from(currentRoom.users.values())[0];
							this.io.to(firstUser.id).emit('should-initiate-call');
							currentRoom.callInitiated = true;
						}
					}, 5000);
				}
			});

			// Sinalização WebRTC - Offer
			socket.on('offer', (data) => {
				console.log(`📤 Offer from ${socket.id}`);

				if (socket.roomId) {
					// Marcar que a chamada foi iniciada
					const room = this.rooms.get(socket.roomId);
					if (room) {
						room.callInitiated = true;
					}

					// Enviar offer para todos os outros usuários na sala
					if (data.target === 'all') {
						socket.to(socket.roomId).emit('offer', {
							offer: data.offer,
							sender: socket.id,
						});
					} else {
						socket.to(data.target).emit('offer', {
							offer: data.offer,
							sender: socket.id,
						});
					}
				}
			});

			// Sinalização WebRTC - Answer
			socket.on('answer', (data) => {
				console.log(`📥 Answer from ${socket.id}`);

				if (socket.roomId) {
					// Enviar answer para todos os outros usuários na sala
					if (data.target === 'all') {
						socket.to(socket.roomId).emit('answer', {
							answer: data.answer,
							sender: socket.id,
						});
					} else {
						socket.to(data.target).emit('answer', {
							answer: data.answer,
							sender: socket.id,
						});
					}
				}
			});

			// Sinalização WebRTC - ICE Candidate
			socket.on('ice-candidate', (data) => {
				console.log(`🧊 ICE candidate from ${socket.id}`);

				if (socket.roomId) {
					// Enviar ICE candidate para todos os outros usuários na sala
					if (data.target === 'all') {
						socket.to(socket.roomId).emit('ice-candidate', {
							candidate: data.candidate,
							sender: socket.id,
						});
					} else {
						socket.to(data.target).emit('ice-candidate', {
							candidate: data.candidate,
							sender: socket.id,
						});
					}
				}
			});

			// Chat de texto
			socket.on('chat-message', (data) => {
				if (socket.roomId) {
					const messageData = {
						message: data.message,
						sender: socket.userType === 'doctor' ? 'Dr.' : 'Paciente',
						senderType: socket.userType,
						timestamp: new Date(),
					};

					socket.to(socket.roomId).emit('chat-message', messageData);
					console.log(`💬 Chat message in room ${socket.roomId}: ${data.message}`);
				}
			});

			// Controles de mídia
			socket.on('toggle-audio', (data) => {
				if (socket.roomId) {
					socket.to(socket.roomId).emit('remote-audio-toggle', {
						userId: socket.id,
						enabled: data.enabled || data,
					});
					console.log(`🎤 Audio toggled by ${socket.id}: ${data.enabled || data}`);
				}
			});

			socket.on('toggle-video', (data) => {
				if (socket.roomId) {
					socket.to(socket.roomId).emit('remote-video-toggle', {
						userId: socket.id,
						enabled: data.enabled || data,
					});
					console.log(`📹 Video toggled by ${socket.id}: ${data.enabled || data}`);
				}
			});

			// Reconectar à sala (útil para reconexões)
			socket.on('rejoin-room', (roomId, userType) => {
				console.log(`🔄 User ${socket.id} rejoining room ${roomId}`);
				// Usar a mesma lógica de join-room mas sem notificar entrada
				socket.join(roomId);
				socket.roomId = roomId;
				socket.userType = userType;
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
						totalUsers: room.users.size,
					});

					console.log(`📊 Room ${socket.roomId} now has ${room.users.size} users`);

					// Reset call initiation flag quando usuário sai
					if (room.users.size === 1) {
						room.callInitiated = false;
					}

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

			// Debug: obter status da sala
			socket.on('get-room-status', () => {
				if (socket.roomId && this.rooms.has(socket.roomId)) {
					const room = this.rooms.get(socket.roomId);
					socket.emit('room-status', {
						roomId: socket.roomId,
						totalUsers: room.users.size,
						callInitiated: room.callInitiated,
						users: Array.from(room.users.values()),
					});
				}
			});
		});
	}

	// Método para obter estatísticas
	getStats() {
		return {
			totalRooms: this.rooms.size,
			totalConnections: this.io.sockets.sockets.size,
			rooms: Array.from(this.rooms.values()).map((room) => ({
				id: room.id,
				userCount: room.users.size,
				callInitiated: room.callInitiated,
				createdAt: room.createdAt,
				users: Array.from(room.users.values()).map((u) => ({
					type: u.type,
					joinedAt: u.joinedAt,
				})),
			})),
		};
	}

	// Forçar início de chamada em uma sala específica
	forceCallInitiation(roomId) {
		const room = this.rooms.get(roomId);
		if (room && room.users.size === 2 && !room.callInitiated) {
			const firstUser = Array.from(room.users.values())[0];
			this.io.to(firstUser.id).emit('should-initiate-call');
			room.callInitiated = true;
			console.log(`🔄 Forced call initiation in room ${roomId}`);
			return true;
		}
		return false;
	}

	// Limpeza de salas vazias (chamado periodicamente)
	cleanupEmptyRooms() {
		const now = new Date();
		const maxAge = 30 * 60 * 1000; // 30 minutos

		for (const [roomId, room] of this.rooms.entries()) {
			if (room.users.size === 0 && now - room.createdAt > maxAge) {
				this.rooms.delete(roomId);
				console.log(`🧹 Cleaned up old empty room: ${roomId}`);
			}
		}
	}

	// Método para debug/monitoramento
	logRoomStatus(roomId) {
		const room = this.rooms.get(roomId);
		if (room) {
			console.log(`📊 Room ${roomId} status:`, {
				users: room.users.size,
				callInitiated: room.callInitiated,
				userTypes: Array.from(room.users.values()).map((u) => u.type),
			});
		}
	}
}

module.exports = SimpleSignalingServer;
