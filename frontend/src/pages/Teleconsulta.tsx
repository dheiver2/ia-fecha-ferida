import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Phone, Users, Video } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Teleconsulta: React.FC = () => {
	return (
		<div className='bg-background min-h-screen'>
			<Header />
			<main className='container mx-auto px-4 py-8'>
				<div className='mx-auto max-w-4xl'>
					<h1 className='mb-8 text-3xl font-bold'>Teleconsulta</h1>

					<div className='grid gap-6 md:grid-cols-2'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Video className='h-5 w-5' />
									Iniciar Videochamada
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-muted-foreground'>Inicie uma consulta médica por videochamada.</p>
								<Link to={'/video'}>
									<Button className='w-full'>
										<Video className='mr-2 h-4 w-4' />
										Iniciar Chamada
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Phone className='h-5 w-5' />
									Chamada de Áudio
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-muted-foreground'>Realize uma consulta apenas por áudio.</p>
								<Button variant='outline' className='w-full'>
									<Phone className='mr-2 h-4 w-4' />
									Chamada de Áudio
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Calendar className='h-5 w-5' />
									Agendar Consulta
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-muted-foreground'>Agende uma teleconsulta para um horário específico.</p>
								<Button variant='secondary' className='w-full'>
									<Calendar className='mr-2 h-4 w-4' />
									Agendar
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<Users className='h-5 w-5' />
									Consultas Ativas
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<p className='text-muted-foreground'>Visualize consultas em andamento.</p>
								<Button variant='ghost' className='w-full'>
									<Users className='mr-2 h-4 w-4' />
									Ver Consultas
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export { Teleconsulta };
export default Teleconsulta;
