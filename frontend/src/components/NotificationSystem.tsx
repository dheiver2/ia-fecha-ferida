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
  Phone,
  Trash2
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
        return <Mail className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'invite_accepted':
        return <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'invite_declined':
        return <X className="w-4 h-4 text-red-500 dark:text-red-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getNotificationStyles = (type: Notification['type'], read: boolean) => {
    const baseStyles = "p-4 border-b border-slate-100 dark:border-slate-800 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer relative group";
    const readStyles = read ? "bg-white dark:bg-slate-900 opacity-70" : "bg-blue-50/30 dark:bg-blue-900/10";
    
    return `${baseStyles} ${readStyles}`;
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
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
      </Button>

      {/* Painel de Notificações */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notificações</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0 h-5">
                    {unreadCount} novas
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7 px-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-[calc(100vh-200px)] sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-3">
                    <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium">Nenhuma notificação</p>
                  <p className="text-xs mt-1 opacity-70">Você está em dia com tudo!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={getNotificationStyles(notification.type, notification.read)}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-1 p-2 rounded-full ${
                        !notification.read 
                          ? 'bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                          : 'bg-slate-100 dark:bg-slate-800/50'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {format(notification.timestamp, "HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        
                        <p className={`text-xs leading-relaxed ${!notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                          {notification.message}
                        </p>

                        {/* Ações específicas */}
                        {notification.actionData && (
                          <div className="flex gap-2 mt-3">
                            {notification.actionData.patientPhone && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://wa.me/${notification.actionData?.patientPhone?.replace(/\D/g, '')}`, '_blank');
                                }}
                              >
                                <MessageSquare className="w-3 h-3 mr-1.5" />
                                WhatsApp
                              </Button>
                            )}
                            {notification.actionData.patientEmail && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${notification.actionData?.patientEmail}`, '_blank');
                                }}
                              >
                                <Mail className="w-3 h-3 mr-1.5" />
                                Email
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remover notificação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400 rounded-l"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 w-full h-8"
                  onClick={() => setNotifications([])}
                >
                  Limpar todas as notificações
                </Button>
              </div>
            )}
          </div>
        </>
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