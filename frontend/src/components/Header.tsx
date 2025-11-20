import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Heart, Sparkles, User, LogOut, ChevronDown, Home, Activity, History, Video, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { href: "/analise", label: "Análise IA", isLink: true, icon: Activity },
    { href: "/historico", label: "Histórico", isLink: true, icon: History },
    { href: "/teleconsulta", label: "Teleconsulta", isLink: true, icon: Video },
    { href: "/alertas", label: "Alertas", isLink: true, icon: AlertTriangle }
  ];

  const navItems = user ? protectedNavItems : publicNavItems;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section - Reorganizado */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={logoImage} 
                alt="VascularOne" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-sm border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                VascularOne
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Inteligência Médica
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Otimizada */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            {user ? (
              <>
                {protectedNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActivePage(item.href) 
                        ? 'text-primary bg-white dark:bg-gray-900 shadow-sm scale-105' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              /* Links para usuários não logados - melhorados */
              publicNavItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  {item.label}
                </a>
              ))
            )}
          </nav>

          {/* Desktop Actions - Reorganizada */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 py-1 h-auto hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mt-1">{user?.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-2 py-1.5 mb-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Minhas Análises</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/analise">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group">
                    <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Nova Análise
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 font-medium rounded-full px-6">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    Começar Agora
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
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Otimizada */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-xl animate-in slide-in-from-top-5 duration-300">
            <div className="container mx-auto px-4 py-6 space-y-6">
              {user ? (
                <>
                  {/* User Info Mobile */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white shadow-md">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  {/* Navegação */}
                  <nav className="space-y-2">
                    {protectedNavItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-200 ${
                            isActivePage(item.href) 
                                ? 'text-primary bg-primary/10 shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.icon && <item.icon className="h-5 w-5" />}
                            {item.label}
                        </Link>
                    ))}
                  </nav>
                  
                  {/* Ações */}
                  <div className="space-y-3 pt-2">
                    <Link to="/analise" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-primary/20">
                        <Heart className="w-5 h-5 mr-2" />
                        Nova Análise
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 py-6 rounded-xl"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sair da Conta
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <nav className="space-y-2">
                    {publicNavItems.map((item, index) => (
                        <a 
                        key={index}
                        href={item.href} 
                        className="block p-4 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                        >
                        {item.label}
                        </a>
                    ))}
                  </nav>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full py-6 rounded-xl font-semibold">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-primary/20">
                        Criar Conta Grátis
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
