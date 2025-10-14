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
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-center gap-4">
						<Button
							variant={isVideoEnabled ? "default" : "destructive"}
							size="lg"
							onClick={toggleVideo}
							disabled={!localStream}
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

					{/* Informações de Debug */}
					<div className="mt-4 pt-4 border-t">
						<div className="text-xs text-gray-500 text-center">
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
