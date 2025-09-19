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
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Tecnologia Médica Avançada
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
                      Revolucione
                    </span>
                    <br />
                    <span className="text-foreground">
                      o Cuidado de Feridas
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-300 leading-relaxed max-w-lg">
                    Análise inteligente de feridas com IA avançada. Diagnósticos precisos, 
                    tratamentos personalizados e resultados comprovados.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link to={user ? "/analise" : "/login"} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group min-h-[48px]">
                      {user ? "Começar Análise" : "Entrar para Analisar"}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/simples" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group min-h-[48px]">
                      Videochamada Rápida
                      <Stethoscope className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 min-h-[48px]">
                    Ver Demonstração
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">+1000 profissionais</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground font-medium ml-2">4.9/5</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-8 lg:mt-0">
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-strong p-4 sm:p-6 lg:p-8 border border-border/20 dark:border-gray-700">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-foreground dark:text-gray-100">Análise em Tempo Real</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Imagem processada</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">IA analisando padrões</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-muted-foreground dark:text-gray-300">Gerando relatório...</span>
                      </div>
                    </div>

                    <div className="bg-gradient-subtle dark:bg-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="text-xs sm:text-sm font-semibold text-primary mb-2">Precisão do Diagnóstico</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-gradient-primary h-2 rounded-full w-[94%] transition-all duration-1000"></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-primary">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-accent to-primary-light rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full opacity-30 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Como Funciona
              </span>
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
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Stethoscope className="w-8 h-8" />,
                title: "Análise Médica",
                description: "Avaliação completa seguindo protocolos médicos internacionais",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Precisão Clínica",
                description: "Resultados validados por especialistas com 94% de precisão",
                color: "from-purple-500 to-purple-600"
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
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
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
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-white/80 font-medium">{stat.label}</div>
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
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Teste grátis por 30 dias</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Dados 100% seguros</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                  <Award className="w-4 h-4 text-purple-500" />
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
