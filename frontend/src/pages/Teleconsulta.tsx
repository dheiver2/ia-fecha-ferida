import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Phone, 
  Users, 
  Video, 
  Clock, 
  MoreVertical, 
  FileText, 
  MessageSquare,
  Plus,
  ArrowRight
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Teleconsulta: React.FC = () => {
  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: 1,
      patient: "Maria Silva",
      time: "14:30",
      date: "Hoje",
      type: "Retorno",
      status: "confirmed",
      avatar: "MS"
    },
    {
      id: 2,
      patient: "João Santos",
      time: "16:00",
      date: "Hoje",
      type: "Primeira Consulta",
      status: "pending",
      avatar: "JS"
    }
  ];

  const recentCalls = [
    {
      id: 1,
      patient: "Ana Oliveira",
      date: "Ontem, 15:45",
      duration: "24 min",
      type: "Video"
    },
    {
      id: 2,
      patient: "Carlos Souza",
      date: "18/11/2024",
      duration: "12 min",
      type: "Áudio"
    }
  ];

  return (
    <div className='bg-background min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 container mx-auto px-4 py-8 pt-24'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>Telemedicina</h1>
            <p className='text-muted-foreground mt-1'>Gerencie suas consultas e atendimentos remotos</p>
          </div>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content Area */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Hero Section - Next Appointment */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  Próximo Atendimento
                </CardTitle>
                <CardDescription>Sua próxima consulta agendada começa em breve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-lg border shadow-sm">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">MS</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-bold">Maria Silva</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Retorno</Badge>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Hoje</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 14:30</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Queixa principal: Acompanhamento de cicatrização pós-cirúrgica.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Link to={'/video'}>
                      <Button className="w-full bg-medical-success hover:bg-medical-success/90 text-white shadow-lg shadow-medical-success/20 transition-all hover:scale-105">
                        <Video className="mr-2 h-4 w-4" />
                        Iniciar Sala
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Prontuário
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Ações Rápidas
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-blue-500">
                  <CardContent className='p-6 flex items-center gap-4'>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">Sala de Espera</h3>
                      <p className="text-sm text-muted-foreground">3 pacientes aguardando</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-green-500">
                  <CardContent className='p-6 flex items-center gap-4'>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-green-600 transition-colors">Agenda do Dia</h3>
                      <p className="text-sm text-muted-foreground">8 consultas restantes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-purple-500">
                  <CardContent className='p-6 flex items-center gap-4'>
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-purple-600 transition-colors">Mensagens</h3>
                      <p className="text-sm text-muted-foreground">5 novas mensagens</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-orange-500">
                  <CardContent className='p-6 flex items-center gap-4'>
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-orange-600 transition-colors">Relatórios</h3>
                      <p className="text-sm text-muted-foreground">Gerar relatórios do dia</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Upcoming List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Próximos Horários</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">{apt.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{apt.patient}</p>
                        <p className="text-xs text-muted-foreground">{apt.type} • {apt.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary/80">
                    Ver agenda completa <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico Recente</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentCalls.map((call) => (
                    <div key={call.id} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${call.type === 'Video' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {call.type === 'Video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{call.patient}</p>
                        <p className="text-xs text-muted-foreground">{call.date} • {call.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
