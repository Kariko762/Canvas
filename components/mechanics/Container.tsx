import React from 'react';

interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  centerContent?: boolean;
  backgroundColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'view' | 'edit';
}

export default function Container({
  maxWidth = 'xl',
  padding = 'medium',
  centerContent = true,
  backgroundColor = 'transparent',
  borderRadius = 'none',
  mode = 'view'
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12',
    xlarge: 'p-16'
  };

  const borderRadiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  return (
    <div
      className={`
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${borderRadiusClasses[borderRadius]}
        ${centerContent ? 'mx-auto' : ''}
        w-full
      `}
      style={{
        backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor
      }}
    >
      {mode === 'edit' ? (
        <div className="min-h-[100px] border-2 border-dashed border-white/20 rounded flex items-center justify-center text-white/40 text-sm">
          Container wrapper (add content elements inside)
        </div>
      ) : (
        <div className="text-white/40 text-sm text-center py-8">
          Container content area
        </div>
      )}
    </div>
  );
}
