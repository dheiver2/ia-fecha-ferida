import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Heart, Sparkles, User, LogOut, ChevronDown, Home, Activity, History, Video, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "@/assets/1.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActivePage = (href: string) => {
    return location.pathname === href;
  };

  const publicNavItems = [
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#depoimentos", label: "Depoimentos" }
  ];

  const protectedNavItems = [
    { href: "/analise", label: "Análise IA", isLink: true },
    { href: "/historico", label: "Histórico", isLink: true },
    { href: "/teleconsulta", label: "Teleconsulta", isLink: true },
    { href: "/alertas", label: "Alertas", isLink: true }
  ];

  const navItems = user ? protectedNavItems : publicNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-primary/10 dark:border-gray-700/50 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section - Reorganizado */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="Vascular One" 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-md ring-1 ring-black/5 dark:ring-white/10 drop-shadow-md group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full shadow-sm"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground dark:text-white group-hover:text-primary transition-colors">
                Vascular One
              </h1>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Análise médica com IA
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Otimizada */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Links diretos principais - mais limpo */}
                <Link
                  to="/analise"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage('/analise') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  Análise IA
                </Link>
                <Link
                  to="/historico"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage('/historico') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <History className="h-4 w-4" />
                  Histórico
                </Link>
                <Link
                  to="/teleconsulta"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage('/teleconsulta') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Teleconsulta
                </Link>
                <Link
                  to="/alertas"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage('/alertas') 
                      ? 'text-primary bg-primary/10 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Alertas
                </Link>
              </>
            ) : (
              /* Links para usuários não logados - melhorados */
              publicNavItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  {item.label}
                </a>
              ))
            )}
          </nav>

          {/* Desktop Actions - Reorganizada */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info - Mais compacta */}
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground dark:text-gray-200 leading-tight">{user?.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400 capitalize leading-tight">{user?.role}</p>
                  </div>
                </div>
                
                {/* Botão principal */}
                <Link to="/analise">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group">
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Análise
                  </Button>
                </Link>
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Logout */}
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                {/* Theme Toggle para não logados */}
                <ThemeToggle />
                
                {/* Botões para usuários não autenticados - Mais limpos */}
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 font-medium">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Otimizada */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 sm:mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-1 sm:space-y-2 pt-3 sm:pt-4">
              {user ? (
                <>
                  {/* User Info Mobile - Mais compacta */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground dark:text-gray-200">{user?.name}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  {/* Navegação para usuários logados - Mais limpa */}
                  <Link
                    to="/analise"
                    className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] ${
                      isActivePage('/analise') 
                        ? 'text-primary bg-primary/10 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Activity className="h-5 w-5" />
                    Análise IA
                  </Link>
                  <Link
                    to="/historico"
                    className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] ${
                      isActivePage('/historico') 
                        ? 'text-primary bg-primary/10 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History className="h-5 w-5" />
                    Histórico
                  </Link>
                  <Link
                    to="/teleconsulta"
                    className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] ${
                      isActivePage('/teleconsulta') 
                        ? 'text-primary bg-primary/10 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Video className="h-5 w-5" />
                    Teleconsulta
                  </Link>
                  <Link
                    to="/alertas"
                    className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 min-h-[48px] ${
                      isActivePage('/alertas') 
                        ? 'text-primary bg-primary/10 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Alertas Médicos
                  </Link>
                  
                  {/* Botões de ação mobile */}
                  <div className="pt-3 space-y-2">
                    <Link to="/analise" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Começar Análise
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost" 
                      className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Navegação para usuários não logados - Melhorada */}
                  {publicNavItems.map((item, index) => (
                    <a 
                      key={index}
                      href={item.href} 
                      className="px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  
                  {/* Botões para usuários não autenticados - Mobile */}
                  <div className="space-y-2 pt-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 font-medium">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-sm">
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