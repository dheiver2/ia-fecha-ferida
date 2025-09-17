import { CheckCircle, Clock, Shield, Zap, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Clock,
    title: "Rapidez Excepcional",
    description: "Laudos médicos gerados em segundos, não em horas ou dias.",
    color: "text-primary",
    bgColor: "bg-primary/15",
    gradient: "from-primary/20 to-primary-light/20"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados médicos são protegidos com criptografia de ponta.",
    color: "text-accent",
    bgColor: "bg-accent/15",
    gradient: "from-accent/20 to-primary/20"
  },
  {
    icon: Zap,
    title: "Precisão Avançada",
    description: "IA treinada em milhares de imagens médicas para máxima acurácia.",
    color: "text-primary-light",
    bgColor: "bg-primary-light/15",
    gradient: "from-primary-light/20 to-accent/20"
  },
  {
    icon: Users,
    title: "Fácil de Usar",
    description: "Interface intuitiva projetada para profissionais de saúde.",
    color: "text-primary",
    bgColor: "bg-primary/15",
    gradient: "from-primary/20 to-primary-dark/20"
  },
  {
    icon: Award,
    title: "Qualidade Médica",
    description: "Padrões internacionais de qualidade em análise médica.",
    color: "text-accent",
    bgColor: "bg-accent/15",
    gradient: "from-accent/20 to-primary-light/20"
  },
  {
    icon: CheckCircle,
    title: "Disponível 24/7",
    description: "Acesso completo a qualquer hora, em qualquer lugar.",
    color: "text-primary-dark",
    bgColor: "bg-primary-dark/15",
    gradient: "from-primary-dark/20 to-primary/20"
  }
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-foreground">
            Por que escolher a
            <span className="block bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
              Casa Fecha Feridas?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Revolucione seu trabalho médico com tecnologia de ponta que combina velocidade, 
            precisão e segurança em uma única solução inovadora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 hover:border-white/80 hover:bg-white/90"
              >
                <div className="mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className={`h-10 w-10 ${benefit.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/60 max-w-5xl mx-auto relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary-light/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-card-foreground">
                Pronto para transformar sua 
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  prática médica?
                </span>
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Junte-se a centenas de profissionais que já confiam em nossa tecnologia inovadora 
                para análise médica com inteligência artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/analise">
                  <button className="group bg-gradient-to-r from-primary to-accent text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105">
                    <span className="flex items-center justify-center">
                      Começar Gratuitamente
                      <CheckCircle className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    </span>
                  </button>
                </Link>
                <button className="border border-border px-8 py-4 rounded-xl font-semibold hover:bg-muted transition-all">
                  Agendar Demonstração
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;