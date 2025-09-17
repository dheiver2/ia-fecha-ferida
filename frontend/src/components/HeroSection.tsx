import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Brain, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 bg-gradient-hero overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-60"></div>
      
      {/* Floating Orbs - Casa Fecha Feridas Theme */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-light/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Geometric Patterns */}
      <div className="absolute top-32 right-20 w-32 h-32 border border-white/20 rounded-lg rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 border border-accent/30 rounded-full animate-bounce-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Modern Typography with Casa Fecha Feridas Branding */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
              <span className="text-white drop-shadow-2xl [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)] block">
                Casa Fecha Feridas
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-6 text-white drop-shadow-2xl [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)] font-bold">
                Análise Médica Inteligente
              </span>
            </h1>
          </div>
          
          <div className="mb-14">
            <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-white drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_60%)] font-medium">
              Transforme imagens médicas em laudos detalhados usando inteligência artificial avançada.
            </p>
            <p className="text-lg md:text-xl lg:text-2xl mt-4 text-white font-bold drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_60%)]">
              Resultados precisos em segundos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
            <Link to="/analise" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto bg-white/95 text-primary hover:bg-white shadow-2xl hover:shadow-glow transition-all duration-300 text-lg px-12 py-6 font-bold rounded-2xl backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                <Upload className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Enviar Imagem Agora
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group w-full sm:w-auto border-2 border-white/70 text-white hover:bg-white/15 backdrop-blur-md text-lg px-12 py-6 font-semibold transition-all duration-300 rounded-2xl hover:border-white hover:scale-105"
            >
              <Brain className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Ver Demonstração
            </Button>
          </div>

          {/* Modern Process Steps with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto mt-8">
            <div className="group bg-white/20 backdrop-blur-lg rounded-3xl p-8 lg:p-10 border border-white/40 hover:border-white/60 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl">
              <div className="bg-primary/30 rounded-2xl p-5 w-fit mx-auto mb-8 group-hover:bg-primary/40 transition-colors">
                <Upload className="h-12 w-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">1. Upload Seguro</h3>
              <p className="text-white drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_60%)] leading-relaxed text-base lg:text-lg">Envie sua imagem médica com total segurança e privacidade</p>
            </div>
            
            <div className="group bg-white/20 backdrop-blur-lg rounded-3xl p-8 lg:p-10 border border-white/40 hover:border-white/60 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl">
              <div className="bg-accent/30 rounded-2xl p-5 w-fit mx-auto mb-8 group-hover:bg-accent/40 transition-colors">
                <Brain className="h-12 w-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">2. IA Avançada</h3>
              <p className="text-white drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_60%)] leading-relaxed text-base lg:text-lg">Processamento inteligente com algoritmos de última geração</p>
            </div>
            
            <div className="group bg-white/20 backdrop-blur-lg rounded-3xl p-8 lg:p-10 border border-white/40 hover:border-white/60 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl">
              <div className="bg-primary-light/30 rounded-2xl p-5 w-fit mx-auto mb-8 group-hover:bg-primary-light/40 transition-colors">
                <FileText className="h-12 w-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">3. Laudo Completo</h3>
              <p className="text-white drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_60%)] leading-relaxed text-base lg:text-lg">Resultado detalhado e profissional em segundos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;