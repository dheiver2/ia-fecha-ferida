import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Onboarding from "@/components/Onboarding";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/hooks/useOnboarding";
import { 
  Shield, 
  Zap, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Heart,
  Brain,
  Stethoscope,
  Target,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { shouldShow, userType, completeOnboarding, skipOnboarding } = useOnboarding();
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Sistema de Onboarding */}
      {shouldShow && (
        <Onboarding
          userType={userType}
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      {/* Hero Section - Enhanced */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950 -z-20"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10 animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/20 rounded-full text-primary font-semibold text-sm shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Zap className="w-4 h-4 mr-2 fill-primary" />
                    Tecnologia Médica de Última Geração
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <span className="block text-foreground dark:text-white">Revolucione o</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-red-500 to-accent">
                      Cuidado de Feridas
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Análise inteligente com IA avançada. Diagnósticos precisos, 
                    tratamentos personalizados e resultados comprovados em segundos.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                  <Link to={user ? "/analise" : "/login"} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 group text-lg">
                      {user ? "Começar Análise" : "Entrar para Analisar"}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/simples" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 text-foreground font-bold px-8 py-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      Videochamada Rápida
                      <Stethoscope className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 overflow-hidden">
                           <User className="w-6 h-6 opacity-50" />
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground dark:text-white">+1000</p>
                      <p className="text-xs text-muted-foreground">Profissionais ativos</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground dark:text-white">4.9/5</p>
                      <p className="text-xs text-muted-foreground">Avaliação média</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-12 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <div className="relative z-10 glass-card rounded-[2rem] p-6 sm:p-8 border border-white/40 dark:border-gray-700/40 shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground dark:text-gray-100">Análise em Tempo Real</h3>
                          <p className="text-xs text-muted-foreground">Processamento via IA</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-900/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Online</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Segmentação da Lesão</span>
                        </div>
                        <span className="text-xs font-bold text-primary">100%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Classificação Tecidual</span>
                        </div>
                        <span className="text-xs font-bold text-primary">98%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-primary/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gerando Prognóstico...</span>
                        </div>
                        <span className="text-xs font-bold text-primary relative z-10">Processando</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Precisão do Modelo</span>
                        <span className="font-bold text-primary">99.4%</span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent w-[99.4%] rounded-full shadow-[0_0_10px_rgba(255,75,62,0.5)]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 glass p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <div className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl shadow-xl animate-bounce duration-[4000ms] delay-700">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Por que escolher
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground dark:text-white">
              Tecnologia que <span className="text-primary">Salva Vidas</span>
            </h2>
            <p className="text-xl text-muted-foreground dark:text-gray-300 leading-relaxed">
              Nossa plataforma combina o poder da inteligência artificial com protocolos médicos rigorosos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: "IA Generativa Avançada",
                description: "Utilizamos modelos de última geração para analisar texturas, cores e profundidade com precisão sobre-humana.",
                color: "text-purple-500",
                bg: "bg-purple-50 dark:bg-purple-900/20"
              },
              {
                icon: <Stethoscope className="w-10 h-10" />,
                title: "Protocolos Clínicos",
                description: "Análises baseadas em diretrizes internacionais (TIME, Wagner) para garantir conformidade médica.",
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-900/20"
              },
              {
                icon: <Target className="w-10 h-10" />,
                title: "Precisão Milimétrica",
                description: "Medições automáticas de área e perímetro, reduzindo a subjetividade da avaliação manual.",
                color: "text-green-500",
                bg: "bg-green-50 dark:bg-green-900/20"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-4 rounded-2xl ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-gray-100">{feature.title}</h3>
                <p className="text-muted-foreground dark:text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BenefitsSection />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto rounded-3xl p-4 contrast-overlay">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10K+", label: "Análises Realizadas", icon: <TrendingUp className="w-6 h-6" /> },
                { number: "94%", label: "Precisão Diagnóstica", icon: <Target className="w-6 h-6" /> },
                { number: "1000+", label: "Profissionais Ativos", icon: <Users className="w-6 h-6" /> },
                { number: "24/7", label: "Disponibilidade", icon: <Shield className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="space-y-4">
                  <div className="inline-flex p-3 bg-white/10 rounded-2xl">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold mb-2 text-on-gradient">{stat.number}</div>
                    <div className="font-medium text-on-gradient">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Pronto para <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Revolucionar</span> seu Atendimento?
                </h2>
                <p className="text-xl text-muted-foreground dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  Junte-se a milhares de profissionais que já transformaram sua prática médica com nossa tecnologia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/analise">
                  <Button size="lg" className="bg-gradient-primary text-white font-bold px-8 py-4 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                    <Heart className="w-5 h-5 mr-2" />
                    Começar Agora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300">
                  Falar com Especialista
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 pt-8">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Teste grátis por 30 dias</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Dados 100% seguros</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Certificado médico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary-dark dark:bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold dark:text-gray-100">Casa Fecha Feridas</h3>
              <p className="text-white/80 dark:text-gray-300 leading-relaxed">
                Transformando o futuro da medicina com inteligência artificial avançada.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold dark:text-gray-100">Produto</h4>
              <ul className="space-y-2 text-white/80 dark:text-gray-300">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Análise de Feridas</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Relatórios</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Histórico</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold dark:text-gray-100">Empresa</h4>
              <ul className="space-y-2 text-white/80 dark:text-gray-300">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Imprensa</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold dark:text-gray-100">Suporte</h4>
              <ul className="space-y-2 text-white/80 dark:text-gray-300">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-100 transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 dark:border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-white/70 dark:text-gray-400 text-sm">
                © 2024 Casa Fecha Feridas. Todos os direitos reservados.
              </div>
              <div className="flex space-x-6 text-sm text-white/70 dark:text-gray-400">
                <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
