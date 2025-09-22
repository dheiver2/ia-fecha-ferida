import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	peer: SimplePeer.Instance | null;
	connectionStatus: string;
	isCallInitiator: boolean;
	remoteUserConnected: boolean;
	isConnected: boolean;
	socket: Socket | null;
	roomId: string;
	userType: 'patient' | 'doctor';
}

export default function VideoCallHeader({
	remoteUserConnected,
	isConnected,
	connectionStatus,
	isCallInitiator,
	userType,
	socket,
	peer,
	roomId,
	...props
}: HeaderProps) {
	// Função para debug
	const debugLog = useCallback(
		(message: string, data?: any) => {
			console.log(`[${userType}] ${message}`, data || '');
		},
		[userType]
	);

	// Função para debug - obter status da sala
	const getRoomStatus = () => {
		if (socket) {
			socket.emit('get-room-status');
		}
	};

	const copyInviteLink = () => {
		const inviteLink = `${window.location.origin}/teleconsulta/join/${roomId}`;
		navigator.clipboard
			.writeText(inviteLink)
			.then(() => {
				debugLog('📋 Link copiado para área de transferência');
				// Aqui você pode adicionar uma notificação de sucesso
			})
			.catch((err) => {
				debugLog('❌ Erro ao copiar link:', err);
			});
	};

	return (
		<>
			<div className='mb-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Teleconsulta - {userType === 'doctor' ? 'Médico' : 'Paciente'}
						</h1>
						<p className='text-gray-600'>Sala: {roomId}</p>
						<p className='text-sm text-gray-500'>
							Você é o {isCallInitiator ? 'iniciador' : 'receptor'} da chamada
						</p>
					</div>
					<div className='flex items-center gap-4'>
						<Badge variant={isConnected ? 'default' : 'destructive'}>{connectionStatus}</Badge>
						<Badge variant={remoteUserConnected ? 'default' : 'secondary'}>
							{remoteUserConnected ? 'Usuário Conectado' : 'Aguardando...'}
						</Badge>
						{userType === 'doctor' && (
							<Button onClick={copyInviteLink} variant='outline' size='sm'>
								<Copy className='mr-2 h-4 w-4' />
								Copiar Link
							</Button>
						)}
						<Button onClick={getRoomStatus} variant='outline' size='sm'>
							Debug Status
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
