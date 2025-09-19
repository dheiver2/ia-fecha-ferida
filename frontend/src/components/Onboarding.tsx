import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Play, Users, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
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
      title: 'Bem-vindo ao Casa Fecha Feridas! 👋',
      description: 'Sua plataforma completa para análise de feridas com IA',
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Como médico, você tem acesso a todas as funcionalidades avançadas:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Análise de feridas com IA</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Teleconsultas com pacientes</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Histórico completo de análises</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Relatórios médicos detalhados</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'analise',
      title: 'Análise de Feridas com IA 🔬',
      description: 'Faça upload de imagens e receba análises detalhadas',
      icon: <Camera className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Nossa IA analisa imagens de feridas e fornece:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="secondary">Classificação de gravidade</Badge>
            <Badge variant="secondary">Recomendações de tratamento</Badge>
            <Badge variant="secondary">Medições precisas</Badge>
            <Badge variant="secondary">Relatórios detalhados</Badge>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Dica:</strong> Para melhores resultados, tire fotos com boa iluminação e foque na ferida.
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
          <p className="text-gray-600">
            Realize consultas remotas com recursos avançados:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Videochamada HD com chat</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Compartilhamento de tela</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Prescrições digitais</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Convites automáticos para pacientes</span>
            </li>
          </ul>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">
              🔗 <strong>Como funciona:</strong> Crie uma sala e envie o código para o paciente entrar.
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
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Mantenha um registro completo de todas as análises:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">Relatórios Detalhados</p>
                <p className="text-sm text-gray-600">Exportação em PDF com análises completas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Acompanhamento de Evolução</p>
                <p className="text-sm text-gray-600">Compare análises ao longo do tempo</p>
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
          <p className="text-gray-600">
            Como paciente, você pode participar de consultas médicas remotas de forma simples e segura.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              🔒 <strong>Privacidade garantida:</strong> Suas consultas são criptografadas e seguras.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'como-entrar',
      title: 'Como Entrar na Consulta 🚪',
      description: 'Duas formas simples de acessar',
      icon: <Play className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Opção 1: Com Código</h4>
              <p className="text-sm text-gray-600">
                Seu médico enviará um código. Digite-o na página inicial para entrar diretamente.
              </p>
            </div>
            <div className="border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">Opção 2: Link Direto</h4>
              <p className="text-sm text-gray-600">
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
          <p className="text-gray-600">Durante a videochamada você pode:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Ligar/desligar câmera e microfone</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Usar o chat para mensagens</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Ver prescrições e orientações</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  const visitanteSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Casa Fecha Feridas 🏥',
      description: 'Tecnologia médica avançada para cuidado de feridas',
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Descubra como nossa plataforma revoluciona o cuidado de feridas com inteligência artificial.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Badge variant="outline">IA Avançada</Badge>
            <Badge variant="outline">Teleconsultas</Badge>
            <Badge variant="outline">Relatórios Precisos</Badge>
            <Badge variant="outline">Seguro e Confiável</Badge>
          </div>
        </div>
      )
    },
    {
      id: 'para-medicos',
      title: 'Para Médicos 👨‍⚕️',
      description: 'Ferramentas profissionais completas',
      icon: <FileText className="w-8 h-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Recursos para profissionais de saúde:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Análise automatizada de feridas</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Teleconsultas integradas</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Histórico completo de pacientes</span>
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
          <p className="text-gray-600">
            Participe de consultas médicas remotas de forma fácil e segura.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">
              💡 <strong>Tem um código de consulta?</strong> Digite-o abaixo para entrar diretamente.
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0"
            onClick={handleSkip}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <span className="text-sm text-gray-500">
              {currentStep + 1} de {steps.length}
            </span>
            
            <div className="flex gap-2">
              {currentStepData.action && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = currentStepData.action!.href}
                >
                  {currentStepData.action.label}
                </Button>
              )}
              
              <Button onClick={nextStep} className="flex items-center gap-2">
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
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