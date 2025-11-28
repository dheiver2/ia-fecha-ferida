import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Activity, Users, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-24 pb-32">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-400/20 blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] opacity-30 animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-[20%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[100px] opacity-20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium backdrop-blur-sm shadow-sm mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Nova Tecnologia de IA Vascular
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Diagnóstico Vascular <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 animate-gradient-x">
                Inteligente & Preciso
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Revolucione o atendimento vascular com nossa plataforma integrada. 
              Análise de feridas por IA, telemedicina avançada e gestão completa 
              do paciente em um único lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link to="/analise" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 h-14 px-8 text-lg rounded-xl transition-all hover:scale-105 hover:shadow-emerald-500/50 w-full"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 h-14 px-8 text-lg rounded-xl backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 w-full sm:w-auto hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
              >
                <Play className="mr-2 w-5 h-5 fill-current" />
                Ver Demonstração
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-medium">99.9% Precisão</span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">+10k Médicos</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
            <div className="relative z-10 bg-white/40 dark:bg-slate-900/40 rounded-2xl shadow-2xl shadow-emerald-900/20 dark:shadow-black/50 border border-white/20 dark:border-slate-700/30 p-3 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-2xl" />
              <img 
                src="/dashboard-preview.png" 
                alt="Dashboard Preview" 
                className="relative rounded-xl w-full h-auto shadow-inner bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/800x500/f1f5f9/1e293b?text=Vascular+One+Dashboard";
                }}
              />
              
              {/* Floating Cards */}
              <div className="absolute -left-4 sm:-left-8 top-10 bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce [animation-duration:3000ms] backdrop-blur-md max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Análise IA</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Alta Precisão</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 sm:-right-8 bottom-20 bg-white/90 dark:bg-slate-800/90 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce [animation-duration:4000ms] backdrop-blur-md max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pacientes</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">+1,234 Ativos</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur-3xl opacity-20 -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
