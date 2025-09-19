import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingState {
  shouldShow: boolean;
  userType: 'medico' | 'paciente' | 'visitante';
  isFirstVisit: boolean;
}

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    shouldShow: false,
    userType: 'visitante',
    isFirstVisit: false
  });

  useEffect(() => {
    const checkOnboardingStatus = () => {
      // Chaves para localStorage
      const ONBOARDING_COMPLETED_KEY = 'casa-fecha-feridas-onboarding-completed';
      const FIRST_VISIT_KEY = 'casa-fecha-feridas-first-visit';
      
      // Verificar se é primeira visita geral
      const hasVisitedBefore = localStorage.getItem(FIRST_VISIT_KEY);
      const isFirstVisit = !hasVisitedBefore;
      
      if (isFirstVisit) {
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
      }

      // Determinar tipo de usuário
      let userType: 'medico' | 'paciente' | 'visitante' = 'visitante';
      
      if (isAuthenticated && user) {
        userType = 'medico'; // Usuários autenticados são médicos
      } else {
        // Verificar se está acessando rota de paciente
        const currentPath = window.location.pathname;
        if (currentPath.includes('/paciente') || currentPath.includes('/consulta/')) {
          userType = 'paciente';
        }
      }

      // Verificar se onboarding já foi completado para este tipo de usuário
      const completedOnboarding = localStorage.getItem(`${ONBOARDING_COMPLETED_KEY}-${userType}`);
      
      // Mostrar onboarding se:
      // 1. É primeira visita E não completou onboarding para este tipo de usuário
      // 2. OU se é um novo tipo de usuário (ex: visitante que virou médico)
      const shouldShow = !completedOnboarding && (isFirstVisit || userType !== 'visitante');

      setOnboardingState({
        shouldShow,
        userType,
        isFirstVisit
      });
    };

    checkOnboardingStatus();
  }, [isAuthenticated, user]);

  const completeOnboarding = () => {
    const ONBOARDING_COMPLETED_KEY = 'casa-fecha-feridas-onboarding-completed';
    localStorage.setItem(`${ONBOARDING_COMPLETED_KEY}-${onboardingState.userType}`, 'true');
    setOnboardingState(prev => ({ ...prev, shouldShow: false }));
  };

  const skipOnboarding = () => {
    completeOnboarding(); // Mesmo comportamento - marcar como completado
  };

  const resetOnboarding = () => {
    const ONBOARDING_COMPLETED_KEY = 'casa-fecha-feridas-onboarding-completed';
    const FIRST_VISIT_KEY = 'casa-fecha-feridas-first-visit';
    
    // Limpar todos os estados de onboarding
    ['medico', 'paciente', 'visitante'].forEach(type => {
      localStorage.removeItem(`${ONBOARDING_COMPLETED_KEY}-${type}`);
    });
    localStorage.removeItem(FIRST_VISIT_KEY);
    
    setOnboardingState({
      shouldShow: true,
      userType: onboardingState.userType,
      isFirstVisit: true
    });
  };

  const forceShowOnboarding = (userType?: 'medico' | 'paciente' | 'visitante') => {
    setOnboardingState({
      shouldShow: true,
      userType: userType || onboardingState.userType,
      isFirstVisit: false
    });
  };

  return {
    ...onboardingState,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    forceShowOnboarding
  };
};