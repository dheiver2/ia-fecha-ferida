import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Analise from "./pages/Analise";
import Historico from "./pages/Historico";
import { Teleconsulta } from "./pages/Teleconsulta";
import { GuestVideoCall } from "./pages/GuestVideoCall";
import SimpleTelehealth from "./pages/SimpleTelehealth";
import SimpleJoin from "./pages/SimpleJoin";
import PatientEntry from "./pages/PatientEntry";
import QuickJoin from "./pages/QuickJoin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ===== PÁGINA INICIAL ===== */}
              <Route path="/" element={<Index />} />
              
              {/* ===== AUTENTICAÇÃO MÉDICOS ===== */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* ===== ACESSO PACIENTES (PÚBLICO) ===== */}
              {/* Entrada simplificada para pacientes com código */}
              <Route path="/paciente/:codigo" element={<PatientEntry />} />
              {/* Fallback para entrada manual de código */}
              <Route path="/paciente" element={<PatientEntry />} />
              
              {/* ===== TELECONSULTA (UNIFICADA) ===== */}
              {/* Sala de videochamada única - detecta automaticamente se é médico ou paciente */}
              <Route path="/consulta/:roomId" element={<GuestVideoCall />} />
              
              {/* ===== ÁREA MÉDICA (PROTEGIDA) ===== */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Analise />
                </ProtectedRoute>
              } />
              <Route path="/analise" element={
                <ProtectedRoute>
                  <Analise />
                </ProtectedRoute>
              } />
              <Route path="/historico" element={
                <ProtectedRoute>
                  <Historico />
                </ProtectedRoute>
              } />
              <Route path="/teleconsulta" element={
                <ProtectedRoute>
                  <Teleconsulta />
                </ProtectedRoute>
              } />
              
              {/* ===== ROTAS LEGADAS (REDIRECIONAMENTOS) ===== */}
              {/* Mantendo compatibilidade com links antigos */}
              <Route path="/entrar" element={<PatientEntry />} />
              <Route path="/join/:roomId" element={<GuestVideoCall />} />
              <Route path="/call/:roomId" element={<GuestVideoCall />} />
              <Route path="/simple" element={<PatientEntry />} />
              <Route path="/simple/:roomId" element={<GuestVideoCall />} />
              
              {/* ===== PÁGINA 404 ===== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
