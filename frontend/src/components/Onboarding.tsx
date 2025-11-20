import React, { useState, useEffect, ReactNode } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Play, Users, Camera, FileText, Shield, Activity, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  content: ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

interface OnboardingProps {
  userType: 'medico' | 'paciente' | 'visitante';
  onComplete: () => void;
  onSkip: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ userType, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const medicoSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Vascular One! 👋',
      description: 'Sua plataforma completa para análise de feridas com IA',
      icon: <Stethoscope className="w-8 h-8 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Como médico, você tem acesso a todas as funcionalidades avançadas:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Análise de feridas com IA</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Teleconsultas com pacientes</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Histórico completo de análises</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Relatórios médicos detalhados</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'analise',
      title: 'Análise de Feridas com IA 🔬',
      description: 'Faça upload de imagens e receba análises detalhadas',
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Nossa IA analisa imagens de feridas e fornece:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 justify-center">Classificação de gravidade</Badge>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 justify-center">Recomendações de tratamento</Badge>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 justify-center">Medições precisas</Badge>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 justify-center">Relatórios detalhados</Badge>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <span className="text-lg">💡</span> 
              <span><strong>Dica:</strong> Para melhores resultados, tire fotos com boa iluminação e foque na ferida.</span>
            </p>
          </div>
        </div>
      ),
      action: {
        label: 'Fazer primeira análise',
        href: '/analise'
      }
    },
    {
      id: 'teleconsulta',
      title: 'Teleconsultas Integradas 📹',
      description: 'Conecte-se com pacientes em videochamadas seguras',
      icon: <Users className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Realize consultas remotas com recursos avançados:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Videochamada HD com chat</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Compartilhamento de tela</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Prescrições digitais</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Convites automáticos para pacientes</span>
            </li>
          </ul>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
              <span className="text-lg">🔗</span>
              <span><strong>Como funciona:</strong> Crie uma sala e envie o código para o paciente entrar.</span>
            </p>
          </div>
        </div>
      ),
      action: {
        label: 'Iniciar teleconsulta',
        href: '/teleconsulta'
      }
    },
    {
      id: 'historico',
      title: 'Histórico e Relatórios 📊',
      description: 'Acompanhe a evolução dos seus pacientes',
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Mantenha um registro completo de todas as análises:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Relatórios Detalhados</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Exportação em PDF com análises completas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Acompanhamento de Evolução</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Compare análises ao longo do tempo</p>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        label: 'Ver histórico',
        href: '/historico'
      }
    }
  ];

  const pacienteSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo! 👋',
      description: 'Acesso rápido e seguro às teleconsultas',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Como paciente, você pode participar de consultas médicas remotas de forma simples e segura.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <span className="text-lg">🔒</span>
              <span><strong>Privacidade garantida:</strong> Suas consultas são criptografadas e seguras.</span>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'como-entrar',
      title: 'Como Entrar na Consulta 🚪',
      description: 'Duas formas simples de acessar',
      icon: <Play className="w-8 h-8 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-xs font-bold">1</span>
                Opção 1: Com Código
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 ml-8">
                Seu médico enviará um código. Digite-o na página inicial para entrar diretamente.
              </p>
            </div>
            <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold">2</span>
                Opção 2: Link Direto
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 ml-8">
                Clique no link enviado pelo seu médico para entrar automaticamente.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'durante-consulta',
      title: 'Durante a Consulta 💬',
      description: 'Recursos disponíveis para você',
      icon: <Camera className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">Durante a videochamada você pode:</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Ligar/desligar câmera e microfone</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Usar o chat para mensagens</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Ver prescrições e orientações</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const visitanteSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Vascular One 🏥',
      description: 'Tecnologia médica avançada para cuidado de feridas',
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Descubra como nossa plataforma revoluciona o cuidado de feridas com inteligência artificial.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="outline" className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 py-2 justify-center">IA Avançada</Badge>
            <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 py-2 justify-center">Teleconsultas</Badge>
            <Badge variant="outline" className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 py-2 justify-center">Relatórios Precisos</Badge>
            <Badge variant="outline" className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 py-2 justify-center">Seguro e Confiável</Badge>
          </div>
        </div>
      )
    },
    {
      id: 'para-medicos',
      title: 'Para Médicos 👨‍⚕️',
      description: 'Ferramentas profissionais completas',
      icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">Recursos para profissionais de saúde:</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Análise automatizada de feridas</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Teleconsultas integradas</span>
            </li>
            <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-slate-700 dark:text-slate-200">Histórico completo de pacientes</span>
            </li>
          </ul>
        </div>
      ),
      action: {
        label: 'Fazer login médico',
        href: '/login'
      }
    },
    {
      id: 'para-pacientes',
      title: 'Para Pacientes 👥',
      description: 'Acesso simples às consultas',
      icon: <Users className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">
            Participe de consultas médicas remotas de forma fácil e segura.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span><strong>Tem um código de consulta?</strong> Digite-o abaixo para entrar diretamente.</span>
            </p>
          </div>
        </div>
      ),
      action: {
        label: 'Entrar com código',
        href: '/paciente'
      }
    }
  ];

  const steps = userType === 'medico' ? medicoSteps : userType === 'paciente' ? pacienteSteps : visitanteSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className={`w-full max-w-2xl transition-all duration-500 border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleSkip}
          >
            <X className="w-5 h-5 text-slate-500" />
          </Button>
          
          <div className="flex items-center gap-4 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              {currentStepData.icon}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{currentStepData.title}</CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400 mt-1">{currentStepData.description}</CardDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-6">
          <div className="min-h-[200px] animate-in slide-in-from-right-4 duration-300 fade-in">
            {currentStepData.content}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              Passo {currentStep + 1} de {steps.length}
            </span>
            
            <div className="flex gap-3">
              {currentStepData.action && (
                <Button
                  variant="outline"
                  className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  onClick={() => window.location.href = currentStepData.action!.href}
                >
                  {currentStepData.action.label}
                </Button>
              )}
              
              <Button 
                onClick={nextStep} 
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {currentStep === steps.length - 1 ? 'Começar Agora' : 'Próximo'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;