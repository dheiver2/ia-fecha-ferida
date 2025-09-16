import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Brain, FileText } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Análise Médica 
            <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              Inteligente e Rápida
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transforme imagens médicas em laudos detalhados usando inteligência artificial avançada. 
            Resultados precisos em segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-strong hover:shadow-glow transition-all text-lg px-8 py-4"
            >
              <Upload className="mr-2 h-5 w-5" />
              Enviar Imagem Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4"
            >
              Ver Demonstração
            </Button>
          </div>

          {/* Process Steps Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Upload className="h-8 w-8 text-white mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">1. Upload</h3>
              <p className="text-sm text-white/80">Envie sua imagem médica</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Brain className="h-8 w-8 text-white mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">2. Análise IA</h3>
              <p className="text-sm text-white/80">Processamento inteligente</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <FileText className="h-8 w-8 text-white mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">3. Laudo</h3>
              <p className="text-sm text-white/80">Resultado detalhado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;