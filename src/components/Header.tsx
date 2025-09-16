import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo-fecha-ferida.jpg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={logoImage} 
            alt="Plataforma Fecha Ferida" 
            className="w-12 h-12 rounded-full object-cover shadow-soft"
          />
          <div>
            <h1 className="text-xl font-bold text-primary">Plataforma Fecha Ferida</h1>
            <p className="text-sm text-muted-foreground">Análise médica com IA</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors">
            Como Funciona
          </a>
          <a href="#beneficios" className="text-foreground hover:text-primary transition-colors">
            Benefícios
          </a>
          <a href="#depoimentos" className="text-foreground hover:text-primary transition-colors">
            Depoimentos
          </a>
        </nav>

        <Button variant="default" className="bg-gradient-primary shadow-medium hover:shadow-strong transition-all">
          Começar Análise
        </Button>
      </div>
    </header>
  );
};

export default Header;