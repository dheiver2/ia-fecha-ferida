import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Mic,
	MicOff,
	PhoneOff,
	Video,
	VideoOff
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';


interface Props extends React.HTMLAttributes<HTMLDivElement> {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	peer: SimplePeer.Instance | null;
	socket: Socket | null;
	roomId: string;
	userType: 'patient' | 'doctor';
	cleanup: () => void;
}

export default function VideoActions({ localStream, userType, socket, remoteStream, peer, roomId, cleanup, ...props }: Props) {
	const navigate = useNavigate();

	const [isVideoEnabled, setIsVideoEnabled] = useState(true);
	const [isAudioEnabled, setIsAudioEnabled] = useState(true);

	// Função para debug
	const debugLog = useCallback((message: string, data?: any) => {
		console.log(`[${userType}] ${message}`, data || '');
	}, [userType]);


	const toggleVideo = () => {
		if (localStream) {
			const videoTrack = localStream.getVideoTracks()[0];
			if (videoTrack) {
				videoTrack.enabled = !videoTrack.enabled;
				setIsVideoEnabled(videoTrack.enabled);
				debugLog(`📹 Vídeo ${videoTrack.enabled ? 'ativado' : 'desativado'}`);

				if (socket) {
					socket.emit('toggle-video', { enabled: videoTrack.enabled, roomId });
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
				debugLog(`🎤 Áudio ${audioTrack.enabled ? 'ativado' : 'desativado'}`);

				if (socket) {
					socket.emit('toggle-audio', { enabled: audioTrack.enabled, roomId });
				}
			}
		}
	};


	const endCall = () => {
		debugLog('📞 Encerrando chamada...');
		cleanup();
		navigate('/teleconsulta');
	};

	return (
		<>

			{/* Controles */}
			<Card className="border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-center justify-center gap-4">
						<Button
							variant={isVideoEnabled ? "default" : "destructive"}
							size="lg"
							onClick={toggleVideo}
							disabled={!localStream}
							className={isVideoEnabled ? "bg-medical-success hover:bg-medical-success/90 text-white" : ""}
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
							disabled={!localStream}
							className={isAudioEnabled ? "bg-medical-success hover:bg-medical-success/90 text-white" : ""}
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
							className="bg-rose-600 hover:bg-rose-700 text-white"
						>
							<PhoneOff className="w-5 h-5 mr-2" />
							Encerrar Chamada
						</Button>
					</div>

					{/* Informações de Debug */}
					<div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
						<div className="text-xs text-slate-500 dark:text-slate-400 text-center">
							Stream Local: {localStream ? 'Ativo' : 'Inativo'} |
							Stream Remoto: {remoteStream ? 'Ativo' : 'Inativo'} |
							Peer: {peer ? 'Conectado' : 'Desconectado'}
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
