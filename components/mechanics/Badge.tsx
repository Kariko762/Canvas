import React from 'react';

interface BadgeProps {
  text?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  outlined?: boolean;
  customColor?: string;
  mode?: 'view' | 'edit';
}

export default function Badge({
  text = 'New',
  variant = 'default',
  size = 'medium',
  outlined = false,
  customColor = '',
  mode = 'view'
}: BadgeProps) {
  const variantStyles = {
    default: {
      bg: 'bg-zinc-700',
      text: 'text-white',
      border: 'border-zinc-600'
    },
    primary: {
      bg: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-500'
    },
    success: {
      bg: 'bg-green-600',
      text: 'text-white',
      border: 'border-green-500'
    },
    warning: {
      bg: 'bg-yellow-600',
      text: 'text-white',
      border: 'border-yellow-500'
    },
    error: {
      bg: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-500'
    },
    info: {
      bg: 'bg-cyan-600',
      text: 'text-white',
      border: 'border-cyan-500'
    }
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-1.5'
  };

  const styles = variantStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        ${sizeClasses[size]}
        ${outlined ? `bg-transparent border-2 ${styles.border} ${styles.text}` : `${styles.bg} ${styles.text}`}
      `}
      style={customColor && !outlined ? { backgroundColor: customColor } : customColor && outlined ? { borderColor: customColor, color: customColor } : undefined}
    >
      {text}
    </span>
  );
}
