import { useState, useCallback } from 'react';

interface NotificationData {
  id: string;
  type: 'invite_sent' | 'invite_accepted' | 'invite_declined' | 'reminder' | 'error' | 'link_generated';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionData?: {
    roomId?: string;
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
    callLink?: string;
  };
}

interface UseNotificationSystemReturn {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  notifyInviteSent: (method: 'email' | 'whatsapp' | 'sms', patientData: {
    name: string;
    contact: string;
    roomId: string;
  }) => void;
  notifyLinkGenerated: (linkData: {
    roomId: string;
    callLink: string;
    patientId?: string;
  }) => void;
  unreadCount: number;
}

export const useNotificationSystem = (): UseNotificationSystemReturn => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Carregar notificações do localStorage na inicialização
  const loadNotifications = useCallback(() => {
    try {
      const stored = localStorage.getItem('teleconsulta_notifications');
      if (stored) {
        const parsed = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, []);

  // Salvar notificações no localStorage
  const saveNotifications = useCallback((newNotifications: NotificationData[]) => {
    try {
      localStorage.setItem('teleconsulta_notifications', JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }, []);

  // Adicionar nova notificação
  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Manter apenas 50 notificações
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Marcar como lida
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Remover notificação
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Notificar convite enviado
  const notifyInviteSent = useCallback((method: 'email' | 'whatsapp' | 'sms', patientData: {
    name: string;
    contact: string;
    roomId: string;
  }) => {
    const methodLabels = {
      email: 'Email',
      whatsapp: 'WhatsApp',
      sms: 'SMS'
    };

    addNotification({
      type: 'invite_sent',
      title: 'Convite Enviado',
      message: `Convite para teleconsulta enviado para ${patientData.name} via ${methodLabels[method]}`,
      actionData: {
        roomId: patientData.roomId,
        patientName: patientData.name,
        [method === 'email' ? 'patientEmail' : 'patientPhone']: patientData.contact
      }
    });
  }, [addNotification]);

  // Notificar link gerado automaticamente
  const notifyLinkGenerated = useCallback((linkData: {
    roomId: string;
    callLink: string;
    patientId?: string;
  }) => {
    addNotification({
      type: 'link_generated',
      title: 'Link da Chamada Gerado',
      message: `Link automático da teleconsulta foi gerado e está pronto para compartilhamento`,
      actionData: {
        roomId: linkData.roomId,
        callLink: linkData.callLink,
        ...(linkData.patientId && { patientName: `Paciente ${linkData.patientId}` })
      }
    });
  }, [addNotification]);

  // Calcular notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    notifyInviteSent,
    notifyLinkGenerated,
    unreadCount
  };
};