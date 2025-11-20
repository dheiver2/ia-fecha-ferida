import React, { ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-emerald-600 dark:text-emerald-400',
        sizeClasses[size],
        className
      )} 
    />
  );
};

// Loading Overlay Component
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  children: ReactNode;
}> = ({ isLoading, message = 'Carregando...', children }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
}> = ({ progress, className, showPercentage = true }) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progresso</span>
        {showPercentage && (
          <span className="text-sm text-slate-500 dark:text-slate-400">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div 
          className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Notification Component
export const Notification: React.FC<{
  type: NotificationType;
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}> = ({ 
  type, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      titleColor: 'text-emerald-800 dark:text-emerald-200',
      messageColor: 'text-emerald-700 dark:text-emerald-300'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-800 dark:text-red-200',
      messageColor: 'text-red-700 dark:text-red-300'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      titleColor: 'text-amber-800 dark:text-amber-200',
      messageColor: 'text-amber-700 dark:text-amber-300'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      titleColor: 'text-blue-800 dark:text-blue-200',
      messageColor: 'text-blue-700 dark:text-blue-300'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 max-w-sm w-full border rounded-lg p-4 shadow-lg z-50 transition-all duration-300 backdrop-blur-sm',
      config.bgColor,
      config.borderColor,
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-semibold', config.titleColor)}>
            {title}
          </h4>
          {message && (
            <p className={cn('text-sm mt-1', config.messageColor)}>
              {message}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(), 300);
            }}
            className={cn(
              'flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
              config.iconColor
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Skeleton Loader Component
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse',
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

// Button with Loading State
export const LoadingButton: React.FC<{
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  isLoading, 
  children, 
  loadingText = 'Carregando...', 
  className,
  onClick,
  disabled,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
        'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20',
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" className="text-white" />}
      {isLoading ? loadingText : children}
    </button>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{
  status: 'online' | 'offline' | 'busy' | 'away';
  showText?: boolean;
  className?: string;
}> = ({ status, showText = false, className }) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      text: 'Online',
      textColor: 'text-green-700'
    },
    offline: {
      color: 'bg-gray-400',
      text: 'Offline',
      textColor: 'text-gray-700'
    },
    busy: {
      color: 'bg-red-500',
      text: 'Ocupado',
      textColor: 'text-red-700'
    },
    away: {
      color: 'bg-yellow-500',
      text: 'Ausente',
      textColor: 'text-yellow-700'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-2 h-2 rounded-full', config.color)} />
      {showText && (
        <span className={cn('text-xs font-medium', config.textColor)}>
          {config.text}
        </span>
      )}
    </div>
  );
};