import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'invite_sent' | 'invite_accepted' | 'invite_declined' | 'reminder' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionData?: {
    roomId?: string;
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
  };
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Carregar notificações do localStorage
    loadNotifications();
    
    // Simular algumas notificações de exemplo
    if (notifications.length === 0) {
      addSampleNotifications();
    }
  }, []);

  useEffect(() => {
    // Atualizar contador de não lidas
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = () => {
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
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    try {
      localStorage.setItem('teleconsulta_notifications', JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    const updated = [newNotification, ...notifications].slice(0, 50); // Manter apenas 50 notificações
    saveNotifications(updated);
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const removeNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
  };

  const addSampleNotifications = () => {
    const samples: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        type: 'invite_sent',
        title: 'Convite Enviado',
        message: 'Convite para teleconsulta enviado para Maria Silva via WhatsApp',
        actionData: {
          roomId: 'room_123',
          patientName: 'Maria Silva',
          patientPhone: '(11) 99999-9999'
        }
      },
      {
        type: 'reminder',
        title: 'Consulta em 15 minutos',
        message: 'Teleconsulta com João Santos às 14:30',
        actionData: {
          roomId: 'room_456',
          patientName: 'João Santos'
        }
      }
    ];

    samples.forEach(sample => addNotification(sample));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'invite_sent':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'invite_accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invite_declined':
        return <X className="w-4 h-4 text-red-500" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'invite_sent':
        return 'border-l-blue-500 bg-blue-50';
      case 'invite_accepted':
        return 'border-l-green-500 bg-green-50';
      case 'invite_declined':
        return 'border-l-red-500 bg-red-50';
      case 'reminder':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Função para ser chamada quando um convite é enviado
  const notifyInviteSent = (method: 'email' | 'whatsapp' | 'sms', patientData: {
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
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notificações</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-6 px-2"
                >
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className={`text-xs mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {format(notification.timestamp, "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </p>

                      {/* Ações específicas */}
                      {notification.actionData && (
                        <div className="flex gap-1 mt-2">
                          {notification.actionData.patientPhone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://wa.me/${notification.actionData?.patientPhone?.replace(/\D/g, '')}`, '_blank');
                              }}
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              WhatsApp
                            </Button>
                          )}
                          {notification.actionData.patientEmail && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${notification.actionData?.patientEmail}`, '_blank');
                              }}
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para usar o sistema de notificações
export const useNotifications = () => {
  const [notificationSystem, setNotificationSystem] = useState<{
    notifyInviteSent: (method: 'email' | 'whatsapp' | 'sms', patientData: {
      name: string;
      contact: string;
      roomId: string;
    }) => void;
  } | null>(null);

  return {
    notificationSystem,
    setNotificationSystem
  };
};