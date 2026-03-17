import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface AlertProps {
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  bordered?: boolean;
  icon?: boolean;
  mode?: 'view' | 'edit';
}

export default function Alert({
  message = 'This is an important notification.',
  type = 'info',
  dismissible = true,
  bordered = true,
  icon = true,
  mode = 'view'
}: AlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && mode === 'view') return null;

  const typeConfig = {
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-400',
      Icon: AlertCircle
    },
    success: {
      bg: 'bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-400',
      Icon: CheckCircle
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      Icon: AlertTriangle
    },
    error: {
      bg: 'bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-400',
      Icon: XCircle
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.Icon;

  return (
    <div
      className={`
        ${config.bg}
        ${config.text}
        ${bordered ? `border ${config.border}` : ''}
        rounded-lg p-4 flex items-start gap-3
      `}
    >
      {icon && <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />}
      <div className="flex-1 text-sm leading-relaxed">{message}</div>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
