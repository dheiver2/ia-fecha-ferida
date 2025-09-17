import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Heart, Sparkles, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@/assets/logo-fecha-ferida.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "/historico", label: "Histórico", isLink: true }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary/10 shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img 
                src={logoImage} 
                alt="Casa Fecha Feridas" 
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover shadow-strong border-2 border-white group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-accent to-primary-light rounded-full animate-pulse shadow-glow"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
                Casa Fecha Feridas
              </h1>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-primary/60" />
                <p className="text-xs text-primary/70 font-medium">Análise médica com IA</p>
                <Sparkles className="w-3 h-3 text-accent/60" />
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.isLink ? (
                <Link 
                  key={index}
                  to={item.href} 
                  className="relative text-foreground/80 hover:text-primary font-semibold transition-all duration-300 hover:scale-105 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                <a 
                  key={index}
                  href={item.href} 
                  className="relative text-foreground/80 hover:text-primary font-semibold transition-all duration-300 hover:scale-105 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-primary/5 rounded-xl">
                  <User className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                
                <Link to="/analise">
                  <Button className="bg-gradient-primary text-white font-bold px-6 py-2.5 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Começar Análise
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                {/* Botões para usuários não autenticados */}
                <Link to="/login">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-primary text-white font-bold px-6 py-2.5 rounded-2xl shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/10">
            <nav className="flex flex-col space-y-3 pt-4">
              {navItems.map((item, index) => (
                item.isLink ? (
                  <Link 
                    key={index}
                    to={item.href} 
                    className="text-foreground/80 hover:text-primary font-semibold py-2 px-4 rounded-xl hover:bg-primary/5 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a 
                    key={index}
                    href={item.href} 
                    className="text-foreground/80 hover:text-primary font-semibold py-2 px-4 rounded-xl hover:bg-primary/5 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              {user ? (
                <>
                  {/* User Info Mobile */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-primary/5 rounded-xl mt-4">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <Link to="/analise" className="mt-4" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-primary text-white font-bold py-3 rounded-2xl shadow-strong">
                      <Heart className="w-4 h-4 mr-2" />
                      Começar Análise
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  {/* Botões para usuários não autenticados - Mobile */}
                  <div className="space-y-3 mt-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-primary text-white font-bold py-3 rounded-2xl shadow-strong">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;