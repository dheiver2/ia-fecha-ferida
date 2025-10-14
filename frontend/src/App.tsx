import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import SimplePeerVideoCall from './features/peerVideoCall';
import AlertasMedicos from "./pages/AlertasMedicos";
import Analise from "./pages/Analise";
import { GuestVideoCall } from "./pages/GuestVideoCall";
import Historico from "./pages/Historico";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { PatientEntry } from "./pages/PatientEntry";
import Register from "./pages/Register";
import { Teleconsulta } from "./pages/Teleconsulta";

const queryClient = new QueryClient();

const App = () => {
	return (
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
 
								{/* ===== VIDEOCHAMADA COM SIMPLE-PEER ===== */}
								<Route path="/video" element={<SimplePeerVideoCall userType="doctor" />} />
								<Route path="/video/:roomId" element={<SimplePeerVideoCall userType="patient" />} />
								<Route path="/medico/:roomId" element={<SimplePeerVideoCall userType="doctor" />} />
								<Route path="/paciente/:roomId" element={<SimplePeerVideoCall userType="patient" />} />

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
								<Route path="/guest/:roomId" element={<GuestVideoCall />} />
								{/* Rota específica para guest/sala-* */}
								<Route path="/guest/sala-:roomId" element={<GuestVideoCall />} />

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
								<Route path="/alertas" element={
									<ProtectedRoute>
										<AlertasMedicos />
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
};

export default App;
