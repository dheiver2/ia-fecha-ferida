import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import SimplePeer from 'simple-peer/simplepeer.min.js';
import io, { Socket } from 'socket.io-client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users } from 'lucide-react';
import VideoActions from './components/actions';
import VideoCallHeader from './components/header';

interface SimplePeerVideoCallProps {
	userType?: 'doctor' | 'patient';
	roomId?: string;
}

export default function SimplePeerVideoCall({
	userType = 'patient',
	roomId: propRoomId,
}: SimplePeerVideoCallProps) {
	const { roomId: paramRoomId } = useParams<{ roomId: string }>();

	const roomId = propRoomId || paramRoomId || `room-${Date.now()}`;

	// Refs para vídeos
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	// ADICIONAR: Ref para o peer atual para evitar race conditions
	const peerRef = useRef<SimplePeer.Instance | null>(null);

	// Estados
	const [socket, setSocket] = useState<Socket | null>(null);
	const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<string>('Conectando...');
	const [remoteUserConnected, setRemoteUserConnected] = useState(false);
	const [isCallInitiator, setIsCallInitiator] = useState(false);
	const [callInitiationTimer, setCallInitiationTimer] = useState<NodeJS.Timeout | null>(null);
	const [totalUsers, setTotalUsers] = useState(0);
	const [shouldInitiate, setShouldInitiate] = useState(false);

	const [chatMessages, setChatMessages] = useState<
		Array<{
			message: string;
			sender: string;
			senderType: string;
			timestamp: Date;
		}>
	>([]);
	const [chatInput, setChatInput] = useState('');
	const [showChat, setShowChat] = useState(false);

	// Função para debug
	const debugLog = useCallback(
		(message: string, data?: any) => {
			console.log(`[${userType}] ${message}`, data || '');
		},
		[userType]
	);

	// Inicializar conexão
	useEffect(() => {
		initializeConnection();
		return () => {
			cleanup();
		};
	}, []);

	// Atualizar vídeo local quando stream muda
	useEffect(() => {
		if (localStream && localVideoRef.current) {
			localVideoRef.current.srcObject = localStream;
			debugLog('📺 Stream local atribuído ao vídeo');
		}
	}, [localStream, debugLog]);

	// Atualizar vídeo remoto quando stream muda
	useEffect(() => {
		if (remoteStream && remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = remoteStream;
			debugLog('📺 Stream remoto atribuído ao vídeo');
		}
	}, [remoteStream, debugLog]);

	const initializeConnection = async () => {
		try {
			debugLog('🚀 Iniciando conexão...');

			// Primeiro obter mídia local
			const stream = await getLocalMedia();

			// Conectar ao servidor Socket.IO
			const socketConnection = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
				transports: ['websocket', 'polling'],
				timeout: 20000,
				reconnection: true,
				reconnectionAttempts: 3,
				reconnectionDelay: 1000,
			});

			socketConnection.on('connect', () => {
				debugLog('✅ Conectado ao servidor');
				setConnectionStatus('Conectado ao servidor');
				setIsConnected(true);

				// Entrar na sala
				socketConnection.emit('join-room', roomId, userType);
			});

			socketConnection.on('disconnect', () => {
				debugLog('❌ Desconectado do servidor');
				setConnectionStatus('Desconectado');
				setIsConnected(false);
				setRemoteUserConnected(false);
			});

			// Eventos de usuários
			socketConnection.on('user-joined', (data) => {
				debugLog('👤 Usuário entrou:', data);
				setRemoteUserConnected(true);
				setConnectionStatus(`${data.userType} conectado`);
				setTotalUsers(data.totalUsers);
				setShouldInitiate(true);

				if (data.shouldInitiate) {
					debugLog('📞 Servidor indicou que devo iniciar a chamada');
					setIsCallInitiator(true);
					setTimeout(() => {
						debugLog('📞 Iniciando chamada...');
						initiateCall(socketConnection, stream);
					}, 1500);
				} else {
					debugLog('📞 Aguardando offer do outro usuário...');
					setIsCallInitiator(false);
				}
			});

			socketConnection.on('room-status', (status) => {
				debugLog('📊 Status da sala:', status);
			});

			socketConnection.on('user-left', (data) => {
				debugLog('👋 Usuário saiu:', data);
				setRemoteUserConnected(false);
				setRemoteStream(null);
				setConnectionStatus('Aguardando outro usuário...');

				// CORRIGIDO: Usar peerRef para garantir acesso ao peer atual
				if (peerRef.current) {
					peerRef.current.destroy();
					peerRef.current = null;
					setPeer(null);
				}
			});

			// Eventos WebRTC
			socketConnection.on('offer', async (data) => {
				debugLog('📥 Recebendo offer:', data);
				const stream = await getLocalMedia();
				await handleOffer(data, socketConnection, stream);
			});

			socketConnection.on('answer', (data) => {
				debugLog('📤 Recebendo answer:', data);
				// CORRIGIDO: Usar peerRef em vez de state para evitar race condition
				if (peerRef.current) {
					peerRef.current.signal(data.answer);
				} else {
					debugLog('⚠️ Peer não existe para receber answer');
				}
			});

			socketConnection.on('ice-candidate', (data) => {
				debugLog('🧊 Recebendo ICE candidate:', data);
				// CORRIGIDO: Usar peerRef em vez de state
				if (peerRef.current) {
					peerRef.current.signal(data.candidate);
				} else {
					debugLog('⚠️ Peer não existe para receber ICE candidate');
				}
			});

			// Chat
			socketConnection.on('chat-message', (data) => {
				setChatMessages((prev) => [...prev, data]);
			});

			// Eventos de controle de mídia
			socketConnection.on('remote-video-toggle', (enabled) => {
				debugLog(`📹 Vídeo remoto ${enabled ? 'ativado' : 'desativado'}`);
			});

			socketConnection.on('remote-audio-toggle', (enabled) => {
				debugLog(`🎤 Áudio remoto ${enabled ? 'ativado' : 'desativado'}`);
			});

			setSocket(socketConnection);
		} catch (error) {
			debugLog('❌ Erro na inicialização:', error);
			setConnectionStatus('Erro na conexão');
		}
	};

	const getLocalMedia = async () => {
		try {
			debugLog('📹 Solicitando acesso à mídia...');

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: 1280, max: 1920 },
					height: { ideal: 720, max: 1080 },
					frameRate: { ideal: 30, max: 60 },
				},
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					sampleRate: 48000,
				},
			});

			setLocalStream(stream);
			debugLog(
				`📹 Mídia local obtida - Video: ${stream.getVideoTracks().length}, Audio: ${stream.getAudioTracks().length}`
			);
			setConnectionStatus('Mídia local ativa');

			return stream;
		} catch (error) {
			debugLog('❌ Erro ao obter mídia:', error);
			setConnectionStatus('Erro no acesso à câmera/microfone');

			// Tentar novamente com configurações mais básicas
			try {
				const basicStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				setLocalStream(basicStream);
				debugLog('📹 Mídia local obtida com configurações básicas');
				setConnectionStatus('Mídia local ativa (configuração básica)');
				return basicStream;
			} catch (basicError) {
				debugLog('❌ Erro mesmo com configurações básicas:', basicError);
				throw basicError;
			}
		}
	};

	const initiateCall = (socketConnection: Socket, stream: MediaStream | null) => {
		debugLog('📞 Iniciando chamada como initiator...');

		if (!stream) {
			debugLog('⚠️ Não é possível iniciar chamada sem stream local');
			return;
		}

		try {
			const peerConnection = new SimplePeer({
				initiator: true,
				trickle: false,
				stream: stream,
			});

			debugLog('📞 Peer connection criada com sucesso');

			// CORRIGIDO: Definir peerRef primeiro, depois o state
			peerRef.current = peerConnection;
			setPeer(peerConnection);

			setupPeerEvents(peerConnection, socketConnection);

			console.log('📞 Peer connection criada:', peerConnection);
		} catch (error) {
			debugLog('❌ Erro ao criar peer connection:', error);
			setConnectionStatus('Erro ao criar conexão P2P');
		}
	};

	const handleOffer = async (data: any, socketConnection: Socket, stream: MediaStream | null) => {
		if (!stream) {
			debugLog('⚠️ Não é possível responder à chamada sem stream local');
			return;
		}

		debugLog('📞 Respondendo à chamada...');

		try {
			// Verificar se SimplePeer está disponível
			if (typeof SimplePeer !== 'function') {
				throw new Error('SimplePeer não está disponível ou não foi importado corretamente');
			}

			const peerConnection = new SimplePeer({
				initiator: false,
				trickle: false,
				stream: stream,
			});

			debugLog('📞 Peer connection (resposta) criada com sucesso');

			// CORRIGIDO: Definir peerRef primeiro, depois o state
			peerRef.current = peerConnection;
			setPeer(peerConnection);

			setupPeerEvents(peerConnection, socketConnection);

			peerConnection.signal(data.offer);
		} catch (error) {
			debugLog('❌ Erro ao processar offer:', error);
			setConnectionStatus('Erro ao processar oferta');
		}
	};

	const setupPeerEvents = (peerConnection: SimplePeer.Instance, socketConnection: Socket) => {
		peerConnection.on('signal', (data) => {
			debugLog('📡 Enviando sinal WebRTC:', data.type);

			if (data.type === 'offer') {
				socketConnection.emit('offer', {
					offer: data,
					target: 'all',
				});
			} else if (data.type === 'answer') {
				socketConnection.emit('answer', {
					answer: data,
					target: 'all',
				});
			} else {
				socketConnection.emit('ice-candidate', {
					candidate: data,
					target: 'all',
				});
			}
		});

		peerConnection.on('connect', () => {
			debugLog('🔗 Peer conectado!');
			setConnectionStatus('Chamada conectada');
		});

		peerConnection.on('stream', (stream) => {
			debugLog('📺 Stream remoto recebido');
			debugLog(
				`📺 Stream details - Video tracks: ${stream.getVideoTracks().length}, Audio tracks: ${stream.getAudioTracks().length}`
			);

			setRemoteStream(stream);
			setConnectionStatus('Vídeo ativo');
		});

		peerConnection.on('error', (error) => {
			debugLog('❌ Erro no peer:', error);
			setConnectionStatus('Erro na conexão P2P');
		});

		peerConnection.on('close', () => {
			debugLog('📴 Peer desconectado');
			setConnectionStatus('Chamada encerrada');
			setRemoteStream(null);
			// CORRIGIDO: Limpar peerRef também
			peerRef.current = null;
		});

		// Eventos adicionais para debug
		peerConnection.on('data', (data) => {
			debugLog('📨 Dados recebidos:', data);
		});
	};

	const cleanup = () => {
		debugLog('🧹 Limpando recursos...');

		// Limpar timer se existir
		if (callInitiationTimer) {
			clearTimeout(callInitiationTimer);
			setCallInitiationTimer(null);
		}

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				track.stop();
				debugLog(`🛑 Track parado: ${track.kind}`);
			});
			setLocalStream(null);
		}

		if (remoteStream) {
			remoteStream.getTracks().forEach((track) => track.stop());
			setRemoteStream(null);
		}

		// CORRIGIDO: Usar peerRef para cleanup
		if (peerRef.current) {
			peerRef.current.destroy();
			peerRef.current = null;
			setPeer(null);
			debugLog('🔌 Peer destruído');
		}

		if (socket) {
			socket.disconnect();
			setSocket(null);
			debugLog('🔌 Socket desconectado');
		}

		setIsConnected(false);
		setRemoteUserConnected(false);
	};

	useEffect(() => {
		console.log('stream', localStream);
	}, [localStream]);

	const sendChatMessage = () => {
		if (chatInput.trim() && socket) {
			const messageData = {
				message: chatInput.trim(),
				roomId,
				sender: userType === 'doctor' ? 'Dr.' : 'Paciente',
				senderType: userType,
				timestamp: new Date(),
			};

			socket.emit('chat-message', messageData);

			setChatMessages((prev) => [
				...prev,
				{
					...messageData,
					sender: 'Você',
				},
			]);

			setChatInput('');
			debugLog('💬 Mensagem enviada');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4'>
			<div className='mx-auto max-w-7xl'>
				{/* Header */}
				<VideoCallHeader
					remoteUserConnected={remoteUserConnected}
					isConnected={isConnected}
					connectionStatus={connectionStatus}
					isCallInitiator={isCallInitiator}
					userType={userType}
					socket={socket}
					peer={peer}
					roomId={roomId}
				/>

				{/* Área de vídeo */}
				<div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
					{/* Vídeo principal (remoto) */}
					<div className='lg:col-span-2'>
						<Card className='h-96 lg:h-[500px] border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg'>
							<CardHeader className='pb-2'>
								<CardTitle className='flex items-center justify-between text-sm text-slate-900 dark:text-white'>
									<span>Vídeo Remoto</span>
									{remoteStream && (
										<Badge className='bg-emerald-500 hover:bg-emerald-600 text-white text-xs'>
											Ativo
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className='relative h-full p-2'>
								<video
									ref={remoteVideoRef}
									autoPlay
									playsInline
									className='h-full w-full rounded-lg bg-slate-900 object-cover shadow-inner'
								/>
								{!remoteStream && (
									<div className='absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/90 backdrop-blur-sm'>
										<div className='text-center text-white'>
											<Users className='mx-auto mb-4 h-16 w-16 opacity-50 text-emerald-500' />
											<p className='text-lg font-medium'>
												{remoteUserConnected
													? 'Estabelecendo conexão de vídeo...'
													: 'Aguardando outro participante...'}
											</p>
											{remoteUserConnected && (
												<div className='mt-4'>
													<p className='mb-3 text-sm opacity-75'>Conectando via WebRTC...</p>
												</div>
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Vídeo local e chat */}
					<div className='space-y-4'>
						{/* Vídeo local */}
						<Card className='border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-md'>
							<CardHeader className='pb-2'>
								<CardTitle className='flex items-center justify-between text-sm text-slate-900 dark:text-white'>
									<span>Seu vídeo</span>
									{localStream && (
										<Badge variant='outline' className='text-xs border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'>
											{localStream.getVideoTracks().length}V / {localStream.getAudioTracks().length}A
										</Badge>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className='p-2'>
								<video
									ref={localVideoRef}
									autoPlay
									playsInline
									muted
									className='h-32 w-full rounded bg-slate-900 object-cover shadow-inner'
								/>
							</CardContent>
						</Card>

						{/* Status da Conexão */}
						<Card className='border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-md'>
							<CardHeader className='pb-2'>
								<CardTitle className='text-sm text-slate-900 dark:text-white'>Status da Conexão</CardTitle>
							</CardHeader>
							<CardContent className='p-2'>
								<div className='space-y-2 text-sm'>
									<div className='flex justify-between items-center'>
										<span className='text-slate-600 dark:text-slate-400'>Socket:</span>
										<Badge variant={isConnected ? 'default' : 'destructive'} className={`text-xs ${isConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
											{isConnected ? 'Conectado' : 'Desconectado'}
										</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-slate-600 dark:text-slate-400'>Usuário Remoto:</span>
										<Badge variant={remoteUserConnected ? 'default' : 'secondary'} className={`text-xs ${remoteUserConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
											{remoteUserConnected ? 'Conectado' : 'Ausente'}
										</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-slate-600 dark:text-slate-400'>Vídeo Remoto:</span>
										<Badge variant={remoteStream ? 'default' : 'secondary'} className={`text-xs ${remoteStream ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
											{remoteStream ? 'Ativo' : 'Inativo'}
										</Badge>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-slate-600 dark:text-slate-400'>Peer:</span>
										<Badge variant={peer ? 'default' : 'secondary'} className={`text-xs ${peer ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
											{peer ? 'Conectado' : 'Desconectado'}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Chat */}
						<Card className='flex-1 border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-md'>
							<CardHeader className='pb-2'>
								<div className='flex items-center justify-between'>
									<CardTitle className='text-sm text-slate-900 dark:text-white'>Chat</CardTitle>
									<Button variant='ghost' size='sm' onClick={() => setShowChat(!showChat)} className='hover:bg-slate-100 dark:hover:bg-slate-700'>
										<MessageCircle className='h-4 w-4 text-slate-600 dark:text-slate-400' />
									</Button>
								</div>
							</CardHeader>
							{showChat && (
								<CardContent className='space-y-2 p-2'>
									<div className='h-32 overflow-y-auto rounded bg-slate-50 dark:bg-slate-900/50 p-2 text-sm border border-slate-200 dark:border-slate-700'>
										{chatMessages.length === 0 ? (
											<p className='text-center text-slate-500 dark:text-slate-400'>Nenhuma mensagem ainda</p>
										) : (
											chatMessages.map((msg, index) => (
												<div key={index} className='mb-2'>
													<div className='flex items-center gap-1'>
														<span className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>{msg.sender}</span>
														<span className='text-xs text-slate-400'>
															{new Date(msg.timestamp).toLocaleTimeString()}
														</span>
													</div>
													<p className='text-sm text-slate-700 dark:text-slate-300'>{msg.message}</p>
												</div>
											))
										)}
									</div>
									<div className='flex gap-1'>
										<input
											type='text'
											value={chatInput}
											onChange={(e) => setChatInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
											placeholder='Digite uma mensagem...'
											className='flex-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white'
										/>
										<Button size='sm' onClick={sendChatMessage} disabled={!chatInput.trim() || !socket} className='bg-emerald-600 hover:bg-emerald-700 text-white'>
											Enviar
										</Button>
									</div>
								</CardContent>
							)}
						</Card>
					</div>
				</div>

				<VideoActions
					localStream={localStream}
					userType={userType}
					socket={socket}
					remoteStream={remoteStream}
					peer={peer}
					roomId={roomId}
					cleanup={cleanup}
				/>
			</div>
		</div>
	);
}
