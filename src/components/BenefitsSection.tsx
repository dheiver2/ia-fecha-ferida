import { CheckCircle, Clock, Shield, Zap, Users, Award } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Rapidez Excepcional",
    description: "Laudos médicos gerados em segundos, não em horas ou dias.",
    color: "text-medical-info"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados médicos são protegidos com criptografia de ponta.",
    color: "text-medical-success"
  },
  {
    icon: Zap,
    title: "Precisão Avançada",
    description: "IA treinada em milhares de imagens médicas para máxima acurácia.",
    color: "text-medical-warning"
  },
  {
    icon: Users,
    title: "Fácil de Usar",
    description: "Interface intuitiva projetada para profissionais de saúde.",
    color: "text-primary"
  },
  {
    icon: Award,
    title: "Qualidade Médica",
    description: "Padrões internacionais de qualidade em análise médica.",
    color: "text-accent"
  },
  {
    icon: CheckCircle,
    title: "Disponível 24/7",
    description: "Acesso completo a qualquer hora, em qualquer lugar.",
    color: "text-medical-neutral"
  }
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Por que escolher nossa 
            <span className="text-primary"> plataforma?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolucione seu trabalho médico com tecnologia de ponta que combina velocidade, 
            precisão e segurança em uma única solução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <IconComponent className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card rounded-3xl p-8 shadow-medium border border-border/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-card-foreground">
              Pronto para transformar sua prática médica?
            </h3>
            <p className="text-muted-foreground mb-6">
              Junte-se a centenas de profissionais que já confiam em nossa tecnologia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold shadow-medium hover:shadow-strong transition-all">
                Começar Gratuitamente
              </button>
              <button className="border border-border px-8 py-4 rounded-xl font-semibold hover:bg-muted transition-all">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;