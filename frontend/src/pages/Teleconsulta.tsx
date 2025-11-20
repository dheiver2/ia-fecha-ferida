import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Phone, Users, Video, Clock, Shield, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';

const Teleconsulta: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 lg:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-100 mb-4">
              <Video className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Telemedicina Avançada</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Consultas Médicas <br/>Onde Você Estiver
            </h1>
            <p className="text-emerald-50 text-lg lg:text-xl mb-8 max-w-2xl leading-relaxed">
              Conecte-se com especialistas em tempo real através de nossa plataforma segura de telemedicina. Diagnósticos precisos e acompanhamento contínuo.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold shadow-lg border-0 h-12 px-8"
              >
                <Video className="mr-2 h-5 w-5" />
                Iniciar Consulta Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-emerald-700/30 border-emerald-400/30 text-white hover:bg-emerald-700/50 backdrop-blur-sm h-12 px-8"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Horário
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Ambiente Seguro</CardTitle>
              <CardDescription>
                Criptografia de ponta a ponta para garantir a privacidade total da sua consulta.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Especialistas</CardTitle>
              <CardDescription>
                Acesso direto a médicos especialistas em tratamento de feridas e dermatologia.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Disponibilidade</CardTitle>
              <CardDescription>
                Atendimento flexível com horários estendidos para sua conveniência.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5 text-emerald-600" />
                Videochamada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Inicie uma consulta médica por vídeo com alta qualidade.
              </p>
              <Link to={'/video'} className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:shadow-md transition-all">
                  Iniciar Chamada
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-blue-600" />
                Chamada de Áudio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Realize uma consulta rápida apenas por áudio.
              </p>
              <Button variant="outline" className="w-full group-hover:border-blue-200 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                Chamada de Áudio
              </Button>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
                Agendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Agende uma teleconsulta para um horário específico.
              </p>
              <Button variant="outline" className="w-full group-hover:border-purple-200 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all">
                Ver Agenda
              </Button>
            </CardContent>
          </Card>

          <Card className="group cursor-pointer border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-orange-600" />
                Consultas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie suas consultas em andamento.
              </p>
              <Button variant="outline" className="w-full group-hover:border-orange-200 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-all">
                Ver Consultas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments Preview */}
        <Card className="border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Seus agendamentos confirmados para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold">
                      DR
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Dr. Ricardo Silva</h4>
                      <p className="text-sm text-slate-500">Dermatologista • Videochamada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-white">Hoje, 14:30</p>
                    <div className="flex items-center justify-end gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmado
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Teleconsulta };
export default Teleconsulta;
