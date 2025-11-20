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
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="mx-auto max-w-7xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-lg shadow-slate-200/20 dark:shadow-black/20 rounded-2xl transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-slate-900/90">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section - Reorganizado */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                <img 
                  src={logoImage} 
                  alt="Vascular One" 
                  className="relative w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all duration-300">
                  Vascular One
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  AI Medical Analysis
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation - Otimizada */}
            <nav className="hidden md:flex items-center space-x-1">
              {user ? (
                <>
                  {/* Links diretos principais - mais limpo */}
                  <Link
                    to="/analise"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActivePage('/analise') 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    }`}
                  >
                    <Activity className="h-4 w-4" />
                    Análise IA
                  </Link>
                  <Link
                    to="/historico"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActivePage('/historico') 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    Histórico
                  </Link>
                  <Link
                    to="/teleconsulta"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActivePage('/teleconsulta') 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    Teleconsulta
                  </Link>
                  <Link
                    to="/alertas"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActivePage('/alertas') 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
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
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all duration-200"
                  >
                    {item.label}
                  </a>
                ))
              )}
            </nav>
  
            {/* Desktop Actions - Reorganizada */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  {/* User Info - Mais compacta */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 leading-none">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-800">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Theme Toggle */}
                  <ThemeToggle />
                  
                  {/* Logout */}
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    size="icon"
                    className="rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  {/* Theme Toggle para não logados */}
                  <ThemeToggle />
                  
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                  {/* Botões para usuários não autenticados - Mais limpos */}
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 font-medium rounded-xl">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium px-5 py-2 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-0.5">
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
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
  
          {/* Mobile Navigation - Otimizada */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-accordion-down">
              <nav className="flex flex-col space-y-2">
                {user ? (
                  <>
                    {/* User Info Mobile - Mais compacta */}
                    <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-200">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    
                    {/* Navegação para usuários logados - Mais limpa */}
                    <Link
                      to="/analise"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActivePage('/analise') 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Activity className="h-5 w-5" />
                      Análise IA
                    </Link>
                    <Link
                      to="/historico"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActivePage('/historico') 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <History className="h-5 w-5" />
                      Histórico
                    </Link>
                    <Link
                      to="/teleconsulta"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActivePage('/teleconsulta') 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Video className="h-5 w-5" />
                      Teleconsulta
                    </Link>
                    <Link
                      to="/alertas"
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActivePage('/alertas') 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      Alertas Médicos
                    </Link>
                    
                    {/* Botões de ação mobile */}
                    <div className="pt-4 space-y-3">
                      <Link to="/analise" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/20">
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
                        className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 rounded-xl"
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
                        className="px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                    
                    {/* Botões para usuários não autenticados - Mobile */}
                    <div className="space-y-3 pt-4">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 font-medium rounded-xl">
                          Entrar
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/20">
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
      </div>
    </header>
  );
};

export default Header;