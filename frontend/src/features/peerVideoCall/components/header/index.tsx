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
						<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
							Teleconsulta - {userType === 'doctor' ? 'Médico' : 'Paciente'}
						</h1>
						<p className='text-slate-600 dark:text-slate-400'>Sala: {roomId}</p>
						<p className='text-sm text-slate-500 dark:text-slate-500'>
							Você é o {isCallInitiator ? 'iniciador' : 'receptor'} da chamada
						</p>
					</div>
					<div className='flex items-center gap-4'>
						<Badge variant={isConnected ? 'default' : 'destructive'} className={isConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>{connectionStatus}</Badge>
						<Badge variant={remoteUserConnected ? 'default' : 'secondary'} className={remoteUserConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
							{remoteUserConnected ? 'Usuário Conectado' : 'Aguardando...'}
						</Badge>
						{userType === 'doctor' && (
							<Button onClick={copyInviteLink} variant='outline' size='sm' className='border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20'>
								<Copy className='mr-2 h-4 w-4' />
								Copiar Link
							</Button>
						)}
						<Button onClick={getRoomStatus} variant='outline' size='sm' className='border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'>
							Debug Status
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
