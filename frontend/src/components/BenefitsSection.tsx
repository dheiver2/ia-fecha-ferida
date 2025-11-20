import { CheckCircle, Clock, Shield, Zap, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Clock,
    title: "Rapidez Excepcional",
    description: "Laudos médicos gerados em segundos, não em horas ou dias.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados médicos são protegidos com criptografia de ponta.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    icon: Zap,
    title: "Precisão Avançada",
    description: "IA treinada em milhares de imagens médicas para máxima acurácia.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradient: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: Users,
    title: "Fácil de Usar",
    description: "Interface intuitiva projetada para profissionais de saúde.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: Award,
    title: "Qualidade Médica",
    description: "Padrões internacionais de qualidade em análise médica.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradient: "from-rose-500/20 to-red-500/20"
  },
  {
    icon: CheckCircle,
    title: "Disponível 24/7",
    description: "Acesso completo a qualquer hora, em qualquer lugar.",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    gradient: "from-cyan-500/20 to-sky-500/20"
  }
];

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-slate-900 dark:text-white tracking-tight">
            Por que escolher a
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
              Vascular One?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
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
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 border border-white/50 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30"
              >
                <div className="mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner ring-1 ring-white/50 dark:ring-white/10`}>
                    <IconComponent className={`h-10 w-10 ${benefit.color} group-hover:scale-110 transition-transform drop-shadow-sm`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl shadow-emerald-500/10 border border-white/60 dark:border-slate-800 max-w-5xl mx-auto relative overflow-hidden group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-blue-500/5 rounded-3xl group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 dark:text-white">
                Pronto para transformar sua 
                <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  prática médica?
                </span>
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Junte-se a centenas de profissionais que já confiam em nossa tecnologia inovadora 
                para análise médica com inteligência artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/analise">
                  <button className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 text-lg hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      Começar Gratuitamente
                      <CheckCircle className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    </span>
                  </button>
                </Link>
                <button className="px-8 py-5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 hover:scale-105">
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