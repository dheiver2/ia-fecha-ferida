import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Plataforma Fecha Ferida</h3>
          <p className="text-primary-foreground/80 mb-6">
            Transformando o futuro da medicina com inteligência artificial
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-accent transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-accent transition-colors">Contato</a>
          </div>
          <div className="mt-6 pt-6 border-t border-primary-foreground/20 text-sm text-primary-foreground/60">
            © 2024 Plataforma Fecha Ferida. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
