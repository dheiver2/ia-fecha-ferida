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
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 dark:opacity-20 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <div className="space-y-8 sm:space-y-10 animate-in slide-in-from-left duration-700">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-semibold text-sm backdrop-blur-sm border border-primary/20">
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Tecnologia Médica de 4ª Geração
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent drop-shadow-sm">
                      Revolucione
                    </span>
                    <br />
                    <span className="text-foreground dark:text-white">
                      o Cuidado de Feridas
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-300 leading-relaxed max-w-lg">
                    Análise inteligente de feridas com IA avançada. Diagnósticos precisos, 
                    tratamentos personalizados e resultados comprovados clinicamente.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Link to={user ? "/analise" : "/login"} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-white font-bold px-8 py-6 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group text-lg">
                      {user ? "Começar Análise" : "Entrar para Analisar"}
                      <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/simples" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-accent text-accent hover:bg-accent hover:text-white dark:border-accent dark:text-accent-foreground dark:hover:bg-accent dark:hover:text-white font-bold px-8 py-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 group text-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      Videochamada Rápida
                      <Stethoscope className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6 border-t border-border/40 dark:border-gray-700/40">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                           <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      ))}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground dark:text-white">+1000 profissionais</p>
                        <p className="text-xs text-muted-foreground">confiam na VascularOne</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <div className="flex">
                        {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">4.9/5</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-12 lg:mt-0 animate-in slide-in-from-right duration-1000 delay-200">
                <div className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/20 dark:border-gray-700 ring-1 ring-black/5 dark:ring-white/10">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-gradient-to-br from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                    IA Ativa
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground dark:text-gray-100">Análise em Tempo Real</h3>
                            <p className="text-xs text-muted-foreground">Processamento Neural v4.0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Online</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Segmentação da Lesão</span>
                        </div>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">100%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Classificação Tecidual</span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">98.5%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-primary/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                        <div className="flex items-center space-x-3 relative z-10">
                          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Gerando Prognóstico...</span>
                        </div>
                        <span className="text-xs font-bold text-primary relative z-10">Processando</span>
                      </div>
                    </div>

                    <div className="bg-gradient-subtle dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-sm font-semibold text-primary">Precisão do Diagnóstico</div>
                        <div className="text-2xl font-bold text-primary">94%</div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-primary h-3 rounded-full w-[94%] shadow-lg animate-[width_1.5s_ease-out]"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-right">Baseado em 10k+ casos validados</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Bem-vindo à VascularOne
            </h2>
            <p className="text-xl text-muted-foreground dark:text-gray-300 leading-relaxed">
              Tecnologia de ponta para análise médica precisa e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "IA Avançada",
                description: "Algoritmos de deep learning treinados com milhares de casos clínicos",
                color: "from-primary to-accent"
              },
              {
                icon: <Stethoscope className="w-8 h-8" />,
                title: "Análise Médica",
                description: "Avaliação completa seguindo protocolos médicos internacionais",
                color: "from-primary to-accent"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Precisão Clínica",
                description: "Resultados validados por especialistas com 94% de precisão",
                color: "from-primary to-accent"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-medium hover:shadow-strong transition-all duration-300 border border-border/20 dark:border-gray-700 group-hover:border-primary/20">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-gray-100">{feature.title}</h3>
                  <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
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
